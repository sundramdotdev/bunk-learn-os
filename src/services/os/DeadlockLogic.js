/**
 * Deadlock Avoidance: Banker's Algorithm Logic
 * This module helps determine if a system is in a safe state and finds a safe sequence.
 */

/**
 * Banker's Algorithm
 * @param {Array} allocation Matrix (NxM) of currently allocated resources
 * @param {Array} max Matrix (NxM) of maximum resource requirements
 * @param {Array} available Array (M) of currently available resources
 * @param {Array} processIds Array (N) of process names/IDs
 * @returns {Object} { isSafe, safeSequence, logs, logsHi, steps, need }
 */
export function calculateBankersAlgorithm(allocation, max, available, processIds) {
    const n = allocation.length; // Number of processes
    const m = available.length; // Number of resource types

    // Calculate Need matrix: Need[i][j] = Max[i][j] - Allocation[i][j]
    const need = allocation.map((row, i) =>
        row.map((val, j) => max[i][j] - val)
    );

    const work = [...available];
    const finish = new Array(n).fill(false);
    const safeSequence = [];
    const logs = [];
    const steps = []; // For the explainer panel

    logs.push(`System initialized. Work: [${work.join(', ')}]. Need matrix calculated.`);
    steps.push({
        reason: `System initialized. Available resources: [${work.join(', ')}]. Need matrix = Max - Allocation.`,
        reasonHi: `System initialize hua. Available resources hain: [${work.join(', ')}]. Need matrix nikala: Need = Max - Allocation. Ab check karte hain kaunsa process safe hai.`,
        context: {
            'AVAILABLE': `[${work.join(', ')}]`,
            'PROCESSES': processIds.join(', '),
            'STATUS': 'Initialized',
        }
    });

    let count = 0;
    let round = 0;
    while (count < n) {
        let found = false;
        round++;
        for (let i = 0; i < n; i++) {
            if (!finish[i]) {
                // Check if all resource needs of process i can be satisfied by current work
                let canBeSatisfied = true;
                for (let j = 0; j < m; j++) {
                    if (need[i][j] > work[j]) {
                        canBeSatisfied = false;
                        break;
                    }
                }

                if (canBeSatisfied) {
                    logs.push(`Process ${processIds[i]} can be satisfied. Need: [${need[i].join(', ')}] <= Work: [${work.join(', ')}]`);
                    
                    const prevWork = [...work];
                    // Process can complete, release its allocated resources back to work
                    for (let j = 0; j < m; j++) {
                        work[j] += allocation[i][j];
                    }
                    finish[i] = true;
                    safeSequence.push(processIds[i]);
                    count++;
                    found = true;

                    logs.push(`Process ${processIds[i]} completed. New Work: [${work.join(', ')}]. Added to safe sequence.`);
                    steps.push({
                        reason: `${processIds[i]} can run! Need [${need[i].join(', ')}] ≤ Work [${prevWork.join(', ')}]. Completes → releases [${allocation[i].join(', ')}]. New Work: [${work.join(', ')}].`,
                        reasonHi: `${processIds[i]} chal sakta hai! Isko Need [${need[i].join(', ')}] chahiye aur Work mein [${prevWork.join(', ')}] available hai — sab mil jayega. Toh ${processIds[i]} execute hoga, apne allocated resources [${allocation[i].join(', ')}] wapas dega. Ab naya Work ho gaya: [${work.join(', ')}]. Safe sequence mein add: ${safeSequence.join(' → ')}. ✅`,
                        context: {
                            'PROCESS': processIds[i],
                            'NEED': `[${need[i].join(', ')}]`,
                            'WORK_BEFORE': `[${prevWork.join(', ')}]`,
                            'RELEASED': `[${allocation[i].join(', ')}]`,
                            'WORK_AFTER': `[${work.join(', ')}]`,
                            'SAFE_SEQ': safeSequence.join(' → '),
                        }
                    });
                }
            }
        }

        if (!found) {
            logs.push("Deadlock detected or unsafe state. No more processes can be satisfied.");
            const unfinished = processIds.filter((_, i) => !finish[i]);
            steps.push({
                reason: `UNSAFE STATE! No remaining process can be satisfied. Stuck: [${unfinished.join(', ')}]. Work: [${work.join(', ')}].`,
                reasonHi: `UNSAFE STATE! Koi bhi bacha hua process satisfy nahi ho sakta. Stuck processes: [${unfinished.join(', ')}]. Available resources [${work.join(', ')}] se kisi ka Need poora nahi hota. Deadlock ho sakta hai! ⚠️`,
                context: {
                    'STATUS': '⚠️ UNSAFE / DEADLOCK',
                    'STUCK': unfinished.join(', '),
                    'WORK': `[${work.join(', ')}]`,
                }
            });
            return {
                isSafe: false,
                safeSequence: [],
                logs,
                steps,
                need
            };
        }
    }

    logs.push(`System is in a SAFE STATE. Safe Sequence: ${safeSequence.join(' -> ')}`);
    steps.push({
        reason: `System is SAFE! All processes can complete. Safe Sequence: ${safeSequence.join(' → ')}.`,
        reasonHi: `System SAFE hai! Saare processes successfully complete ho sakte hain. Final safe sequence: ${safeSequence.join(' → ')}. Koi deadlock nahi hoga! 🎉`,
        context: {
            'STATUS': '✅ SAFE',
            'SAFE_SEQUENCE': safeSequence.join(' → '),
            'FINAL_WORK': `[${work.join(', ')}]`,
        }
    });

    return {
        isSafe: true,
        safeSequence,
        logs,
        steps,
        need
    };
}
