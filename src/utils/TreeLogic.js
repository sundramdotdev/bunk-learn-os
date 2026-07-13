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

    return { height: root ? maxDepth : 0, leaves, internal };
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
    const levelHeight = 60;
    
    const traverse = (node, x, y, xOffset) => {
        if (!node) return;
        nodes.push({ ...node, x, y });
        if (node.left) {
            edges.push({ x1: x, y1: y, x2: x - xOffset, y2: y + levelHeight });
            traverse(node.left, x - xOffset, y + levelHeight, xOffset / 2.2);
        }
        if (node.right) {
            edges.push({ x1: x, y1: y, x2: x + xOffset, y2: y + levelHeight });
            traverse(node.right, x + xOffset, y + levelHeight, xOffset / 2.2);
        }
    };
    
    if (root) traverse(root, width / 2, 40, width / 4);
    
    return { nodes, edges };
};
