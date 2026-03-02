import { Link, useLocation } from "react-router-dom";

export default function NotFound() {
    const { pathname } = useLocation();
    const isAdmin = pathname.startsWith("/admin");

    if (isAdmin) {
        return (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh" }}>
                <div style={{ textAlign: "center" }}>
                    <span className="admin-stat-label">Error 404</span>
                    <h1 style={{ fontFamily: "var(--ff-display)", fontSize: "2rem", fontWeight: 400, margin: "12px 0 8px" }}>
                        Page not found
                    </h1>
                    <p style={{ color: "var(--ink-soft)", marginBottom: "24px", fontSize: "0.9rem" }}>
                        The page you're looking for doesn't exist.
                    </p>
                    <Link to="/admin/dashboard" className="admin-btn admin-btn-primary">
                        Back to Dashboard
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="error-page">
                <div className="error-page-inner">
                    <span className="error-code">404</span>
                    <h1 className="error-title">Page Not Found</h1>
                    <p className="error-msg">
                        The page you're looking for doesn't exist or may have been moved.
                    </p>
                    <div className="error-actions">
                        <Link to="/" className="btn btn-dark">Back to Home</Link>
                        <Link to="/reservations" className="btn btn-ghost">Make a Reservation</Link>
                    </div>
                </div>
            </div>
        </>
    );
}