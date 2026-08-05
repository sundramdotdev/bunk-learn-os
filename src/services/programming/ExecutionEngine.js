import JSInterpreter from 'js-interpreter';
import { headlessRunCode } from '@runno/runtime';
import { pythonRuntimeService } from './PythonRuntimeService';

export class ExecutionEngine {
    constructor() {
        this.pyodide = null;
        this.sql = null;
        this.isLoadingPython = false;
        this.isLoadingSQL = false;
    }


    async loadSQLEngine() {
        if (this.sql) return;
        if (this.isLoadingSQL) {
            while (this.isLoadingSQL) {
                await new Promise(r => setTimeout(r, 100));
            }
            return;
        }

        this.isLoadingSQL = true;
        try {
            if (!window.initSqlJs) {
                await new Promise((resolve, reject) => {
                    const script = document.createElement('script');
                    script.src = "https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/sql-wasm.js";
                    script.onload = resolve;
                    script.onerror = reject;
                    document.head.appendChild(script);
                });
            }
            const SQL = await window.initSqlJs({ locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/${file}` });
            this.sql = new SQL.Database();
        } catch (error) {
            console.error("Failed to load sql.js:", error);
            throw new Error("Failed to load SQL runtime.");
        } finally {
            this.isLoadingSQL = false;
        }
    }

    async execute(code, language, onOutput, onParseTree) {
        if (!code.trim()) return { success: true, executionTime: 0 };
        
        const start = performance.now();
        try {
            switch (language.toLowerCase()) {
                case 'javascript':
                    return await this.executeJS(code, onOutput, onParseTree);
                case 'python':
                    // Note: Pre-loading is handled directly via PythonRuntimeService
                    return await this.executePython(code, onOutput);
                case 'sql':
                    await this.loadSQLEngine();
                    return await this.executeSQL(code, onOutput);
                case 'c':
                    return await this.executeWASM(code, 'clang', onOutput);
                case 'cpp':
                    return await this.executeWASM(code, 'cpp', onOutput);
                default:
                    throw new Error(`Unsupported language: ${language}`);
            }
        } catch (error) {
            return {
                success: false,
                error: error.message,
                executionTime: performance.now() - start
            };
        }
    }

    async executeJS(code, onOutput, onParseTree) {
        return new Promise((resolve) => {
            const start = performance.now();
            let interpreter;
            let executionLimit = 10000;
            let stepCount = 0;
            
            const initFunc = (interpreter, globalObject) => {
                const logWrap = function(...args) {
                    onOutput(args.join(' ') + '\n');
                };
                interpreter.setProperty(globalObject, 'console', interpreter.nativeToPseudo({
                    log: interpreter.createNativeFunction(logWrap),
                    error: interpreter.createNativeFunction((...a) => onOutput(a.join(' ') + '\n', 'error')),
                    warn: interpreter.createNativeFunction((...a) => onOutput(a.join(' ') + '\n', 'warn'))
                }));
            };

            try {
                interpreter = new JSInterpreter(code, initFunc);
                if (onParseTree) {
                    onParseTree(interpreter.ast);
                }
                
                while (interpreter.step()) {
                    stepCount++;
                    if (stepCount > executionLimit) {
                        throw new Error("Infinite loop detected or execution took too long.");
                    }
                }
                resolve({ success: true, executionTime: performance.now() - start });
            } catch (err) {
                resolve({ success: false, error: err.toString(), executionTime: performance.now() - start });
            }
        });
    }

    async executePython(code, onOutput) {
        const start = performance.now();
        try {
            const res = await pythonRuntimeService.execute(code, onOutput);
            return { 
                success: res.success, 
                error: res.error, 
                executionTime: performance.now() - start 
            };
        } catch (err) {
            return { success: false, error: err.message, executionTime: performance.now() - start };
        }
    }

    async executeSQL(code, onOutput) {
        const start = performance.now();
        try {
            const res = this.sql.exec(code);
            if (res.length > 0) {
                res.forEach(result => {
                    onOutput(result.columns.join('\t') + '\n');
                    onOutput('-'.repeat(40) + '\n');
                    result.values.forEach(val => {
                        onOutput(val.join('\t') + '\n');
                    });
                });
            } else {
                onOutput("Query executed successfully. No results to display.\n");
            }
            return { success: true, executionTime: performance.now() - start };
        } catch (err) {
            return { success: false, error: err.message, executionTime: performance.now() - start };
        }
    }

    async executeWASM(code, language, onOutput) {
        const start = performance.now();
        try {
            const result = await headlessRunCode(language, code);
            
            if (result.stderr && result.stderr.trim()) {
                onOutput(result.stderr + '\n', result.exitCode === 0 ? 'warn' : 'error');
            }
            
            if (result.stdout) {
                onOutput(result.stdout + '\n');
            }

            return { 
                success: result.exitCode === 0, 
                error: result.exitCode !== 0 ? `Process exited with code ${result.exitCode}` : null,
                executionTime: performance.now() - start 
            };
        } catch (err) {
            return { success: false, error: err.message, executionTime: performance.now() - start };
        }
    }
}

// Singleton instance
export const executionEngine = new ExecutionEngine();
