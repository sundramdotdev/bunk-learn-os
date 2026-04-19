import React from 'react';
import { Github, Linkedin } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="w-full border-t border-slate-300 bg-white py-6 mt-auto">
            <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
                <p className="text-xs font-mono font-medium text-slate-600 uppercase tracking-widest">
                    Bunk & Learn Hub // Designed & Developed by Sundram
                </p>
                <div className="flex items-center gap-4">
                    <a
                        href="https://github.com/sundramdotdev"
                        target="_blank"
                        rel="noreferrer"
                        className="text-slate-500 hover:text-slate-900 transition-colors"
                        title="GitHub"
                    >
                        <Github size={18} strokeWidth={2} />
                    </a>
                    <a
                        href="https://www.linkedin.com/in/sundaramdotdev"
                        target="_blank"
                        rel="noreferrer"
                        className="text-slate-500 hover:text-blue-600 transition-colors"
                        title="LinkedIn"
                    >
                        <Linkedin size={18} strokeWidth={2} />
                    </a>
                </div>
            </div>
        </footer>
    );
}
