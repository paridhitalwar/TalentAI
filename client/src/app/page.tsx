'use client'

import { useState, useEffect } from 'react'
import { 
  Brain, 
  Zap, 
  Users, 
  Target, 
  TrendingUp, 
  Award,
  ArrowRight,
  Play,
  CheckCircle,
  Sparkles,
  Rocket
} from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import FeatureCard from '@/components/FeatureCard'
import CTAButton from '@/components/CTAButton'

export default function HomePage() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Matching',
      description: 'Advanced algorithms match candidates with opportunities using ML, NLP, and skill analysis.',
      color: 'from-primary-500 to-primary-600'
    },
    {
      icon: Zap,
      title: 'Smart Resume Parsing',
      description: 'Intelligent extraction of skills, experience, and qualifications with confidence scoring.',
      color: 'from-secondary-500 to-secondary-600'
    },
    {
      icon: Target,
      title: 'Skill Evaluation',
      description: 'Comprehensive assessment through coding challenges, puzzles, and communication tests.',
      color: 'from-accent-500 to-accent-600'
    },
    {
      icon: Users,
      title: 'Interactive Games',
      description: 'Engaging puzzle games and challenges to assess problem-solving and creativity.',
      color: 'from-success-500 to-success-600'
    },
    {
      icon: TrendingUp,
      title: 'Real-time Analytics',
      description: 'Live insights into candidate performance, matching success, and platform metrics.',
      color: 'from-warning-500 to-warning-600'
    },
    {
      icon: Award,
      title: 'Quality Assurance',
      description: 'Rigorous vetting process ensuring only top-tier talent reaches your organization.',
      color: 'from-error-500 to-error-600'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-blue-50 to-purple-50">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-primary-200/30 to-secondary-200/30 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-accent-200/30 to-primary-200/30 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-purple-200/20 to-pink-200/20 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-primary-200 text-primary-700 text-sm font-medium mb-8 shadow-lg">
              <Sparkles className="w-4 h-4 mr-2 text-primary-500" />
              AI-Powered Talent Marketplace
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-7xl font-bold text-neutral-900 mb-6 leading-tight">
              Discover{' '}
              <span className="gradient-text">Top AI Talent</span>
              <br />
              <span className="text-4xl md:text-6xl text-neutral-700">Through Intelligence</span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-neutral-600 max-w-3xl mx-auto mb-10 leading-relaxed">
              Connect with exceptional AI professionals through our advanced matching algorithms, 
              skill evaluation systems, and engaging candidate experiences.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <CTAButton 
                href="/jobs" 
                variant="primary"
                className="group"
              >
                Find Your Next Role
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </CTAButton>
              
              <CTAButton 
                href="/candidates" 
                variant="outline"
                className="group"
              >
                <Play className="w-5 h-5 mr-2" />
                Watch Demo
              </CTAButton>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center items-center gap-8 text-neutral-500">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-success-500" />
                <span className="text-sm font-medium">100+ AI Experts</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-success-500" />
                <span className="text-sm font-medium">95% Match Rate</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-success-500" />
                <span className="text-sm font-medium">24/7 AI Support</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-6">
              Why Choose{' '}
              <span className="gradient-text">TalentAI</span>?
            </h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
              Our platform combines cutting-edge AI technology with human expertise to deliver 
              the most accurate talent matching and evaluation in the industry.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={feature.title}>
                <FeatureCard {...feature} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-secondary-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Transform{' '}
            <span className="text-yellow-300">Your Hiring</span>?
          </h2>
          <p className="text-xl text-primary-100 mb-10 max-w-2xl mx-auto">
            Join thousands of companies and candidates who trust TalentAI for their AI talent needs.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <CTAButton 
              href="/register" 
              variant="secondary"
              size="lg"
              className="bg-white text-primary-600 hover:bg-gray-100"
            >
              <Rocket className="w-5 h-5 mr-2" />
              Get Started Today
            </CTAButton>
            
            <CTAButton 
              href="/demo" 
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-white hover:text-primary-600"
            >
              <Play className="w-5 h-5 mr-2" />
              Schedule Demo
            </CTAButton>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
