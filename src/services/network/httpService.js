export const performHTTPRequest = async (url, method = "GET", headers = {}, body = null, signal = null) => {
    const startTime = performance.now();
    let duration = 0;
    
    try {
        const options = {
            method,
            headers,
            signal
        };
        
        if (body && ["POST", "PUT", "PATCH"].includes(method)) {
            options.body = body;
        }

        const response = await fetch(url, options);
        duration = Math.round(performance.now() - startTime);

        // Extract response headers
        const responseHeaders = {};
        response.headers.forEach((value, key) => {
            responseHeaders[key] = value;
        });

        // Try to read body text
        const responseText = await response.text();
        const byteSize = new Blob([responseText]).size;

        let parsedJson = null;
        if (responseHeaders["content-type"] && responseHeaders["content-type"].includes("application/json")) {
            try {
                parsedJson = JSON.parse(responseText);
            } catch (e) {
                // Ignore parse error
            }
        }

        return {
            success: true,
            status: response.status,
            statusText: response.statusText,
            duration,
            headers: responseHeaders,
            bodyText: responseText,
            bodyJson: parsedJson,
            size: byteSize,
            error: null
        };
    } catch (err) {
        duration = Math.round(performance.now() - startTime);
        
        let errorMsg = err.message;
        if (err.name === "AbortError") {
            errorMsg = "Request was cancelled.";
        } else if (err.message === "Failed to fetch" || err.name === "TypeError") {
            errorMsg = "Network Error or CORS Blocked. Note: Browsers block cross-origin requests unless the server explicitly allows them (CORS).";
        }
        
        return {
            success: false,
            status: 0,
            statusText: "Error",
            duration,
            headers: {},
            bodyText: "",
            bodyJson: null,
            size: 0,
            error: errorMsg
        };
    }
};
