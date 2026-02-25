export default function ReservationConfirmation({ confirmation, onNewReservation }) {
    return (
        <div className="res-confirm">
            <div className="res-confirm-icon">✦</div>
            <h2>You're confirmed</h2>
            <p><strong>Reservation ID:</strong> {confirmation.id}</p>
            <p><strong>Name:</strong> {confirmation.customer.name}</p>
            <p><strong>Email:</strong> {confirmation.customer.email}</p>
            <p><strong>Guests:</strong> {confirmation.guest_count}</p>
            <p><strong>Table:</strong> {confirmation.table_number}</p>
            <p><strong>Date &amp; Time:</strong> {new Date(confirmation.time_slot).toLocaleString()}</p>
            <p><strong>Status:</strong> {confirmation.status}</p>
            <button className="btn btn-dark" onClick={onNewReservation}>Make Another Reservation</button>
        </div>
    );
}