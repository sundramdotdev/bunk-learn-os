import React from 'react';
import { 
    Monitor, 
    Cpu, 
    Menu, 
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
    CircuitBoard 
} from 'lucide-react';

export default function Sidebar({ currentView, setView, isOpen, setIsOpen }) {
    // Note: isOpen and setIsOpen are passed from App.jsx to manage layout transitions,
    // but the component effectively acts as the local controller for the mobile view.

    const SUBJECTS = [
        {
            group: "Computer Fundamentals",
            icon: <Monitor size={18} />,
            items: [
                { id: 'Fundamentals', label: "Number System Converter", icon: <Hash size={14} /> },
                { id: 'MemoryHierarchy', label: "Memory Hierarchy", icon: <Layers size={14} />, comingSoon: true },
            ]
        },
        {
            group: "Digital Aptitude & Logic",
            icon: <Brain size={18} />,
            items: [
                { id: 'StackLIFO', label: "Stack & LIFO", icon: <Boxes size={14} /> },
                { id: 'QueueFIFO', label: "Queue & FIFO", icon: <Boxes size={14} /> },
                { id: 'MemoryLayout', label: "Memory Layout", icon: <Database size={14} /> },
                { id: 'LogicGates', label: "Logic Gates", icon: <CircuitBoard size={14} />, comingSoon: true },
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
        }
    ];

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-40 lg:hidden transition-opacity duration-300"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar Container */}
            <aside className={`fixed top-0 left-0 h-screen w-72 bg-white border-r border-slate-200 z-50 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                
                {/* Header / Logo */}
                <div className="h-20 flex items-center justify-between px-6 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-900 text-white flex items-center justify-center">
                            <Cpu size={24} strokeWidth={2.5} />
                        </div>
                        <div className="flex flex-col">
                            <h1 className="text-sm font-black font-mono tracking-tighter text-slate-900 leading-none">
                                BUNK & LEARN
                            </h1>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">HUB_v2.0</span>
                        </div>
                    </div>
                    
                    {/* Mobile Close Button (X) */}
                    <button 
                        onClick={() => setIsOpen(false)}
                        className="lg:hidden p-2 text-slate-400 hover:text-slate-900 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Navigation Content */}
                <div className="p-4 h-[calc(100vh-80px)] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200">
                    <nav className="space-y-8">
                        {SUBJECTS.map((subject, idx) => (
                            <div key={idx} className="space-y-3">
                                <div className="flex items-center gap-2.5 px-3 py-1 text-slate-900">
                                    {subject.icon}
                                    <h2 className="text-[10px] font-black uppercase tracking-[0.2em]">
                                        {subject.group}
                                    </h2>
                                </div>
                                
                                <div className="space-y-1">
                                    {subject.items.map((item) => (
                                        <button
                                            key={item.id}
                                            disabled={item.comingSoon}
                                            onClick={() => {
                                                setView(item.id);
                                                setIsOpen(false);
                                            }}
                                            className={`w-full flex items-center justify-between px-3 py-2.5 text-xs font-bold transition-all group ${
                                                currentView === item.id
                                                    ? 'bg-zinc-100 border-l-4 border-zinc-900 text-zinc-900'
                                                    : 'text-slate-500 hover:bg-slate-50 border-l-4 border-transparent'
                                            } ${item.comingSoon ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
                                        >
                                            <div className="flex items-center gap-3">
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
                <div className="absolute bottom-0 left-0 w-full p-4 border-t border-slate-50 bg-slate-50/50">
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">System_Online</span>
                    </div>
                </div>
            </aside>
        </>
    );
}
