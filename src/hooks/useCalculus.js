import { useState, useMemo, useCallback } from 'react';
import { validateAndCompileFunction, generatePlotPoints, generateRiemannRectangles, safeEvaluate } from '../services/calculus/CalculusService';

export function useCalculus(initialFn = 'x^2') {
    const [fnString, setFnString] = useState(initialFn);
    const [xVal, setXVal] = useState(2);
    const [showArea, setShowArea] = useState(false);
    const [aVal, setAVal] = useState(0);
    const [bVal, setBVal] = useState(4);
    const [nVal, setNVal] = useState(10);

    const validationResult = useMemo(() => {
        return validateAndCompileFunction(fnString);
    }, [fnString]);

    const { isValid, error, isEmpty, compiledFn, derivedFn } = validationResult;

    // Use default window sizing for visualization
    const width = 500;
    const height = 400;
    const xMin = -10;
    const xMax = 10;

    const plotData = useMemo(() => {
        if (!isValid) return { pathD: '', scaleX: 1, scaleY: 1, cx: () => 0, cy: () => 0 };

        const { points, yMin, yMax } = generatePlotPoints(compiledFn, xMin, xMax, 0.1);

        const scaleX = width / (xMax - xMin);
        const scaleY = height / (yMax - yMin);

        const cx = (x) => (x - xMin) * scaleX;
        const cy = (y) => height - (y - yMin) * scaleY;

        const pathPoints = points.map(p => `${cx(p.x)},${cy(p.y)}`);
        const pathD = pathPoints.length > 0 ? `M ${pathPoints.join(' L ')}` : '';

        return { pathD, scaleX, scaleY, cx, cy, yMin, yMax };
    }, [isValid, compiledFn]);

    const { pathD, scaleX, scaleY, cx, cy } = plotData;

    const riemannRects = useMemo(() => {
        if (!isValid || !showArea) return [];
        const start = parseFloat(aVal);
        const end = parseFloat(bVal);
        const n = parseInt(nVal, 10);
        return generateRiemannRectangles(compiledFn, start, end, n);
    }, [isValid, showArea, aVal, bVal, nVal, compiledFn]);

    // Tangent calculations
    const tangentData = useMemo(() => {
        if (!isValid) return null;
        
        const a = parseFloat(xVal);
        const tangentLength = 4;
        const tX1 = a - tangentLength;
        const df = safeEvaluate(derivedFn, a);
        const f_a = safeEvaluate(compiledFn, a);
        
        const tY1 = df * (tX1 - a) + f_a;
        const tX2 = a + tangentLength;
        const tY2 = df * (tX2 - a) + f_a;

        return { a, f_a, df, tX1, tY1, tX2, tY2 };
    }, [isValid, xVal, compiledFn, derivedFn]);

    return {
        // State
        fnString, xVal, showArea, aVal, bVal, nVal,
        // Setters
        setFnString, setXVal, setShowArea, setAVal, setBVal, setNVal,
        // Computed
        isValid, error, isEmpty,
        width, height, cx, cy,
        pathD, scaleX, scaleY,
        riemannRects,
        tangentData
    };
}
