import React, { useState, useMemo } from 'react';
import * as math from 'mathjs';

export default function CalculusVisualizer() {
    const [fnString, setFnString] = useState('x^2');
    const [xVal, setXVal] = useState(2);
    const [showArea, setShowArea] = useState(false);
    const [aVal, setAVal] = useState(0);
    const [bVal, setBVal] = useState(4);
    const [nVal, setNVal] = useState(10);
    const [fnError, setFnError] = useState(null);

    const { compiledFn, derivedFn } = useMemo(() => {
        try {
            const compiled = math.compile(fnString);
            const derived = math.derivative(fnString, 'x');
            // Test evaluation
            compiled.evaluate({ x: 0 });
            setFnError(null);
            return { compiledFn: compiled, derivedFn: derived };
        } catch (err) {
            setFnError("Invalid function. E.g., use 'x^2 + 2*x'");
            return { compiledFn: null, derivedFn: null };
        }
    }, [fnString]);

    // Fallback to x^2 if error to not break the UI
    const safeF = (x) => {
        try {
            return compiledFn ? compiledFn.evaluate({ x }) : x * x;
        } catch { return 0; }
    };
    
    const safeDf = (x) => {
        try {
            return derivedFn ? derivedFn.evaluate({ x }) : 2 * x;
        } catch { return 0; }
    };

    const width = 500;
    const height = 400;

    const xMin = -10, xMax = 10;
    
    // Auto-scale Y based on current function
    let tempPoints = [];
    for (let i = xMin; i <= xMax; i += 0.5) {
        tempPoints.push(safeF(i));
    }
    tempPoints = tempPoints.filter(n => !isNaN(n) && isFinite(n));
    let yMin = tempPoints.length > 0 ? Math.min(...tempPoints) : -20;
    let yMax = tempPoints.length > 0 ? Math.max(...tempPoints) : 100;

    // Provide padding and sensible minimums
    if (yMin > -10) yMin = -10;
    if (yMax < 10) yMax = 10;
    const yPadding = (yMax - yMin) * 0.1;
    yMin -= yPadding;
    yMax += yPadding;

    const scaleX = width / (xMax - xMin);
    const scaleY = height / (yMax - yMin);

    const cx = (x) => (x - xMin) * scaleX;
    const cy = (y) => height - (y - yMin) * scaleY;

    // Generate Path for the function
    const pathPoints = [];
    for (let i = xMin; i <= xMax; i += 0.1) {
        const y = safeF(i);
        if (!isNaN(y) && isFinite(y)) {
            pathPoints.push(`${cx(i)},${cy(y)}`);
        }
    }
    const pathD = `M ${pathPoints.join(' L ')}`;

    // Tangent Line points
    const a = parseFloat(xVal);
    const tangentLength = 4;
    const tX1 = a - tangentLength;
    const tY1 = safeDf(a) * (tX1 - a) + safeF(a);
    const tX2 = a + tangentLength;
    const tY2 = safeDf(a) * (tX2 - a) + safeF(a);

    // Riemann Sum Rectangles
    const rects = [];
    if (showArea) {
        const start = parseFloat(aVal);
        const end = parseFloat(bVal);
        const n = parseInt(nVal);
        if (n > 0 && start < end) {
            const dx = (end - start) / n;
            for (let i = 0; i < n; i++) {
                const x = start + i * dx;
                const y = safeF(x);
                if (isNaN(y) || !isFinite(y)) continue;
                
                const rectY = y >= 0 ? cy(y) : cy(0);
                const rectH = Math.abs(cy(y) - cy(0));
                rects.push(
                    <rect 
                        key={i} 
                        x={cx(x)} 
                        y={rectY} 
                        width={dx * scaleX} 
                        height={rectH} 
                        fill="rgba(59, 130, 246, 0.3)" 
                        stroke="rgba(59, 130, 246, 0.5)" 
                        strokeWidth="1"
                    />
                );
            }
        }
    }

    return (
        <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
            <aside className="w-full lg:w-80 border border-slate-300 bg-white p-4 md:p-6 flex-shrink-0 self-start shadow-sm space-y-6">
                
                <div>
                    <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-slate-400">Function f(x)</label>
                    <input
                        type="text"
                        value={fnString}
                        onChange={e => setFnString(e.target.value)}
                        className={`w-full border px-3 py-2 text-xs font-mono outline-none bg-white ${fnError ? 'border-red-400 text-red-500' : 'border-slate-200 text-slate-900 focus:border-slate-900'}`}
                        placeholder="e.g., x^2 + 2*x"
                    />
                    {fnError && <p className="mt-1 text-[9px] font-mono text-red-500">{fnError}</p>}
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between">
                        <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-900">Current x (Derivative)</h3>
                        <span className="font-mono text-xs font-bold text-slate-500">{xVal}</span>
                    </div>
                    <input 
                        type="range" min="-10" max="10" step="0.1" 
                        value={xVal} onChange={e => setXVal(e.target.value)}
                        className="w-full accent-slate-900 cursor-pointer"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-slate-50 border border-slate-200">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">f({xVal})</p>
                        <p className="font-mono text-sm font-bold text-slate-900">{safeF(a).toFixed(2)}</p>
                    </div>
                    <div className="p-3 bg-slate-50 border border-slate-200">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">f'({xVal}) Slope</p>
                        <p className="font-mono text-sm font-bold text-red-500">{safeDf(a).toFixed(2)}</p>
                    </div>
                </div>

                <div className="border-t border-slate-100 pt-4 space-y-4">
                    <div className="flex items-center gap-3">
                        <input 
                            type="checkbox" id="showArea" 
                            checked={showArea} onChange={e => setShowArea(e.target.checked)}
                            className="accent-slate-900 cursor-pointer w-4 h-4"
                        />
                        <label htmlFor="showArea" className="text-[10px] font-bold uppercase tracking-widest text-slate-900 cursor-pointer">
                            Show Area (Riemann Sum)
                        </label>
                    </div>

                    {showArea && (
                        <div className="space-y-3 bg-slate-50 border border-slate-200 p-3">
                            <div className="flex gap-2">
                                <div className="flex-1">
                                    <label className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Start (a)</label>
                                    <input type="number" value={aVal} onChange={e => setAVal(e.target.value)} className="w-full border border-slate-200 px-2 py-1 text-xs font-mono outline-none focus:border-slate-900" />
                                </div>
                                <div className="flex-1">
                                    <label className="text-[9px] font-bold uppercase tracking-widest text-slate-400">End (b)</label>
                                    <input type="number" value={bVal} onChange={e => setBVal(e.target.value)} className="w-full border border-slate-200 px-2 py-1 text-xs font-mono outline-none focus:border-slate-900" />
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between">
                                    <label className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Intervals (n)</label>
                                    <span className="font-mono text-xs font-bold text-slate-500">{nVal}</span>
                                </div>
                                <input 
                                    type="range" min="1" max="100" step="1" 
                                    value={nVal} onChange={e => setNVal(e.target.value)}
                                    className="w-full accent-slate-900 cursor-pointer mt-1"
                                />
                            </div>
                        </div>
                    )}
                </div>
            </aside>

            <section className="flex-1 w-full overflow-x-auto scrollbar-thin shadow-sm min-w-0 bg-white border border-slate-200 flex items-center justify-center p-4">
                <svg width={width} height={height} className="bg-slate-50 border border-slate-200">
                    {/* Y-Axis Grid Lines */}
                    {Array.from({ length: 21 }).map((_, i) => (
                        <line key={`v-${i}`} x1={cx(i - 10)} y1={0} x2={cx(i - 10)} y2={height} stroke="#e2e8f0" strokeWidth="1" />
                    ))}
                    
                    {/* Axes */}
                    <line x1={0} y1={cy(0)} x2={width} y2={cy(0)} stroke="#94a3b8" strokeWidth="2" />
                    <line x1={cx(0)} y1={0} x2={cx(0)} y2={height} stroke="#94a3b8" strokeWidth="2" />

                    {/* Riemann Rectangles */}
                    {showArea && rects}

                    {/* Function Curve */}
                    <path d={pathD} fill="none" stroke="#0f172a" strokeWidth="2" />

                    {/* Tangent Line */}
                    {!fnError && (
                        <>
                            <line x1={cx(tX1)} y1={cy(tY1)} x2={cx(tX2)} y2={cy(tY2)} stroke="#ef4444" strokeWidth="2" />
                            <circle cx={cx(a)} cy={cy(safeF(a))} r="4" fill="#ef4444" />
                        </>
                    )}
                </svg>
            </section>
        </div>
    );
}
