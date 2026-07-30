import React from 'react';
import { Send, Server, Database, Globe, ArrowRight, Play, Loader2 } from 'lucide-react';
import { HTTP_STATUS } from '../../services/api/ApiService';
import { useApiPlayground } from '../../hooks/useApiPlayground';

export default function ApiPlayground() {
    const {
        method, setMethod,
        endpoint, setEndpoint,
        body, setBody,
        response, isLoading, animState,
        handleSend
    } = useApiPlayground();

    const getStatusColor = (code) => {
        if (code >= 200 && code < 300) return 'text-emerald-500 bg-emerald-50 border-emerald-200';
        if (code >= 400 && code < 500) return 'text-amber-500 bg-amber-50 border-amber-200';
        if (code >= 500) return 'text-red-500 bg-red-50 border-red-200';
        return 'text-slate-500 bg-slate-50 border-slate-200';
    };

    const methodColor = {
        GET: 'text-blue-600',
        POST: 'text-emerald-600',
        PUT: 'text-amber-600',
        PATCH: 'text-amber-600',
        DELETE: 'text-red-600'
    };

    return (
        <div className="flex flex-col lg:flex-row gap-6 md:gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Left: Request Configuration */}
            <aside className="w-full lg:w-1/3 border border-slate-300 bg-white p-4 md:p-6 rounded-none shadow-sm flex flex-col space-y-6">
                
                <div className="flex items-center gap-2 mb-2">
                    <Server size={16} className="text-slate-900" />
                    <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-900">Request Configuration</h2>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Endpoint</label>
                    <div className="flex border border-slate-200 bg-slate-50 focus-within:border-slate-900 transition-colors">
                        <select 
                            value={method} 
                            onChange={e => setMethod(e.target.value)}
                            className={`px-3 py-2 text-xs font-bold font-mono outline-none bg-transparent cursor-pointer ${methodColor[method]}`}
                        >
                            <option>GET</option>
                            <option>POST</option>
                            <option>PUT</option>
                            <option>PATCH</option>
                            <option>DELETE</option>
                        </select>
                        <div className="w-px bg-slate-200" />
                        <input 
                            type="text" 
                            value={endpoint}
                            onChange={e => setEndpoint(e.target.value)}
                            className="flex-1 px-3 py-2 text-xs font-mono outline-none bg-transparent"
                            placeholder="/api/resource"
                            spellCheck="false"
                        />
                    </div>
                </div>

                <div className="space-y-2 flex-1 flex flex-col">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">JSON Body</label>
                    <textarea 
                        value={body}
                        onChange={e => setBody(e.target.value)}
                        disabled={['GET', 'DELETE'].includes(method)}
                        className="flex-1 w-full h-32 border border-slate-200 bg-slate-50 p-3 font-mono text-xs outline-none focus:border-slate-900 resize-none disabled:opacity-50 disabled:bg-slate-100"
                        spellCheck="false"
                    />
                </div>

                <div className="pt-4 border-t border-slate-100">
                    <button 
                        onClick={handleSend}
                        disabled={isLoading}
                        className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white px-4 py-3 text-xs font-bold uppercase tracking-[0.2em] hover:bg-slate-800 transition-all cursor-pointer disabled:opacity-70"
                    >
                        {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                        Send Request
                    </button>
                </div>
            </aside>

            {/* Center: Network Flow Animation */}
            <section className="w-full lg:w-1/3 flex flex-col space-y-6">
                <div className="border border-slate-300 bg-white p-4 md:p-6 shadow-sm flex flex-col items-center justify-center min-h-[300px]">
                    <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-8">Network Flow</h2>
                    
                    <div className="flex flex-col gap-6 items-center w-full max-w-xs relative">
                        {/* Nodes */}
                        <div className={`flex items-center gap-3 p-3 border-2 ${animState === 1 || animState === 6 ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 bg-white'} rounded-none transition-colors w-full justify-center`}>
                            <Play size={18} className="text-slate-700" />
                            <span className="font-mono text-xs font-bold">Client</span>
                        </div>

                        <div className="h-6 w-px bg-slate-300 relative">
                            {(animState === 1 || animState === 6) && <div className={`absolute left-[-3px] top-0 w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping ${animState===6 ? 'top-auto bottom-0' : ''}`} />}
                        </div>

                        <div className={`flex items-center gap-3 p-3 border-2 ${animState === 2 || animState === 5 ? 'border-blue-500 bg-blue-50' : 'border-slate-200 bg-white'} rounded-none transition-colors w-full justify-center`}>
                            <Globe size={18} className="text-slate-700" />
                            <span className="font-mono text-xs font-bold">Internet (Routing)</span>
                        </div>

                        <div className="h-6 w-px bg-slate-300 relative">
                            {(animState === 2 || animState === 5) && <div className={`absolute left-[-3px] top-0 w-1.5 h-1.5 bg-blue-500 rounded-full animate-ping ${animState===5 ? 'top-auto bottom-0' : ''}`} />}
                        </div>

                        <div className={`flex items-center gap-3 p-3 border-2 ${animState === 3 || animState === 4 ? 'border-purple-500 bg-purple-50' : 'border-slate-200 bg-white'} rounded-none transition-colors w-full justify-center`}>
                            <Server size={18} className="text-slate-700" />
                            <span className="font-mono text-xs font-bold">Server (App)</span>
                        </div>

                        <div className="h-6 w-px bg-slate-300 relative">
                            {(animState === 3 || animState === 4) && <div className={`absolute left-[-3px] top-0 w-1.5 h-1.5 bg-purple-500 rounded-full animate-ping ${animState===4 ? 'top-auto bottom-0' : ''}`} />}
                        </div>

                        <div className={`flex items-center gap-3 p-3 border-2 ${animState === 4 ? 'border-amber-500 bg-amber-50' : 'border-slate-200 bg-white'} rounded-none transition-colors w-full justify-center`}>
                            <Database size={18} className="text-slate-700" />
                            <span className="font-mono text-xs font-bold">Database</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Right: Response Viewer */}
            <aside className="w-full lg:w-1/3 border border-slate-300 bg-white p-4 md:p-6 rounded-none shadow-sm flex flex-col space-y-6">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                        <ArrowRight size={16} className="text-slate-900" />
                        <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-900">Response</h2>
                    </div>
                    {response && (
                        <div className="text-[10px] font-mono text-slate-500">
                            {response.time}ms
                        </div>
                    )}
                </div>

                {!response ? (
                    <div className="flex-1 flex items-center justify-center border border-slate-200 bg-slate-50 text-slate-400 font-mono text-xs p-4 text-center">
                        Hit 'Send Request' to see the response here.
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col space-y-4">
                        
                        <div className={`flex flex-col border p-3 ${getStatusColor(response.status)}`}>
                            <div className="flex items-center justify-between mb-1">
                                <span className="font-black font-mono text-xl">{response.status}</span>
                                <span className="font-bold text-xs">{HTTP_STATUS[response.status]?.text || 'Unknown'}</span>
                            </div>
                            <span className="text-[10px] opacity-80 leading-snug">{HTTP_STATUS[response.status]?.desc}</span>
                        </div>

                        <div className="flex-1 flex flex-col space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Response Body</label>
                            <div className="flex-1 border border-slate-200 bg-slate-900 text-slate-300 p-3 overflow-auto font-mono text-xs relative">
                                {response.status === 204 ? (
                                    <span className="text-slate-500 italic">No Content</span>
                                ) : (
                                    <pre className="whitespace-pre-wrap">{JSON.stringify(response.data, null, 2)}</pre>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </aside>
        </div>
    );
}
