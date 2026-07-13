import React from 'react';
import { useSEO } from '../../hooks/useSEO';
import { Route, Check, Clock } from 'lucide-react';

export default function RoadmapPage() {
    useSEO({
        title: 'Roadmap',
        description: 'View the development roadmap for Bunk & Learn Hub.',
        keywords: 'roadmap, future, plans, development'
    });

    const PHASES = [
        {
            title: "Phase 1: Operating Systems",
            status: "completed",
            items: [
                "CPU Scheduling Simulator",
                "Memory Management (First/Best Fit)",
                "Disk Scheduling",
                "Page Replacement",
                "Banker's Algorithm",
                "Number System Converter"
            ]
        },
        {
            title: "Phase 2: Algorithms & Developer Tools",
            status: "completed",
            items: [
                "Binary Tree Traversal Visualizer",
                "Graph Algorithm Visualizer",
                "Browser-based Linux Terminal",
                "Regex & API Playgrounds",
                "Full Networking Simulator Suite"
            ]
        },
        {
            title: "Phase 3: Backends & Databases",
            status: "upcoming",
            items: [
                "Cloud Saves (Share custom graphs via shortlinks)",
                "Sorting Algorithms Visualizer",
                "Machine Learning Basics (Neural Network pass)",
                "Relational Databases (SQL Playground via SQLite WASM)"
            ]
        }
    ];

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto">
            <header className="border-b border-slate-200 pb-8">
                <div className="inline-flex items-center gap-2 border border-slate-200 bg-white px-4 py-2 text-[10px] font-bold uppercase tracking-[0.25em] text-slate-500 shadow-sm mb-6">
                    <Route size={12} className="text-slate-900" />
                    The Future
                </div>
                <h1 className="text-3xl md:text-5xl font-black font-mono tracking-tighter text-slate-900 leading-[0.9] mb-6">
                    Project Roadmap
                </h1>
                <p className="text-lg text-slate-500 font-medium leading-relaxed max-w-2xl">
                    Our vision for expanding the Bunk & Learn Hub. We're constantly adding new modules to cover the breadth of a Computer Science degree.
                </p>
            </header>

            <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
                
                {PHASES.map((phase, idx) => (
                    <div key={idx} className={`relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active`}>
                        <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-slate-900 text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                            {phase.status === 'completed' ? <Check size={16} /> : <Clock size={16} />}
                        </div>
                        <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white border border-slate-200 p-6 shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-black text-lg text-slate-900">{phase.title}</h3>
                                <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-1 ${phase.status === 'completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                                    {phase.status}
                                </span>
                            </div>
                            <ul className="space-y-2">
                                {phase.items.map((item, i) => (
                                    <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                                        <div className="w-1.5 h-1.5 bg-slate-400 rounded-full mt-1.5 shrink-0" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
