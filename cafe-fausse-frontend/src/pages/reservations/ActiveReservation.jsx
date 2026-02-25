export default function ActiveReservations({
    activeReservations,
    openReservation,
    cancelReservation,
    startEditing,
    onCreateNew
}) {
    return (
        <div>
            <p className="res-cards-head">Your Reservations</p>

            {activeReservations.map((res) => (
                <div key={res.id} className="res-card">
                    <p><strong>ID:</strong> {res.id}</p>
                    <p><strong>Date:</strong> {new Date(res.time_slot).toLocaleString()}</p>
                    <p><strong>Guests:</strong> {res.guest_count}</p>
                    <p><strong>Table:</strong> {res.table_number}</p>
                    <div className="res-card-actions">
                        <button className="res-card-btn" onClick={() => openReservation(res.id)}>View</button>
                        <button className="res-card-btn" onClick={() => startEditing(res)}>Edit</button>
                        <button className="res-card-btn cancel" onClick={() => cancelReservation(res.id)}>Cancel</button>
                    </div>
                </div>
            ))}

            <button className="res-new-btn" onClick={onCreateNew}>+ New Reservation</button>
        </div>
    );
}