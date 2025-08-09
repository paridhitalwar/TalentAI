'use client'

import { useState } from 'react'
import { 
  UserPlus, 
  Building, 
  UserCheck, 
  ArrowRight,
  Sparkles,
  CheckCircle
} from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useRouter } from 'next/navigation'

export default function RegisterPage() {
  const [userType, setUserType] = useState<'recruiter' | 'candidate' | null>(null)
  const [step, setStep] = useState(1)
  const router = useRouter()

  const handleUserTypeSelect = (type: 'recruiter' | 'candidate') => {
    setUserType(type)
    setStep(2)
  }

  const handleContinue = () => {
    if (userType === 'recruiter') {
      router.push('/recruiter-dashboard')
    } else if (userType === 'candidate') {
      router.push('/candidate-dashboard')
    }
  }

  const benefits = {
    recruiter: [
      'Access to top AI talent pool',
      'Intelligent candidate matching',
      'Advanced filtering and search',
      'Analytics and insights',
      'Direct messaging system'
    ],
    candidate: [
      'Discover exciting AI opportunities',
      'Showcase your skills',
      'Participate in challenges',
      'Build your professional network',
      'Track your applications'
    ]
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-primary-500 to-secondary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Join TalentAI
          </h1>
          <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
            Choose your path and start your journey with the most intelligent AI talent platform
          </p>
        </div>
      </section>

      {/* Registration Content */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {step === 1 && (
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">
                How will you use TalentAI?
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                {/* Recruiter Option */}
                <div 
                  onClick={() => handleUserTypeSelect('recruiter')}
                  className="group cursor-pointer bg-white rounded-2xl p-8 shadow-sm border-2 border-transparent hover:border-primary-300 hover:shadow-lg transition-all duration-300"
                >
                  <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Building className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    I'm a Recruiter
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Looking for top AI talent to join your team? Find the perfect candidates with our intelligent matching system.
                  </p>
                  <div className="flex items-center justify-center text-primary-600 font-medium group-hover:text-primary-700 transition-colors">
                    <span>Get Started</span>
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

                {/* Candidate Option */}
                <div 
                  onClick={() => handleUserTypeSelect('candidate')}
                  className="group cursor-pointer bg-white rounded-2xl p-8 shadow-sm border-2 border-transparent hover:border-secondary-300 hover:shadow-lg transition-all duration-300"
                >
                  <div className="w-20 h-20 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-2xl flex items-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <UserCheck className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    I'm a Candidate
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Ready to showcase your AI skills? Connect with top companies and opportunities that match your expertise.
                  </p>
                  <div className="flex items-center justify-center text-secondary-600 font-medium group-hover:text-secondary-700 transition-colors">
                    <span>Get Started</span>
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>

              <div className="text-center">
                <p className="text-gray-600 mb-4">Already have an account?</p>
                <button 
                  onClick={() => router.push('/')}
                  className="text-primary-600 hover:text-primary-700 font-medium transition-colors"
                >
                  Sign in instead
                </button>
              </div>
            </div>
          )}

          {step === 2 && userType && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  {userType === 'recruiter' ? (
                    <Building className="w-8 h-8 text-white" />
                  ) : (
                    <UserCheck className="w-8 h-8 text-white" />
                  )}
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Welcome, {userType === 'recruiter' ? 'Recruiter' : 'Candidate'}!
                </h2>
                <p className="text-gray-600">
                  You're just one step away from accessing {userType === 'recruiter' ? 'top AI talent' : 'exciting opportunities'}
                </p>
              </div>

              {/* Benefits */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">
                  What you'll get:
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {benefits[userType].map((benefit, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Start */}
              <div className="text-center">
                <button
                  onClick={handleContinue}
                  className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white px-8 py-4 rounded-xl hover:from-primary-700 hover:to-secondary-700 transition-all duration-300 font-medium text-lg flex items-center mx-auto"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Start Exploring Now
                </button>
                <p className="text-sm text-gray-500 mt-3">
                  No account creation required - start using the platform immediately
                </p>
              </div>

              <div className="text-center mt-6">
                <button 
                  onClick={() => setStep(1)}
                  className="text-gray-500 hover:text-gray-700 font-medium transition-colors"
                >
                  ← Back to selection
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}
