import React from 'react';
import { Menu, Clock, Trash2, Cpu } from 'lucide-react';

export default function TopBar({ currentTime, onFormatOS, onToggleSidebar }) {
    return (
        <header className="fixed top-0 left-0 right-0 z-50 h-14 bg-white/80 backdrop-blur-md border-b border-zinc-200 flex items-center justify-between px-4 md:px-6">
            
            {/* Left Side */}
            <div className="flex items-center gap-3">
                {/* Hamburger */}
                <button
                    onClick={onToggleSidebar}
                    className="p-2 -ml-2 text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
                    aria-label="Toggle sidebar"
                >
                    <Menu size={22} />
                </button>

                {/* Logo — visible on mobile when sidebar is hidden */}
                <div className="flex items-center gap-2.5 md:hidden">
                    <div className="w-7 h-7 bg-slate-900 text-white flex items-center justify-center">
                        <Cpu size={14} strokeWidth={2.5} />
                    </div>
                    <span className="text-[11px] font-black font-mono tracking-tighter uppercase text-slate-900">
                        Bunk & Learn Hub
                    </span>
                </div>

                {/* Desktop spacer — sidebar occupies left 256px */}
                <div className="hidden md:block w-56" />
            </div>

            {/* Right Side — Clock & Format */}
            <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest px-3 py-1.5 border border-slate-200 bg-white/60">
                    <Clock size={13} className="text-slate-900" />
                    <span className="hidden sm:inline">
                        {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </span>
                    <span className="sm:hidden">
                        {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                </div>
                <button
                    onClick={onFormatOS}
                    className="flex items-center gap-1.5 bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.15em] transition-all active:translate-y-px cursor-pointer"
                >
                    <Trash2 size={11} />
                    <span className="hidden sm:inline">Format OS</span>
                    <span className="sm:hidden">Reset</span>
                </button>
            </div>
        </header>
    );
}
