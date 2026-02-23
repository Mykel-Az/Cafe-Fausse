from datetime import datetime, date
from flask import Blueprint, jsonify, request
from models import Customer, Reservation
from extensions import db
from services.reservation_services import get_active_reservation_by_id, cancel_reservation



staff_bp = Blueprint('staff_bp', __name__)

@staff_bp.route('/staff/reservations', methods=['GET'])
def get_all_reservations():
    filter_type = request.args.get('filter')
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 20, type=int)
    now = datetime.now()

    query = Reservation.query
    if filter_type == 'today':
        today = date.today()
        query = query.filter(db.func.date(Reservation.reservation_time_slot) == today)
    elif filter_type == 'active':
        query = query.filter_by(status='active')
    elif filter_type == 'cancelled':
        query = query.filter_by(status='cancelled')
    elif filter_type == 'completed':
        query = query.filter_by(status='completed')
    elif filter_type == 'upcoming':
        query = query.filter(Reservation.reservation_time_slot >= now)
    elif filter_type == 'unchecked':
        query = query.filter_by(status= 'active', checked_in=False)

    pagination = query.paginate(page=page, per_page=per_page, error_out=False)
    db_reservations = pagination.items
    
    reservations = []
    for reserved in db_reservations:
        reservations.append({
            'id': reserved.id,
            'name': reserved.customer.name if reserved.customer.name else 'N/A',
            'email': reserved.customer.email,
            'phone': reserved.customer.phone if reserved.customer.phone else 'N/A',
            'time_slot': reserved.reservation_time_slot.isoformat(),
            'table_number': reserved.table_number,
            'guest_count': reserved.guest_count,
            'checked_in': reserved.checked_in,
            'status': reserved.status
        })

    return jsonify({
        "reservations": reservations,
        "total": pagination.total,
        "pages": pagination.pages,
        "current_page": pagination.page
        }), 200


@staff_bp.route('/staff/reservations/<int:reservation_id>/check-in', methods=['POST'])
def check_in_reservation(reservation_id):
    reservation = get_active_reservation_by_id(reservation_id)
    if not reservation:
        return jsonify({'message': 'Reservation not found'}), 404
    
    if reservation.checked_in:
        return jsonify({'message': 'Customer already checked in'}), 400
    
    reservation.checked_in = True
    reservation.checked_in_time = datetime.now()
    db.session.commit()

    return jsonify({'message': 'Customer checked in successfully', 'reservation': reservation.to_dict()}), 200


@staff_bp.route('/staff/customers', methods=['GET'])
def get_all_customers():
    filter_type = request.args.get('filter')

    query = Customer.query
    if filter_type == 'newsletter':
        query = query.filter_by(newsletter_signup=True)
    elif filter_type == 'incomplete_profiles':
        query = query.filter_by(profile_complete=False)
    
    customers = query.all()

    customer_list = []
    for customer in customers:
        customer_list.append({
            'id': customer.id,
            'name': customer.name,
            'email': customer.email,
            'phone': customer.phone,
            'newsletter_signup': customer.newsletter_signup,
            'profile_complete': customer.profile_complete
        })
    return jsonify({'customers': customer_list}), 200


@staff_bp.route('/staff/reservations/<int:reservation_id>/force-cancel', methods=['POST'])
def force_cancel_reservation(reservation_id):
    reservation = Reservation.query.get(reservation_id)
    if not reservation:
        return jsonify({'message': 'Reservation not found'}), 404

    reservation.status = 'cancelled'
    db.session.commit()

    return jsonify({'message': 'Reservation force cancelled'}), 200


@staff_bp.route('/staff/reservations/<int:reservation_id>/mark-no-show', methods=['POST'])
def mark_no_show(reservation_id):
    reservation = get_active_reservation_by_id(reservation_id)
    if not reservation:
        return jsonify({'message': 'Reservation not found'}), 404

    reservation.status = 'expired'
    db.session.commit()

    return jsonify({'message': 'Marked as no-show'}), 200


@staff_bp.route('/staff/dashboard-stats', methods=['GET'])
def dashboard_stats():
    today = date.today()

    total_today = Reservation.query.filter(
        db.func.date(Reservation.reservation_time_slot) == today
    ).count()

    active = Reservation.query.filter_by(status='active').count()
    completed = Reservation.query.filter_by(status='completed').count()
    cancelled = Reservation.query.filter_by(status='cancelled').count()

    return jsonify({
        "today_reservations": total_today,
        "active": active,
        "completed": completed,
        "cancelled": cancelled
    })


@staff_bp.route('/staff/reservations/search', methods=['GET'])
def search_reservations():
    email = request.args.get('email')

    if not email:
        return jsonify({'message': 'Email required'}), 400

    reservations = Reservation.query.join(Customer).filter(
        Customer.email == email
    ).all()

    return jsonify({
        "reservations": [r.to_dict() for r in reservations]
    })