import React from 'react';
import { Code2, ArrowDown, ArrowUp, Info } from 'lucide-react';

export default function CodeBreakdown() {
    const SEGMENTS = [
        { 
            id: 'stack', 
            name: 'Stack Segment', 
            direction: '↓ grows down', 
            color: 'bg-zinc-100', 
            details: 'Stores local variables, function arguments, and return addresses.',
            code: 'void func() {\n  int x = 10; // STACK\n}'
        },
        { 
            id: 'heap', 
            name: 'Heap Segment', 
            direction: '↑ grows up', 
            color: 'bg-slate-50', 
            details: 'Dynamic memory allocated at runtime using malloc() or new.',
            code: 'int *p = (int*)malloc(4); // HEAP'
        },
        { 
            id: 'bss', 
            name: 'Uninitialized Data (BSS)', 
            direction: '', 
            color: 'bg-zinc-100', 
            details: 'Global/static variables initialized to zero by default.',
            code: 'int x; // BSS (if global)'
        },
        { 
            id: 'data', 
            name: 'Initialized Data', 
            direction: '', 
            color: 'bg-slate-50', 
            details: 'Global and static variables initialized by the programmer.',
            code: 'int x = 100; // DATA (if global)'
        },
        { 
            id: 'text', 
            name: 'Code / Text Segment', 
            direction: 'Fixed Size', 
            color: 'bg-slate-900 text-white', 
            details: 'Executable instructions of the program. Read-only.',
            code: '// Machine instructions here'
        }
    ];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="border-b border-slate-200 pb-4">
                <h1 className="text-2xl font-black font-mono tracking-tighter uppercase text-slate-900">
                    Process Memory Layout
                </h1>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">
                    Digital_Aptitude_Subroutine // ADDRESS_SPACE_MAPPING
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                
                {/* Visual Diagram */}
                <div className="space-y-6">
                    <div className="flex justify-between items-center text-[10px] font-black font-mono text-slate-400 px-2 uppercase tracking-widest">
                        <span>High Address [0xFFFFFF]</span>
                    </div>

                    <div className="border-4 border-slate-900 divide-y-2 divide-slate-200 shadow-xl overflow-hidden">
                        {SEGMENTS.map((seg) => (
                            <div 
                                key={seg.id}
                                className={`${seg.color} p-6 transition-all hover:bg-zinc-200 group relative`}
                            >
                                <div className="flex justify-between items-center">
                                    <div className="space-y-1">
                                        <h3 className="text-sm font-black uppercase tracking-tighter">{seg.name}</h3>
                                        <p className="text-[10px] font-medium opacity-60 max-w-xs">{seg.details}</p>
                                    </div>
                                    <span className="text-[10px] font-mono font-black italic uppercase opacity-40">
                                        {seg.direction}
                                    </span>
                                </div>
                                
                                {seg.id === 'stack' && (
                                    <div className="absolute inset-x-0 bottom-0 h-4 flex justify-center translate-y-full z-10">
                                        <ArrowDown size={32} className="text-slate-900" />
                                    </div>
                                )}
                                {seg.id === 'heap' && (
                                    <div className="absolute inset-x-0 top-0 h-4 flex justify-center -translate-y-full z-10">
                                        <ArrowUp size={32} className="text-slate-900" />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-between items-center text-[10px] font-black font-mono text-slate-400 px-2 uppercase tracking-widest">
                        <span>Low Address [0x000000]</span>
                    </div>
                </div>

                {/* Explanation & Code */}
                <div className="space-y-8">
                    <div className="bg-slate-900 p-8 text-white space-y-6">
                        <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                            <Code2 className="text-emerald-400" />
                            <h2 className="text-xs font-black uppercase tracking-widest">C_Program_Context</h2>
                        </div>

                        <div className="space-y-6 font-mono">
                            {SEGMENTS.map(seg => (
                                <div key={seg.id} className="space-y-2">
                                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                        {seg.name} Visualization
                                    </div>
                                    <pre className="text-xs bg-slate-800 p-4 border-l-4 border-emerald-500">
                                        <code>{seg.code}</code>
                                    </pre>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="border border-slate-200 p-6 bg-white space-y-4">
                        <div className="flex items-center gap-2 text-slate-900 mb-2">
                            <Info size={16} />
                            <span className="text-[10px] font-black uppercase tracking-widest">Compiler_Optimization_Note</span>
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed font-medium">
                            Modern Operating Systems use <span className="text-slate-900 font-bold">ASLR</span> (Address Space Layout Randomization) to prevent buffer overflow attacks by randomizing the memory locations of these segments. The heap and stack grow towards each other to maximize memory utilization efficiently.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
