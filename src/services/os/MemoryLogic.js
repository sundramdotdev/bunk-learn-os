/**
 * Memory Allocation Algorithms Logic
 * This module exports FirstFit and BestFit functions using MFT (Fixed Partitioning).
 * In MFT, each partition can hold ONLY ONE process.
 */

/**
 * 1. First-Fit Allocation (MFT)
 * Allocates the first free memory partition that is big enough.
 */
export function calculateFirstFit(rawPartitions, rawRequests) {
    if (!rawPartitions || !rawRequests) return { memory: [], results: [] };

    // Format partitions into objects
    const memory = rawPartitions.map((size, idx) => ({
        id: `M${idx + 1}`,
        size: size,
        used: 0,
        internalFragmentation: 0,
        isAllocated: false,
        allocatedProcess: null
    }));

    const results = [];
    const requests = rawRequests.map((r, idx) => ({ id: `R${idx + 1}`, size: r }));

    for (const req of requests) {
        let allocated = false;

        // Build list of free partitions for context
        const freePartitions = memory.filter(p => !p.isAllocated);
        const fittingPartitions = freePartitions.filter(p => p.size >= req.size);

        for (let i = 0; i < memory.length; i++) {
            // MFT: Partition must be FREE and big enough
            if (!memory[i].isAllocated && memory[i].size >= req.size) {
                memory[i].used = req.size;
                memory[i].internalFragmentation = memory[i].size - req.size;
                memory[i].isAllocated = true;
                memory[i].allocatedProcess = req.id;
                
                const frag = memory[i].internalFragmentation;
                results.push({ 
                    ...req, 
                    allocatedTo: memory[i].id, 
                    internalFragmentation: frag,
                    success: true,
                    reason: `${req.id} (${req.size}K) → ${memory[i].id} (${memory[i].size}K). First partition that fits. Fragmentation: ${frag}K.`,
                    reasonHi: `${req.id} ko ${req.size}K chahiye. First Fit mein pehle wala partition dhundte hain jo fit ho. ${memory[i].id} (${memory[i].size}K) sabse pehla free partition hai jo kaafi bada hai. Allocate! Internal fragmentation: ${frag}K (${memory[i].size} - ${req.size} = ${frag}).`,
                });
                allocated = true;
                break;
            }
        }

        if (!allocated) {
            const freeStr = freePartitions.length > 0 
                ? freePartitions.map(p => `${p.id}(${p.size}K)`).join(', ')
                : 'none';
            results.push({ 
                ...req, 
                allocatedTo: null, 
                success: false,
                reason: `${req.id} (${req.size}K) — FAILED. No free partition large enough. Free: ${freeStr}.`,
                reasonHi: `${req.id} ko ${req.size}K chahiye, lekin koi bhi free partition itna bada nahi hai! Available free partitions: ${freeStr}. Allocation FAIL. ❌`,
            });
        }
    }

    return { memory, results };
}

/**
 * 2. Best-Fit Allocation (MFT)
 * Allocates the smallest free memory partition that is big enough.
 */
export function calculateBestFit(rawPartitions, rawRequests) {
    if (!rawPartitions || !rawRequests) return { memory: [], results: [] };

    const memory = rawPartitions.map((size, idx) => ({
        id: `M${idx + 1}`,
        size: size,
        used: 0,
        internalFragmentation: 0,
        isAllocated: false,
        allocatedProcess: null
    }));

    const results = [];
    const requests = rawRequests.map((r, idx) => ({ id: `R${idx + 1}`, size: r }));

    for (const req of requests) {
        let bestIdx = -1;
        let minDiff = Infinity;

        // Build context
        const freePartitions = memory.filter(p => !p.isAllocated);
        const fittingPartitions = freePartitions.filter(p => p.size >= req.size);

        for (let i = 0; i < memory.length; i++) {
            if (!memory[i].isAllocated && memory[i].size >= req.size) {
                const diff = memory[i].size - req.size;
                if (diff < minDiff) {
                    minDiff = diff;
                    bestIdx = i;
                }
            }
        }

        if (bestIdx !== -1) {
            memory[bestIdx].used = req.size;
            memory[bestIdx].internalFragmentation = minDiff;
            memory[bestIdx].isAllocated = true;
            memory[bestIdx].allocatedProcess = req.id;

            const candidates = fittingPartitions.map(p => `${p.id}(${p.size}K)`).join(', ');
            
            results.push({ 
                ...req, 
                allocatedTo: memory[bestIdx].id, 
                internalFragmentation: minDiff,
                success: true,
                reason: `${req.id} (${req.size}K) → ${memory[bestIdx].id} (${memory[bestIdx].size}K). Smallest fit among: ${candidates}. Frag: ${minDiff}K.`,
                reasonHi: `${req.id} ko ${req.size}K chahiye. Best Fit mein sabse chhota partition dhundte hain jo fit ho. Options the: ${candidates}. ${memory[bestIdx].id} (${memory[bestIdx].size}K) sabse best fit hai — sirf ${minDiff}K waste hoga (fragmentation). Allocate! ✅`,
            });
        } else {
            const freeStr = freePartitions.length > 0 
                ? freePartitions.map(p => `${p.id}(${p.size}K)`).join(', ')
                : 'none';
            results.push({ 
                ...req, 
                allocatedTo: null, 
                success: false,
                reason: `${req.id} (${req.size}K) — FAILED. No free partition large enough. Free: ${freeStr}.`,
                reasonHi: `${req.id} ko ${req.size}K chahiye, lekin koi bhi free partition itna bada nahi! Free partitions: ${freeStr}. Request FAIL! ❌`,
            });
        }
    }

    return { memory, results };
}
