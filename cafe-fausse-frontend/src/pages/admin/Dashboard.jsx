import { useState, useEffect, useCallback } from "react";
import { getDashboard, getReservations, checkIn, completeReservation, markNoShow } from "../../services/adminService";

function StatCard({ label, value }) {
    return (
        <div className="admin-stat-card">
            <span className="admin-stat-label">{label}</span>
            <span className="admin-stat-value">{value ?? "—"}</span>
        </div>
    );
}

function fmt(isoStr) {
    return new Date(isoStr).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
}

export default function Dashboard() {
    const [stats, setStats] = useState(null);
    const [todayRes, setTodayRes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const load = useCallback(async () => {
        setLoading(true); setError("");
        try {
            const today = new Date().toISOString().split("T")[0];
            const [s, r] = await Promise.all([
                getDashboard(),
                getReservations({ date: today, per_page: 50 }),
            ]);
            setStats(s);
            setTodayRes(r.reservations);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { load(); }, [load]);

    async function handleAction(action, id) {
        try {
            if (action === "checkin")  await checkIn(id);
            if (action === "complete") await completeReservation(id);
            if (action === "noshow")   await markNoShow(id);
            await load();
        } catch (err) { setError(err.message); }
    }

    if (loading) return <div className="admin-loading">Loading…</div>;

    return (
        <div className="admin-page">
            <div className="admin-page-head">
                <h1>Dashboard</h1>
                <span className="admin-page-date">
                    {new Date().toLocaleDateString("en-US", {
                        weekday: "long", year: "numeric", month: "long", day: "numeric"
                    })}
                </span>
            </div>

            {error && <p className="res-error" role="alert" style={{ marginBottom: 20 }}>{error}</p>}

            <div className="admin-stats-grid">
                <StatCard label="Reservations Today"  value={stats?.today_reservations} />
                <StatCard label="Active"               value={stats?.active_reservations} />
                <StatCard label="Completed Today"      value={stats?.completed_today} />
                <StatCard label="Cancelled Today"      value={stats?.cancelled_today} />
                <StatCard label="Total Customers"      value={stats?.total_customers} />
            </div>

            <div className="admin-section">
                <h2 className="admin-section-title">Today's Schedule</h2>

                {todayRes.length === 0 ? (
                    <p className="admin-empty">No reservations scheduled for today.</p>
                ) : (
                    <div className="admin-table-wrap">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Time</th>
                                    <th>Guest</th>
                                    <th>Party</th>
                                    <th>Table</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {todayRes.map(r => (
                                    <tr key={r.id}>
                                        <td style={{ fontWeight: 500 }}>{fmt(r.time_slot)}</td>
                                        <td>
                                            <span className="admin-table-name">{r.name}</span>
                                            <span className="admin-table-sub">{r.email}</span>
                                        </td>
                                        <td>{r.guest_count}</td>
                                        <td>{r.table_number}</td>
                                        <td>
                                            <span className={`admin-badge admin-badge-${r.status}`}>{r.status}</span>
                                            {r.checked_in && <span className="admin-badge admin-badge-checked">✓ in</span>}
                                        </td>
                                        <td>
                                            <div className="admin-row-actions">
                                                {r.status === "active" && !r.checked_in && (
                                                    <button className="admin-action-btn" onClick={() => handleAction("checkin", r.id)}>Check In</button>
                                                )}
                                                {r.status === "active" && r.checked_in && (
                                                    <button className="admin-action-btn" onClick={() => handleAction("complete", r.id)}>Complete</button>
                                                )}
                                                {r.status === "active" && (
                                                    <button className="admin-action-btn danger" onClick={() => handleAction("noshow", r.id)}>No Show</button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}