import React from 'react';
import { Server } from 'lucide-react';

export default function HTTPSimulator() {
    return (
        <div className="border border-slate-300 bg-white p-6 shadow-sm">
             <div className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-100">
                <div className="w-12 h-12 bg-slate-100 flex items-center justify-center text-slate-900">
                    <Server size={20} />
                </div>
                <div>
                    <h2 className="text-2xl font-black tracking-tighter text-slate-900">HTTP Anatomy</h2>
                    <p className="text-slate-500 font-medium text-sm mt-1">Hypertext Transfer Protocol Structure</p>
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 border-b border-slate-100 pb-2">HTTP Request</h3>
                    <div className="bg-slate-900 text-slate-300 p-4 font-mono text-xs rounded-none leading-relaxed">
                        <span className="text-blue-400 font-bold">GET</span> /index.html <span className="text-purple-400">HTTP/1.1</span><br/>
                        <span className="text-emerald-400">Host:</span> www.example.com<br/>
                        <span className="text-emerald-400">User-Agent:</span> Mozilla/5.0...<br/>
                        <span className="text-emerald-400">Accept:</span> text/html,application/xhtml+xml<br/>
                        <span className="text-emerald-400">Accept-Language:</span> en-US,en;q=0.5<br/>
                        <span className="text-emerald-400">Accept-Encoding:</span> gzip, deflate, br<br/>
                        <span className="text-emerald-400">Connection:</span> keep-alive<br/>
                        <br/>
                        <span className="text-slate-500 italic">... (Empty Line) ...</span><br/>
                        <span className="text-amber-400 italic">Optional Body (for POST/PUT)</span>
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 border-b border-slate-100 pb-2">HTTP Response</h3>
                    <div className="bg-slate-900 text-slate-300 p-4 font-mono text-xs rounded-none leading-relaxed">
                        <span className="text-purple-400">HTTP/1.1</span> <span className="text-emerald-400 font-bold">200 OK</span><br/>
                        <span className="text-emerald-400">Date:</span> Wed, 21 Oct 2026 07:28:00 GMT<br/>
                        <span className="text-emerald-400">Server:</span> Apache/2.4.41 (Ubuntu)<br/>
                        <span className="text-emerald-400">Content-Type:</span> text/html; charset=UTF-8<br/>
                        <span className="text-emerald-400">Content-Length:</span> 1245<br/>
                        <span className="text-emerald-400">Connection:</span> keep-alive<br/>
                        <br/>
                        <span className="text-slate-500 italic">... (Empty Line) ...</span><br/>
                        <span className="text-amber-400">&lt;!DOCTYPE html&gt;<br/>
&lt;html&gt;<br/>
&lt;head&gt;...&lt;/head&gt;<br/>
&lt;body&gt;Hello World!&lt;/body&gt;<br/>
&lt;/html&gt;</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
