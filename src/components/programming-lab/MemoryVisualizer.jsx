import React from 'react';
import { Microchip } from 'lucide-react';

export default function MemoryVisualizer({ memorySnapshot }) {
    const { stack = [], heap = [], code = [], data = [] } = memorySnapshot || {};

    return (
        <div className="flex flex-col h-full bg-white border border-slate-300 shadow-sm">
            <div className="p-3 border-b border-slate-200 bg-slate-50 flex items-center gap-2">
                <Microchip size={14} className="text-emerald-600" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-700">Memory Visualizer</span>
            </div>
            
            <div className="flex-1 overflow-auto p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Code */}
                <div className="flex-1">
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Code</h4>
                    <div className="space-y-1 font-mono text-[10px]">
                        {code.length === 0 && <div className="text-slate-400 italic">Empty</div>}
                        {code.map((item, i) => (
                            <div key={i} className="flex border border-indigo-200">
                                <div className="w-16 bg-indigo-50 text-indigo-800 p-1 border-r border-indigo-200 shrink-0 text-center">{item.address}</div>
                                <div className="flex-1 bg-white p-1 text-slate-900 truncate" title={item.value}>{item.value}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Data */}
                <div className="flex-1">
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Data</h4>
                    <div className="space-y-1 font-mono text-[10px]">
                        {data.length === 0 && <div className="text-slate-400 italic">Empty</div>}
                        {data.map((item, i) => (
                            <div key={i} className="flex border border-amber-200">
                                <div className="w-16 bg-amber-50 text-amber-800 p-1 border-r border-amber-200 shrink-0 text-center">{item.address}</div>
                                <div className="flex-1 bg-white p-1 text-slate-900 truncate" title={item.value}>{item.value}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Stack */}
                <div className="flex-1">
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Stack</h4>
                    <div className="space-y-1 font-mono text-[10px]">
                        {stack.length === 0 && <div className="text-slate-400 italic">Empty</div>}
                        {stack.map((item, i) => (
                            <div key={i} className="flex border border-rose-200">
                                <div className="w-16 bg-rose-50 text-rose-800 p-1 border-r border-rose-200 shrink-0 text-center">{item.address}</div>
                                <div className="flex-1 bg-white p-1 flex justify-between">
                                    <span className="text-slate-500 font-bold truncate pr-1 max-w-[40px]" title={item.name}>{item.name}</span>
                                    <span className="text-slate-900 truncate" title={item.value}>{item.value}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Heap */}
                <div className="flex-1">
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Heap</h4>
                    <div className="space-y-1 font-mono text-[10px]">
                        {heap.length === 0 && <div className="text-slate-400 italic">Empty</div>}
                        {heap.map((item, i) => (
                            <div key={i} className="flex border border-emerald-200">
                                <div className="w-16 bg-emerald-50 text-emerald-800 p-1 border-r border-emerald-200 shrink-0 text-center">{item.address}</div>
                                <div className="flex-1 bg-white p-1 text-slate-900 truncate" title={item.value}>{item.value}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
