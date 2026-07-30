import { useState, useEffect, useMemo } from 'react';
import { evaluateRegex } from '../services/regex/RegexService';

export function useRegex() {
    const [regexStr, setRegexStr] = useState('[A-Z]\\w+');
    const [flags, setFlags] = useState('g');
    const [testString, setTestString] = useState('Hello World! Welcome to Bunk & Learn Hub. This is a Regex Test: 123-456.');
    
    const evaluation = useMemo(() => {
        return evaluateRegex(regexStr, flags, testString);
    }, [regexStr, flags, testString]);

    const { matches, error } = evaluation;

    const toggleFlag = (flag) => {
        if (flags.includes(flag)) {
            setFlags(flags.replace(flag, ''));
        } else {
            setFlags(flags + flag);
        }
    };

    const FLAG_OPTS = [
        { id: 'g', label: 'Global', desc: 'Don\'t return after first match' },
        { id: 'i', label: 'Case Insensitive', desc: 'Ignore case' },
        { id: 'm', label: 'Multiline', desc: '^ and $ match start/end of line' },
        { id: 's', label: 'Dotall', desc: 'Dot (.) matches newline' },
        { id: 'u', label: 'Unicode', desc: 'Match with full unicode' },
        { id: 'y', label: 'Sticky', desc: 'Match only from lastIndex' }
    ];

    return {
        regexStr, setRegexStr,
        flags, setFlags,
        testString, setTestString,
        matches, error,
        toggleFlag, FLAG_OPTS
    };
}
