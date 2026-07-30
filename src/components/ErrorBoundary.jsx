import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidUpdate(prevProps) {
        if (prevProps.viewName !== this.props.viewName) {
            this.setState({ hasError: false, error: null, errorInfo: null });
        }
    }

    componentDidCatch(error, errorInfo) {
        this.setState({
            error: error,
            errorInfo: errorInfo
        });
        // In a real app, log to an error reporting service here
        console.error("ErrorBoundary caught an error", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-6 border border-red-200 bg-red-50 w-full rounded-md m-4">
                    <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
                        <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-2">Something went wrong</h2>
                    <p className="text-xs text-slate-600 mb-6">A component in this module crashed. The rest of the application is still running.</p>
                    <button 
                        onClick={() => this.setState({ hasError: false })}
                        className="bg-slate-900 text-white px-4 py-2 text-xs font-bold uppercase tracking-widest hover:bg-slate-800 transition-colors"
                    >
                        Try Again
                    </button>
                    {this.props.showDetails && this.state.error && (
                        <details className="mt-6 text-left w-full max-w-2xl bg-white p-4 border border-red-100 overflow-auto">
                            <summary className="text-xs font-bold text-red-500 cursor-pointer mb-2">Error Details</summary>
                            <pre className="text-[10px] text-red-800 font-mono">
                                {this.state.error.toString()}
                                <br />
                                {this.state.errorInfo?.componentStack}
                            </pre>
                        </details>
                    )}
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
