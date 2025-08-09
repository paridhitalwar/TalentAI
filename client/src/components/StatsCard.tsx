'use client'

import { LucideIcon } from 'lucide-react'
import { useInView } from 'react-intersection-observer'
import { useState, useEffect } from 'react'

interface StatsCardProps {
  number: string
  label: string
  icon: LucideIcon
}

const StatsCard = ({ number, label, icon: Icon }: StatsCardProps) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const [count, setCount] = useState(0)
  const [isCounting, setIsCounting] = useState(false)

  useEffect(() => {
    if (inView && !isCounting) {
      setIsCounting(true)
      
      // Extract numeric value from string (e.g., "100+" -> 100)
      const numericValue = parseInt(number.replace(/\D/g, ''))
      
      if (number.includes('+')) {
        // For numbers with plus sign, animate to the number
        const timer = setTimeout(() => {
          setCount(numericValue)
        }, 200)
        return () => clearTimeout(timer)
      } else if (number.includes('%')) {
        // For percentages, animate to the number
        const timer = setTimeout(() => {
          setCount(numericValue)
        }, 200)
        return () => clearTimeout(timer)
      } else if (number.includes('/')) {
        // For time formats like "24/7", just show the number
        setCount(24)
      } else {
        // For regular numbers, animate to the number
        const timer = setTimeout(() => {
          setCount(numericValue)
        }, 200)
        return () => clearTimeout(timer)
      }
    }
  }, [inView, isCounting, number])

  return (
    <div
      ref={ref}
      className="text-center group opacity-100 scale-100"
    >
      <div className="relative">
        {/* Icon Background */}
        <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-secondary-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:shadow-glow transition-all duration-300 group-hover:scale-110 group-hover:rotate-1">
          <Icon className="w-10 h-10 text-white" />
        </div>

        {/* Floating Elements */}
        <div className="absolute -top-2 -right-2 w-3 h-3 bg-accent-400 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100"></div>
        <div className="absolute -bottom-2 -left-2 w-2 h-2 bg-secondary-400 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 delay-200"></div>
      </div>

      {/* Number */}
      <div className="mb-3 opacity-100">
        <span className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
          {number.includes('+') ? `${count}+` : 
           number.includes('%') ? `${count}%` : 
           number.includes('/') ? number : count}
        </span>
      </div>

      {/* Label */}
      <p className="text-lg text-neutral-600 font-medium group-hover:text-neutral-700 transition-colors duration-300 opacity-100">
        {label}
      </p>

      {/* Hover Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-secondary-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
    </div>
  )
}

export default StatsCard
