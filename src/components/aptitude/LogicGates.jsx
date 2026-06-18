import React, { useState } from 'react';

const GATES = ['AND', 'OR', 'NOT', 'NAND', 'NOR', 'XOR', 'XNOR'];

const evaluateGate = (gate, a, b) => {
    const A = Boolean(a);
    const B = Boolean(b);
    switch (gate) {
        case 'AND': return A && B ? 1 : 0;
        case 'OR': return A || B ? 1 : 0;
        case 'NOT': return !A ? 1 : 0;
        case 'NAND': return !(A && B) ? 1 : 0;
        case 'NOR': return !(A || B) ? 1 : 0;
        case 'XOR': return A !== B ? 1 : 0;
        case 'XNOR': return A === B ? 1 : 0;
        default: return 0;
    }
};

const getTruthTable = (gate) => {
    if (gate === 'NOT') {
        return [
            { A: 0, Out: 1 },
            { A: 1, Out: 0 }
        ];
    }
    const rows = [];
    for (let a = 0; a <= 1; a++) {
        for (let b = 0; b <= 1; b++) {
            rows.push({ A: a, B: b, Out: evaluateGate(gate, a, b) });
        }
    }
    return rows;
};

export default function LogicGates() {
    const [gate, setGate] = useState('AND');
    const [inputA, setInputA] = useState(0);
    const [inputB, setInputB] = useState(0);

    const isNot = gate === 'NOT';
    const output = evaluateGate(gate, inputA, inputB);
    const truthTable = getTruthTable(gate);

    return (
        <div className="max-w-5xl mx-auto w-full space-y-6 md:space-y-8">
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                
                {/* Controls */}
                <aside className="border border-slate-300 bg-white p-4 md:p-6 shadow-sm self-start">
                    <div className="mb-8">
                        <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-slate-400">Select Logic Gate</label>
                        <select
                            value={gate}
                            onChange={(e) => setGate(e.target.value)}
                            className="w-full border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-800 outline-none focus:border-slate-900 cursor-pointer"
                        >
                            {GATES.map(g => <option key={g} value={g}>{g}</option>)}
                        </select>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-900 border-b border-slate-100 pb-2">Inputs</h3>
                        
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-600">Input A</span>
                            <button 
                                onClick={() => setInputA(inputA === 1 ? 0 : 1)}
                                className={`w-12 h-6 border transition-colors flex items-center justify-center font-mono text-xs font-bold cursor-pointer ${
                                    inputA === 1 ? 'bg-zinc-900 text-white border-zinc-900' : 'bg-white text-zinc-400 border-zinc-200'
                                }`}
                            >
                                {inputA}
                            </button>
                        </div>

                        {!isNot && (
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-slate-600">Input B</span>
                                <button 
                                    onClick={() => setInputB(inputB === 1 ? 0 : 1)}
                                    className={`w-12 h-6 border transition-colors flex items-center justify-center font-mono text-xs font-bold cursor-pointer ${
                                        inputB === 1 ? 'bg-zinc-900 text-white border-zinc-900' : 'bg-white text-zinc-400 border-zinc-200'
                                    }`}
                                >
                                    {inputB}
                                </button>
                            </div>
                        )}
                    </div>
                </aside>

                {/* Schema & Table */}
                <div className="lg:col-span-2 space-y-6 md:space-y-8">
                    
                    {/* Visual Schema */}
                    <div className="border border-slate-200 bg-white p-8 shadow-sm flex items-center justify-center overflow-x-auto min-h-[250px]">
                        <div className="flex items-center">
                            
                            {/* Inputs side */}
                            <div className="flex flex-col gap-10 justify-center">
                                <div className="flex items-center gap-2">
                                    <span className={`font-mono text-sm font-bold ${inputA === 1 ? 'text-zinc-900' : 'text-zinc-400'}`}>{inputA}</span>
                                    <div className={`w-12 sm:w-20 border-b-2 transition-colors ${inputA === 1 ? 'border-zinc-900' : 'border-zinc-200'}`} />
                                </div>
                                {!isNot && (
                                    <div className="flex items-center gap-2">
                                        <span className={`font-mono text-sm font-bold ${inputB === 1 ? 'text-zinc-900' : 'text-zinc-400'}`}>{inputB}</span>
                                        <div className={`w-12 sm:w-20 border-b-2 transition-colors ${inputB === 1 ? 'border-zinc-900' : 'border-zinc-200'}`} />
                                    </div>
                                )}
                            </div>

                            {/* Gate Box */}
                            <div className="w-24 h-28 border-2 border-zinc-900 bg-zinc-50 flex items-center justify-center relative shadow-sm">
                                <span className="font-bold text-slate-900 tracking-wider">{gate}</span>
                                {/* Connection points visually */}
                                <div className="absolute -left-1.5 top-[22px] w-2.5 h-2.5 bg-zinc-900 rounded-sm" />
                                {!isNot && <div className="absolute -left-1.5 bottom-[22px] w-2.5 h-2.5 bg-zinc-900 rounded-sm" />}
                                <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-zinc-900 rounded-sm" />
                            </div>

                            {/* Output side */}
                            <div className="flex items-center gap-2">
                                <div className={`w-12 sm:w-20 border-b-2 transition-colors ${output === 1 ? 'border-zinc-900' : 'border-zinc-200'}`} />
                                <span className={`font-mono text-sm font-bold ${output === 1 ? 'text-zinc-900' : 'text-zinc-400'}`}>{output}</span>
                            </div>

                        </div>
                    </div>

                    {/* Truth Table */}
                    <div className="border border-slate-200 bg-white shadow-sm overflow-hidden">
                        <div className="bg-slate-50 border-b border-slate-200 px-4 py-3">
                            <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-900">Truth Table ({gate})</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr>
                                        <th className="border-b border-slate-200 bg-white p-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">Input A</th>
                                        {!isNot && <th className="border-b border-slate-200 bg-white p-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">Input B</th>}
                                        <th className="border-b border-slate-200 bg-white p-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">Output</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {truthTable.map((row, idx) => {
                                        const isMatch = isNot ? (row.A === inputA) : (row.A === inputA && row.B === inputB);
                                        return (
                                            <tr key={idx} className={`border-b border-slate-100 last:border-none transition-colors ${isMatch ? 'bg-zinc-100' : 'bg-white'}`}>
                                                <td className={`p-3 font-mono text-sm font-bold ${isMatch ? 'text-zinc-900' : 'text-zinc-500'}`}>{row.A}</td>
                                                {!isNot && <td className={`p-3 font-mono text-sm font-bold ${isMatch ? 'text-zinc-900' : 'text-zinc-500'}`}>{row.B}</td>}
                                                <td className={`p-3 font-mono text-sm font-bold ${isMatch ? 'text-zinc-900' : 'text-zinc-500'}`}>{row.Out}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
