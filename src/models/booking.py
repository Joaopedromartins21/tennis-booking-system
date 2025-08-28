from src.models.user import db
from datetime import datetime

class Booking(db.Model):
    __tablename__ = 'bookings'
    
    id = db.Column(db.Integer, primary_key=True)
    court_id = db.Column(db.Integer, db.ForeignKey('courts.id'), nullable=False)
    time = db.Column(db.String(10), nullable=False)  # Formato HH:MM
    date = db.Column(db.String(20), nullable=False)  # Formato DD/MM/YYYY
    player1 = db.Column(db.String(100), nullable=False)
    player2 = db.Column(db.String(100), nullable=True)  # Adversário opcional
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        players = [self.player1]
        if self.player2:
            players.append(self.player2)
            
        return {
            'id': self.id,
            'court_id': self.court_id,
            'court_name': self.court.name if self.court else None,
            'time': self.time,
            'date': self.date,
            'players': players,
            'is_complete': len(players) == 2,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

