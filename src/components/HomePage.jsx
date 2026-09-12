import React from 'react';
import { Cpu, Monitor, Brain, ArrowRight, ChevronRight, Sparkles, Users, BookOpen, GitBranch, Terminal, Network, Database, Code2 } from 'lucide-react';

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

const HeroShowcase = () => {
    return (
        <div className="relative w-full h-full flex items-center justify-center">
            <style>{`
                @keyframes float-1 { 0%, 100% { transform: translateY(0px) rotate(-2deg); } 50% { transform: translateY(-15px) rotate(-1deg); } }
                @keyframes float-2 { 0%, 100% { transform: translateY(0px) rotate(3deg); } 50% { transform: translateY(-10px) rotate(4deg); } }
                @keyframes float-3 { 0%, 100% { transform: translateY(0px) rotate(-1deg); } 50% { transform: translateY(-12px) rotate(-2deg); } }
                @keyframes typing { from { width: 0 } to { width: 100% } }
                @keyframes blink-caret { from, to { border-color: transparent } 50% { border-color: white; } }
                @keyframes shine { 100% { transform: translateX(150%) skewX(-45deg); } }
                @keyframes float-alt { 0%, 100% { transform: translateY(0px) rotate(2deg); } 50% { transform: translateY(-8px) rotate(-1deg); } }
            `}</style>
            
            <div className="relative w-full max-w-lg aspect-square">
                {/* Background decorative glows */}
                <div className="absolute top-1/4 left-1/4 w-48 h-48 bg-indigo-500 rounded-full blur-[80px] opacity-20"></div>
                <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-rose-500 rounded-full blur-[80px] opacity-10"></div>
                <div className="absolute top-1/2 right-1/4 w-32 h-32 bg-emerald-500 rounded-full blur-[60px] opacity-10"></div>

                {/* 1. Terminal Window (Top Left) */}
                <div className="absolute top-[10%] left-0 w-72 bg-slate-900 rounded-lg shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] overflow-hidden border border-slate-700/50 z-20" style={{ animation: 'float-1 6s ease-in-out infinite' }}>
                    <div className="bg-slate-800 px-3 py-2 flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-rose-500"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                        <div className="text-[9px] font-mono text-slate-400 ml-2">bunk-learn-os — bash</div>
                    </div>
                    <div className="p-4 font-mono text-[11px] text-emerald-400">
                        <div className="flex">
                            <span className="text-rose-400 mr-2">➜</span>
                            <span className="text-blue-400 mr-2">~/learn</span>
                            <span className="text-white overflow-hidden whitespace-nowrap border-r-2 border-white pr-1" style={{ animation: 'typing 3.5s steps(30, end) infinite, blink-caret .75s step-end infinite', width: 'fit-content', display: 'inline-block' }}>
                                ./simulate --os cpu-scheduler
                            </span>
                        </div>
                        <div className="text-slate-400 mt-2 opacity-0" style={{ animation: 'fade-in 0.1s forwards 3.5s' }}>Loading interactive modules...</div>
                        <div className="text-emerald-400 opacity-0" style={{ animation: 'fade-in 0.1s forwards 4s' }}>Ready. GUI launched.</div>
                    </div>
                </div>

                {/* 2. CPU Gantt Chart (Center Right) */}
                <div className="absolute top-[35%] right-[-10%] w-80 bg-white/80 backdrop-blur-md rounded-xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] border border-slate-200/80 p-4 z-30" style={{ animation: 'float-2 7s ease-in-out infinite 1s' }}>
                    <div className="flex items-center gap-2 mb-3">
                        <div className="bg-indigo-100 p-1.5 rounded-md text-indigo-600"><Cpu size={14} /></div>
                        <span className="text-xs font-bold text-slate-800">CPU Scheduling (Round Robin)</span>
                    </div>
                    <div className="w-full bg-slate-100 h-10 rounded-md overflow-hidden flex shadow-inner">
                        <div className="h-full bg-blue-500 w-[30%] flex items-center justify-center text-[10px] font-bold text-white border-r border-blue-600/50">P1</div>
                        <div className="h-full bg-emerald-500 w-[20%] flex items-center justify-center text-[10px] font-bold text-white border-r border-emerald-600/50">P3</div>
                        <div className="h-full bg-amber-500 w-[40%] flex items-center justify-center text-[10px] font-bold text-white border-r border-amber-600/50">P2</div>
                        <div className="h-full bg-rose-500 w-[10%] flex items-center justify-center text-[10px] font-bold text-white">P4</div>
                    </div>
                    <div className="flex justify-between mt-1 px-1 text-[9px] text-slate-400 font-mono">
                        <span>0</span><span>30</span><span>50</span><span>90</span><span>100</span>
                    </div>
                </div>

                {/* 3. Memory Grid (Bottom Left) */}
                <div className="absolute bottom-[5%] left-[5%] w-60 bg-white/90 backdrop-blur-md rounded-xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] border border-slate-200/80 p-4 z-20" style={{ animation: 'float-3 8s ease-in-out infinite 2s' }}>
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <div className="bg-emerald-100 p-1.5 rounded-md text-emerald-600"><Database size={14} /></div>
                            <span className="text-xs font-bold text-slate-800">RAM Grid</span>
                        </div>
                        <span className="text-[10px] font-mono text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Paged</span>
                    </div>
                    <div className="grid grid-cols-4 gap-1.5">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                            <div key={i} className={`h-8 rounded-[4px] border ${[1,2,5].includes(i) ? 'bg-indigo-50 border-indigo-200' : [3,7].includes(i) ? 'bg-rose-50 border-rose-200' : 'bg-slate-50 border-slate-200'} flex items-center justify-center`}>
                                { [1,2,5].includes(i) && <div className="w-4 h-4 rounded-sm bg-indigo-400/50 flex items-center justify-center text-[8px] font-bold text-indigo-700">P1</div> }
                                { [3,7].includes(i) && <div className="w-4 h-4 rounded-sm bg-rose-400/50 flex items-center justify-center text-[8px] font-bold text-rose-700">P2</div> }
                            </div>
                        ))}
                    </div>
                </div>

                {/* 4. Network Packet (Top Right - Small) */}
                <div className="absolute top-[0%] right-[10%] bg-slate-900 text-white rounded-xl shadow-2xl border border-slate-700/50 p-3 z-10 flex items-center gap-3" style={{ animation: 'float-1 5s ease-in-out infinite 1.5s' }}>
                    <div className="bg-slate-800 p-2 rounded-lg">
                        <Network size={16} className="text-cyan-400" />
                    </div>
                    <div>
                        <div className="text-[10px] text-slate-400 font-mono">TCP / IP</div>
                        <div className="text-xs font-bold tracking-tight">Packet Analyzer</div>
                    </div>
                </div>
                {/* 5. Code Snippet (Background Right) */}
                <div className="absolute top-[65%] right-[0%] w-48 bg-slate-900/90 backdrop-blur-md rounded-xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.3)] border border-slate-700/50 p-3 z-10" style={{ animation: 'float-alt 9s ease-in-out infinite 3s' }}>
                    <div className="flex gap-1.5 mb-2">
                        <div className="w-2 h-2 rounded-full bg-slate-600"></div>
                        <div className="w-2 h-2 rounded-full bg-slate-600"></div>
                    </div>
                    <div className="font-mono text-[9px] leading-relaxed text-slate-300">
                        <span className="text-rose-400">function</span> <span className="text-blue-400">schedule</span>() {'{'} <br/>
                        &nbsp;&nbsp;<span className="text-indigo-400">const</span> q = <span className="text-emerald-400">new</span> Queue();<br/>
                        &nbsp;&nbsp;<span className="text-rose-400">while</span>(!q.isEmpty) {'{'}<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;cpu.execute(q.pop());<br/>
                        &nbsp;&nbsp;{'}'}<br/>
                        {'}'}
                    </div>
                </div>
            </div>
        </div>
    );
};


export default function HomePage({ setView, onOpenSidebar }) {
    return (
        <div className="space-y-12 md:space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* === HERO === */}
            <section className="relative min-h-[80vh] py-8 lg:py-0 grid lg:grid-cols-2 gap-12 items-center">
                <div className="max-w-3xl space-y-8 relative z-10">
                    <div className="flex flex-wrap items-center gap-4">
                        <div className="inline-flex items-center gap-2 border border-slate-200 bg-white px-4 py-2 text-[10px] font-bold uppercase tracking-[0.25em] text-slate-500 shadow-sm rounded-full hover:shadow-md transition-shadow cursor-default">
                            <Sparkles size={12} className="text-amber-500" />
                            <span className="bg-gradient-to-r from-indigo-500 to-rose-500 text-transparent bg-clip-text font-black">Open-Source</span> Educational Platform
                        </div>
                        <div className="inline-flex items-center gap-2 border border-emerald-200/50 bg-emerald-50 px-3 py-1.5 text-[9px] font-bold uppercase tracking-widest text-emerald-600 rounded-full cursor-default">
                            <div className="relative flex h-2 w-2 items-center justify-center">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                            </div>
                            System Online
                        </div>
                    </div>

                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-black font-mono tracking-tighter text-slate-900 leading-[0.9]">
                        Bunk &<br />Learn <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-cyan-500">Hub</span>
                    </h1>

                    <p className="text-lg md:text-xl text-slate-500 leading-relaxed max-w-xl font-medium">
                        Ditch the boring textbooks. Master OS, Networking, and Data Structures through <span className="font-bold text-slate-900 bg-indigo-100 px-2 py-0.5 rounded-md">interactive visual simulators</span>. Built by students, for students.
                    </p>

                    <div className="flex gap-4 items-center pt-2">
                         <div className="flex -space-x-3">
                              <div className="w-10 h-10 rounded-full border-2 border-white bg-indigo-50 flex items-center justify-center text-[10px] font-black text-indigo-600 shadow-sm z-30">OS</div>
                              <div className="w-10 h-10 rounded-full border-2 border-white bg-rose-50 flex items-center justify-center text-[10px] font-black text-rose-600 shadow-sm z-20">DB</div>
                              <div className="w-10 h-10 rounded-full border-2 border-white bg-emerald-50 flex items-center justify-center text-[10px] font-black text-emerald-600 shadow-sm z-10">NET</div>
                         </div>
                         <div className="text-[11px] font-black text-slate-400 tracking-widest uppercase">
                            Over 15+ Modules <br/> Ready to Simulate
                         </div>
                    </div>

                    <div className="flex flex-wrap gap-4 pt-4">
                        <button
                            onClick={onOpenSidebar}
                            className="relative overflow-hidden inline-flex items-center gap-3 bg-slate-900 text-white px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] hover:bg-slate-800 transition-all active:translate-y-px group rounded-xl shadow-[0_10px_40px_-10px_rgba(15,23,42,0.5)]"
                        >
                            <span className="relative z-10 flex items-center gap-3">
                                Launch Simulator
                                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                            </span>
                            {/* Shiny sweep effect on hover */}
                            <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-[150%] skew-x-[-45deg] group-hover:animate-[shine_1.5s_ease-out_infinite]"></div>
                        </button>
                        <button
                            onClick={() => setView('Contributors')}
                            className="inline-flex items-center gap-3 bg-white border-2 border-slate-200 text-slate-700 px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] hover:bg-slate-50 hover:border-slate-900 hover:shadow-lg hover:-translate-y-0.5 transition-all group rounded-xl shadow-sm"
                        >
                            <Users size={16} />
                            Contributors
                        </button>
                    </div>
                </div>

                {/* Right side interactive graphic */}
                <div className="hidden lg:block relative w-full h-full min-h-[500px]">
                    <HeroShowcase />
                </div>

                {/* Decorative grid lines in background */}
                <div className="absolute inset-0 pointer-events-none opacity-[0.02] -z-10">
                    <div className="w-full h-full" style={{
                        backgroundImage: 'repeating-linear-gradient(0deg, #0f172a 0px, #0f172a 1px, transparent 1px, transparent 40px), repeating-linear-gradient(90deg, #0f172a 0px, #0f172a 1px, transparent 1px, transparent 40px)',
                    }} />
                </div>
            </section>

            {/* === SCROLLING MARQUEE TAPE === */}
            <div className="w-screen relative left-1/2 -translate-x-1/2 bg-slate-900 py-4 overflow-hidden -rotate-1 shadow-[0_20px_50px_-12px_rgba(15,23,42,0.5)] z-20 !mt-4 md:!mt-8 mb-12">
                <style>{`
                    @keyframes scroll {
                        0% { transform: translateX(0); }
                        100% { transform: translateX(-50%); }
                    }
                `}</style>
                <div className="flex whitespace-nowrap animate-[scroll_30s_linear_infinite]" style={{ width: '200%' }}>
                    {[1, 2].map((i) => (
                        <div key={i} className="flex items-center text-xs font-black font-mono text-slate-400 uppercase tracking-[0.3em] gap-12 px-6">
                            <span><span className="text-rose-500">KERNEL</span> PANIC</span> <span>///</span>
                            <span>TCP HANDSHAKE</span> <span>///</span>
                            <span><span className="text-emerald-500">O(N LOG N)</span> TIME</span> <span>///</span>
                            <span>PAGE FAULT</span> <span>///</span>
                            <span>MUTEX LOCK</span> <span>///</span>
                            <span><span className="text-indigo-500">ROUND ROBIN</span></span> <span>///</span>
                            <span>DEADLOCK AVOIDANCE</span> <span>///</span>
                            <span><span className="text-amber-500">DNS SPOOFING</span></span> <span>///</span>
                            <span>BYTECODE</span> <span>///</span>
                        </div>
                    ))}
                </div>
            </div>

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
                    {SUBJECTS.map((subject) => {
                        // Extracting base color from accent string for glow effects (e.g., 'border-blue-600' -> 'blue-500')
                        const colorPrefix = subject.accent.split('-')[1] || 'slate';
                        
                        return (
                        <button
                            key={subject.id}
                            onClick={() => setView(subject.firstView)}
                            className="group relative text-left bg-white border border-slate-200 p-8 space-y-6 transition-all duration-500 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] hover:-translate-y-2 cursor-pointer overflow-hidden rounded-2xl"
                        >
                            {/* Hover background glow */}
                            <div className={`absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-500 bg-${colorPrefix}-500`}></div>
                            
                            {/* Decorative Top Line */}
                            <div className={`absolute top-0 left-0 w-full h-1 bg-slate-100 group-hover:bg-${colorPrefix}-500 transition-colors duration-500`}></div>

                            <div className="relative z-10 flex items-center justify-between">
                                <div className={`w-14 h-14 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center text-slate-900 group-hover:bg-${colorPrefix}-500 group-hover:text-white group-hover:border-${colorPrefix}-500 transition-all duration-500 group-hover:scale-110 group-hover:-rotate-3 shadow-sm`}>
                                    {subject.icon}
                                </div>
                                <div className="w-8 h-8 rounded-full border border-slate-100 bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-slate-900 group-hover:text-white group-hover:border-slate-900 transition-all duration-500">
                                    <ChevronRight size={16} className="group-hover:translate-x-0.5 transition-all" />
                                </div>
                            </div>
                            
                            <div className="relative z-10 space-y-3">
                                <h3 className="text-lg font-black tracking-tight text-slate-900">
                                    {subject.title}
                                </h3>
                                <p className="text-xs text-slate-500 leading-relaxed font-medium line-clamp-2">
                                    {subject.description}
                                </p>
                            </div>

                            <div className="relative z-10 flex items-center gap-2 pt-4 border-t border-slate-100 mt-auto">
                                <div className="flex items-center justify-center w-5 h-5 rounded bg-slate-100 text-slate-400 group-hover:bg-slate-200 group-hover:text-slate-700 transition-colors">
                                    <BookOpen size={10} />
                                </div>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 group-hover:text-slate-700 transition-colors">
                                    {subject.moduleCount} Modules
                                </span>
                            </div>
                        </button>
                    )})}
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
