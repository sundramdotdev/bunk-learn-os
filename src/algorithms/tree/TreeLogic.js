export class TreeNode {
    constructor(value, id = Math.random().toString(36).substr(2, 9)) {
        this.value = value;
        this.id = id;
        this.left = null;
        this.right = null;
        this.height = 1; // AVL
        this.color = 'red'; // RBT, default red
        this.parent = null; // RBT
    }
}

// Deep clone a tree for animation frames
export const cloneTree = (root, parent = null) => {
    if (!root) return null;
    const newNode = new TreeNode(root.value, root.id);
    newNode.height = root.height;
    newNode.color = root.color;
    newNode.parent = parent;
    newNode.left = cloneTree(root.left, newNode);
    newNode.right = cloneTree(root.right, newNode);
    return newNode;
};

// --- Binary Search Tree ---
export class BST {
    constructor() {
        this.root = null;
    }

    insert(value) {
        const frames = [];
        if (!this.root) {
            this.root = new TreeNode(value);
            frames.push({ tree: cloneTree(this.root), highlight: [this.root.id], msg: `Inserted ${value} as root.` });
            return frames;
        }

        let curr = this.root;
        while (curr) {
            frames.push({ tree: cloneTree(this.root), highlight: [curr.id], msg: `Comparing ${value} with ${curr.value}` });
            if (value < curr.value) {
                if (!curr.left) {
                    curr.left = new TreeNode(value);
                    frames.push({ tree: cloneTree(this.root), highlight: [curr.left.id], msg: `Inserted ${value} to the left of ${curr.value}` });
                    break;
                }
                curr = curr.left;
            } else if (value > curr.value) {
                if (!curr.right) {
                    curr.right = new TreeNode(value);
                    frames.push({ tree: cloneTree(this.root), highlight: [curr.right.id], msg: `Inserted ${value} to the right of ${curr.value}` });
                    break;
                }
                curr = curr.right;
            } else {
                frames.push({ tree: cloneTree(this.root), highlight: [curr.id], msg: `Value ${value} already exists.` });
                break;
            }
        }
        return frames;
    }

    search(value) {
        const frames = [];
        let curr = this.root;
        while (curr) {
            frames.push({ tree: cloneTree(this.root), highlight: [curr.id], msg: `Checking ${curr.value}` });
            if (value === curr.value) {
                frames.push({ tree: cloneTree(this.root), highlight: [curr.id], msg: `Found ${value}!` });
                return frames;
            }
            if (value < curr.value) {
                curr = curr.left;
            } else {
                curr = curr.right;
            }
        }
        frames.push({ tree: cloneTree(this.root), highlight: [], msg: `Value ${value} not found.` });
        return frames;
    }

    remove(value) {
        const frames = [];
        // Helper to find min
        const getMin = (node) => {
            let curr = node;
            while (curr && curr.left) curr = curr.left;
            return curr;
        };

        const removeNode = (node, val) => {
            if (!node) return null;
            frames.push({ tree: cloneTree(this.root), highlight: [node.id], msg: `Checking ${node.value}` });
            
            if (val < node.value) {
                node.left = removeNode(node.left, val);
            } else if (val > node.value) {
                node.right = removeNode(node.right, val);
            } else {
                frames.push({ tree: cloneTree(this.root), highlight: [node.id], msg: `Found ${val} to delete.` });
                // Node with one child or no child
                if (!node.left) return node.right;
                if (!node.right) return node.left;

                // Node with two children
                const temp = getMin(node.right);
                frames.push({ tree: cloneTree(this.root), highlight: [temp.id], msg: `Finding inorder successor (${temp.value})` });
                node.value = temp.value;
                frames.push({ tree: cloneTree(this.root), highlight: [node.id], msg: `Replaced with successor (${temp.value})` });
                node.right = removeNode(node.right, temp.value);
            }
            return node;
        };

        this.root = removeNode(this.root, value);
        frames.push({ tree: cloneTree(this.root), highlight: [], msg: `Deletion complete.` });
        return frames;
    }
}

// --- AVL Tree ---
export class AVLTree extends BST {
    getHeight(node) { return node ? node.height : 0; }
    getBalance(node) { return node ? this.getHeight(node.left) - this.getHeight(node.right) : 0; }
    updateHeight(node) { if (node) node.height = Math.max(this.getHeight(node.left), this.getHeight(node.right)) + 1; }

    rightRotate(y, frames, rootRef) {
        const x = y.left;
        const T2 = x.right;
        x.right = y;
        y.left = T2;
        this.updateHeight(y);
        this.updateHeight(x);
        frames.push({ tree: cloneTree(rootRef.current), highlight: [x.id, y.id], msg: `Right Rotation on ${y.value}` });
        return x;
    }

    leftRotate(x, frames, rootRef) {
        const y = x.right;
        const T2 = y.left;
        y.left = x;
        x.right = T2;
        this.updateHeight(x);
        this.updateHeight(y);
        frames.push({ tree: cloneTree(rootRef.current), highlight: [x.id, y.id], msg: `Left Rotation on ${x.value}` });
        return y;
    }

    insert(value) {
        const frames = [];
        const rootRef = { current: this.root };

        const insertNode = (node, val) => {
            if (!node) {
                const n = new TreeNode(val);
                frames.push({ tree: cloneTree(rootRef.current || n), highlight: [n.id], msg: `Inserted ${val}` });
                return n;
            }

            frames.push({ tree: cloneTree(rootRef.current), highlight: [node.id], msg: `Comparing ${val} with ${node.value}` });

            if (val < node.value) {
                node.left = insertNode(node.left, val);
            } else if (val > node.value) {
                node.right = insertNode(node.right, val);
            } else {
                return node;
            }

            this.updateHeight(node);
            const balance = this.getBalance(node);

            // LL Case
            if (balance > 1 && val < node.left.value) {
                frames.push({ tree: cloneTree(rootRef.current), highlight: [node.id], msg: `LL Imbalance detected at ${node.value}` });
                return this.rightRotate(node, frames, rootRef);
            }
            // RR Case
            if (balance < -1 && val > node.right.value) {
                frames.push({ tree: cloneTree(rootRef.current), highlight: [node.id], msg: `RR Imbalance detected at ${node.value}` });
                return this.leftRotate(node, frames, rootRef);
            }
            // LR Case
            if (balance > 1 && val > node.left.value) {
                frames.push({ tree: cloneTree(rootRef.current), highlight: [node.id], msg: `LR Imbalance detected at ${node.value}` });
                node.left = this.leftRotate(node.left, frames, rootRef);
                return this.rightRotate(node, frames, rootRef);
            }
            // RL Case
            if (balance < -1 && val < node.right.value) {
                frames.push({ tree: cloneTree(rootRef.current), highlight: [node.id], msg: `RL Imbalance detected at ${node.value}` });
                node.right = this.rightRotate(node.right, frames, rootRef);
                return this.leftRotate(node, frames, rootRef);
            }

            return node;
        };

        this.root = insertNode(this.root, value);
        rootRef.current = this.root;
        frames.push({ tree: cloneTree(this.root), highlight: [], msg: `Insertion complete.` });
        return frames;
    }
}

// Tree utilities for UI
export const isTreeBalanced = (root) => {
    const checkHeight = (node) => {
        if (!node) return 0;
        const leftH = checkHeight(node.left);
        if (leftH === -1) return -1;
        const rightH = checkHeight(node.right);
        if (rightH === -1) return -1;
        
        if (Math.abs(leftH - rightH) > 1) return -1;
        return Math.max(leftH, rightH) + 1;
    };
    if (!root) return true;
    return checkHeight(root) !== -1;
};

export const buildBalancedBST = (values) => {
    if (!values || values.length === 0) return null;
    const uniqueSorted = [...new Set(values)].sort((a, b) => a - b);
    
    const build = (arr, start, end) => {
        if (start > end) return null;
        const mid = Math.floor((start + end) / 2);
        const node = new TreeNode(arr[mid]);
        node.left = build(arr, start, mid - 1);
        node.right = build(arr, mid + 1, end);
        return node;
    };
    
    const newBST = new BST();
    newBST.root = build(uniqueSorted, 0, uniqueSorted.length - 1);
    return newBST;
};

export const getTreeStats = (root) => {
    let leaves = 0;
    let internal = 0;
    let maxDepth = 0;

    const traverse = (node, depth) => {
        if (!node) return;
        maxDepth = Math.max(maxDepth, depth);
        if (!node.left && !node.right) leaves++;
        else internal++;
        traverse(node.left, depth + 1);
        traverse(node.right, depth + 1);
    };
    traverse(root, 1);

    const isBalanced = isTreeBalanced(root);

    return { 
        height: root ? maxDepth : 0, 
        leaves, 
        internal,
        isBalanced,
        timeComplexityAvg: "O(log n)",
        timeComplexityWorst: isBalanced ? "O(log n)" : "O(n)"
    };
};

export const getTraversals = (root) => {
    const pre = [], inOrder = [], post = [], level = [];
    
    const preO = (n) => { if (n) { pre.push(n.value); preO(n.left); preO(n.right); } };
    const inO = (n) => { if (n) { inO(n.left); inOrder.push(n.value); inO(n.right); } };
    const postO = (n) => { if (n) { postO(n.left); postO(n.right); post.push(n.value); } };
    
    preO(root); inO(root); postO(root);

    if (root) {
        const q = [root];
        while (q.length > 0) {
            const n = q.shift();
            level.push(n.value);
            if (n.left) q.push(n.left);
            if (n.right) q.push(n.right);
        }
    }

    return { pre, inOrder, post, level };
};

// Layout computation for SVG (returns array of nodes with x,y and edges)
export const computeTreeLayout = (root, width, height) => {
    const nodes = [];
    const edges = [];
    const NODE_WIDTH = 50; // Base spacing for a node
    const LEVEL_HEIGHT = 70; // Vertical spacing between levels
    const SPACING = 20; // Extra horizontal spacing between subtrees

    // Pass 1: Compute subtree widths
    const computeSubtreeWidth = (node) => {
        if (!node) return 0;
        const leftW = computeSubtreeWidth(node.left);
        const rightW = computeSubtreeWidth(node.right);
        
        let w = 0;
        if (leftW === 0 && rightW === 0) {
            w = NODE_WIDTH;
        } else if (leftW > 0 && rightW > 0) {
            w = leftW + rightW + SPACING;
        } else {
            w = leftW + rightW;
        }
        node._subtreeWidth = w;
        return w;
    };
    
    computeSubtreeWidth(root);

    // Pass 2: Assign coordinates
    const assignCoords = (node, x, y) => {
        if (!node) return;
        nodes.push({ ...node, x, y });

        if (node.left) {
            const leftW = node.left._subtreeWidth;
            let offset = (node._subtreeWidth / 2) - (leftW / 2);
            if (!node.right) offset = NODE_WIDTH / 2; // single child
            
            const childX = x - offset;
            const childY = y + LEVEL_HEIGHT;
            edges.push({ x1: x, y1: y, x2: childX, y2: childY });
            assignCoords(node.left, childX, childY);
        }

        if (node.right) {
            const rightW = node.right._subtreeWidth;
            let offset = (node._subtreeWidth / 2) - (rightW / 2);
            if (!node.left) offset = NODE_WIDTH / 2; // single child
            
            const childX = x + offset;
            const childY = y + LEVEL_HEIGHT;
            edges.push({ x1: x, y1: y, x2: childX, y2: childY });
            assignCoords(node.right, childX, childY);
        }
    };

    if (root) assignCoords(root, 0, 40);

    // Compute bounding box for auto-fit
    let bounds = { minX: 0, maxX: width || 800, minY: 0, maxY: height || 400 };
    if (nodes.length > 0) {
        const padding = 60;
        bounds.minX = Math.min(...nodes.map(n => n.x)) - padding;
        bounds.maxX = Math.max(...nodes.map(n => n.x)) + padding;
        bounds.minY = 0; // Top is always near 0
        bounds.maxY = Math.max(...nodes.map(n => n.y)) + padding;
    }

    return { nodes, edges, bounds };
};
