/**
 * Evaluates a regular expression against a test string safely.
 * @param {string} regexStr - The regex pattern.
 * @param {string} flags - The regex flags.
 * @param {string} testString - The string to test against.
 * @returns {object} { matches, error }
 */
export const evaluateRegex = (regexStr, flags, testString) => {
    if (!regexStr) {
        return { matches: [], error: null };
    }
    
    try {
        const re = new RegExp(regexStr, flags);
        const foundMatches = [];
        let match;
        
        if (flags.includes('g') || flags.includes('y')) {
            while ((match = re.exec(testString)) !== null) {
                foundMatches.push(match);
                if (match[0].length === 0) re.lastIndex++; // prevent infinite loops
            }
        } else {
            match = re.exec(testString);
            if (match) foundMatches.push(match);
        }
        
        return { matches: foundMatches, error: null };
    } catch (e) {
        return { matches: [], error: e.message };
    }
};
