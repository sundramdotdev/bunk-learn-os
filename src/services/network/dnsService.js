export const DNS_TYPES = {
    A: 1,
    AAAA: 28,
    CNAME: 5,
    MX: 15,
    TXT: 16
};

const DNS_TYPE_NAMES = {
    1: "A",
    28: "AAAA",
    5: "CNAME",
    15: "MX",
    16: "TXT"
};

export const resolveDNS = async (domain, type = "A") => {
    const typeCode = DNS_TYPES[type] || 1;
    const url = `https://dns.google/resolve?name=${encodeURIComponent(domain)}&type=${typeCode}`;
    
    const startTime = performance.now();
    try {
        const response = await fetch(url, {
            headers: {
                "Accept": "application/dns-json"
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }
        
        const data = await response.json();
        const duration = Math.round(performance.now() - startTime);
        
        // Handle no records
        if (!data.Answer) {
            return {
                status: data.Status, // 0 = NOERROR, 3 = NXDOMAIN
                records: [],
                duration,
                error: data.Status === 3 ? "NXDOMAIN: Domain does not exist." : "No records found for this type.",
                timestamp: new Date().toISOString()
            };
        }
        
        const records = data.Answer.map(ans => ({
            name: ans.name,
            type: DNS_TYPE_NAMES[ans.type] || ans.type,
            ttl: ans.TTL,
            data: ans.data
        }));
        
        return {
            status: data.Status,
            records,
            duration,
            error: null,
            timestamp: new Date().toISOString(),
            tc: data.TC, // Truncated
            rd: data.RD, // Recursion Desired
            ra: data.RA, // Recursion Available
            ad: data.AD, // Authenticated Data
            cd: data.CD  // Checking Disabled
        };
        
    } catch (error) {
        return {
            status: -1,
            records: [],
            duration: Math.round(performance.now() - startTime),
            error: "Failed to resolve DNS. " + error.message,
            timestamp: new Date().toISOString()
        };
    }
};

export const resolveAllCommonDNS = async (domain) => {
    const [a, aaaa, cname, mx, txt] = await Promise.all([
        resolveDNS(domain, "A"),
        resolveDNS(domain, "AAAA"),
        resolveDNS(domain, "CNAME"),
        resolveDNS(domain, "MX"),
        resolveDNS(domain, "TXT")
    ]);
    
    return {
        A: a,
        AAAA: aaaa,
        CNAME: cname,
        MX: mx,
        TXT: txt
    };
};

