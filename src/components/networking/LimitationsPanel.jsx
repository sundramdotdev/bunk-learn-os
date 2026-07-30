import React from 'react';
import { AlertCircle, Info } from 'lucide-react';

export default function LimitationsPanel({ module }) {
    return (
        <div className="mt-6 border border-amber-200 bg-amber-50 p-4 text-xs text-amber-900 rounded-none shadow-sm flex items-start gap-3">
            <Info size={16} className="text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-2 leading-relaxed">
                <p className="font-bold uppercase tracking-widest text-[10px] text-amber-800">Browser Limitations Notice</p>
                <p>
                    JavaScript running in a web browser is strictly sandboxed for security. 
                    {module === 'dns' && (
                        <span> Browsers cannot perform raw UDP/TCP DNS queries. This simulator uses a <strong>DNS-over-HTTPS (DoH)</strong> API to fetch 100% real DNS records for your domain, but the hop-by-hop resolution animation is simulated for educational purposes.</span>
                    )}
                    {module === 'http' && (
                        <span> Browsers block cross-origin HTTP requests (CORS) unless explicitly permitted by the destination server. We also cannot inspect underlying TCP or TLS handshakes natively. The request timing, response headers, and body data (when successful) are <strong>real</strong>, while the network hop animation is synthesized for learning.</span>
                    )}
                </p>
            </div>
        </div>
    );
}
