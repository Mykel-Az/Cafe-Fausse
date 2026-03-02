import { Component } from "react";
import { Link } from "react-router-dom";

export default class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, info) {
        // You could log to an error reporting service here
        console.error("ErrorBoundary caught:", error, info);
    }

    handleReset() {
        this.setState({ hasError: false, error: null });
    }

    render() {
        if (!this.state.hasError) return this.props.children;

        return (
            <div className="error-page">
                <div className="error-page-inner">
                    <span className="error-code">500</span>
                    <h1 className="error-title">Something Went Wrong</h1>
                    <p className="error-msg">
                        An unexpected error occurred. Please try refreshing the page.
                    </p>
                    {this.state.error && (
                        <p className="error-detail">{this.state.error.message}</p>
                    )}
                    <div className="error-actions">
                        <button
                            className="btn btn-dark"
                            onClick={() => {
                                this.handleReset();
                                window.location.href = "/";
                            }}
                        >
                            Back to Home
                        </button>
                        <button
                            className="btn btn-ghost"
                            onClick={() => {
                                this.handleReset();
                                window.location.reload();
                            }}
                        >
                            Refresh Page
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}