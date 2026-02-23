from models import Customer
from extensions import db

def get_customer_by_email(email):
    return Customer.query.filter_by(email=email).first()

def create_customer(name, email, phone=None):
    existing_customer = get_customer_by_email(email)
    if existing_customer:
        return existing_customer, False  # Customer already exists

    new_customer = Customer(name=name, email=email, phone=phone, profile_complete=True)
    db.session.add(new_customer)
    db.session.commit()
    return new_customer, True  # New customer created


def update_customer_profile(customer_id, name, phone):
    customer = Customer.query.get(customer_id)
    if not customer:
        return None  # Customer not found

    if name is not None:
        customer.name = name
    if phone is not None:
        customer.phone = phone

    # Check if profile is complete (for simplicity, we consider it complete if name and phone are provided)
    customer.profile_complete = bool(customer.name and customer.phone)

    db.session.commit()
    return customer


def get_all_customers():
    return Customer.query.all()

