import React, { useState } from 'react';
import { useProgrammingLab } from '../../hooks/useProgrammingLab';
import FileExplorer from './FileExplorer';
import EditorPanel from './EditorPanel';
import ExecutionControls from './ExecutionControls';
import OutputConsole from './OutputConsole';
import VariableInspector from './VariableInspector';
import CallStack from './CallStack';
import MemoryVisualizer from './MemoryVisualizer';
import CompilerPipeline from './CompilerPipeline';
import { TerminalSquare, ChevronDown, ChevronUp } from 'lucide-react';

export default function ProgrammingLab() {
    const lab = useProgrammingLab();
    
    // Mobile accordion states
    const [openPanel, setOpenPanel] = useState('editor'); // editor, console, educational

    return (
        <div className="flex flex-col h-full bg-slate-100 overflow-hidden font-sans">
            
            {/* Header */}
            <div className="bg-slate-900 border-b border-black px-4 py-3 shrink-0 flex items-center justify-between">
                <div className="flex items-center gap-3 text-white">
                    <div className="bg-emerald-500/20 p-2 rounded-lg text-emerald-400">
                        <TerminalSquare size={20} />
                    </div>
                    <div>
                        <h1 className="text-sm font-bold tracking-wider uppercase">Programming Lab</h1>
                        <p className="text-[10px] text-slate-400 font-mono">Learning by Seeing - Interactive Execution Engine</p>
                    </div>
                </div>
            </div>

            {/* Desktop / Tablet / Mobile Layout */}
            <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
                
                {/* Sidebar File Explorer (Hidden on small mobile unless toggled, but for simplicity showing it from md up) */}
                <div className="hidden md:flex shrink-0 z-20 shadow-xl">
                    <FileExplorer files={lab.files} activeFile={lab.activeFile} changeFile={lab.changeFile} />
                </div>

                {/* Main Content Area */}
                <div className="flex-1 flex flex-col overflow-hidden relative">
                    
                    {/* Execution Controls (Sticky Top) */}
                    <ExecutionControls {...lab} />

                    {/* Resizable Panes using CSS flex */}
                    <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
                        
                        {/* Editor + Console Column */}
                        <div className="flex-1 flex flex-col min-w-[320px] overflow-hidden lg:border-r border-slate-300 shadow-xl z-10">
                            
                            {/* Editor Area */}
                            <div className={`flex-[2] flex flex-col min-h-[300px] ${openPanel === 'editor' || window.innerWidth >= 1024 ? 'block' : 'hidden lg:flex'}`}>
                                <EditorPanel code={lab.code} setCode={lab.setCode} language={lab.language} />
                            </div>

                            {/* Console Area */}
                            <div className={`flex-[1] flex flex-col min-h-[200px] ${openPanel === 'console' || window.innerWidth >= 1024 ? 'block' : 'hidden lg:flex'}`}>
                                <OutputConsole logs={lab.logs} clearConsole={lab.clearConsole} />
                            </div>
                        </div>

                        {/* Educational Visualizers Column */}
                        {lab.learningMode && (
                            <div className={`w-full lg:w-[400px] xl:w-[500px] bg-slate-100 flex flex-col overflow-y-auto ${openPanel === 'educational' || window.innerWidth >= 1024 ? 'block' : 'hidden lg:block'}`}>
                                <div className="p-4 space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6">
                                        <div className="h-[250px]"><VariableInspector symbols={lab.compilerData.symbolTable} /></div>
                                        <div className="h-[250px]"><CallStack callStack={lab.callStack} /></div>
                                    </div>
                                    <div className="h-[300px]"><MemoryVisualizer memorySnapshot={lab.memorySnapshot} /></div>
                                    <div className="h-[400px]"><CompilerPipeline data={lab.compilerData} /></div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Bottom Navigation (Visible only on small screens) */}
            <div className="lg:hidden bg-slate-900 border-t border-black flex text-xs font-bold uppercase tracking-widest text-slate-400 shrink-0">
                <button 
                    onClick={() => setOpenPanel('editor')}
                    className={`flex-1 py-4 text-center transition-colors ${openPanel === 'editor' ? 'bg-slate-800 text-white' : 'hover:bg-slate-800'}`}
                >
                    Editor
                </button>
                <button 
                    onClick={() => setOpenPanel('console')}
                    className={`flex-1 py-4 text-center transition-colors border-l border-black ${openPanel === 'console' ? 'bg-slate-800 text-white' : 'hover:bg-slate-800'}`}
                >
                    Console
                </button>
                {lab.learningMode && (
                    <button 
                        onClick={() => setOpenPanel('educational')}
                        className={`flex-1 py-4 text-center transition-colors border-l border-black ${openPanel === 'educational' ? 'bg-slate-800 text-emerald-400' : 'hover:bg-slate-800'}`}
                    >
                        Learn
                    </button>
                )}
            </div>
            
        </div>
    );
}
