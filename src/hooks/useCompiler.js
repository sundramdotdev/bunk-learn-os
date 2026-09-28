import { useState, useCallback } from 'react';
import { executeCpp, executeHtml, DEFAULT_TEMPLATES } from '../services/compiler/CompilerService';

/**
 * useCompiler — React hook for the multi-language code compiler.
 * Manages language selection, code state, stdin, output, and execution.
 */
export function useCompiler() {
    const [language, setLanguageState] = useState('c');
    const [code, setCode] = useState(DEFAULT_TEMPLATES.c);
    const [output, setOutput] = useState('');
    const [error, setError] = useState(null);
    const [isRunning, setIsRunning] = useState(false);
    const [executionTime, setExecutionTime] = useState(null);
    const [exitCode, setExitCode] = useState(null);

    /**
     * Switch language and load the default template.
     */
    const setLanguage = useCallback((lang) => {
        setLanguageState(lang);
        setCode(DEFAULT_TEMPLATES[lang] || '');
        setOutput('');
        setError(null);
        setExecutionTime(null);
        setExitCode(null);
    }, []);

    /**
     * Execute the current code.
     */
    const runCode = useCallback((providedStdin = '') => {
        setIsRunning(true);
        setOutput('');
        setError(null);
        setExecutionTime(null);
        setExitCode(null);

        // Use setTimeout to let UI update before blocking execution
        setTimeout(() => {
            let result;

            if (language === 'html') {
                result = executeHtml(code);
            } else {
                // Both 'c' and 'cpp' use the same JSCPP engine
                result = executeCpp(code, providedStdin);
            }

            if (result.success) {
                // Prepend the stdin echo so it looks good in screenshots!
                const echoStr = providedStdin.trim() ? `\x1b[33m> Input Provided:\x1b[0m ${providedStdin.replace(/\\n/g, ' ')}\n\n` : '';
                setOutput((echoStr + result.output).replace(/\\x1b\\[[0-9;]*m/g, '')); // Stripping ANSI for now, or we can just use normal text
                setError(null);
            } else {
                setOutput(result.output || '');
                setError(result.error);
            }

            setExecutionTime(result.duration);
            setExitCode(result.exitCode ?? null);
            setIsRunning(false);
        }, 50);
    }, [language, code]);

    /**
     * Clear the output terminal.
     */
    const clearOutput = useCallback(() => {
        setOutput('');
        setError(null);
        setExecutionTime(null);
        setExitCode(null);
    }, []);

    return {
        language,
        setLanguage,
        code,
        setCode,
        output,
        error,
        isRunning,
        executionTime,
        exitCode,
        runCode,
        clearOutput
    };
}
