import React, { useState } from 'react';
import { Cpu, FileJson, List, GitCommit } from 'lucide-react';

export default function CompilerPipeline({ data }) {
    const [activeTab, setActiveTab] = useState('tokens'); // tokens, ast, ir, assembly

    return (
        <div className="flex flex-col h-full bg-white border border-slate-300 shadow-sm col-span-1 md:col-span-2">
            <div className="p-3 border-b border-slate-200 bg-slate-50 flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                    <Cpu size={14} className="text-emerald-600" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-700">Compiler Pipeline</span>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => setActiveTab('tokens')} className={`px-2 py-1 text-[10px] font-bold uppercase tracking-widest transition-colors ${activeTab === 'tokens' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:bg-slate-200'}`}>Tokens</button>
                    <button onClick={() => setActiveTab('ast')} className={`px-2 py-1 text-[10px] font-bold uppercase tracking-widest transition-colors ${activeTab === 'ast' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:bg-slate-200'}`}>AST</button>
                    <button onClick={() => setActiveTab('ir')} className={`px-2 py-1 text-[10px] font-bold uppercase tracking-widest transition-colors ${activeTab === 'ir' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:bg-slate-200'}`}>IR</button>
                    <button onClick={() => setActiveTab('assembly')} className={`px-2 py-1 text-[10px] font-bold uppercase tracking-widest transition-colors ${activeTab === 'assembly' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:bg-slate-200'}`}>Assembly</button>
                </div>
            </div>
            
            <div className="flex-1 overflow-auto bg-slate-900 p-4 font-mono text-xs text-slate-300 flex flex-col">
                {activeTab === 'tokens' && (
                    <div className="flex flex-wrap gap-2">
                        {data.tokens.map((t, i) => (
                            <span key={i} className={`px-1.5 py-0.5 rounded-sm ${
                                t.type === 'Keyword' ? 'bg-purple-900/50 text-purple-300' :
                                t.type === 'String' ? 'bg-green-900/50 text-green-300' :
                                t.type === 'Literal' ? 'bg-orange-900/50 text-orange-300' :
                                t.type === 'Identifier' ? 'bg-blue-900/50 text-blue-300' :
                                'bg-slate-800 text-slate-300'
                            }`} title={t.type}>
                                {t.value}
                            </span>
                        ))}
                        {data.tokens.length === 0 && <span className="text-slate-500 italic">No tokens generated</span>}
                    </div>
                )}

                {activeTab === 'ast' && (
                    <pre className="whitespace-pre-wrap text-indigo-300">{data.syntaxTree ? JSON.stringify(data.syntaxTree, null, 2) : 'No AST generated'}</pre>
                )}
                
                {activeTab === 'ir' && (
                    <pre className="whitespace-pre-wrap">{data.ir.join('\n') || 'No IR generated'}</pre>
                )}

                {activeTab === 'assembly' && (
                    <pre className="whitespace-pre-wrap text-emerald-400">{data.assembly.join('\n') || 'No Assembly generated'}</pre>
                )}
            </div>
        </div>
    );
}
