import React from 'react';
import { motion } from 'motion/react';
import { Helmet } from 'react-helmet-async';
import Layout from '../components/layout/Layout';
import { AppData } from '../types';
import { 
  Building2, 
  Mail, 
  Phone, 
  Calendar, 
  ShieldCheck, 
  Globe, 
  Map, 
  Library,
  UserCheck,
  Scale,
  Clock,
  ExternalLink
} from 'lucide-react';
import { Link } from 'react-router-dom';

const SchoolInformationPage = ({ data }: { data: AppData }) => {
  const infoSections = [
    {
      title: "Basic Details",
      icon: <Building2 className="text-school-gold" />,
      items: [
        { label: "Name of the School", value: "St. Xavier's Sr. Sec. School" },
        { label: "Address", value: "Bhagwan Das Road, C-Scheme, Jaipur - 301001" },
        { label: "Email", value: "xavier41jaipur@gmail.com" },
        { label: "Phone No.", value: "0141-2372336, 2367792" },
        { label: "Year of Establishment", value: "1941" }
      ]
    },
    {
      title: "Recognition & NOC",
      icon: <ShieldCheck className="text-school-gold" />,
      items: [
        { label: "NOC from State/UT", value: "Rajasthan Government Obtained" },
        { label: "NOC No.", value: "F-6(43)Edu Cell VI/61" },
        { label: "NOC Date", value: "20-09-1962" },
        { label: "Recognised Authority", value: "Govt. of Rajasthan" }
      ]
    },
    {
      title: "Affiliation Status",
      icon: <Globe className="text-school-gold" />,
      items: [
        { label: "Affiliation Status", value: "Permanent" },
        { label: "Affiliation No.", value: "1730003" },
        { label: "Affiliated Since", value: "August 1984" },
        { label: "Board", value: "CBSE" }
      ]
    },
    {
      title: "Management & Trust",
      icon: <UserCheck className="text-school-gold" />,
      items: [
        { label: "Trust Name", value: "Jaipur Xavier Educational Association" },
        { label: "Registration Validity", value: "Permanent" },
        { label: "Manager", value: "Fr. Nelson A. D'Silva, SJ" },
        { label: "Managing Committee", value: "Available under Link", isLink: true, to: "/governing-members" }
      ]
    },
    {
      title: "Campus Infrastructure",
      icon: <Map className="text-school-gold" />,
      items: [
        { label: "Total Area (Acres)", value: "17 Acres" },
        { label: "Total Area (Sq. mtrs)", value: "68,800 sq. mtrs." },
        { label: "Built-up Area", value: "20,000 sq. mtrs." },
        { label: "Playground Area", value: "16,300 sq. mtrs." }
      ]
    },
    {
      title: "Facilities & Amenities",
      icon: <Library className="text-school-gold" />,
      items: [
        { label: "Swimming Pool", value: "50m Senior & 25m Junior Pools" },
        { label: "Indoor Games", value: "Table Tennis, Squash, Yoga, Chess" },
        { label: "Gymnasium", value: "Fully Equipped with CYBEX" },
        { label: "Health Check-up", value: "Regularly with 2 Sickrooms & Nurses" },
        { label: "Hostels", value: "No" },
        { label: "Transport", value: "Not Provided (No own/hired buses)" }
      ]
    },
    {
      title: "Library Details",
      icon: <Library className="text-school-gold" />,
      items: [
        { label: "Size (sq. feet)", value: "Two Reading Rooms + Stack Room" },
        { label: "Periodicals", value: "70" },
        { label: "Magazines", value: "51" },
        { label: "Dailies", value: "10" },
        { label: "Reference Books", value: "Approx. 1000+ volumes" }
      ]
    },
    {
      title: "Academic Cycle",
      icon: <Clock className="text-school-gold" />,
      items: [
        { label: "Session Period", value: "April to March" },
        { label: "Vacation Period", value: "15th May to 30th June" },
        { label: "Admission Period", value: "January to July" }
      ]
    }
  ];

  const standardSections = infoSections.filter(s => 
    s.title !== "Facilities & Amenities" && s.title !== "Library Details"
  );

  const detailedSections = infoSections.filter(s => 
    s.title === "Facilities & Amenities" || s.title === "Library Details"
  );

  return (
    <Layout data={data}>
      <Helmet>
        <title>School Information | St. Xavier's Sr. Sec. School, Jaipur</title>
        <meta name="description" content="Access official mandatory public disclosures, CBSE affiliation details, and comprehensive school information for St. Xavier's Sr. Sec. School, Jaipur. A legacy of Jesuit education since 1941." />
        <meta name="keywords" content="St. Xavier's Jaipur, School Information, CBSE Mandatory Disclosure, Jaipur Schools, Jesuit Education India, St. Xavier's Sr. Sec. School Jaipur, School Infrastructure Jaipur, Statutory Disclosure" />
        <link rel="canonical" href="https://stxaviersjaipur.org/school-info" />
        <meta property="og:title" content="School Information | St. Xavier's Sr. Sec. School, Jaipur" />
        <meta property="og:description" content="Official mandatory public disclosure and statutory information for St. Xavier's Sr. Sec. School, Jaipur." />
        <meta property="og:type" content="website" />
      </Helmet>
      <div className="bg-school-paper min-h-screen">
        {/* Hero Section */}
        <section className="py-20 bg-school-navy relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent"></div>
          </div>
          <div className="max-w-7xl mx-auto px-6 lg:px-12 text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center"
            >
              {/* Institutional Logo Section */}
              <div className="mb-8 relative">
                <div className="absolute inset-0 bg-school-gold blur-3xl opacity-20 rounded-full"></div>
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="w-32 h-32 md:w-40 md:h-40 rounded-[40px] bg-white text-school-navy flex items-center justify-center font-serif font-black text-6xl md:text-7xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] border-4 border-school-gold/30 relative z-10"
                >
                  X
                  <div className="absolute -bottom-2 -right-2 bg-school-gold text-white p-2 rounded-2xl shadow-lg border-2 border-white">
                    <ShieldCheck size={24} />
                  </div>
                </motion.div>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-serif font-black text-white tracking-tighter mb-6 italic uppercase">School <span className="text-school-gold">Information</span></h1>
              <p className="text-white/50 text-xl font-light max-w-3xl mx-auto italic">Mandatory Public Disclosure and Statutory Information (CBSE).</p>
            </motion.div>
          </div>
        </section>

        {/* Data Grid - Standard Info */}
        <section className="py-24 max-w-7xl mx-auto px-6 lg:px-12">
          <div className="mb-12">
            <h2 className="text-3xl font-serif font-black text-school-ink italic uppercase tracking-tight flex items-center gap-4">
              <span className="w-12 h-px bg-school-gold"></span>
              Statutory Disclosure
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {standardSections.map((section, idx) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                className="bg-school-paper rounded-[40px] border border-school-ink/10 shadow-sm overflow-hidden"
              >
                <div className="p-8 border-b border-school-ink/5 bg-school-ink/5 flex items-center gap-4">
                  <div className="w-12 h-12 bg-school-paper rounded-2xl flex items-center justify-center shadow-sm">
                    {section.icon}
                  </div>
                  <h3 className="text-xl font-serif font-black text-school-ink italic uppercase tracking-tight">{section.title}</h3>
                </div>
                <div className="p-8 space-y-4">
                  {section.items.map((item, i) => (
                    <div key={i} className="flex justify-between items-start gap-4 text-sm group">
                      <span className="text-school-ink/40 font-black uppercase tracking-widest text-[10px] pt-1">{item.label}</span>
                      {item.isLink ? (
                        <Link to={item.to || '#'} className="text-school-gold font-bold flex items-center gap-1 hover:underline">
                          View {item.label} <ExternalLink size={12} />
                        </Link>
                      ) : (
                        <span className="text-school-ink text-right font-medium">{item.value}</span>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Detailed Facilities & Library Section */}
        <section className="py-24 border-y border-school-ink/10">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-serif font-black text-school-ink italic uppercase tracking-tight">Facilities & Academic Resources</h2>
              <p className="text-school-ink/40 text-sm mt-4 tracking-widest uppercase font-black">Campus Infrastructure & Learning Environment</p>
            </div>

            <div className="space-y-12">
              {detailedSections.map((section, idx) => (
                <motion.div 
                  key={section.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="bg-school-paper/50 rounded-[48px] p-1 md:p-2 border border-school-ink/10"
                >
                  <div className="bg-school-paper rounded-[44px] shadow-sm overflow-hidden">
                    <div className="p-8 md:p-12 border-b border-school-ink/5 flex items-center justify-between">
                       <div className="flex items-center gap-6">
                         <div className="w-16 h-16 bg-school-navy rounded-[24px] flex items-center justify-center text-school-gold shadow-xl">
                            {section.icon}
                         </div>
                         <h3 className="text-3xl font-serif font-black text-school-ink italic uppercase">{section.title}</h3>
                       </div>
                    </div>
                    
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-school-ink/5">
                            <th className="px-12 py-6 text-[10px] font-black uppercase tracking-widest text-school-ink/40">Specification</th>
                            <th className="px-12 py-6 text-[10px] font-black uppercase tracking-widest text-school-ink/40">Details & Capacity</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-school-ink/5">
                          {section.items.map((item, i) => (
                            <tr key={i} className="hover:bg-school-ink/5 transition-colors">
                              <td className="px-12 py-8 align-top">
                                <span className="text-sm font-black text-school-ink uppercase tracking-tight">{item.label}</span>
                              </td>
                              <td className="px-12 py-8">
                                <div className="flex items-center gap-4">
                                  <div className="w-2 h-2 bg-school-gold rounded-full shrink-0"></div>
                                  <span className="text-md text-school-ink/70 font-medium leading-relaxed">{item.value}</span>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Officers & Committees */}
        <section className="py-24 border-t border-school-ink/10">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="mb-16 text-center">
              <h2 className="text-4xl font-serif font-black text-school-ink italic uppercase tracking-tight">Statutory Officers</h2>
              <div className="w-24 h-1 bg-school-gold mx-auto mt-6 rounded-full"></div>
            </div>

            <div className="grid md:grid-cols-2 gap-12">
              <div className="p-12 glass-surface rounded-[48px] border border-school-ink/10">
                <div className="flex items-center gap-4 mb-8">
                  <UserCheck className="text-school-gold" size={32} />
                  <div>
                    <h3 className="text-2xl font-serif font-black text-school-ink italic">Grievance Officer</h3>
                    <p className="text-[10px] uppercase font-black tracking-widest text-school-ink/30">Redressal & Compliance</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between border-b border-school-ink/5 pb-4">
                    <span className="text-[10px] font-black uppercase tracking-widest text-school-ink/40">Name</span>
                    <span className="text-sm font-bold text-school-ink">Fr. M. Arockiam, SJ</span>
                  </div>
                  <div className="flex justify-between border-b border-school-ink/5 pb-4">
                    <span className="text-[10px] font-black uppercase tracking-widest text-school-ink/40">Email</span>
                    <span className="text-sm text-school-ink/70">xavier41jaipur@gmail.com</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[10px] font-black uppercase tracking-widest text-school-ink/40">Phone</span>
                    <span className="text-sm text-school-ink/70">0141-2372336</span>
                  </div>
                </div>
              </div>

              <div className="p-12 bg-school-navy text-white rounded-[48px] shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                <div className="flex items-center gap-4 mb-8">
                  <Scale className="text-school-gold" size={32} />
                  <div>
                    <h3 className="text-2xl font-serif font-black text-white italic">Internal Committees</h3>
                    <p className="text-[10px] uppercase font-black tracking-widest text-white/30">Statutory Bodies</p>
                  </div>
                </div>
                <div className="space-y-6">
                  <Link to="#" className="flex justify-between items-center group p-4 border border-white/10 rounded-2xl hover:bg-white/5 transition-all">
                    <span className="text-xs font-black uppercase tracking-widest text-white/70">Sexual Harassment Committee</span>
                    <ExternalLink size={16} className="text-school-gold group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link to="/fees" className="flex justify-between items-center group p-4 border border-white/10 rounded-2xl hover:bg-white/5 transition-all">
                    <span className="text-xs font-black uppercase tracking-widest text-white/70">Detailed Fee Structure</span>
                    <ExternalLink size={16} className="text-school-gold group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link to="/staff" className="flex justify-between items-center group p-4 border border-white/10 rounded-2xl hover:bg-white/5 transition-all">
                    <span className="text-xs font-black uppercase tracking-widest text-white/70">Teaching Staff List</span>
                    <ExternalLink size={16} className="text-school-gold group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Footer Banner */}
        <section className="py-24 text-center max-w-4xl mx-auto px-6">
          <div className="space-y-8">
            <h2 className="text-3xl md:text-4xl font-serif font-black text-school-ink italic tracking-tight underline decoration-school-gold decoration-4 underline-offset-8">
              "Dedicated to Excellence in Education Since 1941"
            </h2>
            <p className="text-xs font-black uppercase tracking-[0.4em] text-school-ink/30">Jaipur Xavier Educational Association</p>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default SchoolInformationPage;
