import React from 'react';
import { useSEO } from '../../hooks/useSEO';
import { Info, Code, CheckCircle2 } from 'lucide-react';

export default function VersionPage() {
    useSEO({
        title: 'Version History',
        description: 'Check the latest version and release notes for Bunk & Learn Hub.',
        keywords: 'version, release notes, changelog'
    });

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-3xl mx-auto">
            <header className="border-b border-slate-200 pb-8">
                <div className="inline-flex items-center gap-2 border border-slate-200 bg-white px-4 py-2 text-[10px] font-bold uppercase tracking-[0.25em] text-slate-500 shadow-sm mb-6">
                    <Info size={12} className="text-slate-900" />
                    System Info
                </div>
                <h1 className="text-3xl md:text-5xl font-black font-mono tracking-tighter text-slate-900 leading-[0.9] mb-6">
                    Version v3.0.0
                </h1>
                <p className="text-sm text-slate-500 font-medium">
                    Released: July 2026
                </p>
            </header>

            <div className="bg-slate-50 border border-slate-200 p-6 md:p-8 flex flex-col md:flex-row gap-8 justify-between items-start">
                <div>
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Build Details</h3>
                    <ul className="space-y-2 font-mono text-xs text-slate-900">
                        <li><strong>UI Engine:</strong> React 19</li>
                        <li><strong>Build Tool:</strong> Vite 6</li>
                        <li><strong>Styling:</strong> Tailwind CSS v4</li>
                        <li><strong>Icons:</strong> Lucide React</li>
                    </ul>
                </div>
                
                <div className="w-full md:w-auto">
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">System Status</h3>
                    <div className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2">
                        <CheckCircle2 size={16} className="text-emerald-500" />
                        <span className="text-xs font-bold font-mono">All Systems Operational</span>
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                <h2 className="text-2xl font-black tracking-tight text-slate-900">Release Notes</h2>
                
                <div className="border-l-4 border-slate-900 pl-6 space-y-4">
                    <h3 className="text-lg font-black font-mono">v3.0.0 (Flagship Release)</h3>
                    <ul className="list-disc list-outside ml-4 space-y-2 text-sm text-slate-600">
                        <li><strong>Networking Simulator</strong>: Added a massive 8-module suite including Packet tracing, OSI Model, TCP/UDP streams, DNS resolution, HTTP anatomizer, IP Routing (Shortest Path), and Congestion visualizer.</li>
                        <li><strong>Developer Tools</strong>: Added a browser-based Linux Terminal Simulator with a virtual in-memory file system.</li>
                        <li><strong>Regex Playground</strong>: Added a live regex matcher with character class explanations and flag toggling.</li>
                        <li><strong>API Playground</strong>: Added a REST API simulator mocking GET/POST/PUT/PATCH/DELETE requests and network animations.</li>
                        <li><strong>Data Structures</strong>: Added Binary Tree layout generator and animated traversals.</li>
                        <li><strong>Algorithms</strong>: Added interactive Graph Visualizer with BFS, DFS, and Dijkstra.</li>
                        <li><strong>Documentation</strong>: Integrated informational website pages directly into the sidebar.</li>
                    </ul>
                </div>

                <div className="border-l-4 border-slate-300 pl-6 space-y-4 opacity-70">
                    <h3 className="text-lg font-black font-mono">v2.0.0</h3>
                    <ul className="list-disc list-outside ml-4 space-y-2 text-sm text-slate-600">
                        <li>Memory Allocation (First Fit, Best Fit).</li>
                        <li>Page Replacement algorithms.</li>
                        <li>Disk Scheduling algorithms.</li>
                        <li>Banker's Algorithm matrix visualizer.</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
