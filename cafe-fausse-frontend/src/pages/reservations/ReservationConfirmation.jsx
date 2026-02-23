export default function ReservationConfirmation({ confirmation, onNewReservation }) {
    return (
        <div className="reservation-confirmation">
            <h2>Reservation Confirmed!</h2>
            <p><strong>Reservation ID:</strong> {confirmation.id}</p>
            <p><strong>Name:</strong> {confirmation.customer.name}</p>
            <p><strong>Email:</strong> {confirmation.customer.email}</p>
            <p><strong>Phone:</strong> {confirmation.customer.phone}</p>
            <p><strong>Guests:</strong> {confirmation.guest_count}</p>
            <p><strong>Table Number:</strong> {confirmation.table_number}</p>
            <p><strong>Date & Time:</strong> {new Date(confirmation.time_slot).toLocaleString()}</p>
            <p><strong>Status:</strong> {confirmation.status}</p>
            <button onClick={onNewReservation}> Make Another Reservation </button>
        </div>
    );
}