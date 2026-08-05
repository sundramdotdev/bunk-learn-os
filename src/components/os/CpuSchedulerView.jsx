import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import ProcessInput from '../ProcessInput';
import ProcessTable from '../ProcessTable';
import GanttChart from '../GanttChart';
import ExplainerPanel from '../ExplainerPanel';
import CalculationTable from '../CalculationTable';
import {
    calculateFCFS as calculateCPU_FCFS,
    calculateSJF_NonPreemptive,
    calculateRoundRobin,
    calculateSRTF,
    calculateHRRN,
    calculateLCN,
} from '../../services/os/SchedulerLogic';

export default function CpuSchedulerView({ globalResetTick }) {
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

    useEffect(() => {
        if (globalResetTick > 0) {
            setProcesses([]);
            setCpuResults([]);
            handleReset();
        }
    }, [globalResetTick]);

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

    const handleStepChange = useCallback((newCount) => {
        setRevealedCount(newCount);
        setIsPlaying(false);
        if (timerRef.current) clearInterval(timerRef.current);
    }, []);

    const addProcess = (proc) => setProcesses((prev) => [...prev, { id: proc.name, arrivalTime: proc.arrival, burstTime: proc.burst }]);
    const deleteProcess = (id) => setProcesses((prev) => prev.filter((p) => p.id !== id));

    return (
        <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
            <aside className="w-full lg:w-80 border border-slate-300 bg-white p-4 md:p-6 rounded-none flex-shrink-0 self-start shadow-sm">
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
                    <div className="overflow-x-auto w-full">
                        <ProcessTable processes={processes.map(p => ({ id: p.id, name: p.id, arrival: p.arrivalTime, burst: p.burstTime }))} onDelete={deleteProcess} />
                    </div>
                </div>
            </aside>

            <section className="flex-1 space-y-6 md:space-y-8 min-w-0">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border border-slate-200 bg-white p-4 md:p-5 rounded-none shadow-sm">
                    <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-900">Simulation_Runtime</h2>
                    <div className="flex gap-2">
                        {!isPlaying ? (
                            <button onClick={handlePlay} className="inline-flex items-center gap-1.5 bg-slate-900 text-white px-4 md:px-5 py-2 text-[10px] font-bold uppercase tracking-widest hover:bg-slate-800 transition-all rounded-none cursor-pointer disabled:opacity-50 shadow-sm">
                                <Play size={14} /> Play
                            </button>
                        ) : (
                            <button onClick={handlePause} className="inline-flex items-center gap-1.5 border border-slate-300 bg-white text-slate-900 px-4 md:px-5 py-2 text-[10px] font-bold uppercase tracking-widest hover:bg-slate-50 transition-all rounded-none cursor-pointer">
                                <Pause size={14} /> Pause
                            </button>
                        )}
                        <button onClick={handleReset} className="inline-flex items-center gap-1.5 border border-slate-300 bg-white text-slate-900 px-4 md:px-5 py-2 text-[10px] font-bold uppercase tracking-widest hover:bg-slate-50 transition-all rounded-none cursor-pointer">
                            <RotateCcw size={14} /> Reset
                        </button>
                    </div>
                </div>

                <div className="w-full overflow-x-auto scrollbar-thin scrollbar-thumb-slate-200 shadow-sm bg-white p-2 border border-slate-200">
                    <GanttChart results={cpuResults} revealedCount={revealedCount} />
                </div>

                <ExplainerPanel
                    results={cpuResults}
                    revealedCount={revealedCount}
                    onStepChange={handleStepChange}
                    isPlaying={isPlaying}
                />

                <div className="overflow-x-auto w-full">
                    <CalculationTable results={cpuResults} />
                </div>
            </section>
        </div>
    );
}
