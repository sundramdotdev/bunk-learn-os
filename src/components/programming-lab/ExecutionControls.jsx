import React from 'react';
import { Play, Loader2, RotateCcw, BrainCircuit } from 'lucide-react';

export default function ExecutionControls({ 
    isExecuting, runCode, executionMetrics,
    learningMode, setLearningMode,
    isRuntimeLoading, runtimeError, retryRuntimeLoad
}) {
    return (
        <div className="bg-white border-b border-slate-200 p-4 flex flex-col md:flex-row gap-4 items-center justify-between shrink-0 shadow-sm z-10 relative">
            <div className="flex items-center gap-4 w-full md:w-auto">
                <button 
                    onClick={runCode}
                    disabled={isExecuting || isRuntimeLoading || runtimeError !== null}
                    className="w-full md:w-auto flex items-center justify-center gap-2 bg-emerald-600 text-white px-6 py-2.5 text-xs font-bold uppercase tracking-widest hover:bg-emerald-700 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                >
                    {(isExecuting || isRuntimeLoading) ? <Loader2 size={16} className="animate-spin" /> : <Play size={16} className="fill-current" />} 
                    {isRuntimeLoading ? 'Loading Runtime...' : isExecuting ? 'Executing...' : 'Run Code'}
                </button>
                
                <button 
                    disabled={isExecuting || isRuntimeLoading}
                    className="w-full md:w-auto flex items-center justify-center gap-2 bg-slate-100 text-slate-700 px-4 py-2.5 text-xs font-bold uppercase tracking-widest hover:bg-slate-200 transition-all cursor-pointer disabled:opacity-50"
                >
                    <RotateCcw size={14} /> Restart
                </button>
            </div>

            <div className="flex items-center gap-4 w-full md:w-auto">
                {runtimeError && (
                    <div className="flex items-center gap-2 mr-2 text-xs font-mono text-red-600 font-bold bg-red-50 px-3 py-1.5 rounded border border-red-200">
                        <span className="truncate max-w-[200px]" title={runtimeError}>Failed to load Python.</span>
                        {retryRuntimeLoad && (
                            <button 
                                onClick={retryRuntimeLoad}
                                className="ml-1 bg-red-100 hover:bg-red-200 text-red-700 px-2 py-0.5 rounded transition-colors uppercase tracking-wider text-[10px]"
                            >
                                Retry
                            </button>
                        )}
                    </div>
                )}
                {executionMetrics.status !== 'Idle' && !runtimeError && (
                    <div className="hidden lg:flex items-center gap-3 mr-4 text-xs font-mono">
                        <span className="text-slate-500 uppercase font-bold tracking-widest text-[10px]">Status:</span>
                        <span className={executionMetrics.status === 'Execution Failed' ? 'text-red-500 font-bold' : 'text-emerald-600 font-bold'}>{executionMetrics.status}</span>
                        <span className="text-slate-300">|</span>
                        <span className="text-slate-500 uppercase font-bold tracking-widest text-[10px]">Time:</span>
                        <span className="text-slate-800">{Math.round(executionMetrics.time)}ms</span>
                    </div>
                )}
                
                <button 
                    onClick={() => setLearningMode(!learningMode)}
                    className={`w-full md:w-auto flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold uppercase tracking-widest transition-all cursor-pointer border shadow-sm ${learningMode ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
                >
                    <BrainCircuit size={16} className={learningMode ? 'text-indigo-600' : 'text-slate-400'} /> 
                    Learning Mode {learningMode ? 'ON' : 'OFF'}
                </button>
            </div>
        </div>
    );
}
