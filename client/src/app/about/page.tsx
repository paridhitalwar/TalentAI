'use client'

import { 
  Brain, 
  Users, 
  Target, 
  Award, 
  Globe, 
  Heart,
  Zap,
  Shield,
  TrendingUp,
  Star
} from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function AboutPage() {
  const values = [
    {
      icon: Brain,
      title: 'Innovation First',
      description: 'We believe in pushing the boundaries of what\'s possible with AI and technology.'
    },
    {
      icon: Users,
      title: 'Human-Centric',
      description: 'Technology serves people. We build solutions that enhance human potential and connection.'
    },
    {
      icon: Target,
      title: 'Excellence',
      description: 'We strive for excellence in everything we do, from code quality to user experience.'
    },
    {
      icon: Heart,
      title: 'Integrity',
      description: 'Honest, transparent, and ethical in all our business practices and relationships.'
    }
  ]

  const team = [
    {
      name: 'Dr. Sarah Chen',
      role: 'CEO & Co-Founder',
      bio: 'Former AI Research Lead at Google, PhD in Machine Learning from Stanford. Passionate about democratizing AI talent access.',
      avatar: '/api/placeholder/150/150'
    },
    {
      name: 'Marcus Rodriguez',
      role: 'CTO & Co-Founder',
      bio: 'Ex-Engineering Manager at OpenAI, expert in large language models and scalable AI systems.',
      avatar: '/api/placeholder/150/150'
    },
    {
      name: 'Priya Patel',
      role: 'Head of Product',
      bio: 'Product leader with 10+ years experience in HR tech and AI-powered platforms.',
      avatar: '/api/placeholder/150/150'
    }
  ]

  const milestones = [
    {
      year: '2023',
      title: 'Platform Launch',
      description: 'TalentAI officially launched with AI-powered matching and evaluation systems.'
    },
    {
      year: '2024',
      title: '100+ AI Experts',
      description: 'Reached our first milestone of connecting 100+ top AI professionals with opportunities.'
    },
    {
      year: '2024',
      title: '95% Match Rate',
      description: 'Achieved industry-leading 95% successful placement rate through our algorithms.'
    },
    {
      year: '2025',
      title: 'Global Expansion',
      description: 'Expanding to serve AI talent markets across Europe, Asia, and beyond.'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-primary-500 to-secondary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            About TalentAI
          </h1>
          <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
            We're revolutionizing how AI talent connects with opportunities through intelligent matching, 
            comprehensive evaluation, and engaging experiences.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                To democratize access to top AI talent by building the most intelligent, 
                efficient, and engaging platform for talent discovery and evaluation.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                We believe that the future of work is AI-powered, and we're committed to 
                ensuring that exceptional AI professionals can find their perfect opportunities 
                while companies can discover the talent they need to innovate and grow.
              </p>
              <div className="flex items-center space-x-4">
                <div className="flex items-center text-primary-600">
                  <Star className="w-5 h-5 mr-2" />
                  <span className="font-semibold">Innovation</span>
                </div>
                <div className="flex items-center text-secondary-600">
                  <Target className="w-5 h-5 mr-2" />
                  <span className="font-semibold">Excellence</span>
                </div>
                <div className="flex items-center text-accent-600">
                  <Users className="w-5 h-5 mr-2" />
                  <span className="font-semibold">Community</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-primary-100 to-secondary-100 rounded-2xl p-8">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <Brain className="w-8 h-8 text-primary-600 mb-2" />
                    <h3 className="font-semibold text-gray-900">AI-Powered</h3>
                    <p className="text-sm text-gray-600">Advanced algorithms</p>
                  </div>
                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <Zap className="w-8 h-8 text-secondary-600 mb-2" />
                    <h3 className="font-semibold text-gray-900">Fast & Efficient</h3>
                    <p className="text-sm text-gray-600">Quick matching</p>
                  </div>
                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <Shield className="w-8 h-8 text-accent-600 mb-2" />
                    <h3 className="font-semibold text-gray-900">Secure</h3>
                    <p className="text-sm text-gray-600">Data protection</p>
                  </div>
                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <TrendingUp className="w-8 h-8 text-success-600 mb-2" />
                    <h3 className="font-semibold text-gray-900">Scalable</h3>
                    <p className="text-sm text-gray-600">Global reach</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Our Values
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The principles that guide everything we do at TalentAI
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={value.title} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-600 rounded-xl flex items-center justify-center mb-4">
                  <value.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {value.title}
                </h3>
                <p className="text-gray-600">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Meet Our Team
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The passionate individuals behind TalentAI's mission to transform talent discovery
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div key={member.name} className="bg-gray-50 rounded-2xl p-6 text-center hover:shadow-md transition-shadow">
                <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-secondary-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
                  {member.name.split(' ').map(n => n[0]).join('')}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {member.name}
                </h3>
                <p className="text-primary-600 font-medium mb-3">
                  {member.role}
                </p>
                <p className="text-gray-600 text-sm">
                  {member.bio}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Milestones Section */}
      <section className="py-20 bg-gradient-to-r from-primary-50 to-secondary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Our Journey
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Key milestones in TalentAI's growth and development
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {milestones.map((milestone, index) => (
              <div key={milestone.year} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-lg">{milestone.year}</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {milestone.title}
                </h3>
                <p className="text-gray-600">
                  {milestone.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-secondary-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Join Us in Shaping the Future
          </h2>
          <p className="text-xl text-primary-100 mb-10 max-w-2xl mx-auto">
            Whether you're an AI professional looking for opportunities or a company seeking top talent, 
            we're here to help you succeed.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/candidates"
              className="inline-flex items-center px-8 py-4 bg-white text-primary-600 font-semibold rounded-xl hover:bg-gray-100 transition-colors"
            >
              <Users className="w-5 h-5 mr-2" />
              Find Talent
            </a>
            
            <a
              href="/jobs"
              className="inline-flex items-center px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-primary-600 transition-colors"
            >
              <Target className="w-5 h-5 mr-2" />
              Find Opportunities
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
