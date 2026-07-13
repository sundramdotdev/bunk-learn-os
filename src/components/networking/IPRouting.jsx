import React, { useState } from 'react';
import { Network, ArrowRight } from 'lucide-react';

export default function IPRouting() {
    const [path, setPath] = useState([]);
    const [isSimulating, setIsSimulating] = useState(false);

    const topology = [
        { id: 'R1', x: 50, y: 150 },
        { id: 'R2', x: 200, y: 50 },
        { id: 'R3', x: 200, y: 250 },
        { id: 'R4', x: 400, y: 150 },
        { id: 'R5', x: 550, y: 150 },
    ];

    const edges = [
        { s: 'R1', t: 'R2', cost: 5 },
        { s: 'R1', t: 'R3', cost: 2 },
        { s: 'R2', t: 'R4', cost: 1 },
        { s: 'R3', t: 'R4', cost: 6 },
        { s: 'R4', t: 'R5', cost: 3 },
    ];

    const startRouting = async () => {
        setIsSimulating(true);
        setPath([]);
        
        const bestPath = ['R1', 'R2', 'R4', 'R5']; // Pre-calculated for visual demo
        const currPath = [];
        
        for (let r of bestPath) {
            currPath.push(r);
            setPath([...currPath]);
            await new Promise(res => setTimeout(res, 800));
        }
        setIsSimulating(false);
    };

    return (
        <div className="border border-slate-300 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                    <Network size={20} className="text-slate-900" />
                    <div>
                        <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-900">IP Routing</h2>
                        <span className="text-xs text-slate-500">Shortest Path (OSPF / Link State)</span>
                    </div>
                </div>
                <button 
                    onClick={startRouting} 
                    disabled={isSimulating}
                    className="bg-slate-900 text-white px-4 py-2 text-[10px] font-bold uppercase tracking-widest hover:bg-slate-800 cursor-pointer disabled:opacity-50"
                >
                    Route Packet R1 → R5
                </button>
            </div>

            <div className="w-full h-[350px] border border-slate-200 bg-slate-50 relative overflow-hidden flex items-center justify-center">
                <svg width="600" height="300" className="absolute">
                    {/* Edges */}
                    {edges.map((e, i) => {
                        const source = topology.find(t => t.id === e.s);
                        const target = topology.find(t => t.id === e.t);
                        
                        // Check if edge is in active path
                        const idxS = path.indexOf(e.s);
                        const idxT = path.indexOf(e.t);
                        const isActive = idxS !== -1 && idxT !== -1 && Math.abs(idxS - idxT) === 1;

                        return (
                            <g key={i}>
                                <line 
                                    x1={source.x} y1={source.y} 
                                    x2={target.x} y2={target.y} 
                                    stroke={isActive ? '#10b981' : '#cbd5e1'} 
                                    strokeWidth={isActive ? '4' : '2'}
                                    className="transition-all duration-500"
                                />
                                <rect 
                                    x={(source.x + target.x) / 2 - 10} 
                                    y={(source.y + target.y) / 2 - 10} 
                                    width="20" height="20" fill="white" rx="3"
                                    stroke={isActive ? '#10b981' : '#cbd5e1'}
                                />
                                <text 
                                    x={(source.x + target.x) / 2} 
                                    y={(source.y + target.y) / 2} 
                                    textAnchor="middle" dy=".3em" fill="#64748b" className="font-mono text-[10px]"
                                >
                                    {e.cost}
                                </text>
                            </g>
                        );
                    })}

                    {/* Nodes */}
                    {topology.map((t) => {
                        const isVisited = path.includes(t.id);
                        const isCurrent = path[path.length - 1] === t.id;
                        
                        return (
                            <g key={t.id} transform={`translate(${t.x}, ${t.y})`}>
                                <circle 
                                    r="16" 
                                    fill={isCurrent ? '#0f172a' : (isVisited ? '#ecfdf5' : 'white')} 
                                    stroke={isCurrent ? '#0f172a' : (isVisited ? '#10b981' : '#94a3b8')} 
                                    strokeWidth="2"
                                    className="transition-colors duration-500"
                                />
                                <text 
                                    textAnchor="middle" 
                                    dy=".3em" 
                                    fill={isCurrent ? 'white' : '#0f172a'} 
                                    className="font-mono text-[10px] font-bold"
                                >
                                    {t.id}
                                </text>
                            </g>
                        );
                    })}
                </svg>
            </div>

            <div className="mt-4 bg-slate-50 border border-slate-200 p-4 flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Current Path</span>
                <div className="font-mono text-xs font-bold text-emerald-600">
                    {path.length > 0 ? path.join(' → ') : 'Idle'}
                </div>
            </div>
        </div>
    );
}
