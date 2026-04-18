import React, { useState, useMemo, useEffect } from 'react';
import {
  calculateFIFO,
  calculateLRU,
  calculateOptimal,
  calculateRAND,
  calculateNRU
} from '../utils/PageReplacementLogic';
import ModuleExplainer from './ModuleExplainer';


export default function PageReplacement({ clearSignal }) {
  const [inputStr, setInputStr] = useState("7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3, 2, 1, 2, 0, 1, 7, 0, 1");
  const [frameCount, setFrameCount] = useState(3);
  const [algorithm, setAlgorithm] = useState('FIFO');
  const [results, setResults] = useState(null);

  useEffect(() => {
    if (clearSignal > 0) {
      setInputStr("");
      setFrameCount(3);
      setAlgorithm('FIFO');
      setResults(null);
    }
  }, [clearSignal]);


  const handleRunSimulation = () => {

    const refArray = inputStr
      .split(',')
      .map(s => parseInt(s.trim()))
      .filter(n => !isNaN(n));

    if (refArray.length === 0) {
      alert("Please enter a valid reference string.");
      return;
    }

    let calculatedResults;
    switch (algorithm) {
      case 'FIFO':
        calculatedResults = calculateFIFO(refArray, frameCount);
        break;
      case 'LRU':
        calculatedResults = calculateLRU(refArray, frameCount);
        break;
      case 'Optimal':
        calculatedResults = calculateOptimal(refArray, frameCount);
        break;
      case 'RAND':
        calculatedResults = calculateRAND(refArray, frameCount);
        break;
      case 'NRU':
        calculatedResults = calculateNRU(refArray, frameCount);
        break;
      default:
        calculatedResults = calculateFIFO(refArray, frameCount);
    }
    setResults(calculatedResults);
  };

  const explainerSteps = useMemo(() => {
    if (!results || !results.history) return [];
    return results.history.map((step, idx) => ({
      reason: step.reason || '',
      reasonHi: step.reasonHi || '',
      context: {
        'PAGE': step.page,
        'STATUS': step.status === 'Hit' ? '✅ HIT' : '❌ FAULT',
        'FRAMES': `[${step.frames.filter(f => f !== null).join(', ')}]`,
        'STEP': `${idx + 1} / ${results.history.length}`,
      }
    }));
  }, [results]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* ── Configuration Dashboard ── */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <div className="border border-slate-300 bg-white p-6 rounded-none shadow-none">
            <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-slate-900 border-b border-slate-100 pb-2">
              Simulation Control
            </h3>

            <div className="space-y-5">
              <div>
                <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-slate-500">Page Algorithm</label>
                <select
                  value={algorithm}
                  onChange={(e) => setAlgorithm(e.target.value)}
                  className="w-full border border-slate-300 bg-slate-50 px-3 py-2 text-xs font-mono text-slate-800 outline-none focus:border-slate-900 rounded-none cursor-pointer transition-all"
                >
                  <option value="FIFO">FIFO (FIRST_IN_FIRST_OUT)</option>
                  <option value="LRU">LRU (LEAST_RECENTLY_USED)</option>
                  <option value="Optimal">OPT (OPTIMAL_REPLACEMENT)</option>
                  <option value="RAND">RAND (RANDOM_REPLACEMENT)</option>
                  <option value="NRU">NRU (NOT_RECENTLY_USED)</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-slate-500">Physical Frames</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={frameCount}
                  onChange={(e) => setFrameCount(parseInt(e.target.value) || 1)}
                  className="w-full border border-slate-300 bg-slate-50 px-3 py-2 text-xs font-mono text-slate-800 outline-none focus:border-slate-900 rounded-none transition-all"
                />
              </div>

              <div>
                <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-slate-500">Reference Sequence</label>
                <textarea
                  value={inputStr}
                  onChange={(e) => setInputStr(e.target.value)}
                  rows="4"
                  className="w-full border border-slate-300 bg-slate-50 px-3 py-2 text-xs font-mono text-slate-800 outline-none focus:border-slate-900 rounded-none border-t-2 border-t-slate-100 transition-all"
                  placeholder="7, 0, 1, 2, 0, 3..."
                />
              </div>

              <button
                onClick={handleRunSimulation}
                className="w-full bg-slate-900 text-white py-3 text-xs font-bold uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center justify-center gap-2 group"
              >
                Run Simulation
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics (Conditional) */}
          {results && (
            <div className="border border-slate-300 bg-white p-6 rounded-none space-y-6 animate-in slide-in-from-left duration-300">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-900 border-b border-slate-100 pb-2">
                Realtime Metrics
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="border border-slate-200 p-4 text-center bg-slate-50">
                  <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">Total Hits</p>
                  <p className="text-2xl font-bold text-green-600">{results.metrics.totalHits}</p>
                </div>
                <div className="border border-slate-200 p-4 text-center bg-slate-50">
                  <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">Total Faults</p>
                  <p className="text-2xl font-bold text-red-600">{results.metrics.totalFaults}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-end border-b border-slate-100 pb-2">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Hit Ratio</span>
                  <span className="text-sm font-bold text-slate-900">{results.metrics.hitRatio}%</span>
                </div>
                <div className="flex justify-between items-end border-b border-slate-100 pb-2">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Fault Ratio</span>
                  <span className="text-sm font-bold text-slate-900">{results.metrics.faultRatio}%</span>
                </div>
              </div>

              <div className="bg-slate-900 p-4 text-white rounded-none">
                <p className="text-[9px] font-bold uppercase tracking-widest opacity-60 mb-2">Calculation Formula</p>
                <code className="text-[10px] font-mono block break-all">
                  HitRatio = {results.metrics.formula} = {results.metrics.hitRatio}%
                </code>
              </div>
            </div>
          )}
        </div>

        {/* ── Visualization Matrix ── */}
        <div className="lg:col-span-3 space-y-6">
          <div className="border border-slate-300 bg-white p-6 rounded-none min-h-[400px]">
            <div className="flex items-center justify-between mb-8 border-b border-slate-100 pb-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-900">
                Step-by-Step Execution Log
              </h3>
              <div className="text-[10px] font-mono text-slate-400">
                FRAME_COUNT: {frameCount} | ALGO: {algorithm}
              </div>
            </div>

            {!results ? (
              <div className="flex flex-col items-center justify-center h-64 text-slate-300 border-2 border-dashed border-slate-100">
                <p className="text-xs font-mono uppercase tracking-[0.2em]">Awaiting Input Parameters</p>
              </div>
            ) : (
              <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-slate-200">
                <table className="w-full text-[10px] font-mono border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-900">
                      <th className="p-3 text-left w-16 border-r border-slate-200">Step</th>
                      <th className="p-3 text-center w-24 border-r border-slate-200">Ref Value</th>
                      <th className="p-3 text-left border-r border-slate-200">Frame State Visual Stack</th>
                      <th className="p-3 text-center w-24">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.history.map((step, idx) => (
                      <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                        <td className="p-3 text-slate-400 font-bold border-r border-slate-100">{idx + 1}</td>
                        <td className="p-3 text-center font-bold text-slate-900 border-r border-slate-100">
                          <span className="inline-block w-8 h-8 leading-8 bg-slate-100 rounded-none border border-slate-200">
                            {step.page}
                          </span>
                        </td>
                        <td className="p-3 border-r border-slate-100">
                          <div className="flex gap-2">
                            {step.frames.map((f, fIdx) => (
                              <div
                                key={fIdx}
                                className={`w-10 h-10 flex items-center justify-center border-2 transition-all duration-300
                                  ${f === step.page && step.status === 'Fault' ? 'border-red-500 bg-red-50 scale-105 z-10' :
                                    f === step.page && step.status === 'Hit' ? 'border-green-600 bg-green-50 z-10' :
                                      f === null ? 'border-dashed border-slate-200 text-slate-200' : 'border-slate-900 bg-white'}`}
                              >
                                {f !== null ? f : '-'}
                              </div>
                            ))}
                          </div>
                        </td>
                        <td className="p-3 text-center">
                          <span className={`${step.status === 'Hit' ? 'text-green-600' : 'text-red-600'} font-bold uppercase tracking-tighter text-[11px]`}>
                            {step.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {results && (
              <div className="mt-8 flex flex-wrap gap-6 border-t border-slate-100 pt-6">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-50 border-2 border-red-500"></div>
                  <span className="text-[9px] font-bold uppercase text-slate-500">New Allocation (Fault)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-50 border-2 border-green-600"></div>
                  <span className="text-[9px] font-bold uppercase text-slate-500">Existing Frame (Hit)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-white border-2 border-slate-900"></div>
                  <span className="text-[9px] font-bold uppercase text-slate-500">Standard Frame</span>
                </div>
              </div>
            )}
          </div>

          {/* Explainer Panel */}
          {explainerSteps.length > 0 && (
            <ModuleExplainer steps={explainerSteps} title="PAGE_LOG" />
          )}
        </div>
      </div>
    </div>
  );
}