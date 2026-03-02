import logging
from flask import Blueprint, jsonify
from extensions import db

logger = logging.getLogger(__name__)

health_bp = Blueprint('health_bp', __name__)

@health_bp.route('/health', methods=['GET'])
def health_check():
    """Lightweight endpoint to confirm the server and database are reachable."""
    try:
        db.session.execute(db.text('SELECT 1'))
        logger.info('Health check passed')
        return jsonify({'status': 'ok', 'database': 'connected'}), 200
    except Exception as e:
        logger.error(f'Health check failed: {e}')
        return jsonify({'status': 'error', 'database': 'unreachable'}), 500