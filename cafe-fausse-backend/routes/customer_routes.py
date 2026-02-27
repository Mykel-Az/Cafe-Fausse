from flask import Blueprint, jsonify, request
from models import Customer
from services.customer_service import create_customer, get_customer_by_email, update_customer_profile, get_all_customers
from services.utility_services import is_valid_email


customer_bp = Blueprint('customer_bp', __name__)
@customer_bp.route('/customers/check', methods=['POST']) 
def check_customer():
    data = request.get_json()
    email = data.get('email')
    if not email:
        return jsonify({'error': 'Email is required'}), 400
    
    if not is_valid_email(email):
        return jsonify({'error': 'Invalid email format'}), 400
    
    existing_customer = get_customer_by_email(email)
    if existing_customer:
        return jsonify({'exists': True, "customer_id": existing_customer.id, "name": existing_customer.name, "email": existing_customer.email, "profile_complete": existing_customer.profile_complete}), 200
    
    return jsonify({'exists': False, "email": email}), 200
    

@customer_bp.route('/customers/create', methods=['POST'])
def create_customer_route():
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    phone = data.get('phone')

    if not name or not email:
        return jsonify({'error': 'Name and email fields are required'}), 400
    
    if not is_valid_email(email):
        return jsonify({'error': 'Invalid email format'}), 400

    customer, created = create_customer(name, email, phone)
    if created:
        return jsonify({'message': 'Customer created successfully', 'customer': customer.to_dict()}), 201
    else:
        return jsonify({'message': 'Customer already exists', 'customer': customer.to_dict()}), 200
    

@customer_bp.route('/customers/<int:customer_id>/update', methods=['PUT'])
def update_customer(customer_id):
    data = request.get_json()
    name = data.get('name')
    phone = data.get('phone')

    customer = update_customer_profile(customer_id, name, phone)
    if not customer:
        return jsonify({'error': 'Customer not found'}), 404
    
    return jsonify({'message': 'Customer profile updated successfully', 'customer': customer.to_dict()}), 200


@customer_bp.route('/customers/<int:customer_id>/reservations', methods=['GET'])
def get_active_customer_reservations(customer_id):
    customer = Customer.query.get(customer_id)
    if not customer:
        return jsonify({'error': 'Customer not found'}), 404
    
    reservations = [res.to_summary_dict() for res in customer.reservations if res.status == 'active']
    return jsonify({'reservations': reservations}), 200