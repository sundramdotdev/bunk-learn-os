import React, { useState, useEffect } from 'react';

export default function LinearAlgebraVisualizer() {
    const [rows, setRows] = useState(2);
    const [cols, setCols] = useState(2);
    
    // Matrix state: rows x cols
    const [matrix, setMatrix] = useState([[1, 0], [0, 1]]);
    // Vector state: cols x 1
    const [vector, setVector] = useState([2, 1]);
    
    // Result
    const [result, setResult] = useState([]);

    // Update arrays when dimensions change
    useEffect(() => {
        const r = Math.max(1, Math.min(5, rows));
        const c = Math.max(1, Math.min(5, cols));
        
        setMatrix(prev => {
            const newMat = Array(r).fill(0).map(() => Array(c).fill(0));
            for(let i=0; i<Math.min(r, prev.length); i++) {
                for(let j=0; j<Math.min(c, prev[i].length); j++) {
                    newMat[i][j] = prev[i][j];
                }
            }
            return newMat;
        });

        setVector(prev => {
            const newVec = Array(c).fill(0);
            for(let i=0; i<Math.min(c, prev.length); i++) {
                newVec[i] = prev[i];
            }
            return newVec;
        });
        
    }, [rows, cols]);

    const handleMatrixChange = (r, c, val) => {
        const num = parseFloat(val);
        const newMat = [...matrix];
        newMat[r][c] = isNaN(num) ? 0 : num;
        setMatrix(newMat);
    };

    const handleVectorChange = (idx, val) => {
        const num = parseFloat(val);
        const newVec = [...vector];
        newVec[idx] = isNaN(num) ? 0 : num;
        setVector(newVec);
    };

    const calculate = () => {
        const res = Array(rows).fill(0);
        for(let i=0; i<rows; i++) {
            let sum = 0;
            for(let j=0; j<cols; j++) {
                sum += matrix[i][j] * vector[j];
            }
            res[i] = sum;
        }
        setResult(res);
    };

    const width = 400;
    const height = 400;
    const scale = 20; // 20px = 1 unit
    const centerX = width / 2;
    const centerY = height / 2;

    const cx = (x) => centerX + x * scale;
    const cy = (y) => centerY - y * scale;

    // Isometric projection for 3D
    const isoX = (x, y) => centerX + (x - y) * Math.cos(Math.PI / 6) * scale;
    const isoY = (x, y, z) => centerY + (x + y) * Math.sin(Math.PI / 6) * scale - z * scale;

    const drawArrow2D = (x1, y1, x2, y2, color, label) => {
        const dx = x2 - x1;
        const dy = y2 - y1;
        const angle = Math.atan2(dy, dx);
        const len = Math.sqrt(dx * dx + dy * dy);
        if (len === 0) return null;
        
        const headLen = 10;
        const arrowX1 = x2 - headLen * Math.cos(angle - Math.PI / 6);
        const arrowY1 = y2 - headLen * Math.sin(angle - Math.PI / 6);
        const arrowX2 = x2 - headLen * Math.cos(angle + Math.PI / 6);
        const arrowY2 = y2 - headLen * Math.sin(angle + Math.PI / 6);

        return (
            <g key={label + x2 + y2}>
                <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth="2" />
                <polygon points={`${x2},${y2} ${arrowX1},${arrowY1} ${arrowX2},${arrowY2}`} fill={color} />
                <text x={x2 + 5} y={y2 - 5} fill={color} fontSize="12" className="font-mono font-bold">{label}</text>
            </g>
        );
    };

    return (
        <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
            <aside className="w-full lg:w-80 border border-slate-300 bg-white p-4 md:p-6 flex-shrink-0 self-start shadow-sm">
                
                <div className="flex gap-4 mb-6">
                    <div className="flex-1">
                        <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-slate-400">Rows (n)</label>
                        <input type="number" min="1" max="5" value={rows} onChange={e => setRows(parseInt(e.target.value) || 1)} className="w-full border border-slate-200 px-3 py-2 text-xs font-mono outline-none focus:border-slate-900 bg-slate-50" />
                    </div>
                    <div className="flex-1">
                        <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-slate-400">Cols (m)</label>
                        <input type="number" min="1" max="5" value={cols} onChange={e => setCols(parseInt(e.target.value) || 1)} className="w-full border border-slate-200 px-3 py-2 text-xs font-mono outline-none focus:border-slate-900 bg-slate-50" />
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="space-y-2">
                        <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-900 border-b border-slate-100 pb-2">Matrix {rows}x{cols}</h3>
                        <div className="overflow-x-auto w-full scrollbar-thin pb-2">
                            <div 
                                className="grid gap-1" 
                                style={{ gridTemplateColumns: `repeat(${cols}, minmax(40px, 1fr))` }}
                            >
                                {matrix.map((row, r) => 
                                    row.map((val, c) => (
                                        <input 
                                            key={`${r}-${c}`}
                                            type="number" 
                                            value={val} 
                                            onChange={e => handleMatrixChange(r, c, e.target.value)} 
                                            className="border border-slate-200 px-1 py-2 text-xs font-mono outline-none focus:border-slate-900 bg-white text-center w-full" 
                                        />
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-900 border-b border-slate-100 pb-2">Target Vector ({cols}D)</h3>
                        <div className="flex flex-col gap-1">
                            {vector.map((val, idx) => (
                                <div key={`v-${idx}`} className="flex items-center gap-2">
                                    <span className="text-[10px] font-mono text-slate-400 w-4">v{idx+1}</span>
                                    <input 
                                        type="number" 
                                        value={val} 
                                        onChange={e => handleVectorChange(idx, e.target.value)} 
                                        className="w-full border border-slate-200 px-3 py-2 text-xs font-mono outline-none focus:border-slate-900 bg-white" 
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    <button 
                        onClick={calculate}
                        className="w-full bg-slate-900 text-white px-4 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                        Transform
                    </button>

                    {result.length > 0 && (
                        <div className="mt-4 p-3 bg-slate-50 border border-slate-200">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Transformed Vector ({rows}D)</p>
                            <div className="flex flex-col gap-1">
                                {result.map((val, idx) => (
                                    <span key={`r-${idx}`} className="font-mono text-sm font-bold text-orange-500">
                                        {val.toFixed(2)}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </aside>

            <section className="flex-1 w-full overflow-x-auto scrollbar-thin shadow-sm min-w-0 bg-white border border-slate-200 flex items-center justify-center p-4 relative">
                
                {rows > 3 && (
                    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center p-8 text-center border border-slate-200">
                        <p className="text-sm font-bold text-slate-900 mb-2">N-Dimensional Visualization Unsupported</p>
                        <p className="text-xs text-slate-500 max-w-sm">
                            Cannot draw vectors beyond 3 dimensions on a visual canvas. Please refer to the calculated output in the sidebar.
                        </p>
                    </div>
                )}

                <svg width={width} height={height} className="bg-slate-50 border border-slate-200">
                    {rows <= 2 && (
                        <>
                            {/* 2D Grid Lines */}
                            {Array.from({ length: width / scale + 1 }).map((_, i) => (
                                <line key={`v-${i}`} x1={i * scale} y1={0} x2={i * scale} y2={height} stroke="#e2e8f0" strokeWidth="1" />
                            ))}
                            {Array.from({ length: height / scale + 1 }).map((_, i) => (
                                <line key={`h-${i}`} x1={0} y1={i * scale} x2={width} y2={i * scale} stroke="#e2e8f0" strokeWidth="1" />
                            ))}
                            
                            {/* 2D Axes */}
                            <line x1={0} y1={centerY} x2={width} y2={centerY} stroke="#94a3b8" strokeWidth="2" />
                            <line x1={centerX} y1={0} x2={centerX} y2={height} stroke="#94a3b8" strokeWidth="2" />

                            {/* Vectors */}
                            {vector.length <= 2 && drawArrow2D(cx(0), cy(0), cx(vector[0] || 0), cy(vector[1] || 0), '#22c55e', 'v')}
                            {result.length === 1 && drawArrow2D(cx(0), cy(0), cx(result[0] || 0), cy(0), '#f97316', 'Mv')}
                            {result.length === 2 && drawArrow2D(cx(0), cy(0), cx(result[0] || 0), cy(result[1] || 0), '#f97316', 'Mv')}
                        </>
                    )}

                    {rows === 3 && (
                        <>
                            {/* 3D Isometric Axes */}
                            <line x1={centerX} y1={centerY} x2={isoX(10, 0)} y2={isoY(10, 0, 0)} stroke="#fca5a5" strokeWidth="2" strokeDasharray="4" />
                            <line x1={centerX} y1={centerY} x2={isoX(0, 10)} y2={isoY(0, 10, 0)} stroke="#93c5fd" strokeWidth="2" strokeDasharray="4" />
                            <line x1={centerX} y1={centerY} x2={centerX} y2={isoY(0, 0, 10)} stroke="#86efac" strokeWidth="2" strokeDasharray="4" />
                            
                            <text x={isoX(11, 0)} y={isoY(11, 0, 0)} fill="#fca5a5" fontSize="10" className="font-mono">X</text>
                            <text x={isoX(0, 11)} y={isoY(0, 11, 0)} fill="#93c5fd" fontSize="10" className="font-mono">Y</text>
                            <text x={centerX} y={isoY(0, 0, 11)} fill="#86efac" fontSize="10" className="font-mono">Z</text>

                            {/* Transformed Vector 3D */}
                            {result.length === 3 && drawArrow2D(
                                centerX, centerY, 
                                isoX(result[0], result[1]), isoY(result[0], result[1], result[2]), 
                                '#f97316', 'Mv'
                            )}

                            {/* Original Vector 3D */}
                            {vector.length === 3 && drawArrow2D(
                                centerX, centerY, 
                                isoX(vector[0], vector[1]), isoY(vector[0], vector[1], vector[2]), 
                                '#22c55e', 'v'
                            )}
                        </>
                    )}
                </svg>
            </section>
        </div>
    );
}
