export default function ActiveReservations({
    activeReservations,
    openReservation,
    cancelReservation,
    startEditing,
    onCreateNew
}) {
    return (
        <div className="existing-reservations">
            <h2>Welcome back, Your Active Reservations</h2>

            {activeReservations.map((res) => (
                <div key={res.id} className="reservation-card">
                    <p><strong>Reservation ID:</strong> {res.id}</p>
                    <p><strong>Date:</strong> {new Date(res.time_slot).toLocaleString()}</p>
                    <p><strong>Guests:</strong> {res.guest_count}</p>
                    <p><strong>Table:</strong> {res.table_number}</p>

                    <button onClick={() => openReservation(res.id)}>View</button>
                    <button onClick={() => cancelReservation(res.id)}>Cancel</button>
                    <button onClick={() => startEditing(res)}>Edit </button>
                </div>
            ))}

            <button onClick={onCreateNew}>Create New Reservation</button>
        </div>
    );
}