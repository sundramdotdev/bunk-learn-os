// GraphLogic.js

// Deep clone for frames
const cloneGraphState = (nodes, edges, extraData = {}) => ({
    nodes: nodes.map(n => ({...n})),
    edges: edges.map(e => ({...e})),
    ...extraData
});

// Helper for adjacency list
export const buildAdjacencyList = (nodes, edges, directed) => {
    const adj = {};
    nodes.forEach(n => adj[n.id] = []);
    edges.forEach(e => {
        adj[e.source].push({ to: e.target, weight: e.weight });
        if (!directed) {
            adj[e.target].push({ to: e.source, weight: e.weight });
        }
    });
    return adj;
};

// --- Algorithms ---
// Each returns an array of frames.
// Frame format: { nodes, edges, activeNode, visitedNodes, msg, ...extra }

export const runBFS = (nodes, edges, startNodeId, directed) => {
    const frames = [];
    const adj = buildAdjacencyList(nodes, edges, directed);
    const visited = new Set();
    const q = [startNodeId];
    visited.add(startNodeId);

    frames.push(cloneGraphState(nodes, edges, { activeNode: null, visitedNodes: [...visited], msg: `Start BFS from node ${startNodeId}`, q: [...q] }));

    while (q.length > 0) {
        const curr = q.shift();
        frames.push(cloneGraphState(nodes, edges, { activeNode: curr, visitedNodes: [...visited], msg: `Dequeued node ${curr}`, q: [...q] }));

        for (let neighbor of adj[curr]) {
            if (!visited.has(neighbor.to)) {
                visited.add(neighbor.to);
                q.push(neighbor.to);
                frames.push(cloneGraphState(nodes, edges, { activeNode: curr, visitedNodes: [...visited], msg: `Visited neighbor ${neighbor.to}`, q: [...q] }));
            }
        }
    }
    frames.push(cloneGraphState(nodes, edges, { activeNode: null, visitedNodes: [...visited], msg: 'BFS Complete', q: [] }));
    return frames;
};

export const runDFS = (nodes, edges, startNodeId, directed) => {
    const frames = [];
    const adj = buildAdjacencyList(nodes, edges, directed);
    const visited = new Set();

    const dfs = (curr) => {
        visited.add(curr);
        frames.push(cloneGraphState(nodes, edges, { activeNode: curr, visitedNodes: [...visited], msg: `Visited node ${curr}` }));

        for (let neighbor of adj[curr]) {
            if (!visited.has(neighbor.to)) {
                dfs(neighbor.to);
                // Backtrack frame
                frames.push(cloneGraphState(nodes, edges, { activeNode: curr, visitedNodes: [...visited], msg: `Backtracked to ${curr}` }));
            }
        }
    };
    
    dfs(startNodeId);
    frames.push(cloneGraphState(nodes, edges, { activeNode: null, visitedNodes: [...visited], msg: 'DFS Complete' }));
    return frames;
};

export const runDijkstra = (nodes, edges, startNodeId, directed) => {
    const frames = [];
    const adj = buildAdjacencyList(nodes, edges, directed);
    const dist = {};
    const visited = new Set();
    nodes.forEach(n => dist[n.id] = Infinity);
    dist[startNodeId] = 0;

    let pq = [{ id: startNodeId, d: 0 }];

    frames.push(cloneGraphState(nodes, edges, { activeNode: null, visitedNodes: [...visited], dist: {...dist}, pq: [...pq], msg: `Initialize Dijkstra from ${startNodeId}` }));

    while (pq.length > 0) {
        pq.sort((a, b) => a.d - b.d);
        const { id: u, d: currDist } = pq.shift();

        if (visited.has(u)) continue;
        visited.add(u);
        
        frames.push(cloneGraphState(nodes, edges, { activeNode: u, visitedNodes: [...visited], dist: {...dist}, pq: [...pq], msg: `Extracted ${u} with distance ${currDist}` }));

        for (let edge of adj[u]) {
            const v = edge.to;
            const weight = edge.weight || 1;
            if (!visited.has(v) && dist[u] + weight < dist[v]) {
                dist[v] = dist[u] + weight;
                pq.push({ id: v, d: dist[v] });
                frames.push(cloneGraphState(nodes, edges, { activeNode: u, visitedNodes: [...visited], dist: {...dist}, pq: [...pq], msg: `Relaxed edge ${u}->${v}, new dist: ${dist[v]}` }));
            }
        }
    }

    frames.push(cloneGraphState(nodes, edges, { activeNode: null, visitedNodes: [...visited], dist: {...dist}, pq: [], msg: 'Dijkstra Complete' }));
    return frames;
};
