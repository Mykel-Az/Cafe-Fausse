import os, atexit
from flask import Flask, jsonify, request
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from dotenv import load_dotenv
from apscheduler.schedulers.background import BackgroundScheduler
from services.reservation_services import old_reservations
from extensions import db
from routes.reservation_routes import reservation_bp
from routes.customer_routes import customer_bp
from routes.admin_routes import staff_bp
from routes.newsletter_routes import newsletter_bp

load_dotenv()

def create_app():
    app = Flask(__name__)
    CORS(app)

    app.config['JWT_SECRET_KEY'] = os.getenv('SECRET_KEY')
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    jwt = JWTManager(app)

    db.init_app(app)

    app.register_blueprint(reservation_bp)
    app.register_blueprint(customer_bp)
    app.register_blueprint(staff_bp)
    app.register_blueprint(newsletter_bp)

    with app.app_context():
        db.create_all()

    return app

app = create_app()

def run_old_reservations_job():
    with app.app_context():
        old_reservations()

scheduler = BackgroundScheduler()
scheduler.add_job(func=run_old_reservations_job, trigger="interval", minutes=30)
if not app.debug or os.getenv('WERKZEUG_RUN_MAIN') == 'true':
    scheduler.start()
    atexit.register(lambda: scheduler.shutdown(wait=False))

if __name__ == '__main__':
    app.run(debug=os.getenv('FLASK_DEBUG', 'False') == 'True')






