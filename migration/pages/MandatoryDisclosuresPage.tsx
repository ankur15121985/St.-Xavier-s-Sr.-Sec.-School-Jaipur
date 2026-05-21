import React from 'react';
import { motion } from 'motion/react';
import { Helmet } from 'react-helmet-async';
import Layout from '../components/layout/Layout';
import { AppData } from '../types';
import { 
  FileText, 
  ExternalLink, 
  ShieldCheck,
} from 'lucide-react';

const MandatoryDisclosuresPage = ({ data }: { data: AppData }) => {
  const tableHeaderClasses = "px-6 py-4 bg-school-navy text-white text-[10px] font-black uppercase tracking-widest border border-school-ink/10";
  const tableCellClasses = "px-6 py-4 text-sm font-bold text-school-navy border border-school-ink/10 bg-white";
  const tableSrClasses = "px-4 py-4 text-center text-xs font-black text-school-ink/40 border border-school-ink/10 bg-school-paper";

  // Grouping logic for dynamic disclosures
  const getSectionItems = (category: string) => {
    return (data.mandatory_disclosures || [])
      .filter(item => item.category === category && item.is_enabled !== false)
      .sort((a, b) => (a.order_index || 0) - (b.order_index || 0));
  };

  const sectionA = getSectionItems('A');
  const sectionB = getSectionItems('B');
  const sectionC = getSectionItems('C');
  const sectionCTableX = getSectionItems('C_TABLE_X');
  const sectionCTableXII = getSectionItems('C_TABLE_XII');
  const sectionD = getSectionItems('D');
  const sectionE = getSectionItems('E');

  return (
    <Layout data={data}>
      <Helmet>
        <title>Mandatory Public Disclosure | St. Xavier's School, Nevta</title>
        <meta name="description" content="Official mandatory public disclosures, statutory documents, and CBSE compliance reports for St. Xavier's School, Nevta." />
      </Helmet>
      
      <div className="bg-school-paper min-h-screen pb-24">
        {/* Hero Section */}
        <section className="pt-32 pb-16 bg-white relative overflow-hidden border-b border-school-ink/5">
          <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl mx-auto"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-school-gold/10 text-school-gold rounded-full text-[10px] font-black uppercase tracking-widest mb-6">
                <ShieldCheck size={14} />
                Statutory Compliance
              </div>
              <h1 className="text-4xl md:text-6xl font-serif font-black text-school-navy tracking-tighter mb-4 uppercase italic">
                Mandatory Public <span className="text-school-gold">Disclosure</span>
              </h1>
              <div className="h-1.5 w-40 bg-school-gold mx-auto rounded-full mb-8"></div>
            </motion.div>
          </div>
        </section>

        <section className="max-w-5xl mx-auto px-6 mt-16 space-y-16">
          {/* A - General Information */}
          {sectionA.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-xl font-black text-school-navy mb-6 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-school-navy text-white flex items-center justify-center text-sm">A</span>
                GENERAL INFORMATION
              </h2>
              <div className="overflow-hidden rounded-3xl border border-school-ink/10 shadow-2xl">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr>
                      <th className={`${tableHeaderClasses} w-20 text-center`}>Sr. No.</th>
                      <th className={tableHeaderClasses}>Information</th>
                      <th className={tableHeaderClasses}>Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-school-ink/10">
                    {sectionA.map((item, i) => (
                      <tr key={item.id}>
                        <td className={tableSrClasses}>{i + 1}</td>
                        <td className={tableCellClasses}>{item.title}</td>
                        <td className={tableCellClasses}>{item.content}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* B - Documents and Information */}
          {sectionB.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-xl font-black text-school-navy mb-6 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-school-navy text-white flex items-center justify-center text-sm">B</span>
                DOCUMENTS AND INFORMATION
              </h2>
              <div className="overflow-hidden rounded-3xl border border-school-ink/10 shadow-2xl">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr>
                      <th className={`${tableHeaderClasses} w-20 text-center`}>Sr. No.</th>
                      <th className={tableHeaderClasses}>Documents/Information</th>
                      <th className={tableHeaderClasses}>Upload Documents</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-school-ink/10">
                    {sectionB.map((item, i) => (
                      <tr key={item.id}>
                        <td className={tableSrClasses}>{i + 1}</td>
                        <td className={tableCellClasses}>{item.content}</td>
                        <td className={tableCellClasses}>
                          {item.attachmentUrl ? (
                            <a href={item.attachmentUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-school-gold hover:underline">
                              Link <ExternalLink size={12} />
                            </a>
                          ) : (
                            <span className="text-school-ink/30 italic">Not Uploaded</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-6 text-sm text-school-navy font-black italic bg-school-gold/5 p-6 rounded-2xl border border-school-gold/10">
                Note: The school needs to upload the self-attested copies of above listed documents by chairman/manager/secretary and principal.
              </p>
            </motion.div>
          )}

          {/* C - Result and Academics */}
          {(sectionC.length > 0 || sectionCTableX.length > 0 || sectionCTableXII.length > 0) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-xl font-black text-school-navy mb-6 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-school-navy text-white flex items-center justify-center text-sm">C</span>
                RESULT AND ACADEMICS
              </h2>
              
              {sectionC.length > 0 && (
                <div className="overflow-hidden rounded-3xl border border-school-ink/10 shadow-2xl mb-12">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr>
                        <th className={`${tableHeaderClasses} w-20 text-center`}>Sr. No.</th>
                        <th className={tableHeaderClasses}>Documents/Information</th>
                        <th className={tableHeaderClasses}>Details / Link</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-school-ink/10">
                      {sectionC.map((item, i) => (
                        <tr key={item.id}>
                          <td className={tableSrClasses}>{i + 1}</td>
                          <td className={tableCellClasses}>{item.title}</td>
                          <td className={tableCellClasses}>
                            <div className="flex flex-col gap-1">
                              <span className="text-[10px] text-school-ink/60">{item.content}</span>
                              {item.attachmentUrl && (
                                <a href={item.attachmentUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-school-gold hover:underline">
                                  Official Link <ExternalLink size={12} />
                                </a>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Result Class X Table */}
              {sectionCTableX.length > 0 && (
                <>
                  <h3 className="text-lg font-black text-school-navy mb-4 uppercase italic">Result Class X</h3>
                  <div className="overflow-hidden rounded-3xl border border-school-ink/10 shadow-xl mb-12">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr>
                          <th className={`${tableHeaderClasses} w-20 text-center`}>S.No.</th>
                          <th className={tableHeaderClasses}>Year</th>
                          <th className={tableHeaderClasses}>Result Details (Reg / Pass / %)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-school-ink/10">
                        {sectionCTableX.map((item, i) => (
                          <tr key={item.id}>
                            <td className={tableSrClasses}>{i + 1}</td>
                            <td className={tableCellClasses}>{item.title}</td>
                            <td className={`${tableCellClasses} font-mono text-xs`}>{item.content}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}

              {/* Result Class XII Table */}
              {sectionCTableXII.length > 0 && (
                <>
                  <h3 className="text-lg font-black text-school-navy mb-4 uppercase italic">Result Class XII</h3>
                  <div className="overflow-hidden rounded-3xl border border-school-ink/10 shadow-xl">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr>
                          <th className={`${tableHeaderClasses} w-20 text-center`}>S.No.</th>
                          <th className={tableHeaderClasses}>Year</th>
                          <th className={tableHeaderClasses}>Result Details (Reg / Pass / %)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-school-ink/10">
                        {sectionCTableXII.map((item, i) => (
                          <tr key={item.id}>
                            <td className={tableSrClasses}>{i + 1}</td>
                            <td className={tableCellClasses}>{item.title}</td>
                            <td className={`${tableCellClasses} font-mono text-xs`}>{item.content}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </motion.div>
          )}

          {/* D - Staff (Teaching) */}
          {sectionD.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-xl font-black text-school-navy mb-6 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-school-navy text-white flex items-center justify-center text-sm">D</span>
                STAFF (TEACHING)
              </h2>
              <div className="overflow-hidden rounded-3xl border border-school-ink/10 shadow-2xl">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr>
                      <th className={`${tableHeaderClasses} w-20 text-center`}>Sr. No.</th>
                      <th className={tableHeaderClasses}>Information</th>
                      <th className={tableHeaderClasses}>Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-school-ink/10">
                    {sectionD.map((item, i) => (
                      <tr key={item.id}>
                        <td className={tableSrClasses}>{i + 1}</td>
                        <td className={tableCellClasses}>{item.title}</td>
                        <td className={tableCellClasses}>{item.content}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* E - School Infrastructure */}
          {sectionE.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-xl font-black text-school-navy mb-6 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-school-navy text-white flex items-center justify-center text-sm">E</span>
                SCHOOL INFRASTRUCTURE
              </h2>
              <div className="overflow-hidden rounded-3xl border border-school-ink/10 shadow-2xl">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr>
                      <th className={`${tableHeaderClasses} w-20 text-center`}>Sr. No.</th>
                      <th className={tableHeaderClasses}>Information</th>
                      <th className={tableHeaderClasses}>Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-school-ink/10">
                    {sectionE.map((item, i) => (
                      <tr key={item.id}>
                        <td className={tableSrClasses}>{i + 1}</td>
                        <td className={tableCellClasses}>{item.title}</td>
                        <td className={tableCellClasses}>
                          {item.title.toLowerCase().includes('video') || item.title.toLowerCase().includes('link') ? (
                            item.attachmentUrl ? (
                              <a href={item.attachmentUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-school-gold hover:underline">
                                View Link <ExternalLink size={12} />
                              </a>
                            ) : <span>{item.content}</span>
                          ) : (
                            <span>{item.content}</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </section>

        {/* Official Footer Recognition */}
        <section className="py-24 max-w-5xl mx-auto px-6 text-center">
          <div className="inline-block p-1 bg-school-gold/10 rounded-full mb-8">
            <div className="px-6 py-2 border border-school-gold/20 rounded-full text-[10px] font-black uppercase tracking-[0.4em] text-school-navy"> Institutional Integrity</div>
          </div>
          <p className="text-school-ink/40 text-sm font-light leading-relaxed max-w-2xl mx-auto italic">
            This information is provided in accordance with CBSE Public Disclosure norms to ensure transparency in school operations and compliance with national standards.
          </p>
        </section>
      </div>
    </Layout>
  );
};

export default MandatoryDisclosuresPage;

