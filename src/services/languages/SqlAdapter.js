import { LanguageAdapter } from './LanguageAdapter';

export class SqlAdapter extends LanguageAdapter {
    tokenize(code) {
        const tokens = [];
        const words = code.split(/(\s+|[;(){}[\],+\-*/=<>])/g).filter(w => w.trim().length > 0 || /^[;(){}[\],+\-*/=<>]$/.test(w));
        const keywords = new Set(['SELECT', 'FROM', 'WHERE', 'INSERT', 'INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE', 'CREATE', 'TABLE', 'INT', 'VARCHAR', 'AND', 'OR', 'NOT', 'NULL', 'PRIMARY', 'KEY']);
        
        for (const w of words) {
            let type = 'Identifier';
            const upper = w.toUpperCase();
            if (keywords.has(upper)) type = 'Keyword';
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
                { type: "Query", value: "SQL Statement" }
            ]
        };
    }
    
    extractVariables(code) {
        const vars = [];
        const regex = /CREATE TABLE\s+([a-zA-Z_]\w*)/ig;
        let match;
        while ((match = regex.exec(code)) !== null) {
            vars.push({
                type: 'Table',
                name: match[1],
                value: 'Empty Set'
            });
        }
        return vars;
    }
    
    simulateMemory(variables) {
        const heap = [];
        let heapPtr = 0x00010000;
        
        variables.forEach(v => {
            heap.push({ address: `0x${heapPtr.toString(16)}`, value: `Table: ${v.name}` });
            heapPtr += 256;
        });
        
        return {
            code: [{ address: '0x1000', value: 'Query Plan' }],
            data: [],
            stack: [],
            heap
        };
    }
    
    simulateExecution(code) {
        return { callStack: [{ name: 'Query Executor', address: '0x1000' }] };
    }
}
