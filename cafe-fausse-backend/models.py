from extensions import db
from datetime import datetime


class Customer(db.Model):
    __tablename__ = 'customers'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=True)
    email = db.Column(db.String(100), unique=True, index=True, nullable=False)
    phone = db.Column(db.String(20), nullable=True)
    newsletter_signup = db.Column(db.Boolean, default=False)
    profile_complete = db.Column(db.Boolean, default=False)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'phone': self.phone,
            'profile_complete': self.profile_complete
        }
    
class Reservation(db.Model):
    __tablename__ = 'reservations'

    id = db.Column(db.Integer, primary_key=True)
    customer_id = db.Column(db.Integer, db.ForeignKey('customers.id'), nullable=False)
    reservation_time_slot = db.Column(db.DateTime, nullable=False)
    table_number = db.Column(db.Integer, nullable=False)
    guest_count = db.Column(db.Integer, nullable=False)
    checked_in = db.Column(db.Boolean, default=False)
    checked_in_time = db.Column(db.DateTime, nullable=True)

    status = db.Column(db.String(50), default='active') # active, cancelled, completed, expired
    created_at = db.Column(db.DateTime, default=datetime.now)
    updated_at = db.Column(db.DateTime,  default=datetime.now, onupdate=datetime.now)

    customer = db.relationship('Customer', backref=db.backref('reservations', lazy=True))

    def to_dict(self):
        return {
            'id': self.id,
            'customer': self.customer.to_dict(),
            'time_slot': self.reservation_time_slot.isoformat(),
            'table_number': self.table_number,
            'guest_count': self.guest_count,
            'checked_in': self.checked_in,
            'status': self.status,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()            
        }
    
    def to_summary_dict(self):
        return {
            'id': self.id,
            'time_slot': self.reservation_time_slot.isoformat(),
            'table_number': self.table_number,
            'guest_count': self.guest_count,
            'checked_in': self.checked_in,
            'status': self.status,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }