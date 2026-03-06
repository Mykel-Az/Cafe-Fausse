import { useState } from "react";

function fmt(iso, opts) { return new Date(iso).toLocaleString("en-US", opts); }
const fmtDate = iso => fmt(iso, { weekday:"long", month:"long", day:"numeric", year:"numeric" });
const fmtTime = iso => fmt(iso, { hour:"2-digit", minute:"2-digit" });
const fmtFull = iso => fmt(iso, { weekday:"long", month:"long", day:"numeric", year:"numeric", hour:"2-digit", minute:"2-digit" });

/* ── Two-column detail row ── */
function DetailRow({ label, value }) {
    return (
        <div className="res-detail-row">
            <span className="res-detail-label">{label}</span>
            <span className="res-detail-value">{value}</span>
        </div>
    );
}

/* ── Detail panel content (shared between desktop slide-in and mobile page) ── */
function DetailContent({ reservation, onEdit, onCancel }) {
    const [pendingCancel, setPendingCancel] = useState(false);
    const [lastId, setLastId]   = useState(null);

    if (reservation && reservation.id !== lastId) {
        setLastId(reservation.id);
        setPendingCancel(false);
    }

    if (!reservation) return null;

    return (
        <>
            <div className="res-detail-hero">
                <div className="res-confirm-icon">&#10022;</div>
            </div>

            {/* Customer group */}
            <div className="res-detail-group">
                <span className="res-detail-group-label">Guest</span>
                <DetailRow label="Name"  value={reservation.customer?.name  || "\u2014"} />
                <DetailRow label="Email" value={reservation.customer?.email || "\u2014"} />
            </div>

            {/* Booking group */}
            <div className="res-detail-group">
                <span className="res-detail-group-label">Booking</span>
                <DetailRow label="Date &amp; Time" value={fmtFull(reservation.time_slot)} />
                <DetailRow label="Guests" value={`${reservation.guest_count} guest${reservation.guest_count !== 1 ? "s" : ""}`} />
                <DetailRow label="Table"  value={`Table ${reservation.table_number}`} />
                <DetailRow label="Status" value={reservation.status} />
                <DetailRow label="ID"     value={`#${reservation.id}`} />
            </div>

            {!pendingCancel ? (
                <div className="res-detail-actions">
                    <button className="res-card-btn res-card-btn-primary" onClick={() => onEdit(reservation)}>
                        Edit Reservation
                    </button>
                    <button className="res-card-btn cancel" onClick={() => setPendingCancel(true)}>
                        Cancel Reservation
                    </button>
                </div>
            ) : (
                <div className="res-cancel-confirm">
                    <p>Are you sure you want to cancel this reservation?</p>
                    <div className="res-cancel-confirm-actions">
                        <button className="res-card-btn cancel"
                            onClick={() => { onCancel(reservation.id); setPendingCancel(false); }}>
                            Yes, Cancel It
                        </button>
                        <button className="res-card-btn" onClick={() => setPendingCancel(false)}>
                            Keep It
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}

/* ── Empty state ── */
function EmptyState({ onCreateNew }) {
    return (
        <div className="res-empty-state">
            <div className="res-empty-icon">&#10022;</div>
            <p className="res-empty-title">No active reservations</p>
            <p className="res-empty-sub">You don't have any upcoming reservations at the moment.</p>
            <button className="res-card-btn res-card-btn-primary" onClick={onCreateNew}>
                Make a Reservation
            </button>
        </div>
    );
}

/* ── Main component ── */
export default function ActiveReservations({
    activeReservations,
    selectedReservation,
    openReservation,
    cancelReservation,
    startEditing,
    onCreateNew,
    onBack,
}) {
    const [selectedId, setSelectedId] = useState(null);
    const [mobileDetailOpen, setMobileDetailOpen] = useState(false);
    const detailOpen = !!selectedReservation;

    function handleView(res) {
        setSelectedId(res.id);
        setMobileDetailOpen(true);
        openReservation(res.id);
    }

    function handleClose() {
        setSelectedId(null);
        setMobileDetailOpen(false);
        openReservation(null);
    }

    function handleEdit(res) {
        setSelectedId(null);
        setMobileDetailOpen(false);
        startEditing(res);
    }

    async function handleCancel(id) {
        await cancelReservation(id);
        setSelectedId(null);
        setMobileDetailOpen(false);
    }

    return (
        <div className="res-explorer-root">

            {/* ── Title bar ── */}
            <div className="res-explorer-titlebar">
                <button className="res-back-btn" onClick={onBack}>&#8592; Back</button>
                <p className="res-cards-head">Your Active Reservations</p>
                <button className="res-new-top-btn" onClick={onCreateNew}>
                    <span className="res-new-btn-full">+ New Reservation</span>
                    <span className="res-new-btn-short" aria-label="New reservation">+</span>
                </button>
            </div>

            {/* ── Body row ── */}
            <div className="res-explorer-body">

                {/* LEFT: card list */}
                <div className={"res-explorer-list"
                    + (detailOpen ? " shrunk" : "")
                    + (mobileDetailOpen ? " mobile-list-hidden" : "")
                }>
                    {activeReservations.length === 0 ? (
                        <EmptyState onCreateNew={onCreateNew} />
                    ) : (
                        activeReservations.map(res => (
                            <div key={res.id}
                                className={"res-card" + (selectedId === res.id ? " res-card-selected" : "")}
                                onClick={() => selectedId === res.id ? handleClose() : handleView(res)}
                                role="button" tabIndex={0}
                                onKeyDown={e => e.key === "Enter" && (selectedId === res.id ? handleClose() : handleView(res))}
                            >
                                <div className="res-card-detail">
                                    <span className="res-card-date">{fmtDate(res.time_slot)}</span>
                                    <span className="res-card-time">{fmtTime(res.time_slot)}</span>
                                    <span className="res-card-meta">
                                        {res.guest_count} guest{res.guest_count !== 1 ? "s" : ""} &middot; Table {res.table_number}
                                    </span>
                                </div>
                                <div className="res-card-actions">
                                    <button className="res-card-btn"
                                        onClick={e => { e.stopPropagation(); selectedId === res.id ? handleClose() : handleView(res); }}>
                                        {selectedId === res.id ? "Close" : "View Details"}
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* RIGHT: desktop sliding pane */}
                <div className={"res-detail-pane" + (detailOpen ? " open" : "")}>
                    <div className="res-detail-pane-inner">
                        <div className="res-detail-pane-header">
                            <span className="res-detail-eyebrow">Reservation Details</span>
                            <button className="res-detail-close" onClick={handleClose} aria-label="Close">&#x2715;</button>
                        </div>
                        <DetailContent
                            reservation={selectedReservation}
                            onEdit={handleEdit}
                            onCancel={handleCancel}
                        />
                    </div>
                </div>

            </div>{/* end body row */}

            {/* MOBILE: full-screen detail page */}
            {mobileDetailOpen && (
                <div className="res-mobile-detail-page">
                    <div className="res-mobile-detail-header">
                        <button className="res-back-btn" onClick={handleClose}>
                            &#8592; Back to Reservations
                        </button>
                        <span className="res-detail-eyebrow">Reservation Details</span>
                    </div>
                    <div className="res-mobile-detail-body">
                        <DetailContent
                            reservation={selectedReservation}
                            onEdit={handleEdit}
                            onCancel={handleCancel}
                        />
                    </div>
                </div>
            )}

        </div>
    );
}