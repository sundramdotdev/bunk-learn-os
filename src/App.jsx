import { useState, useEffect, useRef, useCallback } from 'react';
// Naye icons (Clock aur Trash2) import kiye hain
import { Cpu, HardDrive, MemoryStick, Play, Pause, RotateCcw, ShieldAlert, Layers, Clock, Trash2 } from 'lucide-react';

import ProcessInput from './components/ProcessInput';
import ProcessTable from './components/ProcessTable';
import GanttChart from './components/GanttChart';
import MemoryGrid from './components/MemoryGrid';
import DiskScheduling from './components/DiskScheduling';
import CalculationTable from './components/CalculationTable';
import ExplainerPanel from './components/ExplainerPanel';
import Footer from './components/Footer';
import BankersAlgorithm from './components/BankersAlgorithm';
import PageReplacement from './components/PageReplacement';

import {
    calculateFCFS as calculateCPU_FCFS,
    calculateSJF_NonPreemptive,
    calculateRoundRobin,
    calculateSRTF,
    calculateHRRN,
    calculateLCN,
} from './utils/SchedulerLogic';

export default function App() {
    const [activeTab, setActiveTab] = useState('Memory');

    // --- OS SYSTEM CLOCK STATE ---
    const [currentTime, setCurrentTime] = useState(new Date());

    // --- CPU STATE ---
    const [processes, setProcesses] = useState([
        { id: 'P1', arrivalTime: 0, burstTime: 4 },
        { id: 'P2', arrivalTime: 1, burstTime: 3 },
        { id: 'P3', arrivalTime: 2, burstTime: 1 }
    ]);
    const [cpuAlgo, setCpuAlgo] = useState('FCFS');
    const [cpuResults, setCpuResults] = useState([]);
    const [revealedCount, setRevealedCount] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const timerRef = useRef(null);

    // --- MEMORY STATE ---
    const [partitions, setPartitions] = useState([
        { id: 'M1', size: 100 }, { id: 'M2', size: 500 }, { id: 'M3', size: 200 }, { id: 'M4', size: 300 }, { id: 'M5', size: 600 }
    ]);
    const [memRequests, setMemRequests] = useState([
        { id: 'R1', size: 212 }, { id: 'R2', size: 417 }, { id: 'R3', size: 112 }, { id: 'R4', size: 426 }
    ]);
    const [memAlgo, setMemAlgo] = useState('FirstFit');

    // Memory Input Form State
    const [newPartitionSize, setNewPartitionSize] = useState('');
    const [newMemReqSize, setNewMemReqSize] = useState('');

    // --- OS System Clock Effect (New Addition) ---
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // CPU Simulation Effects
    useEffect(() => {
        if (processes.length > 0) {
            if (cpuAlgo === 'FCFS') setCpuResults(calculateCPU_FCFS(processes));
            else if (cpuAlgo === 'SJF') setCpuResults(calculateSJF_NonPreemptive(processes));
            else if (cpuAlgo === 'RR') setCpuResults(calculateRoundRobin(processes, 2));
            else if (cpuAlgo === 'SRTF') setCpuResults(calculateSRTF(processes));
            else if (cpuAlgo === 'HRRN') setCpuResults(calculateHRRN(processes));
            else if (cpuAlgo === 'LCN') setCpuResults(calculateLCN(processes));
        } else {
            setCpuResults([]);
        }
        handleReset();
    }, [processes, cpuAlgo]);

    useEffect(() => {
        if (isPlaying) {
            timerRef.current = setInterval(() => {
                setRevealedCount(prev => {
                    if (prev >= cpuResults.length) {
                        setIsPlaying(false);
                        clearInterval(timerRef.current);
                        return prev;
                    }
                    return prev + 1;
                });
            }, 800);
        } else {
            clearInterval(timerRef.current);
        }
        return () => clearInterval(timerRef.current);
    }, [isPlaying, cpuResults.length]);

    const handlePlay = useCallback(() => {
        if (cpuResults.length > 0) setIsPlaying(true);
    }, [cpuResults]);

    const handlePause = useCallback(() => setIsPlaying(false), []);
    const handleReset = useCallback(() => {
        setIsPlaying(false);
        setRevealedCount(0);
        clearInterval(timerRef.current);
    }, []);

    // --- Global "Format OS" Function (New Addition) ---
    const handleGlobalReset = useCallback(() => {
        if (window.confirm("Are you sure you want to Format the OS? This will wipe all CPU and Memory data.")) {
            setProcesses([]);
            setPartitions([]);
            setMemRequests([]);
            setCpuResults([]);
            handleReset();
        }
    }, [handleReset]);

    const handleStepChange = useCallback((newCount) => {
        setRevealedCount(newCount);
        setIsPlaying(false);
        clearInterval(timerRef.current);
    }, []);

    const addProcess = (proc) => setProcesses((prev) => [...prev, { id: proc.name, arrivalTime: proc.arrival, burstTime: proc.burst }]);
    const deleteProcess = (id) => setProcesses((prev) => prev.filter((p) => p.id !== id));

    // Memory Handlers
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

    const TABS = [
        { id: 'CPU', label: 'CPU Scheduling', icon: <Cpu size={14} /> },
        { id: 'Memory', label: 'Memory Allocation', icon: <MemoryStick size={14} /> },
        { id: 'Disk', label: 'Disk Scheduling', icon: <HardDrive size={14} /> },
        { id: 'Deadlock', label: 'Deadlock Avoidance', icon: <ShieldAlert size={14} /> },
        { id: 'Page', label: 'Page Replacement', icon: <Layers size={14} /> },
    ];

    return (
        <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-mono tracking-tight selection:bg-slate-300">
            {/* ── Brutalist Top Nav ── */}
            <header className="flex flex-col xl:flex-row xl:items-center justify-between border-b-2 border-slate-900 bg-white px-4 py-3 md:px-6 md:py-4 gap-4">

                {/* Logo & Tabs Group */}
                <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6 w-full xl:w-auto">
                    <div className="flex items-center gap-3 shrink-0">
                        <div className="w-8 h-8 bg-slate-900 text-white flex items-center justify-center rounded-none shadow-[2px_2px_0px_0px_rgba(203,213,225,1)]">
                            <Cpu size={18} strokeWidth={2.5} />
                        </div>
                        <h1 className="text-base font-bold uppercase tracking-widest text-slate-900">
                            Bunk_&_Learn_OS
                        </h1>
                    </div>

                    {/* State Tabs */}
                    <nav className="flex overflow-x-auto whitespace-nowrap gap-2 pb-2 md:pb-0 hide-scrollbar w-full xl:w-auto">
                        {TABS.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => { setActiveTab(tab.id); handleReset(); }}
                                className={`flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-widest transition-none rounded-none border-2 ${activeTab === tab.id
                                    ? 'border-slate-900 bg-slate-900 text-white shadow-[2px_2px_0px_0px_rgba(15,23,42,0.2)]'
                                    : 'border-slate-200 text-slate-600 hover:border-slate-900 hover:text-slate-900'
                                    }`}
                            >
                                {tab.icon}
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* --- System Status & Format OS (New Addition) --- */}
                <div className="flex items-center gap-4 justify-between xl:justify-end xl:border-l-2 xl:border-slate-200 xl:pl-6 shrink-0">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-600 bg-slate-100 px-3 py-2 border border-slate-300 rounded-none">
                        <Clock size={14} className="text-slate-900" />
                        {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </div>

                    <button
                        onClick={handleGlobalReset}
                        className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 text-xs font-bold uppercase tracking-widest transition-transform cursor-pointer border-2 border-slate-900 rounded-none shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] active:translate-y-[3px] active:translate-x-[3px] active:shadow-none"
                        title="Wipe OS Data"
                    >
                        <Trash2 size={14} /> Format OS
                    </button>
                </div>
            </header>

            {/* ── Main Workspace ── */}
            <main className="flex flex-1 flex-col lg:flex-row p-4 md:p-6 lg:p-8 gap-4 md:gap-6 max-w-[1400px] w-full mx-auto">

                {/* === CPU VIEW === */}
                {activeTab === 'CPU' && (
                    <>
                        <aside className="w-full lg:w-80 border border-slate-300 bg-white p-5 rounded-none flex-shrink-0 self-start shadow-[4px_4px_0px_0px_rgba(203,213,225,0.5)]">
                            <div className="mb-6">
                                <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-slate-900">Algorithm Subroutine</label>
                                <select
                                    value={cpuAlgo}
                                    onChange={e => setCpuAlgo(e.target.value)}
                                    className="w-full border-2 border-slate-300 bg-slate-50 px-3 py-2 text-xs font-mono text-slate-800 outline-none focus:border-slate-900 rounded-none cursor-pointer"
                                >
                                    <option value="FCFS">FCFS_QUEUE</option>
                                    <option value="SJF">SJF_NON_PREEMPTIVE</option>
                                    <option value="RR">ROUND_ROBIN (TQ=2)</option>
                                    <option value="SRTF">SHORTEST_REMAINING_TIME (PREEMPTIVE)</option>
                                    <option value="HRRN">HIGHEST_RESPONSE_RATIO</option>
                                    <option value="LCN">LEAST_COMPLETED_NEXT (PREEMPTIVE)</option>
                                </select>
                            </div>
                            <ProcessInput onAdd={addProcess} />
                            <div className="mt-6 border-t-2 border-slate-200 pt-6">
                                <ProcessTable processes={processes.map(p => ({ id: p.id, name: p.id, arrival: p.arrivalTime, burst: p.burstTime }))} onDelete={deleteProcess} />
                            </div>
                        </aside>

                        <section className="flex-1 space-y-6">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between border border-slate-300 bg-white p-4 rounded-none shadow-[4px_4px_0px_0px_rgba(203,213,225,0.5)] gap-4 sm:gap-0">
                                <h2 className="text-xs font-bold uppercase tracking-widest text-slate-900">Simulation_Runtime</h2>
                                <div className="flex gap-2">
                                    {!isPlaying ? (
                                        <button onClick={handlePlay} className="flex-1 sm:flex-none inline-flex justify-center items-center gap-1.5 border-2 border-slate-900 bg-slate-900 text-white px-4 py-1.5 text-xs font-bold uppercase tracking-widest hover:bg-slate-800 transition-all rounded-none cursor-pointer disabled:opacity-50">
                                            <Play size={14} /> Play
                                        </button>
                                    ) : (
                                        <button onClick={handlePause} className="flex-1 sm:flex-none inline-flex justify-center items-center gap-1.5 border-2 border-slate-300 bg-white text-slate-900 px-4 py-1.5 text-xs font-bold uppercase tracking-widest hover:bg-slate-50 transition-all rounded-none cursor-pointer">
                                            <Pause size={14} /> Pause
                                        </button>
                                    )}
                                    <button onClick={handleReset} className="flex-1 sm:flex-none inline-flex justify-center items-center gap-1.5 border-2 border-slate-300 bg-white text-slate-900 px-4 py-1.5 text-xs font-bold uppercase tracking-widest hover:bg-slate-50 transition-all rounded-none cursor-pointer">
                                        <RotateCcw size={14} /> Reset
                                    </button>
                                </div>
                            </div>

                            <div className="w-full overflow-x-auto whitespace-nowrap">
                                <GanttChart results={cpuResults} revealedCount={revealedCount} />
                            </div>

                            {/* EXPLAINER PANEL — Step-by-step decision log */}
                            <ExplainerPanel
                                results={cpuResults}
                                revealedCount={revealedCount}
                                onStepChange={handleStepChange}
                                isPlaying={isPlaying}
                            />

                            {/* CPU Results Map */}
                            <CalculationTable results={cpuResults} />
                        </section>
                    </>
                )}

                {/* === MEMORY VIEW === */}
                {activeTab === 'Memory' && (
                    <>
                        <aside className="w-full lg:w-80 border border-slate-300 bg-white p-5 rounded-none flex-shrink-0 self-start shadow-[4px_4px_0px_0px_rgba(203,213,225,0.5)]">
                            <div className="mb-6">
                                <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-slate-900">Allocation Subroutine</label>
                                <select
                                    value={memAlgo}
                                    onChange={e => setMemAlgo(e.target.value)}
                                    className="w-full border-2 border-slate-300 bg-slate-50 px-3 py-2 text-xs font-mono text-slate-800 outline-none focus:border-slate-900 rounded-none cursor-pointer"
                                >
                                    <option value="FirstFit">FIRST_FIT</option>
                                    <option value="BestFit">BEST_FIT</option>
                                </select>
                            </div>

                            {/* Memory Partitions Inputs */}
                            <div className="mb-6 space-y-3">
                                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-900 border-b border-slate-200 pb-2">Physical Blocks (KB)</h3>
                                <div className="flex flex-col gap-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                                    {partitions.map(p => (
                                        <div key={p.id} className="flex items-center justify-between border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs">
                                            <span className="font-bold text-slate-900 w-12">{p.id}</span>
                                            <span className="text-slate-600">{p.size}K</span>
                                            <button onClick={() => handleDeletePartition(p.id)} className="text-red-600 hover:text-red-800 font-bold font-sans px-2 cursor-pointer">✕</button>
                                        </div>
                                    ))}
                                </div>
                                <form onSubmit={handleAddPartition} className="flex gap-2 mt-2">
                                    <input
                                        type="number"
                                        placeholder="Size (KB)"
                                        value={newPartitionSize}
                                        onChange={e => setNewPartitionSize(e.target.value)}
                                        className="flex-1 w-full border border-slate-300 px-2 py-1 text-xs outline-none focus:border-slate-900 rounded-none"
                                    />
                                    <button type="submit" className="bg-slate-900 text-white px-3 py-1 text-xs font-bold uppercase hover:bg-slate-800 transition-colors cursor-pointer rounded-none border border-slate-900">Add</button>
                                </form>
                            </div>

                            {/* Process Requests Inputs */}
                            <div className="space-y-3">
                                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-900 border-b border-slate-200 pb-2">Process Requests (KB)</h3>
                                <div className="flex flex-col gap-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                                    {memRequests.map(r => (
                                        <div key={r.id} className="flex items-center justify-between border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs">
                                            <span className="font-bold text-slate-900 w-12">{r.id}</span>
                                            <span className="text-slate-600">{r.size}K</span>
                                            <button onClick={() => handleDeleteMemReq(r.id)} className="text-red-600 hover:text-red-800 font-bold font-sans px-2 cursor-pointer">✕</button>
                                        </div>
                                    ))}
                                </div>
                                <form onSubmit={handleAddMemReq} className="flex gap-2 mt-2">
                                    <input
                                        type="number"
                                        placeholder="Requirement (KB)"
                                        value={newMemReqSize}
                                        onChange={e => setNewMemReqSize(e.target.value)}
                                        className="flex-1 w-full border border-slate-300 px-2 py-1 text-xs outline-none focus:border-slate-900 rounded-none"
                                    />
                                    <button type="submit" className="bg-slate-900 text-white px-3 py-1 text-xs font-bold uppercase hover:bg-slate-800 transition-colors cursor-pointer rounded-none border border-slate-900">Add</button>
                                </form>
                            </div>
                        </aside>
                        <section className="flex-1 w-full min-w-0 space-y-6">
                            <div className="overflow-x-auto shadow-[4px_4px_0px_0px_rgba(203,213,225,0.5)] bg-white p-2">
                                <MemoryGrid partitions={partitions} requests={memRequests} algorithm={memAlgo} />
                            </div>
                        </section>
                    </>
                )}

                {/* === DISK VIEW === */}
                {activeTab === 'Disk' && (
                    <div className="flex-1 overflow-x-auto">
                        <DiskScheduling />
                    </div>
                )}

                {/* === DEADLOCK VIEW === */}
                {activeTab === 'Deadlock' && (
                    <div className="flex-1">
                        <BankersAlgorithm />
                    </div>
                )}

                {/* === PAGE REPLACEMENT VIEW === */}
                {activeTab === 'Page' && (
                    <div className="flex-1">
                        <PageReplacement />
                    </div>
                )}

            </main>
            <Footer />
        </div>
    );
}