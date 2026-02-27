from datetime import datetime, date
from flask import Blueprint, jsonify, request
from models import Customer, Reservation, Staff
from extensions import db
from services.reservation_services import get_active_reservation_by_id, cancel_reservation
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity


staff_bp = Blueprint('staff_bp', __name__)

@staff_bp.route('/admin/create', methods=['POST'])
def create_staff():
    data = request.get_json()
    print(f"data: {data}")
    username = data.get('username')
    password = data.get('password')
    confirm_password = data.get('confirm_password')

    if not all([username or password or confirm_password]):
        return jsonify({'error': 'Missing required fields'}), 400

    if password != confirm_password:
        return jsonify({'error': 'passwords do not match'}), 400
    
    staff = Staff(username=username, password=password)
    db.session.add(staff)
    db.session.commit()

    return jsonify({'message': 'Staff created successfully', 'user': staff.to_dict()}), 200


@staff_bp.route('/staff/login', methods=['POST'])
def staff_login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    staff = Staff.query.filter_by(username=username).first()

    if not staff or staff.password != password:
        return jsonify({'error': 'Invalid credentials'}), 401
    
    access_token = create_access_token(identity=str(staff.id))

    return jsonify({'message': 'Login Successful', 'access_token': access_token}), 200


@staff_bp.route('/admin/dashboard', methods=['GET'])
@jwt_required()
def dashboard_overview():

    today = date.today()

    total_today = Reservation.query.filter(
        db.func.date(Reservation.reservation_time_slot) == today
    ).count()

    active_now = Reservation.query.filter_by(status='active').count()

    completed_today = Reservation.query.filter(
        Reservation.status == 'completed',
        db.func.date(Reservation.updated_at) == today
    ).count()

    cancelled_today = Reservation.query.filter(
        Reservation.status == 'cancelled',
        db.func.date(Reservation.updated_at) == today
    ).count()

    total_customers = Customer.query.count()

    return jsonify({
        "today_reservations": total_today,
        "active_reservations": active_now,
        "completed_today": completed_today,
        "cancelled_today": cancelled_today,
        "total_customers": total_customers
    }), 200




@staff_bp.route('/staff/reservations', methods=['GET'])
@jwt_required()
def get_all_reservations():
  
    now = datetime.now()

    date_str   = request.args.get('date', '').strip()
    status_raw = request.args.get('status', '').strip()
    checked_in = request.args.get('checked_in', '').strip().lower()
    upcoming   = request.args.get('upcoming', '').strip().lower()
    search     = request.args.get('search', '').strip()
    page       = request.args.get('page', 1, type=int)
    per_page   = request.args.get('per_page', 20, type=int)

    query = Reservation.query

    if date_str:
        try:
            filter_date = datetime.strptime(date_str, '%Y-%m-%d').date()
        except ValueError:
            return jsonify({'error': 'Invalid date format. Use YYYY-MM-DD'}), 400
        query = query.filter(
            db.func.date(Reservation.reservation_time_slot) == filter_date
        )

    if status_raw:
        valid_statuses = {'active', 'cancelled', 'completed', 'expired'}
        statuses = [s.strip() for s in status_raw.split(',') if s.strip()]
        invalid = [s for s in statuses if s not in valid_statuses]
        if invalid:
            return jsonify({'error': f'Invalid status: {invalid}'}), 400
        query = query.filter(Reservation.status.in_(statuses))

    if checked_in == 'true':
        query = query.filter(Reservation.checked_in == True)
    elif checked_in == 'false':
        query = query.filter(Reservation.checked_in == False)

    if upcoming == 'true':
        query = query.filter(Reservation.reservation_time_slot >= now)

    if search:
        query = query.join(Customer, Reservation.customer_id == Customer.id).filter(
            db.or_(
                Customer.name.ilike(f'%{search}%'),
                Customer.email.ilike(f'%{search}%'),
            )
        )

    query = query.order_by(Reservation.reservation_time_slot.asc())
    pagination = query.paginate(page=page, per_page=per_page, error_out=False)

    reservations = []
    for r in pagination.items:
        reservations.append({
            'id': r.id,
            'name': r.customer.name or 'N/A',
            'email': r.customer.email,
            'phone': r.customer.phone or 'N/A',
            'time_slot': r.reservation_time_slot.isoformat(),
            'table_number': r.table_number,
            'guest_count': r.guest_count,
            'checked_in': r.checked_in,
            'status': r.status,
        })

    return jsonify({
        "reservations": reservations,
        "total": pagination.total,
        "pages": pagination.pages,
        "current_page": pagination.page,
    }), 200


@staff_bp.route('/admin/reservations/today', methods=['GET'])
@jwt_required()
def today_reservations():
    today = date.today()

    reservations = Reservation.query.filter(
        db.func.date(Reservation.reservation_time_slot) == today
    ).order_by(Reservation.reservation_time_slot.asc()).all()

    return jsonify({"reservations": [r.to_dict() for r in reservations]}), 200



@staff_bp.route('/staff/reservations/<int:reservation_id>/check-in', methods=['POST'])
@jwt_required()
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



@staff_bp.route('/admin/reservations/<int:id>/complete', methods=['PATCH'])
@jwt_required()
def complete_reservation(id):

    reservation = Reservation.query.get(id)
    if not reservation:
        return jsonify({"error": "Reservation not found"}), 404

    reservation.status = 'completed'
    db.session.commit()

    return jsonify({"message": "Reservation marked as completed"}), 200


@staff_bp.route('/admin/customers', methods=['GET'])
@jwt_required()
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
@jwt_required()
def force_cancel_reservation(reservation_id):
    reservation = Reservation.query.get(reservation_id)
    if not reservation:
        return jsonify({'message': 'Reservation not found'}), 404

    reservation.status = 'cancelled'
    db.session.commit()

    return jsonify({'message': 'Reservation force cancelled'}), 200


@staff_bp.route('/staff/reservations/<int:reservation_id>/mark-no-show', methods=['POST'])
@jwt_required()
def mark_no_show(reservation_id):
    reservation = get_active_reservation_by_id(reservation_id)
    if not reservation:
        return jsonify({'message': 'Reservation not found'}), 404

    reservation.status = 'expired'
    db.session.commit()

    return jsonify({'message': 'Marked as no-show'}), 200


@staff_bp.route('/staff/reservations/search', methods=['GET'])
@jwt_required()
def search_reservations():
    email = request.args.get('email')

    if not email:
        return jsonify({'message': 'Email required'}), 400

    reservations = Reservation.query.join(Customer).filter(
        Customer.email == email
    ).all()

    return jsonify({
        "reservations": [r.to_summary_dict() for r in reservations]
    }), 200