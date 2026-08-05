import React from 'react';
import { Database } from 'lucide-react';

export default function VariableInspector({ symbols = [] }) {
    return (
        <div className="flex flex-col h-full bg-white border border-slate-300 shadow-sm">
            <div className="p-3 border-b border-slate-200 bg-slate-50 flex items-center gap-2">
                <Database size={14} className="text-indigo-600" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-700">Variable Inspector</span>
            </div>
            <div className="flex-1 overflow-auto p-0 flex flex-col">
                <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-slate-100 text-slate-500 uppercase">
                        <tr>
                            <th className="px-3 py-2 font-medium">Name</th>
                            <th className="px-3 py-2 font-medium">Type</th>
                            <th className="px-3 py-2 font-medium">Scope</th>
                            <th className="px-3 py-2 font-medium">Address</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-800">
                        {symbols.length === 0 ? (
                            <tr><td colSpan="4" className="p-4 text-center text-slate-400 italic">No variables detected</td></tr>
                        ) : (
                            symbols.map((sym, i) => (
                                <tr key={i} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-3 py-2 font-bold text-indigo-700">{sym.name}</td>
                                    <td className="px-3 py-2 text-amber-600">{sym.type}</td>
                                    <td className="px-3 py-2 text-slate-500">{sym.scope}</td>
                                    <td className="px-3 py-2 text-slate-400">{sym.address}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
