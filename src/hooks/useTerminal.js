import { useState, useRef, useEffect } from 'react';
import { FileSystem } from '../services/terminal/FileSystemService';

export function useTerminal() {
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

    return {
        input, setInput,
        history, bottomRef,
        getPrompt, handleKeyDown
    };
}
