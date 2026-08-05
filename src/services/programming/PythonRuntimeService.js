class PythonRuntimeService {
    constructor() {
        // Rely on global window object to survive React StrictMode and HMR
        if (!window.__PYTHON_RUNTIME_STATE) {
            window.__PYTHON_RUNTIME_STATE = {
                pyodide: null,
                loadPromise: null,
                isLoading: false,
                error: null
            };
        }
        this.state = window.__PYTHON_RUNTIME_STATE;
    }

    get pyodide() { return this.state.pyodide; }
    get loadPromise() { return this.state.loadPromise; }
    get isLoading() { return this.state.isLoading; }
    get error() { return this.state.error; }

    async loadRuntime(retries = 3, timeoutMs = 15000) {
        if (this.state.pyodide) return this.state.pyodide;
        if (this.state.loadPromise) return this.state.loadPromise;

        this.state.isLoading = true;
        this.state.error = null;

        this.state.loadPromise = new Promise(async (resolve, reject) => {
            for (let attempt = 1; attempt <= retries; attempt++) {
                try {
                    const pyodide = await this._initPyodide(timeoutMs);
                    this.state.pyodide = pyodide;
                    this.state.isLoading = false;
                    resolve(pyodide);
                    return;
                } catch (err) {
                    console.warn(`Pyodide load attempt ${attempt} failed:`, err);
                    if (attempt === retries) {
                        this.state.error = err.message || "Failed to load Python runtime after multiple attempts.";
                        this.state.isLoading = false;
                        this.state.loadPromise = null;
                        reject(new Error(this.state.error));
                        return;
                    }
                    // Wait before retry
                    await new Promise(r => setTimeout(r, 1000 * attempt));
                }
            }
        });

        return this.state.loadPromise;
    }

    async _initPyodide(timeoutMs) {
        return new Promise((resolve, reject) => {
            const timeoutId = setTimeout(() => {
                reject(new Error(`Loading Pyodide timed out after ${timeoutMs}ms`));
            }, timeoutMs);

            const loadIt = async () => {
                try {
                    const py = await window.loadPyodide();
                    clearTimeout(timeoutId);
                    resolve(py);
                } catch (e) {
                    clearTimeout(timeoutId);
                    reject(e);
                }
            };

            if (window.loadPyodide) {
                loadIt();
                return;
            }

            const script = document.createElement('script');
            script.src = "https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js";
            script.onload = loadIt;
            script.onerror = () => {
                clearTimeout(timeoutId);
                reject(new Error("Failed to load Pyodide script from CDN."));
            };
            document.head.appendChild(script);
        });
    }

    async execute(code, onOutput) {
        if (!this.state.pyodide) {
            await this.loadRuntime();
        }

        const pyodide = this.state.pyodide;
        let stdoutBuffer = "";
        let stderrBuffer = "";
        let resultProxy = null;

        try {
            pyodide.runPython(`
import sys
import io
sys.stdout = io.StringIO()
sys.stderr = io.StringIO()
            `);

            resultProxy = await pyodide.runPythonAsync(code);

            stdoutBuffer = pyodide.runPython("sys.stdout.getvalue()");
            stderrBuffer = pyodide.runPython("sys.stderr.getvalue()");
            
            if (stdoutBuffer) onOutput(stdoutBuffer);
            if (stderrBuffer) onOutput(stderrBuffer, 'error');

            return { success: true };
        } catch (err) {
            try {
                stdoutBuffer = pyodide.runPython("sys.stdout.getvalue()");
                if (stdoutBuffer) onOutput(stdoutBuffer);
            } catch(e) {}
            
            return { success: false, error: err.message };
        } finally {
            if (resultProxy && typeof resultProxy.destroy === 'function') {
                resultProxy.destroy();
            }
            try {
                pyodide.runPython(`
sys.stdout.close()
sys.stderr.close()
sys.stdout = sys.__stdout__
sys.stderr = sys.__stderr__
                `);
            } catch(e) {}
        }
    }
}

export const pythonRuntimeService = new PythonRuntimeService();
