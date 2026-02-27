import { useState, useEffect } from "react";
import { getCustomers } from "../../services/adminService";

const TABS = [
    { value: "",                    label: "All Customers" },
    { value: "newsletter",          label: "Newsletter" },
    { value: "incomplete_profiles", label: "Incomplete Profiles" },
];

export default function AdminCustomers() {
    const [filter, setFilter]       = useState("");
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading]     = useState(true);
    const [error, setError]         = useState("");

    useEffect(() => {
        async function load() {
            setLoading(true);
            setError("");
            try {
                const data = await getCustomers(filter);
                setCustomers(data.customers);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [filter]);

    return (
        <div className="admin-page">
            <div className="admin-page-head">
                <h1>Customers</h1>
                {!loading && <span className="admin-stat-sub">{customers.length} records</span>}
            </div>

            <div className="admin-tab-row">
                {TABS.map(t => (
                    <button
                        key={t.value}
                        className={`admin-tab${filter === t.value ? " active" : ""}`}
                        onClick={() => setFilter(t.value)}
                    >
                        {t.label}
                    </button>
                ))}
            </div>

            {error && <p className="res-error" role="alert" style={{ marginBottom: 16 }}>{error}</p>}

            <div className="admin-table-wrap">
                {loading ? (
                    <div className="admin-loading">Loading…</div>
                ) : customers.length === 0 ? (
                    <p className="admin-empty">No customers found.</p>
                ) : (
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Newsletter</th>
                                <th>Profile</th>
                            </tr>
                        </thead>
                        <tbody>
                            {customers.map(c => (
                                <tr key={c.id}>
                                    <td className="admin-table-muted">{c.id}</td>
                                    <td className="admin-table-name">{c.name || <span className="admin-table-muted">—</span>}</td>
                                    <td>{c.email}</td>
                                    <td>{c.phone || <span className="admin-table-muted">—</span>}</td>
                                    <td>
                                        <span className={`admin-badge ${c.newsletter_signup ? "admin-badge-active" : "admin-badge-expired"}`}>
                                            {c.newsletter_signup ? "Subscribed" : "No"}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`admin-badge ${c.profile_complete ? "admin-badge-completed" : "admin-badge-cancelled"}`}>
                                            {c.profile_complete ? "Complete" : "Incomplete"}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}