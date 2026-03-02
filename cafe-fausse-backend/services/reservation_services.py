from models import Reservation, Customer
from extensions import db
from datetime import datetime, timedelta
from .booking_engine import within_working_hours, assign_available_table, validate_reservation_request
from config import BLOCKING_HOURS


def get_active_reservation_by_id(reservation_id):
    """Fetch an active reservation by ID. Returns None if not found."""
    reservation = Reservation.query.filter_by(id=reservation_id, status='active').first()
    if not reservation:
        return None
    return reservation


def create_reservation(customer_id, reservation_time_slot, guest_count):
    """
    Validate and create a new reservation, assigning a random available table.
    Returns (success: bool, result: Reservation | error: str).
    """
    is_valid, message = validate_reservation_request(customer_id, reservation_time_slot, guest_count)
    if not is_valid:
        return False, message

    table_number = assign_available_table(reservation_time_slot)
    if not table_number:
        return False, "No tables available"

    reservation = Reservation(
        customer_id=customer_id,
        reservation_time_slot=reservation_time_slot,
        guest_count=guest_count,
        table_number=table_number
    )

    db.session.add(reservation)
    db.session.commit()

    return True, reservation


def update_reservation(reservation_id, reservation_time_slot=None, guest_count=None):
    """
    Update the time slot and/or guest count of an active reservation.
    Re-validates and reassigns a table if the time slot changes.
    Returns (success: bool, result: dict | error: str).
    """
    reservation = get_active_reservation_by_id(reservation_id)
    if not reservation:
        return False, "Reservation not found"

    now = datetime.now()
    if reservation_time_slot:
        is_valid, message = validate_reservation_request(None, reservation_time_slot, guest_count or reservation.guest_count)
        if not is_valid:
            return False, message

        if reservation_time_slot <= now:
            return False, 'Cannot change a reservation that has already started'

        table_number = assign_available_table(reservation_time_slot)
        if not table_number:
            return False, "No tables available at the new time slot"

        reservation.reservation_time_slot = reservation_time_slot
        reservation.table_number = table_number

    if guest_count:
        reservation.guest_count = guest_count

    db.session.commit()
    return True, reservation.to_dict()


def cancel_reservation(reservation_id):
    """
    Cancel an active reservation. Prevents cancellation if already started or cancelled.
    Returns (success: bool, result: dict | error: str).
    """
    reservation = get_active_reservation_by_id(reservation_id)
    if reservation is None:
        return False, 'Reservation not found'

    now = datetime.now()

    if reservation.status == 'cancelled':
        return False, 'Reservation already cancelled'

    if reservation.reservation_time_slot <= now:
        return False, 'Cannot cancel an expired reservation'

    reservation.status = 'cancelled'
    db.session.commit()

    return True, reservation.to_dict()


def old_reservations():
    """
    Mark past active reservations as 'completed' (checked in) or 'expired' (no-show).
    Runs on a scheduled interval via APScheduler.
    """
    now = datetime.now()
    cutoff_time = now - timedelta(hours=BLOCKING_HOURS)

    expired_reservations = Reservation.query.filter(
        Reservation.status == 'active',
        Reservation.reservation_time_slot < cutoff_time
    ).all()

    for reservation in expired_reservations:
        if reservation.checked_in:
            reservation.status = 'completed'
        else:
            reservation.status = 'expired'

    db.session.commit()