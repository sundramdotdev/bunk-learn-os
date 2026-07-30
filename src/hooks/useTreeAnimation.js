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
        handleReset();
        if (treeType === 'BST') setTreeInstance(new BST());
        else if (treeType === 'AVL') setTreeInstance(new AVLTree());
    }, [treeType, handleReset]);

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
    const executeOperation = (operation, value) => {
        handleReset();
        const numVal = parseInt(value, 10);
        if (isNaN(numVal)) return;

        let newFrames = [];
        if (operation === 'insert') newFrames = treeInstance.insert(numVal);
        else if (operation === 'delete') newFrames = treeInstance.remove(numVal);
        else if (operation === 'search') newFrames = treeInstance.search(numVal);

        if (newFrames && newFrames.length > 0) {
            setFrames(newFrames);
            setCurrentFrameIdx(0);
            setIsPlaying(true);
        }
        setInputValue('');
    };

    const handleRandomTree = () => {
        handleClear();
        const tempTree = treeType === 'BST' ? new BST() : new AVLTree();
        const vals = Array.from({length: 7}, () => Math.floor(Math.random() * 100));
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
        currentFrame: frames[currentFrameIdx] || { tree: treeInstance.root, highlight: [], msg: 'Ready.' }
    };
}
