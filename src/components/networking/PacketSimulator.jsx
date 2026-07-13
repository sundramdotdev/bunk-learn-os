import React, { useState, useEffect } from 'react';
import { Send, Laptop, Router, ShieldAlert, Server, Database, Globe, Play } from 'lucide-react';

const HOPS = [
    { id: 'laptop', label: 'Laptop', icon: <Laptop size={16} /> },
    { id: 'router', label: 'Router', icon: <Router size={16} /> },
    { id: 'firewall', label: 'Firewall', icon: <ShieldAlert size={16} /> },
    { id: 'isp', label: 'ISP', icon: <Globe size={16} /> },
    { id: 'server', label: 'Web Server', icon: <Server size={16} /> },
    { id: 'db', label: 'Database', icon: <Database size={16} /> }
];

export default function PacketSimulator() {
    const [payload, setPayload] = useState('Hello World');
    const [isSimulating, setIsSimulating] = useState(false);
    const [activeHop, setActiveHop] = useState(-1);
    const [isReturning, setIsReturning] = useState(false);
    const [logs, setLogs] = useState([]);
    
    // Packet Meta
    const [latency, setLatency] = useState(0);
    const [ttl, setTtl] = useState(64);
    const [dropped, setDropped] = useState(false);

    const startSimulation = async () => {
        setIsSimulating(true);
        setActiveHop(-1);
        setIsReturning(false);
        setLogs([]);
        setLatency(0);
        setTtl(64);
        setDropped(false);

        let currentLatency = 0;
        let currentTtl = 64;

        // Forward path
        for (let i = 0; i < HOPS.length; i++) {
            setActiveHop(i);
            const hopDelay = Math.floor(Math.random() * 30) + 10;
            currentLatency += hopDelay;
            currentTtl -= 1;
            
            setLatency(currentLatency);
            setTtl(currentTtl);
            setLogs(prev => [...prev, `[FWD] Packet arrived at ${HOPS[i].label} (Delay: ${hopDelay}ms)`]);
            
            // Random drop simulation at Firewall
            if (HOPS[i].id === 'firewall' && Math.random() > 0.8) {
                setDropped(true);
                setLogs(prev => [...prev, `[ERR] Packet DROPPED at Firewall (Rule 403). Retransmitting...`]);
                await new Promise(r => setTimeout(r, 1000));
                setLogs(prev => [...prev, `[SYS] Retransmission successful.`]);
                setDropped(false);
            }

            await new Promise(r => setTimeout(r, hopDelay * 10));
        }

        // Return path
        setIsReturning(true);
        setLogs(prev => [...prev, `[SYS] Database generated response. Returning...`]);
        for (let i = HOPS.length - 1; i >= 0; i--) {
            setActiveHop(i);
            const hopDelay = Math.floor(Math.random() * 30) + 10;
            currentLatency += hopDelay;
            currentTtl -= 1;
            
            setLatency(currentLatency);
            setTtl(currentTtl);
            setLogs(prev => [...prev, `[RET] Packet returned to ${HOPS[i].label} (Delay: ${hopDelay}ms)`]);
            
            await new Promise(r => setTimeout(r, hopDelay * 10));
        }

        setIsSimulating(false);
        setLogs(prev => [...prev, `[SYS] Simulation complete. Total Latency: ${currentLatency}ms`]);
    };

    return (
        <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
            <aside className="w-full lg:w-1/3 border border-slate-300 bg-white p-4 md:p-6 shadow-sm space-y-6">
                <div>
                    <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-900 mb-2">Packet Payload</h2>
                    <textarea 
                        value={payload}
                        onChange={e => setPayload(e.target.value)}
                        disabled={isSimulating}
                        className="w-full h-24 border border-slate-200 bg-slate-50 p-3 font-mono text-xs outline-none focus:border-slate-900 resize-none"
                    />
                </div>

                <div className="space-y-4 pt-4 border-t border-slate-100">
                    <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Packet Metadata</h2>
                    <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                        <div className="bg-slate-50 p-2 border border-slate-200">
                            <span className="text-slate-400 block text-[9px] uppercase">Size</span>
                            {payload.length * 8} bytes
                        </div>
                        <div className="bg-slate-50 p-2 border border-slate-200">
                            <span className="text-slate-400 block text-[9px] uppercase">TTL</span>
                            {ttl}
                        </div>
                        <div className="bg-slate-50 p-2 border border-slate-200">
                            <span className="text-slate-400 block text-[9px] uppercase">Latency</span>
                            {latency} ms
                        </div>
                        <div className="bg-slate-50 p-2 border border-slate-200">
                            <span className="text-slate-400 block text-[9px] uppercase">Status</span>
                            {dropped ? <span className="text-red-500 font-bold">DROPPED</span> : 'OK'}
                        </div>
                    </div>
                </div>

                <button 
                    onClick={startSimulation}
                    disabled={isSimulating || !payload}
                    className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white px-4 py-3 text-xs font-bold uppercase tracking-widest hover:bg-slate-800 transition-all cursor-pointer disabled:opacity-50"
                >
                    <Send size={14} /> Send Packet
                </button>
            </aside>

            <section className="flex-1 space-y-6">
                {/* Hop Visualization */}
                <div className="border border-slate-300 bg-white p-6 shadow-sm overflow-x-auto">
                    <div className="flex items-center min-w-[600px] justify-between relative">
                        {/* Connecting Line */}
                        <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-slate-200 -z-10" />
                        
                        {HOPS.map((hop, i) => (
                            <div key={hop.id} className="flex flex-col items-center gap-2 relative bg-white px-2">
                                <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-colors duration-300 ${activeHop === i ? (isReturning ? 'border-blue-500 bg-blue-50 text-blue-600' : 'border-emerald-500 bg-emerald-50 text-emerald-600') : 'border-slate-300 bg-white text-slate-400'}`}>
                                    {hop.icon}
                                </div>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-600">
                                    {hop.label}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Packet Logs */}
                <div className="border border-slate-300 bg-slate-900 text-slate-300 p-4 shadow-sm h-64 overflow-y-auto font-mono text-xs space-y-1">
                    {logs.length === 0 && <span className="text-slate-500">Awaiting transmission...</span>}
                    {logs.map((log, i) => (
                        <div key={i} className={`${log.includes('[ERR]') ? 'text-red-400' : log.includes('[RET]') ? 'text-blue-400' : log.includes('[SYS]') ? 'text-amber-400' : 'text-emerald-400'}`}>
                            {log}
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
