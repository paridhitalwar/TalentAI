'use client'

import { LucideIcon } from 'lucide-react'

interface FeatureCardProps {
  icon: LucideIcon
  title: string
  description: string
  color: string
}

const FeatureCard = ({ icon: Icon, title, description, color }: FeatureCardProps) => {
  return (
    <div className="group relative hover:-translate-y-2 transition-transform duration-300">
      <div className="card-hover p-8 h-full relative overflow-hidden">
        {/* Background Gradient */}
        <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
        
        {/* Icon */}
        <div className={`w-16 h-16 bg-gradient-to-br ${color} rounded-2xl flex items-center justify-center mb-6 group-hover:shadow-glow transition-all duration-300 group-hover:scale-110 group-hover:rotate-1`}>
          <Icon className="w-8 h-8 text-white" />
        </div>

        {/* Content */}
        <div className="relative z-10">
          <h3 className="text-xl font-bold text-neutral-900 mb-4 group-hover:text-primary-600 transition-colors duration-300">
            {title}
          </h3>
          <p className="text-neutral-600 leading-relaxed group-hover:text-neutral-700 transition-colors duration-300">
            {description}
          </p>
        </div>

        {/* Hover Effect Border */}
        <div className={`absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-gradient-to-r ${color} opacity-0 group-hover:opacity-30 transition-all duration-500`}></div>
        
        {/* Floating Elements */}
        <div className="absolute top-4 right-4 w-2 h-2 bg-primary-400 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100"></div>
        <div className="absolute bottom-4 left-4 w-1 h-1 bg-secondary-400 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 delay-200"></div>
      </div>
    </div>
  )
}

export default FeatureCard
