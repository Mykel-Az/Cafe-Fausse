import logging
from models import Customer
from extensions import db

logger = logging.getLogger(__name__)


def get_customer_by_email(email):
    """Fetch a customer by email. Returns None if not found."""
    return Customer.query.filter_by(email=email).first()


def create_customer(name, email, phone=None):
    """
    Create a new customer. Returns the existing record if the email is already registered.
    Returns (customer: Customer, created: bool).
    """
    existing_customer = get_customer_by_email(email)
    if existing_customer:
        logger.info(f'Customer already exists for email: {email}')
        return existing_customer, False

    new_customer = Customer(name=name, email=email, phone=phone, profile_complete=True)
    db.session.add(new_customer)
    db.session.commit()
    logger.info(f'New customer created — id: {new_customer.id}, email: {email}')
    return new_customer, True


def update_customer_profile(customer_id, name, phone):
    """
    Update a customer's name and/or phone number.
    Sets profile_complete to True only when both fields are present.
    Returns the updated Customer, or None if not found.
    """
    customer = Customer.query.get(customer_id)
    if not customer:
        logger.warning(f'Customer {customer_id} not found for profile update')
        return None

    if name is not None:
        customer.name = name
    if phone is not None:
        customer.phone = phone

    customer.profile_complete = bool(customer.name and customer.phone)

    db.session.commit()
    logger.info(f'Customer {customer_id} profile updated — complete: {customer.profile_complete}')
    return customer


def get_all_customers():
    """Return all customer records."""
    return Customer.query.all()