from flask import Blueprint, jsonify, request
from src.models.booking import Booking, db
from src.models.court import Court
from datetime import datetime

bookings_bp = Blueprint('bookings', __name__)

@bookings_bp.route('/bookings', methods=['GET'])
def get_bookings():
    """Retorna todos os agendamentos"""
    try:
        bookings = Booking.query.all()
        return jsonify([booking.to_dict() for booking in bookings]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@bookings_bp.route('/bookings', methods=['POST'])
def create_booking():
    """Cria um novo agendamento ou adiciona adversário a um existente"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'Dados não fornecidos'}), 400
            
        court_id = data.get('court_id')
        time = data.get('time')
        player_name = data.get('player_name')
        date = data.get('date', datetime.now().strftime('%d/%m/%Y'))
        
        if not all([court_id, time, player_name]):
            return jsonify({'error': 'Campos obrigatórios: court_id, time, player_name'}), 400
            
        # Verificar se a quadra existe
        court = Court.query.get(court_id)
        if not court:
            return jsonify({'error': 'Quadra não encontrada'}), 404
            
        # Verificar se já existe um agendamento para este horário
        existing_booking = Booking.query.filter_by(
            court_id=court_id, 
            time=time, 
            date=date
        ).first()
        
        if existing_booking:
            # Se já existe um agendamento, adicionar como segundo jogador
            if existing_booking.player2:
                return jsonify({'error': 'Este horário já está completamente ocupado'}), 400
                
            existing_booking.player2 = player_name
            db.session.commit()
            
            return jsonify({
                'message': f'Agendamento confirmado! Você será o adversário de {existing_booking.player1}.',
                'booking': existing_booking.to_dict()
            }), 200
        else:
            # Criar novo agendamento
            new_booking = Booking(
                court_id=court_id,
                time=time,
                date=date,
                player1=player_name
            )
            
            db.session.add(new_booking)
            db.session.commit()
            
            return jsonify({
                'message': 'Agendamento realizado com sucesso!',
                'booking': new_booking.to_dict()
            }), 201
            
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@bookings_bp.route('/bookings/availability/<int:court_id>', methods=['GET'])
def check_availability(court_id):
    """Verifica a disponibilidade de horários para uma quadra específica"""
    try:
        date = request.args.get('date', datetime.now().strftime('%d/%m/%Y'))
        
        # Buscar todos os agendamentos para esta quadra na data especificada
        bookings = Booking.query.filter_by(court_id=court_id, date=date).all()
        
        # Criar um dicionário com a disponibilidade de cada horário
        availability = {}
        for booking in bookings:
            availability[booking.time] = {
                'available': booking.player2 is None,
                'players_count': 2 if booking.player2 else 1,
                'players': [booking.player1] + ([booking.player2] if booking.player2 else [])
            }
            
        return jsonify(availability), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

