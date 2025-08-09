'use client'

import { useState } from 'react'
import { 
  Users, 
  Briefcase, 
  Plus, 
  Heart, 
  Star,
  MessageCircle,
  Eye,
  MapPin,
  Building,
  Zap,
  BarChart3
} from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import AnimatedSwipe from '@/components/AnimatedSwipe'
import FunnelView from '@/components/FunnelView'

const mockCandidates = [
  {
    id: 1,
    name: 'Sarah Kim',
    title: 'Senior ML Engineer',
    location: 'San Francisco, CA',
    experience: '6 years',
    skills: ['Python', 'TensorFlow', 'PyTorch', 'NLP', 'Computer Vision'],
    education: 'PhD Computer Science, MIT',
    company: 'Google',
    avatar: '/api/placeholder/300/400',
    matchScore: 98,
    bio: 'Experienced ML engineer with expertise in large language models and computer vision. Led multiple successful AI projects at Google.',
    achievements: ['Top 1% in AI challenges', 'Published 15+ papers', 'Open source contributor'],
    stage: 'swipe',
    personalityScore: null,
    codeBattleScore: null,
    gameScore: null,
    interviewBooked: false
  },
  {
    id: 2,
    name: 'Marcus Johnson',
    title: 'AI Research Scientist',
    location: 'New York, NY',
    experience: '4 years',
    skills: ['Python', 'PyTorch', 'Research', 'Mathematics', 'Deep Learning'],
    education: 'PhD Mathematics, Stanford',
    company: 'OpenAI',
    avatar: '/api/placeholder/300/400',
    matchScore: 95,
    bio: 'Research scientist focused on advancing AI capabilities through innovative algorithms and mathematical approaches.',
    achievements: ['Research breakthrough award', '10+ publications', 'Patent holder'],
    stage: 'personality',
    personalityScore: 87,
    codeBattleScore: null,
    gameScore: null,
    interviewBooked: false
  },
  {
    id: 3,
    name: 'Priya Patel',
    title: 'ML Engineer',
    location: 'Seattle, WA',
    experience: '3 years',
    skills: ['Python', 'Scikit-learn', 'AWS', 'MLOps', 'Data Engineering'],
    education: 'MS Computer Science, CMU',
    company: 'Amazon',
    avatar: '/api/placeholder/300/400',
    matchScore: 92,
    bio: 'ML engineer specializing in production machine learning systems and scalable AI infrastructure.',
    achievements: ['AWS certified', 'MLOps expert', 'Performance optimization'],
    stage: 'code-battle',
    personalityScore: 91,
    codeBattleScore: 78,
    gameScore: null,
    interviewBooked: false
  },
  {
    id: 4,
    name: 'Alex Chen',
    title: 'AI Software Engineer',
    location: 'Austin, TX',
    experience: '5 years',
    skills: ['Python', 'C++', 'CUDA', 'Computer Vision', 'Robotics'],
    education: 'MS Robotics, CMU',
    company: 'Tesla',
    avatar: '/api/placeholder/300/400',
    matchScore: 89,
    bio: 'AI engineer working on autonomous driving systems and computer vision algorithms.',
    achievements: ['Robotics competition winner', '5+ patents', 'Open source maintainer'],
    stage: 'game',
    personalityScore: 88,
    codeBattleScore: 82,
    gameScore: 76,
    interviewBooked: false
  },
  {
    id: 5,
    name: 'Emma Rodriguez',
    title: 'Data Scientist',
    location: 'Boston, MA',
    experience: '4 years',
    skills: ['Python', 'R', 'SQL', 'Statistics', 'Machine Learning'],
    education: 'PhD Statistics, Harvard',
    company: 'Netflix',
    avatar: '/api/placeholder/300/400',
    matchScore: 87,
    bio: 'Data scientist specializing in recommendation systems and user behavior analysis.',
    achievements: ['Best paper award', 'Kaggle grandmaster', 'Mentor to 50+ students'],
    stage: 'interview',
    personalityScore: 85,
    codeBattleScore: 79,
    gameScore: 81,
    interviewBooked: true
  }
]

const mockJobPostings = [
  {
    id: 1,
    title: 'Senior ML Engineer',
    company: 'TechCorp AI',
    location: 'San Francisco, CA',
    type: 'Full-time',
    salary: '$150k - $200k',
    applicants: 24,
    status: 'Active',
    posted: '2 days ago'
  },
  {
    id: 2,
    title: 'AI Research Scientist',
    company: 'InnovateAI',
    location: 'Remote',
    type: 'Full-time',
    salary: '$180k - $250k',
    applicants: 18,
    status: 'Active',
    posted: '1 week ago'
  }
]

export default function RecruiterDashboard() {
  const [currentCandidateIndex, setCurrentCandidateIndex] = useState(0)
  const [activeTab, setActiveTab] = useState('swipe')
  const [likedCandidates, setLikedCandidates] = useState<number[]>([])
  const [rejectedCandidates, setRejectedCandidates] = useState<number[]>([])

  const currentCandidate = mockCandidates[currentCandidateIndex]

  const handleLike = () => {
    if (currentCandidate) {
      setLikedCandidates(prev => [...prev, currentCandidate.id])
      nextCandidate()
    }
  }

  const handleReject = () => {
    if (currentCandidate) {
      setRejectedCandidates(prev => [...prev, currentCandidate.id])
      nextCandidate()
    }
  }

  const nextCandidate = () => {
    if (currentCandidateIndex < mockCandidates.length - 1) {
      setCurrentCandidateIndex(prev => prev + 1)
    } else {
      setCurrentCandidateIndex(0)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800'
      case 'Paused': return 'bg-yellow-100 text-yellow-800'
      case 'Closed': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Zap className="w-8 h-8 text-yellow-400 mr-3 animate-pulse" />
              <h1 className="text-4xl md:text-6xl font-black text-white mb-6 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                Recruiter Dashboard
              </h1>
            </div>
            <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto font-medium">
              Discover top AI talent with our intelligent matching system. Swipe through profiles and find your perfect candidates.
            </p>
            
            <div className="flex justify-center gap-4">
              <button className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-8 py-4 rounded-2xl hover:from-yellow-500 hover:to-orange-600 transition-all duration-300 font-bold text-lg shadow-2xl hover:shadow-yellow-500/25 flex items-center transform hover:scale-105">
                <Plus className="w-6 h-6 mr-3" />
                Post New Job
              </button>
              <button className="border-2 border-white text-white px-8 py-4 rounded-2xl hover:bg-white hover:text-purple-600 transition-all duration-300 font-bold text-lg backdrop-blur-sm">
                View Analytics
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Navigation Tabs */}
          <div className="flex space-x-1 bg-white/80 backdrop-blur-sm p-2 rounded-2xl shadow-lg mb-8 border border-white/20">
            {[
              { id: 'swipe', label: 'Swipe Candidates', icon: Users },
              { id: 'funnel', label: 'Funnel View', icon: BarChart3 },
              { id: 'jobs', label: 'Job Postings', icon: Briefcase },
              { id: 'liked', label: 'Liked Candidates', icon: Heart }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-bold transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg transform scale-105'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-white/60'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === 'swipe' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Swipe Interface */}
              <div className="lg:col-span-2">
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-black text-gray-900 mb-3">Swipe Through Candidates</h2>
                    <p className="text-gray-600 font-medium">Find your perfect AI talent match</p>
                  </div>

                  {currentCandidate && (
                    <AnimatedSwipe
                      candidate={currentCandidate}
                      onLike={handleLike}
                      onReject={handleReject}
                      currentIndex={currentCandidateIndex}
                      totalCount={mockCandidates.length}
                    />
                  )}
                </div>
              </div>

              {/* Stats Sidebar */}
              <div className="space-y-6">
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/20">
                  <h3 className="text-xl font-black text-gray-900 mb-4">Today's Stats</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 font-medium">Profiles Viewed</span>
                      <span className="text-3xl font-black text-violet-600">12</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 font-medium">Liked</span>
                      <span className="text-3xl font-black text-green-600">{likedCandidates.length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 font-medium">Rejected</span>
                      <span className="text-3xl font-black text-red-600">{rejectedCandidates.length}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/20">
                  <h3 className="text-xl font-black text-gray-900 mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <button className="w-full bg-gradient-to-r from-violet-600 to-purple-600 text-white py-3 px-4 rounded-xl hover:from-violet-700 hover:to-purple-700 transition-all duration-300 font-bold flex items-center justify-center transform hover:scale-105">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Message Candidate
                    </button>
                    <button className="w-full bg-white border-2 border-violet-600 text-violet-600 py-3 px-4 rounded-xl hover:bg-violet-50 transition-all duration-300 font-bold flex items-center justify-center">
                      <Eye className="w-4 h-4 mr-2" />
                      View Full Profile
                    </button>
                    <button className="w-full bg-white border-2 border-gray-300 text-gray-700 py-3 px-4 rounded-xl hover:bg-gray-50 transition-all duration-300 font-bold flex items-center justify-center">
                      <Star className="w-4 h-4 mr-2" />
                      Save for Later
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'funnel' && (
            <FunnelView candidates={mockCandidates} />
          )}

          {activeTab === 'jobs' && (
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20">
              <div className="p-8 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-3xl font-black text-gray-900">Job Postings</h2>
                    <p className="text-gray-600 font-medium">Manage your active job listings</p>
                  </div>
                  <button className="bg-gradient-to-r from-violet-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-violet-700 hover:to-purple-700 transition-all duration-300 font-bold flex items-center transform hover:scale-105">
                    <Plus className="w-5 h-5 mr-2" />
                    Post New Job
                  </button>
                </div>
              </div>
              
              <div className="p-8">
                <div className="space-y-4">
                  {mockJobPostings.map((job) => (
                    <div key={job.id} className="flex items-center justify-between p-6 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors">
                      <div className="flex-1">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center">
                            <Building className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-gray-900">{job.title}</h3>
                            <p className="text-gray-600 font-medium">{job.company}</p>
                            <div className="flex items-center gap-4 mt-2 text-sm">
                              <span className="flex items-center">
                                <MapPin className="w-4 h-4 mr-1 text-violet-500" />
                                {job.location}
                              </span>
                              <span className="text-gray-500">{job.type}</span>
                              <span className="text-gray-500">{job.salary}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm text-gray-600">{job.applicants} applicants</span>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(job.status)}`}>
                            {job.status}
                          </span>
                        </div>
                        <div className="text-sm text-gray-500">Posted {job.posted}</div>
                        <div className="flex gap-2 mt-3">
                          <button className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                            Edit
                          </button>
                          <button className="px-4 py-2 text-sm bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors font-medium">
                            View Applicants
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'liked' && (
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20">
              <div className="p-8 border-b border-gray-100">
                <h2 className="text-3xl font-black text-gray-900">Liked Candidates</h2>
                <p className="text-gray-600 font-medium">Candidates you've shown interest in</p>
              </div>
              
              <div className="p-8">
                {likedCandidates.length === 0 ? (
                  <div className="text-center py-16">
                    <Heart className="w-20 h-20 text-gray-400 mx-auto mb-6" />
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">No Liked Candidates Yet</h3>
                    <p className="text-gray-600 font-medium">Start swiping to find candidates you like</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {mockCandidates
                      .filter(candidate => likedCandidates.includes(candidate.id))
                      .map((candidate) => (
                        <div key={candidate.id} className="border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-shadow bg-white">
                          <div className="flex items-center gap-4 mb-4">
                            <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                              {candidate.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                              <h3 className="text-xl font-bold text-gray-900">{candidate.name}</h3>
                              <p className="text-sm text-violet-600 font-medium">{candidate.title}</p>
                            </div>
                          </div>
                          
                          <div className="mb-4">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-sm text-gray-600">Match Score</span>
                              <span className="font-bold text-violet-600">{candidate.matchScore}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3">
                              <div 
                                className="bg-gradient-to-r from-violet-500 to-purple-600 h-3 rounded-full transition-all duration-300"
                                style={{ width: `${candidate.matchScore}%` }}
                              ></div>
                            </div>
                          </div>

                          <div className="flex gap-3">
                            <button className="flex-1 bg-gradient-to-r from-violet-600 to-purple-600 text-white py-3 px-4 rounded-xl hover:from-violet-700 hover:to-purple-700 transition-all duration-300 font-bold">
                              Contact
                            </button>
                            <button className="px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors">
                              <Eye className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}
