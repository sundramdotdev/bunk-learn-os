import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, RotateCcw, X, GitBranch, Search, Plus, Trash2, Shuffle } from 'lucide-react';
import { BST, AVLTree, getTreeStats, getTraversals, computeTreeLayout } from '../../utils/TreeLogic';

export default function BinaryTreeVisualizer() {
    const [treeType, setTreeType] = useState('BST');
    const [treeInstance, setTreeInstance] = useState(new BST());
    const [frames, setFrames] = useState([]);
    const [currentFrameIdx, setCurrentFrameIdx] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [inputValue, setInputValue] = useState('');
    
    // UI State
    const [svgWidth, setSvgWidth] = useState(800);
    const svgRef = useRef(null);
    const timerRef = useRef(null);

    // Initial resize observer for SVG
    useEffect(() => {
        if (svgRef.current) {
            const resizeObserver = new ResizeObserver(entries => {
                for (let entry of entries) {
                    setSvgWidth(entry.contentRect.width);
                }
            });
            resizeObserver.observe(svgRef.current);
            return () => resizeObserver.disconnect();
        }
    }, []);

    // Change tree type
    useEffect(() => {
        handleReset();
        if (treeType === 'BST') setTreeInstance(new BST());
        else if (treeType === 'AVL') setTreeInstance(new AVLTree());
        // RBT and Heap can be added here later
    }, [treeType]);

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
            }, 800); // 800ms per frame
        } else {
            clearInterval(timerRef.current);
        }
        return () => clearInterval(timerRef.current);
    }, [isPlaying, frames.length]);

    const handlePlay = useCallback(() => {
        if (frames.length > 0 && currentFrameIdx < frames.length - 1) setIsPlaying(true);
    }, [frames, currentFrameIdx]);

    const handlePause = useCallback(() => setIsPlaying(false), []);
    
    const handleReset = useCallback(() => {
        setIsPlaying(false);
        setCurrentFrameIdx(frames.length > 0 ? frames.length - 1 : 0);
        if (timerRef.current) clearInterval(timerRef.current);
    }, [frames]);

    const handleClear = () => {
        handleReset();
        if (treeType === 'BST') setTreeInstance(new BST());
        else if (treeType === 'AVL') setTreeInstance(new AVLTree());
        setFrames([]);
        setCurrentFrameIdx(0);
    };

    // Tree Operations
    const executeOperation = (operation, value) => {
        handleReset();
        const numVal = parseInt(value, 10);
        if (isNaN(numVal)) return;

        let newFrames = [];
        if (operation === 'insert') newFrames = treeInstance.insert(numVal);
        else if (operation === 'delete') newFrames = treeInstance.remove(numVal);
        else if (operation === 'search') newFrames = treeInstance.search(numVal);

        if (newFrames && newFrames.length > 0) {
            setFrames(newFrames);
            setCurrentFrameIdx(0);
            setIsPlaying(true);
        }
        setInputValue('');
    };

    const handleRandomTree = () => {
        handleClear();
        const tempTree = treeType === 'BST' ? new BST() : new AVLTree();
        const vals = Array.from({length: 7}, () => Math.floor(Math.random() * 100));
        vals.forEach(v => tempTree.insert(v));
        setTreeInstance(tempTree);
        setFrames([{ tree: tempTree.root, highlight: [], msg: 'Generated random tree.' }]);
        setCurrentFrameIdx(0);
    };

    // Current State to Render
    const currentFrame = frames[currentFrameIdx] || { tree: treeInstance.root, highlight: [], msg: 'Ready.' };
    const { nodes, edges } = computeTreeLayout(currentFrame.tree, svgWidth, 400);
    const stats = getTreeStats(currentFrame.tree);
    const traversals = getTraversals(currentFrame.tree);

    return (
        <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
            {/* Sidebar Controls */}
            <aside className="w-full lg:w-80 border border-slate-300 bg-white p-4 md:p-6 rounded-none flex-shrink-0 self-start shadow-sm space-y-8">
                
                {/* Tree Type Selector */}
                <div>
                    <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-slate-400">Tree Structure</label>
                    <select
                        value={treeType}
                        onChange={e => setTreeType(e.target.value)}
                        className="w-full border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-mono text-slate-800 outline-none focus:border-slate-900 rounded-none cursor-pointer"
                    >
                        <option value="BST">Binary Search Tree (BST)</option>
                        <option value="AVL">AVL Tree</option>
                    </select>
                </div>

                {/* Operations */}
                <div className="space-y-4">
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 border-b border-slate-100 pb-2">Operations</label>
                    
                    <div className="flex gap-2">
                        <input
                            type="number"
                            placeholder="Value"
                            value={inputValue}
                            onChange={e => setInputValue(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter') executeOperation('insert', inputValue); }}
                            className="flex-1 w-full border border-slate-200 px-3 py-2 text-xs font-mono outline-none focus:border-slate-900 rounded-none bg-white"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <button 
                            onClick={() => executeOperation('insert', inputValue)}
                            className="flex items-center justify-center gap-1.5 bg-slate-900 text-white px-3 py-2 text-[10px] font-bold uppercase tracking-widest hover:bg-slate-800 transition-colors rounded-none cursor-pointer"
                        >
                            <Plus size={12} /> Insert
                        </button>
                        <button 
                            onClick={() => executeOperation('search', inputValue)}
                            className="flex items-center justify-center gap-1.5 border border-slate-300 text-slate-700 px-3 py-2 text-[10px] font-bold uppercase tracking-widest hover:bg-slate-50 transition-colors rounded-none cursor-pointer"
                        >
                            <Search size={12} /> Search
                        </button>
                        <button 
                            onClick={() => executeOperation('delete', inputValue)}
                            className="flex items-center justify-center gap-1.5 border border-red-200 text-red-600 bg-red-50 hover:bg-red-100 px-3 py-2 text-[10px] font-bold uppercase tracking-widest transition-colors rounded-none cursor-pointer col-span-2"
                        >
                            <Trash2 size={12} /> Delete
                        </button>
                    </div>
                </div>

                {/* Bulk Actions */}
                <div className="space-y-2 pt-4 border-t border-slate-100">
                    <button 
                        onClick={handleRandomTree}
                        className="w-full flex items-center justify-center gap-2 border border-slate-300 text-slate-700 px-3 py-2 text-[10px] font-bold uppercase tracking-widest hover:bg-slate-50 transition-colors rounded-none cursor-pointer"
                    >
                        <Shuffle size={12} /> Random Tree
                    </button>
                    <button 
                        onClick={handleClear}
                        className="w-full flex items-center justify-center gap-2 border border-slate-300 text-slate-700 px-3 py-2 text-[10px] font-bold uppercase tracking-widest hover:bg-slate-50 transition-colors rounded-none cursor-pointer"
                    >
                        <X size={12} /> Clear Tree
                    </button>
                </div>
            </aside>

            {/* Main Visualizer Area */}
            <section className="flex-1 space-y-6 min-w-0 flex flex-col">
                
                {/* Top Control Bar */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border border-slate-200 bg-white p-4 md:p-5 rounded-none shadow-sm">
                    <div className="flex items-center gap-2">
                        <GitBranch size={16} className="text-slate-900" />
                        <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-900">Visualizer Runtime</h2>
                    </div>
                    <div className="flex gap-2">
                        {!isPlaying ? (
                            <button onClick={handlePlay} disabled={frames.length === 0 || currentFrameIdx === frames.length - 1} className="inline-flex items-center gap-1.5 bg-slate-900 text-white px-4 py-2 text-[10px] font-bold uppercase tracking-widest hover:bg-slate-800 transition-all rounded-none cursor-pointer disabled:opacity-50">
                                <Play size={14} /> Play
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
                <div ref={svgRef} className="w-full h-[400px] bg-white border border-slate-200 shadow-sm relative overflow-hidden flex items-center justify-center touch-none">
                    <svg width="100%" height="100%" className="absolute inset-0">
                        {/* Edges */}
                        {edges.map((edge, i) => (
                            <line 
                                key={`edge-${i}`} 
                                x1={edge.x1} y1={edge.y1} 
                                x2={edge.x2} y2={edge.y2} 
                                stroke="#cbd5e1" 
                                strokeWidth="2" 
                                className="transition-all duration-500 ease-in-out"
                            />
                        ))}
                        {/* Nodes */}
                        {nodes.map((node) => {
                            const isHighlighted = currentFrame.highlight.includes(node.id);
                            return (
                                <g key={node.id} className="transition-all duration-500 ease-in-out" transform={`translate(${node.x}, ${node.y})`}>
                                    <circle 
                                        r="18" 
                                        fill={isHighlighted ? '#0f172a' : 'white'} 
                                        stroke={isHighlighted ? '#0f172a' : '#94a3b8'} 
                                        strokeWidth="2"
                                        className="transition-colors duration-300"
                                    />
                                    <text 
                                        textAnchor="middle" 
                                        dy=".3em" 
                                        fill={isHighlighted ? 'white' : '#0f172a'} 
                                        className="font-mono text-xs font-bold pointer-events-none transition-colors duration-300"
                                    >
                                        {node.value}
                                    </text>
                                    {/* Optional Height/Balance indicator for AVL */}
                                    {treeType === 'AVL' && (
                                        <text x="22" y="-10" fill="#64748b" className="font-mono text-[9px]">
                                            h:{node.height}
                                        </text>
                                    )}
                                </g>
                            );
                        })}
                    </svg>
                    {nodes.length === 0 && (
                        <div className="text-slate-400 font-mono text-xs text-center">
                            Tree is empty. Insert a node to begin.
                        </div>
                    )}
                </div>

                {/* Stats & Traversals */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Stats Table */}
                    <div className="bg-white border border-slate-200 shadow-sm p-4 space-y-4">
                        <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-900 border-b border-slate-100 pb-2">Tree Statistics</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Height</span>
                                <div className="font-mono text-xl text-slate-900">{stats.height}</div>
                            </div>
                            <div className="space-y-1">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Leaf Nodes</span>
                                <div className="font-mono text-xl text-slate-900">{stats.leaves}</div>
                            </div>
                            <div className="space-y-1">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Internal Nodes</span>
                                <div className="font-mono text-xl text-slate-900">{stats.internal}</div>
                            </div>
                            <div className="space-y-1">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Total Nodes</span>
                                <div className="font-mono text-xl text-slate-900">{stats.leaves + stats.internal}</div>
                            </div>
                        </div>
                    </div>

                    {/* Traversals Table */}
                    <div className="bg-white border border-slate-200 shadow-sm p-4 space-y-4">
                        <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-900 border-b border-slate-100 pb-2">Traversals</h3>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <span className="w-20 text-[10px] font-bold uppercase tracking-widest text-slate-400">Preorder</span>
                                <span className="flex-1 font-mono text-xs text-slate-800 break-all">{traversals.pre.join(', ') || '-'}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="w-20 text-[10px] font-bold uppercase tracking-widest text-slate-400">Inorder</span>
                                <span className="flex-1 font-mono text-xs text-slate-800 break-all">{traversals.inOrder.join(', ') || '-'}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="w-20 text-[10px] font-bold uppercase tracking-widest text-slate-400">Postorder</span>
                                <span className="flex-1 font-mono text-xs text-slate-800 break-all">{traversals.post.join(', ') || '-'}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="w-20 text-[10px] font-bold uppercase tracking-widest text-slate-400">Level Order</span>
                                <span className="flex-1 font-mono text-xs text-slate-800 break-all">{traversals.level.join(', ') || '-'}</span>
                            </div>
                        </div>
                    </div>
                </div>

            </section>
        </div>
    );
}
