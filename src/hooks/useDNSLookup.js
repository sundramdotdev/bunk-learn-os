import { useState, useCallback, useRef } from 'react';
import { resolveAllCommonDNS } from '../services/network/dnsService';
import { validateDomain } from '../services/network/validationService';

export function useDNSLookup() {
    const [domain, setDomain] = useState('google.com');
    const [history, setHistory] = useState([]);
    const [isResolving, setIsResolving] = useState(false);
    const [error, setError] = useState(null);
    
    // Animation state
    const [logs, setLogs] = useState([]);
    const [activeHop, setActiveHop] = useState(null);

    // Current results
    const [results, setResults] = useState(null);

    const abortControllerRef = useRef(null);

    const resolveDomain = useCallback(async () => {
        const validation = validateDomain(domain);
        if (!validation.isValid) {
            setError(validation.error);
            setLogs([`Error: ${validation.error}`]);
            return;
        }

        setError(null);
        setIsResolving(true);
        setResults(null);
        setLogs([]);
        setActiveHop(null);

        // Cancel previous if any
        if (abortControllerRef.current) {
            // We can't really abort fetch in dnsService easily if we didn't pass signal, 
            // but we can just ignore results. For simplicity, we just proceed.
        }

        const targetDomain = validation.domain;

        // Start educational animation while waiting for real results
        const animSteps = [
            `Browser checks local cache for ${targetDomain}... (Miss)`,
            `Browser asks OS Resolver for ${targetDomain}...`,
            `OS Resolver asks Root Server (.) for ${targetDomain}...`,
            `Root Server responds: Check TLD server`,
            `OS Resolver asks TLD server for ${targetDomain}...`,
            `TLD Server responds: Check Authoritative NS`,
            `OS Resolver asks Authoritative NS for ${targetDomain}...`
        ];

        let i = 0;
        const intervalId = setInterval(() => {
            if (i < animSteps.length) {
                setLogs(prev => [...prev, animSteps[i]]);
                setActiveHop(i);
                i++;
            } else {
                clearInterval(intervalId);
            }
        }, 300);

        // Perform actual lookup
        try {
            const data = await resolveAllCommonDNS(targetDomain);
            
            clearInterval(intervalId);
            
            // Generate final logs based on real data
            const A_Records = data.A.records;
            if (A_Records && A_Records.length > 0) {
                setLogs(prev => [
                    ...prev, 
                    `Authoritative NS responds: ${targetDomain} = ${A_Records[0].data}`,
                    `OS Resolver caches result and returns to Browser.`,
                    `Browser connects to ${A_Records[0].data}.`
                ]);
            } else {
                setLogs(prev => [
                    ...prev,
                    `Authoritative NS responds: No A records found.`
                ]);
            }

            setResults(data);
            setActiveHop(10); // done

            // Add to history
            setHistory(prev => {
                const newHist = [{ domain: targetDomain, timestamp: new Date().toISOString(), data }, ...prev];
                // Keep last 10
                return newHist.slice(0, 10);
            });

        } catch (err) {
            clearInterval(intervalId);
            setError(err.message);
            setLogs(prev => [...prev, `Error resolving domain: ${err.message}`]);
        } finally {
            setIsResolving(false);
        }

    }, [domain]);

    const clearHistory = useCallback(() => {
        setHistory([]);
    }, []);

    const copyResult = useCallback(() => {
        if (results) {
            navigator.clipboard.writeText(JSON.stringify(results, null, 2));
        }
    }, [results]);

    const repeatLookup = useCallback((histDomain) => {
        setDomain(histDomain);
    }, []);

    return {
        domain, setDomain,
        history, clearHistory, copyResult, repeatLookup,
        isResolving,
        error,
        logs,
        activeHop,
        results,
        resolveDomain
    };
}
