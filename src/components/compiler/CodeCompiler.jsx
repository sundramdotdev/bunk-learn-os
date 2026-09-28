import React, { useState, useRef, useEffect } from 'react';
import { Play, Trash2, Copy, ChevronDown, Terminal, Eye, Clock, CheckCircle2, AlertTriangle, Code2, FileCode, Globe } from 'lucide-react';
import { useCompiler } from '../../hooks/useCompiler';
import { useSEO } from '../../hooks/useSEO';

const LANGUAGES = [
    { id: 'c', label: 'C', icon: <FileCode size={14} />, description: 'GCC-style C Compiler' },
    { id: 'cpp', label: 'C++', icon: <Code2 size={14} />, description: 'GCC-style C++ Compiler' },
    { id: 'html', label: 'HTML', icon: <Globe size={14} />, description: 'Live HTML Preview' }
];

const FUNNY_PASTE_MESSAGES = [
    `// 🚨 BZZZT! Nice try, Ctrl+V ninja! 🥷 Type your code!\n`,
    `// 🛑 Copy-paste in a compiler? Your professor is watching! 👀\n`,
    `// 🙅‍♂️ 404: Paste Permission Not Found! Type it out! 🚀\n`,
    `// 🤡 Ctrl+V detected! Real programmers type code! 😉\n`,
    `// 💀 Caught in 4K! No shortcuts here, start typing! 📸\n`,
];

const FUNNY_BADGES = [
    `🚨 Caught in 4K! No copy-paste! 📸`,
    `👀 Nice try! Type it yourself! ⌨️`,
    `🛑 Paste blocked! Type manually! 💻`,
    `🙅‍♂️ 404: Paste Not Found! 🚀`,
    `🤡 Ctrl+V denied! Real devs type! 😉`
];

export default function CodeCompiler() {
    useSEO({
        title: 'Code Compiler — C, C++, HTML',
        description: 'Free online C, C++, and HTML compiler. Write, compile, and run code in your browser. No installation needed. Perfect for B.Tech lab practicals.',
        keywords: 'online compiler, C compiler, C++ compiler, HTML compiler, GCC, code editor, run C online, run C++ online, SRMU',
        path: 'compiler'
    });

    const {
        language, setLanguage,
        code, setCode,
        output, error,
        isRunning, executionTime, exitCode,
        runCode, clearOutput
    } = useCompiler();

    const [langDropdownOpen, setLangDropdownOpen] = useState(false);
    const [showPasteWarning, setShowPasteWarning] = useState(false);
    const [pasteWarningText, setPasteWarningText] = useState('');
    const [copied, setCopied] = useState(false);
    
    // Interactive Terminal Input State
    const [isWaitingForInput, setIsWaitingForInput] = useState(false);
    const [terminalInputValue, setTerminalInputValue] = useState('');
    const [simulatedPrompt, setSimulatedPrompt] = useState('');
    const textareaRef = useRef(null);
    const lineNumberRef = useRef(null);
    const pasteWarningTimer = useRef(null);
    const outputRef = useRef(null);

    const currentLang = LANGUAGES.find(l => l.id === language);
    const lineCount = code.split('\n').length;
    const isHtml = language === 'html';

    // Sync scroll between line numbers and textarea
    const handleEditorScroll = () => {
        if (lineNumberRef.current && textareaRef.current) {
            lineNumberRef.current.scrollTop = textareaRef.current.scrollTop;
        }
    };

    // Auto-scroll output to bottom
    useEffect(() => {
        if (outputRef.current) {
            outputRef.current.scrollTop = outputRef.current.scrollHeight;
        }
    }, [output, error]);

    // Handle paste blocking
    const handlePaste = (e) => {
        e.preventDefault();
        const funnyMsg = FUNNY_PASTE_MESSAGES[Math.floor(Math.random() * FUNNY_PASTE_MESSAGES.length)];
        const randomBadge = FUNNY_BADGES[Math.floor(Math.random() * FUNNY_BADGES.length)];
        const target = e.target;
        const start = target.selectionStart ?? code.length;
        const end = target.selectionEnd ?? code.length;

        const needsNewline = start > 0 && code[start - 1] !== '\n';
        const formattedMsg = (needsNewline ? '\n' : '') + funnyMsg;

        const updated = code.substring(0, start) + formattedMsg + code.substring(end);
        setCode(updated);

        setTimeout(() => {
            if (textareaRef.current) {
                const nextPos = start + formattedMsg.length;
                textareaRef.current.selectionStart = nextPos;
                textareaRef.current.selectionEnd = nextPos;
                textareaRef.current.focus();
            }
        }, 0);

        setPasteWarningText(randomBadge);
        setShowPasteWarning(true);
        if (pasteWarningTimer.current) clearTimeout(pasteWarningTimer.current);
        pasteWarningTimer.current = setTimeout(() => setShowPasteWarning(false), 4000);
    };

    // Copy code to clipboard
    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(code);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch { /* ignore */ }
    };

    // Keyboard shortcut: Ctrl+Enter to run
    const handleKeyDown = (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            handleRunClick();
        }
        // Tab support
        if (e.key === 'Tab') {
            e.preventDefault();
            const start = e.target.selectionStart;
            const end = e.target.selectionEnd;
            const updated = code.substring(0, start) + '    ' + code.substring(end);
            setCode(updated);
            setTimeout(() => {
                e.target.selectionStart = e.target.selectionEnd = start + 4;
            }, 0);
        }
    };

    // Handle Run Click - Check for scanf/cin to prompt dynamically
    const handleRunClick = () => {
        if (isHtml) {
            runCode('');
            return;
        }

        const needsInput = code.includes('scanf') || code.includes('cin');
        if (needsInput) {
            // "Engineering Hack" to simulate interactive terminal
            const inputMatch = code.match(/(cin\s*>>|scanf\s*\()/);
            let extracted = "Input required: ";
            if (inputMatch) {
                const before = code.substring(0, inputMatch.index);
                const prints = [...before.matchAll(/(?:cout\s*<<|printf\s*\()\s*"([^"]*)"/g)];
                if (prints.length > 0) {
                    extracted = prints[prints.length - 1][1].replace(/\\n/g, '\n').replace(/\\t/g, '\t');
                }
            }

            setSimulatedPrompt(extracted);
            setTerminalInputValue('');
            setIsWaitingForInput(true);
            clearOutput(); 
        } else {
            setIsWaitingForInput(false);
            runCode('');
        }
    };

    const handleTerminalInputSubmit = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            setIsWaitingForInput(false);
            runCode(terminalInputValue);
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-6rem)] bg-slate-50 rounded-xl overflow-hidden border border-slate-200 shadow-lg">

            {/* ═══════════ TOOLBAR ═══════════ */}
            <div className="flex items-center justify-between gap-3 px-4 py-2.5 bg-white border-b border-slate-200 shrink-0">
                <div className="flex items-center gap-3">
                    {/* Language Selector */}
                    <div className="relative">
                        <button
                            onClick={() => setLangDropdownOpen(prev => !prev)}
                            className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm font-semibold text-slate-700 transition-colors border border-slate-200"
                        >
                            {currentLang?.icon}
                            <span>{currentLang?.label}</span>
                            <ChevronDown size={14} className={`transition-transform ${langDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {langDropdownOpen && (
                            <>
                                <div className="fixed inset-0 z-10" onClick={() => setLangDropdownOpen(false)} />
                                <div className="absolute top-full left-0 mt-1 w-56 bg-white border border-slate-200 rounded-xl shadow-xl z-20 overflow-hidden">
                                    {LANGUAGES.map(lang => (
                                        <button
                                            key={lang.id}
                                            onClick={() => { setLanguage(lang.id); setLangDropdownOpen(false); }}
                                            className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-slate-50 transition-colors ${language === lang.id ? 'bg-blue-50 text-blue-700' : 'text-slate-700'}`}
                                        >
                                            <span className={`flex items-center justify-center w-7 h-7 rounded-lg ${language === lang.id ? 'bg-blue-100' : 'bg-slate-100'}`}>
                                                {lang.icon}
                                            </span>
                                            <div>
                                                <div className="text-sm font-semibold">{lang.label}</div>
                                                <div className="text-xs text-slate-400">{lang.description}</div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>

                    {/* Paste Warning Badge */}
                    {showPasteWarning && (
                        <div className="px-3 py-1 bg-red-50 border border-red-200 rounded-lg text-xs font-semibold text-red-600 animate-in fade-in slide-in-from-left-2 duration-300">
                            {pasteWarningText}
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    {/* Copy */}
                    <button
                        onClick={handleCopy}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-semibold text-slate-600 transition-colors border border-slate-200"
                    >
                        <Copy size={12} />
                        {copied ? 'Copied!' : 'Copy'}
                    </button>

                    {/* Clear */}
                    <button
                        onClick={() => { clearOutput(); }}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-semibold text-slate-600 transition-colors border border-slate-200"
                    >
                        <Trash2 size={12} />
                        Clear
                    </button>

                    {/* Run Button */}
                    <button
                        onClick={handleRunClick}
                        disabled={isRunning}
                        className="flex items-center gap-2 px-5 py-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white rounded-lg text-sm font-bold transition-colors shadow-sm"
                    >
                        {isRunning ? (
                            <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <Play size={14} fill="white" />
                        )}
                        {isRunning ? 'Running...' : 'Run'}
                    </button>
                </div>
            </div>

            {/* ═══════════ MAIN AREA (Editor + Output) ═══════════ */}
            <div className="flex flex-1 overflow-hidden">

                {/* ─── LEFT: CODE EDITOR ─── */}
                <div className="flex-1 flex flex-col min-w-0 border-r border-slate-200">
                    <div className="flex-1 flex overflow-hidden bg-[#1e1e2e]">
                        {/* Line Numbers */}
                        <div
                            ref={lineNumberRef}
                            className="w-12 bg-[#181825] text-slate-500 text-xs font-mono pt-3 pr-2 text-right select-none overflow-hidden shrink-0 border-r border-[#313244]"
                        >
                            {Array.from({ length: lineCount }, (_, i) => (
                                <div key={i + 1} className="leading-[1.625rem] h-[1.625rem]">{i + 1}</div>
                            ))}
                        </div>

                        {/* Textarea */}
                        <textarea
                            ref={textareaRef}
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            onScroll={handleEditorScroll}
                            onPaste={handlePaste}
                            onKeyDown={handleKeyDown}
                            spellCheck={false}
                            className="flex-1 bg-transparent text-[#cdd6f4] text-sm font-mono p-3 resize-none outline-none leading-[1.625rem] overflow-auto whitespace-pre"
                            placeholder={`Write your ${currentLang?.label} code here...`}
                        />
                    </div>
                </div>

                {/* ─── RIGHT: OUTPUT / PREVIEW ─── */}
                <div className="flex-1 flex flex-col min-w-0">
                    {/* Output Header */}
                    <div className="flex items-center justify-between px-4 py-2 bg-[#181825] border-b border-[#313244] shrink-0">
                        <div className="flex items-center gap-2">
                            {isHtml ? (
                                <>
                                    <Eye size={14} className="text-blue-400" />
                                    <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">Live Preview</span>
                                </>
                            ) : (
                                <>
                                    <Terminal size={14} className="text-emerald-400" />
                                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Output</span>
                                </>
                            )}
                        </div>

                        {executionTime !== null && (
                            <div className="flex items-center gap-3">
                                {error ? (
                                    <span className="flex items-center gap-1 text-xs font-semibold text-red-400">
                                        <AlertTriangle size={12} />
                                        Compilation Failed
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-1 text-xs font-semibold text-emerald-400">
                                        <CheckCircle2 size={12} />
                                        {isHtml ? 'Rendered' : 'Compiled'} successfully
                                    </span>
                                )}
                                <span className="flex items-center gap-1 text-xs text-slate-500">
                                    <Clock size={10} />
                                    {executionTime}ms
                                </span>
                                {exitCode !== null && !isHtml && (
                                    <span className={`text-xs font-mono ${exitCode === 0 ? 'text-slate-500' : 'text-red-400'}`}>
                                        exit({exitCode})
                                    </span>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Output Content */}
                    {isHtml ? (
                        /* HTML Live Preview via iframe */
                        <iframe
                            srcDoc={output || '<html><body style="display:flex;align-items:center;justify-content:center;height:100vh;font-family:sans-serif;color:#666;"><p>Click <b>Run</b> to see preview</p></body></html>'}
                            title="HTML Preview"
                            sandbox="allow-scripts allow-modals"
                            className="flex-1 w-full bg-white"
                        />
                    ) : (
                        /* Terminal Output */
                        <div
                            ref={outputRef}
                            className="flex-1 bg-[#1e1e2e] p-4 overflow-auto font-mono text-sm"
                        >
                            {isWaitingForInput ? (
                                <div className="font-mono text-sm">
                                    <div className="flex items-start break-words whitespace-pre-wrap text-[#a6e3a1]">
                                        <span>{simulatedPrompt}</span>
                                        <input
                                            autoFocus
                                            value={terminalInputValue}
                                            onChange={(e) => setTerminalInputValue(e.target.value)}
                                            onKeyDown={handleTerminalInputSubmit}
                                            className="bg-transparent text-[#cdd6f4] outline-none ml-1 flex-1 min-w-[50px]"
                                            style={{ caretColor: '#cdd6f4' }}
                                        />
                                    </div>
                                    <div className="mt-4 text-xs text-slate-500 italic">
                                        Type your input and press <kbd className="bg-slate-800 text-slate-300 px-1 rounded">Enter</kbd>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    {!output && !error && (
                                        <div className="text-slate-600 italic">
                                            Press <kbd className="px-1.5 py-0.5 bg-[#313244] rounded text-xs text-slate-400">▶ Run</kbd> or <kbd className="px-1.5 py-0.5 bg-[#313244] rounded text-xs text-slate-400">Ctrl + Enter</kbd> to execute your code
                                        </div>
                                    )}

                                    {output && (
                                        <pre className="text-[#a6e3a1] whitespace-pre-wrap break-words">{output}</pre>
                                    )}

                                    {error && (
                                        <pre className="text-[#f38ba8] whitespace-pre-wrap break-words mt-2">{error}</pre>
                                    )}
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* ═══════════ STATUS BAR ═══════════ */}
            <div className="flex items-center justify-between px-4 py-1.5 bg-[#181825] border-t border-[#313244] text-xs text-slate-500 shrink-0">
                <div className="flex items-center gap-4">
                    <span>Language: <strong className="text-slate-300">{currentLang?.label}</strong></span>
                    <span>Lines: <strong className="text-slate-300">{lineCount}</strong></span>
                    <span>Chars: <strong className="text-slate-300">{code.length}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-slate-600">Engine: <strong className="text-slate-400">{isHtml ? 'Native Browser' : 'JSCPP (GCC-compatible)'}</strong></span>
                    <span className="text-slate-600">•</span>
                    <span className="text-slate-600">Ctrl+Enter to Run</span>
                </div>
            </div>
        </div>
    );
}
