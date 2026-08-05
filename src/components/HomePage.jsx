import React from 'react';
import { Cpu, Monitor, Brain, ArrowRight, ChevronRight, Sparkles, Users, BookOpen, GitBranch, Terminal, Network } from 'lucide-react';

const SUBJECTS = [
    {
        id: 'networking',
        title: 'Computer Networking',
        description: 'Packet simulator, OSI Model breakdown, TCP/UDP streams, DNS resolution, and IP Routing visualizer.',
        icon: <Network size={28} />,
        moduleCount: 8,
        firstView: 'Networking',
        accent: 'border-blue-600',
    },
    {
        id: 'developer-tools',
        title: 'Developer Tools',
        description: 'Browser-based Linux Terminal Simulator, Regex Editor, and API Playground.',
        icon: <Terminal size={28} />,
        moduleCount: 3,
        firstView: 'Terminal',
        accent: 'border-indigo-600',
    },
    {
        id: 'data-structures',
        title: 'Data Structures',
        description: 'Binary Trees, AVL Trees, Heaps, and Graph Algorithm visualizers with step-by-step interactive animations.',
        icon: <GitBranch size={28} />,
        moduleCount: 2,
        firstView: 'BinaryTree',
        accent: 'border-emerald-600',
    },
    {
        id: 'os',
        title: 'Operating Systems',
        description: 'CPU Scheduling, Memory Allocation, Page Replacement, Disk Scheduling, and Deadlock Avoidance simulations with step-by-step breakdowns.',
        icon: <Cpu size={28} />,
        moduleCount: 5,
        firstView: 'CPU',
        accent: 'border-slate-900',
    },
    {
        id: 'fundamentals',
        title: 'Computer Fundamentals',
        description: 'Number System conversions between Decimal, Binary, Octal, Hex, and ASCII with educational division-trace logic.',
        icon: <Monitor size={28} />,
        moduleCount: 2,
        firstView: 'Fundamentals',
        accent: 'border-zinc-700',
    },
    {
        id: 'aptitude',
        title: 'Digital Aptitude & Logic',
        description: 'Interactive Stack/Queue visualizers, Memory Layout diagrams, and Logic Gate simulators for competitive exam prep.',
        icon: <Brain size={28} />,
        moduleCount: 4,
        firstView: 'StackLIFO',
        accent: 'border-zinc-500',
    },
];

const MILESTONES = [
    { phase: '01', title: 'OS Lab Project', detail: 'Started as a CPU Scheduling visualizer for our university lab.' },
    { phase: '02', title: 'Multi-Module Platform', detail: 'Expanded to Memory, Disk, Page Replacement, and Deadlock modules.' },
    { phase: '03', title: 'Community Hub', detail: 'Rebranded to a multi-subject educational platform open to contributors.' },
];

export default function HomePage({ setView }) {
    return (
        <div className="space-y-24 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* === HERO === */}
            <section className="relative pt-8 pb-16 md:pt-16 md:pb-24">
                <div className="max-w-3xl space-y-8">
                    <div className="inline-flex items-center gap-2 border border-slate-200 bg-white px-4 py-2 text-[10px] font-bold uppercase tracking-[0.25em] text-slate-500 shadow-sm">
                        <Sparkles size={12} className="text-slate-900" />
                        Open-Source Educational Platform
                    </div>

                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-black font-mono tracking-tighter text-slate-900 leading-[0.9]">
                        Bunk &<br />Learn Hub
                    </h1>

                    <p className="text-lg md:text-xl text-slate-500 leading-relaxed max-w-xl font-medium">
                        An interactive, visual-first platform for mastering Computer Science fundamentals. Built by students, for students.
                    </p>

                    <div className="flex flex-wrap gap-4 pt-4">
                        <button
                            onClick={() => setView('CPU')}
                            className="inline-flex items-center gap-3 bg-slate-900 text-white px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] hover:bg-slate-800 transition-all active:translate-y-px group"
                        >
                            Launch Simulator
                            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                        <button
                            onClick={() => setView('Contributors')}
                            className="inline-flex items-center gap-3 border border-slate-300 text-slate-700 px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] hover:bg-slate-50 hover:border-slate-900 transition-all group"
                        >
                            <Users size={16} />
                            Contributors
                        </button>
                    </div>
                </div>

                {/* Decorative grid lines */}
                <div className="absolute top-0 right-0 w-1/3 h-full hidden xl:block pointer-events-none opacity-[0.03]">
                    <div className="w-full h-full" style={{
                        backgroundImage: 'repeating-linear-gradient(0deg, #0f172a 0px, #0f172a 1px, transparent 1px, transparent 40px), repeating-linear-gradient(90deg, #0f172a 0px, #0f172a 1px, transparent 1px, transparent 40px)',
                    }} />
                </div>
            </section>

            {/* === SUBJECTS GRID === */}
            <section className="space-y-12">
                <div className="space-y-3">
                    <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                        Available Subjects
                    </h2>
                    <p className="text-2xl md:text-3xl font-black font-mono tracking-tighter text-slate-900">
                        Pick a domain. Start learning.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {SUBJECTS.map((subject) => (
                        <button
                            key={subject.id}
                            onClick={() => setView(subject.firstView)}
                            className={`group text-left bg-white border-2 border-slate-200 hover:${subject.accent} p-8 space-y-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 active:translate-y-0 cursor-pointer`}
                        >
                            <div className="flex items-center justify-between">
                                <div className="w-14 h-14 bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-900 group-hover:bg-slate-900 group-hover:text-white group-hover:border-slate-900 transition-all duration-300">
                                    {subject.icon}
                                </div>
                                <ChevronRight size={20} className="text-slate-300 group-hover:text-slate-900 group-hover:translate-x-1 transition-all" />
                            </div>

                            <div className="space-y-3">
                                <h3 className="text-lg font-black tracking-tight text-slate-900">
                                    {subject.title}
                                </h3>
                                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                                    {subject.description}
                                </p>
                            </div>

                            <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                                <BookOpen size={12} className="text-slate-400" />
                                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                                    {subject.moduleCount} Modules
                                </span>
                            </div>
                        </button>
                    ))}
                </div>
            </section>

            {/* === OUR STORY === */}
            <section className="space-y-12">
                <div className="space-y-3">
                    <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                        Our Story
                    </h2>
                    <p className="text-2xl md:text-3xl font-black font-mono tracking-tighter text-slate-900">
                        From OS lab to open-source hub.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {MILESTONES.map((m) => (
                        <div key={m.phase} className="relative bg-white border border-slate-200 p-8 space-y-4 group hover:border-slate-900 transition-all">
                            <span className="text-5xl font-black font-mono text-slate-100 group-hover:text-slate-200 transition-colors leading-none">
                                {m.phase}
                            </span>
                            <h3 className="text-sm font-black uppercase tracking-tight text-slate-900">
                                {m.title}
                            </h3>
                            <p className="text-xs text-slate-500 leading-relaxed font-medium">
                                {m.detail}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* === CTA === */}
            <section className="bg-slate-900 text-white p-12 md:p-16 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="space-y-3">
                    <h2 className="text-2xl md:text-3xl font-black font-mono tracking-tighter">
                        Ready to contribute?
                    </h2>
                    <p className="text-sm text-slate-400 max-w-md font-medium">
                        Bunk & Learn Hub is open-source. Add a new module, fix a bug, or improve the docs. Every contribution counts.
                    </p>
                </div>
                <a
                    href="https://github.com/sundramdotdev/bunk-learn-os"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 bg-white text-slate-900 px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] hover:bg-slate-100 transition-all shrink-0 group"
                >
                    View on GitHub
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </a>
            </section>
        </div>
    );
}
