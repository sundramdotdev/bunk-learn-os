import { LanguageAdapter } from './LanguageAdapter';

export class JavaScriptAdapter extends LanguageAdapter {
    tokenize(code) {
        const tokens = [];
        const words = code.split(/(\s+|[;(){}[\],+\-*/=<>])/g).filter(w => w.trim().length > 0 || /^[;(){}[\],+\-*/=<>]$/.test(w));
        const keywords = new Set(['function', 'const', 'let', 'var', 'if', 'else', 'return', 'for', 'while', 'console', 'class', 'import', 'export']);
        
        for (const w of words) {
            let type = 'Identifier';
            if (keywords.has(w)) type = 'Keyword';
            else if (!isNaN(w)) type = 'Literal';
            else if (/^["'].*["']$/.test(w)) type = 'String';
            else if (/^[+\-*/=<>]+$/.test(w)) type = 'Operator';
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
                { type: "StatementList", value: "Statements" }
            ]
        };
    }
    
    extractVariables(code) {
        const vars = [];
        const regex = /(const|let|var)\s+([a-zA-Z_]\w*)\s*(?:=\s*([^;]+))?;/g;
        let match;
        while ((match = regex.exec(code)) !== null) {
            vars.push({
                type: match[1],
                name: match[2],
                value: match[3] || 'undefined'
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
            if (v.value && v.value.includes('{') || v.value.includes('[')) {
                heap.push({ address: `0x${heapPtr.toString(16)}`, value: v.value });
                stack.push({ address: `0x${stackPtr.toString(16)}`, name: v.name, value: `&0x${heapPtr.toString(16)}` });
                heapPtr += 32;
            } else {
                stack.push({ address: `0x${stackPtr.toString(16)}`, name: v.name, value: String(v.value) });
            }
            stackPtr -= 8;
        });
        
        return {
            code: [{ address: '0x1000', value: 'V8 Bytecode' }],
            data: [],
            stack,
            heap
        };
    }
    
    simulateExecution(code) {
        const callStack = [{ name: 'global context', address: '0x0000' }];
        const functionRegex = /function\s+([a-zA-Z_]\w*)/g;
        let match;
        while ((match = functionRegex.exec(code)) !== null) {
            callStack.push({ name: `${match[1]}()`, address: `0x${Math.floor(Math.random() * 0xFFFF).toString(16)}` });
        }
        return { callStack };
    }
}
