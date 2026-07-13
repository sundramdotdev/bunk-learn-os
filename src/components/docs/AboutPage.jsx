import React from 'react';
import { useSEO } from '../../hooks/useSEO';
import { Target, Lightbulb, Users, Github } from 'lucide-react';

export default function AboutPage() {
    useSEO({
        title: 'About Us',
        description: 'Learn about the mission, vision, and technology behind Bunk & Learn Hub.',
        keywords: 'about, bunk and learn, computer science, education, open source'
    });

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto">
            {/* Hero Section */}
            <header className="border-b border-slate-200 pb-8">
                <div className="inline-flex items-center gap-2 border border-slate-200 bg-white px-4 py-2 text-[10px] font-bold uppercase tracking-[0.25em] text-slate-500 shadow-sm mb-6">
                    <Target size={12} className="text-slate-900" />
                    Our Mission
                </div>
                <h1 className="text-3xl md:text-5xl font-black font-mono tracking-tighter text-slate-900 leading-[0.9] mb-6">
                    About the Hub
                </h1>
                <p className="text-lg text-slate-500 font-medium leading-relaxed">
                    Bunk & Learn Hub was created with a singular focus: to make abstract computer science concepts visual, interactive, and inherently understandable.
                </p>
            </header>

            {/* Content Sections */}
            <div className="space-y-12">
                
                <section className="space-y-4">
                    <div className="flex items-center gap-3">
                        <Lightbulb size={24} className="text-slate-900" />
                        <h2 className="text-2xl font-black tracking-tight text-slate-900">Learning by Seeing</h2>
                    </div>
                    <div className="bg-white border border-slate-200 p-6 md:p-8 space-y-4 text-sm text-slate-600 leading-relaxed shadow-sm">
                        <p>
                            Too often, university lectures rely on static whiteboards to explain dynamic systems like CPU Scheduling or Network Packet Routing. Students are forced to mentally simulate these changes over time.
                        </p>
                        <p>
                            We built this platform to bridge that gap. By animating the step-by-step changes of algorithms and system states, we allow students to form a concrete mental model of what is actually happening under the hood. 
                        </p>
                    </div>
                </section>

                <section className="space-y-4">
                    <div className="flex items-center gap-3">
                        <Users size={24} className="text-slate-900" />
                        <h2 className="text-2xl font-black tracking-tight text-slate-900">Community Driven</h2>
                    </div>
                    <div className="bg-white border border-slate-200 p-6 md:p-8 space-y-4 text-sm text-slate-600 leading-relaxed shadow-sm">
                        <p>
                            What started as a single OS Lab project for CPU Scheduling quickly expanded into a multi-subject platform. This growth is driven by the community. We are strictly Open Source and encourage students to contribute modules they wish existed when they were taking a class.
                        </p>
                    </div>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-black tracking-tight text-slate-900">Technology Stack</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {['React 19', 'Vite 6', 'Tailwind CSS v4', 'Lucide Icons'].map(tech => (
                            <div key={tech} className="bg-slate-50 border border-slate-200 p-4 flex items-center justify-center text-center">
                                <span className="font-mono text-xs font-bold text-slate-900">{tech}</span>
                            </div>
                        ))}
                    </div>
                </section>

            </div>

            {/* Footer / Meta Info */}
            <footer className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="text-xs text-slate-500 font-mono">
                    Version: 3.0.0 | License: MIT
                </div>
                <a 
                    href="https://github.com/sundramdotdev/bunk-learn-os" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-slate-900 text-white px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-slate-800 transition-colors"
                >
                    <Github size={14} /> View Source
                </a>
            </footer>
        </div>
    );
}
