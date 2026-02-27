import { useState, useEffect } from "react";
import { getReservations, checkIn, completeReservation, forceCancel, markNoShow } from "../../services/adminService";

const STATUS_OPTIONS = ["active", "completed", "cancelled", "expired"];

const EMPTY = { search: "", date: "", statuses: [], checked_in: "", upcoming: false };

function fmtDate(iso) {
    const d = new Date(iso);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
function fmtTime(iso) {
    return new Date(iso).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
}

export default function AdminReservations() {
    const [draft, setDraft]         = useState(EMPTY);     
    const [applied, setApplied]     = useState(EMPTY);     
    const [rows, setRows]           = useState([]);
    const [meta, setMeta]           = useState({ total: 0, pages: 1, current_page: 1 });
    const [loading, setLoading]     = useState(false);
    const [error, setError]         = useState("");

    async function loadRows(page = 1, f = applied) {
        setLoading(true); setError("");
        try {
            const params = {
                page, per_page: 25,
                ...(f.search            && { search: f.search }),
                ...(f.date              && { date: f.date }),
                ...(f.statuses.length   && { status: f.statuses.join(",") }),
                ...(f.checked_in !== "" && { checked_in: f.checked_in }),
                ...(f.upcoming          && { upcoming: "true" }),
            };
            const data = await getReservations(params);
            setRows(data.reservations);
            setMeta({ total: data.total, pages: data.pages, current_page: data.current_page });
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadRows(1, applied);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [applied]);

    function toggleStatus(s) {
        setDraft(p => ({
            ...p,
            statuses: p.statuses.includes(s) ? p.statuses.filter(x => x !== s) : [...p.statuses, s],
        }));
    }

    function applyFilters(e) {
        e.preventDefault();
        setApplied({ ...draft });
    }

    function reset() {
        setDraft(EMPTY);
        setApplied(EMPTY);
    }

    async function doAction(action, id) {
        try {
            if (action === "checkin")  await checkIn(id);
            if (action === "complete") await completeReservation(id);
            if (action === "cancel")   await forceCancel(id);
            if (action === "noshow")   await markNoShow(id);
            loadRows(meta.current_page);
        } catch (err) { setError(err.message); }
    }

    return (
        <div className="admin-page">
            <div className="admin-page-head">
                <h1>Reservations</h1>
                {!loading && <span className="admin-stat-sub">{meta.total} total</span>}
            </div>

            {/*  Filter panel  */}
            <form onSubmit={applyFilters} className="admin-filter-panel">
                <div className="admin-filter-row">
                    <div className="admin-filter-group" style={{ flex: "2 1 200px" }}>
                        <label className="admin-filter-label">Search name / email</label>
                        <input
                            className="admin-filter-input" type="text"
                            placeholder="e.g. john or john@example.com"
                            value={draft.search}
                            onChange={e => setDraft(p => ({ ...p, search: e.target.value }))}
                        />
                    </div>

                    <div className="admin-filter-group">
                        <label className="admin-filter-label">Date</label>
                        <input
                            className="admin-filter-input" type="date"
                            value={draft.date}
                            onChange={e => setDraft(p => ({ ...p, date: e.target.value }))}
                        />
                    </div>

                    <div className="admin-filter-group">
                        <label className="admin-filter-label">Checked In</label>
                        <select
                            className="admin-filter-input"
                            value={draft.checked_in}
                            onChange={e => setDraft(p => ({ ...p, checked_in: e.target.value }))}
                        >
                            <option value="">Any</option>
                            <option value="true">Yes</option>
                            <option value="false">No</option>
                        </select>
                    </div>

                    <div className="admin-filter-group admin-filter-check">
                        <label className="admin-filter-check-label admin-filter-label">
                            <input
                                type="checkbox" checked={draft.upcoming}
                                onChange={e => setDraft(p => ({ ...p, upcoming: e.target.checked }))}
                            />
                            Upcoming only
                        </label>
                    </div>
                </div>

                <div className="admin-filter-row">
                    <div className="admin-filter-group">
                        <label className="admin-filter-label">Status — select one or more</label>
                        <div className="admin-status-pills">
                            {STATUS_OPTIONS.map(s => (
                                <button
                                    key={s} type="button"
                                    onClick={() => toggleStatus(s)}
                                    className={`admin-status-pill admin-badge-${s}${draft.statuses.includes(s) ? " active" : ""}`}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="admin-filter-actions">
                        <button type="submit" className="admin-btn admin-btn-primary">Apply</button>
                        <button type="button" className="admin-btn admin-btn-ghost" onClick={reset}>Reset</button>
                    </div>
                </div>
            </form>

            {error && <p className="res-error" role="alert" style={{ marginBottom: 16 }}>{error}</p>}

            {/*  Table  */}
            <div className="admin-table-wrap">
                {loading ? (
                    <div className="admin-loading">Loading…</div>
                ) : rows.length === 0 ? (
                    <p className="admin-empty">No reservations match your filters.</p>
                ) : (
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Date / Time</th>
                                <th>Customer</th>
                                <th>Guests</th>
                                <th>Table</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map(r => (
                                <tr key={r.id}>
                                    <td className="admin-table-muted">{r.id}</td>
                                    <td>
                                        <span className="admin-table-name">{fmtDate(r.time_slot)}</span>
                                        <span className="admin-table-sub">{fmtTime(r.time_slot)}</span>
                                    </td>
                                    <td>
                                        <span className="admin-table-name">{r.name}</span>
                                        <span className="admin-table-sub">{r.email}</span>
                                    </td>
                                    <td>{r.guest_count}</td>
                                    <td>{r.table_number}</td>
                                    <td>
                                        <span className={`admin-badge admin-badge-${r.status}`}>{r.status}</span>
                                        {r.checked_in && <span className="admin-badge admin-badge-checked">✓</span>}
                                    </td>
                                    <td>
                                        <div className="admin-row-actions">
                                            {r.status === "active" && !r.checked_in && (
                                                <button className="admin-action-btn" onClick={() => doAction("checkin", r.id)}>Check In</button>
                                            )}
                                            {r.status === "active" && r.checked_in && (
                                                <button className="admin-action-btn" onClick={() => doAction("complete", r.id)}>Complete</button>
                                            )}
                                            {r.status === "active" && (
                                                <>
                                                    <button className="admin-action-btn danger" onClick={() => doAction("noshow", r.id)}>No Show</button>
                                                    <button className="admin-action-btn danger" onClick={() => doAction("cancel", r.id)}>Cancel</button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/*  Pagination  */}
            {meta.pages > 1 && (
                <div className="admin-pagination">
                    {Array.from({ length: meta.pages }, (_, i) => i + 1).map(p => (
                        <button
                            key={p}
                            className={`admin-page-btn${p === meta.current_page ? " active" : ""}`}
                            onClick={() => loadRows(p)}
                        >{p}</button>
                    ))}
                </div>
            )}
        </div>
    );
}