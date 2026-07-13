import React, { useState } from 'react';
import { Zap, AlertTriangle } from 'lucide-react';

export default function UDPSimulator() {
    const [packets, setPackets] = useState([]);
    
    const sendStream = async () => {
        setPackets([]);
        for(let i = 1; i <= 20; i++) {
            const drop = Math.random() < 0.15; // 15% packet loss
            setPackets(prev => [...prev, { id: i, dropped: drop }]);
            await new Promise(r => setTimeout(r, 100));
        }
    };

    return (
        <div className="border border-slate-300 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                    <Zap size={20} className="text-amber-500" />
                    <div>
                        <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-900">UDP Stream Simulator</h2>
                        <span className="text-xs text-slate-500">User Datagram Protocol - Connectionless</span>
                    </div>
                </div>
                <button onClick={sendStream} className="bg-slate-900 text-white px-4 py-2 text-[10px] font-bold uppercase tracking-widest hover:bg-slate-800 cursor-pointer">
                    Start Stream (Voice/Video)
                </button>
            </div>

            <div className="flex items-center gap-8 mb-8">
                <div className="w-16 h-16 bg-slate-100 border-2 border-slate-300 flex items-center justify-center font-bold text-xs shrink-0">Sender</div>
                
                <div className="flex-1 flex flex-wrap gap-2 content-start min-h-[80px]">
                    {packets.map((p, idx) => (
                        <div key={idx} className={`w-8 h-8 flex items-center justify-center font-mono text-[10px] font-bold border animate-in fade-in slide-in-from-left-4 ${p.dropped ? 'border-red-500 bg-red-50 text-red-500 opacity-50 scale-75' : 'border-emerald-500 bg-emerald-50 text-emerald-600'}`}>
                            {p.id}
                        </div>
                    ))}
                    {packets.length === 0 && <span className="text-slate-400 font-mono text-xs m-auto">Awaiting stream...</span>}
                </div>

                <div className="w-16 h-16 bg-slate-100 border-2 border-slate-300 flex items-center justify-center font-bold text-xs shrink-0">Receiver</div>
            </div>

            <div className="bg-amber-50 border border-amber-200 p-4 text-xs text-amber-800 flex gap-3 items-start">
                <AlertTriangle size={16} className="mt-0.5 shrink-0" />
                <p>UDP does not establish a connection before sending data. It offers no guarantee of delivery, ordering, or duplicate protection. In the simulation above, notice how some packets are lost (red) without triggering retransmissions, ideal for latency-sensitive applications like VOIP and live video.</p>
            </div>
        </div>
    );
}
