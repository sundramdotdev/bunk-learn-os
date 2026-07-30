export const validateDomain = (domain) => {
    if (!domain || typeof domain !== "string") {
        return { isValid: false, error: "Domain cannot be empty." };
    }
    const trimmed = domain.trim();
    if (trimmed.length === 0) {
        return { isValid: false, error: "Domain cannot be empty." };
    }
    // Simple IP check
    const ipv4Regex = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;
    if (ipv4Regex.test(trimmed)) {
        return { isValid: false, error: "Please enter a domain name, not an IP address." };
    }
    // Basic domain validation
    const domainRegex = /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!domainRegex.test(trimmed)) {
        return { isValid: false, error: "Invalid domain format. Example: google.com" };
    }
    return { isValid: true, domain: trimmed, error: null };
};

export const validateURL = (urlStr) => {
    if (!urlStr || typeof urlStr !== "string") {
        return { isValid: false, error: "URL cannot be empty." };
    }
    const trimmed = urlStr.trim();
    if (trimmed.length === 0) {
        return { isValid: false, error: "URL cannot be empty." };
    }
    
    let url;
    try {
        url = new URL(trimmed);
    } catch (e) {
        // Try prepending https:// if missing
        if (!trimmed.startsWith("http://") && !trimmed.startsWith("https://")) {
            try {
                url = new URL("https://" + trimmed);
            } catch (e2) {
                return { isValid: false, error: "Invalid URL format." };
            }
        } else {
            return { isValid: false, error: "Invalid URL format." };
        }
    }
    
    if (url.protocol !== "http:" && url.protocol !== "https:") {
        return { isValid: false, error: "Only HTTP and HTTPS protocols are supported." };
    }
    
    return { isValid: true, url: url.toString(), parsed: url, error: null };
};

