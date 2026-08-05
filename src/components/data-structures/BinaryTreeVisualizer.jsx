import React, { useState, useRef, useMemo, useEffect, useCallback } from 'react';
import { Play, Pause, RotateCcw, X, GitBranch, Search, Plus, Trash2, Shuffle, ZoomIn, ZoomOut, Maximize, Target } from 'lucide-react';
import { getTreeStats, getTraversals, computeTreeLayout } from '../../algorithms/tree/TreeLogic';
import { useTreeAnimation } from '../../hooks/useTreeAnimation';

export default function BinaryTreeVisualizer() {
    const {
        treeType, setTreeType,
        frames, currentFrameIdx,
        isPlaying,
        inputValue, setInputValue,
        svgWidth, svgRef,
        handlePlay, handlePause, handleReset, handleClear,
        executeOperation, handleRandomTree,
        currentFrame,
        isBalancedMode, setIsBalancedMode
    } = useTreeAnimation();

    // Pan and Zoom State
    const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });
    const [isDragging, setIsDragging] = useState(false);
    const dragStart = useRef({ x: 0, y: 0 });

    // Memoized layout calculation
    const { nodes, edges, bounds } = useMemo(() => {
        return computeTreeLayout(currentFrame.tree, svgWidth, 400);
    }, [currentFrame.tree, svgWidth]);

    const stats = useMemo(() => getTreeStats(currentFrame.tree), [currentFrame.tree]);
    const traversals = useMemo(() => getTraversals(currentFrame.tree), [currentFrame.tree]);

    // Center the tree horizontally
    const handleCenter = useCallback(() => {
        if (!bounds || !svgWidth) return;
        const treeWidth = bounds.maxX - bounds.minX;
        const startX = (svgWidth - treeWidth) / 2 - bounds.minX;
        setTransform(prev => ({ ...prev, x: startX, y: 40 }));
    }, [bounds, svgWidth]);

    // Fit tree into the viewport
    const handleFit = useCallback(() => {
        if (!bounds || !svgWidth) return;
        const treeWidth = bounds.maxX - bounds.minX;
        const treeHeight = bounds.maxY - bounds.minY;
        if (treeWidth <= 0 || treeHeight <= 0) return handleCenter();
        
        const scaleX = (svgWidth - 40) / treeWidth;
        const scaleY = 360 / treeHeight;
        const newScale = Math.min(scaleX, scaleY, 1.2); // cap zoom
        
        const scaledWidth = treeWidth * newScale;
        const scaledHeight = treeHeight * newScale;
        
        const startX = (svgWidth - scaledWidth) / 2 - (bounds.minX * newScale);
        const startY = (400 - scaledHeight) / 2 - (bounds.minY * newScale) + 20;
        
        setTransform({ x: startX, y: startY, scale: newScale });
    }, [bounds, svgWidth, handleCenter]);

    // Native Wheel Event for semantic zoom
    useEffect(() => {
        const svgElement = svgRef.current;
        if (!svgElement) return;

        const handleWheel = (e) => {
            e.preventDefault();
            setTransform(prev => {
                const zoomSensitivity = 0.001;
                const delta = -e.deltaY * zoomSensitivity;
                let newScale = prev.scale * Math.exp(delta);
                newScale = Math.max(0.1, Math.min(newScale, 5)); // clamp between 0.1x and 5x

                const rect = svgElement.getBoundingClientRect();
                const cursorX = e.clientX - rect.left;
                const cursorY = e.clientY - rect.top;

                const ratio = newScale / prev.scale;
                const newX = cursorX - (cursorX - prev.x) * ratio;
                const newY = cursorY - (cursorY - prev.y) * ratio;

                return { x: newX, y: newY, scale: newScale };
            });
        };

        svgElement.addEventListener('wheel', handleWheel, { passive: false });
        return () => svgElement.removeEventListener('wheel', handleWheel);
    }, [svgRef]);

    // Auto-center on initial empty state or when reset
    useEffect(() => {
        if (transform.x === 0 && transform.y === 0 && transform.scale === 1 && bounds) {
            handleCenter();
        }
    }, [handleCenter, transform, bounds]);

    // Mouse handlers for Pan
    const onPointerDown = (e) => {
        setIsDragging(true);
        dragStart.current = { x: e.clientX - transform.x, y: e.clientY - transform.y };
        e.target.setPointerCapture(e.pointerId);
    };

    const onPointerMove = (e) => {
        if (!isDragging) return;
        setTransform(prev => ({
            ...prev,
            x: e.clientX - dragStart.current.x,
            y: e.clientY - dragStart.current.y
        }));
    };

    const onPointerUp = (e) => {
        setIsDragging(false);
        e.target.releasePointerCapture(e.pointerId);
    };

    const zoomIn = () => setTransform(p => ({ ...p, scale: Math.min(p.scale * 1.2, 5) }));
    const zoomOut = () => setTransform(p => ({ ...p, scale: Math.max(p.scale / 1.2, 0.1) }));

    return (
        <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
            {/* Sidebar Controls */}
            <aside className="w-full lg:w-80 border border-slate-300 bg-white p-4 md:p-6 rounded-none flex-shrink-0 self-start shadow-sm space-y-8">
                
                {/* Tree Type Selector */}
                <div className="space-y-3">
                    <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-slate-400">Tree Structure</label>
                    <select
                        value={treeType}
                        onChange={e => setTreeType(e.target.value)}
                        className="w-full border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-mono text-slate-800 outline-none focus:border-slate-900 rounded-none cursor-pointer"
                    >
                        <option value="BST">Binary Search Tree (BST)</option>
                        <option value="AVL">AVL Tree</option>
                    </select>

                    {treeType === 'BST' && (
                        <label className="flex items-center gap-2 cursor-pointer mt-2">
                            <input 
                                type="checkbox" 
                                checked={isBalancedMode}
                                onChange={(e) => setIsBalancedMode(e.target.checked)}
                                className="w-3 h-3 text-slate-900 rounded-none border-slate-300 focus:ring-slate-900"
                            />
                            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-600">Balanced Construction</span>
                        </label>
                    )}
                </div>

                {/* Operations */}
                <div className="space-y-4">
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 border-b border-slate-100 pb-2">Operations</label>
                    
                    <div className="flex gap-2">
                        <input
                            type="text"
                            placeholder="Value(s)"
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
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border border-slate-200 bg-white p-4 md:p-5 rounded-none shadow-sm overflow-hidden">
                    <div className="flex items-center gap-2 min-w-0 flex-shrink-0">
                        <GitBranch size={16} className="text-slate-900" />
                        <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-900 truncate">Visualizer Runtime</h2>
                    </div>
                    <div className="flex gap-2 flex-wrap sm:flex-nowrap overflow-x-auto pb-1 sm:pb-0 w-full sm:w-auto">
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
                        <div className="w-px h-6 bg-slate-200 mx-1 hidden sm:block self-center"></div>
                        <button onClick={zoomIn} title="Zoom In" className="inline-flex items-center justify-center gap-1.5 border border-slate-300 bg-white text-slate-900 px-3 py-2 hover:bg-slate-50 transition-all rounded-none cursor-pointer">
                            <ZoomIn size={14} />
                        </button>
                        <button onClick={zoomOut} title="Zoom Out" className="inline-flex items-center justify-center gap-1.5 border border-slate-300 bg-white text-slate-900 px-3 py-2 hover:bg-slate-50 transition-all rounded-none cursor-pointer">
                            <ZoomOut size={14} />
                        </button>
                        <button onClick={handleFit} title="Fit to Screen" className="inline-flex items-center justify-center gap-1.5 border border-slate-300 bg-white text-slate-900 px-3 py-2 hover:bg-slate-50 transition-all rounded-none cursor-pointer">
                            <Maximize size={14} />
                        </button>
                        <button onClick={handleCenter} title="Center Tree" className="inline-flex items-center justify-center gap-1.5 border border-slate-300 bg-white text-slate-900 px-3 py-2 hover:bg-slate-50 transition-all rounded-none cursor-pointer">
                            <Target size={14} />
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
                    ref={svgRef} 
                    className="w-full h-[400px] bg-white border border-slate-200 shadow-sm relative overflow-hidden flex items-center justify-center touch-none cursor-grab active:cursor-grabbing"
                    onPointerDown={onPointerDown}
                    onPointerMove={onPointerMove}
                    onPointerUp={onPointerUp}
                    onPointerLeave={onPointerUp}
                >
                    <svg width="100%" height="100%" className="absolute inset-0">
                        <g style={{ transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`, transformOrigin: '0 0' }} className={isDragging ? '' : 'transition-transform duration-100 ease-out'}>
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
                        </g>
                    </svg>
                    {nodes.length === 0 && (
                        <div className="text-slate-400 font-mono text-xs text-center pointer-events-none">
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
                                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Total Nodes</span>
                                <div className="font-mono text-xl text-slate-900">{stats.leaves + stats.internal}</div>
                            </div>
                            <div className="space-y-1">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Balanced</span>
                                <div className="font-mono text-xl text-slate-900">{stats.isBalanced ? 'Yes' : 'No'}</div>
                            </div>
                            <div className="space-y-1">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Time (Worst)</span>
                                <div className="font-mono text-xl text-slate-900">{stats.timeComplexityWorst || '-'}</div>
                            </div>
                        </div>
                        {treeType === 'BST' && !isBalancedMode && !stats.isBalanced && stats.height > 2 && (
                            <div className="text-[10px] text-slate-500 bg-slate-50 p-2 mt-2 border border-slate-100">
                                <strong>Note:</strong> Standard insertion creates an unbalanced BST with O(n) worst-case time complexity. Use AVL or Balanced Mode to optimize.
                            </div>
                        )}
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
