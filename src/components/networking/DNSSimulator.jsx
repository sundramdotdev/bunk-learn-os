import React, { useState } from 'react';
import { Globe, Search } from 'lucide-react';

export default function DNSSimulator() {
    const [domain, setDomain] = useState('google.com');
    const [logs, setLogs] = useState([]);
    const [isSimulating, setIsSimulating] = useState(false);

    const startResolution = async () => {
        setIsSimulating(true);
        setLogs([]);

        const steps = [
            `Browser checks local cache for ${domain}... (Miss)`,
            `Browser asks OS Resolver for ${domain}...`,
            `OS Resolver asks Root Server (.) for ${domain}...`,
            `Root Server responds: Check .com TLD server (192.5.6.30)`,
            `OS Resolver asks .com TLD server for ${domain}...`,
            `TLD Server responds: Check Authoritative NS for ${domain} (ns1.google.com)`,
            `OS Resolver asks Authoritative NS for ${domain}...`,
            `Authoritative NS responds: ${domain} = 142.250.190.46`,
            `OS Resolver caches result and returns to Browser.`,
            `Browser connects to 142.250.190.46.`
        ];

        for (let i = 0; i < steps.length; i++) {
            await new Promise(r => setTimeout(r, 600));
            setLogs(prev => [...prev, steps[i]]);
        }
        setIsSimulating(false);
    };

    return (
        <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
            <aside className="w-full lg:w-1/3 border border-slate-300 bg-white p-4 md:p-6 shadow-sm space-y-4">
                <div className="flex items-center gap-2 mb-2">
                    <Globe size={16} className="text-slate-900" />
                    <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-900">DNS Resolution</h2>
                </div>
                
                <div className="flex border border-slate-200 bg-slate-50 focus-within:border-slate-900 transition-colors p-2">
                    <span className="text-slate-400 font-mono text-xs mr-2">https://</span>
                    <input 
                        type="text" 
                        value={domain}
                        onChange={e => setDomain(e.target.value)}
                        disabled={isSimulating}
                        className="flex-1 bg-transparent outline-none font-mono text-xs text-slate-800"
                    />
                </div>

                <button 
                    onClick={startResolution}
                    disabled={isSimulating || !domain}
                    className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white px-4 py-3 text-xs font-bold uppercase tracking-widest hover:bg-slate-800 transition-all cursor-pointer disabled:opacity-50"
                >
                    <Search size={14} /> Resolve Domain
                </button>
            </aside>

            <section className="flex-1">
                <div className="border border-slate-300 bg-slate-900 p-6 shadow-sm min-h-[300px] font-mono text-xs space-y-2">
                    {logs.length === 0 && <span className="text-slate-500">Waiting for query...</span>}
                    {logs.map((log, i) => (
                        <div key={i} className="text-emerald-400 animate-in fade-in slide-in-from-bottom-2">
                            <span className="text-slate-500 mr-2">{'>'}</span> {log}
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
