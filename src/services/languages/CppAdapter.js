import { LanguageAdapter } from './LanguageAdapter';

export class CppAdapter extends LanguageAdapter {
    tokenize(code) {
        const tokens = [];
        const words = code.split(/(\s+|[;(){}[\],+\-*/=<>])/g).filter(w => w.trim().length > 0 || /^[;(){}[\],+\-*/=<>]$/.test(w));
        const keywords = new Set(['int', 'char', 'float', 'double', 'void', 'return', 'if', 'else', 'for', 'while', 'include', 'using', 'namespace']);
        
        for (const w of words) {
            let type = 'Identifier';
            if (keywords.has(w)) type = 'Keyword';
            else if (!isNaN(w)) type = 'Literal';
            else if (/^["'].*["']$/.test(w)) type = 'String';
            else if (/^[+\-*/=<>]+$/.test(w)) type = 'Operator';
            else if (/^[;(){}[\],]$/.test(w)) type = 'Separator';
            else if (/^#.*$/.test(w)) type = 'Directive';
            
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
                { type: "IncludeDirective", value: "<iostream>" },
                { type: "FunctionDeclaration", value: "main", children: [
                    { type: "Block", value: "Statements" }
                ]}
            ]
        };
    }
    
    extractVariables(code) {
        const vars = [];
        const regex = /(int|float|double|char|bool)\s+([a-zA-Z_]\w*)\s*(?:=\s*([^;]+))?;/g;
        let match;
        while ((match = regex.exec(code)) !== null) {
            vars.push({
                type: match[1],
                name: match[2],
                value: match[3] || 'uninitialized'
            });
        }
        return vars;
    }
    
    simulateMemory(variables) {
        const stack = [];
        const heap = [];
        let stackPtr = 0x7FFF0000;
        
        variables.forEach(v => {
            stack.push({ address: `0x${stackPtr.toString(16)}`, name: v.name, value: String(v.value) });
            stackPtr -= 4; // simulated 4 bytes
        });
        
        return {
            code: [{ address: '0x08048000', value: '<main>' }],
            data: [],
            stack,
            heap
        };
    }
    
    simulateExecution(code) {
        const callStack = [];
        const functionRegex = /(?:int|void|float|double)\s+([a-zA-Z_]\w*)\s*\(/g;
        let match;
        let hasMain = false;
        while ((match = functionRegex.exec(code)) !== null) {
            if (match[1] === 'main') hasMain = true;
            else callStack.push({ name: `${match[1]}()`, address: `0x${Math.floor(Math.random() * 0xFFFF).toString(16)}` });
        }
        if (hasMain) {
            callStack.unshift({ name: 'main()', address: '0x08048123' });
        } else {
            callStack.unshift({ name: '_start()', address: '0x08048000' });
        }
        return { callStack };
    }
}
