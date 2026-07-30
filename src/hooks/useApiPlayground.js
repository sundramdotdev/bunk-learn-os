import { useState } from 'react';
import { simulateApiCall } from '../services/api/ApiService';

export function useApiPlayground() {
    const [method, setMethod] = useState('GET');
    const [endpoint, setEndpoint] = useState('/api/users');
    const [body, setBody] = useState('{\n  "name": "New User",\n  "role": "guest",\n  "email": "new@example.com"\n}');
    
    const [response, setResponse] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [animState, setAnimState] = useState(0); 

    const handleSend = async () => {
        setIsLoading(true);
        setResponse(null);
        setAnimState(1);

        // Animation sequence
        const animSteps = [2, 3, 4, 5, 6];
        for (let i = 0; i < animSteps.length; i++) {
            await new Promise(r => setTimeout(r, 150));
            setAnimState(animSteps[i]);
        }

        const res = await simulateApiCall(method, endpoint, body);
        
        setResponse(res);
        setAnimState(0);
        setIsLoading(false);
    };

    return {
        method, setMethod,
        endpoint, setEndpoint,
        body, setBody,
        response, isLoading, animState,
        handleSend
    };
}
