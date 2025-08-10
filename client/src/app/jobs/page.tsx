'use client'

import { useState } from 'react'
import { Search, Filter, MapPin, Briefcase, Clock, DollarSign, Sparkles } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const mockJobs = [
  {
    id: 1,
    title: 'Senior Machine Learning Engineer',
    company: 'TechCorp AI',
    location: 'San Francisco, CA',
    type: 'Full-time',
    salary: '$150k - $200k',
    experience: '5+ years',
    skills: ['Python', 'TensorFlow', 'PyTorch', 'MLOps', 'AWS'],
    description: 'Lead ML initiatives and build scalable AI solutions for enterprise clients.',
    posted: '2 days ago',
    matchScore: 95
  },
  {
    id: 2,
    title: 'AI Research Scientist',
    company: 'Innovation Labs',
    location: 'Remote',
    type: 'Full-time',
    salary: '$120k - $180k',
    experience: '3+ years',
    skills: ['Research', 'NLP', 'Computer Vision', 'PyTorch', 'Publications'],
    description: 'Conduct cutting-edge research in natural language processing and computer vision.',
    posted: '1 week ago',
    matchScore: 88
  },
  {
    id: 3,
    title: 'MLOps Engineer',
    company: 'DataFlow Systems',
    location: 'New York, NY',
    type: 'Full-time',
    salary: '$130k - $170k',
    experience: '4+ years',
    skills: ['Docker', 'Kubernetes', 'MLOps', 'Python', 'CI/CD'],
    description: 'Build and maintain ML infrastructure and deployment pipelines.',
    posted: '3 days ago',
    matchScore: 82
  },
  {
    id: 4,
    title: 'Data Scientist',
    company: 'Analytics Pro',
    location: 'Austin, TX',
    type: 'Full-time',
    salary: '$100k - $140k',
    experience: '2+ years',
    skills: ['Python', 'SQL', 'Statistics', 'Machine Learning', 'Tableau'],
    description: 'Analyze complex datasets and develop predictive models for business insights.',
    posted: '5 days ago',
    matchScore: 78
  }
]

export default function JobsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedLocation, setSelectedLocation] = useState('')
  const [selectedType, setSelectedType] = useState('')
  const [selectedExperience, setSelectedExperience] = useState('')

  const filteredJobs = mockJobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesLocation = !selectedLocation || job.location.includes(selectedLocation)
    const matchesType = !selectedType || job.type === selectedType
    const matchesExperience = !selectedExperience || job.experience === selectedExperience
    
    return matchesSearch && matchesLocation && matchesType && matchesExperience
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-primary-500 to-secondary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Find Your Next AI Career
          </h1>
          <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
            Discover thousands of AI and machine learning opportunities from top companies worldwide
          </p>
          
          {/* Search Bar */}
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" />
              <input
                type="text"
                placeholder="Search for jobs, companies, or skills..."
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

                {/* Job Type Filter */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Job Type</label>
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">All Types</option>
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
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
                  </select>
                </div>

                <button className="w-full bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors">
                  Clear Filters
                </button>
              </div>
            </div>

            {/* Job Listings */}
            <div className="lg:col-span-3">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {filteredJobs.length} AI Jobs Found
                </h2>
                <p className="text-gray-600">Showing the best matches for your profile</p>
              </div>

              <div className="space-y-6">
                {filteredJobs.map((job) => (
                  <div key={job.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-semibold text-gray-900">{job.title}</h3>
                          {job.matchScore >= 90 && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <Sparkles className="w-3 h-3 mr-1" />
                              Perfect Match
                            </span>
                          )}
                        </div>
                        <p className="text-lg text-gray-600 mb-2">{job.company}</p>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                          <span className="flex items-center">
                            <MapPin className="w-4 h-4 mr-1" />
                            {job.location}
                          </span>
                          <span className="flex items-center">
                            <Briefcase className="w-4 h-4 mr-1" />
                            {job.type}
                          </span>
                          <span className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {job.posted}
                          </span>
                          <span className="flex items-center">
                            <DollarSign className="w-4 h-4 mr-1" />
                            {job.salary}
                          </span>
                        </div>

                        <p className="text-gray-700 mb-4">{job.description}</p>
                        
                        <div className="flex flex-wrap gap-2 mb-4">
                          {job.skills.map((skill) => (
                            <span
                              key={skill}
                              className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div className="text-right ml-4">
                        <div className="text-2xl font-bold text-primary-600 mb-2">
                          {job.matchScore}%
                        </div>
                        <div className="text-sm text-gray-500">Match Score</div>
                        <button className="mt-4 bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors">
                          Apply Now
                        </button>
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



