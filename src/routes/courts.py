from flask import Blueprint, jsonify
from src.models.court import Court, db

courts_bp = Blueprint('courts', __name__)

@courts_bp.route('/courts', methods=['GET'])
def get_courts():
    """Retorna todas as quadras disponíveis"""
    try:
        courts = Court.query.all()
        return jsonify([court.to_dict() for court in courts]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@courts_bp.route('/courts/<int:court_id>', methods=['GET'])
def get_court(court_id):
    """Retorna uma quadra específica"""
    try:
        court = Court.query.get_or_404(court_id)
        return jsonify(court.to_dict()), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

