'use client'

import { useState } from 'react'
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Video, 
  Phone, 
  CheckCircle,
  X,
  ChevronLeft,
  User
} from 'lucide-react'

interface Candidate {
  id: number
  name: string
  title: string
  stage: string
  matchScore: number
  personalityScore?: number
  codeBattleScore?: number
  gameScore?: number
}

interface BookingSectionProps {
  onClose: () => void
  candidate?: Candidate
}

interface TimeSlot {
  id: string
  time: string
  available: boolean
  type: 'video' | 'phone' | 'in-person'
}

interface Day {
  date: string
  day: string
  available: boolean
  slots: TimeSlot[]
}

export default function BookingSection({ onClose, candidate }: BookingSectionProps) {
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null)
  const [bookingStep, setBookingStep] = useState<'date' | 'time' | 'confirm' | 'success'>('date')
  const [bookingDetails, setBookingDetails] = useState({
    name: '',
    email: '',
    phone: '',
    notes: ''
  })

  // Generate calendar data for next 2 weeks
  const generateCalendar = (): Day[] => {
    const days: Day[] = []
    const today = new Date()
    
    for (let i = 0; i < 14; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' })
      const dateString = date.toISOString().split('T')[0]
      
      // Generate time slots for each day
      const slots: TimeSlot[] = [
        { id: `${dateString}-09:00`, time: '9:00 AM', available: true, type: 'video' },
        { id: `${dateString}-10:00`, time: '10:00 AM', available: true, type: 'video' },
        { id: `${dateString}-11:00`, time: '11:00 AM', available: true, type: 'phone' },
        { id: `${dateString}-14:00`, time: '2:00 PM', available: true, type: 'video' },
        { id: `${dateString}-15:00`, time: '3:00 PM', available: true, type: 'in-person' },
        { id: `${dateString}-16:00`, time: '4:00 PM', available: true, type: 'video' },
      ]
      
      days.push({
        date: dateString,
        day: dayName,
        available: true,
        slots
      })
    }
    
    return days
  }

  const calendar = generateCalendar()

  const handleDateSelect = (date: string) => {
    setSelectedDate(date)
    setBookingStep('time')
  }

  const handleTimeSelect = (slot: TimeSlot) => {
    setSelectedSlot(slot)
    setBookingStep('confirm')
  }

  const handleConfirmBooking = async () => {
    // Here you would make an API call to book the slot
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      setBookingStep('success')
    } catch (error) {
      console.error('Booking failed:', error)
    }
  }

  const getMeetingTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="w-4 h-4" />
      case 'phone': return <Phone className="w-4 h-4" />
      case 'in-person': return <MapPin className="w-4 h-4" />
      default: return <Video className="w-4 h-4" />
    }
  }

  const getMeetingTypeColor = (type: string) => {
    switch (type) {
      case 'video': return 'text-blue-600 bg-blue-100'
      case 'phone': return 'text-green-600 bg-green-100'
      case 'in-person': return 'text-purple-600 bg-purple-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  if (bookingStep === 'success') {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Booking Confirmed!</h2>
            <p className="text-gray-600 mb-6">
              {candidate 
                ? `Your interview with ${candidate.name} has been scheduled successfully. You'll receive a confirmation email shortly.`
                : 'Your interview has been scheduled successfully. You will receive a confirmation email shortly.'
              }
            </p>
            <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left">
              {candidate && (
                <div className="flex items-center gap-2 mb-3 pb-3 border-b border-gray-200">
                  <User className="w-4 h-4 text-gray-600" />
                  <span className="font-medium">{candidate.name} - {candidate.title}</span>
                </div>
              )}
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-gray-600" />
                <span className="font-medium">{selectedDate}</span>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-gray-600" />
                <span className="font-medium">{selectedSlot?.time}</span>
              </div>
              <div className="flex items-center gap-2">
                {getMeetingTypeIcon(selectedSlot?.type || 'video')}
                <span className="font-medium capitalize">{selectedSlot?.type} Meeting</span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 px-6 rounded-xl font-bold hover:from-green-600 hover:to-emerald-600 transition-all duration-300"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl p-8 max-w-4xl w-full mx-4 shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {candidate ? `Schedule Interview with ${candidate.name}` : 'Schedule Interview'}
              </h2>
              <p className="text-gray-600">
                {candidate ? `${candidate.title} • ${candidate.matchScore}% Match` : 'Choose your preferred date and time'}
              </p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
              bookingStep === 'date' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              1
            </div>
            <div className={`w-16 h-1 mx-2 ${
              bookingStep !== 'date' ? 'bg-blue-500' : 'bg-gray-200'
            }`}></div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
              bookingStep === 'time' ? 'bg-blue-500 text-white' : 
              bookingStep === 'confirm' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              2
            </div>
            <div className={`w-16 h-1 mx-2 ${
              bookingStep === 'confirm' ? 'bg-blue-500' : 'bg-gray-200'
            }`}></div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
              bookingStep === 'confirm' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              3
            </div>
          </div>
        </div>

        {/* Candidate Info Section */}
        {candidate && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 mb-6 border border-blue-200">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                {candidate.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900">{candidate.name}</h3>
                <p className="text-blue-600 font-medium">{candidate.title}</p>
                <div className="flex items-center gap-4 mt-2">
                  <span className="text-sm text-gray-600">Match Score: <span className="font-bold text-blue-600">{candidate.matchScore}%</span></span>
                  {candidate.personalityScore && (
                    <span className="text-sm text-gray-600">Personality: <span className="font-bold text-purple-600">{candidate.personalityScore}%</span></span>
                  )}
                  {candidate.codeBattleScore && (
                    <span className="text-sm text-gray-600">Code Battle: <span className="font-bold text-orange-600">{candidate.codeBattleScore}%</span></span>
                  )}
                  {candidate.gameScore && (
                    <span className="text-sm text-gray-600">Games: <span className="font-bold text-green-600">{candidate.gameScore}%</span></span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 1: Date Selection */}
        {bookingStep === 'date' && (
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-6">Select a Date</h3>
            <div className="grid grid-cols-7 gap-4">
              {calendar.map((day) => (
                <button
                  key={day.date}
                  onClick={() => handleDateSelect(day.date)}
                  className="p-4 text-center rounded-xl border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200"
                >
                  <div className="text-sm font-medium text-gray-600">{day.day}</div>
                  <div className="text-lg font-bold text-gray-900">
                    {new Date(day.date).getDate()}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Time Selection */}
        {bookingStep === 'time' && (
          <div>
            <div className="flex items-center gap-4 mb-6">
              <button
                onClick={() => setBookingStep('date')}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                Back to dates
              </button>
              <h3 className="text-xl font-bold text-gray-900">
                Select Time for {new Date(selectedDate).toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </h3>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {calendar.find(day => day.date === selectedDate)?.slots.map((slot) => (
                <button
                  key={slot.id}
                  onClick={() => handleTimeSelect(slot)}
                  disabled={!slot.available}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                    slot.available
                      ? 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                      : 'border-gray-100 bg-gray-50 cursor-not-allowed'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-lg font-bold text-gray-900">{slot.time}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getMeetingTypeColor(slot.type)}`}>
                      {slot.type}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    {getMeetingTypeIcon(slot.type)}
                    <span className="capitalize">{slot.type} Meeting</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Confirmation */}
        {bookingStep === 'confirm' && (
          <div>
            <div className="flex items-center gap-4 mb-6">
              <button
                onClick={() => setBookingStep('time')}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                Back to times
              </button>
              <h3 className="text-xl font-bold text-gray-900">Confirm Booking</h3>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Booking Summary */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h4 className="text-lg font-bold text-gray-900 mb-4">Booking Summary</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-gray-600" />
                    <span className="font-medium">
                      {new Date(selectedDate).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-gray-600" />
                    <span className="font-medium">{selectedSlot?.time}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    {getMeetingTypeIcon(selectedSlot?.type || 'video')}
                    <span className="font-medium capitalize">{selectedSlot?.type} Meeting</span>
                  </div>
                </div>
              </div>

              {/* Contact Details */}
              <div>
                <h4 className="text-lg font-bold text-gray-900 mb-4">Contact Details</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <input
                      type="text"
                      value={bookingDetails.name}
                      onChange={(e) => setBookingDetails(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={bookingDetails.email}
                      onChange={(e) => setBookingDetails(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your email"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone (Optional)</label>
                    <input
                      type="tel"
                      value={bookingDetails.phone}
                      onChange={(e) => setBookingDetails(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your phone number"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Additional Notes (Optional)</label>
                    <textarea
                      value={bookingDetails.notes}
                      onChange={(e) => setBookingDetails(prev => ({ ...prev, notes: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={3}
                      placeholder="Any special requirements or notes..."
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <button
                onClick={handleConfirmBooking}
                disabled={!bookingDetails.name || !bookingDetails.email}
                className="px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl font-bold hover:from-blue-600 hover:to-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              >
                Confirm Booking
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
