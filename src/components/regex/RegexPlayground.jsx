import React from 'react';
import { Copy, Terminal as TermIcon, FileText, Info } from 'lucide-react';
import { useRegex } from '../../hooks/useRegex';

export default function RegexPlayground() {
    const {
        regexStr, setRegexStr,
        flags,
        testString, setTestString,
        matches, error,
        toggleFlag, FLAG_OPTS
    } = useRegex();

    // Highlight text based on matches
    const renderHighlightedText = () => {
        if (error || matches.length === 0) return <span className="text-slate-400">{testString || 'No text'}</span>;
        
        let lastIdx = 0;
        const elements = [];
        
        matches.forEach((m, i) => {
            const start = m.index;
            const end = start + m[0].length;
            
            if (start > lastIdx) {
                elements.push(<span key={`text-${lastIdx}`}>{testString.substring(lastIdx, start)}</span>);
            }
            
            elements.push(
                <span key={`match-${i}`} className="bg-emerald-200 text-emerald-900 border-b-2 border-emerald-500 font-bold px-0.5 rounded-sm group relative">
                    {m[0]}
                    {m.length > 1 && (
                        <span className="absolute bottom-full left-0 mb-1 hidden group-hover:block bg-slate-900 text-white text-[10px] p-1 whitespace-nowrap z-10 rounded-sm">
                            Groups: {m.slice(1).join(', ')}
                        </span>
                    )}
                </span>
            );
            lastIdx = end;
        });
        
        if (lastIdx < testString.length) {
            elements.push(<span key={`text-${lastIdx}`}>{testString.substring(lastIdx)}</span>);
        }
        
        return <div className="whitespace-pre-wrap">{elements}</div>;
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(matches.map(m => m[0]).join('\n'));
    };

    return (
        <div className="flex flex-col lg:flex-row gap-6 md:gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Left: Input */}
            <aside className="w-full lg:w-1/3 border border-slate-300 bg-white p-4 md:p-6 rounded-none flex-shrink-0 self-start shadow-sm space-y-6">
                <div>
                    <div className="flex items-center gap-2 mb-4">
                        <TermIcon size={16} className="text-slate-900" />
                        <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-900">Expression</h2>
                    </div>
                    
                    <div className="flex items-center bg-slate-50 border border-slate-200 p-2 font-mono text-sm focus-within:border-slate-900 transition-colors">
                        <span className="text-slate-400 mr-1">/</span>
                        <input 
                            type="text" 
                            value={regexStr}
                            onChange={(e) => setRegexStr(e.target.value)}
                            className="flex-1 bg-transparent outline-none text-slate-800"
                            placeholder="regex here..."
                            spellCheck="false"
                        />
                        <span className="text-slate-400 ml-1">/</span>
                        <span className="text-emerald-600 font-bold ml-1">{flags}</span>
                    </div>
                    {error && <div className="text-red-500 text-[10px] mt-2 font-bold uppercase tracking-widest">{error}</div>}
                </div>

                <div>
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3 border-b border-slate-100 pb-2">Flags</h3>
                    <div className="grid grid-cols-2 gap-2">
                        {FLAG_OPTS.map(f => (
                            <button
                                key={f.id}
                                onClick={() => toggleFlag(f.id)}
                                title={f.desc}
                                className={`flex items-center justify-between px-3 py-2 text-[10px] font-bold uppercase tracking-widest transition-colors rounded-none border ${flags.includes(f.id) ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'}`}
                            >
                                <span>{f.id}</span>
                                <span className={flags.includes(f.id) ? 'text-slate-400' : 'text-slate-400'}>{f.label.split(' ')[0]}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </aside>

            {/* Center: Test String */}
            <section className="w-full lg:w-1/3 flex flex-col space-y-6">
                <div className="flex-1 border border-slate-300 bg-white p-4 md:p-6 shadow-sm flex flex-col">
                    <div className="flex items-center gap-2 mb-4">
                        <FileText size={16} className="text-slate-900" />
                        <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-900">Test String</h2>
                    </div>
                    <textarea 
                        value={testString}
                        onChange={e => setTestString(e.target.value)}
                        className="w-full h-40 border border-slate-200 bg-slate-50 p-3 font-mono text-xs outline-none focus:border-slate-900 resize-none mb-4"
                        spellCheck="false"
                    />

                    <div className="flex items-center justify-between mb-4 border-t border-slate-100 pt-4">
                        <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-900">Match Results ({matches.length})</h2>
                        <button onClick={handleCopy} className="flex items-center gap-1.5 text-slate-500 hover:text-slate-900 transition-colors cursor-pointer text-[10px] font-bold uppercase tracking-widest">
                            <Copy size={12} /> Copy Matches
                        </button>
                    </div>

                    <div className="flex-1 border border-slate-200 bg-slate-50 p-4 font-mono text-xs text-slate-800 leading-relaxed overflow-y-auto">
                        {renderHighlightedText()}
                    </div>
                </div>
            </section>

            {/* Right: Explanation */}
            <aside className="w-full lg:w-1/3 border border-slate-300 bg-white p-4 md:p-6 rounded-none shadow-sm space-y-6">
                <div className="flex items-center gap-2 mb-4">
                    <Info size={16} className="text-slate-900" />
                    <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-900">Cheatsheet & Explanation</h2>
                </div>
                
                <div className="space-y-6 h-[500px] overflow-y-auto pr-2 scrollbar-thin">
                    <div className="space-y-2">
                        <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 border-b border-slate-100 pb-1">Character Classes</h3>
                        <ul className="space-y-1 font-mono text-xs text-slate-600">
                            <li><span className="font-bold text-slate-900 bg-slate-100 px-1">\d</span> digit</li>
                            <li><span className="font-bold text-slate-900 bg-slate-100 px-1">\w</span> word char (a-z, A-Z, 0-9, _)</li>
                            <li><span className="font-bold text-slate-900 bg-slate-100 px-1">\s</span> whitespace</li>
                            <li><span className="font-bold text-slate-900 bg-slate-100 px-1">.</span> any char (except newline)</li>
                        </ul>
                    </div>

                    <div className="space-y-2">
                        <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 border-b border-slate-100 pb-1">Quantifiers</h3>
                        <ul className="space-y-1 font-mono text-xs text-slate-600">
                            <li><span className="font-bold text-slate-900 bg-slate-100 px-1">*</span> 0 or more</li>
                            <li><span className="font-bold text-slate-900 bg-slate-100 px-1">+</span> 1 or more</li>
                            <li><span className="font-bold text-slate-900 bg-slate-100 px-1">?</span> 0 or 1</li>
                            <li><span className="font-bold text-slate-900 bg-slate-100 px-1">&#123;3&#125;</span> exactly 3</li>
                            <li><span className="font-bold text-slate-900 bg-slate-100 px-1">&#123;2,5&#125;</span> between 2 and 5</li>
                        </ul>
                    </div>

                    <div className="space-y-2">
                        <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 border-b border-slate-100 pb-1">Groups & Assertions</h3>
                        <ul className="space-y-1 font-mono text-xs text-slate-600">
                            <li><span className="font-bold text-slate-900 bg-slate-100 px-1">(abc)</span> capture group</li>
                            <li><span className="font-bold text-slate-900 bg-slate-100 px-1">[abc]</span> any of a, b, c</li>
                            <li><span className="font-bold text-slate-900 bg-slate-100 px-1">[^abc]</span> not a, b, c</li>
                            <li><span className="font-bold text-slate-900 bg-slate-100 px-1">^</span> start of string</li>
                            <li><span className="font-bold text-slate-900 bg-slate-100 px-1">$</span> end of string</li>
                        </ul>
                    </div>
                </div>
            </aside>
        </div>
    );
}
