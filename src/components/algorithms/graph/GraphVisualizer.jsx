import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Play, Pause, RotateCcw, Plus, Trash2, GitCommit, MousePointer2, Settings, Zap } from 'lucide-react';
import { runBFS, runDFS, runDijkstra } from '../../../utils/GraphLogic';

export default function GraphVisualizer() {
    const [nodes, setNodes] = useState([]);
    const [edges, setEdges] = useState([]);
    const [mode, setMode] = useState('add_node'); // 'add_node', 'connect', 'delete'
    const [directed, setDirected] = useState(false);
    
    // Animation state
    const [frames, setFrames] = useState([]);
    const [currentFrameIdx, setCurrentFrameIdx] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [algo, setAlgo] = useState('BFS');
    const [startNodeId, setStartNodeId] = useState('');
    const [speed, setSpeed] = useState(800);
    const timerRef = useRef(null);

    // Interaction state
    const [dragNode, setDragNode] = useState(null);
    const [connectStartNode, setConnectStartNode] = useState(null);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const svgRef = useRef(null);

    // Initial example graph
    useEffect(() => {
        setNodes([
            { id: 'A', x: 100, y: 150 },
            { id: 'B', x: 300, y: 100 },
            { id: 'C', x: 300, y: 250 },
            { id: 'D', x: 500, y: 150 },
        ]);
        setEdges([
            { source: 'A', target: 'B', weight: 4 },
            { source: 'A', target: 'C', weight: 2 },
            { source: 'B', target: 'D', weight: 5 },
            { source: 'C', target: 'D', weight: 1 },
        ]);
        setStartNodeId('A');
    }, []);

    // Animation Loop
    useEffect(() => {
        if (isPlaying && frames.length > 0) {
            timerRef.current = setInterval(() => {
                setCurrentFrameIdx(prev => {
                    if (prev >= frames.length - 1) {
                        setIsPlaying(false);
                        clearInterval(timerRef.current);
                        return prev;
                    }
                    return prev + 1;
                });
            }, speed);
        } else {
            clearInterval(timerRef.current);
        }
        return () => clearInterval(timerRef.current);
    }, [isPlaying, frames.length, speed]);

    const handlePlay = useCallback(() => {
        if (frames.length > 0) {
            if (currentFrameIdx < frames.length - 1) setIsPlaying(true);
        } else {
            // Run algorithm
            if (!startNodeId || !nodes.find(n => n.id === startNodeId)) return alert('Invalid start node');
            let newFrames = [];
            if (algo === 'BFS') newFrames = runBFS(nodes, edges, startNodeId, directed);
            else if (algo === 'DFS') newFrames = runDFS(nodes, edges, startNodeId, directed);
            else if (algo === 'Dijkstra') newFrames = runDijkstra(nodes, edges, startNodeId, directed);
            
            setFrames(newFrames);
            setCurrentFrameIdx(0);
            setIsPlaying(true);
        }
    }, [frames, currentFrameIdx, algo, nodes, edges, startNodeId, directed]);

    const handlePause = useCallback(() => setIsPlaying(false), []);
    
    const handleReset = useCallback(() => {
        setIsPlaying(false);
        setFrames([]);
        setCurrentFrameIdx(0);
        if (timerRef.current) clearInterval(timerRef.current);
    }, []);

    // --- Interaction Handlers ---
    const getSvgCoords = (e) => {
        const CTM = svgRef.current.getScreenCTM();
        return {
            x: (e.clientX - CTM.e) / CTM.a,
            y: (e.clientY - CTM.f) / CTM.d
        };
    };

    const handleSvgPointerDown = (e) => {
        if (e.button !== 0) return; // Only left click
        const { x, y } = getSvgCoords(e);
        
        if (mode === 'add_node') {
            const id = prompt('Enter Node ID (e.g., E):');
            if (id && !nodes.find(n => n.id === id)) {
                setNodes(prev => [...prev, { id, x, y }]);
            }
        }
    };

    const handleSvgPointerMove = (e) => {
        const { x, y } = getSvgCoords(e);
        setMousePos({ x, y });
        if (dragNode) {
            setNodes(prev => prev.map(n => n.id === dragNode ? { ...n, x, y } : n));
        }
    };

    const handleSvgPointerUp = () => {
        setDragNode(null);
        if (mode === 'connect' && connectStartNode) {
            setConnectStartNode(null);
        }
    };

    const handleNodePointerDown = (e, nodeId) => {
        e.stopPropagation();
        if (mode === 'add_node' || mode === 'drag') {
            setDragNode(nodeId);
        } else if (mode === 'connect') {
            setConnectStartNode(nodeId);
        } else if (mode === 'delete') {
            setNodes(prev => prev.filter(n => n.id !== nodeId));
            setEdges(prev => prev.filter(edge => edge.source !== nodeId && edge.target !== nodeId));
        }
    };

    const handleNodePointerUp = (e, nodeId) => {
        e.stopPropagation();
        setDragNode(null);
        if (mode === 'connect' && connectStartNode && connectStartNode !== nodeId) {
            // Check if edge exists
            if (!edges.find(edge => edge.source === connectStartNode && edge.target === nodeId)) {
                const weight = prompt('Enter edge weight:', '1');
                if (weight !== null) {
                    setEdges(prev => [...prev, { source: connectStartNode, target: nodeId, weight: Number(weight) }]);
                }
            }
        }
        setConnectStartNode(null);
    };

    const handleEdgeClick = (e, edgeIdx) => {
        e.stopPropagation();
        if (mode === 'delete') {
            setEdges(prev => prev.filter((_, i) => i !== edgeIdx));
        }
    };

    const handleClearGraph = () => {
        handleReset();
        setNodes([]);
        setEdges([]);
    };

    const currentFrame = frames[currentFrameIdx] || { nodes, edges, activeNode: null, visitedNodes: [], msg: 'Ready.' };

    return (
        <div className="flex flex-col lg:flex-row gap-6 md:gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Sidebar Controls */}
            <aside className="w-full lg:w-80 border border-slate-300 bg-white p-4 md:p-6 rounded-none flex-shrink-0 self-start shadow-sm space-y-8">
                
                {/* Algorithm Selector */}
                <div>
                    <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-slate-400">Algorithm</label>
                    <select
                        value={algo}
                        onChange={e => {setAlgo(e.target.value); handleReset();}}
                        className="w-full border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-mono text-slate-800 outline-none focus:border-slate-900 rounded-none cursor-pointer"
                    >
                        <option value="BFS">Breadth-First Search (BFS)</option>
                        <option value="DFS">Depth-First Search (DFS)</option>
                        <option value="Dijkstra">Dijkstra's Algorithm</option>
                    </select>
                </div>

                {/* Graph Tools */}
                <div className="space-y-4">
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 border-b border-slate-100 pb-2">Canvas Tools</label>
                    <div className="grid grid-cols-2 gap-2">
                        <button 
                            onClick={() => setMode('add_node')}
                            className={`flex items-center justify-center gap-1.5 px-3 py-2 text-[10px] font-bold uppercase tracking-widest transition-colors rounded-none cursor-pointer border ${mode === 'add_node' ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'}`}
                        >
                            <Plus size={12} /> Add Node
                        </button>
                        <button 
                            onClick={() => setMode('connect')}
                            className={`flex items-center justify-center gap-1.5 px-3 py-2 text-[10px] font-bold uppercase tracking-widest transition-colors rounded-none cursor-pointer border ${mode === 'connect' ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'}`}
                        >
                            <GitCommit size={12} /> Connect
                        </button>
                        <button 
                            onClick={() => setMode('drag')}
                            className={`flex items-center justify-center gap-1.5 px-3 py-2 text-[10px] font-bold uppercase tracking-widest transition-colors rounded-none cursor-pointer border ${mode === 'drag' ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'}`}
                        >
                            <MousePointer2 size={12} /> Drag
                        </button>
                        <button 
                            onClick={() => setMode('delete')}
                            className={`flex items-center justify-center gap-1.5 px-3 py-2 text-[10px] font-bold uppercase tracking-widest transition-colors rounded-none cursor-pointer border ${mode === 'delete' ? 'bg-red-600 text-white border-red-600' : 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100'}`}
                        >
                            <Trash2 size={12} /> Delete
                        </button>
                    </div>
                    
                    <div className="flex items-center justify-between pt-2">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-600">Directed Graph</span>
                        <input type="checkbox" checked={directed} onChange={e => {setDirected(e.target.checked); handleReset();}} className="cursor-pointer" />
                    </div>
                </div>

                {/* Animation Config */}
                <div className="space-y-4">
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 border-b border-slate-100 pb-2">Animation Settings</label>
                    <div className="space-y-2">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-600">Start Node ID</span>
                        <input
                            type="text"
                            value={startNodeId}
                            onChange={e => setStartNodeId(e.target.value)}
                            placeholder="e.g. A"
                            className="w-full border border-slate-200 px-3 py-2 text-xs font-mono outline-none focus:border-slate-900 rounded-none bg-white uppercase"
                        />
                    </div>
                    <div className="space-y-2">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-600">Speed: {speed}ms</span>
                        <input
                            type="range"
                            min="100"
                            max="2000"
                            step="100"
                            value={speed}
                            onChange={e => setSpeed(Number(e.target.value))}
                            className="w-full cursor-pointer"
                        />
                    </div>
                </div>

                <div className="pt-4 border-t border-slate-100">
                    <button 
                        onClick={handleClearGraph}
                        className="w-full flex items-center justify-center gap-2 border border-slate-300 text-slate-700 px-3 py-2 text-[10px] font-bold uppercase tracking-widest hover:bg-slate-50 transition-colors rounded-none cursor-pointer"
                    >
                        <Trash2 size={12} /> Clear Graph
                    </button>
                </div>
            </aside>

            {/* Main Visualizer Area */}
            <section className="flex-1 space-y-6 min-w-0 flex flex-col">
                
                {/* Top Control Bar */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border border-slate-200 bg-white p-4 md:p-5 rounded-none shadow-sm">
                    <div className="flex items-center gap-2">
                        <Zap size={16} className="text-slate-900" />
                        <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-900">Algorithm Runtime</h2>
                    </div>
                    <div className="flex gap-2">
                        {!isPlaying ? (
                            <button onClick={handlePlay} className="inline-flex items-center gap-1.5 bg-slate-900 text-white px-4 py-2 text-[10px] font-bold uppercase tracking-widest hover:bg-slate-800 transition-all rounded-none cursor-pointer disabled:opacity-50">
                                <Play size={14} /> {frames.length > 0 && currentFrameIdx < frames.length - 1 ? 'Resume' : 'Start'}
                            </button>
                        ) : (
                            <button onClick={handlePause} className="inline-flex items-center gap-1.5 border border-slate-300 bg-white text-slate-900 px-4 py-2 text-[10px] font-bold uppercase tracking-widest hover:bg-slate-50 transition-all rounded-none cursor-pointer">
                                <Pause size={14} /> Pause
                            </button>
                        )}
                        <button onClick={handleReset} className="inline-flex items-center gap-1.5 border border-slate-300 bg-white text-slate-900 px-4 py-2 text-[10px] font-bold uppercase tracking-widest hover:bg-slate-50 transition-all rounded-none cursor-pointer">
                            <RotateCcw size={14} /> Reset
                        </button>
                    </div>
                </div>

                {/* Explanation Log */}
                <div className="bg-slate-900 text-slate-300 p-4 font-mono text-xs shadow-sm flex items-center gap-3">
                    <span className="text-emerald-400">➜</span>
                    <span className="animate-fade-slide-in" key={currentFrame.msg}>{currentFrame.msg}</span>
                </div>

                {/* SVG Canvas */}
                <div 
                    className="w-full h-[500px] bg-white border border-slate-200 shadow-sm relative overflow-hidden touch-none"
                >
                    <svg 
                        ref={svgRef}
                        width="100%" 
                        height="100%" 
                        className="absolute inset-0 cursor-crosshair"
                        onPointerDown={handleSvgPointerDown}
                        onPointerMove={handleSvgPointerMove}
                        onPointerUp={handleSvgPointerUp}
                        onPointerLeave={handleSvgPointerUp}
                    >
                        <defs>
                            <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="28" refY="3.5" orient="auto">
                                <polygon points="0 0, 10 3.5, 0 7" fill="#94a3b8" />
                            </marker>
                        </defs>
                        
                        {/* Edges */}
                        {currentFrame.edges.map((edge, i) => {
                            const sourceNode = currentFrame.nodes.find(n => n.id === edge.source);
                            const targetNode = currentFrame.nodes.find(n => n.id === edge.target);
                            if (!sourceNode || !targetNode) return null;
                            const isDrawing = mode === 'connect' && connectStartNode === edge.source && mousePos;
                            
                            return (
                                <g key={`edge-${i}`} onClick={(e) => handleEdgeClick(e, i)} className={mode==='delete'?'cursor-pointer hover:opacity-50':''}>
                                    <line 
                                        x1={sourceNode.x} y1={sourceNode.y} 
                                        x2={targetNode.x} y2={targetNode.y} 
                                        stroke="#cbd5e1" 
                                        strokeWidth="2" 
                                        markerEnd={directed ? "url(#arrowhead)" : ""}
                                    />
                                    <rect 
                                        x={(sourceNode.x + targetNode.x) / 2 - 10} 
                                        y={(sourceNode.y + targetNode.y) / 2 - 10} 
                                        width="20" height="20" fill="white" rx="3"
                                    />
                                    <text 
                                        x={(sourceNode.x + targetNode.x) / 2} 
                                        y={(sourceNode.y + targetNode.y) / 2} 
                                        textAnchor="middle" dy=".3em" fill="#64748b" className="font-mono text-[10px]"
                                    >
                                        {edge.weight}
                                    </text>
                                </g>
                            );
                        })}

                        {/* Drawing new edge */}
                        {mode === 'connect' && connectStartNode && (
                            <line 
                                x1={currentFrame.nodes.find(n => n.id === connectStartNode)?.x} 
                                y1={currentFrame.nodes.find(n => n.id === connectStartNode)?.y} 
                                x2={mousePos.x} 
                                y2={mousePos.y} 
                                stroke="#94a3b8" 
                                strokeWidth="2" 
                                strokeDasharray="4"
                            />
                        )}

                        {/* Nodes */}
                        {currentFrame.nodes.map((node) => {
                            const isActive = currentFrame.activeNode === node.id;
                            const isVisited = currentFrame.visitedNodes.includes(node.id);
                            
                            let fill = 'white';
                            let stroke = '#94a3b8';
                            if (isActive) {
                                fill = '#0f172a';
                                stroke = '#0f172a';
                            } else if (isVisited) {
                                fill = '#f8fafc';
                                stroke = '#10b981'; // emerald
                            }

                            return (
                                <g 
                                    key={node.id} 
                                    transform={`translate(${node.x}, ${node.y})`}
                                    onPointerDown={(e) => handleNodePointerDown(e, node.id)}
                                    onPointerUp={(e) => handleNodePointerUp(e, node.id)}
                                    className={`transition-all duration-300 ${mode==='delete'?'cursor-pointer hover:opacity-50':mode==='drag'?'cursor-move':mode==='connect'?'cursor-crosshair':''}`}
                                >
                                    <circle 
                                        r="18" 
                                        fill={fill} 
                                        stroke={stroke} 
                                        strokeWidth="2"
                                    />
                                    <text 
                                        textAnchor="middle" 
                                        dy=".3em" 
                                        fill={isActive ? 'white' : '#0f172a'} 
                                        className="font-mono text-xs font-bold pointer-events-none"
                                    >
                                        {node.id}
                                    </text>
                                </g>
                            );
                        })}
                    </svg>
                </div>

                {/* Data Tables */}
                {(algo === 'BFS' || algo === 'DFS') && (
                    <div className="bg-white border border-slate-200 shadow-sm p-4 space-y-4">
                        <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-900 border-b border-slate-100 pb-2">Traversal State</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Visited Nodes</span>
                                <div className="font-mono text-xs text-slate-900 break-all">{currentFrame.visitedNodes.join(' → ') || '-'}</div>
                            </div>
                            {currentFrame.q && (
                                <div className="space-y-1">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Queue (BFS)</span>
                                    <div className="font-mono text-xs text-slate-900 break-all">[{currentFrame.q.join(', ')}]</div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {algo === 'Dijkstra' && currentFrame.dist && (
                    <div className="bg-white border border-slate-200 shadow-sm p-4 space-y-4 overflow-x-auto">
                        <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-900 border-b border-slate-100 pb-2">Distance Table & Priority Queue</h3>
                        
                        <table className="w-full text-left border-collapse min-w-[500px]">
                            <thead>
                                <tr className="border-b border-slate-200 bg-slate-50">
                                    <th className="p-3 text-[10px] font-bold uppercase tracking-widest text-slate-500">Node</th>
                                    <th className="p-3 text-[10px] font-bold uppercase tracking-widest text-slate-500">Shortest Distance</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.entries(currentFrame.dist).map(([node, d]) => (
                                    <tr key={node} className="border-b border-slate-100 hover:bg-slate-50/50">
                                        <td className="p-3 font-mono text-xs font-bold text-slate-900">{node}</td>
                                        <td className="p-3 font-mono text-xs text-slate-700">{d === Infinity ? '∞' : d}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {currentFrame.pq && (
                            <div className="mt-4 pt-4 border-t border-slate-100">
                                <span className="block mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">Priority Queue</span>
                                <div className="flex flex-wrap gap-2">
                                    {currentFrame.pq.map((item, idx) => (
                                        <div key={idx} className="bg-slate-100 px-3 py-1 text-xs font-mono border border-slate-200">
                                            {item.id} (d:{item.d})
                                        </div>
                                    ))}
                                    {currentFrame.pq.length === 0 && <span className="text-xs font-mono text-slate-400">Empty</span>}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </section>
        </div>
    );
}
