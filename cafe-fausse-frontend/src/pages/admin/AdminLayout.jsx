import { useEffect } from "react";
import { Link, useLocation, useNavigate, Outlet } from "react-router-dom";
import { isLoggedIn, logout } from "../../services/adminService";

const NAV = [
    {
        to: "/admin/dashboard", label: "Dashboard",
        icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
    },
    {
        to: "/admin/reservations", label: "Reservations",
        icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
    },
    {
        to: "/admin/customers", label: "Customers",
        icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    },
];

export default function AdminLayout() {
    const { pathname } = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoggedIn()) navigate("/admin/login", { replace: true });
    }, [pathname, navigate]);

    if (!isLoggedIn()) return null;

    function handleLogout() {
        logout();
        navigate("/admin/login");
    }

    return (
        <div className="admin-layout">
            <aside className="admin-sidebar">
                <div className="admin-sidebar-brand">
                    <span className="admin-sidebar-eyebrow">Staff Portal</span>
                    <Link to="/" className="admin-sidebar-logo">Café Fausse</Link>
                </div>

                <nav className="admin-nav" aria-label="Admin navigation">
                    {NAV.map(item => (
                        <Link
                            key={item.to}
                            to={item.to}
                            className={`admin-nav-item${pathname.startsWith(item.to) ? " active" : ""}`}
                        >
                            {item.icon}
                            <span>{item.label}</span>
                        </Link>
                    ))}
                </nav>

                <button className="admin-logout-btn" onClick={handleLogout} aria-label="Sign out">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                    Sign Out
                </button>
            </aside>

            <main className="admin-main">
                <Outlet />
            </main>
        </div>
    );
}