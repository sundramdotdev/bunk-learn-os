import React, { useState } from 'react';
import { Network, Server, Globe, Box, Activity, Zap, Shield, ArrowRight } from 'lucide-react';

import PacketSimulator from './PacketSimulator';
import OSIModel from './OSIModel';
import TCPSimulator from './TCPSimulator';
import UDPSimulator from './UDPSimulator';
import DNSSimulator from './DNSSimulator';
import HTTPSimulator from './HTTPSimulator';
import IPRouting from './IPRouting';
import CongestionSimulator from './CongestionSimulator';

export default function NetworkingSimulator() {
    const [activeTab, setActiveTab] = useState('packet');

    const TABS = [
        { id: 'packet', label: 'Packet Sim', icon: <Box size={14} /> },
        { id: 'osi', label: 'OSI Model', icon: <Layers size={14} /> },
        { id: 'tcp', label: 'TCP Handshake', icon: <Shield size={14} /> },
        { id: 'udp', label: 'UDP Data', icon: <Zap size={14} /> },
        { id: 'dns', label: 'DNS Resolution', icon: <Globe size={14} /> },
        { id: 'http', label: 'HTTP Flow', icon: <Server size={14} /> },
        { id: 'routing', label: 'IP Routing', icon: <Network size={14} /> },
        { id: 'congestion', label: 'Congestion', icon: <Activity size={14} /> },
    ];

    return (
        <div className="flex flex-col space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Top Navigation */}
            <div className="w-full bg-white border border-slate-200 shadow-sm flex overflow-x-auto scrollbar-none">
                {TABS.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-6 py-4 text-[10px] font-bold uppercase tracking-widest whitespace-nowrap transition-colors border-b-2 cursor-pointer ${activeTab === tab.id ? 'border-slate-900 text-slate-900 bg-slate-50' : 'border-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-700'}`}
                    >
                        {tab.icon}
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Render Active Module */}
            <div className="flex-1 w-full">
                {activeTab === 'packet' && <PacketSimulator />}
                {activeTab === 'osi' && <OSIModel />}
                {activeTab === 'tcp' && <TCPSimulator />}
                {activeTab === 'udp' && <UDPSimulator />}
                {activeTab === 'dns' && <DNSSimulator />}
                {activeTab === 'http' && <HTTPSimulator />}
                {activeTab === 'routing' && <IPRouting />}
                {activeTab === 'congestion' && <CongestionSimulator />}
            </div>
        </div>
    );
}

// Temporary polyfill for Layers icon since we forgot to import it in this block
function Layers(props) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={props.size} height={props.size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
            <polyline points="2 12 12 17 22 12"></polyline>
            <polyline points="2 17 12 22 22 17"></polyline>
        </svg>
    );
}
