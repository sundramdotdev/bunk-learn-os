import React, { useState } from 'react';
import { Shield, Play, RotateCcw } from 'lucide-react';

export default function TCPSimulator() {
    const [step, setStep] = useState(0);

    const STEPS = [
        { id: 0, title: 'Idle', c: 'IDLE', s: 'LISTEN', desc: 'Client wants to connect to server on port 80.' },
        { id: 1, title: 'SYN', c: 'SYN_SENT', s: 'LISTEN', pkt: 'SYN (Seq=0)', desc: 'Client sends SYN packet to initiate connection.' },
        { id: 2, title: 'SYN-ACK', c: 'SYN_SENT', s: 'SYN_RCVD', pkt: 'SYN-ACK (Seq=0, Ack=1)', desc: 'Server acknowledges client SYN and sends its own SYN.' },
        { id: 3, title: 'ACK', c: 'ESTABLISHED', s: 'ESTABLISHED', pkt: 'ACK (Seq=1, Ack=1)', desc: 'Client acknowledges server SYN. Connection established.' },
        { id: 4, title: 'Data Transfer', c: 'ESTABLISHED', s: 'ESTABLISHED', pkt: 'PSH, ACK (Seq=1, Len=500)', desc: 'Client sends 500 bytes of data.' },
        { id: 5, title: 'Server ACK', c: 'ESTABLISHED', s: 'ESTABLISHED', pkt: 'ACK (Seq=1, Ack=501)', desc: 'Server acknowledges receiving data.' },
        { id: 6, title: 'FIN', c: 'FIN_WAIT_1', s: 'CLOSE_WAIT', pkt: 'FIN, ACK (Seq=501, Ack=1)', desc: 'Client initiates connection termination.' },
        { id: 7, title: 'Server FIN-ACK', c: 'TIME_WAIT', s: 'CLOSED', pkt: 'FIN, ACK', desc: 'Server acknowledges and closes connection.' },
    ];

    return (
        <div className="border border-slate-300 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                    <Shield size={20} className="text-slate-900" />
                    <div>
                        <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-900">TCP State Machine</h2>
                        <span className="text-xs text-slate-500">Transmission Control Protocol</span>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => setStep(prev => Math.min(prev + 1, STEPS.length - 1))} className="bg-slate-900 text-white px-4 py-2 text-[10px] font-bold uppercase tracking-widest hover:bg-slate-800 cursor-pointer">
                        Next Step
                    </button>
                    <button onClick={() => setStep(0)} className="border border-slate-300 text-slate-900 px-4 py-2 text-[10px] font-bold uppercase tracking-widest hover:bg-slate-50 cursor-pointer">
                        Reset
                    </button>
                </div>
            </div>

            <div className="flex justify-between items-center max-w-3xl mx-auto mb-12">
                <div className="text-center space-y-2 w-32">
                    <div className="w-16 h-16 mx-auto bg-slate-100 border-2 border-slate-300 flex items-center justify-center font-bold text-xs">Client</div>
                    <div className="font-mono text-[10px] font-bold text-emerald-600 bg-emerald-50 py-1">{STEPS[step].c}</div>
                </div>

                <div className="flex-1 px-8 relative h-32 flex flex-col justify-center">
                    {STEPS[step].pkt && (
                        <div className={`absolute left-1/2 -translate-x-1/2 p-2 bg-slate-900 text-white font-mono text-[10px] font-bold rounded shadow-lg transition-all ${step % 2 !== 0 ? 'top-4 -translate-y-2' : 'bottom-4 translate-y-2'}`}>
                            {STEPS[step].pkt}
                            <div className="text-[8px] text-slate-400 font-normal mt-1 text-center">{step % 2 !== 0 ? 'Client ➜ Server' : 'Server ➜ Client'}</div>
                        </div>
                    )}
                    <div className="w-full h-px bg-slate-200 border-t-2 border-dashed border-slate-300 relative">
                        {step > 0 && <div className={`absolute top-[-4px] w-3 h-3 rounded-full bg-slate-900 transition-all duration-500 ${step % 2 !== 0 ? 'left-[90%]' : 'left-[10%]'}`} />}
                    </div>
                </div>

                <div className="text-center space-y-2 w-32">
                    <div className="w-16 h-16 mx-auto bg-slate-100 border-2 border-slate-300 flex items-center justify-center font-bold text-xs">Server</div>
                    <div className="font-mono text-[10px] font-bold text-blue-600 bg-blue-50 py-1">{STEPS[step].s}</div>
                </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-4 font-mono text-xs text-slate-700 text-center">
                <span className="font-bold text-slate-900">Step {step}: {STEPS[step].title}</span> - {STEPS[step].desc}
            </div>
        </div>
    );
}
