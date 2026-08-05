import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import MemoryGrid from '../MemoryGrid';

export default function MemoryAllocatorView({ globalResetTick }) {
    const [partitions, setPartitions] = useState([
        { id: 'M1', size: 100 }, { id: 'M2', size: 500 }, { id: 'M3', size: 200 }, { id: 'M4', size: 300 }, { id: 'M5', size: 600 }
    ]);
    const [memRequests, setMemRequests] = useState([
        { id: 'R1', size: 212 }, { id: 'R2', size: 417 }, { id: 'R3', size: 112 }, { id: 'R4', size: 426 }
    ]);
    const [memAlgo, setMemAlgo] = useState('FirstFit');
    const [newPartitionSize, setNewPartitionSize] = useState('');
    const [newMemReqSize, setNewMemReqSize] = useState('');

    useEffect(() => {
        if (globalResetTick > 0) {
            setPartitions([]);
            setMemRequests([]);
        }
    }, [globalResetTick]);

    const handleAddPartition = (e) => {
        e.preventDefault();
        if (!newPartitionSize || isNaN(newPartitionSize)) return;
        setPartitions(prev => [...prev, { id: `M${prev.length + 1}`, size: Number(newPartitionSize) }]);
        setNewPartitionSize('');
    };
    const handleDeletePartition = (id) => setPartitions(prev => prev.filter(p => p.id !== id));

    const handleAddMemReq = (e) => {
        e.preventDefault();
        if (!newMemReqSize || isNaN(newMemReqSize)) return;
        setMemRequests(prev => [...prev, { id: `R${prev.length + 1}`, size: Number(newMemReqSize) }]);
        setNewMemReqSize('');
    };
    const handleDeleteMemReq = (id) => setMemRequests(prev => prev.filter(p => p.id !== id));

    return (
        <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
            <aside className="w-full lg:w-80 border border-slate-300 bg-white p-4 md:p-6 rounded-none flex-shrink-0 self-start shadow-sm">
                <div className="mb-6">
                    <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-slate-400">Allocation Subroutine</label>
                    <select
                        value={memAlgo}
                        onChange={e => setMemAlgo(e.target.value)}
                        className="w-full border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-mono text-slate-800 outline-none focus:border-slate-900 rounded-none cursor-pointer"
                    >
                        <option value="FirstFit">FIRST_FIT</option>
                        <option value="BestFit">BEST_FIT</option>
                    </select>
                </div>

                <div className="mb-8 space-y-4">
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-900 border-b border-slate-100 pb-2">Physical Blocks (KB)</h3>
                    <div className="flex flex-col gap-2 max-h-40 overflow-y-auto pr-2 scrollbar-thin">
                        {partitions.map(p => (
                            <div key={p.id} className="flex items-center justify-between border border-slate-200 bg-slate-50 px-3 py-2 text-xs">
                                <span className="font-bold text-slate-900 w-12">{p.id}</span>
                                <span className="text-slate-500 font-mono">{p.size}K</span>
                                <button onClick={() => handleDeletePartition(p.id)} className="text-red-400 hover:text-red-600 transition-colors cursor-pointer"><X size={14} /></button>
                            </div>
                        ))}
                    </div>
                    <form onSubmit={handleAddPartition} className="flex gap-2">
                        <input
                            type="number"
                            placeholder="Size (KB)"
                            value={newPartitionSize}
                            onChange={e => setNewPartitionSize(e.target.value)}
                            className="flex-1 w-full border border-slate-200 px-3 py-2 text-xs outline-none focus:border-slate-900 rounded-none bg-white"
                        />
                        <button type="submit" className="bg-slate-900 text-white px-4 py-2 text-[10px] font-bold uppercase tracking-widest hover:bg-slate-800 transition-colors cursor-pointer rounded-none">Add</button>
                    </form>
                </div>

                <div className="space-y-4">
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-900 border-b border-slate-100 pb-2">Process Requests (KB)</h3>
                    <div className="flex flex-col gap-2 max-h-40 overflow-y-auto pr-2 scrollbar-thin">
                        {memRequests.map(r => (
                            <div key={r.id} className="flex items-center justify-between border border-slate-200 bg-slate-50 px-3 py-2 text-xs">
                                <span className="font-bold text-slate-900 w-12">{r.id}</span>
                                <span className="text-slate-500 font-mono">{r.size}K</span>
                                <button onClick={() => handleDeleteMemReq(r.id)} className="text-red-400 hover:text-red-600 transition-colors cursor-pointer"><X size={14} /></button>
                            </div>
                        ))}
                    </div>
                    <form onSubmit={handleAddMemReq} className="flex gap-2">
                        <input
                            type="number"
                            placeholder="Requirement (KB)"
                            value={newMemReqSize}
                            onChange={e => setNewMemReqSize(e.target.value)}
                            className="flex-1 w-full border border-slate-200 px-3 py-2 text-xs outline-none focus:border-slate-900 rounded-none bg-white"
                        />
                        <button type="submit" className="bg-slate-900 text-white px-4 py-2 text-[10px] font-bold uppercase tracking-widest hover:bg-slate-800 transition-colors cursor-pointer rounded-none">Add</button>
                    </form>
                </div>
            </aside>
            <section className="flex-1 w-full overflow-x-auto scrollbar-thin shadow-sm min-w-0">
                <MemoryGrid partitions={partitions} requests={memRequests} algorithm={memAlgo} />
            </section>
        </div>
    );
}
