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
const DBMSPlayground = lazy(() => import('./components/dbms/DBMSPlayground'));

// ═══════════════════════════════════════════════════════════
// Hash-based routing maps (for deep-linking & SEO)
// ═══════════════════════════════════════════════════════════
const VIEW_TO_HASH = {
    Home: '', DBMS: '#dbms', CPU: '#cpu', Memory: '#memory', Disk: '#disk',
    Page: '#page', Deadlock: '#deadlock', BinaryTree: '#binary-tree',
    GraphVisualizer: '#graph', Terminal: '#terminal', Regex: '#regex',
    ApiPlayground: '#api-playground', Networking: '#networking',
    Fundamentals: '#number-system', MemoryHierarchy: '#memory-hierarchy',
    StackLIFO: '#stack', QueueFIFO: '#queue', MemoryLayout: '#memory-layout',
    LogicGates: '#logic-gates', LinearAlgebra: '#linear-algebra',
    Calculus: '#calculus', Contributors: '#contributors', About: '#about',
    FAQ: '#faq', Roadmap: '#roadmap', Version: '#version',
    OpenSource: '#open-source', Terms: '#terms', PrivacyPolicy: '#privacy',
    Contact: '#contact',
};
const HASH_TO_VIEW = Object.fromEntries(
    Object.entries(VIEW_TO_HASH).map(([k, v]) => [v, k])
);

function getViewFromHash() {
    const hash = window.location.hash || '';
    return HASH_TO_VIEW[hash] || 'Home';
}

export default function App() {
    const [currentView, setCurrentView] = useState(getViewFromHash);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [globalResetTick, setGlobalResetTick] = useState(0);

    // --- OS System Clock Effect ---
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // --- Sync hash → view on browser back/forward ---
    useEffect(() => {
        const onHashChange = () => {
            const view = getViewFromHash();
            setCurrentView(view);
        };
        window.addEventListener('hashchange', onHashChange);
        return () => window.removeEventListener('hashchange', onHashChange);
    }, []);

    // --- Global "Format OS" Function ---
    const handleGlobalReset = useCallback(() => {
        if (window.confirm("Are you sure you want to Format the OS? This will wipe all CPU and Memory data.")) {
            setGlobalResetTick(prev => prev + 1);
        }
    }, []);

    const navigateTo = useCallback((view) => {
        setCurrentView(view);
        // Update URL hash for deep-linking
        const hash = VIEW_TO_HASH[view];
        if (hash !== undefined) {
            window.history.pushState(null, '', hash || window.location.pathname);
        }
    }, []);

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-slate-300">
            {/* === GLOBAL TOPBAR === */}
            {currentView !== 'Home' && (
                <TopBar 
                    currentView={currentView}
                    currentTime={currentTime} 
                    onFormatOS={handleGlobalReset} 
                    onToggleSidebar={() => setIsSidebarOpen(prev => !prev)} 
                />
            )}

            {/* === SIDEBAR === */}
            <Sidebar 
                currentView={currentView} 
                setView={navigateTo} 
                isOpen={isSidebarOpen} 
                setIsOpen={setIsSidebarOpen} 
            />

            {/* === MAIN CONTENT AREA === */}
            <div className={`${currentView === 'Home' ? 'pt-0 md:pt-4' : 'pt-14'} min-h-screen flex flex-col transition-all duration-300 ${isSidebarOpen ? 'md:ml-64' : 'ml-0'}`}>
                <main className={`flex-1 w-full mx-auto transition-all duration-300 ${currentView === 'DBMS' ? 'p-2 md:p-4 max-w-[1600px]' : 'p-4 md:p-6 lg:p-10 max-w-7xl'}`}>
                    
                    <div key={currentView} className={`animate-in fade-in slide-in-from-bottom-4 duration-500 ${currentView === 'DBMS' ? 'h-[calc(100vh-6rem)]' : 'min-h-[500px]'}`}>
                        <ErrorBoundary viewName={currentView}>
                            <Suspense fallback={<PageSkeleton />}>
                                {/* === HOME & META === */}
                                {currentView === 'Home' && <HomePage setView={navigateTo} onOpenSidebar={() => setIsSidebarOpen(true)} />}
                                {currentView === 'Contributors' && <Contributors setView={navigateTo} />}

                                {/* === FUNDAMENTALS === */}
                                {currentView === 'Fundamentals' && <NumberSystem />}
                                {currentView === 'MemoryHierarchy' && <MemoryHierarchy />}

                                {/* === DIGITAL APTITUDE === */}
                                {currentView === 'StackLIFO' && <MemoryLogic mode="stack" />}
                                {currentView === 'QueueFIFO' && <MemoryLogic mode="queue" />}
                                {currentView === 'MemoryLayout' && <CodeBreakdown />}
                                {currentView === 'LogicGates' && <LogicGates />}
                                {currentView === 'DBMS' && <DBMSPlayground />}

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
                <Footer mini={currentView !== 'Home'} />
            </div>
        </div>
    );
}
