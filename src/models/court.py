from src.models.user import db

class Court(db.Model):
    __tablename__ = 'courts'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    type = db.Column(db.String(50), nullable=False)  # Saibro, Sintética, Grama
    location = db.Column(db.String(100), nullable=False)  # Setor A, B, C
    
    # Relacionamento com agendamentos (usando string para evitar problemas de importação circular)
    bookings = db.relationship('Booking', backref='court', lazy=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'type': self.type,
            'location': self.location
        }

