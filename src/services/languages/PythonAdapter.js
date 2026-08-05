import { LanguageAdapter } from './LanguageAdapter';

export class PythonAdapter extends LanguageAdapter {
    tokenize(code) {
        const tokens = [];
        const words = code.split(/(\s+|[;(){}[\],+\-*/=<>:])/g).filter(w => w.trim().length > 0 || /^[;(){}[\],+\-*/=<>:]$/.test(w));
        const keywords = new Set(['def', 'class', 'import', 'from', 'if', 'elif', 'else', 'return', 'for', 'while', 'print', 'in', 'and', 'or', 'not', 'True', 'False', 'None']);
        
        for (const w of words) {
            let type = 'Identifier';
            if (keywords.has(w)) type = 'Keyword';
            else if (!isNaN(w)) type = 'Literal';
            else if (/^["'].*["']$/.test(w)) type = 'String';
            else if (/^[+\-*/=<>:]+$/.test(w)) type = 'Operator';
            else if (/^[;(){}[\],]$/.test(w)) type = 'Separator';
            
            if (w.trim()) {
                tokens.push({ value: w, type });
            }
        }
        return tokens;
    }
    
    parse(tokens) {
        return {
            type: "Program",
            children: [
                { type: "Module", value: "Python Module" }
            ]
        };
    }
    
    extractVariables(code) {
        const vars = [];
        const regex = /^\s*([a-zA-Z_]\w*)\s*=\s*(.+)$/gm;
        let match;
        while ((match = regex.exec(code)) !== null) {
            vars.push({
                type: 'dynamic',
                name: match[1],
                value: match[2]
            });
        }
        return vars;
    }
    
    simulateMemory(variables) {
        const stack = [];
        const heap = [];
        let stackPtr = 0x7FFF0000;
        let heapPtr = 0x00010000;
        
        variables.forEach(v => {
            // In python, everything is an object reference
            heap.push({ address: `0x${heapPtr.toString(16)}`, value: String(v.value) });
            stack.push({ address: `0x${stackPtr.toString(16)}`, name: v.name, value: `&0x${heapPtr.toString(16)}` });
            heapPtr += 32;
            stackPtr -= 8;
        });
        
        return {
            code: [{ address: '0x1000', value: 'CPython Bytecode' }],
            data: [],
            stack,
            heap
        };
    }
    
    simulateExecution(code) {
        const callStack = [{ name: '<module>', address: '0x0000' }];
        const functionRegex = /def\s+([a-zA-Z_]\w*)/g;
        let match;
        while ((match = functionRegex.exec(code)) !== null) {
            callStack.push({ name: `${match[1]}()`, address: `0x${Math.floor(Math.random() * 0xFFFF).toString(16)}` });
        }
        return { callStack };
    }
}
