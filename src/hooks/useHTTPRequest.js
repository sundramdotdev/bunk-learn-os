import { useState, useCallback, useRef } from 'react';
import { performHTTPRequest } from '../services/network/httpService';
import { validateURL } from '../services/network/validationService';

export function useHTTPRequest() {
    const [url, setUrl] = useState('https://jsonplaceholder.typicode.com/posts/1');
    const [method, setMethod] = useState('GET');
    const [headers, setHeaders] = useState([{ key: 'Accept', value: 'application/json' }]);
    const [body, setBody] = useState('');
    
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [response, setResponse] = useState(null);
    
    // Animation state for the visualizer
    const [animState, setAnimState] = useState('idle'); // idle, dns, tcp, tls, request, response, done

    const abortControllerRef = useRef(null);

    const updateHeader = (index, key, value) => {
        const newHeaders = [...headers];
        newHeaders[index] = { key, value };
        setHeaders(newHeaders);
    };

    const addHeader = () => setHeaders([...headers, { key: '', value: '' }]);
    const removeHeader = (index) => setHeaders(headers.filter((_, i) => i !== index));

    const sendRequest = useCallback(async () => {
        const validation = validateURL(url);
        if (!validation.isValid) {
            setError(validation.error);
            return;
        }

        setError(null);
        setIsLoading(true);
        setResponse(null);
        setAnimState('dns');

        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        abortControllerRef.current = new AbortController();

        // Convert headers array to object
        const headersObj = {};
        headers.forEach(h => {
            if (h.key && h.key.trim()) {
                headersObj[h.key.trim()] = h.value;
            }
        });

        // Synthetic educational timing for layers we can't inspect
        const sleep = ms => new Promise(r => setTimeout(r, ms));
        
        await sleep(300);
        setAnimState('tcp');
        await sleep(300);
        
        if (validation.parsed.protocol === 'https:') {
            setAnimState('tls');
            await sleep(400);
        }
        
        setAnimState('request');

        // Actual request
        const res = await performHTTPRequest(
            validation.url,
            method,
            headersObj,
            body,
            abortControllerRef.current.signal
        );

        setAnimState('response');
        await sleep(300);

        if (!res.success) {
            setError(res.error);
        }
        
        setResponse(res);
        setAnimState('done');
        setIsLoading(false);

    }, [url, method, headers, body]);

    return {
        url, setUrl,
        method, setMethod,
        headers, updateHeader, addHeader, removeHeader,
        body, setBody,
        isLoading,
        error,
        response,
        animState,
        sendRequest
    };
}
