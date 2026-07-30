import React from 'react';
import { Globe, Search, RefreshCw, Trash2, Copy, AlertCircle, Clock, Database, HardDrive, CheckCircle2 } from 'lucide-react';
import { useDNSLookup } from '../../hooks/useDNSLookup';
import LimitationsPanel from './LimitationsPanel';

export default function DNSSimulator() {
    const {
        domain, setDomain,
        history, clearHistory, copyResult, repeatLookup,
        isResolving, error, logs, activeHop, results,
        resolveDomain
    } = useDNSLookup();

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !isResolving && domain) {
            resolveDomain();
        }
    };

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
                
                {/* Controls Sidebar */}
                <aside className="w-full lg:w-1/3 flex flex-col gap-6 shrink-0">
                    <div className="border border-slate-300 bg-white p-4 md:p-6 shadow-sm space-y-4">
                        <div className="flex items-center gap-2 mb-2">
                            <Globe size={16} className="text-slate-900" />
                            <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-900">Real DNS Lookup</h2>
                        </div>
                        
                        <div className="flex border border-slate-200 bg-slate-50 focus-within:border-slate-900 transition-colors p-2">
                            <Search size={14} className="text-slate-400 mr-2 mt-0.5" />
                            <input 
                                type="text" 
                                value={domain}
                                onChange={e => setDomain(e.target.value)}
                                onKeyDown={handleKeyDown}
                                disabled={isResolving}
                                placeholder="example.com"
                                spellCheck="false"
                                className="flex-1 bg-transparent outline-none font-mono text-xs text-slate-800"
                            />
                        </div>

                        {error && (
                            <div className="text-red-500 text-xs flex items-start gap-1 font-medium bg-red-50 p-2 border border-red-100">
                                <AlertCircle size={14} className="shrink-0 mt-0.5" />
                                <span>{error}</span>
                            </div>
                        )}

                        <button 
                            onClick={resolveDomain}
                            disabled={isResolving || !domain}
                            className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white px-4 py-3 text-xs font-bold uppercase tracking-widest hover:bg-slate-800 transition-all cursor-pointer disabled:opacity-50"
                        >
                            {isResolving ? <RefreshCw size={14} className="animate-spin" /> : <Search size={14} />} 
                            {isResolving ? 'Resolving...' : 'Resolve Domain'}
                        </button>
                    </div>

                    {/* History Panel */}
                    {history.length > 0 && (
                        <div className="border border-slate-300 bg-white shadow-sm flex flex-col max-h-64">
                            <div className="p-3 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 flex items-center gap-1"><Clock size={12}/> History</span>
                                <button onClick={clearHistory} className="text-slate-400 hover:text-red-500 transition-colors" title="Clear History">
                                    <Trash2 size={12} />
                                </button>
                            </div>
                            <div className="overflow-y-auto p-2 space-y-1">
                                {history.map((h, i) => (
                                    <button 
                                        key={i} 
                                        onClick={() => repeatLookup(h.domain)}
                                        className="w-full text-left px-3 py-2 hover:bg-slate-100 text-xs font-mono text-slate-700 transition-colors flex justify-between items-center group"
                                    >
                                        <span className="truncate">{h.domain}</span>
                                        <RefreshCw size={10} className="opacity-0 group-hover:opacity-100 text-slate-400" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </aside>

                {/* Main Content */}
                <section className="flex-1 flex flex-col gap-6">
                    
                    {/* Educational Flow Animation Log */}
                    <div className="border border-slate-300 bg-slate-900 p-6 shadow-sm min-h-[220px] font-mono text-xs space-y-2 flex flex-col justify-end">
                        {logs.length === 0 && !isResolving && !results && (
                            <div className="text-slate-500 h-full flex items-center justify-center italic">Enter a domain to begin real lookup...</div>
                        )}
                        <div className="space-y-2 overflow-y-auto max-h-[200px] scrollbar-thin scrollbar-thumb-slate-700">
                            {logs.map((log, i) => (
                                <div key={i} className={`animate-in fade-in slide-in-from-bottom-2 ${log.startsWith('Error') ? 'text-red-400' : 'text-emerald-400'}`}>
                                    <span className="text-slate-500 mr-2">{'>'}</span> {log}
                                </div>
                            ))}
                            {isResolving && activeHop < 7 && (
                                <div className="text-slate-400 animate-pulse mt-2">
                                    <span className="text-slate-500 mr-2">{'>'}</span> Resolving...
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Real Data Results */}
                    {results && !isResolving && (
                        <div className="border border-slate-300 bg-white shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                                <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-700 flex items-center gap-2">
                                    <Database size={14} className="text-emerald-500" /> 
                                    Real DNS Records
                                </h3>
                                <div className="flex items-center gap-4">
                                    <span className="text-[10px] font-mono text-slate-500 bg-slate-200 px-2 py-0.5">
                                        {results.duration}ms
                                    </span>
                                    <button onClick={copyResult} className="text-slate-400 hover:text-slate-800 transition-colors flex items-center gap-1 text-[10px] uppercase font-bold tracking-widest">
                                        <Copy size={12} /> Copy JSON
                                    </button>
                                </div>
                            </div>
                            
                            <div className="p-0 overflow-x-auto">
                                <table className="w-full text-left text-xs font-mono">
                                    <thead className="bg-slate-100 text-slate-500 uppercase">
                                        <tr>
                                            <th className="px-4 py-2 font-medium w-24">Type</th>
                                            <th className="px-4 py-2 font-medium">Value / Target</th>
                                            <th className="px-4 py-2 font-medium w-20 text-right">TTL (s)</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 text-slate-800">
                                        {['A', 'AAAA', 'CNAME', 'MX', 'TXT'].map(type => {
                                            const typeRecords = results[type]?.records || [];
                                            if (typeRecords.length === 0) return null;
                                            
                                            return typeRecords.map((rec, idx) => (
                                                <tr key={`${type}-${idx}`} className="hover:bg-slate-50 transition-colors">
                                                    <td className="px-4 py-3 font-bold text-slate-900 border-r border-slate-50">{rec.type}</td>
                                                    <td className="px-4 py-3 break-all">{rec.data}</td>
                                                    <td className="px-4 py-3 text-right text-slate-500">{rec.ttl}</td>
                                                </tr>
                                            ));
                                        })}
                                        {['A', 'AAAA', 'CNAME', 'MX', 'TXT'].every(type => results[type]?.records?.length === 0) && (
                                            <tr>
                                                <td colSpan="3" className="px-4 py-8 text-center text-slate-500 italic">No standard records found for this domain.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </section>
            </div>
            
            <LimitationsPanel module="dns" />
        </div>
    );
}
