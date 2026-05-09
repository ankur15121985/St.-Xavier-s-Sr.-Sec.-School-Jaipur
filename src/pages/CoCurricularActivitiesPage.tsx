import React from 'react';
import { motion } from 'motion/react';
import Layout from '../components/layout/Layout';
import { AppData } from '../types';
import { 
  Users, 
  Trophy, 
  Music, 
  Palette, 
  Globe, 
  Camera, 
  Microscope,
  Award,
  Heart,
  FileText,
  Star,
  Activity,
  Zap,
  ShieldCheck,
  LayoutGrid,
  GraduationCap
} from 'lucide-react';

const CoCurricularActivitiesPage = ({ data }: { data: AppData }) => {
  const [activeCategory, setActiveCategory] = React.useState<string>('All');

  const activities = (data.co_curricular_activities || [])
    .filter(a => a.is_enabled !== false)
    .sort((a, b) => (a.order_index || 0) - (b.order_index || 0));

  const categories = ['All', ...Array.from(new Set(activities.map(a => a.category || 'Focus Area')))];
  
  const filteredActivities = activeCategory === 'All' 
    ? activities 
    : activities.filter(a => (a.category || 'Focus Area') === activeCategory || a.display_type === 'heading'); // Headings always show for context

  // Helper to render table from JSON string in content
  const renderTable = (content: string) => {
    try {
      const tableData = JSON.parse(content);
      return (
        <div className="overflow-x-auto my-12 group">
          <table className="w-full text-left border-collapse border border-school-navy/10 shadow-2xl rounded-3xl overflow-hidden bg-white">
            <thead>
              <tr className="bg-school-navy text-white uppercase text-[10px] font-black tracking-[0.3em]">
                {tableData.headers?.map((h: string, i: number) => (
                  <th key={i} className="p-6 border-r border-white/10 last:border-none">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableData.rows?.map((row: string[], i: number) => (
                <tr key={i} className="border-b border-school-navy/5 hover:bg-school-gold/[0.03] transition-colors last:border-none">
                  {row.map((cell: string, j: number) => (
                    <td key={j} className="p-6 text-sm font-medium text-school-navy leading-relaxed border-r border-school-navy/5 last:border-none">
                      {cell.split(', ').map((item, idx) => (
                        <span key={idx} className="block last:mb-0 mb-1">{item}</span>
                      ))}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    } catch (e) {
      return <div className="p-8 bg-red-50 text-red-600 rounded-3xl border border-red-100 italic text-sm">Update content with valid table JSON (e.g., {"{headers:[], rows:[[]]}"})</div>;
    }
  };

  return (
    <Layout data={data}>
      <div className="min-h-screen bg-school-paper font-sans selection:bg-school-gold/30 pb-32">
        {/* Hero Section */}
        <section className="relative pt-48 pb-32 overflow-hidden border-b border-school-ink/5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(196,161,85,0.05),transparent_50%)]"></div>
          <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl">
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-school-gold mb-8 block">Holistic Excellence</span>
              <h1 className="text-7xl md:text-9xl font-serif font-black text-school-navy italic leading-[0.85] tracking-tighter mb-10 lowercase">
                Co-Curricular <br/> <span className="text-school-ink/10">&</span> Activities
              </h1>
              <p className="text-xl md:text-2xl text-school-ink/60 font-light leading-relaxed max-w-2xl italic">
                Developing sound principles of conduct and action through institutional traditions and student governance.
              </p>
            </motion.div>
          </div>
          
          {/* Decorative Sideways Text */}
          <div className="absolute right-[-5%] bottom-10 rotate-90 origin-right opacity-5 select-none pointer-events-none hidden lg:block">
            <span className="text-9xl font-serif font-black italic tracking-tighter whitespace-nowrap">St. Xavier's Jaipur</span>
          </div>
        </section>

        {/* Category Filter */}
        <div className="sticky top-20 z-40 bg-school-paper/80 backdrop-blur-md border-y border-school-ink/5 py-4">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="flex items-center gap-4 overflow-x-auto no-scrollbar pb-2">
              <span className="text-[10px] font-black uppercase tracking-tighter text-school-ink/30 whitespace-nowrap mr-4">Filter by Theme:</span>
              {categories.slice(0, 10).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border ${
                    activeCategory === cat 
                      ? 'bg-school-navy text-white border-school-navy shadow-lg' 
                      : 'bg-white text-school-navy border-school-navy/10 hover:border-school-gold'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Dynamic Content Rendering */}
        <section className="py-24 max-w-7xl mx-auto px-6 lg:px-12">
          {filteredActivities.length > 0 ? (
            <div className="space-y-32">
              {filteredActivities.map((item, idx) => {
                if (item.display_type === 'heading') {
                  return (
                    <motion.div 
                      key={item.id}
                      initial={{ opacity: 0, y: 40 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-100px" }}
                      className="relative"
                    >
                      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
                        <div className="flex-1">
                          <h2 className="text-5xl md:text-7xl font-serif font-black text-school-navy italic tracking-tight leading-none mb-6">
                            {item.title}
                          </h2>
                          <div className="h-2 w-32 bg-school-gold rounded-full"></div>
                        </div>
                        {item.content && (
                          <div 
                            className="flex-1 text-xl text-school-ink/60 font-light leading-relaxed italic border-l border-school-ink/10 pl-8 md:pl-12"
                            dangerouslySetInnerHTML={{ __html: item.content }}
                          />
                        )}
                      </div>
                    </motion.div>
                  );
                }

                if (item.display_type === 'text') {
                  return (
                    <motion.div 
                      key={item.id}
                      initial={{ opacity: 0, scale: 0.98 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      className="bg-white rounded-[64px] p-12 md:p-24 shadow-2xl shadow-school-navy/5 border border-school-ink/5 relative overflow-hidden"
                    >
                       <div className="absolute top-0 right-0 w-64 h-64 bg-school-gold/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
                       <div className="max-w-4xl mx-auto relative z-10">
                        <div 
                          className="prose prose-2xl prose-school text-school-navy font-serif italic text-center leading-snug tracking-tight"
                          dangerouslySetInnerHTML={{ __html: item.content }}
                        />
                       </div>
                       <div className="absolute bottom-10 left-10 opacity-20">
                         <Zap size={40} className="text-school-gold" />
                       </div>
                    </motion.div>
                  );
                }

                if (item.display_type === 'list') {
                  return (
                    <motion.div 
                      key={item.id}
                      initial={{ opacity: 0, y: 40 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      className="group"
                    >
                      <div className="flex items-center gap-6 mb-16">
                        <h3 className="text-3xl font-serif font-black text-school-navy italic whitespace-nowrap">
                          {item.title}
                        </h3>
                        <div className="h-px bg-school-navy/10 flex-1 group-hover:bg-school-gold transition-all duration-700"></div>
                        <div className="w-12 h-12 rounded-full border border-school-navy/10 flex items-center justify-center text-school-navy/30">
                          <LayoutGrid size={20} />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-12">
                        {item.content.replace(/<ul>|<\/ul>/g, '').split('<li>').filter(Boolean).map((li, i) => (
                          <div key={i} className="flex items-start gap-4 group/item">
                            <span className="w-2 h-2 rounded-full bg-school-gold mt-2 group-hover/item:scale-150 transition-transform"></span>
                            <span className="text-lg font-medium text-school-navy/80 hover:text-school-navy transition-colors">
                              {li.replace(/<\/li>/g, '')}
                            </span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  );
                }

                if (item.display_type === 'table') {
                  return (
                    <motion.div 
                      key={item.id}
                      initial={{ opacity: 0, y: 40 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      className="max-w-5xl"
                    >
                      <div className="flex items-center gap-6 mb-8">
                        <div className="w-px h-12 bg-school-gold"></div>
                        <h3 className="text-2xl font-serif font-black text-school-navy italic">
                          {item.title}
                        </h3>
                      </div>
                      {renderTable(item.content)}
                    </motion.div>
                  );
                }

                // Default: Tile
                return (
                  <motion.div 
                    key={item.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-white rounded-[48px] p-12 md:p-16 border border-school-ink/5 shadow-xl flex flex-col lg:flex-row gap-16 items-center hover:shadow-2xl transition-all duration-700 relative group overflow-hidden"
                  >
                    <div className="relative z-10 flex-1">
                      <div className="inline-flex items-center gap-3 px-4 py-2 bg-school-gold/10 rounded-full text-school-gold text-[10px] font-black uppercase tracking-widest mb-8">
                        <Award size={14} />
                        {item.category || 'Focus Area'}
                      </div>
                      
                      <h3 className="text-4xl md:text-5xl font-serif font-black text-school-navy italic mb-8 leading-tight tracking-tight">
                        {item.title}
                      </h3>
                      
                      <div 
                        className="text-school-ink/70 font-light leading-relaxed text-xl mb-10 italic"
                        dangerouslySetInnerHTML={{ __html: item.content }}
                      />
                      
                      {item.attachmentUrl && (
                        <a 
                          href={item.attachmentUrl}
                          target="_blank"
                          className="inline-flex items-center gap-4 px-10 py-5 bg-school-navy text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-school-gold hover:text-school-navy transition-all shadow-xl group-hover:scale-105"
                        >
                          Official Guidelines <FileText size={16} />
                        </a>
                      )}
                    </div>

                    <div className="w-full lg:w-[450px] relative shrink-0">
                      <div className="aspect-[4/5] rounded-[48px] overflow-hidden border border-school-ink/10 shadow-2xl">
                        <img 
                          src={item.image_url || 'https://images.unsplash.com/photo-1544652478-6653e09f18a2?auto=format&fit=crop&q=80&w=800'} 
                          alt={item.title} 
                          className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-school-gold/20 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
             <div className="text-center py-40 bg-white rounded-[64px] border-2 border-dashed border-school-ink/10 overflow-hidden relative">
                <div className="absolute inset-0 bg-school-gold/5 blur-3xl opacity-50"></div>
                <LayoutGrid className="mx-auto text-school-ink/10 mb-8 relative z-10" size={80} />
                <h3 className="text-3xl font-serif font-black italic text-school-ink/40 uppercase tracking-widest relative z-10">Directory Syncing</h3>
                <p className="text-school-ink/30 font-light mt-4 text-lg relative z-10 max-w-sm mx-auto italic">Our digital campus is currently cataloging the extensive co-curricular programs.</p>
             </div>
          )}
        </section>
      </div>
    </Layout>
  );
};

export default CoCurricularActivitiesPage;

