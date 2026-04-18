import React, { useState, useEffect } from 'react';
import { calculateBankersAlgorithm } from '../utils/DeadlockLogic';
import ModuleExplainer from './ModuleExplainer';


export default function BankersAlgorithm({ clearSignal }) {
    const [numProcesses, setNumProcesses] = useState(5);
    const [numResources, setNumResources] = useState(3);

    const [allocation, setAllocation] = useState([
        [0, 1, 0], [2, 0, 0], [3, 0, 2], [2, 1, 1], [0, 0, 2]
    ]);
    const [max, setMax] = useState([
        [7, 5, 3], [3, 2, 2], [9, 0, 2], [2, 2, 2], [4, 3, 3]
    ]);
    const [available, setAvailable] = useState([3, 3, 2]);
    const [processIds, setProcessIds] = useState(['P0', 'P1', 'P2', 'P3', 'P4']);

    const [results, setResults] = useState(null);


    useEffect(() => {
        if (clearSignal > 0) {

            const zeroMatrix = Array.from({ length: numProcesses }, () => Array(numResources).fill(0));
            setAllocation(zeroMatrix);
            setMax(zeroMatrix);
            setAvailable(Array(numResources).fill(0));
            setResults(null);
        }
    }, [clearSignal, numProcesses, numResources]);


    useEffect(() => {
        const res = calculateBankersAlgorithm(allocation, max, available, processIds);
        setResults(res);
    }, [allocation, max, available, processIds]);

    const handleMatrixChange = (matrix, setMatrix, row, col, value) => {
        const newMatrix = [...matrix];
        newMatrix[row][col] = parseInt(value) || 0;
        setMatrix(newMatrix);
    };

    const handleAvailableChange = (col, value) => {
        const newAvailable = [...available];
        newAvailable[col] = parseInt(value) || 0;
        setAvailable(newAvailable);
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {/* Inputs Area */}
                <div className="space-y-6">
                    {/* Allocation Matrix */}
                    <div className="border border-slate-300 bg-white p-4 md:p-6 rounded-none shadow-none">
                        <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-slate-900 border-b border-slate-200 pb-2">
                            Allocation Matrix
                        </h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-xs font-mono">
                                <thead>
                                    <tr>
                                        <th className="p-2"></th>
                                        {Array.from({ length: numResources }).map((_, j) => (
                                            <th key={j} className="p-2 border border-slate-200 bg-slate-50">R{j}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {allocation.map((row, i) => (
                                        <tr key={i}>
                                            <td className="p-2 font-bold border border-slate-200 bg-slate-50">{processIds[i]}</td>
                                            {row.map((val, j) => (
                                                <td key={j} className="p-1 border border-slate-100">
                                                    <input
                                                        type="number"
                                                        value={val}
                                                        onChange={(e) => handleMatrixChange(allocation, setAllocation, i, j, e.target.value)}
                                                        className="w-full p-1 border-none focus:bg-slate-50 outline-none text-center"
                                                    />
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Max Matrix */}
                    <div className="border border-slate-300 bg-white p-4 md:p-6 rounded-none shadow-none">
                        <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-slate-900 border-b border-slate-200 pb-2">
                            Max Matrix
                        </h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-xs font-mono">
                                <thead>
                                    <tr>
                                        <th className="p-2"></th>
                                        {Array.from({ length: numResources }).map((_, j) => (
                                            <th key={j} className="p-2 border border-slate-200 bg-slate-50">R{j}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {max.map((row, i) => (
                                        <tr key={i}>
                                            <td className="p-2 font-bold border border-slate-200 bg-slate-50">{processIds[i]}</td>
                                            {row.map((val, j) => (
                                                <td key={j} className="p-1 border border-slate-100">
                                                    <input
                                                        type="number"
                                                        value={val}
                                                        onChange={(e) => handleMatrixChange(max, setMax, i, j, e.target.value)}
                                                        className="w-full p-1 border-none focus:bg-slate-50 outline-none text-center"
                                                    />
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Available Vector */}
                    <div className="border border-slate-300 bg-white p-4 md:p-6 rounded-none shadow-none">
                        <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-slate-900 border-b border-slate-200 pb-2">
                            Available Resources
                        </h3>
                        <div className="flex gap-4">
                            {available.map((val, j) => (
                                <div key={j} className="flex-1 flex flex-col items-center border border-slate-200 bg-slate-50 p-2">
                                    <span className="text-[10px] text-slate-500 font-bold mb-1">R{j}</span>
                                    <input
                                        type="number"
                                        value={val}
                                        onChange={(e) => handleAvailableChange(j, e.target.value)}
                                        className="w-full p-1 bg-white border border-slate-300 text-center text-xs outline-none focus:border-slate-900"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Analysis Area */}
                <div className="space-y-6">
                    {/* Need Matrix */}
                    {results && (
                        <div className="border border-slate-300 bg-white p-4 md:p-6 rounded-none shadow-none">
                            <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-slate-900 border-b border-slate-200 pb-2">
                                Need Matrix (Calculated)
                            </h3>
                            <div className="overflow-x-auto">
                                <table className="w-full text-xs font-mono">
                                    <thead>
                                        <tr>
                                            <th className="p-2"></th>
                                            {Array.from({ length: numResources }).map((_, j) => (
                                                <th key={j} className="p-2 border border-slate-200 bg-slate-50">R{j}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {results.need.map((row, i) => (
                                            <tr key={i}>
                                                <td className="p-2 font-bold border border-slate-200 bg-slate-50">{processIds[i]}</td>
                                                {row.map((val, j) => (
                                                    <td key={j} className="p-2 border border-slate-100 text-center text-slate-600">
                                                        {val}
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Safety Status */}
                    {results && (
                        <div className={`border-2 p-4 md:p-6 rounded-none shadow-none transition-colors ${results.isSafe ? 'border-green-600 bg-green-50' : 'border-red-600 bg-red-50'}`}>
                            <div className="flex items-center gap-3 mb-4">
                                <div className={`w-3 h-3 ${results.isSafe ? 'bg-green-600' : 'bg-red-600'}`}></div>
                                <h3 className={`text-xs font-bold uppercase tracking-widest ${results.isSafe ? 'text-green-900' : 'text-red-900'}`}>
                                    System Status: {results.isSafe ? 'SAFE' : 'UNSAFE'}
                                </h3>
                            </div>

                            {results.isSafe && (
                                <div className="mb-6">
                                    <p className="text-[10px] font-bold text-slate-500 uppercase mb-2">Safe Sequence</p>
                                    <div className="flex flex-wrap gap-2">
                                        {results.safeSequence.map((id, idx) => (
                                            <React.Fragment key={id}>
                                                <span className="px-2 py-1 bg-slate-900 text-white text-xs font-bold">{id}</span>
                                                {idx < results.safeSequence.length - 1 && <span className="flex items-center text-slate-400">→</span>}
                                            </React.Fragment>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div>
                                <p className="text-[10px] font-bold text-slate-500 uppercase mb-2">Safety Check Logs</p>
                                <div className="bg-white border border-slate-200 p-3 max-h-48 overflow-y-auto font-mono text-[10px] space-y-1">
                                    {results.logs.map((log, idx) => (
                                        <div key={idx} className="border-l-2 border-slate-300 pl-2 py-0.5 text-slate-700">
                                            {log}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Explainer Panel */}
                    {results && results.steps && results.steps.length > 0 && (
                        <ModuleExplainer steps={results.steps} title="SAFETY_LOG" />
                    )}
                </div>
            </div>
        </div>
    );
}