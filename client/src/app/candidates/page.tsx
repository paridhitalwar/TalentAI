'use client'

import { useState } from 'react'
import { Search, Filter, MapPin, Briefcase, Star, Award, Sparkles, Eye } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const mockCandidates = [
  {
    id: 1,
    name: 'Dr. Sarah Chen',
    title: 'Senior ML Engineer',
    location: 'San Francisco, CA',
    experience: '7+ years',
    skills: ['Python', 'TensorFlow', 'PyTorch', 'MLOps', 'AWS', 'Kubernetes'],
    education: 'PhD Computer Science, Stanford',
    companies: ['Google', 'OpenAI', 'Meta'],
    publications: 15,
    matchScore: 98,
    avatar: '/api/placeholder/100/100',
    bio: 'Experienced ML engineer with expertise in large language models and production deployment.'
  },
  {
    id: 2,
    name: 'Alex Rodriguez',
    title: 'AI Research Scientist',
    location: 'New York, NY',
    experience: '5+ years',
    skills: ['NLP', 'Computer Vision', 'PyTorch', 'Research', 'Publications'],
    education: 'MS Computer Science, MIT',
    companies: ['Microsoft Research', 'IBM'],
    publications: 12,
    matchScore: 92,
    avatar: '/api/placeholder/100/100',
    bio: 'Research-focused AI scientist specializing in natural language processing and multimodal learning.'
  },
  {
    id: 3,
    name: 'Priya Patel',
    title: 'MLOps Engineer',
    location: 'Remote',
    experience: '4+ years',
    skills: ['Docker', 'Kubernetes', 'MLOps', 'Python', 'CI/CD', 'AWS'],
    education: 'BS Computer Science, UC Berkeley',
    companies: ['Netflix', 'Uber'],
    publications: 3,
    matchScore: 87,
    avatar: '/api/placeholder/100/100',
    bio: 'Infrastructure expert focused on scaling ML systems and building robust deployment pipelines.'
  },
  {
    id: 4,
    name: 'Marcus Johnson',
    title: 'Data Scientist',
    location: 'Austin, TX',
    experience: '3+ years',
    skills: ['Python', 'SQL', 'Statistics', 'Machine Learning', 'Tableau'],
    education: 'MS Data Science, UT Austin',
    companies: ['Dell', 'Oracle'],
    publications: 2,
    matchScore: 83,
    avatar: '/api/placeholder/100/100',
    bio: 'Data-driven scientist with strong analytical skills and business acumen.'
  }
]

export default function CandidatesPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedLocation, setSelectedLocation] = useState('')
  const [selectedExperience, setSelectedExperience] = useState('')
  const [selectedSkills, setSelectedSkills] = useState('')

  const filteredCandidates = mockCandidates.filter(candidate => {
    const matchesSearch = candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         candidate.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         candidate.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesLocation = !selectedLocation || candidate.location.includes(selectedLocation)
    const matchesExperience = !selectedExperience || candidate.experience === selectedExperience
    const matchesSkills = !selectedSkills || candidate.skills.includes(selectedSkills)
    
    return matchesSearch && matchesLocation && matchesExperience && matchesSkills
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-primary-500 to-secondary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Discover Top AI Talent
          </h1>
          <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
            Connect with exceptional AI professionals, researchers, and engineers from around the world
          </p>
          
          {/* Search Bar */}
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" />
              <input
                type="text"
                placeholder="Search for candidates, skills, or expertise..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 text-lg bg-white rounded-2xl shadow-lg focus:ring-4 focus:ring-white/20 focus:outline-none"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Filters and Results */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Filters Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Filter className="w-5 h-5 mr-2" />
                  Filters
                </h3>
                
                {/* Location Filter */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">All Locations</option>
                    <option value="San Francisco">San Francisco</option>
                    <option value="New York">New York</option>
                    <option value="Remote">Remote</option>
                    <option value="Austin">Austin</option>
                  </select>
                </div>

                {/* Experience Filter */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Experience</label>
                  <select
                    value={selectedExperience}
                    onChange={(e) => setSelectedExperience(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">All Levels</option>
                    <option value="0-2 years">0-2 years</option>
                    <option value="3-5 years">3-5 years</option>
                    <option value="5+ years">5+ years</option>
                    <option value="7+ years">7+ years</option>
                  </select>
                </div>

                {/* Skills Filter */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Key Skills</label>
                  <select
                    value={selectedSkills}
                    onChange={(e) => setSelectedSkills(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">All Skills</option>
                    <option value="Python">Python</option>
                    <option value="TensorFlow">TensorFlow</option>
                    <option value="PyTorch">PyTorch</option>
                    <option value="MLOps">MLOps</option>
                    <option value="NLP">NLP</option>
                  </select>
                </div>

                <button className="w-full bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors">
                  Clear Filters
                </button>
              </div>
            </div>

            {/* Candidate Listings */}
            <div className="lg:col-span-3">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {filteredCandidates.length} AI Professionals Found
                </h2>
                <p className="text-gray-600">Showing the best matches for your requirements</p>
              </div>

              <div className="space-y-6">
                {filteredCandidates.map((candidate) => (
                  <div key={candidate.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-6">
                      {/* Avatar */}
                      <div className="flex-shrink-0">
                        <div className="w-20 h-20 bg-gradient-to-br from-primary-400 to-secondary-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                          {candidate.name.split(' ').map(n => n[0]).join('')}
                        </div>
                      </div>

                      {/* Candidate Info */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-xl font-semibold text-gray-900">{candidate.name}</h3>
                              {candidate.matchScore >= 95 && (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  <Sparkles className="w-3 h-3 mr-1" />
                                  Perfect Match
                                </span>
                              )}
                            </div>
                            <p className="text-lg text-gray-600 mb-1">{candidate.title}</p>
                            
                            <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                              <span className="flex items-center">
                                <MapPin className="w-4 h-4 mr-1" />
                                {candidate.location}
                              </span>
                              <span className="flex items-center">
                                <Briefcase className="w-4 h-4 mr-1" />
                                {candidate.experience}
                              </span>
                              <span className="flex items-center">
                                <Award className="w-4 h-4 mr-1" />
                                {candidate.publications} publications
                              </span>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <div className="text-2xl font-bold text-primary-600 mb-2">
                              {candidate.matchScore}%
                            </div>
                            <div className="text-sm text-gray-500">Match Score</div>
                          </div>
                        </div>

                        <p className="text-gray-700 mb-4">{candidate.bio}</p>
                        
                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Key Skills</h4>
                          <div className="flex flex-wrap gap-2">
                            {candidate.skills.map((skill) => (
                              <span
                                key={skill}
                                className="px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm font-medium"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Experience</h4>
                          <div className="flex flex-wrap gap-2">
                            {candidate.companies.map((company) => (
                              <span
                                key={company}
                                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                              >
                                {company}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <button className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center">
                            <Eye className="w-4 h-4 mr-2" />
                            View Profile
                          </button>
                          <button className="bg-white border border-primary-600 text-primary-600 px-6 py-2 rounded-lg hover:bg-primary-50 transition-colors">
                            Contact
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

