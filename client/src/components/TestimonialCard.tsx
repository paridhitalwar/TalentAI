'use client'

import { Star } from 'lucide-react'
import Image from 'next/image'

interface TestimonialCardProps {
  name: string
  role: string
  company: string
  content: string
  avatar: string
  rating: number
}

export default function TestimonialCard({
  name,
  role,
  company,
  content,
  avatar,
  rating
}: TestimonialCardProps) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
      <div className="flex items-center mb-4">
        <div className="relative w-12 h-12 mr-4">
          <Image
            src={avatar}
            alt={name}
            fill
            className="rounded-full object-cover"
          />
        </div>
        <div>
          <h4 className="font-semibold text-gray-900">{name}</h4>
          <p className="text-sm text-gray-600">{role}</p>
          <p className="text-sm text-primary-600 font-medium">{company}</p>
        </div>
      </div>
      
      <div className="flex items-center mb-3">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < rating 
                ? 'text-yellow-400 fill-current' 
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
      
      <blockquote className="text-gray-700 leading-relaxed">
        "{content}"
      </blockquote>
    </div>
  )
}
