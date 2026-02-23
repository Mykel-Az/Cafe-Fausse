from flask import Blueprint, jsonify, request
from datetime import datetime
from models import Reservation
from services.reservation_services import create_reservation, update_reservation, cancel_reservation
from services.booking_engine import validate_reservation_request, get_available_time_slots, check_same_day_reservation




reservation_bp = Blueprint('reservation_bp', __name__)

@reservation_bp.route('/reservations/<int:reservation_id>', methods=['GET'])
def get_reservation(reservation_id):
    reservation = Reservation.query.get(reservation_id)
    if not reservation:
        return jsonify({'message': 'Reservation not found'}), 404

    return jsonify({'reservation': reservation.to_dict()}), 200


@reservation_bp.route('/customers/<int:customer_id>/reservations', methods=['GET'])
def get_customer_active_reservations(customer_id):
    reservations = (Reservation.query.filter_by(customer_id=customer_id, status='active').all())
    
    reservations_data = [res.to_summary_dict() for res in reservations]
    return jsonify({'reservations': reservations_data}), 200


@reservation_bp.route('/availability', methods=['GET'])
def available_time_slots():
    date_str = request.args.get('date')
    customer_id = request.args.get('customer_id')

    print(f"Received request for available time slots on date: {date_str}")
    if not date_str:
        return jsonify({'error': 'Date parameter is required'}), 400
    
    try:
        selected_date = datetime.strptime(date_str, '%Y-%m-%d').date()
    except ValueError:
        return jsonify({'error': 'Invalid date format. Use YYYY-MM-DD'}), 400
    
    if customer_id:
        if not check_same_day_reservation(customer_id, requested_date=selected_date):
            return jsonify({'error': 'You already have a reservation on this date.'})
    
    time_slots, error = get_available_time_slots(selected_date)
    print(f"Available time slots for {selected_date}: {time_slots}")
    if error:
        return jsonify({'error': error}), 400
    
    return jsonify({"date": date_str, "time_slots": time_slots}), 200



@reservation_bp.route('/reservations/create', methods=['POST'])
def create_reservation_route():
    data = request.get_json()
    customer_id = data.get('customer_id')
    date = data.get('date')
    time = data.get('time')
    guest_count = data.get('guest_count')
    if not guest_count:
        return jsonify({'message': 'Guest count is required'}), 400
    guest_count = int(guest_count)

    if not all([date, time, guest_count]):
        return jsonify({'message': 'Missing required fields'}), 400

    try:
        requested_time = datetime.strptime(f"{date}{time}", '%Y-%m-%d%H:%M')
    except ValueError:
        return jsonify({'message': 'Invalid date or time format'}), 400
    
    success, result = create_reservation(customer_id, requested_time, guest_count)
    if success:
        return jsonify({'message': 'Reservation created successfully', 'reservation': result.to_dict()}), 201
    
    return jsonify({'error': result}), 400


@reservation_bp.route('/reservations/<int:reservation_id>/update', methods=['PUT'])
def update_reservation_route(reservation_id):
    data = request.get_json()
    date = data.get('date')
    time = data.get('time')
    guest_count = data.get('guest_count')

    try:
        new_time = datetime.strptime(f"{date}{time}", '%Y-%m-%d%H:%M')
    except ValueError:
        return jsonify({'message': 'Invalid date or time format'}), 400
    
    success, result = update_reservation(reservation_id, new_time, guest_count)
    if success:
        return jsonify({'message': 'Reservation updated successfully', 'reservation': result}), 200

    return jsonify({'error': result}), 400


@reservation_bp.route('/reservations/<int:reservation_id>/cancel', methods=['DELETE'])
def cancel_reservation_route(reservation_id):
    success, result = cancel_reservation(reservation_id)
    if success:
        return jsonify({'message': 'Reservation cancelled successfully', 'reservation': result})
    
    return jsonify({'error': result})

