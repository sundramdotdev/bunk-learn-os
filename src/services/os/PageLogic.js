/**
 * Page Replacement Algorithms Logic
 * This module exports FIFO, LRU, and Optimal functions.
 */

/**
 * Common return structure for page replacement algorithms
 * @returns {Object} { frames, history, hits, faults, hitRatio }
 */

export function calculateFIFO(referenceString, frameCount) {
    const frames = new Array(frameCount).fill(null);
    const history = []; // List of frame states at each step
    let hits = 0;
    let faults = 0;

    referenceString.forEach((page) => {
        let isHit = frames.includes(page);
        if (isHit) {
            hits++;
        } else {
            faults++;
            // FIFO: Replace the page that came in earliest
            // We can just treat frames as a queue for simpler implementation
            frames.shift();
            frames.push(page);
        }
        history.push({
            page,
            isHit,
            frames: [...frames]
        });
    });

    return {
        frames: frameCount,
        history,
        hits,
        faults,
        hitRatio: (hits / referenceString.length).toFixed(2)
    };
}

export function calculateLRU(referenceString, frameCount) {
    const frames = new Array(frameCount).fill(null);
    const history = [];
    const lastUsed = new Array(frameCount).fill(-1); // Indices of last usage
    let hits = 0;
    let faults = 0;

    referenceString.forEach((page, time) => {
        let isHit = frames.includes(page);
        if (isHit) {
            hits++;
            const idx = frames.indexOf(page);
            lastUsed[idx] = time;
        } else {
            faults++;
            let replaceIdx = -1;
            // Check for empty frames first
            if (frames.includes(null)) {
                replaceIdx = frames.indexOf(null);
            } else {
                // Find least recently used
                replaceIdx = 0;
                let minTime = lastUsed[0];
                for (let i = 1; i < frameCount; i++) {
                    if (lastUsed[i] < minTime) {
                        minTime = lastUsed[i];
                        replaceIdx = i;
                    }
                }
            }
            frames[replaceIdx] = page;
            lastUsed[replaceIdx] = time;
        }
        history.push({
            page,
            isHit,
            frames: [...frames]
        });
    });

    return {
        frames: frameCount,
        history,
        hits,
        faults,
        hitRatio: (hits / referenceString.length).toFixed(2)
    };
}

export function calculateOptimal(referenceString, frameCount) {
    const frames = new Array(frameCount).fill(null);
    const history = [];
    let hits = 0;
    let faults = 0;

    referenceString.forEach((page, time) => {
        let isHit = frames.includes(page);
        if (isHit) {
            hits++;
        } else {
            faults++;
            let replaceIdx = -1;
            if (frames.includes(null)) {
                replaceIdx = frames.indexOf(null);
            } else {
                // Find page that won't be used for the longest time in the future
                let farthestTime = -1;
                replaceIdx = 0;
                for (let i = 0; i < frameCount; i++) {
                    const futureIndex = referenceString.slice(time + 1).indexOf(frames[i]);
                    if (futureIndex === -1) {
                        replaceIdx = i;
                        break; // Not used again, optimal replacement
                    } else if (futureIndex > farthestTime) {
                        farthestTime = futureIndex;
                        replaceIdx = i;
                    }
                }
            }
            frames[replaceIdx] = page;
        }
        history.push({
            page,
            isHit,
            frames: [...frames]
        });
    });

    return {
        frames: frameCount,
        history,
        hits,
        faults,
        hitRatio: (hits / referenceString.length).toFixed(2)
    };
}
