/**
 * CompilerService — Executes C, C++, and HTML code in the browser.
 *
 * C/C++: Uses JSCPP (a JS-based C++ interpreter) to run code client-side.
 * HTML:  Returns the raw HTML string for iframe rendering.
 *
 * Why JSCPP?
 * GCC is a system-level compiler that needs a Linux server.
 * JSCPP interprets C/C++ directly in the browser's JS engine —
 * no backend, no API key, just push and deploy.
 * It supports printf, scanf, cin, cout, loops, arrays, pointers,
 * functions — everything needed for B.Tech lab practicals.
 */

import JSCPP from 'JSCPP';

/**
 * Execute C or C++ code using JSCPP.
 * @param {string} code - The source code
 * @param {string} stdin - Standard input for scanf/cin
 * @returns {{ success: boolean, output: string, error: string|null, duration: number, exitCode: number|null }}
 */
export function executeCpp(code, stdin = '') {
    let output = '';
    const startTime = performance.now();

    try {
        const config = {
            stdio: {
                write: function (s) {
                    output += s;
                }
            },
            unsigned_overflow: 'warn'
        };

        const exitCode = JSCPP.run(code, stdin, config);
        const duration = Math.round(performance.now() - startTime);

        return {
            success: true,
            output: output || '(Program produced no output)',
            error: null,
            duration,
            exitCode
        };
    } catch (err) {
        const duration = Math.round(performance.now() - startTime);
        const errorMsg = formatCompilerError(err);

        return {
            success: false,
            output: output, // partial output before crash
            error: errorMsg,
            duration,
            exitCode: 1
        };
    }
}

/**
 * Format JSCPP errors to look like real GCC terminal errors.
 */
function formatCompilerError(err) {
    const raw = err.message || String(err);

    // JSCPP parse errors often include line/col info
    if (raw.includes('Parse error')) {
        return `compilation error: ${raw}`;
    }

    // Runtime errors (e.g., division by zero, null pointer)
    if (raw.includes('Runtime error') || raw.includes('undefined')) {
        return `runtime error: ${raw}`;
    }

    // Fallback
    return `error: ${raw}`;
}

/**
 * "Execute" HTML code — just returns it for iframe rendering.
 * @param {string} code - The HTML source
 * @returns {{ success: boolean, output: string, error: string|null, duration: number }}
 */
export function executeHtml(code) {
    const startTime = performance.now();

    if (!code || !code.trim()) {
        return {
            success: false,
            output: '',
            error: 'Empty HTML — write some code first!',
            duration: 0
        };
    }

    return {
        success: true,
        output: code, // raw HTML for iframe srcdoc
        error: null,
        duration: Math.round(performance.now() - startTime)
    };
}

/**
 * Default code templates for each language.
 */
export const DEFAULT_TEMPLATES = {
    c: `#include <stdio.h>

int main() {
    printf("Hello, World!\\n");

    int a, b;
    printf("Enter two numbers: ");
    scanf("%d %d", &a, &b);
    printf("Sum = %d\\n", a + b);

    return 0;
}`,

    cpp: `#include <iostream>
using namespace std;

int main() {
    cout << "Hello, World!" << endl;

    int a, b;
    cout << "Enter two numbers: ";
    cin >> a >> b;
    cout << "Sum = " << a + b << endl;

    return 0;
}`,

    html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Page</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Segoe UI', sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            text-align: center;
        }
        .card {
            background: rgba(255,255,255,0.15);
            backdrop-filter: blur(10px);
            border-radius: 16px;
            padding: 40px;
            max-width: 500px;
        }
        h1 { font-size: 2rem; margin-bottom: 12px; }
        p { font-size: 1.1rem; opacity: 0.9; line-height: 1.6; }
        button {
            margin-top: 20px;
            padding: 12px 28px;
            border: 2px solid white;
            background: transparent;
            color: white;
            border-radius: 8px;
            font-size: 1rem;
            cursor: pointer;
            transition: all 0.3s;
        }
        button:hover {
            background: white;
            color: #764ba2;
        }
    </style>
</head>
<body>
    <div class="card">
        <h1>🚀 Hello, World!</h1>
        <p>This is a live HTML preview. Edit the code on the left and click Run to see changes!</p>
        <button onclick="alert('It works! 🎉')">Click Me</button>
    </div>
</body>
</html>`
};
