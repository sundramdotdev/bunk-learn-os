import React, { useState, useEffect, useCallback, Suspense, lazy } from 'react';

// Eagerly loaded core components
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import HomePage from './components/HomePage';
import Footer from './components/Footer';
import ErrorBoundary from './components/ErrorBoundary';
import PageSkeleton from './components/PageSkeleton';

// Lazy loaded views
const ProcessInput = lazy(() => import('./components/ProcessInput'));
const ProcessTable = lazy(() => import('./components/ProcessTable'));
const GanttChart = lazy(() => import('./components/GanttChart'));
const MemoryGrid = lazy(() => import('./components/MemoryGrid'));
const DiskScheduling = lazy(() => import('./components/DiskScheduling'));
const CalculationTable = lazy(() => import('./components/CalculationTable'));
const ExplainerPanel = lazy(() => import('./components/ExplainerPanel'));
const BankersAlgorithm = lazy(() => import('./components/BankersAlgorithm'));
const PageReplacement = lazy(() => import('./components/PageReplacement'));
const NumberSystem = lazy(() => import('./components/NumberSystem'));
const MemoryHierarchy = lazy(() => import('./components/fundamentals/MemoryHierarchy'));
const Contributors = lazy(() => import('./components/Contributors'));

// Aptitude Components
const MemoryLogic = lazy(() => import('./components/aptitude/MemoryLogic'));
const CodeBreakdown = lazy(() => import('./components/aptitude/CodeBreakdown'));
const LogicGates = lazy(() => import('./components/aptitude/LogicGates'));

// Mathematics Components
const LinearAlgebraVisualizer = lazy(() => import('./components/math/linear-algebra/LinearAlgebraVisualizer'));
const CalculusVisualizer = lazy(() => import('./components/math/calculus/CalculusVisualizer'));

// Data Structures Components
const BinaryTreeVisualizer = lazy(() => import('./components/data-structures/BinaryTreeVisualizer'));
const GraphVisualizer = lazy(() => import('./components/algorithms/graph/GraphVisualizer'));
const LinuxTerminal = lazy(() => import('./components/terminal/LinuxTerminal'));
const RegexPlayground = lazy(() => import('./components/regex/RegexPlayground'));
const ApiPlayground = lazy(() => import('./components/api-playground/ApiPlayground'));
const NetworkingSimulator = lazy(() => import('./components/networking/NetworkingSimulator'));

// Documentation Pages
const AboutPage = lazy(() => import('./components/docs/AboutPage'));
const PrivacyPolicyPage = lazy(() => import('./components/docs/PrivacyPolicyPage'));
const TermsPage = lazy(() => import('./components/docs/TermsPage'));
const OpenSourcePage = lazy(() => import('./components/docs/OpenSourcePage'));
const VersionPage = lazy(() => import('./components/docs/VersionPage'));
const RoadmapPage = lazy(() => import('./components/docs/RoadmapPage'));
const FAQPage = lazy(() => import('./components/docs/FAQPage'));
const ContactPage = lazy(() => import('./components/docs/ContactPage'));

// Extracted OS Views
const CpuSchedulerView = lazy(() => import('./components/os/CpuSchedulerView'));
const MemoryAllocatorView = lazy(() => import('./components/os/MemoryAllocatorView'));

export default function App() {
    const [currentView, setCurrentView] = useState('Home');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [globalResetTick, setGlobalResetTick] = useState(0);

    // --- OS System Clock Effect ---
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // --- Global "Format OS" Function ---
    const handleGlobalReset = useCallback(() => {
        if (window.confirm("Are you sure you want to Format the OS? This will wipe all CPU and Memory data.")) {
            setGlobalResetTick(prev => prev + 1);
        }
    }, []);

    const navigateTo = useCallback((view) => {
        setCurrentView(view);
    }, []);

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-slate-300">
            {/* === GLOBAL TOPBAR === */}
            <TopBar 
                currentTime={currentTime} 
                onFormatOS={handleGlobalReset} 
                onToggleSidebar={() => setIsSidebarOpen(prev => !prev)} 
            />

            {/* === SIDEBAR === */}
            <Sidebar 
                currentView={currentView} 
                setView={navigateTo} 
                isOpen={isSidebarOpen} 
                setIsOpen={setIsSidebarOpen} 
            />

            {/* === MAIN CONTENT AREA === */}
            <div className={`pt-14 min-h-screen flex flex-col transition-all duration-300 ${isSidebarOpen ? 'md:ml-64' : 'ml-0'}`}>
                <main className="flex-1 p-4 md:p-6 lg:p-10 max-w-7xl w-full mx-auto">
                    
                    <div key={currentView} className="animate-in fade-in slide-in-from-bottom-4 duration-500 min-h-[500px]">
                        <ErrorBoundary viewName={currentView}>
                            <Suspense fallback={<PageSkeleton />}>
                                {/* === HOME & META === */}
                                {currentView === 'Home' && <HomePage setView={navigateTo} />}
                                {currentView === 'Contributors' && <Contributors setView={navigateTo} />}

                                {/* === FUNDAMENTALS === */}
                                {currentView === 'Fundamentals' && <NumberSystem />}
                                {currentView === 'MemoryHierarchy' && <MemoryHierarchy />}

                                {/* === DIGITAL APTITUDE === */}
                                {currentView === 'StackLIFO' && <MemoryLogic mode="stack" />}
                                {currentView === 'QueueFIFO' && <MemoryLogic mode="queue" />}
                                {currentView === 'MemoryLayout' && <CodeBreakdown />}
                                {currentView === 'LogicGates' && <LogicGates />}

                                {/* === MATHEMATICS === */}
                                {currentView === 'LinearAlgebra' && <LinearAlgebraVisualizer />}
                                {currentView === 'Calculus' && <CalculusVisualizer />}

                                {/* === DATA STRUCTURES === */}
                                {currentView === 'BinaryTree' && <BinaryTreeVisualizer />}
                                {currentView === 'GraphVisualizer' && <GraphVisualizer />}

                                {/* === DEVELOPER TOOLS === */}
                                {currentView === 'Terminal' && (
                                    <div className="w-full max-w-4xl mx-auto">
                                        <LinuxTerminal />
                                    </div>
                                )}
                                {currentView === 'Regex' && <RegexPlayground />}
                                {currentView === 'ApiPlayground' && <ApiPlayground />}

                                {/* === NETWORKING === */}
                                {currentView === 'Networking' && <NetworkingSimulator />}

                                {/* === DOCUMENTATION & INFO === */}
                                {currentView === 'About' && <AboutPage />}
                                {currentView === 'PrivacyPolicy' && <PrivacyPolicyPage />}
                                {currentView === 'Terms' && <TermsPage />}
                                {currentView === 'OpenSource' && <OpenSourcePage />}
                                {currentView === 'Version' && <VersionPage />}
                                {currentView === 'Roadmap' && <RoadmapPage />}
                                {currentView === 'FAQ' && <FAQPage />}
                                {currentView === 'Contact' && <ContactPage />}

                                {/* === OPERATING SYSTEMS === */}
                                {currentView === 'CPU' && <CpuSchedulerView globalResetTick={globalResetTick} />}
                                {currentView === 'Memory' && <MemoryAllocatorView globalResetTick={globalResetTick} />}
                                
                                {currentView === 'Disk' && (
                                    <div className="overflow-x-auto w-full">
                                        <DiskScheduling />
                                    </div>
                                )}
                                {currentView === 'Deadlock' && (
                                    <div className="overflow-x-auto w-full">
                                        <BankersAlgorithm />
                                    </div>
                                )}
                                {currentView === 'Page' && (
                                    <div className="overflow-x-auto w-full">
                                        <PageReplacement />
                                    </div>
                                )}
                            </Suspense>
                        </ErrorBoundary>
                    </div>
                </main>
                <Footer />
            </div>
        </div>
    );
}
