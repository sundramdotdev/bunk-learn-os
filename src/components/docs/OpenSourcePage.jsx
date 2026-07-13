import React from 'react';
import { useSEO } from '../../hooks/useSEO';
import { Github, Code2, Users, ArrowRight } from 'lucide-react';

export default function OpenSourcePage() {
    useSEO({
        title: 'Open Source',
        description: 'Learn how to contribute to Bunk & Learn Hub, an open-source platform.',
        keywords: 'open source, contribute, github, react, bunk and learn'
    });

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto">
            <header className="border-b border-slate-200 pb-8">
                <div className="inline-flex items-center gap-2 border border-slate-200 bg-white px-4 py-2 text-[10px] font-bold uppercase tracking-[0.25em] text-slate-500 shadow-sm mb-6">
                    <Code2 size={12} className="text-slate-900" />
                    Open Source
                </div>
                <h1 className="text-3xl md:text-5xl font-black font-mono tracking-tighter text-slate-900 leading-[0.9] mb-6">
                    Built by the Community
                </h1>
                <p className="text-lg text-slate-500 font-medium leading-relaxed max-w-2xl">
                    Bunk & Learn Hub thrives on collaboration. Whether you are fixing a typo, optimizing a mathematical simulation, or building an entirely new module from scratch, your contributions are welcome.
                </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white border border-slate-200 p-6 md:p-8 space-y-4 hover:border-slate-900 transition-colors group">
                    <Github size={24} className="text-slate-900" />
                    <h2 className="text-lg font-black tracking-tight text-slate-900">Fork & Pull</h2>
                    <p className="text-sm text-slate-500 leading-relaxed">
                        Our entire codebase is hosted on GitHub. To contribute, simply fork the repository, create a branch, write your code, and submit a Pull Request.
                    </p>
                    <a href="https://github.com/sundramdotdev/bunk-learn-os" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-900 group-hover:text-blue-600 transition-colors pt-4">
                        View Repository <ArrowRight size={14} />
                    </a>
                </div>

                <div className="bg-white border border-slate-200 p-6 md:p-8 space-y-4 hover:border-slate-900 transition-colors group">
                    <Users size={24} className="text-slate-900" />
                    <h2 className="text-lg font-black tracking-tight text-slate-900">Community Guidelines</h2>
                    <p className="text-sm text-slate-500 leading-relaxed">
                        We adhere to a strict Code of Conduct to ensure a welcoming and inclusive environment. Read our guidelines before contributing.
                    </p>
                    <a href="https://github.com/sundramdotdev/bunk-learn-os/blob/main/CODE_OF_CONDUCT.md" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-900 group-hover:text-blue-600 transition-colors pt-4">
                        Read Guidelines <ArrowRight size={14} />
                    </a>
                </div>
            </div>

            <div className="bg-slate-900 text-white p-8 md:p-12 mt-12 flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                    <h2 className="text-2xl font-black font-mono tracking-tighter mb-2">Want recognition?</h2>
                    <p className="text-slate-400 text-sm max-w-md">
                        Contributors who submit merged PRs are automatically added to our Hall of Fame on the Contributors page.
                    </p>
                </div>
                <a href="https://github.com/sundramdotdev/bunk-learn-os/issues" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 bg-white text-slate-900 px-6 py-3 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-slate-100 transition-colors whitespace-nowrap">
                    Find an Issue
                </a>
            </div>
        </div>
    );
}
