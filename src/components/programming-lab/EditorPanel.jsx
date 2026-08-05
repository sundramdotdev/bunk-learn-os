import React from 'react';
import Editor from '@monaco-editor/react';
import { Loader2 } from 'lucide-react';

export default function EditorPanel({ code, setCode, language }) {
    return (
        <div className="flex-1 flex flex-col h-full bg-[#1e1e1e] border-r border-slate-800">
            <div className="h-10 bg-[#2d2d2d] flex items-center px-4 border-b border-black select-none shrink-0 text-slate-400 text-xs font-mono">
                {language.toUpperCase()}
            </div>
            <div className="flex-1 relative">
                <Editor
                    height="100%"
                    language={language}
                    theme="vs-dark"
                    value={code}
                    onChange={(val) => setCode(val || '')}
                    loading={
                        <div className="flex items-center justify-center h-full w-full bg-[#1e1e1e] text-slate-400 gap-2">
                            <Loader2 size={16} className="animate-spin" /> Loading Editor...
                        </div>
                    }
                    options={{
                        minimap: { enabled: false },
                        fontSize: 14,
                        fontFamily: "'Fira Code', 'JetBrains Mono', monospace",
                        lineHeight: 24,
                        padding: { top: 16, bottom: 16 },
                        scrollBeyondLastLine: false,
                        smoothScrolling: true,
                        cursorBlinking: "smooth",
                        cursorSmoothCaretAnimation: "on",
                        formatOnPaste: true,
                        wordWrap: "on"
                    }}
                />
            </div>
        </div>
    );
}
