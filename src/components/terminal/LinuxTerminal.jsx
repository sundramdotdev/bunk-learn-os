import React, { useState, useRef, useEffect } from 'react';
import { Terminal as TermIcon, Circle, AlertCircle } from 'lucide-react';
import { FileSystem } from '../../utils/FileSystem';

export default function LinuxTerminal() {
    const [fs] = useState(() => new FileSystem());
    const [history, setHistory] = useState([
        { type: 'sys', content: 'Bunk & Learn OS v3.0 (tty1)' },
        { type: 'sys', content: 'Type "help" to see available commands.' }
    ]);
    const [input, setInput] = useState('');
    const [commandHistory, setCommandHistory] = useState([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const bottomRef = useRef(null);

    // Auto-scroll
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [history]);

    const getPrompt = () => {
        const path = fs.getPwdString();
        const displayPath = path.replace('/home/user', '~');
        return `user@bunkos:${displayPath}$ `;
    };

    const handleCommand = (cmdStr) => {
        const trimmed = cmdStr.trim();
        if (!trimmed) {
            setHistory(prev => [...prev, { type: 'prompt', prompt: getPrompt(), cmd: '' }]);
            return;
        }

        setCommandHistory(prev => [...prev, trimmed]);
        setHistoryIndex(-1);
        setHistory(prev => [...prev, { type: 'prompt', prompt: getPrompt(), cmd: trimmed }]);

        const args = trimmed.split(' ').filter(a => a.length > 0);
        const cmd = args[0];

        try {
            switch (cmd) {
                case 'pwd':
                    setHistory(prev => [...prev, { type: 'out', content: fs.getPwdString() }]);
                    break;
                case 'ls':
                    setHistory(prev => [...prev, { type: 'out', content: fs.ls(args[1]) }]);
                    break;
                case 'cd':
                    if (args[1]) fs.cd(args[1]);
                    break;
                case 'mkdir':
                    if (!args[1]) throw new Error('mkdir: missing operand');
                    fs.mkdir(args[1]);
                    break;
                case 'rmdir':
                    if (!args[1]) throw new Error('rmdir: missing operand');
                    fs.rmdir(args[1]);
                    break;
                case 'touch':
                    if (!args[1]) throw new Error('touch: missing file operand');
                    fs.touch(args[1]);
                    break;
                case 'cat':
                    if (!args[1]) throw new Error('cat: missing file operand');
                    setHistory(prev => [...prev, { type: 'out', content: fs.cat(args[1]) }]);
                    break;
                case 'echo':
                    const idx = args.indexOf('>');
                    if (idx !== -1) {
                        const content = args.slice(1, idx).join(' ');
                        const file = args[idx + 1];
                        fs.echo(content, file);
                    } else {
                        setHistory(prev => [...prev, { type: 'out', content: args.slice(1).join(' ') }]);
                    }
                    break;
                case 'rm':
                    if (!args[1]) throw new Error('rm: missing operand');
                    fs.rm(args[1]);
                    break;
                case 'clear':
                    setHistory([]);
                    break;
                case 'tree':
                    setHistory(prev => [...prev, { type: 'out', content: '.\n' + fs.tree() }]);
                    break;
                case 'whoami':
                    setHistory(prev => [...prev, { type: 'out', content: 'user' }]);
                    break;
                case 'date':
                    setHistory(prev => [...prev, { type: 'out', content: new Date().toString() }]);
                    break;
                case 'help':
                    setHistory(prev => [...prev, { type: 'out', content: 'Supported commands:\npwd, ls, cd, mkdir, rmdir, touch, cat, echo, rm, clear, tree, whoami, date, history, help' }]);
                    break;
                case 'history':
                    const histOut = commandHistory.map((h, i) => `  ${i+1}  ${h}`).join('\n');
                    setHistory(prev => [...prev, { type: 'out', content: histOut }]);
                    break;
                default:
                    setHistory(prev => [...prev, { type: 'err', content: `${cmd}: command not found` }]);
            }
        } catch (err) {
            setHistory(prev => [...prev, { type: 'err', content: err.message }]);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleCommand(input);
            setInput('');
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (commandHistory.length > 0) {
                const newIdx = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
                setHistoryIndex(newIdx);
                setInput(commandHistory[newIdx]);
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (historyIndex !== -1) {
                const newIdx = historyIndex + 1;
                if (newIdx >= commandHistory.length) {
                    setHistoryIndex(-1);
                    setInput('');
                } else {
                    setHistoryIndex(newIdx);
                    setInput(commandHistory[newIdx]);
                }
            }
        }
    };

    return (
        <div className="w-full h-[600px] bg-[#1e1e1e] flex flex-col font-mono text-sm shadow-xl border border-slate-700 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Terminal Header */}
            <div className="bg-[#2d2d2d] h-10 flex items-center px-4 border-b border-black select-none shrink-0">
                <div className="flex gap-2 mr-4">
                    <Circle size={12} className="fill-[#ff5f56] text-[#ff5f56]" />
                    <Circle size={12} className="fill-[#ffbd2e] text-[#ffbd2e]" />
                    <Circle size={12} className="fill-[#27c93f] text-[#27c93f]" />
                </div>
                <div className="flex-1 flex justify-center items-center gap-2 text-slate-400">
                    <TermIcon size={14} />
                    <span className="text-[10px] uppercase font-bold tracking-widest">user@bunkos:~</span>
                </div>
            </div>

            {/* Terminal Body */}
            <div className="flex-1 overflow-y-auto p-4 text-slate-300 scrollbar-thin scrollbar-thumb-slate-600 bg-[#1e1e1e]" onClick={() => document.getElementById('term-input').focus()}>
                {history.map((h, i) => {
                    if (h.type === 'sys') return <div key={i} className="text-emerald-400 mb-2">{h.content}</div>;
                    if (h.type === 'prompt') return (
                        <div key={i} className="flex">
                            <span className="text-emerald-400 font-bold mr-2">{h.prompt}</span>
                            <span>{h.cmd}</span>
                        </div>
                    );
                    if (h.type === 'err') return <div key={i} className="text-red-400 whitespace-pre-wrap">{h.content}</div>;
                    return <div key={i} className="whitespace-pre-wrap mb-1">{h.content}</div>;
                })}
                
                {/* Active Input Line */}
                <div className="flex mt-1">
                    <span className="text-emerald-400 font-bold mr-2 whitespace-pre">{getPrompt()}</span>
                    <input
                        id="term-input"
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        autoFocus
                        autoComplete="off"
                        spellCheck="false"
                        className="flex-1 bg-transparent outline-none text-slate-300 caret-slate-300"
                    />
                </div>
                <div ref={bottomRef} />
            </div>
        </div>
    );
}
