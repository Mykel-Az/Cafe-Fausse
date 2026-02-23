from flask import Blueprint, jsonify, request
from services.utility_services import is_valid_email
from services.customer_service import get_customer_by_email
from models import Customer
from extensions import db


newsletter_bp = Blueprint('newsletter_bp', __name__)

@newsletter_bp.route('/newsletter-signup', methods=['POST'])
def newsletter_signup():
    data = request.get_json()
    email = data.get('email')

    if not is_valid_email(email):
        return jsonify({'message': 'Email is Invalid'}), 400
    
    customer = get_customer_by_email(email)
    if customer:
        customer.newsletter_signup = True
    else:
        customer = Customer(email=email, newsletter_signup=True, profile_complete=False)
        db.session.add(customer)
    db.session.commit()

    return jsonify({'message': 'Successfully signed up for newsletter'}), 200


