import React from 'react';
import { useSEO } from '../../hooks/useSEO';
import { HelpCircle } from 'lucide-react';

export default function FAQPage() {
    useSEO({
        title: 'FAQ',
        description: 'Frequently Asked Questions about Bunk & Learn Hub.',
        keywords: 'faq, questions, help, bunk and learn'
    });

    const FAQS = [
        {
            q: "What is Bunk & Learn Hub?",
            a: "It is an open-source, interactive educational platform designed to help Computer Science students visualize and understand complex algorithms and system concepts rather than just reading about them."
        },
        {
            q: "Who is this for?",
            a: "Primarily for undergraduate CS students, coding bootcamp attendees, and competitive programmers. However, anyone interested in understanding how computers work under the hood will find value here."
        },
        {
            q: "Does it work offline?",
            a: "Yes! Since the entire platform is built as a frontend-only React Single Page Application (SPA), once the page loads, everything runs locally in your browser. You can simulate algorithms without an active internet connection."
        },
        {
            q: "Do I need an account?",
            a: "No. There are no user accounts, no login screens, and no paywalls. Bunk & Learn Hub is completely free and accessible instantly."
        },
        {
            q: "Can I contribute?",
            a: "Absolutely! The project is open-source and hosted on GitHub. We welcome pull requests for bug fixes, design improvements, and entirely new educational modules."
        },
        {
            q: "Is it free?",
            a: "Yes. Bunk & Learn Hub is 100% free and open-source under the MIT License."
        },
        {
            q: "What technologies are used?",
            a: "The project is built using React 19, Vite 6, and Tailwind CSS v4. We intentionally avoid heavy graphing libraries, preferring native SVG manipulation for maximum performance and educational clarity."
        }
    ];

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-3xl mx-auto">
            <header className="border-b border-slate-200 pb-8">
                <div className="inline-flex items-center gap-2 border border-slate-200 bg-white px-4 py-2 text-[10px] font-bold uppercase tracking-[0.25em] text-slate-500 shadow-sm mb-6">
                    <HelpCircle size={12} className="text-slate-900" />
                    Help & Support
                </div>
                <h1 className="text-3xl md:text-5xl font-black font-mono tracking-tighter text-slate-900 leading-[0.9] mb-6">
                    Frequently Asked Questions
                </h1>
            </header>

            <div className="space-y-6">
                {FAQS.map((faq, idx) => (
                    <div key={idx} className="bg-white border border-slate-200 p-6 shadow-sm hover:border-slate-900 transition-colors">
                        <h3 className="text-lg font-black tracking-tight text-slate-900 mb-3">{faq.q}</h3>
                        <p className="text-sm text-slate-600 leading-relaxed">{faq.a}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
