'use client'

import { useState, useRef, useEffect } from 'react'
import { Heart, X, MapPin, Briefcase, Trophy, Zap } from 'lucide-react'

interface Candidate {
  id: number
  name: string
  title: string
  location: string
  experience: string
  skills: string[]
  achievements: string[]
  bio: string
  matchScore: number
  company: string
  education: string
  avatar: string
  stage: string
  personalityScore: number | null
  codeBattleScore: number | null
  gameScore: number | null
  interviewBooked: boolean
}

interface AnimatedSwipeProps {
  candidate: Candidate
  onLike: () => void
  onReject: () => void
  currentIndex: number
  totalCount: number
}

export default function AnimatedSwipe({ 
  candidate, 
  onLike, 
  onReject, 
  currentIndex, 
  totalCount 
}: AnimatedSwipeProps) {
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null)
  const [isSwiping, setIsSwiping] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  const handleLike = () => {
    setSwipeDirection('right')
    setIsSwiping(true)
    setTimeout(() => {
      onLike()
      setSwipeDirection(null)
      setIsSwiping(false)
    }, 300)
  }

  const handleReject = () => {
    setSwipeDirection('left')
    setIsSwiping(true)
    setTimeout(() => {
      onReject()
      setSwipeDirection(null)
      setIsSwiping(false)
    }, 300)
  }

  return (
    <div className="max-w-md mx-auto">
      {/* Candidate Card */}
      <div 
        ref={cardRef}
        className={`relative bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden transform transition-all duration-300 ${
          isSwiping && swipeDirection === 'right' 
            ? 'rotate-12 translate-x-32 translate-y-8 scale-95 opacity-0' 
            : isSwiping && swipeDirection === 'left'
            ? '-rotate-12 -translate-x-32 translate-y-8 scale-95 opacity-0'
            : 'rotate-0 translate-x-0 translate-y-0 scale-100 opacity-100'
        }`}
      >
        {/* Avatar */}
        <div className="w-full h-80 bg-gradient-to-br from-violet-100 via-purple-100 to-indigo-100 flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-500/20 to-purple-500/20"></div>
          <div className="w-32 h-32 bg-gradient-to-br from-violet-600 to-purple-600 rounded-full flex items-center justify-center text-white text-4xl font-black relative z-10 shadow-2xl">
            {candidate.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-3 py-1 rounded-full font-bold text-sm">
            {candidate.matchScore}% Match
          </div>
        </div>

        {/* Info */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-2xl font-black text-gray-900">{candidate.name}</h3>
              <p className="text-lg text-violet-600 font-bold">{candidate.title}</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-black text-violet-600">{candidate.matchScore}%</div>
              <div className="text-sm text-gray-500 font-medium">Match</div>
            </div>
          </div>

          <div className="flex items-center gap-4 text-gray-600 mb-4">
            <span className="flex items-center font-medium">
              <MapPin className="w-4 h-4 mr-2 text-violet-500" />
              {candidate.location}
            </span>
            <span className="flex items-center font-medium">
              <Briefcase className="w-4 h-4 mr-2 text-violet-500" />
              {candidate.experience}
            </span>
          </div>

          <p className="text-gray-700 mb-4 font-medium">{candidate.bio}</p>

          {/* Skills */}
          <div className="mb-4">
            <h4 className="font-bold text-gray-900 mb-2">Key Skills</h4>
            <div className="flex flex-wrap gap-2">
              {candidate.skills.slice(0, 4).map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1 bg-gradient-to-r from-violet-100 to-purple-100 text-violet-800 rounded-full text-sm font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Achievements */}
          <div className="mb-4">
            <h4 className="font-bold text-gray-900 mb-2">Achievements</h4>
            <div className="space-y-1">
              {candidate.achievements.map((achievement) => (
                <div key={achievement} className="flex items-center gap-2 text-sm text-gray-600">
                  <Trophy className="w-4 h-4 text-yellow-500" />
                  {achievement}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Swipe Buttons */}
      <div className="flex justify-center gap-6 mt-8">
        <button
          onClick={handleReject}
          className="w-20 h-20 bg-white border-4 border-red-500 rounded-full flex items-center justify-center hover:bg-red-50 transition-all duration-300 transform hover:scale-110 shadow-lg hover:shadow-red-500/25"
        >
          <X className="w-10 h-10 text-red-500" />
        </button>
        
        <button
          onClick={handleLike}
          className="w-20 h-20 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center hover:from-red-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-110 shadow-2xl hover:shadow-pink-500/25"
        >
          <Heart className="w-10 h-10 text-white" />
        </button>
      </div>

      <div className="text-center mt-6 text-sm text-gray-500 font-medium">
        {currentIndex + 1} of {totalCount} candidates
      </div>
    </div>
  )
}



