/**
 * Page Replacement Algorithms Logic
 * This module exports FIFO, LRU, Optimal, Random, and NRU functions.
 * Each history step now includes reason/reasonHi for explainer support.
 */

const createMetrics = (hits, faults, total) => {
  const hitRatio = total > 0 ? (hits / total) : 0;
  const faultRatio = total > 0 ? (faults / total) : 0;
  return {
    totalHits: hits,
    totalFaults: faults,
    totalRequests: total,
    hitRatio: (hitRatio * 100).toFixed(2),
    faultRatio: (faultRatio * 100).toFixed(2),
    formula: `(${hits} / ${total}) * 100`
  };
};

export function calculateFIFO(referenceString, frameCount) {
  const frames = new Array(frameCount).fill(null);
  const history = [];
  let hits = 0;
  let faults = 0;

  referenceString.forEach((page, idx) => {
    const prevFrames = [...frames];
    let isHit = frames.includes(page);
    if (isHit) {
      hits++;
      history.push({
        page,
        status: 'Hit',
        frames: [...frames],
        reason: `Page ${page} already in frames [${frames.filter(f=>f!==null).join(', ')}]. HIT — no replacement needed.`,
        reasonHi: `Page ${page} pehle se frames mein hai [${frames.filter(f=>f!==null).join(', ')}]. HIT! Koi replacement nahi chahiye. ✅`,
      });
    } else {
      faults++;
      const evicted = frames[0];
      const hadEmpty = frames.includes(null);
      frames.shift();
      frames.push(page);
      if (hadEmpty) {
        history.push({
          page,
          status: 'Fault',
          frames: [...frames],
          reason: `Page ${page} not in frames. FAULT — loaded into empty frame. Frames: [${frames.filter(f=>f!==null).join(', ')}].`,
          reasonHi: `Page ${page} frames mein nahi mila — PAGE FAULT! Ek frame khaali tha, toh usme page ${page} load kar diya. Frames: [${frames.filter(f=>f!==null).join(', ')}].`,
        });
      } else {
        history.push({
          page,
          status: 'Fault',
          frames: [...frames],
          reason: `Page ${page} not in frames. FAULT — FIFO evicts oldest page ${evicted}, loads ${page}. Frames: [${frames.join(', ')}].`,
          reasonHi: `Page ${page} frames mein nahi hai — PAGE FAULT! FIFO mein sabse purana page nikaala jaata hai. ${evicted} sabse pehle aaya tha, toh usse hataao aur ${page} daalo. Frames: [${frames.join(', ')}].`,
        });
      }
    }
  });

  return {
    history,
    metrics: createMetrics(hits, faults, referenceString.length)
  };
}

export function calculateLRU(referenceString, frameCount) {
  const frames = new Array(frameCount).fill(null);
  const history = [];
  const lastUsed = new Array(frameCount).fill(-1);
  let hits = 0;
  let faults = 0;

  referenceString.forEach((page, time) => {
    let isHit = frames.includes(page);
    if (isHit) {
      hits++;
      const idx = frames.indexOf(page);
      lastUsed[idx] = time;
      history.push({
        page,
        status: 'Hit',
        frames: [...frames],
        reason: `Page ${page} found in frames. HIT — updated last-used time to ${time}.`,
        reasonHi: `Page ${page} frames mein mil gaya! HIT! Iska last-used time update kar diya: ${time}. ✅`,
      });
    } else {
      faults++;
      let replaceIdx = -1;
      let evicted = null;
      if (frames.includes(null)) {
        replaceIdx = frames.indexOf(null);
      } else {
        replaceIdx = 0;
        let minTime = lastUsed[0];
        for (let i = 1; i < frameCount; i++) {
          if (lastUsed[i] < minTime) {
            minTime = lastUsed[i];
            replaceIdx = i;
          }
        }
        evicted = frames[replaceIdx];
      }
      frames[replaceIdx] = page;
      lastUsed[replaceIdx] = time;

      if (evicted !== null) {
        history.push({
          page,
          status: 'Fault',
          frames: [...frames],
          reason: `Page ${page} not found. FAULT — LRU evicts page ${evicted} (least recently used). Frames: [${frames.join(', ')}].`,
          reasonHi: `Page ${page} frames mein nahi mila — PAGE FAULT! LRU mein sabse purana use hua page nikaala jaata hai. Page ${evicted} sabse pehle use hua tha (sabse kam recent), toh usse hataao aur ${page} daalo. Frames: [${frames.join(', ')}].`,
        });
      } else {
        history.push({
          page,
          status: 'Fault',
          frames: [...frames],
          reason: `Page ${page} not found. FAULT — loaded into empty frame. Frames: [${frames.filter(f=>f!==null).join(', ')}].`,
          reasonHi: `Page ${page} frames mein nahi tha — PAGE FAULT! Empty frame mein load kar diya. Frames: [${frames.filter(f=>f!==null).join(', ')}].`,
        });
      }
    }
  });

  return {
    history,
    metrics: createMetrics(hits, faults, referenceString.length)
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
      history.push({
        page,
        status: 'Hit',
        frames: [...frames],
        reason: `Page ${page} found in frames. HIT — no replacement needed.`,
        reasonHi: `Page ${page} already frames mein hai! HIT! Kuch karne ki zaroorat nahi. ✅`,
      });
    } else {
      faults++;
      let replaceIdx = -1;
      let evicted = null;
      if (frames.includes(null)) {
        replaceIdx = frames.indexOf(null);
      } else {
        let farthestTime = -1;
        replaceIdx = 0;
        let farthestPage = frames[0];
        for (let i = 0; i < frameCount; i++) {
          const futureIndex = referenceString.slice(time + 1).indexOf(frames[i]);
          if (futureIndex === -1) {
            replaceIdx = i;
            farthestPage = frames[i];
            break;
          } else if (futureIndex > farthestTime) {
            farthestTime = futureIndex;
            replaceIdx = i;
            farthestPage = frames[i];
          }
        }
        evicted = frames[replaceIdx];
      }
      frames[replaceIdx] = page;

      if (evicted !== null) {
        // Check future use of evicted
        const futureUse = referenceString.slice(time + 1).indexOf(evicted);
        const futureStr = futureUse === -1 ? 'never used again' : `used again at step ${time + 1 + futureUse + 1}`;
        history.push({
          page,
          status: 'Fault',
          frames: [...frames],
          reason: `Page ${page} not found. FAULT — Optimal evicts page ${evicted} (${futureStr}). Frames: [${frames.join(', ')}].`,
          reasonHi: `Page ${page} nahi mila — PAGE FAULT! Optimal mein future dekhte hain — kaunsa page sabse der baad lagega. Page ${evicted} ${futureUse === -1 ? 'aage kabhi nahi lagega' : `aage step ${time + 1 + futureUse + 1} pe lagega (sabse door)`}. Toh ${evicted} hataao, ${page} daalo. Frames: [${frames.join(', ')}].`,
        });
      } else {
        history.push({
          page,
          status: 'Fault',
          frames: [...frames],
          reason: `Page ${page} not found. FAULT — loaded into empty frame. Frames: [${frames.filter(f=>f!==null).join(', ')}].`,
          reasonHi: `Page ${page} nahi tha — PAGE FAULT! Empty frame tha, toh usme load. Frames: [${frames.filter(f=>f!==null).join(', ')}].`,
        });
      }
    }
  });

  return {
    history,
    metrics: createMetrics(hits, faults, referenceString.length)
  };
}

export function calculateRAND(referenceString, frameCount) {
  const frames = new Array(frameCount).fill(null);
  const history = [];
  let hits = 0;
  let faults = 0;

  referenceString.forEach((page) => {
    let isHit = frames.includes(page);
    if (isHit) {
      hits++;
      history.push({
        page,
        status: 'Hit',
        frames: [...frames],
        reason: `Page ${page} found in frames. HIT.`,
        reasonHi: `Page ${page} frames mein mil gaya. HIT! ✅`,
      });
    } else {
      faults++;
      let replaceIdx = -1;
      let evicted = null;
      if (frames.includes(null)) {
        replaceIdx = frames.indexOf(null);
      } else {
        replaceIdx = Math.floor(Math.random() * frameCount);
        evicted = frames[replaceIdx];
      }
      frames[replaceIdx] = page;

      if (evicted !== null) {
        history.push({
          page,
          status: 'Fault',
          frames: [...frames],
          reason: `Page ${page} not found. FAULT — Random picked frame ${replaceIdx} (page ${evicted}). Frames: [${frames.join(', ')}].`,
          reasonHi: `Page ${page} nahi mila — PAGE FAULT! Random replacement mein koi bhi frame randomly hata sakte hain. Frame ${replaceIdx} (page ${evicted}) randomly select hua. ${page} daala. Frames: [${frames.join(', ')}].`,
        });
      } else {
        history.push({
          page,
          status: 'Fault',
          frames: [...frames],
          reason: `Page ${page} not found. FAULT — loaded into empty frame. Frames: [${frames.filter(f=>f!==null).join(', ')}].`,
          reasonHi: `Page ${page} nahi tha — PAGE FAULT! Empty frame mein load. Frames: [${frames.filter(f=>f!==null).join(', ')}].`,
        });
      }
    }
  });

  return {
    history,
    metrics: createMetrics(hits, faults, referenceString.length)
  };
}

export function calculateNRU(referenceString, frameCount) {
  const frames = new Array(frameCount).fill(null);
  // Each frame will store { page, R, M }
  const frameMetadata = new Array(frameCount).fill(null).map(() => ({ page: null, R: 0, M: 0 }));
  const history = [];
  let hits = 0;
  let faults = 0;

  referenceString.forEach((page, time) => {
    // In NRU, we find if page exists
    let existingIdx = frameMetadata.findIndex(f => f.page === page);
    let isHit = existingIdx !== -1;

    if (isHit) {
      hits++;
      frameMetadata[existingIdx].R = 1;
      // Simulate a "Modify" bit with 10% chance on hit too, or just keep it 
      if (Math.random() < 0.1) frameMetadata[existingIdx].M = 1;
      history.push({
        page,
        status: 'Hit',
        frames: frameMetadata.map(f => f.page),
        metadata: frameMetadata.map(f => ({ ...f })),
        reason: `Page ${page} found. HIT — Reference bit R set to 1.`,
        reasonHi: `Page ${page} frames mein mil gaya! HIT! Reference bit (R) 1 kar diya — isko recently use hua mark kiya. ✅`,
      });
    } else {
      faults++;
      let replaceIdx = -1;
      let evicted = null;
      let emptyIdx = frameMetadata.findIndex(f => f.page === null);
      let evictClass = -1;
      
      if (emptyIdx !== -1) {
        replaceIdx = emptyIdx;
      } else {
        // Find by class
        const getStandardClass = (f) => {
            if (f.R === 0 && f.M === 0) return 0;
            if (f.R === 0 && f.M === 1) return 1;
            if (f.R === 1 && f.M === 0) return 2;
            return 3;
        };

        let classes = [[], [], [], []];
        frameMetadata.forEach((f, i) => {
            classes[getStandardClass(f)].push(i);
        });

        for (let c = 0; c < 4; c++) {
            if (classes[c].length > 0) {
                // Pick random from the lowest class
                const options = classes[c];
                replaceIdx = options[Math.floor(Math.random() * options.length)];
                evictClass = c;
                break;
            }
        }
        evicted = frameMetadata[replaceIdx].page;
      }
      
      frameMetadata[replaceIdx] = {
        page: page,
        R: 1,
        M: Math.random() < 0.3 ? 1 : 0 // Simulate R/M bits as proposed
      };

      if (evicted !== null) {
        const classNames = ['Class 0 (R=0,M=0)', 'Class 1 (R=0,M=1)', 'Class 2 (R=1,M=0)', 'Class 3 (R=1,M=1)'];
        history.push({
          page,
          status: 'Fault',
          frames: frameMetadata.map(f => f.page),
          metadata: frameMetadata.map(f => ({ ...f })),
          reason: `Page ${page} not found. FAULT — NRU evicts page ${evicted} from ${classNames[evictClass]}.`,
          reasonHi: `Page ${page} nahi mila — PAGE FAULT! NRU mein 4 classes hain (Class 0 sabse low priority pe replace hota hai). Page ${evicted} ${classNames[evictClass]} mein tha — sabse kam important. Toh ${evicted} hataao, ${page} daalo.`,
        });
      } else {
        history.push({
          page,
          status: 'Fault',
          frames: frameMetadata.map(f => f.page),
          metadata: frameMetadata.map(f => ({ ...f })),
          reason: `Page ${page} not found. FAULT — loaded into empty frame.`,
          reasonHi: `Page ${page} nahi tha — PAGE FAULT! Empty frame tha, toh usme load kar diya.`,
        });
      }
    }

    // Periodically clear R bits (every 10 references)
    if ((time + 1) % 10 === 0) {
        frameMetadata.forEach(f => { if(f.page !== null) f.R = 0; });
    }
  });

  return {
    history,
    metrics: createMetrics(hits, faults, referenceString.length)
  };
}

export function calculateMRU(referenceString, frameCount) {
  const frames = new Array(frameCount).fill(null);
  const history = [];
  const lastUsed = new Array(frameCount).fill(-1);
  let hits = 0;
  let faults = 0;

  referenceString.forEach((page, time) => {
    let isHit = frames.includes(page);
    if (isHit) {
      hits++;
      const idx = frames.indexOf(page);
      lastUsed[idx] = time;
      history.push({
        page,
        status: 'Hit',
        frames: [...frames],
        reason: `Page ${page} found in frames. HIT — updated last-used time to ${time}.`,
        reasonHi: `Page ${page} frames mein mil gaya! HIT! Iska last-used time update kar diya: ${time}. ✅`,
      });
    } else {
      faults++;
      let replaceIdx = -1;
      let evicted = null;
      if (frames.includes(null)) {
        replaceIdx = frames.indexOf(null);
      } else {
        replaceIdx = 0;
        let maxTime = lastUsed[0];
        for (let i = 1; i < frameCount; i++) {
          if (lastUsed[i] > maxTime) {
            maxTime = lastUsed[i];
            replaceIdx = i;
          }
        }
        evicted = frames[replaceIdx];
      }
      frames[replaceIdx] = page;
      lastUsed[replaceIdx] = time;

      if (evicted !== null) {
        history.push({
          page,
          status: 'Fault',
          frames: [...frames],
          reason: `Page ${page} not found. FAULT — MRU evicts page ${evicted} (most recently used). Frames: [${frames.join(', ')}].`,
          reasonHi: `Page ${page} frames mein nahi mila — PAGE FAULT! MRU mein sabse recently use hua page nikaala jaata hai. Page ${evicted} abhi-abhi use hua tha (sabse recent), toh usse hataao aur ${page} daalo. Frames: [${frames.join(', ')}].`,
        });
      } else {
        history.push({
          page,
          status: 'Fault',
          frames: [...frames],
          reason: `Page ${page} not found. FAULT — loaded into empty frame. Frames: [${frames.filter(f=>f!==null).join(', ')}].`,
          reasonHi: `Page ${page} frames mein nahi tha — PAGE FAULT! Empty frame mein load kar diya. Frames: [${frames.filter(f=>f!==null).join(', ')}].`,
        });
      }
    }
  });

  return {
    history,
    metrics: createMetrics(hits, faults, referenceString.length)
  };
}
