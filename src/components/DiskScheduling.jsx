import React, { useState, useMemo, useEffect } from 'react';
import {
    calculateFCFS,
    calculateSSTF,
    calculateSCAN,
    calculateCSCAN,
    calculateLOOK,
    calculateCLOOK
} from '../utils/DiskSchedulingLogic';
import { Settings, BarChart3, List, ArrowRight, MoveHorizontal, Database } from 'lucide-react';
import ModuleExplainer from './ModuleExplainer';


export default function DiskScheduling({ clearSignal }) {
    const [requestInput, setRequestInput] = useState("98, 183, 37, 122, 14, 124, 65, 67");
    const [initialHead, setInitialHead] = useState(53);
    const [maxTrack, setMaxTrack] = useState(199);
    const [direction, setDirection] = useState('UP'); // 'UP' or 'DOWN'
    const [algorithm, setAlgorithm] = useState('FCFS');


    useEffect(() => {
        if (clearSignal > 0) {
            setRequestInput("");
            setInitialHead(0);
            setMaxTrack(199);
            setAlgorithm('FCFS');
        }
    }, [clearSignal]);

    const result = useMemo(() => {
        const requests = requestInput
            .split(',')
            .map(s => parseInt(s.trim()))
            .filter(n => !isNaN(n));

        if (requests.length === 0) return { sequence: [initialHead], movements: [], totalMovement: 0 };

        switch (algorithm) {
            case 'FCFS': return calculateFCFS(initialHead, requests);
            case 'SSTF': return calculateSSTF(initialHead, requests);
            case 'SCAN': return calculateSCAN(initialHead, requests, maxTrack, direction);
            case 'CSCAN': return calculateCSCAN(initialHead, requests, maxTrack, direction);
            case 'LOOK': return calculateLOOK(initialHead, requests, direction);
            case 'CLOOK': return calculateCLOOK(initialHead, requests, direction);
            default: return { sequence: [initialHead], movements: [], totalMovement: 0 };
        }
    }, [requestInput, initialHead, maxTrack, direction, algorithm]);

    const { sequence, movements, totalMovement } = result;

    const explainerSteps = useMemo(() => {
        if (!movements || movements.length === 0) return [];
        return movements.map((m) => ({
            reason: m.reason || '',
            reasonHi: m.reasonHi || '',
            context: {
                'MOVEMENT': `Track ${m.from} → ${m.to}`,
                'SEEK_DISTANCE': `|${m.to} - ${m.from}| = ${m.val}`,
                'TYPE': m.isJump ? 'Circular Jump' : 'Standard Seek',
                'STEP': `${m.step} / ${movements.length}`,
            }
        }));
    }, [movements]);

    const chartHeight = 400;
    const paddingX = 40;
    const paddingY = 40;
    const usableHeight = chartHeight - (paddingY * 2);
    const stepY = usableHeight / (sequence.length > 1 ? sequence.length - 1 : 1);

    const getX = (track) => `${(track / maxTrack) * 100}%`;
    const getY = (index) => paddingY + (index * stepY);

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-12 bg-[#fafafa] min-h-screen text-slate-900 font-sans">

            {/* Header Section */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 pb-8">
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
                        Disk Scheduling <span className="text-slate-400 font-light">Simulator</span>
                    </h1>
                    <p className="mt-2 text-slate-500 font-medium">Professional I/O Performance Analysis Tool</p>
                </div>

                <div className="bg-white border border-slate-200 p-6 shadow-sm flex flex-col items-center justify-center min-w-[240px]">
                    <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-400 mb-1">Total Seek Operations</span>
                    <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-mono font-bold leading-none">{totalMovement}</span>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tracks</span>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                {/* Controls Panel */}
                <aside className="lg:col-span-4 space-y-6">
                    <div className="bg-white border border-slate-200 rounded-none overflow-hidden shadow-sm">
                        <div className="bg-slate-950 px-6 py-4 flex items-center gap-2">
                            <Settings className="w-4 h-4 text-slate-400" />
                            <h2 className="text-xs font-bold text-white uppercase tracking-widest">Control_Parameters</h2>
                        </div>

                        <div className="p-6 space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                                    <BarChart3 className="w-3 h-3" />
                                    Scheduling Algorithm
                                </label>
                                <select
                                    className="w-full bg-slate-50 border border-slate-200 px-4 py-3 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-slate-950 rounded-none transition-all cursor-pointer"
                                    value={algorithm}
                                    onChange={(e) => setAlgorithm(e.target.value)}
                                >
                                    <option value="FCFS">FCFS (First-Come, First-Served)</option>
                                    <option value="SSTF">SSTF (Shortest Seek Time First)</option>
                                    <option value="SCAN">SCAN (Elevator Algorithm)</option>
                                    <option value="CSCAN">C-SCAN (Circular SCAN)</option>
                                    <option value="LOOK">LOOK (Optimization over SCAN)</option>
                                    <option value="CLOOK">C-LOOK (Optimization over C-SCAN)</option>
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Head Start</label>
                                    <input
                                        type="number"
                                        className="w-full bg-slate-50 border border-slate-200 px-4 py-3 text-sm font-mono focus:outline-none focus:ring-1 focus:ring-slate-950 rounded-none transition-all"
                                        value={initialHead}
                                        onChange={(e) => setInitialHead(Number(e.target.value))}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Disk Range</label>
                                    <input
                                        type="number"
                                        className="w-full bg-slate-50 border border-slate-200 px-4 py-3 text-sm font-mono focus:outline-none focus:ring-1 focus:ring-slate-950 rounded-none transition-all"
                                        value={maxTrack}
                                        onChange={(e) => setMaxTrack(Number(e.target.value))}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Scan Direction</label>
                                <div className="flex border border-slate-200 rounded-none overflow-hidden">
                                    <button
                                        className={`flex-1 py-3 text-[10px] font-bold uppercase tracking-widest transition-all ${direction === 'UP' ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-400 hover:text-slate-600'}`}
                                        onClick={() => setDirection('UP')}
                                    >
                                        Increasing (Up)
                                    </button>
                                    <button
                                        className={`flex-1 py-3 text-[10px] font-bold uppercase tracking-widest transition-all ${direction === 'DOWN' ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-400 hover:text-slate-600'}`}
                                        onClick={() => setDirection('DOWN')}
                                    >
                                        Decreasing (Down)
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                                    <Database className="w-3 h-3" />
                                    Request Queue (CSV)
                                </label>
                                <textarea
                                    className="w-full bg-slate-50 border border-slate-200 p-4 text-xs font-mono h-32 focus:outline-none focus:ring-1 focus:ring-slate-950 rounded-none transition-all resize-none"
                                    value={requestInput}
                                    onChange={(e) => setRequestInput(e.target.value)}
                                    placeholder="e.g., 98, 183, 37..."
                                />
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Main Content (Visualization & Table) */}
                <main className="lg:col-span-8 space-y-10">

                    {/* Graphical Visualization */}
                    <section className="bg-white border border-slate-200 rounded-none overflow-hidden shadow-sm">
                        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest flex items-center gap-2">
                                <MoveHorizontal className="w-4 h-4 text-slate-400" />
                                Head_Trajectory_Trace
                            </h3>
                            <span className="text-[10px] font-mono text-slate-400 font-bold uppercase bg-slate-50 px-2 py-1 border border-slate-200">
                                0 — {maxTrack}
                            </span>
                        </div>

                        <div className="p-8 pb-12 overflow-x-auto scrollbar-thin">
                            <div className="relative min-w-[600px] h-[400px] bg-slate-50 border border-slate-200">
                                {/* Grid Lines (X-Axis) */}
                                {[0, 0.2, 0.4, 0.6, 0.8, 1.0].map(p => (
                                    <div
                                        key={p}
                                        className="absolute top-0 bottom-0 border-l border-slate-200/50 z-0"
                                        style={{ left: `${p * 100}%` }}
                                    >
                                        <span className="absolute -bottom-7 left-0 -translate-x-1/2 text-[9px] font-mono text-slate-400 font-bold italic">
                                            {Math.round(p * maxTrack)}
                                        </span>
                                    </div>
                                ))}

                                {/* Trajectory Lines */}
                                <svg className="absolute inset-0 w-full h-full z-10 overflow-visible" preserveAspectRatio="none">
                                    {movements.map((move, i) => (
                                        <line
                                            key={i}
                                            x1={getX(move.from)}
                                            y1={getY(i)}
                                            x2={getX(move.to)}
                                            y2={getY(i + 1)}
                                            stroke={move.isJump ? "#94a3b8" : "#0f172a"}
                                            strokeWidth={move.isJump ? 1.5 : 2.5}
                                            strokeDasharray={move.isJump ? "5,5" : "0"}
                                        />
                                    ))}
                                    {/* Points */}
                                    {sequence.map((track, i) => (
                                        <g key={i}>
                                            <rect
                                                x={`calc(${getX(track)} - 4px)`}
                                                y={getY(i) - 4}
                                                width="8"
                                                height="8"
                                                className="fill-slate-950"
                                            />
                                            <text
                                                x={`calc(${getX(track)} + 12px)`}
                                                y={getY(i) + 3}
                                                className="text-[9px] font-mono font-bold fill-slate-400 select-none pointer-events-none"
                                            >
                                                {track}
                                            </text>
                                        </g>
                                    ))}
                                </svg>

                                {/* Step Indicators (Y-Axis) */}
                                {sequence.map((_, i) => (
                                    <div
                                        key={i}
                                        className="absolute left-0 w-4 h-px bg-slate-200 z-0"
                                        style={{ top: `${getY(i)}px` }}
                                    >
                                        <span className="absolute right-full mr-2 -translate-y-1/2 text-[9px] font-mono text-slate-300 font-bold">
                                            #{i}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Detailed Breakdown Table */}
                    <section className="bg-white border border-slate-200 rounded-none overflow-hidden shadow-sm">
                        <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
                            <List className="w-4 h-4 text-slate-400" />
                            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest">Execution_Breakdown</h3>
                        </div>

                        <div className="overflow-x-auto scrollbar-thin">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50 border-b border-slate-200">
                                        <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Step</th>
                                        <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Movement</th>
                                        <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Seek Calculation</th>
                                        <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Distance</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 font-mono">
                                    {movements.length > 0 ? movements.map((move, idx) => (
                                        <tr key={idx} className={`hover:bg-slate-50 transition-colors ${move.isJump ? 'bg-slate-50/50 italic opacity-60' : ''}`}>
                                            <td className="px-6 py-4 text-xs font-bold text-slate-300">
                                                {String(move.step).padStart(2, '0')}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <span className="px-2 py-0.5 bg-slate-100 border border-slate-200 text-slate-800 text-[11px] font-bold">{move.from}</span>
                                                    <ArrowRight className="w-3 h-3 text-slate-300" />
                                                    <span className="px-2 py-0.5 bg-slate-900 text-white text-[11px] font-bold">{move.to}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-xs text-slate-500">
                                                {move.calc}
                                            </td>
                                            <td className="px-6 py-4 text-xs font-bold text-slate-900 text-right">
                                                {move.val}
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="4" className="px-6 py-12 text-center text-slate-400 text-[10px] uppercase font-bold tracking-widest italic">
                                                Initialize parameters to generate trace...
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                                {movements.length > 0 && (
                                    <tfoot>
                                        <tr className="bg-slate-950 text-white">
                                            <td colSpan="3" className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Net_Head_Displacement</td>
                                            <td className="px-6 py-4 text-sm font-bold text-right">{totalMovement}</td>
                                        </tr>
                                    </tfoot>
                                )}
                            </table>
                        </div>
                    </section>

                    {/* Explainer Panel */}
                    {movements.length > 0 && (
                        <ModuleExplainer steps={explainerSteps} title="SEEK_LOG" />
                    )}
                </main>
            </div>
        </div>
    );
}