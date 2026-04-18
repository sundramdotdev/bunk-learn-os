import { useState, useEffect, useRef, useCallback } from 'react';
import { 
    Cpu, 
    HardDrive, 
    MemoryStick, 
    Play, 
    Pause, 
    RotateCcw, 
    ShieldAlert, 
    Layers, 
    Clock, 
    Trash2,
    Binary 
} from 'lucide-react';

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
import NumberSystem from './components/NumberSystem';
import Sidebar from './components/Sidebar';
import { Menu, X } from 'lucide-react';

// New Aptitude Components
import MemoryLogic from './components/aptitude/MemoryLogic';
import CodeBreakdown from './components/aptitude/CodeBreakdown';

import {
    calculateFCFS as calculateCPU_FCFS,
    calculateSJF_NonPreemptive,
    calculateRoundRobin,
    calculateSRTF,
    calculateHRRN,
    calculateLCN,
} from './utils/SchedulerLogic';

export default function App() {
    const [currentView, setCurrentView] = useState('Fundamentals');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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

    // --- OS System Clock Effect ---
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
        if (timerRef.current) clearInterval(timerRef.current);
    }, []);

    // --- Global "Format OS" Function ---
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
        if (timerRef.current) clearInterval(timerRef.current);
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

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-slate-300">
            
            <Sidebar 
                currentView={currentView} 
                setView={(view) => { setCurrentView(view); handleReset(); }} 
                isOpen={isSidebarOpen} 
                setIsOpen={setIsSidebarOpen} 
            />

            {/* Mobile Header */}
            <header className="lg:hidden flex items-center justify-between bg-white border-b border-slate-200 px-6 h-16 sticky top-0 z-30">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-slate-900 text-white flex items-center justify-center">
                        <Cpu size={18} strokeWidth={2.5} />
                    </div>
                    <h1 className="text-xs font-black font-mono tracking-tighter uppercase">Bunk & Learn</h1>
                </div>
                <button 
                    onClick={() => setIsSidebarOpen(true)}
                    className="p-2 text-slate-500 hover:text-slate-900 transition-colors"
                >
                    <Menu size={24} />
                </button>
            </header>

            {/* Main Workspace */}
            <div className="lg:ml-72 min-h-screen flex flex-col transition-all duration-300">
                
                {/* System Stats Bar (Top corner info) */}
                <div className="hidden lg:flex items-center justify-end p-6 gap-4 sticky top-0 z-20 pointer-events-none">
                    <div className="pointer-events-auto flex items-center gap-4 bg-white/80 backdrop-blur-md border border-slate-200 px-4 py-2 shadow-sm rounded-none">
                        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest px-3 border-r border-slate-200">
                            <Clock size={14} className="text-slate-900" />
                            {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        </div>
                        <button
                            onClick={handleGlobalReset}
                            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.2em] transition-all border border-slate-900 active:translate-y-px"
                        >
                            <Trash2 size={12} /> Format OS
                        </button>
                    </div>
                </div>

                <main className="flex-1 p-4 md:p-8 lg:p-12 lg:pt-0 max-w-7xl w-full mx-auto">
                    
                    {/* View Switcher */}
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* === FUNDAMENTALS === */}
                        {currentView === 'Fundamentals' && <NumberSystem />}
                        
                        {currentView === 'MemoryHierarchy' && (
                            <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                                <div className="w-20 h-20 bg-slate-100 flex items-center justify-center rounded-full">
                                    <Layers className="w-10 h-10 text-slate-300" />
                                </div>
                                <h2 className="text-xl font-bold text-slate-900">Memory Hierarchy Subroutine</h2>
                                <p className="text-slate-400 text-sm max-w-md mx-auto italic uppercase font-bold tracking-widest text-[10px]">
                                    [Module_Status: Under_Construction] // Priority: Normal
                                </p>
                            </div>
                        )}

                        {/* === DIGITAL APTITUDE === */}
                        {currentView === 'StackLIFO' && <MemoryLogic mode="stack" />}
                        {currentView === 'QueueFIFO' && <MemoryLogic mode="queue" />}
                        {currentView === 'MemoryLayout' && <CodeBreakdown />}

                        {/* === OPERATING SYSTEMS === */}
                        {currentView === 'CPU' && (
                            <div className="flex flex-col lg:flex-row gap-8">
                                <aside className="w-full lg:w-80 border border-slate-300 bg-white p-6 rounded-none flex-shrink-0 self-start shadow-sm">
                                    <div className="mb-6">
                                        <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-slate-400">Algorithm Subroutine</label>
                                        <select
                                            value={cpuAlgo}
                                            onChange={e => setCpuAlgo(e.target.value)}
                                            className="w-full border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-mono text-slate-800 outline-none focus:border-slate-900 rounded-none cursor-pointer"
                                        >
                                            <option value="FCFS">FCFS_QUEUE</option>
                                            <option value="SJF">SJF_NON_PREEMPTIVE</option>
                                            <option value="RR">ROUND_ROBIN (TQ=2)</option>
                                            <option value="SRTF">SRTF_PREEMPTIVE</option>
                                            <option value="HRRN">HRRN_QUEUE</option>
                                            <option value="LCN">LCN_PREEMPTIVE</option>
                                        </select>
                                    </div>
                                    <ProcessInput onAdd={addProcess} />
                                    <div className="mt-6 border-t border-slate-100 pt-6">
                                        <ProcessTable processes={processes.map(p => ({ id: p.id, name: p.id, arrival: p.arrivalTime, burst: p.burstTime }))} onDelete={deleteProcess} />
                                    </div>
                                </aside>

                                <section className="flex-1 space-y-8">
                                    <div className="flex items-center justify-between border border-slate-200 bg-white p-5 rounded-none shadow-sm">
                                        <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-900">Simulation_Runtime</h2>
                                        <div className="flex gap-2">
                                            {!isPlaying ? (
                                                <button onClick={handlePlay} className="inline-flex items-center gap-1.5 bg-slate-900 text-white px-5 py-2 text-[10px] font-bold uppercase tracking-widest hover:bg-slate-800 transition-all rounded-none cursor-pointer disabled:opacity-50 shadow-sm">
                                                    <Play size={14} /> Play
                                                </button>
                                            ) : (
                                                <button onClick={handlePause} className="inline-flex items-center gap-1.5 border border-slate-300 bg-white text-slate-900 px-5 py-2 text-[10px] font-bold uppercase tracking-widest hover:bg-slate-50 transition-all rounded-none cursor-pointer">
                                                    <Pause size={14} /> Pause
                                                </button>
                                            )}
                                            <button onClick={handleReset} className="inline-flex items-center gap-1.5 border border-slate-300 bg-white text-slate-900 px-5 py-2 text-[10px] font-bold uppercase tracking-widest hover:bg-slate-50 transition-all rounded-none cursor-pointer">
                                                <RotateCcw size={14} /> Reset
                                            </button>
                                        </div>
                                    </div>

                                    <div className="w-full overflow-x-auto whitespace-nowrap scrollbar-thin scrollbar-thumb-slate-200 shadow-sm bg-white p-2 border border-slate-200">
                                        <GanttChart results={cpuResults} revealedCount={revealedCount} />
                                    </div>

                                    {/* EXPLAINER PANEL — Step-by-step decision log */}
                                    <ExplainerPanel
                                        results={cpuResults}
                                        revealedCount={revealedCount}
                                        onStepChange={handleStepChange}
                                        isPlaying={isPlaying}
                                    />

                                    <CalculationTable results={cpuResults} />
                                </section>
                            </div>
                        )}

                        {currentView === 'Memory' && (
                            <div className="flex flex-col lg:flex-row gap-8">
                                <aside className="w-full lg:w-80 border border-slate-300 bg-white p-6 rounded-none flex-shrink-0 self-start shadow-sm">
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
                                <section className="flex-1 w-full overflow-x-auto whitespace-nowrap scrollbar-thin shadow-sm">
                                    <MemoryGrid partitions={partitions} requests={memRequests} algorithm={memAlgo} />
                                </section>
                            </div>
                        )}

                        {currentView === 'Disk' && <DiskScheduling />}
                        {currentView === 'Deadlock' && <BankersAlgorithm />}
                        {currentView === 'Page' && <PageReplacement />}
                    </div>
                </main>
                <Footer />
            </div>
        </div>
    );
}
