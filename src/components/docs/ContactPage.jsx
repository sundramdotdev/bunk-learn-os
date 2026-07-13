import React from 'react';
import { useSEO } from '../../hooks/useSEO';
import { Mail, Github, MessageSquare } from 'lucide-react';

export default function ContactPage() {
    useSEO({
        title: 'Contact Us',
        description: 'Get in touch with the maintainers of Bunk & Learn Hub.',
        keywords: 'contact, email, github, support'
    });

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-3xl mx-auto">
            <header className="border-b border-slate-200 pb-8">
                <div className="inline-flex items-center gap-2 border border-slate-200 bg-white px-4 py-2 text-[10px] font-bold uppercase tracking-[0.25em] text-slate-500 shadow-sm mb-6">
                    <Mail size={12} className="text-slate-900" />
                    Get in Touch
                </div>
                <h1 className="text-3xl md:text-5xl font-black font-mono tracking-tighter text-slate-900 leading-[0.9] mb-6">
                    Contact & Support
                </h1>
                <p className="text-lg text-slate-500 font-medium leading-relaxed">
                    Whether you found a bug, want to request a feature, or just want to say hi, here is how you can reach out.
                </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <a href="https://github.com/sundramdotdev/bunk-learn-os/issues" target="_blank" rel="noreferrer" className="bg-white border border-slate-200 p-6 md:p-8 flex flex-col items-center justify-center text-center gap-4 hover:border-slate-900 hover:-translate-y-1 transition-all group">
                    <div className="w-16 h-16 bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-900 group-hover:bg-slate-900 group-hover:text-white transition-colors">
                        <Github size={24} />
                    </div>
                    <div>
                        <h3 className="font-black text-lg text-slate-900">GitHub Issues</h3>
                        <p className="text-sm text-slate-500 mt-2">Report bugs or request new features publicly.</p>
                    </div>
                </a>

                <a href="mailto:sundramdotdev@gmail.com" className="bg-white border border-slate-200 p-6 md:p-8 flex flex-col items-center justify-center text-center gap-4 hover:border-slate-900 hover:-translate-y-1 transition-all group">
                    <div className="w-16 h-16 bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-900 group-hover:bg-slate-900 group-hover:text-white transition-colors">
                        <MessageSquare size={24} />
                    </div>
                    <div>
                        <h3 className="font-black text-lg text-slate-900">Direct Email</h3>
                        <p className="text-sm text-slate-500 mt-2">For private inquiries or security vulnerability reports.</p>
                    </div>
                </a>
            </div>
        </div>
    );
}
