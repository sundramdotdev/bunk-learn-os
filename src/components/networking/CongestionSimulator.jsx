import React, { useState, useEffect } from 'react';
import { Activity } from 'lucide-react';

export default function CongestionSimulator() {
    const [traffic, setTraffic] = useState(50); // packets per sec
    const [bandwidth, setBandwidth] = useState(80); // capacity
    const [queue, setQueue] = useState([]);
    const [dropped, setDropped] = useState(0);
    const [isSimulating, setIsSimulating] = useState(false);

    useEffect(() => {
        let interval;
        if (isSimulating) {
            interval = setInterval(() => {
                // Incoming traffic (add to queue)
                const incoming = Math.floor(Math.random() * (traffic / 10)); 
                let newQueue = [...queue];
                let newlyDropped = 0;

                for(let i = 0; i < incoming; i++) {
                    if (newQueue.length < 20) { // Max queue size 20
                        newQueue.push('packet');
                    } else {
                        newlyDropped++;
                    }
                }

                // Process traffic based on bandwidth
                const processing = Math.floor(bandwidth / 20);
                newQueue = newQueue.slice(processing);

                setQueue(newQueue);
                if (newlyDropped > 0) setDropped(prev => prev + newlyDropped);

            }, 200);
        } else {
            setQueue([]);
            setDropped(0);
        }
        return () => clearInterval(interval);
    }, [isSimulating, traffic, bandwidth, queue]);

    return (
        <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
            <aside className="w-full lg:w-1/3 border border-slate-300 bg-white p-4 md:p-6 shadow-sm space-y-6">
                <div className="flex items-center gap-2 mb-2">
                    <Activity size={16} className="text-slate-900" />
                    <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-900">Congestion Simulator</h2>
                </div>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                            <span className="text-slate-600">Incoming Traffic</span>
                            <span className="text-slate-900">{traffic} pkt/s</span>
                        </div>
                        <input type="range" min="10" max="200" value={traffic} onChange={e => setTraffic(Number(e.target.value))} className="w-full" disabled={!isSimulating} />
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                            <span className="text-slate-600">Link Bandwidth</span>
                            <span className="text-slate-900">{bandwidth} pkt/s</span>
                        </div>
                        <input type="range" min="10" max="200" value={bandwidth} onChange={e => setBandwidth(Number(e.target.value))} className="w-full" disabled={!isSimulating} />
                    </div>
                </div>

                <button 
                    onClick={() => setIsSimulating(!isSimulating)}
                    className={`w-full flex items-center justify-center gap-2 px-4 py-3 text-xs font-bold uppercase tracking-widest transition-all cursor-pointer ${isSimulating ? 'border border-slate-300 bg-white text-slate-900 hover:bg-slate-50' : 'bg-slate-900 text-white hover:bg-slate-800'}`}
                >
                    {isSimulating ? 'Stop Simulation' : 'Start Simulation'}
                </button>
            </aside>

            <section className="flex-1 space-y-6">
                <div className="border border-slate-300 bg-white p-6 shadow-sm min-h-[250px] flex flex-col justify-center">
                    
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4 text-center">Router Queue (Max 20)</h3>
                    
                    <div className="flex justify-center">
                        <div className="flex border-4 border-r-0 border-slate-300 h-16 w-80 relative overflow-hidden bg-slate-50 items-center justify-end px-1 gap-1">
                            {queue.map((_, i) => (
                                <div key={i} className={`w-3 h-10 ${queue.length > 15 ? 'bg-red-500' : 'bg-emerald-500'}`} />
                            ))}
                            {queue.length === 0 && <span className="text-xs font-mono text-slate-400 absolute left-1/2 -translate-x-1/2">Empty</span>}
                        </div>
                        <div className="w-4 h-16 border-y-4 border-slate-300 bg-slate-200" /> {/* Link Out */}
                    </div>

                    <div className="mt-8 grid grid-cols-2 gap-4 max-w-sm mx-auto w-full">
                        <div className="bg-slate-50 border border-slate-200 p-4 text-center">
                            <span className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Queue Occupancy</span>
                            <span className={`font-mono text-xl font-bold ${queue.length > 15 ? 'text-red-500' : 'text-slate-900'}`}>{queue.length} / 20</span>
                        </div>
                        <div className="bg-slate-50 border border-slate-200 p-4 text-center">
                            <span className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Packets Dropped</span>
                            <span className={`font-mono text-xl font-bold ${dropped > 0 ? 'text-red-500' : 'text-slate-900'}`}>{dropped}</span>
                        </div>
                    </div>

                </div>
            </section>
        </div>
    );
}
