export default function ReservationConfirmation({ confirmation, onNewReservation, onViewReservations, loadingGoTo }) {
    const dt = new Date(confirmation.time_slot);
    const dateStr = dt.toLocaleString("en-US", {
        weekday: "long", month: "long", day: "numeric", year: "numeric",
        hour: "2-digit", minute: "2-digit"
    });

    return (
        <div className="res-confirm">
            <div className="res-confirm-icon">&#10022;</div>
            <h2>You're confirmed</h2>

            {/* Customer group */}
            <div className="res-confirm-group">
                <span className="res-confirm-group-label">Guest</span>
                <div className="res-confirm-grid">
                    <span className="res-confirm-key">Name</span>
                    <span className="res-confirm-val">{confirmation.customer?.name}</span>
                    <span className="res-confirm-key">Email</span>
                    <span className="res-confirm-val">{confirmation.customer?.email}</span>
                </div>
            </div>

            {/* Booking group */}
            <div className="res-confirm-group">
                <span className="res-confirm-group-label">Booking</span>
                <div className="res-confirm-grid">
                    <span className="res-confirm-key">Date &amp; Time</span>
                    <span className="res-confirm-val">{dateStr}</span>
                    <span className="res-confirm-key">Guests</span>
                    <span className="res-confirm-val">{confirmation.guest_count} guest{confirmation.guest_count !== 1 ? "s" : ""}</span>
                    <span className="res-confirm-key">Table</span>
                    <span className="res-confirm-val">Table {confirmation.table_number}</span>
                    <span className="res-confirm-key">Status</span>
                    <span className="res-confirm-val res-confirm-status">{confirmation.status}</span>
                    <span className="res-confirm-key">ID</span>
                    <span className="res-confirm-val">#{confirmation.id}</span>
                </div>
            </div>

            <div className="res-confirm-actions">
                <button className="btn btn-dark" onClick={onNewReservation}>Make Another Reservation</button>
                {onViewReservations && (
                    <button
                        className={`btn btn-ghost-muted${loadingGoTo ? " disabled" : ""}`}
                        onClick={onViewReservations}
                        disabled={loadingGoTo}
                    >
                        <span className="res-submit-inner">
                            {loadingGoTo && <span className="res-spinner res-spinner-dark" aria-hidden="true" />}
                            {loadingGoTo ? "Loading…" : "View My Reservations"}
                        </span>
                    </button>
                )}
            </div>
        </div>
    );
}