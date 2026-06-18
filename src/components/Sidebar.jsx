import React from 'react';
import { 
    Monitor, 
    Cpu, 
    X, 
    Rocket, 
    ChevronRight, 
    Hash, 
    Layers, 
    HardDrive, 
    ShieldAlert, 
    Brain, 
    Boxes, 
    Database, 
    CircuitBoard,
    Home,
    Users,
    Sigma,
    Grid,
    Activity
} from 'lucide-react';

export default function Sidebar({ currentView, setView, isOpen, setIsOpen }) {

    const SUBJECTS = [
        {
            group: "Computer Fundamentals",
            icon: <Monitor size={18} />,
            items: [
                { id: 'Fundamentals', label: "Number System Converter", icon: <Hash size={14} /> },
                { id: 'MemoryHierarchy', label: "Memory Hierarchy", icon: <Layers size={14} /> },
            ]
        },
        {
            group: "Digital Aptitude & Logic",
            icon: <Brain size={18} />,
            items: [
                { id: 'StackLIFO', label: "Stack & LIFO", icon: <Boxes size={14} /> },
                { id: 'QueueFIFO', label: "Queue & FIFO", icon: <Boxes size={14} /> },
                { id: 'MemoryLayout', label: "Memory Layout", icon: <Database size={14} /> },
                { id: 'LogicGates', label: "Logic Gates", icon: <CircuitBoard size={14} /> },
            ]
        },
        {
            group: "Operating Systems",
            icon: <Cpu size={18} />,
            items: [
                { id: 'CPU', label: "CPU Scheduling", icon: <Rocket size={14} /> },
                { id: 'Memory', label: "Memory Allocation", icon: <Layers size={14} /> },
                { id: 'Page', label: "Page Replacement", icon: <Layers size={14} /> },
                { id: 'Disk', label: "Disk Scheduling", icon: <HardDrive size={14} /> },
                { id: 'Deadlock', label: "Banker's Algorithm", icon: <ShieldAlert size={14} /> },
            ]
        },
        {
            group: "Mathematics",
            icon: <Sigma size={18} />,
            items: [
                { id: 'LinearAlgebra', label: "Linear Algebra (Vectors & Matrices)", icon: <Grid size={14} /> },
                { id: 'Calculus', label: "Calculus (Derivatives & Area)", icon: <Activity size={14} /> },
            ]
        }
    ];

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-40 md:hidden transition-opacity duration-300"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar Container */}
            <aside className={`
                fixed top-0 left-0 h-screen w-64 bg-white border-r border-slate-200 z-50
                transform transition-transform duration-300 ease-in-out
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                md:pt-14
            `}>
                
                {/* Header / Logo */}
                <div className="h-14 flex items-center justify-between px-5 border-b border-slate-100">
                    <button 
                        onClick={() => { setView('Home'); setIsOpen(false); }}
                        className="flex items-center gap-2.5 group cursor-pointer"
                    >
                        <div className="w-8 h-8 bg-slate-900 text-white flex items-center justify-center group-hover:bg-slate-800 transition-colors">
                            <Cpu size={18} strokeWidth={2.5} />
                        </div>
                        <div className="flex flex-col">
                            <h1 className="text-[11px] font-black font-mono tracking-tighter text-slate-900 leading-none">
                                BUNK & LEARN
                            </h1>
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">HUB_v3.0</span>
                        </div>
                    </button>
                    
                    {/* Mobile Close Button (X) */}
                    <button 
                        onClick={() => setIsOpen(false)}
                        className="md:hidden p-1.5 text-slate-400 hover:text-slate-900 transition-colors cursor-pointer"
                        aria-label="Close sidebar"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Quick Links */}
                <div className="px-3 pt-3 pb-2 space-y-0.5">
                    <button
                        onClick={() => { setView('Home'); setIsOpen(false); }}
                        className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-bold transition-all group cursor-pointer ${
                            currentView === 'Home'
                                ? 'bg-zinc-100 border-l-4 border-zinc-900 text-zinc-900'
                                : 'text-slate-500 hover:bg-slate-50 border-l-4 border-transparent'
                        }`}
                    >
                        <Home size={14} className={currentView === 'Home' ? 'text-zinc-900' : 'text-slate-400 group-hover:text-slate-600'} />
                        <span className="tracking-tight">Home</span>
                    </button>
                    <button
                        onClick={() => { setView('Contributors'); setIsOpen(false); }}
                        className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-bold transition-all group cursor-pointer ${
                            currentView === 'Contributors'
                                ? 'bg-zinc-100 border-l-4 border-zinc-900 text-zinc-900'
                                : 'text-slate-500 hover:bg-slate-50 border-l-4 border-transparent'
                        }`}
                    >
                        <Users size={14} className={currentView === 'Contributors' ? 'text-zinc-900' : 'text-slate-400 group-hover:text-slate-600'} />
                        <span className="tracking-tight">Contributors</span>
                    </button>
                </div>

                <div className="mx-3 border-b border-slate-100" />

                {/* Navigation Content */}
                <div className="p-3 h-[calc(100vh-200px)] md:h-[calc(100vh-256px)] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200">
                    <nav className="space-y-6">
                        {SUBJECTS.map((subject, idx) => (
                            <div key={idx} className="space-y-2">
                                <div className="flex items-center gap-2 px-3 py-1 text-slate-900">
                                    {subject.icon}
                                    <h2 className="text-[9px] font-black uppercase tracking-[0.2em]">
                                        {subject.group}
                                    </h2>
                                </div>
                                
                                <div className="space-y-0.5">
                                    {subject.items.map((item) => (
                                        <button
                                            key={item.id}
                                            disabled={item.comingSoon}
                                            onClick={() => {
                                                setView(item.id);
                                                setIsOpen(false);
                                            }}
                                            className={`w-full flex items-center justify-between px-3 py-2 text-xs font-bold transition-all group ${
                                                currentView === item.id
                                                    ? 'bg-zinc-100 border-l-4 border-zinc-900 text-zinc-900'
                                                    : 'text-slate-500 hover:bg-slate-50 border-l-4 border-transparent'
                                            } ${item.comingSoon ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
                                        >
                                            <div className="flex items-center gap-2.5">
                                                <span className={`${currentView === item.id ? 'text-zinc-900' : 'text-slate-400 group-hover:text-slate-600'}`}>
                                                    {item.icon}
                                                </span>
                                                <span className="tracking-tight">{item.label}</span>
                                            </div>
                                            {item.comingSoon ? (
                                                <span className="text-[8px] border border-slate-300 px-1 font-mono uppercase">Soon</span>
                                            ) : (
                                                <ChevronRight size={10} className={`opacity-0 group-hover:opacity-100 transition-opacity ${currentView === item.id ? 'opacity-100' : ''}`} />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </nav>
                </div>

                {/* Status Footer */}
                <div className="absolute bottom-0 left-0 w-full p-3 border-t border-slate-50 bg-slate-50/50">
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">System_Online</span>
                    </div>
                </div>
            </aside>
        </>
    );
}
