import React from 'react';
import { Github, Linkedin, Award, ArrowLeft } from 'lucide-react';
import contributors from '../data/contributors';

export default function Contributors({ setView }) {
    // Sort by contributions descending
    const sorted = [...contributors].sort((a, b) => b.contributions - a.contributions);

    return (
        <div className="space-y-10 md:space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* Back Navigation */}
            <button
                onClick={() => setView('Home')}
                className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 text-xs font-bold uppercase tracking-widest transition-colors group"
            >
                <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                Back to Hub
            </button>

            {/* Header */}
            <div className="space-y-4 border-b border-slate-200 pb-6 md:pb-8">
                <div className="inline-flex items-center gap-2 border border-slate-200 bg-white px-3 py-1.5 md:px-4 md:py-2 text-[10px] font-bold uppercase tracking-[0.25em] text-slate-500 shadow-sm">
                    <Award size={12} className="text-slate-900" />
                    Open-Source Contributors
                </div>
                <h1 className="text-2xl md:text-5xl font-black font-mono tracking-tighter text-slate-900 leading-[0.9]">
                    Hall of Fame
                </h1>
                <p className="text-xs md:text-sm text-slate-500 max-w-lg font-medium leading-relaxed">
                    The people who make Bunk & Learn Hub possible. Every module, every bug fix, every improvement — it all starts with a contributor.
                </p>
            </div>

            {/* Contributors Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {sorted.map((c, idx) => (
                    <div
                        key={`${c.name}-${idx}`}
                        className="bg-white border border-slate-200 p-6 md:p-8 space-y-5 md:space-y-6 hover:border-slate-900 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 group"
                    >
                        {/* Avatar & Info */}
                        <div className="flex items-center gap-3 md:gap-4">
                            <div className="w-12 h-12 md:w-14 md:h-14 bg-slate-900 text-white flex items-center justify-center text-lg md:text-xl font-black font-mono shrink-0">
                                {c.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                                <h3 className="text-sm md:text-base font-black tracking-tight text-slate-900 truncate">
                                    {c.name}
                                </h3>
                                <p className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-slate-400 truncate">
                                    {c.role}
                                </p>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="flex items-center gap-4 border-t border-slate-100 pt-4">
                            <div className="flex-1">
                                <span className="text-xl md:text-2xl font-black font-mono text-slate-900">{c.contributions}</span>
                                <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mt-1">Contributions</p>
                            </div>
                        </div>

                        {/* Social Links */}
                        <div className="flex items-center gap-3 pt-2">
                            {c.github && (
                                <a
                                    href={c.github}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-9 h-9 border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:border-slate-900 transition-all"
                                >
                                    <Github size={16} />
                                </a>
                            )}
                            {c.linkedin && (
                                <a
                                    href={c.linkedin}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-9 h-9 border border-slate-200 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:border-blue-600 transition-all"
                                >
                                    <Linkedin size={16} />
                                </a>
                            )}
                        </div>
                    </div>
                ))}

                {/* Invite Card */}
                <a
                    href="https://github.com/sundramdotdev/bunk-learn-os"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border-2 border-dashed border-slate-300 p-6 md:p-8 flex flex-col items-center justify-center gap-4 text-center hover:border-slate-900 hover:bg-slate-50 transition-all duration-300 group min-h-[200px] md:min-h-[240px]"
                >
                    <div className="w-12 h-12 md:w-14 md:h-14 border-2 border-dashed border-slate-300 group-hover:border-slate-900 flex items-center justify-center text-slate-300 group-hover:text-slate-900 transition-all text-3xl font-thin">
                        +
                    </div>
                    <div>
                        <h3 className="text-sm font-black tracking-tight text-slate-500 group-hover:text-slate-900 transition-colors">
                            Your Name Here
                        </h3>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-1">
                            Contribute & Get Featured
                        </p>
                    </div>
                </a>
            </div>
        </div>
    );
}
