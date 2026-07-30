import React, { useMemo } from 'react';
import { calculateSSTF, calculateSCAN } from '../services/os/DiskLogic';

export default function DiskChart({ initialHead, requests, algorithm }) {
    const { sequence, totalMovement, maxTrackDisplay } = useMemo(() => {
        if (!requests || requests.length === 0) return { sequence: [], totalMovement: 0, maxTrackDisplay: 200 };

        const numericRequests = requests.map(r => r.track);

        // Auto-detect a reasonable bounds for the chart max track
        const highestRequest = Math.max(...numericRequests, initialHead);
        const maxTrack = highestRequest > 199 ? Math.ceil(highestRequest / 100) * 100 : 199;

        let res;
        if (algorithm === 'SSTF') {
            res = calculateSSTF(initialHead, numericRequests);
        } else {
            // Passing default direction maxTrack to SCAN
            res = calculateSCAN(initialHead, numericRequests, maxTrack);
        }

        return { ...res, maxTrackDisplay: maxTrack };
    }, [initialHead, requests, algorithm]);

    if (!sequence.length) {
        return (
            <div className="flex h-32 items-center justify-center border border-slate-300 bg-white rounded-none text-xs text-slate-400">
                Awaiting disk tracking parameters...
            </div>
        );
    }

    // SVG Drawing Metrics
    const height = 400;
    const paddingY = 40;
    const usableHeight = height - (paddingY * 2);
    const stepY = usableHeight / (sequence.length > 1 ? sequence.length - 1 : 1);

    // Convert track number to X percentage
    const getX = (track) => `${(track / maxTrackDisplay) * 100}%`;
    const getY = (index) => paddingY + (index * stepY);

    return (
        <div className="space-y-6 min-w-[600px] lg:min-w-full">
            <div className="w-full border border-slate-300 bg-white p-4 md:p-6 rounded-none">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Disk Head Trajectory
                    </h3>
                    <div className="flex items-center gap-3">
                        <span className="text-xs font-mono uppercase text-slate-500">Total Movement:</span>
                        <div className="bg-slate-800 text-white px-3 py-1 font-mono text-sm border border-slate-900 rounded-none shadow-none">
                            {totalMovement} Tracks
                        </div>
                    </div>
                </div>

                <div className="relative w-full border border-slate-300 bg-slate-50 rounded-none overflow-hidden" style={{ height: `${height}px` }}>

                    {/* X-Axis Grid lines and labels (0, 25%, 50%, 75%, 100%) */}
                    {[0, 0.25, 0.5, 0.75, 1].map(pct => {
                        const val = Math.round(pct * maxTrackDisplay);
                        return (
                            <div key={val} className="absolute top-0 bottom-0 border-l border-slate-300 border-dashed z-0" style={{ left: `${pct * 100}%` }}>
                                <span className="absolute top-2 -translate-x-1/2 text-[10px] text-slate-500 font-mono bg-slate-50 px-1 leading-none">{val}</span>
                            </div>
                        )
                    })}

                    {/* SVG Line Trace - Pure brutalist continuous line */}
                    <svg className="absolute inset-0 w-full h-full z-10 overflow-visible" style={{ pointerEvents: 'none' }}>
                        <polyline
                            fill="none"
                            stroke="#1e293b" // slate-800
                            strokeWidth="2"
                            points={sequence.map((track, i) => `${(track / maxTrackDisplay) * 100}%,${getY(i)}`).join(' ')}
                        />
                    </svg>

                    {/* Points rendered as strictly square HTML dots for alignment and interaction */}
                    {sequence.map((track, i) => (
                        <div
                            key={`point-${i}`}
                            className="absolute w-2 h-2 -ml-1 -mt-1 bg-slate-800 rounded-none border border-slate-900 z-20 group cursor-crosshair"
                            style={{ left: getX(track), top: `${getY(i)}px` }}
                        >
                            {/* Persistent number label for the points */}
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-600 font-mono bg-white/80 px-1.5 py-0.5 border border-slate-200 pointer-events-none whitespace-nowrap hidden group-hover:block transition-all z-30">
                                Step {i}: T{track}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="mt-4 flex flex-wrap gap-2 text-[10px] font-mono text-slate-500 uppercase">
                    Sequence: {sequence.map(s => `T${s}`).join(' → ')}
                </div>
            </div>
        </div>
    );
}
