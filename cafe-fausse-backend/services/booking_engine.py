import random
from models import Reservation, Customer
from extensions import db
from datetime import datetime, timedelta, time
from config import BLOCKING_HOURS, TOTAL_TABLES, MIN_PARTY_SIZE, MAX_PARTY_SIZE, MIN_ADVANCE_HOURS, MAX_ADVANCE_DAYS


def check_same_day_reservation(customer_id, requested_time_slot=None, requested_date=None):
    """Check if a customer already has an active reservation on the given date."""
    requested_date = requested_time_slot.date() if requested_time_slot else requested_date

    existing_reservation_same_day = Reservation.query.filter(
        Reservation.customer_id == customer_id,
        Reservation.status == 'active',
        db.func.date(Reservation.reservation_time_slot) == requested_date
    ).first()

    if existing_reservation_same_day:
        return False
    return True


def within_working_hours(time_slot):
    """Check if a time slot falls within opening hours (Mon–Sat 5PM–11PM, Sun 5PM–9PM)."""
    day_of_week = time_slot.weekday()
    opening_time = time(17, 0)

    if day_of_week == 6:
        closing_time = time(21, 0)
    else:
        closing_time = time(23, 0)

    reservation_date = time_slot.date()
    opening_datetime = datetime.combine(reservation_date, opening_time)
    closing_datetime = datetime.combine(reservation_date, closing_time)
    reservation_end = time_slot + timedelta(hours=BLOCKING_HOURS)

    if time_slot < opening_datetime or reservation_end > closing_datetime:
        return False
    return True


def assign_available_table(requested_time):
    """Randomly assign an available table for the requested time slot. Returns None if fully booked."""

    requested_end = requested_time + timedelta(hours=BLOCKING_HOURS)
    table_numbers = list(range(1, TOTAL_TABLES + 1))
    random.shuffle(table_numbers)

    for table_number in table_numbers:
        overlapping_reservation = Reservation.query.filter(
            Reservation.table_number == table_number,
            Reservation.status == 'active',
            Reservation.reservation_time_slot < requested_end,
            Reservation.reservation_time_slot >= requested_time - timedelta(hours=BLOCKING_HOURS)
        ).first()

        if not overlapping_reservation:
            return table_number

    return None


def validate_reservation_request(customer_id, requested_time, guest_count):
    """
    Validate a reservation request against all business rules.
    Returns (is_valid: bool, message: str | None).
    """
    now = datetime.now()

    if requested_time <= now + timedelta(hours=MIN_ADVANCE_HOURS):
        return False, f'Reservation time must be at least {MIN_ADVANCE_HOURS} hour(s) in the advance'

    if requested_time >= now + timedelta(days=MAX_ADVANCE_DAYS):
        return False, f'Reservation time cannot be more than {MAX_ADVANCE_DAYS} days in the advance'

    if guest_count:
        if guest_count < MIN_PARTY_SIZE or guest_count > MAX_PARTY_SIZE:
            return False, f'Guest count must be between {MIN_PARTY_SIZE} and {MAX_PARTY_SIZE}'

    if requested_time.minute not in [0, 30] or requested_time.second != 0 or requested_time.microsecond != 0:
        return False, 'Reservations can only be made on the hour or half-hour'

    if not within_working_hours(requested_time):
        return False, "We're closed at that time. Please select within business hours."

    if customer_id:
        if not check_same_day_reservation(customer_id, requested_time):
            return False, "You already have a reservation for this day. Only one reservation per day is allowed."

    return True, None


def generate_time_slots(selected_date):
    """Generate all 30-minute time slots for a given date based on opening hours."""
    weekday = selected_date.weekday()
    if weekday == 6:
        opening_time = time(17, 0)
        closing_time = time(21, 0)
    else:
        opening_time = time(17, 0)
        closing_time = time(23, 0)

    time_slots = []
    current_time = datetime.combine(selected_date, opening_time)
    closing_datetime = datetime.combine(selected_date, closing_time)

    while current_time <= closing_datetime:
        time_slots.append(current_time)
        current_time += timedelta(minutes=30)

    return time_slots


def get_available_time_slots(selected_date):
    """
    Return available and fully booked slots for a given date.
    Returns (result: dict, error: str | None).
    """
    all_time_slots = generate_time_slots(selected_date)
    available_time_slots = []
    fully_booked_slots = []

    for time_slot in all_time_slots:
        is_valid, _ = validate_reservation_request(None, time_slot, None)
        if not is_valid:
            continue

        table_number = assign_available_table(time_slot)
        if table_number:
            available_time_slots.append(time_slot.strftime('%H:%M'))
        else:
            fully_booked_slots.append(time_slot.strftime('%H:%M'))

    return {
        "available_slots": available_time_slots,
        "fully_booked_slots": fully_booked_slots
    }, None