/**
 * Advanced CPU Scheduling Algorithms Logic
 * This module exports FCFS, SJF, RR, SRTF, HRRN, and LCN functions.
 * All algorithms take an array of processes: { id: 'P1', arrivalTime: 0, burstTime: 5 }
 * and return an array of scheduled execution blocks containing:
 * { id, startTime, completionTime, turnaroundTime, waitingTime, isIdle (optional), reason, reasonHi }
 */

/**
 * 1. First-Come, First-Served (FCFS)
 * Simplest algorithm: The process that requests the CPU first gets it first.
 * It's non-preemptive, meaning once a process starts, it runs until finished.
 */
export function calculateFCFS(processes) {
    if (!processes || processes.length === 0) return [];

    // Step 1: Sort processes by arrival time to know who came first.
    const sorted = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime);
    const results = [];
    let currentTime = 0;

    for (const proc of sorted) {
        // If the CPU is currently idle because the next process hasn't arrived yet,
        // fast-forward the current time to when it arrives.
        if (currentTime < proc.arrivalTime) {
            results.push({
                id: 'Idle',
                processId: 'Idle',
                startTime: currentTime,
                endTime: proc.arrivalTime,
                completionTime: proc.arrivalTime,
                burstTime: proc.arrivalTime - currentTime,
                isIdle: true,
                reason: `No process available. CPU idle until next arrival at t=${proc.arrivalTime}.`,
                reasonHi: `Abhi koi bhi process ready nahi hai. CPU free baitha hai — jab tak next process t=${proc.arrivalTime} pe nahi aata, tab tak wait karega.`,
            });
            currentTime = proc.arrivalTime;
        }

        const start = currentTime;
        const completion = start + proc.burstTime;

        // Turnaround Time (TAT) = Completion Time - Arrival Time (total time spent in the system)
        const turnaround = completion - proc.arrivalTime;

        // Waiting Time (WT) = Turnaround Time - Burst Time (time spent waiting in the queue)
        const waiting = turnaround - proc.burstTime;

        const isFirst = results.filter(r => !r.isIdle).length === 0;

        results.push({
            id: proc.id,
            arrivalTime: proc.arrivalTime,
            burstTime: proc.burstTime,
            startTime: start,
            completionTime: completion,
            turnaroundTime: turnaround,
            waitingTime: waiting,
            isIdle: false,
            reason: isFirst
                ? `${proc.id} arrives first (t=${proc.arrivalTime}) — CPU is free, selected by FCFS.`
                : `${proc.id} is next in FCFS queue (arrived t=${proc.arrivalTime}). Runs t=${start}→${completion}.`,
            reasonHi: isFirst
                ? `Dekho, ${proc.id} sabse pehle aaya t=${proc.arrivalTime} pe aur CPU bilkul free hai. FCFS mein rule simple hai — jo pehle aaye, usko pehle CPU milega. Toh ${proc.id} select!`
                : `Ab queue mein agle number pe ${proc.id} hai (ye t=${proc.arrivalTime} pe aaya tha). FCFS mein order se kaam hota hai, toh ab ${proc.id} chalega t=${start} se t=${completion} tak.`,
        });

        currentTime = completion; // Update time for the next process
    }

    return results;
}


/**
 * 2. Shortest Job First (SJF) - Non-Preemptive
 * Selects the waiting process with the smallest burst time.
 * If two processes have the same burst time, FCFS breaks the tie.
 */
export function calculateSJF_NonPreemptive(processes) {
    if (!processes || processes.length === 0) return [];

    const results = [];
    let currentTime = 0;

    // We need to keep track of which processes are done.
    const remaining = [...processes].map(p => ({ ...p, isCompleted: false }));
    let completedCount = 0;

    while (completedCount < processes.length) {
        // Find all processes that have arrived by `currentTime` and are NOT completed
        const available = remaining.filter(p => p.arrivalTime <= currentTime && !p.isCompleted);

        if (available.length > 0) {
            // Pick the one with the shortest burst time
            available.sort((a, b) => {
                if (a.burstTime === b.burstTime) return a.arrivalTime - b.arrivalTime; // Tie breaker
                return a.burstTime - b.burstTime;
            });

            const selected = available[0];
            const start = currentTime;
            const completion = start + selected.burstTime;

            const turnaround = completion - selected.arrivalTime;
            const waiting = turnaround - selected.burstTime;

            // Build list of other ready processes for Hinglish detail
            const othersStr = available.length > 1
                ? available.map(p => `${p.id}(burst=${p.burstTime})`).join(', ')
                : '';

            results.push({
                id: selected.id,
                arrivalTime: selected.arrivalTime,
                burstTime: selected.burstTime,
                startTime: start,
                completionTime: completion,
                turnaroundTime: turnaround,
                waitingTime: waiting,
                isIdle: false,
                reason: available.length === 1
                    ? `${selected.id} is the only ready process at t=${start}. Burst = ${selected.burstTime}.`
                    : `${selected.id} has shortest burst (${selected.burstTime}) among ${available.length} ready processes at t=${start}.`,
                reasonHi: available.length === 1
                    ? `Is waqt t=${start} pe sirf ${selected.id} hi ready hai, koi aur option nahi. Iska burst ${selected.burstTime} hai. Seedha select!`
                    : `t=${start} pe ${available.length} processes ready hain: ${othersStr}. SJF ka rule — sabse chhota burst wala pehle chalega. ${selected.id} ka burst ${selected.burstTime} sabse kam hai, isliye ye select hua!`,
            });

            // Mark the chosen process as done and move the clock forward
            selected.isCompleted = true;
            completedCount++;
            currentTime = completion;

        } else {
            // No processes have arrived yet, so the CPU must sit idle.
            // Find the next upcoming process's arrival time to jump there.
            const uncompleted = remaining.filter(p => !p.isCompleted).sort((a, b) => a.arrivalTime - b.arrivalTime);
            const nextArrival = uncompleted[0].arrivalTime;

            results.push({
                id: 'Idle',
                processId: 'Idle',
                startTime: currentTime,
                endTime: nextArrival,
                completionTime: nextArrival,
                burstTime: nextArrival - currentTime,
                isIdle: true,
                reason: `No process available. CPU idle until next arrival at t=${nextArrival}.`,
                reasonHi: `Koi process abhi ready nahi hai. CPU ko rukna padega jab tak next process t=${nextArrival} pe nahi aa jaata.`,
            });
            currentTime = nextArrival;
        }
    }

    return results;
}


/**
 * 3. Round Robin (RR)
 * A preemptive algorithm where each process gets a small unit of CPU time (Time Quantum).
 * If it doesn't finish in that time, it's put at the back of the queue.
 */
export function calculateRoundRobin(processes, timeQuantum = 2) {
    if (!processes || processes.length === 0) return [];

    const results = [];
    let currentTime = 0;

    // We need to track remaining burst times, since processes might not finish in one go.
    const queue = [];
    const procs = [...processes].map(p => ({
        ...p,
        remainingBurst: p.burstTime,
        inQueue: false,
    })).sort((a, b) => a.arrivalTime - b.arrivalTime);

    let completedCount = 0;
    let idx = 0; // Pointer for adding newly arrived processes

    // Add the first arrived process to the queue
    if (procs[0].arrivalTime > currentTime) {
        results.push({
            id: 'Idle',
            processId: 'Idle',
            startTime: currentTime,
            endTime: procs[0].arrivalTime,
            completionTime: procs[0].arrivalTime,
            burstTime: procs[0].arrivalTime - currentTime,
            isIdle: true,
            reason: `No process available. CPU idle until first arrival at t=${procs[0].arrivalTime}.`,
            reasonHi: `Abhi tak koi process aaya hi nahi. CPU free baitha hai — pehla process t=${procs[0].arrivalTime} pe aayega, tab tak idle rahega.`,
        });
        currentTime = procs[0].arrivalTime;
    }

    while (idx < procs.length && procs[idx].arrivalTime <= currentTime) {
        queue.push(procs[idx]);
        procs[idx].inQueue = true;
        idx++;
    }

    while (completedCount < procs.length) {
        if (queue.length > 0) {
            const currentProc = queue.shift();

            // Determine how long this process will run. 
            // It's either the full Time Quantum, or whatever it needs to finish if < Quantum.
            const timeToRun = Math.min(currentProc.remainingBurst, timeQuantum);

            const start = currentTime;
            const completion = start + timeToRun;
            const willComplete = currentProc.remainingBurst <= timeQuantum;
            const remainAfter = currentProc.remainingBurst - timeToRun;

            results.push({
                id: currentProc.id,
                arrivalTime: currentProc.arrivalTime,
                burstTime: currentProc.burstTime, // Original
                executionTime: timeToRun, // Time run in this specific slice
                startTime: start,
                completionTime: completion,
                isIdle: false,
                reason: !willComplete
                    ? `${currentProc.id} executes for quantum ${timeQuantum}. Remaining: ${remainAfter}.`
                    : `${currentProc.id} completes final burst of ${currentProc.remainingBurst} (≤ quantum ${timeQuantum}).`,
                reasonHi: !willComplete
                    ? `${currentProc.id} ki baari aayi! Isko ${timeQuantum} units ka time quantum milega. Lekin iska kaam abhi poora nahi hua — ${remainAfter} units abhi baaki hain. Toh ${currentProc.id} queue ke peeche chala jayega, baad mein phir aayega.`
                    : `${currentProc.id} ka bacha hua burst sirf ${currentProc.remainingBurst} hai, jo quantum ${timeQuantum} se kam ya barabar hai. Matlab ye apna poora kaam is baar mein khatam kar lega. ${currentProc.id} complete! 🎉`,
            });

            currentTime = completion;
            currentProc.remainingBurst -= timeToRun;

            // Check for strictly newly arrived processes WHILE this one was running,
            // and put them in the queue BEFORE we put the current process back.
            while (idx < procs.length && procs[idx].arrivalTime <= currentTime) {
                if (!procs[idx].inQueue) {
                    queue.push(procs[idx]);
                    procs[idx].inQueue = true;
                }
                idx++;
            }

            // If the current process isn't done, put it back at the end of the queue.
            if (currentProc.remainingBurst > 0) {
                queue.push(currentProc);
            } else {
                // Process is fully completed. Let's calculate its final metrics.
                completedCount++;

                // We append turnaround and waiting times to all its slices in the results array
                // (For simplicity in the Gantt Chart, we calculate these at the end of its life)
                const totalTurnaround = completion - currentProc.arrivalTime;
                const totalWaiting = totalTurnaround - currentProc.burstTime;

                // Tag all result slices belonging to this process with the final metrics
                results.forEach(res => {
                    if (res.id === currentProc.id) {
                        res.turnaroundTime = totalTurnaround;
                        res.waitingTime = totalWaiting;
                        res.finalCompletion = completion; // The absolute final completion time
                    }
                });
            }

        } else {
            // Queue is empty but processes are left (they just haven't arrived yet).
            // Find the next arrival and jump time forward.
            if (idx < procs.length) {
                const nextArrival = procs[idx].arrivalTime;
                results.push({
                    id: 'Idle',
                    processId: 'Idle',
                    startTime: currentTime,
                    endTime: nextArrival,
                    completionTime: nextArrival,
                    burstTime: nextArrival - currentTime,
                    isIdle: true,
                    reason: `Queue empty. CPU idle until next arrival at t=${nextArrival}.`,
                    reasonHi: `Queue khaali hai! Koi process line mein nahi hai. CPU wait karega jab tak koi naya process t=${nextArrival} pe arrive na ho jaaye.`,
                });
                currentTime = nextArrival;

                while (idx < procs.length && procs[idx].arrivalTime <= currentTime) {
                    queue.push(procs[idx]);
                    procs[idx].inQueue = true;
                    idx++;
                }
            }
        }
    }

    return results;
}

/**
 * 4. Shortest Remaining Time First (SRTF) - Preemptive
 * The preemptive version of SJF. The CPU is allocated to the process 
 * with the shortest remaining burst time at any given point.
 */
export function calculateSRTF(processes) {
    if (!processes || processes.length === 0) return [];

    const results = [];
    let currentTime = 0;
    let completedCount = 0;

    const procs = [...processes].map(p => ({
        ...p,
        remainingBurst: p.burstTime,
        isCompleted: false,
    }));

    let lastProcessId = null;
    let sliceStart = 0;

    while (completedCount < procs.length) {
        // Find available processes
        const available = procs.filter(p => !p.isCompleted && p.arrivalTime <= currentTime);

        if (available.length > 0) {
            // Pick process with shortest remaining burst
            available.sort((a, b) => {
                if (a.remainingBurst === b.remainingBurst) return a.arrivalTime - b.arrivalTime;
                return a.remainingBurst - b.remainingBurst;
            });

            const selected = available[0];

            // If we switched processes, record the previous one
            if (lastProcessId !== null && lastProcessId !== selected.id) {
                const prevProc = procs.find(p => p.id === lastProcessId);
                results.push({
                    id: lastProcessId,
                    arrivalTime: prevProc.arrivalTime,
                    burstTime: prevProc.burstTime,
                    startTime: sliceStart,
                    completionTime: currentTime,
                    isIdle: false,
                    reason: `${lastProcessId} runs t=${sliceStart}→${currentTime}. Preempted by ${selected.id} (remaining ${selected.remainingBurst} < ${prevProc.remainingBurst}).`,
                    reasonHi: `${lastProcessId} t=${sliceStart} se t=${currentTime} tak chala. Lekin ruko — ${selected.id} aa gaya aur iska bacha hua burst ${selected.remainingBurst} hai, jo ${lastProcessId} ke ${prevProc.remainingBurst} se kam hai! SRTF mein hamesha kam remaining wale ko priority milti hai. Toh ${lastProcessId} ko hatao, ${selected.id} ko lagao!`,
                });
                sliceStart = currentTime;
            } else if (lastProcessId === null) {
                sliceStart = currentTime;
            }

            lastProcessId = selected.id;
            selected.remainingBurst--;
            currentTime++;

            if (selected.remainingBurst === 0) {
                selected.isCompleted = true;
                completedCount++;
                
                // Record completion metrics
                const completionTime = currentTime;
                const turnaround = completionTime - selected.arrivalTime;
                const waiting = turnaround - selected.burstTime;

                // Push final slice for this process
                results.push({
                    id: selected.id,
                    arrivalTime: selected.arrivalTime,
                    burstTime: selected.burstTime,
                    startTime: sliceStart,
                    completionTime: completionTime,
                    isIdle: false,
                    finalCompletion: completionTime,
                    turnaroundTime: turnaround,
                    waitingTime: waiting,
                    reason: `${selected.id} completes execution at t=${completionTime}. Total burst: ${selected.burstTime}.`,
                    reasonHi: `${selected.id} ne apna poora kaam khatam kar liya t=${completionTime} pe! Iska total burst ${selected.burstTime} tha — sab execute ho gaya. ✅`,
                });

                // Update all previous slices of this process with the same metrics
                results.forEach(res => {
                    if (res.id === selected.id) {
                        res.finalCompletion = completionTime;
                        res.turnaroundTime = turnaround;
                        res.waitingTime = waiting;
                    }
                });

                lastProcessId = null;
            }
        } else {
            // Idle time
            if (lastProcessId !== null) {
                const prevProc = procs.find(p => p.id === lastProcessId);
                 results.push({
                    id: lastProcessId,
                    arrivalTime: prevProc.arrivalTime,
                    burstTime: prevProc.burstTime,
                    startTime: sliceStart,
                    completionTime: currentTime,
                    isIdle: false,
                    reason: `${lastProcessId} runs t=${sliceStart}→${currentTime}. No more ready processes.`,
                    reasonHi: `${lastProcessId} t=${sliceStart} se t=${currentTime} tak chala. Ab koi aur process ready nahi hai — CPU ko kuch der rukna padega.`,
                });
                lastProcessId = null;
            }

            const nextArrivals = procs.filter(p => !p.isCompleted).sort((a, b) => a.arrivalTime - b.arrivalTime);
            if (nextArrivals.length > 0) {
                const nextArrival = nextArrivals[0].arrivalTime;

                results.push({
                    id: 'Idle',
                    processId: 'Idle',
                    startTime: currentTime,
                    endTime: nextArrival,
                    completionTime: nextArrival,
                    burstTime: nextArrival - currentTime,
                    isIdle: true,
                    reason: `CPU idle — no processes available. Next arrival at t=${nextArrival}.`,
                    reasonHi: `CPU bilkul free hai, koi process line mein nahi. Next process t=${nextArrival} pe aayega — tab tak CPU idle rahega.`,
                });
                currentTime = nextArrival;
                sliceStart = currentTime;
            } else {
                break; // Should not happen with completedCount check
            }
        }
    }

    return results;
}

/**
 * 5. Highest Response Ratio Next (HRRN) - Non-Preemptive
 * Selects the next process based on the response ratio:
 * RR = (Waiting Time + Predicted Burst Time) / Predicted Burst Time
 */
export function calculateHRRN(processes) {
    if (!processes || processes.length === 0) return [];

    const results = [];
    let currentTime = 0;
    const procs = [...processes].map(p => ({ ...p, isCompleted: false }));
    let completedCount = 0;

    while (completedCount < procs.length) {
        const available = procs.filter(p => !p.isCompleted && p.arrivalTime <= currentTime);

        if (available.length > 0) {
            // Calculate Response Ratio for all available processes
            available.forEach(p => {
                const waitingTime = currentTime - p.arrivalTime;
                p.responseRatio = (waitingTime + p.burstTime) / p.burstTime;
            });

            // Sort by highest response ratio
            available.sort((a, b) => {
                if (b.responseRatio === a.responseRatio) return a.arrivalTime - b.arrivalTime;
                return b.responseRatio - a.responseRatio;
            });

            const selected = available[0];
            const start = currentTime;
            const completion = start + selected.burstTime;
            const turnaround = completion - selected.arrivalTime;
            const waiting = turnaround - selected.burstTime;
            const wt = start - selected.arrivalTime;

            // Build detailed ratio comparison for Hinglish
            const ratioDetails = available.map(p => `${p.id}=${p.responseRatio.toFixed(2)}`).join(', ');

            results.push({
                id: selected.id,
                arrivalTime: selected.arrivalTime,
                burstTime: selected.burstTime,
                startTime: start,
                completionTime: completion,
                turnaroundTime: turnaround,
                waitingTime: waiting,
                isIdle: false,
                reason: available.length === 1
                    ? `${selected.id} is the only ready process at t=${start}. RR = ${selected.responseRatio.toFixed(2)}.`
                    : `${selected.id} wins with response ratio ${selected.responseRatio.toFixed(2)} = (${wt} + ${selected.burstTime}) / ${selected.burstTime}.`,
                reasonHi: available.length === 1
                    ? `t=${start} pe sirf ${selected.id} hi ready hai. Iska response ratio ${selected.responseRatio.toFixed(2)} hai. Koi competition nahi — seedha select!`
                    : `HRRN mein sabse zyada response ratio wala jeetega! Formula: (wait + burst) / burst. Sabke ratios: ${ratioDetails}. ${selected.id} ka wait = ${wt}, burst = ${selected.burstTime}, toh ratio = (${wt} + ${selected.burstTime}) / ${selected.burstTime} = ${selected.responseRatio.toFixed(2)} — ye sabse zyada hai, toh ${selected.id} select! 🏆`,
            });

            selected.isCompleted = true;
            completedCount++;
            currentTime = completion;
        } else {
            const nextArrivals = procs.filter(p => !p.isCompleted).sort((a, b) => a.arrivalTime - b.arrivalTime);
            if (nextArrivals.length > 0) {
                const nextArrival = nextArrivals[0].arrivalTime;

                results.push({
                    id: 'Idle',
                    processId: 'Idle',
                    startTime: currentTime,
                    endTime: nextArrival,
                    completionTime: nextArrival,
                    burstTime: nextArrival - currentTime,
                    isIdle: true,
                    reason: `No process available. CPU idle until next arrival at t=${nextArrival}.`,
                    reasonHi: `Koi process ready nahi hai abhi. CPU idle rahega jab tak next process t=${nextArrival} pe nahi aa jaata.`,
                });
                currentTime = nextArrival;
            } else {
                break;
            }
        }
    }

    return results;
}

/**
 * 6. Least Completed Next (LCN) - Preemptive
 * Also known as Shortest Job Next or similar variants. 
 * Prioritizes processes that have had the least CPU time so far.
 */
export function calculateLCN(processes) {
    if (!processes || processes.length === 0) return [];

    const results = [];
    let currentTime = 0;
    let completedCount = 0;

    const procs = [...processes].map(p => ({
        ...p,
        completedBurst: 0,
        isCompleted: false,
    }));

    let lastProcessId = null;
    let sliceStart = 0;

    while (completedCount < procs.length) {
        const available = procs.filter(p => !p.isCompleted && p.arrivalTime <= currentTime);

        if (available.length > 0) {
            // Prioritize process with minimal completed CPU time
            available.sort((a, b) => {
                if (a.completedBurst === b.completedBurst) return a.arrivalTime - b.arrivalTime;
                return a.completedBurst - b.completedBurst;
            });

            const selected = available[0];

            if (lastProcessId !== null && lastProcessId !== selected.id) {
                const prevProc = procs.find(p => p.id === lastProcessId);
                results.push({
                    id: lastProcessId,
                    arrivalTime: prevProc.arrivalTime,
                    burstTime: prevProc.burstTime,
                    startTime: sliceStart,
                    completionTime: currentTime,
                    isIdle: false,
                    reason: `${lastProcessId} runs t=${sliceStart}→${currentTime}. ${selected.id} has less CPU time (${selected.completedBurst} < ${prevProc.completedBurst}).`,
                    reasonHi: `${lastProcessId} t=${sliceStart} se t=${currentTime} tak chala. Ab dekhte hain — LCN mein jisne sabse kam CPU time use kiya ho usko priority milti hai. ${selected.id} ne sirf ${selected.completedBurst} units use kiye jo ${lastProcessId} ke ${prevProc.completedBurst} se kam hai. Toh ab ${selected.id} chalega!`,
                });
                sliceStart = currentTime;
            } else if (lastProcessId === null) {
                sliceStart = currentTime;
            }

            lastProcessId = selected.id;
            selected.completedBurst++;
            currentTime++;

            if (selected.completedBurst === selected.burstTime) {
                selected.isCompleted = true;
                completedCount++;
                
                const completionTime = currentTime;
                const turnaround = completionTime - selected.arrivalTime;
                const waiting = turnaround - selected.burstTime;

                results.push({
                    id: selected.id,
                    arrivalTime: selected.arrivalTime,
                    burstTime: selected.burstTime,
                    startTime: sliceStart,
                    completionTime: completionTime,
                    isIdle: false,
                    finalCompletion: completionTime,
                    turnaroundTime: turnaround,
                    waitingTime: waiting,
                    reason: `${selected.id} completes at t=${completionTime}. All ${selected.burstTime} burst units executed.`,
                    reasonHi: `${selected.id} ka kaam poora ho gaya t=${completionTime} pe! Iske total ${selected.burstTime} burst units sab execute ho chuke hain. ✅`,
                });

                results.forEach(res => {
                    if (res.id === selected.id) {
                        res.finalCompletion = completionTime;
                        res.turnaroundTime = turnaround;
                        res.waitingTime = waiting;
                    }
                });

                lastProcessId = null;
            }
        } else {
            if (lastProcessId !== null) {
                const prevProc = procs.find(p => p.id === lastProcessId);
                results.push({
                    id: lastProcessId,
                    arrivalTime: prevProc.arrivalTime,
                    burstTime: prevProc.burstTime,
                    startTime: sliceStart,
                    completionTime: currentTime,
                    isIdle: false,
                    reason: `${lastProcessId} runs t=${sliceStart}→${currentTime}. No more ready processes.`,
                    reasonHi: `${lastProcessId} t=${sliceStart} se t=${currentTime} tak chala. Ab koi aur process ready queue mein nahi hai.`,
                });
                lastProcessId = null;
            }

            const nextArrivals = procs.filter(p => !p.isCompleted).sort((a, b) => a.arrivalTime - b.arrivalTime);
            if (nextArrivals.length > 0) {
                const nextArrival = nextArrivals[0].arrivalTime;

                results.push({
                    id: 'Idle',
                    processId: 'Idle',
                    startTime: currentTime,
                    endTime: nextArrival,
                    completionTime: nextArrival,
                    burstTime: nextArrival - currentTime,
                    isIdle: true,
                    reason: `CPU idle — no processes available. Next arrival at t=${nextArrival}.`,
                    reasonHi: `CPU free hai — koi process abhi available nahi. Agle process ka wait hai jo t=${nextArrival} pe aayega.`,
                });
                currentTime = nextArrival;
                sliceStart = currentTime;
            } else {
                break;
            }
        }
    }

    return results;
}
