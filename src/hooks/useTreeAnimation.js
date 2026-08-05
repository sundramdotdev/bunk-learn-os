import { useState, useEffect, useRef, useCallback } from 'react';
import { BST, AVLTree } from '../algorithms/tree/TreeLogic';

export function useTreeAnimation() {
    const [treeType, setTreeType] = useState('BST');
    const [treeInstance, setTreeInstance] = useState(new BST());
    const [frames, setFrames] = useState([]);
    const [currentFrameIdx, setCurrentFrameIdx] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [inputValue, setInputValue] = useState('');
    
    // UI State
    const [svgWidth, setSvgWidth] = useState(800);
    const svgRef = useRef(null);
    const timerRef = useRef(null);

    const [isBalancedMode, setIsBalancedMode] = useState(false);

    // Initial resize observer for SVG
    useEffect(() => {
        if (svgRef.current) {
            const resizeObserver = new ResizeObserver(entries => {
                for (let entry of entries) {
                    setSvgWidth(entry.contentRect.width);
                }
            });
            resizeObserver.observe(svgRef.current);
            return () => resizeObserver.disconnect();
        }
    }, []);

    const handleReset = useCallback(() => {
        setIsPlaying(false);
        setCurrentFrameIdx(frames.length > 0 ? frames.length - 1 : 0);
        if (timerRef.current) clearInterval(timerRef.current);
    }, [frames]);

    // Change tree type
    useEffect(() => {
        setIsPlaying(false);
        setCurrentFrameIdx(0);
        setFrames([]);
        if (timerRef.current) clearInterval(timerRef.current);
        
        if (treeType === 'BST') setTreeInstance(new BST());
        else if (treeType === 'AVL') setTreeInstance(new AVLTree());
    }, [treeType]);

    // Rebuild tree when balanced mode is toggled (if switching to true)
    useEffect(() => {
        if (isBalancedMode && treeType === 'BST' && treeInstance.root) {
            import('../algorithms/tree/TreeLogic').then(({ getTraversals, buildBalancedBST }) => {
                const vals = getTraversals(treeInstance.root).inOrder;
                if (vals.length > 0) {
                    const newTree = buildBalancedBST(vals);
                    setTreeInstance(newTree);
                    setFrames([{ tree: newTree.root, highlight: [], msg: 'Rebuilt into Balanced BST' }]);
                    setCurrentFrameIdx(0);
                    setIsPlaying(false);
                }
            });
        }
    }, [isBalancedMode, treeType]); // Deliberately omit treeInstance to avoid loop

    // Animation Loop
    useEffect(() => {
        if (isPlaying && frames.length > 0) {
            timerRef.current = setInterval(() => {
                setCurrentFrameIdx(prev => {
                    if (prev >= frames.length - 1) {
                        setIsPlaying(false);
                        clearInterval(timerRef.current);
                        return prev;
                    }
                    return prev + 1;
                });
            }, 800);
        } else {
            clearInterval(timerRef.current);
        }
        return () => clearInterval(timerRef.current);
    }, [isPlaying, frames.length]);

    const handlePlay = useCallback(() => {
        if (frames.length > 0 && currentFrameIdx < frames.length - 1) setIsPlaying(true);
    }, [frames, currentFrameIdx]);

    const handlePause = useCallback(() => setIsPlaying(false), []);
    
    const handleClear = () => {
        handleReset();
        if (treeType === 'BST') setTreeInstance(new BST());
        else if (treeType === 'AVL') setTreeInstance(new AVLTree());
        setFrames([]);
        setCurrentFrameIdx(0);
    };

    // Tree Operations
    const executeOperation = async (operation, value) => {
        handleReset();
        
        if (!value.trim()) {
            setFrames([{ tree: treeInstance.root, highlight: [], msg: 'Input cannot be empty.' }]);
            setCurrentFrameIdx(0);
            return;
        }

        const parts = value.split(/[\s,]+/).filter(Boolean);
        
        // Handle Balanced Mode Insertion
        if (isBalancedMode && treeType === 'BST' && operation === 'insert') {
            const { getTraversals, buildBalancedBST } = await import('../algorithms/tree/TreeLogic');
            const currentVals = treeInstance.root ? getTraversals(treeInstance.root).inOrder : [];
            const newVals = parts.map(p => parseInt(p, 10)).filter(n => !isNaN(n));
            
            if (newVals.length > 0) {
                const combined = [...currentVals, ...newVals];
                const newTree = buildBalancedBST(combined);
                setTreeInstance(newTree);
                setFrames([{ tree: newTree.root, highlight: [], msg: 'Constructed Balanced BST' }]);
                setCurrentFrameIdx(0);
            }
            setInputValue('');
            return;
        }

        let allFrames = [];
        let hasError = false;

        for (const part of parts) {
            const numVal = parseInt(part, 10);
            if (isNaN(numVal)) {
                allFrames.push({ tree: treeInstance.root, highlight: [], msg: `Invalid input skipped: ${part}` });
                hasError = true;
                continue;
            }

            let newFrames = [];
            if (operation === 'insert') newFrames = treeInstance.insert(numVal);
            else if (operation === 'delete') newFrames = treeInstance.remove(numVal);
            else if (operation === 'search') newFrames = treeInstance.search(numVal);

            if (newFrames && newFrames.length > 0) {
                allFrames = allFrames.concat(newFrames);
            }
        }

        if (allFrames.length > 0) {
            setFrames(allFrames);
            setCurrentFrameIdx(0);
            setIsPlaying(true);
        } else if (hasError) {
            setFrames([{ tree: treeInstance.root, highlight: [], msg: 'No valid numbers provided.' }]);
            setCurrentFrameIdx(0);
        }
        
        setInputValue('');
    };

    const handleRandomTree = async () => {
        handleClear();
        
        const vals = Array.from({length: 7}, () => Math.floor(Math.random() * 100));
        
        if (isBalancedMode && treeType === 'BST') {
            const { buildBalancedBST } = await import('../algorithms/tree/TreeLogic');
            const newTree = buildBalancedBST(vals);
            setTreeInstance(newTree);
            setFrames([{ tree: newTree.root, highlight: [], msg: 'Generated balanced random tree.' }]);
            setCurrentFrameIdx(0);
            return;
        }

        const tempTree = treeType === 'BST' ? new BST() : new AVLTree();
        vals.forEach(v => tempTree.insert(v));
        setTreeInstance(tempTree);
        setFrames([{ tree: tempTree.root, highlight: [], msg: 'Generated random tree.' }]);
        setCurrentFrameIdx(0);
    };

    return {
        treeType, setTreeType,
        treeInstance,
        frames, currentFrameIdx,
        isPlaying,
        inputValue, setInputValue,
        svgWidth, svgRef,
        handlePlay, handlePause, handleReset, handleClear,
        executeOperation, handleRandomTree,
        currentFrame: frames[currentFrameIdx] || { tree: treeInstance.root, highlight: [], msg: 'Ready.' },
        isBalancedMode, setIsBalancedMode
    };
}
