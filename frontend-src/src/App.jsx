import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Calendar, Clock, MapPin, Users } from 'lucide-react'
import './App.css'

function App() {
  // Estado para armazenar os agendamentos e quadras
  const [bookings, setBookings] = useState([])
  const [courts, setCourts] = useState([])
  const [loading, setLoading] = useState(true)
  
  // Horários disponíveis
  const timeSlots = [
    '08:00', '09:00', '10:00', '11:00', '12:00', 
    '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'
  ]
  
  // Estado para o agendamento atual
  const [selectedCourt, setSelectedCourt] = useState(null)
  const [selectedTime, setSelectedTime] = useState(null)
  const [playerName, setPlayerName] = useState('')
  const [showBookingForm, setShowBookingForm] = useState(false)
  
  // Carregar dados do backend
  useEffect(() => {
    loadData()
  }, [])
  
  const loadData = async () => {
    try {
      setLoading(true)
      
      // Carregar quadras
      const courtsResponse = await fetch('/api/courts')
      const courtsData = await courtsResponse.json()
      setCourts(courtsData)
      
      // Carregar agendamentos
      const bookingsResponse = await fetch('/api/bookings')
      const bookingsData = await bookingsResponse.json()
      setBookings(bookingsData)
      
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
      alert('Erro ao carregar dados do servidor')
    } finally {
      setLoading(false)
    }
  }
  
  // Função para verificar se um horário está disponível
  const isTimeSlotAvailable = (courtId, time) => {
    const booking = bookings.find(b => b.court_id === courtId && b.time === time)
    return !booking || booking.players.length < 2
  }
  
  // Função para obter informações de um agendamento
  const getBookingInfo = (courtId, time) => {
    return bookings.find(b => b.court_id === courtId && b.time === time)
  }
  
  // Função para fazer um agendamento
  const makeBooking = async () => {
    if (!selectedCourt || !selectedTime || !playerName.trim()) {
      alert('Por favor, preencha todos os campos!')
      return
    }
    
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          court_id: selectedCourt.id,
          time: selectedTime,
          player_name: playerName.trim(),
          date: new Date().toLocaleDateString('pt-BR')
        })
      })
      
      const data = await response.json()
      
      if (response.ok) {
        alert(data.message)
        // Recarregar dados
        await loadData()
        
        // Limpar formulário
        setPlayerName('')
        setSelectedCourt(null)
        setSelectedTime(null)
        setShowBookingForm(false)
      } else {
        alert(data.error || 'Erro ao fazer agendamento')
      }
    } catch (error) {
      console.error('Erro ao fazer agendamento:', error)
      alert('Erro ao conectar com o servidor')
    }
  }
  
  // Função para iniciar um agendamento
  const startBooking = (court, time) => {
    setSelectedCourt(court)
    setSelectedTime(time)
    setShowBookingForm(true)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-2">
            <Calendar className="text-green-600" />
            Agendamento de Quadra de Tênis
          </h1>
          <p className="text-gray-600">Reserve sua quadra e encontre adversários para jogar</p>
        </div>

        {/* Formulário de Agendamento */}
        {showBookingForm && (
          <Card className="mb-8 border-2 border-green-200 shadow-lg">
            <CardHeader className="bg-green-50">
              <CardTitle className="text-green-800">Fazer Agendamento</CardTitle>
              <CardDescription>
                {selectedCourt?.name} - {selectedTime}
                {getBookingInfo(selectedCourt?.id, selectedTime) && 
                  ` (Adversário: ${getBookingInfo(selectedCourt?.id, selectedTime).players[0]})`
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Seu Nome
                  </label>
                  <input
                    type="text"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Digite seu nome"
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={makeBooking} className="bg-green-600 hover:bg-green-700">
                    Confirmar Agendamento
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowBookingForm(false)}
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Grid de Quadras */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {courts.map(court => (
            <Card key={court.id} className="shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="bg-gradient-to-r from-green-100 to-blue-100">
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="text-green-600" />
                  {court.name}
                </CardTitle>
                <CardDescription className="flex items-center gap-4">
                  <Badge variant="secondary">{court.type}</Badge>
                  <span className="text-sm text-gray-600">{court.location}</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Clock className="text-blue-600" />
                  Horários Disponíveis
                </h4>
                <div className="grid grid-cols-3 gap-2">
                  {timeSlots.map(time => {
                    const isAvailable = isTimeSlotAvailable(court.id, time)
                    const bookingInfo = getBookingInfo(court.id, time)
                    
                    return (
                      <Button
                        key={time}
                        variant={isAvailable ? "outline" : "secondary"}
                        size="sm"
                        className={`relative ${
                          isAvailable 
                            ? 'hover:bg-green-50 border-green-200' 
                            : bookingInfo?.players.length === 1
                            ? 'bg-yellow-100 border-yellow-300 hover:bg-yellow-200'
                            : 'bg-red-100 border-red-300 cursor-not-allowed'
                        }`}
                        onClick={() => isAvailable && startBooking(court, time)}
                        disabled={!isAvailable && bookingInfo?.players.length >= 2}
                      >
                        <div className="text-center">
                          <div className="font-medium">{time}</div>
                          {bookingInfo && (
                            <div className="text-xs flex items-center justify-center gap-1">
                              <Users size={10} />
                              {bookingInfo.players.length}/2
                            </div>
                          )}
                        </div>
                      </Button>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Lista de Agendamentos */}
        {bookings.length > 0 && (
          <Card className="shadow-lg">
            <CardHeader className="bg-blue-50">
              <CardTitle className="text-blue-800">Agendamentos Realizados</CardTitle>
              <CardDescription>Lista de todos os agendamentos ativos</CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-3">
                {bookings.map(booking => (
                  <div key={booking.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <MapPin size={16} className="text-green-600" />
                        <span className="font-medium">{booking.court_name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock size={16} className="text-blue-600" />
                        <span>{booking.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-purple-600" />
                        <span>{booking.date}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users size={16} className="text-orange-600" />
                      <div className="text-sm">
                        <div className="font-medium">{booking.players.join(' vs ')}</div>
                        <div className="text-gray-500">
                          {booking.players.length === 1 ? 'Aguardando adversário' : 'Partida completa'}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Legenda */}
        <div className="mt-8 p-4 bg-white rounded-lg shadow">
          <h3 className="font-semibold mb-3">Legenda:</h3>
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border border-green-200 rounded"></div>
              <span>Disponível</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-100 border border-yellow-300 rounded"></div>
              <span>1 jogador (pode ser adversário)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-100 border border-red-300 rounded"></div>
              <span>Ocupado (2 jogadores)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App

