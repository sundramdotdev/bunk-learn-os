import React, { useState } from 'react';

const HIERARCHY_DATA = [
    {
        id: 'registers',
        name: 'Registers',
        capacity: '< 1 KB',
        speed: '~ 1 ns',
        cost: 'Very High',
        volatility: 'Volatile',
        width: '25%'
    },
    {
        id: 'cache',
        name: 'Cache (L1/L2/L3)',
        capacity: '1 MB - 64 MB',
        speed: '~ 2 - 10 ns',
        cost: 'High',
        volatility: 'Volatile',
        width: '50%'
    },
    {
        id: 'ram',
        name: 'Main Memory (RAM)',
        capacity: '4 GB - 64 GB',
        speed: '~ 50 - 100 ns',
        cost: 'Moderate',
        volatility: 'Volatile',
        width: '75%'
    },
    {
        id: 'storage',
        name: 'Secondary Storage (SSD/HDD)',
        capacity: '256 GB - 10 TB+',
        speed: '~ 0.1 - 10 ms',
        cost: 'Low',
        volatility: 'Non-Volatile',
        width: '100%'
    }
];

export default function MemoryHierarchy() {
    const [selectedId, setSelectedId] = useState(HIERARCHY_DATA[0].id);

    const selectedData = HIERARCHY_DATA.find(d => d.id === selectedId);

    return (
        <div className="flex flex-col lg:flex-row gap-6 md:gap-8 max-w-5xl mx-auto w-full">
            {/* Left: Pyramid Visualization */}
            <section className="flex-1 border border-slate-200 bg-white p-6 md:p-10 shadow-sm flex items-center justify-center relative min-h-[400px]">
                
                {/* Visual Cue Arrows */}
                <div className="absolute left-4 top-10 bottom-10 flex flex-col justify-between items-center w-12 hidden sm:flex">
                    <div className="flex flex-col items-center flex-1 w-full justify-start relative">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 rotate-[-90deg] absolute top-12 whitespace-nowrap">Speed</span>
                        <div className="w-px h-32 bg-slate-300 absolute top-28" />
                        <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-b-[6px] border-b-slate-400 absolute top-27" />
                    </div>
                    <div className="flex flex-col items-center flex-1 w-full justify-end relative">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 rotate-[-90deg] absolute bottom-12 whitespace-nowrap">Capacity</span>
                        <div className="w-px h-32 bg-slate-300 absolute bottom-28" />
                        <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[6px] border-t-slate-400 absolute bottom-27" />
                    </div>
                </div>

                {/* Pyramid */}
                <div className="w-full max-w-sm flex flex-col items-center gap-2 sm:ml-12">
                    {HIERARCHY_DATA.map((layer) => (
                        <button
                            key={layer.id}
                            onClick={() => setSelectedId(layer.id)}
                            style={{ width: layer.width }}
                            className={`
                                py-4 text-center text-xs sm:text-sm font-bold uppercase tracking-widest transition-all cursor-pointer border
                                ${selectedId === layer.id 
                                    ? 'bg-zinc-900 text-white border-zinc-900 shadow-md scale-105 z-10' 
                                    : 'bg-zinc-50 text-zinc-600 border-zinc-200 hover:bg-zinc-100 hover:text-zinc-900'
                                }
                            `}
                        >
                            {layer.name}
                        </button>
                    ))}
                </div>
            </section>

            {/* Right: Data Card */}
            <aside className="w-full lg:w-80 border border-slate-300 bg-white flex-shrink-0 self-start shadow-sm">
                <div className="bg-zinc-50 border-b border-slate-200 p-4">
                    <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Selected Layer</h2>
                    <h3 className="text-sm font-bold text-slate-900 mt-1 uppercase tracking-wider">{selectedData.name}</h3>
                </div>
                
                <div className="p-5 flex flex-col gap-6">
                    <div className="space-y-1">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Capacity</p>
                        <p className="font-mono text-sm font-bold text-slate-900">{selectedData.capacity}</p>
                    </div>
                    
                    <div className="space-y-1">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Access Speed</p>
                        <p className="font-mono text-sm font-bold text-blue-600">{selectedData.speed}</p>
                    </div>

                    <div className="space-y-1">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Cost Per Bit</p>
                        <p className="font-mono text-sm font-bold text-red-500">{selectedData.cost}</p>
                    </div>

                    <div className="space-y-1">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Data Retention</p>
                        <span className={`inline-block border px-2 py-1 text-[10px] font-mono font-bold uppercase tracking-widest ${
                            selectedData.volatility === 'Volatile' 
                                ? 'border-orange-200 bg-orange-50 text-orange-600' 
                                : 'border-emerald-200 bg-emerald-50 text-emerald-600'
                        }`}>
                            {selectedData.volatility}
                        </span>
                    </div>
                </div>
            </aside>
        </div>
    );
}
