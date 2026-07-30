/**
 * Disk Scheduling Algorithms Logic
 * Returns structured data for visualization and breakdown.
 */

const createMovements = (sequence, jumps = [], reasons = []) => {
    const movements = [];
    let totalMovement = 0;
    for (let i = 0; i < sequence.length - 1; i++) {
        const from = sequence[i];
        const to = sequence[i + 1];
        const val = Math.abs(to - from);
        
        const isJump = jumps.some(j => j.from === from && j.to === to);
        
        totalMovement += val;
        movements.push({
            step: i + 1,
            from,
            to,
            calc: `|${to} - ${from}|`,
            val,
            isJump,
            reason: reasons[i]?.reason || `Head moves from track ${from} to track ${to}. Seek distance: ${val}.`,
            reasonHi: reasons[i]?.reasonHi || `Head track ${from} se track ${to} pe gaya. Seek distance: |${to} - ${from}| = ${val}.`,
        });
    }
    return { movements, totalMovement };
};

/**
 * 1. FCFS (First-Come, First-Served)
 */
export function calculateFCFS(initialHead, requests) {
    const sequence = [initialHead, ...requests];
    const reasons = [];
    for (let i = 0; i < requests.length; i++) {
        const from = i === 0 ? initialHead : requests[i - 1];
        const to = requests[i];
        const dist = Math.abs(to - from);
        reasons.push({
            reason: `FCFS: Serve request ${to} in arrival order. Seek: |${to} - ${from}| = ${dist}.`,
            reasonHi: `FCFS mein jo request pehle aayi usko pehle serve karte hain. Request ${to} ki baari hai. Head ${from} se ${to} pe jayega. Seek distance: |${to} - ${from}| = ${dist}.`,
        });
    }
    const { movements, totalMovement } = createMovements(sequence, [], reasons);
    return { sequence, movements, totalMovement };
}

/**
 * 2. SSTF (Shortest Seek Time First)
 */
export function calculateSSTF(initialHead, requests) {
    let current = initialHead;
    const pending = [...requests];
    const sequence = [initialHead];
    const reasons = [];
    
    while (pending.length > 0) {
        let minIdx = 0;
        let minDistance = Math.abs(current - pending[0]);
        
        for (let i = 1; i < pending.length; i++) {
            const dist = Math.abs(current - pending[i]);
            if (dist < minDistance) {
                minDistance = dist;
                minIdx = i;
            }
        }
        
        const chosen = pending.splice(minIdx, 1)[0];
        const pendingStr = pending.length > 0 ? pending.join(', ') : 'none';
        reasons.push({
            reason: `SSTF: Track ${chosen} is nearest (distance ${minDistance}). Remaining: [${pendingStr}].`,
            reasonHi: `SSTF mein sabse nazdeeki track pehle serve hota hai. Abhi head ${current} pe hai. Track ${chosen} sabse paas hai (distance ${minDistance}). Pehle isko serve karo! Baaki: [${pendingStr}].`,
        });
        current = chosen;
        sequence.push(current);
    }
    
    const { movements, totalMovement } = createMovements(sequence, [], reasons);
    return { sequence, movements, totalMovement };
}

/**
 * 3. SCAN (Elevator)
 */
export function calculateSCAN(initialHead, requests, maxTrack, direction) {
    const sequence = [initialHead];
    const sorted = [...requests].sort((a, b) => a - b);
    const reasons = [];
    
    const left = sorted.filter(t => t < initialHead).reverse();
    const right = sorted.filter(t => t >= initialHead);
    
    if (direction === 'UP') {
        right.forEach((t, i) => {
            const prev = i === 0 ? initialHead : right[i - 1];
            reasons.push({
                reason: `SCAN UP: Serve track ${t} moving upward. Seek: ${Math.abs(t - prev)}.`,
                reasonHi: `SCAN mein elevator jaisa upar ja rahe hain. Track ${t} raaste mein hai, serve karo. Seek: ${Math.abs(t - prev)}.`,
            });
        });
        sequence.push(...right);
        if (left.length > 0) {
            const lastRight = right.length > 0 ? right[right.length - 1] : initialHead;
            reasons.push({
                reason: `SCAN: Reached direction end, go to boundary ${maxTrack}. Then reverse.`,
                reasonHi: `SCAN mein end tak jaana padta hai. Boundary ${maxTrack} tak gaye, ab direction reverse karke neeche aayenge.`,
            });
            sequence.push(maxTrack);
            left.forEach((t, i) => {
                const prev = i === 0 ? maxTrack : left[i - 1];
                reasons.push({
                    reason: `SCAN DOWN: Now serve track ${t} moving downward. Seek: ${Math.abs(t - prev)}.`,
                    reasonHi: `Ab neeche aa rahe hain. Track ${t} ko serve kar rahe hain. Seek: ${Math.abs(t - prev)}.`,
                });
            });
            sequence.push(...left);
        }
    } else {
        left.forEach((t, i) => {
            const prev = i === 0 ? initialHead : left[i - 1];
            reasons.push({
                reason: `SCAN DOWN: Serve track ${t} moving downward. Seek: ${Math.abs(t - prev)}.`,
                reasonHi: `SCAN mein neeche ja rahe hain. Track ${t} raaste mein hai, serve karo. Seek: ${Math.abs(t - prev)}.`,
            });
        });
        sequence.push(...left);
        if (right.length > 0) {
            reasons.push({
                reason: `SCAN: Reached direction end, go to boundary 0. Then reverse.`,
                reasonHi: `SCAN mein end tak jaana padta hai. Boundary 0 tak gaye, ab reverse karke upar jayenge.`,
            });
            sequence.push(0);
            right.forEach((t, i) => {
                const prev = i === 0 ? 0 : right[i - 1];
                reasons.push({
                    reason: `SCAN UP: Now serve track ${t} moving upward. Seek: ${Math.abs(t - prev)}.`,
                    reasonHi: `Ab upar ja rahe hain. Track ${t} ko serve kar rahe hain. Seek: ${Math.abs(t - prev)}.`,
                });
            });
            sequence.push(...right);
        }
    }
    
    const { movements, totalMovement } = createMovements(sequence, [], reasons);
    return { sequence, movements, totalMovement };
}

/**
 * 4. C-SCAN (Circular SCAN)
 */
export function calculateCSCAN(initialHead, requests, maxTrack, direction) {
    const sequence = [initialHead];
    const sorted = [...requests].sort((a, b) => a - b);
    const jumps = [];
    const reasons = [];
    
    const left = sorted.filter(t => t < initialHead);
    const right = sorted.filter(t => t >= initialHead);
    
    if (direction === 'UP') {
        right.forEach((t, i) => {
            const prev = i === 0 ? initialHead : right[i - 1];
            reasons.push({
                reason: `C-SCAN UP: Serve track ${t}. Seek: ${Math.abs(t - prev)}.`,
                reasonHi: `C-SCAN mein sirf ek direction mein serve karte hain. Track ${t} upar jaate hue serve. Seek: ${Math.abs(t - prev)}.`,
            });
        });
        sequence.push(...right);
        if (left.length > 0) {
            const lastRight = right.length > 0 ? right[right.length - 1] : initialHead;
            reasons.push({
                reason: `C-SCAN: Go to boundary ${maxTrack}. Seek: ${Math.abs(maxTrack - lastRight)}.`,
                reasonHi: `End boundary ${maxTrack} tak gaye. Seek: ${Math.abs(maxTrack - lastRight)}.`,
            });
            sequence.push(maxTrack);
            jumps.push({ from: maxTrack, to: 0 });
            reasons.push({
                reason: `C-SCAN: Circular jump ${maxTrack} → 0. Head resets to start.`,
                reasonHi: `C-SCAN mein end pe pahunch ke circular jump hota hai — ${maxTrack} se seedha 0 pe. Fir se shuru!`,
            });
            sequence.push(0);
            left.forEach((t, i) => {
                const prev = i === 0 ? 0 : left[i - 1];
                reasons.push({
                    reason: `C-SCAN UP: Serve track ${t} in second pass. Seek: ${Math.abs(t - prev)}.`,
                    reasonHi: `Doosra pass — 0 se upar jaate hue track ${t} serve kar rahe hain. Seek: ${Math.abs(t - prev)}.`,
                });
            });
            sequence.push(...left);
        }
    } else {
        sequence.push(...left.reverse());
        left.reverse().forEach((t, i) => {
            const prev = i === 0 ? initialHead : sorted.filter(x => x < initialHead).reverse()[i - 1];
            reasons.push({
                reason: `C-SCAN DOWN: Serve track ${t}. Seek: ${Math.abs(t - (i === 0 ? initialHead : sorted.filter(x => x < initialHead).reverse()[i-1]))}.`,
                reasonHi: `C-SCAN neeche jaate hue track ${t} serve kiya.`,
            });
        });
        if (right.length > 0) {
            sequence.push(0);
            jumps.push({ from: 0, to: maxTrack });
            sequence.push(maxTrack);
            sequence.push(...right.reverse());
        }
    }
    
    const { movements, totalMovement } = createMovements(sequence, jumps, reasons);
    return { sequence, movements, totalMovement };
}

/**
 * 5. LOOK
 */
export function calculateLOOK(initialHead, requests, direction) {
    const sequence = [initialHead];
    const sorted = [...requests].sort((a, b) => a - b);
    const reasons = [];
    
    const left = sorted.filter(t => t < initialHead).reverse();
    const right = sorted.filter(t => t >= initialHead);
    
    if (direction === 'UP') {
        right.forEach((t, i) => {
            const prev = i === 0 ? initialHead : right[i - 1];
            reasons.push({
                reason: `LOOK UP: Serve track ${t}. No boundary visit needed. Seek: ${Math.abs(t - prev)}.`,
                reasonHi: `LOOK mein boundary tak jaane ki zaroorat nahi — sirf requests tak jaate hain. Track ${t} upar jaate hue serve. Seek: ${Math.abs(t - prev)}.`,
            });
        });
        sequence.push(...right);
        left.forEach((t, i) => {
            const prev = i === 0 ? (right.length > 0 ? right[right.length - 1] : initialHead) : left[i - 1];
            reasons.push({
                reason: `LOOK DOWN: Reverse. Serve track ${t}. Seek: ${Math.abs(t - prev)}.`,
                reasonHi: `Ab reverse karke neeche. Track ${t} serve karo. Seek: ${Math.abs(t - prev)}.`,
            });
        });
        sequence.push(...left);
    } else {
        left.forEach((t, i) => {
            const prev = i === 0 ? initialHead : left[i - 1];
            reasons.push({
                reason: `LOOK DOWN: Serve track ${t}. Seek: ${Math.abs(t - prev)}.`,
                reasonHi: `LOOK mein neeche jaate hue track ${t} serve kiya. Seek: ${Math.abs(t - prev)}.`,
            });
        });
        sequence.push(...left);
        right.forEach((t, i) => {
            const prev = i === 0 ? (left.length > 0 ? left[left.length - 1] : initialHead) : right[i - 1];
            reasons.push({
                reason: `LOOK UP: Reverse. Serve track ${t}. Seek: ${Math.abs(t - prev)}.`,
                reasonHi: `Ab reverse karke upar. Track ${t} serve karo. Seek: ${Math.abs(t - prev)}.`,
            });
        });
        sequence.push(...right);
    }
    
    const { movements, totalMovement } = createMovements(sequence, [], reasons);
    return { sequence, movements, totalMovement };
}

/**
 * 6. C-LOOK
 */
export function calculateCLOOK(initialHead, requests, direction) {
    const sequence = [initialHead];
    const sorted = [...requests].sort((a, b) => a - b);
    const jumps = [];
    const reasons = [];
    
    const left = sorted.filter(t => t < initialHead);
    const right = sorted.filter(t => t >= initialHead);
    
    if (direction === 'UP') {
        right.forEach((t, i) => {
            const prev = i === 0 ? initialHead : right[i - 1];
            reasons.push({
                reason: `C-LOOK UP: Serve track ${t}. Seek: ${Math.abs(t - prev)}.`,
                reasonHi: `C-LOOK mein upar jaate hue track ${t} serve. Boundary nahi jaate, sirf last request tak. Seek: ${Math.abs(t - prev)}.`,
            });
        });
        sequence.push(...right);
        if (left.length > 0) {
            const lastRight = right.length > 0 ? right[right.length - 1] : initialHead;
            jumps.push({ from: lastRight, to: left[0] });
            reasons.push({
                reason: `C-LOOK: Jump from ${lastRight} to ${left[0]} (lowest pending). Circular reset.`,
                reasonHi: `C-LOOK mein last request ke baad seedha sabse chhoti pending request ${left[0]} pe jump! Circular reset.`,
            });
            left.forEach((t, i) => {
                if (i > 0) {
                    const prev = left[i - 1];
                    reasons.push({
                        reason: `C-LOOK UP: Serve track ${t} in second pass. Seek: ${Math.abs(t - prev)}.`,
                        reasonHi: `Doosra pass — track ${t} serve karo. Seek: ${Math.abs(t - prev)}.`,
                    });
                }
            });
            sequence.push(...left);
        }
    } else {
        sequence.push(...left.reverse());
        left.reverse().forEach((t, i) => {
            const prev = i === 0 ? initialHead : sorted.filter(x => x < initialHead).reverse()[i - 1];
            reasons.push({
                reason: `C-LOOK DOWN: Serve track ${t}.`,
                reasonHi: `C-LOOK neeche jaate hue track ${t} serve kiya.`,
            });
        });
        if (right.length > 0) {
            const lastLeft = left.length > 0 ? left[0] : initialHead;
            jumps.push({ from: lastLeft, to: right[right.length - 1] });
            sequence.push(...right.reverse());
        }
    }
    
    const { movements, totalMovement } = createMovements(sequence, jumps, reasons);
    return { sequence, movements, totalMovement };
}
