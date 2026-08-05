import React from 'react';

export default function PageSkeleton() {
    return (
        <div className="w-full h-full flex flex-col gap-6 animate-pulse p-4">
            {/* Header skeleton */}
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-200 rounded-lg"></div>
                <div className="space-y-2">
                    <div className="h-4 bg-slate-200 rounded w-48"></div>
                    <div className="h-3 bg-slate-200 rounded w-32"></div>
                </div>
            </div>

            {/* Content blocks skeleton */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-4">
                    <div className="h-64 bg-slate-200 rounded-none w-full"></div>
                    <div className="h-32 bg-slate-200 rounded-none w-full"></div>
                </div>
                <div className="space-y-4">
                    <div className="h-40 bg-slate-200 rounded-none w-full"></div>
                    <div className="h-40 bg-slate-200 rounded-none w-full"></div>
                </div>
            </div>
        </div>
    );
}
