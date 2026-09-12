import { useState, useEffect, useCallback, useRef } from 'react';
import { SqlService } from '../services/dbms/SqlService';

export function useDBMS() {
    const sqlServiceRef = useRef(null);

    const [query, setQuery] = useState('SELECT * FROM bunk_db');
    const [schema, setSchema] = useState([]);
    const [results, setResults] = useState(null);
    const [activeDatabase, setActiveDatabase] = useState('');
    const [activeDbDetails, setActiveDbDetails] = useState(null);
    const [isExecuting, setIsExecuting] = useState(false);

    // Initialize service once
    useEffect(() => {
        if (!sqlServiceRef.current) {
            sqlServiceRef.current = new SqlService();
            refreshSchema();
            setQuery('SHOW DATABASES;');
        }
    }, []);

    const refreshSchema = useCallback(() => {
        if (sqlServiceRef.current) {
            const newSchema = sqlServiceRef.current.getSchema();
            const activeDb = sqlServiceRef.current.getActiveDatabase();
            const dbDetails = sqlServiceRef.current.getActiveDbDetails();
            setSchema(newSchema);
            setActiveDatabase(activeDb);
            setActiveDbDetails(dbDetails);
        }
    }, []);

    const switchDatabase = useCallback((dbName) => {
        if (!sqlServiceRef.current) return;
        setIsExecuting(true);
        setTimeout(() => {
            sqlServiceRef.current.executeQuery(`USE ${dbName}`);
            refreshSchema();
            setIsExecuting(false);
        }, 100);
    }, [refreshSchema]);

    const executeQuery = useCallback((sqlText) => {
        if (!sqlServiceRef.current || !sqlText.trim()) return;

        setIsExecuting(true);
        setResults(null);

        // Simulating a tiny bit of latency for better UI feel
        setTimeout(() => {
            // Split multiple statements by semicolon (AlaSQL supports multi-statements in array, or string, but string is sometimes buggy with complex CREATE/USE mixed)
            // Actually, alaSQL can handle a single string with semicolons. Let's just pass the string.
            const result = sqlServiceRef.current.executeQuery(sqlText);

            if (!result.success) {
                setResults({ type: 'error', content: result.error, duration: 0 });
            } else {
                // If the result is an array of arrays (multiple statements), take the last one or show all?
                // Let's just handle it. AlaSQL returns array of objects for SELECT. 
                // For multi-statement it returns array of arrays.

                let dataToRender = result.data;
                let isMulti = Array.isArray(result.data) && result.data.length > 0 && Array.isArray(result.data[0]);

                if (isMulti) {
                    // Just show the last result set that has data, or the last one overall
                    dataToRender = result.data[result.data.length - 1];
                }

                if (Array.isArray(dataToRender) && dataToRender.length > 0 && typeof dataToRender[0] === 'object') {
                    setResults({ type: 'data', content: dataToRender, duration: result.duration });
                } else {
                    // Just a success message (e.g., for CREATE TABLE, INSERT)
                    setResults({ type: 'message', content: 'Query executed successfully.', duration: result.duration });
                }
            }

            // Refresh schema because they might have created a table, DB, or changed USE db
            refreshSchema();
            setIsExecuting(false);
        }, 300);

    }, [refreshSchema]);

    const loadScenario = useCallback((scenarioName) => {
        if (!sqlServiceRef.current) return;
        setIsExecuting(true);
        setResults(null);

        setTimeout(() => {
            const res = sqlServiceRef.current.loadScenario(scenarioName);
            if (res.success) {
                setQuery(`SELECT * FROM ${scenarioName === 'school' ? 'students' : 'employees'};`);
                setResults({ type: 'message', content: `Loaded '${scenarioName}' database successfully.`, duration: 15 });
                refreshSchema();
            } else {
                setResults({ type: 'error', content: res.error, duration: 0 });
            }
            setIsExecuting(false);
        }, 500);
    }, [refreshSchema]);

    return {
        query, setQuery,
        schema,
        activeDatabase,
        activeDbDetails,
        results,
        isExecuting,
        executeQuery,
        loadScenario,
        switchDatabase
    };
}
