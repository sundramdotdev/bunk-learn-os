import React from 'react';

const BLOCK_COLORS = [
    'bg-slate-500',
    'bg-blue-500',
    'bg-amber-500',
    'bg-emerald-500',
    'bg-purple-500'
];

export default function GanttChart({ results, revealedCount }) {
    if (!results || results.length === 0) {
        return (
            <div className="flex h-32 items-center justify-center border border-slate-300 bg-white rounded-sm text-xs text-slate-400">
                Run a CPU scheduling simulation to see the Gantt chart here.
            </div>
        );
    }

    // To calculate percentage widths, we need the total time the CPU ran.
    const totalTime = results[results.length - 1].completionTime;

    // We map pure IDs to stable colors so P1 is always the same color in one run.
    const uniqueIds = Array.from(new Set(results.filter(r => !r.isIdle).map(r => r.id)));
    const colorMap = {};
    uniqueIds.forEach((id, index) => {
        colorMap[id] = BLOCK_COLORS[index % BLOCK_COLORS.length];
    });

    return (
        <div className="w-full min-w-[600px] border border-slate-300 bg-white p-4 md:p-6 rounded-sm">
            <h3 className="mb-6 text-xs font-semibold uppercase tracking-wider text-slate-400">
                CPU Gantt Chart Timeline
            </h3>

            <div className="relative flex w-full h-14 bg-slate-100 rounded-sm overflow-hidden border border-slate-200">
                {results.map((block, idx) => {
                    // If step-by-step reveal is active, only show up to `revealedCount`
                    const isVisible = idx < revealedCount;
                    if (!isVisible) return null;

                    // Width is derived from executionTime if available (Round Robin slices), otherwise burstTime
                    const duration = block.executionTime || block.burstTime;
                    const percentage = (duration / totalTime) * 100;

                    if (block.processId === 'Idle') {
                        return (
                            <div
                                key={`idle-${idx}`}
                                title={`Idle (${block.burstTime}ms)`}
                                className="relative flex items-center justify-center border-r border-dashed border-zinc-400 bg-zinc-200/50"
                                style={{
                                    width: `${percentage}%`,
                                    backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,0.03) 10px, rgba(0,0,0,0.03) 20px)'
                                }}
                            >
                                <span className="text-[10px] text-zinc-500 font-bold tracking-widest uppercase">Idle</span>
                                {/* Always mark end time for the block */}
                                <span className="absolute -bottom-6 right-0 translate-x-1/2 text-[10px] text-slate-500 font-mono">
                                    {block.endTime}
                                </span>
                                {idx === 0 && (
                                    <span className="absolute -bottom-6 left-0 -translate-x-1/2 text-[10px] text-slate-500 font-mono">
                                        {block.startTime}
                                    </span>
                                )}
                            </div>
                        );
                    }

                    const bgColor = colorMap[block.id];

                    return (
                        <div
                            key={`${block.id}-${idx}`}
                            title={`${block.id} running for ${duration}ms`}
                            className={`relative flex items-center justify-center border-r border-slate-800 text-white font-medium text-xs ${bgColor} transition-all duration-300 ease-in-out`}
                            style={{ width: `${percentage}%` }}
                        >
                            {block.id}

                            {/* End time label */}
                            <span className="absolute -bottom-6 right-0 translate-x-1/2 text-[10px] text-slate-500 font-mono pointer-events-none">
                                {block.completionTime}
                            </span>

                            {/* Start time label (only for the very first block in the chart) */}
                            {idx === 0 && (
                                <span className="absolute -bottom-6 left-0 -translate-x-1/2 text-[10px] text-slate-500 font-mono pointer-events-none">
                                    {block.startTime}
                                </span>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Spacer to account for the absolutely positioned time labels */}
            <div className="h-6 w-full"></div>
        </div>
    );
}
