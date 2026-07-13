import React from 'react';
import { useSEO } from '../../hooks/useSEO';
import { ShieldCheck } from 'lucide-react';

export default function PrivacyPolicyPage() {
    useSEO({
        title: 'Privacy Policy',
        description: 'Read the privacy policy for Bunk & Learn Hub regarding data collection and local storage.',
        keywords: 'privacy policy, privacy, data, local storage'
    });

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-3xl mx-auto">
            <header className="border-b border-slate-200 pb-8">
                <div className="inline-flex items-center gap-2 border border-slate-200 bg-white px-4 py-2 text-[10px] font-bold uppercase tracking-[0.25em] text-slate-500 shadow-sm mb-6">
                    <ShieldCheck size={12} className="text-slate-900" />
                    Data & Privacy
                </div>
                <h1 className="text-3xl md:text-5xl font-black font-mono tracking-tighter text-slate-900 leading-[0.9] mb-6">
                    Privacy Policy
                </h1>
                <p className="text-sm text-slate-500 font-medium">
                    Last updated: July 13, 2026
                </p>
            </header>

            <article className="prose prose-slate prose-sm md:prose-base max-w-none prose-headings:font-black prose-headings:tracking-tight prose-a:text-blue-600">
                <h2>1. Introduction</h2>
                <p>
                    Welcome to Bunk & Learn Hub. We respect your privacy and are committed to protecting it. This Privacy Policy explains our practices regarding the collection, use, and disclosure of information when you use our educational platform.
                </p>

                <h2>2. Information We Collect (Or Rather, Don't)</h2>
                <p>
                    <strong>We do not collect personal information.</strong> 
                    <br/>
                    Bunk & Learn Hub is currently designed as a frontend-only application. This means there is no backend database tracking your usage, no user accounts, and no personal data collection by our servers.
                </p>

                <h2>3. Local Storage Usage</h2>
                <p>
                    To enhance your educational experience, we may use your browser's <code>localStorage</code> or <code>sessionStorage</code>. This is strictly used for:
                </p>
                <ul>
                    <li>Saving your UI preferences (e.g., collapsed sidebars).</li>
                    <li>Retaining simulation states (e.g., the last graph you drew) so it persists on page refresh.</li>
                    <li>Theme preferences.</li>
                </ul>
                <p>
                    <strong>None of this data ever leaves your device.</strong> It is not transmitted to our servers or any third parties.
                </p>

                <h2>4. Analytics and Cookies</h2>
                <p>
                    Currently, we do not use third-party analytics trackers (like Google Analytics) or cookies for tracking purposes. If we introduce privacy-respecting, anonymized analytics in the future to understand which modules are most popular, this policy will be updated to reflect that change clearly.
                </p>

                <h2>5. Third-Party Services</h2>
                <p>
                    Our application is hosted on third-party platforms (such as Vercel or GitHub Pages). These hosting providers may collect standard server logs (such as IP addresses) as part of their inherent infrastructure operations. We recommend reviewing their respective privacy policies.
                </p>

                <h2>6. Future Cloud Storage</h2>
                <p>
                    In the future, we plan to implement optional "Cloud Saves" allowing you to generate shortlinks for your setups. When this is implemented, it will be an explicit opt-in feature, and we will update this policy detailing exactly what configuration data is stored on our servers.
                </p>

                <h2>7. Children's Privacy</h2>
                <p>
                    Our platform is built for university-level students but is safe for all ages. We do not knowingly collect any data from anyone, including children under 13.
                </p>

                <h2>8. Changes to Privacy Policy</h2>
                <p>
                    We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
                </p>

                <h2>9. Contact Information</h2>
                <p>
                    If you have any questions about this Privacy Policy, you can open an issue on our GitHub repository.
                </p>
            </article>
        </div>
    );
}
