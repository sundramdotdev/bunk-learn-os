import { useState, useCallback, useEffect } from 'react';
import { executionEngine } from '../services/programming/ExecutionEngine';
import { virtualFS } from '../services/programming/VirtualFS';
import { pythonRuntimeService } from '../services/programming/PythonRuntimeService';
import { learningEngine } from '../services/compiler/LearningEngine';

export function useProgrammingLab() {
    const [files, setFiles] = useState(virtualFS.listFiles());
    const [activeFile, setActiveFile] = useState('main.js');
    const [code, setCode] = useState(virtualFS.getFile('main.js'));
    const [language, setLanguage] = useState('javascript');
    
    const [logs, setLogs] = useState([]);
    const [isExecuting, setIsExecuting] = useState(false);
    const [isRuntimeLoading, setIsRuntimeLoading] = useState(false);
    const [runtimeError, setRuntimeError] = useState(null);
    const [executionMetrics, setExecutionMetrics] = useState({ time: 0, status: 'Idle' });
    
    // Educational State
    const [learningMode, setLearningMode] = useState(false);
    const [compilerData, setCompilerData] = useState(learningEngine.emptyPipeline());
    const [memorySnapshot, setMemorySnapshot] = useState({ stack: [], heap: [], code: [], data: [] });
    const [callStack, setCallStack] = useState([]);
    
    // Keep FS in sync with editor
    useEffect(() => {
        virtualFS.setFile(activeFile, code);
    }, [code, activeFile]);

    // Educational static analysis (debounced)
    useEffect(() => {
        if (!learningMode) return;
        const timer = setTimeout(() => {
            const data = learningEngine.analyze(code, language);
            setCompilerData(data);
            setMemorySnapshot(data.memorySnapshot);
            setCallStack(data.callStack);
        }, 300);
        return () => clearTimeout(timer);
    }, [code, language, learningMode]);

    // Preload Python if selected
    useEffect(() => {
        if (language === 'python') {
            setIsRuntimeLoading(true);
            setRuntimeError(null);
            pythonRuntimeService.loadRuntime()
                .then(() => setIsRuntimeLoading(false))
                .catch(err => {
                    setIsRuntimeLoading(false);
                    setRuntimeError(err.message);
                });
        } else {
            setIsRuntimeLoading(false);
            setRuntimeError(null);
        }
    }, [language]);

    const changeFile = useCallback((filename) => {
        setActiveFile(filename);
        setCode(virtualFS.getFile(filename));
        
        if (filename.endsWith('.js')) setLanguage('javascript');
        else if (filename.endsWith('.py')) setLanguage('python');
        else if (filename.endsWith('.sql')) setLanguage('sql');
        else if (filename.endsWith('.c') || filename.endsWith('.cpp')) setLanguage('c');
    }, []);

    const runCode = useCallback(async () => {
        setIsExecuting(true);
        setLogs([]);
        setExecutionMetrics({ time: 0, status: 'Running...' });

        const appendLog = (msg, type = 'stdout') => {
            setLogs(prev => [...prev, { msg, type }]);
        };

        const result = await executionEngine.execute(code, language, appendLog);

        setIsExecuting(false);
        if (result.success) {
            setExecutionMetrics({ time: result.executionTime, status: 'Completed Successfully' });
        } else {
            setExecutionMetrics({ time: result.executionTime, status: 'Execution Failed' });
            appendLog(result.error, 'error');
        }
    }, [code, language]);

    const clearConsole = () => setLogs([]);

    const retryRuntimeLoad = useCallback(() => {
        if (language === 'python') {
            setIsRuntimeLoading(true);
            setRuntimeError(null);
            pythonRuntimeService.loadRuntime()
                .then(() => setIsRuntimeLoading(false))
                .catch(err => {
                    setIsRuntimeLoading(false);
                    setRuntimeError(err.message);
                });
        }
    }, [language]);

    return {
        files, activeFile, changeFile,
        code, setCode, language, setLanguage,
        logs, clearConsole, isExecuting, executionMetrics,
        runCode,
        learningMode, setLearningMode,
        compilerData, memorySnapshot, callStack,
        isRuntimeLoading, runtimeError, retryRuntimeLoad
    };
}
