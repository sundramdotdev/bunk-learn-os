import React, { useState } from 'react';
import { Server, Globe, Play, Loader2, AlertCircle, Clock, Search, Link2, Code, Shield, Database } from 'lucide-react';
import { useHTTPRequest } from '../../hooks/useHTTPRequest';
import LimitationsPanel from './LimitationsPanel';

export default function HTTPSimulator() {
    const {
        url, setUrl,
        method, setMethod,
        headers, updateHeader, addHeader, removeHeader,
        body, setBody,
        isLoading, error, response, animState, sendRequest
    } = useHTTPRequest();

    const [activePanel, setActivePanel] = useState('general'); // general, headers, body, preview, raw

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !isLoading && url) {
            sendRequest();
        }
    };

    const isBodyAllowed = ["POST", "PUT", "PATCH"].includes(method);

    return (
        <div className="flex flex-col gap-6">
            
            {/* Request Builder */}
            <div className="border border-slate-300 bg-white shadow-sm flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-slate-200">
                
                {/* Method Selector */}
                <div className="w-full md:w-32 shrink-0">
                    <select 
                        value={method}
                        onChange={e => setMethod(e.target.value)}
                        disabled={isLoading}
                        className="w-full h-12 md:h-14 bg-slate-50 px-4 text-xs font-bold uppercase tracking-widest text-slate-900 outline-none cursor-pointer hover:bg-slate-100 transition-colors"
                    >
                        {['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'].map(m => (
                            <option key={m} value={m}>{m}</option>
                        ))}
                    </select>
                </div>

                {/* URL Input */}
                <div className="flex-1 flex items-center bg-white px-4 h-12 md:h-14 focus-within:ring-inset focus-within:ring-2 focus-within:ring-slate-900">
                    <Globe size={14} className="text-slate-400 mr-3 shrink-0" />
                    <input 
                        type="text" 
                        value={url}
                        onChange={e => setUrl(e.target.value)}
                        onKeyDown={handleKeyDown}
                        disabled={isLoading}
                        placeholder="https://jsonplaceholder.typicode.com/posts/1"
                        spellCheck="false"
                        className="w-full bg-transparent outline-none font-mono text-xs text-slate-800 placeholder-slate-300"
                    />
                </div>

                {/* Send Button */}
                <button 
                    onClick={sendRequest}
                    disabled={isLoading || !url}
                    className="w-full md:w-32 h-12 md:h-14 shrink-0 flex items-center justify-center gap-2 bg-slate-900 text-white text-xs font-bold uppercase tracking-widest hover:bg-slate-800 transition-colors cursor-pointer disabled:opacity-50"
                >
                    {isLoading ? <Loader2 size={14} className="animate-spin" /> : <Play size={14} className="fill-current" />} 
                    {isLoading ? 'Sending' : 'Send'}
                </button>
            </div>

            {/* Error Message */}
            {error && (
                <div className="border border-red-200 bg-red-50 p-4 text-red-700 text-xs flex items-start gap-3 shadow-sm animate-in fade-in">
                    <AlertCircle size={16} className="shrink-0 mt-0.5 text-red-600" />
                    <div>
                        <strong className="block mb-1 font-bold">Request Failed</strong>
                        {error}
                    </div>
                </div>
            )}

            {/* Config & Response Split */}
            <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
                
                {/* Request Configuration */}
                <aside className="w-full lg:w-1/3 flex flex-col gap-4">
                    <div className="border border-slate-300 bg-white shadow-sm flex flex-col h-[400px]">
                        <div className="flex border-b border-slate-200 bg-slate-50 overflow-x-auto scrollbar-none">
                            <button onClick={() => setActivePanel('headers')} className={`px-4 py-3 text-[10px] font-bold uppercase tracking-widest whitespace-nowrap transition-colors border-b-2 ${activePanel === 'headers' ? 'border-slate-900 text-slate-900 bg-white' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>Headers</button>
                            {isBodyAllowed && (
                                <button onClick={() => setActivePanel('body')} className={`px-4 py-3 text-[10px] font-bold uppercase tracking-widest whitespace-nowrap transition-colors border-b-2 ${activePanel === 'body' ? 'border-slate-900 text-slate-900 bg-white' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>Body</button>
                            )}
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 bg-white">
                            {activePanel === 'headers' && (
                                <div className="space-y-2">
                                    {headers.map((h, i) => (
                                        <div key={i} className="flex gap-2">
                                            <input type="text" value={h.key} onChange={e => updateHeader(i, e.target.value, h.value)} placeholder="Key" className="w-1/2 border border-slate-200 bg-slate-50 px-2 py-1.5 text-xs font-mono text-slate-800 outline-none focus:border-slate-900" />
                                            <input type="text" value={h.value} onChange={e => updateHeader(i, h.key, e.target.value)} placeholder="Value" className="flex-1 border border-slate-200 bg-slate-50 px-2 py-1.5 text-xs font-mono text-slate-800 outline-none focus:border-slate-900" />
                                            <button onClick={() => removeHeader(i)} className="text-slate-300 hover:text-red-500 transition-colors px-1"><AlertCircle size={14} className="rotate-45" /></button>
                                        </div>
                                    ))}
                                    <button onClick={addHeader} className="mt-2 text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-slate-900 transition-colors">+ Add Header</button>
                                </div>
                            )}

                            {activePanel === 'body' && isBodyAllowed && (
                                <textarea
                                    value={body}
                                    onChange={e => setBody(e.target.value)}
                                    placeholder="{\n  &quot;title&quot;: &quot;foo&quot;,\n  &quot;body&quot;: &quot;bar&quot;,\n  &quot;userId&quot;: 1\n}"
                                    className="w-full h-full min-h-[250px] resize-none border border-slate-200 bg-slate-50 p-3 text-xs font-mono text-slate-800 outline-none focus:border-slate-900 scrollbar-thin scrollbar-thumb-slate-300"
                                    spellCheck="false"
                                />
                            )}
                        </div>
                    </div>

                    {/* Educational Flow Animation Tracker */}
                    <div className="border border-slate-300 bg-slate-900 p-4 shadow-sm text-xs font-mono text-slate-400">
                        <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-3 border-b border-slate-800 pb-2">Network Flow Simulation</div>
                        <ul className="space-y-2 relative">
                            {/* Line connecting steps */}
                            <div className="absolute left-2 top-2 bottom-4 w-px bg-slate-800"></div>
                            
                            <li className={`flex items-center gap-3 relative z-10 transition-colors ${animState !== 'idle' ? 'text-emerald-400' : ''}`}>
                                <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${animState !== 'idle' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800'}`}>✓</div>
                                DNS Resolution
                            </li>
                            <li className={`flex items-center gap-3 relative z-10 transition-colors ${['tcp','tls','request','response','done'].includes(animState) ? 'text-emerald-400' : ''}`}>
                                <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${['tcp','tls','request','response','done'].includes(animState) ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800'}`}>✓</div>
                                TCP Handshake
                            </li>
                            <li className={`flex items-center gap-3 relative z-10 transition-colors ${['tls','request','response','done'].includes(animState) ? 'text-emerald-400' : ''}`}>
                                <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${['tls','request','response','done'].includes(animState) ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800'}`}>✓</div>
                                TLS Negotiation (if HTTPS)
                            </li>
                            <li className={`flex items-center gap-3 relative z-10 transition-colors ${['request','response','done'].includes(animState) ? 'text-emerald-400' : ''}`}>
                                <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${['request','response','done'].includes(animState) ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800'}`}>✓</div>
                                Transmit Request
                            </li>
                            <li className={`flex items-center gap-3 relative z-10 transition-colors ${['response','done'].includes(animState) ? 'text-emerald-400' : ''}`}>
                                <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${['response','done'].includes(animState) ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800'}`}>✓</div>
                                Receive Response
                            </li>
                        </ul>
                    </div>

                </aside>

                {/* Response Area */}
                <section className="flex-1 flex flex-col h-[575px]">
                    <div className="border border-slate-300 bg-white shadow-sm flex-1 flex flex-col overflow-hidden">
                        
                        {response ? (
                            <>
                                {/* Response Meta */}
                                <div className="bg-slate-50 border-b border-slate-200 p-3 md:p-4 flex flex-wrap gap-4 items-center text-xs font-mono shrink-0">
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Status</span>
                                        <span className={`px-2 py-0.5 text-white font-bold ${response.status >= 200 && response.status < 300 ? 'bg-emerald-500' : response.status >= 400 ? 'bg-red-500' : 'bg-amber-500'}`}>
                                            {response.status} {response.statusText}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500"><Clock size={12} className="inline mr-1" />Time</span>
                                        <span className="text-slate-800">{response.duration} ms</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500"><Database size={12} className="inline mr-1" />Size</span>
                                        <span className="text-slate-800">{(response.size / 1024).toFixed(2)} KB</span>
                                    </div>
                                </div>

                                {/* Response Tabs */}
                                <div className="flex border-b border-slate-200 bg-white overflow-x-auto scrollbar-none shrink-0">
                                    {['Preview', 'Raw Body', 'Headers'].map(tab => {
                                        const id = tab.toLowerCase().replace(' ', '');
                                        return (
                                            <button 
                                                key={id}
                                                onClick={() => setActivePanel(id)} 
                                                className={`px-4 py-3 text-[10px] font-bold uppercase tracking-widest whitespace-nowrap transition-colors border-b-2 ${activePanel === id ? 'border-slate-900 text-slate-900' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                                            >
                                                {tab}
                                            </button>
                                        );
                                    })}
                                </div>

                                {/* Response Content */}
                                <div className="flex-1 overflow-auto bg-slate-900 p-4 text-slate-300 font-mono text-xs">
                                    {activePanel === 'preview' && (
                                        response.bodyJson ? (
                                            <pre className="text-emerald-400 whitespace-pre-wrap break-all">{JSON.stringify(response.bodyJson, null, 2)}</pre>
                                        ) : (
                                            <div className="whitespace-pre-wrap break-all">{response.bodyText || <span className="text-slate-500 italic">Empty body</span>}</div>
                                        )
                                    )}
                                    {activePanel === 'rawbody' && (
                                        <div className="whitespace-pre-wrap break-all">{response.bodyText || <span className="text-slate-500 italic">Empty body</span>}</div>
                                    )}
                                    {activePanel === 'headers' && (
                                        <table className="w-full text-left text-xs">
                                            <tbody className="divide-y divide-slate-800">
                                                {Object.entries(response.headers).map(([key, value]) => (
                                                    <tr key={key} className="hover:bg-slate-800/50">
                                                        <td className="py-2 pr-4 font-bold text-slate-400 align-top w-1/3 break-all">{key}</td>
                                                        <td className="py-2 break-all text-slate-300">{value}</td>
                                                    </tr>
                                                ))}
                                                {Object.keys(response.headers).length === 0 && (
                                                    <tr><td className="py-4 text-slate-500 italic text-center">No headers available</td></tr>
                                                )}
                                            </tbody>
                                        </table>
                                    )}
                                </div>
                            </>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-8 text-center bg-slate-50">
                                <Search size={32} className="mb-4 text-slate-300" />
                                <p className="text-sm font-medium text-slate-600 mb-1">No Response Data</p>
                                <p className="text-xs">Enter a URL and click send to view the HTTP response.</p>
                            </div>
                        )}
                    </div>
                </section>
            </div>
            
            <LimitationsPanel module="http" />
        </div>
    );
}
