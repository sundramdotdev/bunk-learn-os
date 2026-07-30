/**
 * Disk Scheduling Algorithms Logic
 * This module exports SSTF and SCAN disk scheduling logic.
 */

/**
 * 1. Shortest Seek Time First (SSTF)
 * Selects the request with the minimum seek time from the current head position.
 * 
 * @param {Number} initialHead - Starting point of the disk head (e.g., 50)
 * @param {Array<Number>} requests - Array of track requests (e.g., [82, 170, 43, 140, 24, 16, 190])
 * @returns {Object} { sequence: Array of tracks visited, totalMovement: Number representing head distance }
 */
export function calculateSSTF(initialHead, requests) {
    if (!requests || requests.length === 0) return { sequence: [initialHead], totalMovement: 0 };

    let currentPos = initialHead;
    const pending = [...requests];
    const sequence = [initialHead];
    let totalMovement = 0;

    // Output loop until all pending requests are serviced
    while (pending.length > 0) {
        let closestIdx = -1;
        let minDistance = Infinity;

        // Step 1: Calculate distance to all pending tracks and find the nearest one
        for (let i = 0; i < pending.length; i++) {
            const dist = Math.abs(currentPos - pending[i]);
            if (dist < minDistance) {
                minDistance = dist;
                closestIdx = i;
            }
        }

        // Step 2: Remove the closest track from pending list and move head to it
        const nextTrack = pending.splice(closestIdx, 1)[0];

        // Step 3: Accumulate movement distance
        totalMovement += minDistance;

        currentPos = nextTrack;
        sequence.push(currentPos);
    }

    return { sequence, totalMovement };
}


/**
 * 2. SCAN (Elevator algorithm)
 * The disk arm starts at one end and moves towards the other end servicing requests 
 * as it goes. When it reaches the end, it reverses direction.
 * 
 * @param {Number} initialHead - Starting point of the disk head
 * @param {Array<Number>} requests - Array of track requests
 * @param {Number} maxTrack - Maximum track number (e.g., 199)
 * @returns {Object} { sequence: Array of tracks visited, totalMovement: Number }
 */
export function calculateSCAN(initialHead, requests, maxTrack = 199) {
    if (!requests || requests.length === 0) return { sequence: [initialHead], totalMovement: 0 };

    const sequence = [initialHead];
    let totalMovement = 0;

    // Step 1: Sort the incoming requests numerically
    const reqs = [...requests].sort((a, b) => a - b);

    // Step 2: Split requests into those "Left" (smaller than head) and "Right" (larger than head)
    // We reverse the left array because when scanning downwards we want to hit the largest first (e.g., 45 -> 30 -> 10)
    const left = reqs.filter(r => r < initialHead).reverse();
    const right = reqs.filter(r => r >= initialHead);

    let currentPos = initialHead;

    // Step 3: Scan UP (Towards Max Track)
    for (const track of right) {
        totalMovement += Math.abs(currentPos - track);
        currentPos = track;
        sequence.push(currentPos);
    }

    // Step 4: If there are items left to process on the other side, 
    // the head MUST go all the way to the end of the disk before reversing.
    if ((right.length > 0 || left.length > 0) && currentPos !== maxTrack) {
        totalMovement += Math.abs(currentPos - maxTrack);
        currentPos = maxTrack;
        sequence.push(currentPos);
    }

    // Step 5: Reverse direction and Scan DOWN
    for (const track of left) {
        totalMovement += Math.abs(currentPos - track);
        currentPos = track;
        sequence.push(currentPos);
    }

    return { sequence, totalMovement };
}

/**
 * 3. First-Come, First-Served (FCFS)
 * Requests are serviced in the order they arrive in the queue.
 * 
 * @param {Number} initialHead - Starting point of the disk head
 * @param {Array<Number>} requests - Array of track requests
 * @returns {Object} { sequence: Array, totalMovement: Number }
 */
export function calculateFCFS(initialHead, requests) {
    if (!requests || requests.length === 0) return { sequence: [initialHead], totalMovement: 0 };

    const sequence = [initialHead, ...requests];
    let totalMovement = 0;

    for (let i = 0; i < sequence.length - 1; i++) {
        totalMovement += Math.abs(sequence[i] - sequence[i + 1]);
    }

    return { sequence, totalMovement };
}

