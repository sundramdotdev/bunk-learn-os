import React, { useState, useEffect, useMemo } from 'react';
import { calculateFirstFit, calculateBestFit } from '../services/os/MemoryLogic';
import ModuleExplainer from './ModuleExplainer';

export default function MemoryGrid({ partitions, requests, algorithm }) {
    const [allocationData, setAllocationData] = useState({ memory: [], results: [] });

    useEffect(() => {
        if (!partitions.length || !requests.length) return;

        if (algorithm === 'FirstFit') {
            setAllocationData(calculateFirstFit(partitions.map(p => p.size), requests.map(r => r.size)));
        } else {
            setAllocationData(calculateBestFit(partitions.map(p => p.size), requests.map(r => r.size)));
        }
    }, [partitions, requests, algorithm]);

    const { memory, results } = allocationData;

    const explainerSteps = useMemo(() => {
        if (!results || results.length === 0) return [];
        return results.map((r, i) => ({
            reason: r.reason || '',
            reasonHi: r.reasonHi || '',
            context: {
                'REQUEST': `${r.id} (${r.size}K)`,
                'STATUS': r.success ? '✅ ALLOCATED' : '❌ FAILED',
                'PARTITION': r.allocatedTo || 'N/A',
                'INT_FRAG': r.success ? `${r.internalFragmentation}K` : 'N/A',
            }
        }));
    }, [results]);

    if (!memory.length) {
        return (
            <div className="flex h-32 items-center justify-center border border-slate-300 bg-white rounded-none text-xs text-slate-400 font-mono italic">
                Awaiting memory partitions...
            </div>
        );
    }

    const totalMemory = memory.reduce((sum, p) => sum + p.size, 0);

    return (
        <div className="space-y-6">
          <div className="min-w-[700px] lg:min-w-full">
            <div className="w-full border border-slate-300 bg-white p-4 md:p-6 rounded-none">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-slate-900">
                        RAM Layout: MFT_FIXED_PARTITIONING
                    </h3>
                    <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">
                        Total Capacity: {totalMemory} KB
                    </div>
                </div>

                <div className="flex w-full h-32 bg-slate-50 rounded-none overflow-visible border-2 border-slate-900 p-0 gap-0">
                    {memory.map((part) => {
                        const widthPct = (part.size / totalMemory) * 100;
                        const usedPct = part.isAllocated ? (part.used / part.size) * 100 : 0;
                        const fragPct = part.isAllocated ? (part.internalFragmentation / part.size) * 100 : 0;

                        return (
                            <div
                                key={part.id}
                                className="relative flex flex-col h-full bg-slate-100 border-r-2 last:border-r-0 border-slate-900"
                                style={{ width: `${widthPct}%` }}
                            >
                                {/* Partition Metadata */}
                                <div className="absolute -top-6 w-full text-center text-[10px] text-slate-900 font-bold font-mono">
                                    {part.id} [{part.size}K]
                                </div>

                                {part.isAllocated ? (
                                    <div className="flex flex-row h-full">
                                        {/* Process Block */}
                                        <div 
                                            className="h-full bg-slate-900 text-white font-mono flex flex-col items-center justify-center p-1 overflow-hidden"
                                            style={{ width: `${usedPct}%` }}
                                            title={`${part.allocatedProcess}: ${part.used}KB`}
                                        >
                                            <span className="text-[10px] font-bold">{part.allocatedProcess}</span>
                                            <span className="text-[8px] opacity-70">{part.used}K</span>
                                        </div>
                                        {/* Internal Fragmentation */}
                                        {part.internalFragmentation > 0 && (
                                            <div 
                                                className="h-full bg-slate-200 border-l border-slate-400 flex flex-col items-center justify-center relative group"
                                                style={{ width: `${fragPct}%` }}
                                            >
                                                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:4px_4px]"></div>
                                                <span className="text-[8px] text-slate-500 font-bold z-10">{part.internalFragmentation}K</span>
                                                <div className="hidden group-hover:block absolute top-0 bg-slate-900 text-white text-[8px] p-1 z-20 whitespace-nowrap">
                                                    INT_FRAGMENTATION: {part.internalFragmentation}K
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="h-full flex items-center justify-center bg-white opacity-40">
                                        <span className="text-[10px] text-slate-400 font-mono italic">EMPTY</span>
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>
                
                <div className="mt-8 flex gap-6 text-[9px] font-bold uppercase tracking-widest text-slate-500">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-slate-900"></div>
                        <span>Allocated Process</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-slate-200 border border-slate-400"></div>
                        <span>Internal Fragmentation</span>
                    </div>
                </div>
            </div>

            {/* Allocation Status Table */}
            {results.length > 0 && (
                <div className="w-full border border-slate-300 bg-white p-4 md:p-6 rounded-none">
                    <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-slate-900 border-b border-slate-200 pb-2">
                        Allocation_Telemetry
                    </h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-[11px] font-mono text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-900 text-slate-900">
                                    <th className="py-2 pr-4 font-bold">REQ_ID</th>
                                    <th className="py-2 px-4 border-l border-slate-200 font-bold">SIZE(KB)</th>
                                    <th className="py-2 px-4 border-l border-slate-200 font-bold">STATUS</th>
                                    <th className="py-2 px-4 border-l border-slate-200 font-bold">ASSIGNED_BLOCK</th>
                                    <th className="py-2 pl-4 border-l border-slate-200 font-bold">INT_FRAG</th>
                                </tr>
                            </thead>
                            <tbody>
                                {results.map((r, i) => (
                                    <tr key={i} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                                        <td className="py-2 pr-4">{r.id}</td>
                                        <td className="py-2 px-4 border-l border-slate-100">{r.size}K</td>
                                        <td className="py-2 px-4 border-l border-slate-100">
                                            {r.success ? (
                                                <span className="bg-slate-900 text-white px-1.5 py-0.5 text-[9px]">SUCCESS</span>
                                            ) : (
                                                <span className="text-red-500 font-bold">FAULT_OVERFLOW</span>
                                            )}
                                        </td>
                                        <td className="py-2 px-4 border-l border-slate-100">
                                            {r.allocatedTo || <span className="opacity-30">---</span>}
                                        </td>
                                        <td className="py-2 pl-4 border-l border-slate-100 font-bold">
                                            {r.success ? `${r.internalFragmentation}K` : <span className="opacity-30">N/A</span>}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="mt-4 p-3 bg-slate-50 border border-slate-200 text-[10px] text-slate-600">
                        <span className="font-bold text-slate-900">NOTE:</span> Each partition can hold at most one process. Process size must be ≤ partition size.
                    </div>
                </div>
            )}
            </div>

            {/* Explainer Panel — outside scroll container for proper wrapping */}
            {results.length > 0 && (
                <ModuleExplainer steps={explainerSteps} title="ALLOCATION_LOG" />
            )}
        </div>
    );
}
