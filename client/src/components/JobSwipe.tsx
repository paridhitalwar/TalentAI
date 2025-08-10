'use client'

import { useState, useRef } from 'react'
import { Heart, X, MapPin, Briefcase, DollarSign, Clock, Building, Users } from 'lucide-react'

interface Job {
  id: number
  title: string
  company: string
  location: string
  type: string
  salary: string
  description: string
  requirements: string[]
  responsibilities: string[]
  matchScore: number
  posted: string
  applicants: number
  status: string
}

interface JobSwipeProps {
  job: Job
  onLike: () => void
  onReject: () => void
  currentIndex: number
  totalCount: number
}

export default function JobSwipe({ 
  job, 
  onLike, 
  onReject, 
  currentIndex, 
  totalCount 
}: JobSwipeProps) {
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
      {/* Job Card */}
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
        {/* Header */}
        <div className="w-full h-48 bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-indigo-500/20"></div>
          <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white text-2xl font-black relative z-10 shadow-2xl">
            {job.company.split(' ').map(n => n[0]).join('')}
          </div>
          <div className="absolute top-4 right-4 bg-gradient-to-r from-green-400 to-blue-500 text-white px-3 py-1 rounded-full font-bold text-sm">
            {job.matchScore}% Match
          </div>
        </div>

        {/* Info */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-2xl font-black text-gray-900">{job.title}</h3>
              <p className="text-lg text-blue-600 font-bold">{job.company}</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-black text-blue-600">{job.matchScore}%</div>
              <div className="text-sm text-gray-500 font-medium">Match</div>
            </div>
          </div>

          <div className="flex items-center gap-4 text-gray-600 mb-4">
            <span className="flex items-center font-medium">
              <MapPin className="w-4 h-4 mr-2 text-blue-500" />
              {job.location}
            </span>
            <span className="flex items-center font-medium">
              <Clock className="w-4 h-4 mr-2 text-blue-500" />
              {job.type}
            </span>
          </div>

          <div className="flex items-center gap-4 text-gray-600 mb-4">
            <span className="flex items-center font-medium">
              <DollarSign className="w-4 h-4 mr-2 text-green-500" />
              {job.salary}
            </span>
            <span className="flex items-center font-medium">
              <Users className="w-4 h-4 mr-2 text-gray-500" />
              {job.applicants} applicants
            </span>
          </div>

          <p className="text-gray-700 mb-4 font-medium line-clamp-3">{job.description}</p>

          {/* Requirements */}
          <div className="mb-4">
            <h4 className="font-bold text-gray-900 mb-2">Key Requirements</h4>
            <div className="flex flex-wrap gap-2">
              {job.requirements.slice(0, 4).map((req) => (
                <span
                  key={req}
                  className="px-3 py-1 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 rounded-full text-sm font-medium"
                >
                  {req}
                </span>
              ))}
            </div>
          </div>

          {/* Responsibilities */}
          <div className="mb-4">
            <h4 className="font-bold text-gray-900 mb-2">Responsibilities</h4>
            <div className="space-y-1">
              {job.responsibilities.slice(0, 3).map((resp) => (
                <div key={resp} className="flex items-center gap-2 text-sm text-gray-600">
                  <Briefcase className="w-4 h-4 text-blue-500" />
                  {resp}
                </div>
              ))}
            </div>
          </div>

          <div className="text-sm text-gray-500 font-medium">
            Posted {job.posted}
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
          className="w-20 h-20 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center hover:from-green-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-110 shadow-2xl hover:shadow-blue-500/25"
        >
          <Heart className="w-10 h-10 text-white" />
        </button>
      </div>

      <div className="text-center mt-6 text-sm text-gray-500 font-medium">
        {currentIndex + 1} of {totalCount} jobs
      </div>
    </div>
  )
}
