import React, { useRef, useEffect } from 'react';
import { Bold, Italic, Type, Palette, Underline as UnderlineIcon, List } from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange, label }) => {
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || '';
    }
  }, [value]);

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const execCommand = (command: string, value: string | undefined = undefined) => {
    document.execCommand(command, false, value);
    handleInput();
  };

  return (
    <div className="space-y-2">
      {label && <label className="text-[9px] font-black uppercase tracking-widest text-school-ink/30">{label}</label>}
      <div className="border border-school-ink/10 rounded-2xl overflow-hidden bg-school-ink/5">
        <div className="flex items-center gap-1 p-2 border-b border-school-ink/10 bg-white/50 backdrop-blur-sm">
          <button 
            type="button"
            onClick={() => execCommand('bold')}
            className="p-2 hover:bg-school-ink/10 rounded-lg transition-colors text-school-ink"
            title="Bold"
          >
            <Bold size={14} />
          </button>
          <button 
            type="button"
            onClick={() => execCommand('italic')}
            className="p-2 hover:bg-school-ink/10 rounded-lg transition-colors text-school-ink"
            title="Italic"
          >
            <Italic size={14} />
          </button>
          <button 
            type="button"
            onClick={() => execCommand('underline')}
            className="p-2 hover:bg-school-ink/10 rounded-lg transition-colors text-school-ink"
            title="Underline"
          >
            <UnderlineIcon size={14} />
          </button>
          <button 
            type="button"
            onClick={() => execCommand('insertUnorderedList')}
            className="p-2 hover:bg-school-ink/10 rounded-lg transition-colors text-school-ink"
            title="Bullet Points"
          >
            <List size={14} />
          </button>
          
          <div className="w-[1px] h-4 bg-school-ink/10 mx-1" />
          
          <div className="relative group">
            <button type="button" className="p-2 hover:bg-school-ink/10 rounded-lg transition-colors text-school-ink flex items-center gap-1">
              <Type size={14} />
              <span className="text-[8px] font-black">SIZE</span>
            </button>
            <div className="absolute top-full left-0 mt-1 bg-white shadow-xl rounded-xl border border-school-ink/10 p-2 hidden group-hover:block z-50 min-w-[100px]">
              {[1, 2, 3, 4, 5, 6, 7].map(size => (
                <button
                  key={size}
                  type="button"
                  onClick={() => execCommand('fontSize', size.toString())}
                  className="block w-full text-left px-3 py-2 hover:bg-school-ink/5 rounded-lg text-[10px] font-bold text-school-navy"
                >
                  Size {size}
                </button>
              ))}
            </div>
          </div>

          <div className="w-[1px] h-4 bg-school-ink/10 mx-1" />

          <div className="relative group flex items-center gap-2 px-2">
            <Palette size={14} className="text-school-ink/40" />
            <input 
              type="color" 
              onChange={(e) => execCommand('foreColor', e.target.value)}
              className="w-4 h-4 rounded-full border-none p-0 cursor-pointer bg-transparent"
              title="Text Color"
            />
          </div>
        </div>
        
        <div 
          ref={editorRef}
          contentEditable
          onInput={handleInput}
          className="p-4 min-h-[150px] max-h-[400px] overflow-y-auto outline-none text-xs text-school-ink font-medium prose prose-sm max-w-none"
          spellCheck={false}
        />
      </div>
      <p className="text-[8px] text-school-ink/40 font-medium italic italic">Visual editor. Bold, Italic, Size, and Color supported.</p>
    </div>
  );
};

export default RichTextEditor;
