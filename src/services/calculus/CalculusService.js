import * as math from 'mathjs';

/**
 * Validates a given function string.
 * @param {string} fnString - The mathematical function string.
 * @returns {object} Validation result { isValid, compiledFn, derivedFn, error }
 */
export const validateAndCompileFunction = (fnString) => {
    const trimmed = (fnString || '').trim();
    if (!trimmed) {
        return {
            isValid: false,
            compiledFn: null,
            derivedFn: null,
            error: "No function entered",
            isEmpty: true
        };
    }

    try {
        const compiled = math.compile(trimmed);
        const derived = math.derivative(trimmed, 'x');
        
        // Test evaluation to ensure it's a valid expression with variable x
        const testVal = compiled.evaluate({ x: 0 });
        
        if (typeof testVal !== 'number' || isNaN(testVal) || !isFinite(testVal)) {
             // Let it pass if it evaluates to something, but typically testVal should be a number.
             // Some functions like 1/x evaluate to Infinity at 0, which is fine for calculus graphing.
        }

        return {
            isValid: true,
            compiledFn: compiled,
            derivedFn: derived,
            error: null,
            isEmpty: false
        };
    } catch (err) {
        return {
            isValid: false,
            compiledFn: null,
            derivedFn: null,
            error: "Invalid function. E.g., use 'x^2 + 2*x'",
            isEmpty: false
        };
    }
};

/**
 * Safely evaluates a compiled mathjs function at a specific x.
 */
export const safeEvaluate = (compiledFn, x, fallbackValue = 0) => {
    if (!compiledFn) return fallbackValue;
    try {
        const val = compiledFn.evaluate({ x });
        return (typeof val === 'number') ? val : fallbackValue;
    } catch {
        return fallbackValue;
    }
};

/**
 * Generates plot points for a given compiled function.
 */
export const generatePlotPoints = (compiledFn, xMin, xMax, step = 0.1) => {
    const points = [];
    let minTemp = Infinity;
    let maxTemp = -Infinity;

    if (!compiledFn) return { points: [], yMin: -10, yMax: 10 };

    // Pass 1: Find min and max for sensible scaling
    for (let i = xMin; i <= xMax; i += 0.5) {
        const y = safeEvaluate(compiledFn, i, NaN);
        if (!isNaN(y) && isFinite(y)) {
            if (y < minTemp) minTemp = y;
            if (y > maxTemp) maxTemp = y;
        }
    }

    let yMin = minTemp !== Infinity ? minTemp : -20;
    let yMax = maxTemp !== -Infinity ? maxTemp : 100;

    if (yMin > -10) yMin = -10;
    if (yMax < 10) yMax = 10;
    
    const yPadding = (yMax - yMin) * 0.1;
    yMin -= yPadding;
    yMax += yPadding;

    // Pass 2: Generate actual points
    for (let i = xMin; i <= xMax; i += step) {
        const y = safeEvaluate(compiledFn, i, NaN);
        if (!isNaN(y) && isFinite(y)) {
            points.push({ x: i, y });
        }
    }

    return { points, yMin, yMax };
};

/**
 * Generates Riemann sum rectangles
 */
export const generateRiemannRectangles = (compiledFn, start, end, n) => {
    if (!compiledFn || n <= 0 || start >= end) return [];
    
    const rects = [];
    const dx = (end - start) / n;
    
    for (let i = 0; i < n; i++) {
        const x = start + i * dx;
        const y = safeEvaluate(compiledFn, x, NaN);
        
        if (!isNaN(y) && isFinite(y)) {
            rects.push({
                x,
                y,
                width: dx,
                height: Math.abs(y),
                isPositive: y >= 0
            });
        }
    }
    
    return rects;
};
