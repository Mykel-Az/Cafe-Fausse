import logging
from models import Reservation
from extensions import db
from datetime import datetime, timedelta
from .booking_engine import assign_available_table, validate_reservation_request
from config import BLOCKING_HOURS

logger = logging.getLogger(__name__)


def get_active_reservation_by_id(reservation_id):
    """Fetch an active reservation by ID. Returns None if not found."""
    reservation = Reservation.query.filter_by(id=reservation_id, status='active').first()
    if not reservation:
        logger.warning(f'Active reservation {reservation_id} not found')
    return reservation


def create_reservation(customer_id, reservation_time_slot, guest_count):
    """
    Validate and create a new reservation, assigning a random available table.
    Returns (success: bool, result: Reservation | error: str).
    """
    is_valid, message = validate_reservation_request(customer_id, reservation_time_slot, guest_count)
    if not is_valid:
        logger.warning(f'Reservation creation failed for customer {customer_id}: {message}')
        return False, message

    table_number = assign_available_table(reservation_time_slot)
    if not table_number:
        logger.warning(f'No tables available for slot {reservation_time_slot}')
        return False, "No tables available"

    reservation = Reservation(
        customer_id=customer_id,
        reservation_time_slot=reservation_time_slot,
        guest_count=guest_count,
        table_number=table_number
    )

    db.session.add(reservation)
    db.session.commit()
    logger.info(f'Reservation created — id: {reservation.id}, customer: {customer_id}, table: {table_number}, slot: {reservation_time_slot}')
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
            logger.warning(f'Reservation update failed for id {reservation_id}: {message}')
            return False, message

        if reservation_time_slot <= now:
            return False, 'Cannot change a reservation that has already started'

        table_number = assign_available_table(reservation_time_slot)
        if not table_number:
            logger.warning(f'No tables available for new slot {reservation_time_slot} on update')
            return False, "No tables available at the new time slot"

        reservation.reservation_time_slot = reservation_time_slot
        reservation.table_number = table_number

    if guest_count:
        reservation.guest_count = guest_count

    db.session.commit()
    logger.info(f'Reservation {reservation_id} updated — new slot: {reservation_time_slot}, guests: {guest_count}')
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
        logger.warning(f'Reservation {reservation_id} is already cancelled')
        return False, 'Reservation already cancelled'

    if reservation.reservation_time_slot <= now:
        logger.warning(f'Attempted to cancel expired reservation {reservation_id}')
        return False, 'Cannot cancel an expired reservation'

    reservation.status = 'cancelled'
    db.session.commit()
    logger.info(f'Reservation {reservation_id} cancelled')
    return True, reservation.to_dict()


def old_reservations():
    """
    Mark past active reservations as 'completed' (checked in) or 'expired' (no-show).
    Runs on a scheduled interval via APScheduler.
    """
    now = datetime.now()
    cutoff_time = now - timedelta(hours=BLOCKING_HOURS)

    past_reservations = Reservation.query.filter(
        Reservation.status == 'active',
        Reservation.reservation_time_slot < cutoff_time
    ).all()

    completed = 0
    expired = 0

    for reservation in past_reservations:
        if reservation.checked_in:
            reservation.status = 'completed'
            completed += 1
        else:
            reservation.status = 'expired'
            expired += 1

    db.session.commit()
    logger.info(f'old_reservations job — completed: {completed}, expired: {expired}')