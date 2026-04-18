import React, { useState, useMemo } from 'react';
import { Hash, Calculator, Table as TableIcon, ArrowRightLeft, Info, HelpCircle } from 'lucide-react';

const BASES = [
    { id: '10', name: 'Decimal', placeholder: 'e.g. 255' },
    { id: '2', name: 'Binary', placeholder: 'e.g. 11111111' },
    { id: '8', name: 'Octal', placeholder: 'e.g. 377' },
    { id: '16', name: 'Hexadecimal', placeholder: 'e.g. FF' },
    { id: 'ASCII', name: 'ASCII', placeholder: 'e.g. A' },
];

export default function NumberSystem() {
    const [inputValue, setInputValue] = useState('65');
    const [inputBase, setInputBase] = useState('10');

    const conversions = useMemo(() => {
        let decimalValue = null;

        // Step 1: Normalize input to Decimal
        try {
            if (inputBase === 'ASCII') {
                decimalValue = inputValue.charCodeAt(0);
            } else {
                decimalValue = parseInt(inputValue, parseInt(inputBase));
            }
        } catch (e) {
            decimalValue = NaN;
        }

        if (isNaN(decimalValue) || decimalValue === null) {
            return {
                2: 'Invalid',
                8: 'Invalid',
                10: 'Invalid',
                16: 'Invalid',
                ASCII: 'Invalid',
                steps: []
            };
        }

        // Step 2: Convert to all other bases
        const results = {
            2: decimalValue.toString(2),
            8: decimalValue.toString(8),
            10: decimalValue.toString(10),
            16: decimalValue.toString(16).toUpperCase(),
            ASCII: String.fromCharCode(decimalValue),
        };

        // Step 3: Generate Step-by-Step for Decimal to Binary (if applicable)
        const steps = [];
        let tempDec = decimalValue;
        if (!isNaN(tempDec) && tempDec >= 0) {
            if (tempDec === 0) {
                steps.push({ quotient: 0, remainder: 0, bit: 0 });
            } else {
                while (tempDec > 0) {
                    const nextQuo = Math.floor(tempDec / 2);
                    const rem = tempDec % 2;
                    steps.push({ original: tempDec, quotient: nextQuo, remainder: rem });
                    tempDec = nextQuo;
                }
            }
        }

        return { ...results, steps };
    }, [inputValue, inputBase]);

    const asciiTable = useMemo(() => {
        const table = [];
        for (let i = 0; i <= 127; i++) {
            table.push({
                dec: i,
                bin: i.toString(2).padStart(8, '0'),
                hex: i.toString(16).toUpperCase().padStart(2, '0'),
                char: i <= 32 ? (i === 32 ? 'Space' : 'Ctrl') : String.fromCharCode(i)
            });
        }
        return table;
    }, []);

    return (
        <div className="space-y-8 animate-in fade-in duration-500 max-w-6xl mx-auto">
            
            {/* ── Header ── */}
            <div className="flex items-center justify-between border-b-2 border-slate-900 pb-4">
                <div>
                    <h2 className="text-xl font-bold uppercase tracking-tighter text-slate-900 flex items-center gap-2">
                        <Hash className="w-5 h-5" />
                        Number_System_Subroutine
                    </h2>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                        CS_Fundamentals // Realtime_Conversion // Step_Logic
                    </p>
                </div>
                <div className="hidden md:block bg-slate-900 text-white px-3 py-1 text-[10px] font-bold uppercase tracking-widest">
                    Status: Operational
                </div>
            </div>

            {/* ── Main Input Card ── */}
            <section className="border-2 border-slate-900 bg-white p-6 md:p-10 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)]">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
                    <div className="md:col-span-1">
                        <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-slate-500">
                            Input_Base
                        </label>
                        <select
                            value={inputBase}
                            onChange={(e) => setInputBase(e.target.value)}
                            className="w-full border-2 border-slate-900 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-900 outline-none focus:bg-white rounded-none cursor-pointer"
                        >
                            {BASES.map(b => (
                                <option key={b.id} value={b.id}>{b.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="md:col-span-3">
                        <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-slate-500">
                            Numeric_Value
                        </label>
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder={BASES.find(b => b.id === inputBase)?.placeholder}
                            className="w-full border-2 border-slate-900 bg-white px-6 py-3 text-2xl font-mono font-bold text-slate-900 outline-none placeholder:text-slate-200 rounded-none shadow-sm"
                        />
                    </div>
                </div>
            </section>

            {/* ── Real-time Conversion Cards ── */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {BASES.filter(b => b.id !== inputBase).map(base => (
                    <div key={base.id} className="border border-slate-300 bg-white p-5 group hover:border-slate-900 transition-colors duration-200">
                        <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 group-hover:text-slate-900">
                                {base.name}
                            </span>
                            <ArrowRightLeft className="w-3 h-3 text-slate-200 group-hover:text-slate-400" />
                        </div>
                        <div className="text-xl font-mono font-bold text-slate-900 break-all">
                            {conversions[base.id]}
                        </div>
                    </div>
                ))}
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* ── Step-by-Step Breakdown (Division by 2) ── */}
                <section className="space-y-4">
                    <div className="flex items-center gap-2">
                        <Calculator className="w-4 h-4 text-slate-900" />
                        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-900">Conversion_Manual_Trace</h3>
                    </div>
                    <div className="border border-slate-300 bg-white overflow-hidden">
                        <div className="bg-slate-50 border-b border-slate-300 px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                            Method: Successive Division by 2 (Decimal ➔ Binary)
                        </div>
                        <div className="p-4 overflow-x-auto">
                            {conversions.steps.length > 0 ? (
                                <table className="w-full text-xs font-mono">
                                    <thead>
                                        <tr className="border-b border-slate-200 text-left">
                                            <th className="py-2 pr-4 font-bold text-slate-400">Step</th>
                                            <th className="py-2 pr-4 font-bold text-slate-400">Operation</th>
                                            <th className="py-2 pr-4 font-bold text-slate-400">Quotient</th>
                                            <th className="py-2 font-bold text-slate-900">Remainder</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {conversions.steps.map((s, i) => (
                                            <tr key={i} className="hover:bg-slate-50">
                                                <td className="py-2 pr-4 text-slate-400">{i + 1}</td>
                                                <td className="py-2 pr-4 text-slate-500">{s.original} / 2</td>
                                                <td className="py-2 pr-4">{s.quotient}</td>
                                                <td className="py-2 font-bold text-indigo-600">{s.remainder}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot>
                                        <tr className="bg-slate-900 text-white">
                                            <td colSpan={4} className="p-3 text-center">
                                                <span className="text-[10px] uppercase tracking-widest font-bold opacity-60">Result (Bottom to Top):</span>
                                                <span className="ml-3 font-bold text-sm tracking-wider">
                                                    {[...conversions.steps].reverse().map(s => s.remainder).join('')}
                                                </span>
                                            </td>
                                        </tr>
                                    </tfoot>
                                </table>
                            ) : (
                                <div className="py-10 text-center space-y-3">
                                    <HelpCircle className="w-8 h-8 text-slate-200 mx-auto" />
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                                        Input a positive decimal value to see trace.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* ── ASCII Reference Table ── */}
                <section className="space-y-4">
                    <div className="flex items-center gap-2">
                        <TableIcon className="w-4 h-4 text-slate-900" />
                        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-900">ASCII_Reference_Manual</h3>
                    </div>
                    <div className="border border-slate-300 bg-white">
                        <div className="bg-slate-50 border-b border-slate-300 px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                            Standard ASCII (0-127)
                        </div>
                        <div className="h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100 p-0">
                            <table className="w-full text-left border-collapse font-mono">
                                <thead className="sticky top-0 bg-white shadow-sm z-10">
                                    <tr>
                                        <th className="px-4 py-2 text-[10px] font-bold text-slate-400 uppercase">Dec</th>
                                        <th className="px-4 py-2 text-[10px] font-bold text-slate-400 uppercase">Hex</th>
                                        <th className="px-4 py-2 text-[10px] font-bold text-slate-400 uppercase">Bin</th>
                                        <th className="px-4 py-2 text-[10px] font-bold text-slate-900 uppercase">Char</th>
                                    </tr>
                                </thead>
                                <tbody className="text-[11px] divide-y divide-slate-50">
                                    {asciiTable.map(item => (
                                        <tr key={item.dec} className={`hover:bg-slate-50 ${conversions[10] == item.dec ? 'bg-indigo-50 font-bold' : ''}`}>
                                            <td className="px-4 py-1.5 text-slate-500">{item.dec}</td>
                                            <td className="px-4 py-1.5 text-slate-400">{item.hex}</td>
                                            <td className="px-4 py-1.5 text-[9px] text-slate-300">{item.bin}</td>
                                            <td className="px-4 py-1.5 text-slate-900">{item.char}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>
            </div>

            {/* ── Footer / Tips ── */}
            <div className="flex items-center gap-3 bg-slate-900 text-white p-4 text-[10px] uppercase tracking-[0.2em] font-bold">
                <Info size={14} className="text-cyan-400" />
                <span>Tip: Use Hexadecimal (Base 16) for memory addressing and Binary (Base 2) for logic gates.</span>
            </div>
        </div>
    );
}
