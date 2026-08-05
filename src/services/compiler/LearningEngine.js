import { JavaScriptAdapter } from '../languages/JavaScriptAdapter';
import { PythonAdapter } from '../languages/PythonAdapter';
import { SqlAdapter } from '../languages/SqlAdapter';
import { CppAdapter } from '../languages/CppAdapter';

class LearningEngine {
    constructor() {
        this.adapters = {
            javascript: new JavaScriptAdapter(),
            python: new PythonAdapter(),
            sql: new SqlAdapter(),
            c: new CppAdapter(),
            cpp: new CppAdapter()
        };
    }

    getAdapter(language) {
        return this.adapters[language] || this.adapters['javascript'];
    }

    analyze(code, language) {
        const adapter = this.getAdapter(language);
        if (!code) {
            return this.emptyPipeline();
        }
        
        const tokens = adapter.tokenize(code);
        const ast = adapter.buildAST(code);
        const variables = adapter.extractVariables(code);
        const symbolTable = adapter.buildSymbolTable(code);
        const memorySnapshot = adapter.simulateMemory(variables);
        const execution = adapter.simulateExecution(code);
        
        return {
            tokens,
            syntaxTree: ast,
            variables,
            symbolTable,
            memorySnapshot,
            callStack: execution.callStack,
            ir: ["START:", "  LOAD_ENV", "  EXECUTE_BLOCK", "  HALT"],
            assembly: ["section .data", "section .text", "global _start", "_start:", "  mov eax, 1", "  int 0x80"]
        };
    }

    emptyPipeline() {
        return { 
            tokens: [], 
            syntaxTree: null, 
            variables: [],
            symbolTable: [], 
            memorySnapshot: { stack: [], heap: [], code: [], data: [] },
            callStack: [],
            ir: [], 
            assembly: [] 
        };
    }
}

export const learningEngine = new LearningEngine();
