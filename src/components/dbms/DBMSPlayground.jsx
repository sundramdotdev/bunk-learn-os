import React, { useState, useRef } from 'react';
import { Database, Table as TableIcon, Play, Trash2, BookOpen, Clock, AlertTriangle, CheckCircle2, LayoutGrid, ChevronDown, Server } from 'lucide-react';
import { useDBMS } from '../../hooks/useDBMS';

export default function DBMSPlayground() {
    const {
        query, setQuery,
        schema,
        activeDatabase,
        activeDbDetails,
        results,
        isExecuting,
        executeQuery,
        switchDatabase
    } = useDBMS();

    const [activeTab, setActiveTab] = useState('results');
    const [dbDropdownOpen, setDbDropdownOpen] = useState(false);
    
    // Refs for scroll synchronization
    const lineNumbersRef = useRef(null);
    const textareaRef = useRef(null);

    const handleRun = () => {
        executeQuery(query);
        setActiveTab('results');
    };

    const handleClear = () => {
        setQuery('');
    };

    // Auto-expand textarea height to fit content, eliminating scroll desync natively
    React.useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
        }
    }, [query]);

    // Calculate dynamic line numbers (minimum 12)
    const lineCount = Math.max(12, query.split('\n').length);
    const lineNumbers = Array.from({ length: lineCount }, (_, i) => i + 1);

    // Render results grid for LEFT panel
    const renderQueryOutput = () => {
        if (!results) return (
            <div className="flex flex-col items-center justify-center h-full text-slate-400 p-8 text-center bg-slate-50 border-2 border-dashed border-slate-200 m-4 rounded-xl">
                <Play size={32} className="text-slate-300 mb-3" />
                <h3 className="text-sm font-bold text-slate-700 uppercase tracking-widest mb-1">Run a Query</h3>
                <p className="text-xs text-slate-500 max-w-[200px]">Results of your SQL queries will appear here.</p>
            </div>
        );

        if (results.type === 'error') return (
            <div className="m-4 p-4 bg-red-50 border border-red-200 rounded-xl flex flex-col items-start overflow-auto">
                <div className="flex items-center gap-2 text-red-700 font-bold text-[10px] uppercase tracking-widest mb-2">
                    <AlertTriangle size={14} /> Execution Error
                </div>
                <p className="text-xs text-red-600 font-mono w-full whitespace-pre-wrap leading-relaxed">
                    {results.content}
                </p>
            </div>
        );

        if (results.type === 'message') return (
            <div className="m-4 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex flex-col items-start">
                <div className="flex items-center gap-2 text-emerald-700 font-bold text-[10px] uppercase tracking-widest mb-2">
                    <CheckCircle2 size={14} /> Success
                </div>
                <p className="text-xs text-emerald-600 font-mono w-full leading-relaxed">
                    {results.content}
                </p>
                <div className="mt-2 inline-flex items-center gap-1 text-[9px] font-bold text-emerald-600 uppercase tracking-widest">
                    <Clock size={10} /> Executed in {results.duration}ms
                </div>
            </div>
        );

        const data = results.content;
        if (!Array.isArray(data) || data.length === 0) {
            return (
                <div className="m-4 p-6 bg-slate-50 border border-slate-200 rounded-xl text-center">
                    <CheckCircle2 size={24} className="text-emerald-500 mb-2 mx-auto" />
                    <h3 className="text-[11px] font-bold text-slate-800 uppercase">Query Executed</h3>
                    <p className="text-[10px] text-slate-500 mt-1">0 rows returned in {results.duration}ms</p>
                </div>
            );
        }

        const columns = Object.keys(data[0]);

        return (
            <div className="flex flex-col h-full bg-white animate-in fade-in duration-300">
                <div className="px-3 py-2 border-b border-slate-200 bg-slate-50 flex justify-between items-center shrink-0">
                    <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">{data.length} Rows</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{results.duration}ms</span>
                </div>
                <div className="flex-1 overflow-auto bg-white p-2">
                    <table className="w-full text-left text-[11px] whitespace-nowrap">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                {columns.map((col, i) => (
                                    <th key={i} className="px-3 py-2 font-bold text-slate-800 uppercase tracking-wider">{col}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {data.map((row, i) => (
                                <tr key={i} className="hover:bg-blue-50/50">
                                    {columns.map((col, j) => (
                                        <td key={j} className="px-3 py-1.5 text-slate-600 font-mono">
                                            {row[col] !== null && row[col] !== undefined ? String(row[col]) : <span className="text-slate-300 italic text-[9px]">NULL</span>}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

    return (
        <div className="h-full flex flex-col bg-slate-100 font-sans p-2 md:p-4">
            {/* Top Navigation Bar */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-3 bg-white p-3 md:px-5 rounded-2xl shadow-sm border border-slate-200 shrink-0">
                <div className="flex flex-col">
                    <h1 className="text-sm font-black text-slate-800 flex items-center gap-2 uppercase tracking-widest">
                        <Database size={16} className="text-blue-600" /> Database Management Playground
                    </h1>
                </div>

                <div className="flex items-center gap-4">
                    {/* Database Selector Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setDbDropdownOpen(!dbDropdownOpen)}
                            className="flex items-center gap-2 px-4 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 transition-colors shadow-sm"
                        >
                            <Server size={14} className="text-blue-500" />
                            {activeDatabase || "Select Database"}
                            <ChevronDown size={14} className="text-slate-400 ml-1" />
                        </button>

                        {dbDropdownOpen && (
                            <div className="absolute top-full right-0 mt-1 w-full min-w-[200px] bg-white border border-slate-200 rounded-xl shadow-lg z-50 overflow-hidden">
                                {schema.map((db, i) => (
                                    <button
                                        key={i}
                                        onClick={() => { switchDatabase(db.name); setDbDropdownOpen(false); }}
                                        className={`w-full text-left px-4 py-2 text-xs font-bold flex items-center justify-between hover:bg-blue-50 transition-colors ${db.isActive ? 'text-blue-600 bg-blue-50/50' : 'text-slate-700'
                                            }`}
                                    >
                                        {db.name}
                                        {db.isActive && <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="h-6 w-px bg-slate-200 mx-1"></div>
                </div>
            </div>

            {/* Split Content Area (3 Columns) */}
            <div className="flex-1 flex flex-col lg:flex-row gap-3 min-h-0">

                {/* Left Panel: Schema Explorer (15% width) */}
                <div className="flex flex-col lg:w-[15%] h-[300px] lg:h-full bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden shrink-0">
                    <div className="p-3 border-b border-slate-100 bg-slate-50 shrink-0">
                        <h2 className="text-[11px] font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                            <Database size={14} className="text-blue-500" /> Schema Explorer
                        </h2>
                    </div>
                    <div className="flex-1 overflow-y-auto p-3 scrollbar-thin scrollbar-thumb-slate-200 space-y-4">
                        {schema.map((db, i) => (
                            <div key={i} className="space-y-1.5">
                                <div className={`flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs font-bold border transition-colors ${db.isActive ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-slate-50 border-transparent text-slate-600'
                                    }`}>
                                    <Server size={12} className={db.isActive ? 'text-blue-500' : 'text-slate-400'} />
                                    {db.name}
                                </div>
                                {db.tables.length > 0 ? (
                                    <div className="ml-4 pl-2 border-l border-slate-100 space-y-2">
                                        {db.tables.map((t, j) => (
                                            <div key={j} className="text-[11px]">
                                                <div className="font-bold text-slate-600 flex items-center gap-1.5 mb-1">
                                                    <TableIcon size={10} className="text-slate-400" /> {t.name}
                                                </div>
                                                <div className="ml-4 space-y-0.5">
                                                    {t.columns.map((c, k) => (
                                                        <div key={k} className="flex justify-between items-center text-[9px]">
                                                            <span className="text-slate-500 font-mono">{c.name}</span>
                                                            <span className="text-slate-400 uppercase">{c.type}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="ml-4 pl-2 border-l border-slate-100 text-[9px] text-slate-400 italic">No tables</div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Middle Panel: Editor & Output (50% width) */}
                <div className="flex flex-col lg:w-1/2 h-full gap-3 shrink-0">
                    {/* Editor */}
                    <div className="flex-1 flex flex-col min-h-0 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="flex items-center justify-between p-2 border-b border-slate-100 bg-slate-50/50">
                            <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest bg-white px-2 py-1 rounded border border-slate-200 shadow-sm ml-2">
                                Workspace
                            </span>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={handleClear}
                                    className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                >
                                    <Trash2 size={14} />
                                </button>
                                <button
                                    onClick={handleRun}
                                    disabled={isExecuting || !query.trim()}
                                    className="flex items-center gap-1.5 bg-slate-900 hover:bg-blue-600 text-white px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
                                >
                                    <Play size={12} fill="currentColor" /> Compile
                                </button>
                            </div>
                        </div>
                        <div className="flex-1 min-h-0 overflow-auto bg-white flex relative scrollbar-thin scrollbar-thumb-slate-200">
                            {/* Line Numbers */}
                            <div className="w-8 shrink-0 border-r border-slate-100 bg-slate-50/30 flex flex-col items-end py-3 pr-2 text-slate-300 font-mono text-xs select-none min-h-full">
                                {lineNumbers.map(n => <span key={n} className="leading-relaxed">{n}</span>)}
                            </div>
                            
                            {/* Auto-expanding Textarea */}
                            <div className="flex-1 flex flex-col min-h-full">
                                <textarea
                                    ref={textareaRef}
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    spellCheck="false"
                                    className="w-full bg-transparent text-slate-800 font-mono text-xs resize-none outline-none leading-relaxed p-3 placeholder:text-slate-300 overflow-hidden whitespace-pre"
                                    placeholder="-- Write SQL here..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* Query Output */}
                    <div className="h-[200px] flex flex-col bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden shrink-0">
                        <div className="px-3 py-1.5 border-b border-slate-100 bg-slate-50/50">
                            <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest flex items-center gap-2">
                                <LayoutGrid size={12} className="text-blue-500" /> Compile Messages
                            </span>
                        </div>
                        <div className="flex-1 overflow-auto relative">
                            {renderQueryOutput()}
                        </div>
                    </div>
                </div>

                {/* Right Panel: Database Tables Visualizer (35% width) */}
                <div className="flex-1 flex flex-col bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden h-[400px] lg:h-full">
                    <div className="p-3 border-b border-slate-100 bg-slate-50 shrink-0">
                        <h2 className="text-[11px] font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                            <TableIcon size={14} className="text-blue-500" /> Table Viewer
                        </h2>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 bg-slate-50/30 scrollbar-thin scrollbar-thumb-slate-200">
                        {!activeDbDetails || activeDbDetails.tables.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-slate-400">
                                <TableIcon size={32} className="mb-3 text-slate-200" />
                                <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500">No Tables Available</p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {activeDbDetails.tables.map((table, i) => (
                                    <div key={i} className="flex flex-col">
                                        <h3 className="text-xs font-bold text-slate-800 mb-2 flex items-center gap-1.5">
                                            {table.name}
                                        </h3>
                                        <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
                                            <div className="overflow-x-auto">
                                                <table className="w-full text-left text-xs whitespace-nowrap">
                                                    <thead className="bg-slate-50 border-b border-slate-200">
                                                        <tr>
                                                            {table.columns.map((col, idx) => (
                                                                <th key={idx} className="px-3 py-2 text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                                                                    {col.name}
                                                                </th>
                                                            ))}
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-slate-100">
                                                        {table.data && table.data.length > 0 ? (
                                                            table.data.map((row, rowIdx) => (
                                                                <tr key={rowIdx} className="hover:bg-blue-50">
                                                                    {table.columns.map((col, colIdx) => (
                                                                        <td key={colIdx} className="px-3 py-1.5 text-slate-600">
                                                                            {row[col.name] !== null && row[col.name] !== undefined
                                                                                ? String(row[col.name])
                                                                                : <span className="text-slate-300 italic text-[9px]">NULL</span>}
                                                                        </td>
                                                                    ))}
                                                                </tr>
                                                            ))
                                                        ) : (
                                                            <tr>
                                                                <td colSpan={table.columns.length} className="px-3 py-3 text-center text-[10px] text-slate-400 italic">
                                                                    No data
                                                                </td>
                                                            </tr>
                                                        )}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
