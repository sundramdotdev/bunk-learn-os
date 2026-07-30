import React from 'react';
import { useCalculus } from '../../../hooks/useCalculus';

export default function CalculusVisualizer() {
    const {
        fnString, xVal, showArea, aVal, bVal, nVal,
        setFnString, setXVal, setShowArea, setAVal, setBVal, setNVal,
        isValid, error, isEmpty,
        width, height, cx, cy,
        pathD, scaleX, scaleY,
        riemannRects,
        tangentData
    } = useCalculus('x^2');

    return (
        <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
            <aside className="w-full lg:w-80 border border-slate-300 bg-white p-4 md:p-6 flex-shrink-0 self-start shadow-sm space-y-6">
                
                <div>
                    <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-slate-400">Function f(x)</label>
                    <input
                        type="text"
                        value={fnString}
                        onChange={e => setFnString(e.target.value)}
                        className={`w-full border px-3 py-2 text-xs font-mono outline-none bg-white ${error ? 'border-red-400 text-red-500' : 'border-slate-200 text-slate-900 focus:border-slate-900'}`}
                        placeholder="e.g., x^2 + 2*x"
                    />
                    {error && <p className="mt-1 text-[9px] font-mono text-red-500">{error}</p>}
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between">
                        <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-900">Current x (Derivative)</h3>
                        <span className="font-mono text-xs font-bold text-slate-500">{xVal}</span>
                    </div>
                    <input 
                        type="range" min="-10" max="10" step="0.1" 
                        value={xVal} onChange={e => setXVal(e.target.value)}
                        disabled={!isValid}
                        className="w-full accent-slate-900 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-slate-50 border border-slate-200">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">f({xVal})</p>
                        <p className="font-mono text-sm font-bold text-slate-900">
                            {isValid && tangentData ? tangentData.f_a.toFixed(2) : '-'}
                        </p>
                    </div>
                    <div className="p-3 bg-slate-50 border border-slate-200">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">f'({xVal}) Slope</p>
                        <p className="font-mono text-sm font-bold text-red-500">
                            {isValid && tangentData ? tangentData.df.toFixed(2) : '-'}
                        </p>
                    </div>
                </div>

                <div className="border-t border-slate-100 pt-4 space-y-4">
                    <div className="flex items-center gap-3">
                        <input 
                            type="checkbox" id="showArea" 
                            checked={showArea} onChange={e => setShowArea(e.target.checked)}
                            disabled={!isValid}
                            className="accent-slate-900 cursor-pointer w-4 h-4 disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                        <label htmlFor="showArea" className={`text-[10px] font-bold uppercase tracking-widest ${isValid ? 'text-slate-900 cursor-pointer' : 'text-slate-400 cursor-not-allowed'}`}>
                            Show Area (Riemann Sum)
                        </label>
                    </div>

                    {showArea && isValid && (
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
                {isEmpty || !isValid ? (
                    <div className="flex flex-col items-center justify-center h-full text-center p-6 border border-dashed border-slate-300 w-full max-w-md mx-auto my-12">
                        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                            <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                            </svg>
                        </div>
                        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-2">No function entered</h3>
                        <p className="text-xs text-slate-500 mb-6">Enter a valid mathematical expression to see the visualization.</p>
                        
                        <div className="w-full text-left bg-slate-50 p-4 border border-slate-200">
                            <h4 className="text-[10px] font-bold text-slate-900 uppercase tracking-widest mb-3">Examples:</h4>
                            <ul className="space-y-2 font-mono text-xs text-slate-600">
                                <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-slate-300"></span> x^2</li>
                                <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-slate-300"></span> sin(x)</li>
                                <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-slate-300"></span> x^3 + 2*x</li>
                            </ul>
                        </div>
                    </div>
                ) : (
                    <svg width={width} height={height} className="bg-slate-50 border border-slate-200">
                        {/* Y-Axis Grid Lines */}
                        {Array.from({ length: 21 }).map((_, i) => (
                            <line key={`v-${i}`} x1={cx(i - 10)} y1={0} x2={cx(i - 10)} y2={height} stroke="#e2e8f0" strokeWidth="1" />
                        ))}
                        
                        {/* Axes */}
                        <line x1={0} y1={cy(0)} x2={width} y2={cy(0)} stroke="#94a3b8" strokeWidth="2" />
                        <line x1={cx(0)} y1={0} x2={cx(0)} y2={height} stroke="#94a3b8" strokeWidth="2" />

                        {/* Riemann Rectangles */}
                        {showArea && riemannRects.map((rect, i) => (
                            <rect 
                                key={i} 
                                x={cx(rect.x)} 
                                y={rect.isPositive ? cy(rect.y) : cy(0)} 
                                width={rect.width * scaleX} 
                                height={rect.height * scaleY} 
                                fill="rgba(59, 130, 246, 0.3)" 
                                stroke="rgba(59, 130, 246, 0.5)" 
                                strokeWidth="1"
                            />
                        ))}

                        {/* Function Curve */}
                        <path d={pathD} fill="none" stroke="#0f172a" strokeWidth="2" />

                        {/* Tangent Line */}
                        {tangentData && (
                            <>
                                <line x1={cx(tangentData.tX1)} y1={cy(tangentData.tY1)} x2={cx(tangentData.tX2)} y2={cy(tangentData.tY2)} stroke="#ef4444" strokeWidth="2" />
                                <circle cx={cx(tangentData.a)} cy={cy(tangentData.f_a)} r="4" fill="#ef4444" />
                            </>
                        )}
                    </svg>
                )}
            </section>
        </div>
    );
}
