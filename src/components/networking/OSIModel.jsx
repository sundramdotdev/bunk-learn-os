import React, { useState } from 'react';
import { Layers } from 'lucide-react';

const OSI_LAYERS = [
    { num: 7, name: 'Application', purpose: 'Network process to application', protocols: 'HTTP, FTP, SMTP, DNS', devices: 'PC, Server', desc: 'End-user layer. Provides interfaces for applications to access network services.' },
    { num: 6, name: 'Presentation', purpose: 'Data representation and encryption', protocols: 'SSL, TLS, JPEG, ASCII', devices: 'PC, Server', desc: 'Translates data format from sender to receiver. Handles encryption and compression.' },
    { num: 5, name: 'Session', purpose: 'Interhost communication', protocols: 'NetBIOS, PPTP', devices: 'PC, Server', desc: 'Establishes, manages and terminates connections between applications.' },
    { num: 4, name: 'Transport', purpose: 'End-to-end connections and reliability', protocols: 'TCP, UDP', devices: 'PC, Server, Firewall', desc: 'Provides reliable or unreliable delivery. Error recovery (TCP) and flow control.' },
    { num: 3, name: 'Network', purpose: 'Path determination and logical addressing', protocols: 'IP, ICMP, IPSec, IGMP', devices: 'Router', desc: 'Routes packets across different networks using IP addresses.' },
    { num: 2, name: 'Data Link', purpose: 'Physical addressing (MAC)', protocols: 'Ethernet, PPP, Switch', devices: 'Switch, Bridge', desc: 'Frames packets for physical transmission. Error detection.' },
    { num: 1, name: 'Physical', purpose: 'Media, signal and binary transmission', protocols: 'USB, Bluetooth, IEEE 802.11', devices: 'Hub, NIC, Cable', desc: 'Transmits raw bit stream over physical medium.' }
];

export default function OSIModel() {
    const [activeLayer, setActiveLayer] = useState(OSI_LAYERS[0]);

    return (
        <div className="flex flex-col md:flex-row gap-6 md:gap-8">
            <aside className="w-full md:w-1/3 space-y-2">
                <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4 px-2">Interactive Stack</h2>
                {OSI_LAYERS.map(layer => (
                    <button
                        key={layer.num}
                        onClick={() => setActiveLayer(layer)}
                        className={`w-full flex items-center justify-between p-4 border transition-all cursor-pointer ${activeLayer.num === layer.num ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'}`}
                    >
                        <span className="font-mono font-bold text-xs">Layer {layer.num}</span>
                        <span className="font-bold uppercase tracking-widest text-[10px]">{layer.name}</span>
                    </button>
                ))}
            </aside>

            <section className="flex-1">
                <div className="border border-slate-300 bg-white p-6 shadow-sm sticky top-6">
                    <div className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-100">
                        <div className="w-12 h-12 bg-slate-100 flex items-center justify-center text-slate-900">
                            <Layers size={20} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black tracking-tighter text-slate-900">Layer {activeLayer.num}: {activeLayer.name}</h2>
                            <p className="text-slate-500 font-medium text-sm mt-1">{activeLayer.purpose}</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-slate-50 p-4 border border-slate-200 space-y-2">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Protocols</span>
                                <div className="font-mono text-xs font-bold text-slate-900">{activeLayer.protocols}</div>
                            </div>
                            <div className="bg-slate-50 p-4 border border-slate-200 space-y-2">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Devices</span>
                                <div className="font-mono text-xs font-bold text-slate-900">{activeLayer.devices}</div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-900 mb-2">Description</h3>
                            <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 border border-slate-100">
                                {activeLayer.desc}
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
