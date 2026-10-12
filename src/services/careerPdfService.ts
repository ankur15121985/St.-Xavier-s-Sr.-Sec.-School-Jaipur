import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { CareerApplication } from '../types';

interface ProcessedImage {
  dataUrl: string;
  format: 'JPEG' | 'PNG';
  width: number;
  height: number;
  aspectRatio: number;
}

/**
 * Loads and processes an applicant photo URL into a pristine base64 Data URL
 * suitable for jsPDF. Handles CORS, Supabase CDN, local uploads, PNG/JPEG/WEBP conversion,
 * and extracts natural dimensions to prevent aspect ratio distortion.
 */
export async function loadApplicantPhoto(url?: string): Promise<ProcessedImage | null> {
  if (!url || typeof url !== 'string' || !url.trim()) return null;
  const cleanUrl = url.trim();

  // Helper to convert blob to data URL
  const blobToDataUrl = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  // Helper to process an HTML Image into a canvas and extract clean JPEG/PNG data URL
  const processImageElement = (img: HTMLImageElement): ProcessedImage => {
    const width = img.naturalWidth || img.width || 300;
    const height = img.naturalHeight || img.height || 400;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas 2D context unavailable');
    
    // Draw white background in case of transparent PNG
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, width, height);
    ctx.drawImage(img, 0, 0, width, height);
    
    const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
    return {
      dataUrl,
      format: 'JPEG',
      width,
      height,
      aspectRatio: width / height
    };
  };

  // Helper to load image element from data URL
  const loadImageFromDataUrl = (dataUrl: string): Promise<ProcessedImage> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        try {
          const processed = processImageElement(img);
          resolve(processed);
        } catch (e) {
          reject(e);
        }
      };
      img.onerror = () => reject(new Error('Failed to render image from data URL'));
      img.src = dataUrl;
    });
  };

  // 1. If already a data URL
  if (cleanUrl.startsWith('data:image/')) {
    try {
      return await loadImageFromDataUrl(cleanUrl);
    } catch (e) {
      console.warn('[PDF Image] Failed parsing direct data URL:', e);
    }
  }

  // 2. Try fetching blob directly, then fallback to local proxy /api/img
  const candidateUrls = [
    cleanUrl,
    `/api/img?url=${encodeURIComponent(cleanUrl)}`
  ];

  for (const fetchUrl of candidateUrls) {
    try {
      const res = await fetch(fetchUrl, { mode: 'cors' });
      if (res.ok) {
        const blob = await res.blob();
        if (blob && blob.size > 0 && blob.type.startsWith('image/')) {
          const rawDataUrl = await blobToDataUrl(blob);
          const processed = await loadImageFromDataUrl(rawDataUrl);
          return processed;
        }
      }
    } catch (err) {
      // Continue to next fallback
    }
  }

  // 3. Last fallback: direct Image loading with crossOrigin
  try {
    const processed = await new Promise<ProcessedImage>((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      const timer = setTimeout(() => {
        img.src = '';
        reject(new Error('Image load timed out'));
      }, 5000);

      img.onload = () => {
        clearTimeout(timer);
        try {
          resolve(processImageElement(img));
        } catch (err) {
          reject(err);
        }
      };

      img.onerror = () => {
        clearTimeout(timer);
        reject(new Error('Image failed to load in DOM'));
      };

      // Try proxy url for DOM Image to avoid browser cache CORS bugs
      img.src = `/api/img?url=${encodeURIComponent(cleanUrl)}`;
    });
    return processed;
  } catch (err) {
    console.warn('[PDF Image] Could not load candidate photo:', err);
    return null;
  }
}

/**
 * Generates an official, publication-quality A4 PDF dossier for a career application.
 * Ensures applicant photo is loaded, formatted, and displayed with proper aspect ratio
 * and without overlapping any form text fields.
 */
export async function generateCareerApplicationPDF(app: CareerApplication): Promise<jsPDF> {
  const doc = new jsPDF('p', 'pt', 'a4');
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const marginX = 40;

  // Header Banner
  doc.setFillColor(15, 23, 42); // #0F172A (school-navy)
  doc.rect(0, 0, pageWidth, 75, 'F');
  
  // Gold accent line under header
  doc.setFillColor(226, 180, 80); // #E2B450 (school-gold)
  doc.rect(0, 75, pageWidth, 3, 'F');

  // School Crest / Title
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text("ST. XAVIER'S SENIOR SECONDARY SCHOOL", marginX, 36);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(226, 180, 80);
  doc.text("CAREER RECRUITMENT CELL • OFFICIAL APPLICANT DOSSIER", marginX, 52);

  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184); // Slate 400
  doc.text("Bhagwan Das Road, C-Scheme, Jaipur - 302001, Rajasthan • Estd. 1941", marginX, 65);

  // Application Reference Pill (top right)
  const appNo = app.application_no || 'STXJ-PENDING';
  doc.setFillColor(30, 41, 59);
  doc.roundedRect(pageWidth - marginX - 140, 22, 140, 28, 4, 4, 'F');
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(226, 180, 80);
  doc.text("APPLICATION NUMBER", pageWidth - marginX - 130, 34);
  doc.setFontSize(10);
  doc.setTextColor(255, 255, 255);
  doc.text(appNo, pageWidth - marginX - 130, 46);

  // Helper to draw section titles
  const drawSectionHeader = (title: string, y: number): number => {
    doc.setFillColor(248, 250, 252); // Slate 50
    doc.rect(marginX, y, pageWidth - 2 * marginX, 22, 'F');
    doc.setFillColor(15, 23, 42);
    doc.rect(marginX, y, 4, 22, 'F'); // Left accent bar
    
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(title, marginX + 12, y + 15);
    
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(1);
    doc.line(marginX, y + 22, pageWidth - marginX, y + 22);
    return y + 36;
  };

  // Helper to render form fields with crisp typography
  const drawField = (label: string, value: any, x: number, y: number, width: number): number => {
    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(100, 116, 139); // Slate 500
    doc.text(label.toUpperCase(), x, y);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(15, 23, 42); // Slate 900
    const strVal = String(value || 'N/A').trim() || 'N/A';
    const splitLines = doc.splitTextToSize(strVal, width - 8);
    doc.text(splitLines, x, y + 12);

    return (splitLines.length * 10) + 16;
  };

  // ==========================================
  // SECTION 1: PERSONAL CREDENTIALS & PHOTO
  // ==========================================
  let currentY = drawSectionHeader("1. CANDIDATE IDENTITY & PERSONAL PROFILE", 92);

  // Dedicated Passport Photo Dimensions
  // Standard passport photo is ~ 35mm x 45mm ratio (~ 0.778)
  const photoBoxWidth = 100;
  const photoBoxHeight = 125;
  const photoX = pageWidth - marginX - photoBoxWidth; // 595 - 40 - 100 = 455
  const photoY = currentY;

  // Personal Fields Area (strictly left of the photo to avoid ANY overlap)
  const personalAreaWidth = photoX - marginX - 16; // ~ 399 pt
  const pColWidth = personalAreaWidth / 2; // ~ 199.5 pt

  // Load applicant photo with multi-tier fallback
  let loadedPhoto: ProcessedImage | null = null;
  if (app.photo_url) {
    try {
      loadedPhoto = await loadApplicantPhoto(app.photo_url);
    } catch (e) {
      console.warn('[PDF] Photo loading exception:', e);
    }
  }

  // Draw Photo Frame Background
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(15, 23, 42);
  doc.setLineWidth(1);
  doc.rect(photoX, photoY, photoBoxWidth, photoBoxHeight, 'FD');

  if (loadedPhoto) {
    try {
      // Calculate aspect-ratio fitted dimensions inside photo box with 3pt padding
      const maxW = photoBoxWidth - 6;
      const maxH = photoBoxHeight - 6;
      let renderW = maxW;
      let renderH = renderW / loadedPhoto.aspectRatio;

      if (renderH > maxH) {
        renderH = maxH;
        renderW = renderH * loadedPhoto.aspectRatio;
      }

      // Center the photo within the box
      const drawX = photoX + (photoBoxWidth - renderW) / 2;
      const drawY = photoY + (photoBoxHeight - renderH) / 2;

      doc.addImage(loadedPhoto.dataUrl, loadedPhoto.format, drawX, drawY, renderW, renderH);

      // Inner subtle border around photo
      doc.setDrawColor(203, 213, 225);
      doc.setLineWidth(0.5);
      doc.rect(drawX, drawY, renderW, renderH);
    } catch (imgErr) {
      console.error('[PDF] Error rendering image into jsPDF:', imgErr);
      drawPhotoPlaceholder(doc, photoX, photoY, photoBoxWidth, photoBoxHeight, 'Render Error');
    }
  } else {
    drawPhotoPlaceholder(doc, photoX, photoY, photoBoxWidth, photoBoxHeight, app.photo_url ? 'Photo Unavailable' : 'No Photo Uploaded');
  }

  // Photo Label below the photo frame
  doc.setFontSize(6.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(100, 116, 139);
  doc.text("PASSPORT PHOTOGRAPH", photoX + (photoBoxWidth / 2), photoY + photoBoxHeight + 10, { align: 'center' });

  // Render Personal details to the left of the photo frame
  let rowY = currentY;

  // Row 1
  const r1 = Math.max(
    drawField("Full Name", app.full_name, marginX, rowY, pColWidth),
    drawField("Gender", app.gender, marginX + pColWidth, rowY, pColWidth)
  );
  rowY += r1;

  // Row 2
  const r2 = Math.max(
    drawField("Parent / Spouse Name", app.parent_spouse_name, marginX, rowY, pColWidth),
    drawField("Date of Birth", app.dob, marginX + pColWidth, rowY, pColWidth)
  );
  rowY += r2;

  // Row 3
  const r3 = Math.max(
    drawField("Email Address", app.email, marginX, rowY, pColWidth),
    drawField("Mobile Number", app.mobile_number, marginX + pColWidth, rowY, pColWidth)
  );
  rowY += r3;

  // Row 4
  const r4 = Math.max(
    drawField("Aadhar Card Number", app.aadhar_number, marginX, rowY, pColWidth),
    drawField("Application Status", app.status || 'Received', marginX + pColWidth, rowY, pColWidth)
  );
  rowY += r4;

  // Row 5
  const r5 = Math.max(
    drawField("Submission Date", app.created_at ? new Date(app.created_at).toLocaleDateString() : 'Active Session', marginX, rowY, pColWidth),
    drawField("Audit Security IP", app.user_ip || 'Institutional Local', marginX + pColWidth, rowY, pColWidth)
  );
  rowY += r5;

  // Advance currentY past the photo box or rows, whichever is taller
  currentY = Math.max(rowY, photoY + photoBoxHeight + 16);

  // Permanent Address across full width (safely below photo)
  currentY += drawField("Permanent Residential Address", app.address, marginX, currentY, pageWidth - 2 * marginX);

  // ==========================================
  // SECTION 2: PROFESSIONAL POSITION
  // ==========================================
  if (currentY > pageHeight - 160) {
    doc.addPage();
    currentY = 45;
  } else {
    currentY += 8;
  }

  currentY = drawSectionHeader("2. PROFESSIONAL POSITION APPLIED FOR", currentY);
  const fullColWidth = (pageWidth - 2 * marginX) / 3;

  const prof1 = Math.max(
    drawField("Category", app.category, marginX, currentY, fullColWidth),
    drawField("Teaching Level", app.teacher_category || 'N/A', marginX + fullColWidth, currentY, fullColWidth),
    drawField("Expected Salary (INR)", app.salary_expected, marginX + (2 * fullColWidth), currentY, fullColWidth)
  );
  currentY += prof1;

  const prof2 = Math.max(
    drawField("Major Specialization", app.major_subject, marginX, currentY, fullColWidth),
    drawField("Minor Subject 1", app.minor_subject_1 || 'None', marginX + fullColWidth, currentY, fullColWidth),
    drawField("Minor Subject 2", app.minor_subject_2 || 'None', marginX + (2 * fullColWidth), currentY, fullColWidth)
  );
  currentY += prof2;

  currentY += drawField("TET / CTET / State Eligibility Details", app.tet_details, marginX, currentY, pageWidth - 2 * marginX);

  // ==========================================
  // SECTION 3: ACADEMIC QUALIFICATIONS
  // ==========================================
  if (app.education_qualifications && app.education_qualifications.length > 0) {
    if (currentY > pageHeight - 150) {
      doc.addPage();
      currentY = 45;
    } else {
      currentY += 8;
    }

    currentY = drawSectionHeader("3. ACADEMIC & PROFESSIONAL QUALIFICATIONS", currentY);

    autoTable(doc, {
      startY: currentY,
      head: [['Examination / Degree', 'Institution / Board / University', 'Passing Year', 'Percentage / CGPA', 'Subjects Studied']],
      body: app.education_qualifications.map(q => [
        q.examination || '-',
        q.institution || '-',
        q.year || '-',
        q.percentage ? `${q.percentage}%` : '-',
        q.subjects || '-'
      ]),
      margin: { left: marginX, right: marginX },
      theme: 'grid',
      styles: { fontSize: 8, cellPadding: 6, textColor: [15, 23, 42] },
      headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255], fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [248, 250, 252] }
    });
    currentY = (doc as any).lastAutoTable.finalY + 16;
  }

  // ==========================================
  // SECTION 4: TEACHING EXPERIENCE
  // ==========================================
  if (app.teaching_experience && app.teaching_experience.length > 0) {
    if (currentY > pageHeight - 150) {
      doc.addPage();
      currentY = 45;
    } else {
      currentY += 8;
    }

    currentY = drawSectionHeader("4. TEACHING & PEDAGOGICAL EXPERIENCE", currentY);

    autoTable(doc, {
      startY: currentY,
      head: [['Name of School / Institution', 'Service Period', 'Classes Taught', 'Subjects Handled']],
      body: app.teaching_experience.map(e => [
        e.institution || '-',
        `${e.fromYear || ''} - ${e.toYear || ''}`.trim() || '-',
        e.classes || '-',
        e.subjects || '-'
      ]),
      margin: { left: marginX, right: marginX },
      theme: 'grid',
      styles: { fontSize: 8, cellPadding: 6, textColor: [15, 23, 42] },
      headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255], fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [248, 250, 252] }
    });
    currentY = (doc as any).lastAutoTable.finalY + 16;
  }

  // ==========================================
  // SECTION 5: HONORS & ACHIEVEMENTS
  // ==========================================
  if (app.achievements && app.achievements.length > 0) {
    if (currentY > pageHeight - 150) {
      doc.addPage();
      currentY = 45;
    } else {
      currentY += 8;
    }

    currentY = drawSectionHeader("5. HONORS, AWARDS & SPECIAL FEATS", currentY);

    autoTable(doc, {
      startY: currentY,
      head: [['Year', 'Field / Domain', 'Detailed Description']],
      body: app.achievements.map(a => [
        a.year || '-',
        a.field || '-',
        a.description || '-'
      ]),
      margin: { left: marginX, right: marginX },
      theme: 'grid',
      styles: { fontSize: 8, cellPadding: 6, textColor: [15, 23, 42] },
      headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255], fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [248, 250, 252] }
    });
    currentY = (doc as any).lastAutoTable.finalY + 16;
  }

  // ==========================================
  // SECTION 6: INSTITUTIONAL NARRATIVES & SOP
  // ==========================================
  if (currentY > pageHeight - 200) {
    doc.addPage();
    currentY = 45;
  } else {
    currentY += 8;
  }

  currentY = drawSectionHeader("6. INSTITUTIONAL INSIGHTS & NARRATIVES", currentY);

  currentY += drawField("Interests & Co-Curricular Contributions", app.interests, marginX, currentY, pageWidth - 2 * marginX);
  
  if (currentY > pageHeight - 120) { doc.addPage(); currentY = 45; }
  currentY += drawField("Key Administrative & Departmental Responsibilities Handled", app.responsibilities_handled, marginX, currentY, pageWidth - 2 * marginX);

  if (currentY > pageHeight - 120) { doc.addPage(); currentY = 45; }
  currentY += drawField("Statement of Purpose (Why St. Xavier's Jaipur?)", app.statement_of_purpose, marginX, currentY, pageWidth - 2 * marginX);

  if (currentY > pageHeight - 100) { doc.addPage(); currentY = 45; }
  currentY += drawField("Non-Teaching / Industry Experience", app.other_experience, marginX, currentY, pageWidth - 2 * marginX);

  // ==========================================
  // SECTION 7: DECLARATION & SIGNATURE BLOCKS
  // ==========================================
  if (currentY > pageHeight - 140) {
    doc.addPage();
    currentY = 45;
  } else {
    currentY += 12;
  }

  doc.setFillColor(248, 250, 252);
  doc.rect(marginX, currentY, pageWidth - 2 * marginX, 70, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.rect(marginX, currentY, pageWidth - 2 * marginX, 70, 'D');

  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text("OFFICIAL CANDIDATE DECLARATION & LEGAL CONSENT", marginX + 12, currentY + 16);

  doc.setFontSize(7);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(100, 116, 139);
  const declarationText = "I hereby certify that all information submitted in this application is true, complete, and accurate to the best of my knowledge. I understand that any false statement or omission will result in immediate disqualification or termination.";
  const decLines = doc.splitTextToSize(declarationText, pageWidth - 2 * marginX - 24);
  doc.text(decLines, marginX + 12, currentY + 28);

  // Status check & signature line
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(5, 150, 105); // Emerald 600
  doc.text(`[✓] Declaration Digitally Accepted by Candidate (${app.full_name || 'Applicant'})`, marginX + 12, currentY + 54);

  doc.setTextColor(100, 116, 139);
  doc.setFont('helvetica', 'normal');
  doc.text("Candidate Signature: _______________________", pageWidth - marginX - 190, currentY + 54);

  // Running Footer on each page
  const totalPages = doc.internal.pages.length - 1;
  const timestamp = new Date().toLocaleString();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(6.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(148, 163, 184);
    
    // Top fine line on pages after page 1
    if (i > 1) {
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.5);
      doc.line(marginX, 32, pageWidth - marginX, 32);
      doc.text(`St. Xavier's Senior Secondary School, Jaipur • Candidate: ${app.full_name || 'N/A'} (${appNo})`, marginX, 26);
    }

    // Bottom fine line
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.5);
    doc.line(marginX, pageHeight - 24, pageWidth - marginX, pageHeight - 24);

    doc.text(`Official Recruitment Dossier • Generated: ${timestamp} • Verification Ref: ${app.id || 'LOC-REG'}`, marginX, pageHeight - 14);
    doc.text(`Page ${i} of ${totalPages}`, pageWidth - marginX - 45, pageHeight - 14);
  }

  return doc;
}

/**
 * Helper to draw a clean vector passport placeholder box
 */
function drawPhotoPlaceholder(doc: jsPDF, x: number, y: number, w: number, h: number, text: string) {
  doc.setFillColor(241, 245, 249); // Slate 100
  doc.rect(x + 4, y + 4, w - 8, h - 8, 'F');
  
  // Dashed border inside
  doc.setDrawColor(203, 213, 225); // Slate 300
  doc.setLineWidth(0.75);
  doc.rect(x + 4, y + 4, w - 8, h - 8, 'D');

  // Vector Silhouette
  const centerX = x + w / 2;
  const headY = y + 38;
  
  // Head circle
  doc.setFillColor(203, 213, 225);
  doc.circle(centerX, headY, 14, 'F');
  
  // Shoulders arc/rect
  doc.roundedRect(centerX - 24, headY + 18, 48, 30, 10, 10, 'F');

  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(148, 163, 184); // Slate 400
  doc.text(text, centerX, y + h - 18, { align: 'center' });
}

/**
 * Exports a master summary PDF containing all candidates or generates a unified multi-candidate document.
 */
export async function generateMasterApplicationsPDF(apps: CareerApplication[]): Promise<jsPDF> {
  if (apps.length === 0) {
    const emptyDoc = new jsPDF('p', 'pt', 'a4');
    emptyDoc.text("No candidate applications found.", 40, 50);
    return emptyDoc;
  }

  const doc = new jsPDF('p', 'pt', 'a4');
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const marginX = 40;

  // Cover Page / Summary Header
  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, pageWidth, 85, 'F');
  doc.setFillColor(226, 180, 80);
  doc.rect(0, 85, pageWidth, 4, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text("ST. XAVIER'S SENIOR SECONDARY SCHOOL", marginX, 40);

  doc.setFontSize(10);
  doc.setTextColor(226, 180, 80);
  doc.text("MASTER TALENT REGISTRY • COMPREHENSIVE CANDIDATE ROSTER", marginX, 58);

  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text(`Generated on ${new Date().toLocaleString()} • Total Candidates: ${apps.length}`, marginX, 72);

  // Master Table of Candidates
  autoTable(doc, {
    startY: 110,
    head: [['#', 'App ID', 'Candidate Name', 'Category / Level', 'Specialization', 'Mobile', 'Email', 'Status']],
    body: apps.map((app, idx) => [
      idx + 1,
      app.application_no || 'NA',
      app.full_name || 'N/A',
      `${app.category || ''}${app.teacher_category ? ' - ' + app.teacher_category : ''}`,
      app.major_subject || 'General',
      app.mobile_number || '-',
      app.email || '-',
      app.status || 'Received'
    ]),
    margin: { left: marginX, right: marginX },
    theme: 'grid',
    styles: { fontSize: 8, cellPadding: 6, textColor: [15, 23, 42] },
    headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255], fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [248, 250, 252] }
  });

  return doc;
}
