'use client'

import { useState } from 'react'
import { 
  User, 
  Briefcase, 
  Award, 
  BookOpen, 
  Target, 
  TrendingUp,
  Edit,
  Plus,
  Eye,
  Download,
  Star,
  CheckCircle,
  Clock,
  MapPin
} from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const mockProfile = {
  name: 'Alex Chen',
  title: 'Senior AI Engineer',
  location: 'San Francisco, CA',
  experience: '5+ years',
  avatar: '/api/placeholder/150/150',
  bio: 'Passionate AI engineer with expertise in machine learning, deep learning, and natural language processing. Led multiple successful AI projects and contributed to open-source ML libraries.',
  skills: ['Python', 'TensorFlow', 'PyTorch', 'NLP', 'Computer Vision', 'MLOps', 'AWS', 'Docker'],
  education: 'MS Computer Science, Stanford University',
  certifications: ['AWS Machine Learning Specialty', 'Google Cloud ML Engineer']
}

const mockApplications = [
  {
    id: 1,
    company: 'OpenAI',
    position: 'Senior ML Engineer',
    status: 'Applied',
    date: '2024-01-15',
    matchScore: 95
  },
  {
    id: 2,
    company: 'Anthropic',
    position: 'AI Research Scientist',
    status: 'Interview',
    date: '2024-01-10',
    matchScore: 92
  },
  {
    id: 3,
    company: 'Google',
    position: 'ML Engineer',
    status: 'Applied',
    date: '2024-01-08',
    matchScore: 88
  }
]

const mockAchievements = [
  {
    id: 1,
    title: 'Top 10% AI Challenge Score',
    description: 'Achieved top 10% in Neural Network Puzzle challenge',
    date: '2024-01-20',
    points: 150
  },
  {
    id: 2,
    title: 'Skills Assessment Completed',
    description: 'Completed comprehensive AI skills assessment',
    date: '2024-01-18',
    points: 100
  },
  {
    id: 3,
    title: 'Profile Optimization',
    description: 'Optimized profile for better matching',
    date: '2024-01-15',
    points: 50
  }
]

export default function CandidateDashboard() {
  const [activeTab, setActiveTab] = useState('overview')

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Applied': return 'bg-blue-100 text-blue-800'
      case 'Interview': return 'bg-yellow-100 text-yellow-800'
      case 'Offer': return 'bg-green-100 text-green-800'
      case 'Rejected': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-primary-500 to-secondary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-3xl font-bold text-primary-600">
              {mockProfile.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-white mb-2">
                {mockProfile.name}
              </h1>
              <p className="text-xl text-white/90 mb-2">
                {mockProfile.title}
              </p>
              <div className="flex items-center gap-4 text-white/80">
                <span className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  {mockProfile.location}
                </span>
                <span className="flex items-center">
                  <Briefcase className="w-4 h-4 mr-1" />
                  {mockProfile.experience}
                </span>
              </div>
            </div>
            <div className="flex gap-3">
              <button className="bg-white/20 text-white px-4 py-2 rounded-lg hover:bg-white/30 transition-colors flex items-center">
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </button>
              <button className="bg-white text-primary-600 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors flex items-center">
                <Download className="w-4 h-4 mr-2" />
                Export CV
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Navigation Tabs */}
          <div className="flex space-x-1 bg-white p-1 rounded-xl shadow-sm mb-8">
            {[
              { id: 'overview', label: 'Overview', icon: User },
              { id: 'applications', label: 'Applications', icon: Briefcase },
              { id: 'skills', label: 'Skills', icon: Target },
              { id: 'achievements', label: 'Achievements', icon: Award }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-primary-600 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Profile Card */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Profile</h2>
                  <p className="text-gray-600 mb-6">{mockProfile.bio}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Education</h3>
                      <p className="text-gray-600">{mockProfile.education}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Experience</h3>
                      <p className="text-gray-600">{mockProfile.experience}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Card */}
              <div className="space-y-6">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Applications</span>
                      <span className="text-2xl font-bold text-primary-600">{mockApplications.length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Skills</span>
                      <span className="text-2xl font-bold text-primary-600">{mockProfile.skills.length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Achievements</span>
                      <span className="text-2xl font-bold text-primary-600">{mockAchievements.length}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-gray-600">Profile updated</span>
                      <span className="text-gray-400">2h ago</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-gray-600">Applied to OpenAI</span>
                      <span className="text-gray-400">1d ago</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span className="text-gray-600">Completed challenge</span>
                      <span className="text-gray-400">3d ago</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'applications' && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900">Job Applications</h2>
                <p className="text-gray-600">Track your application progress and status</p>
              </div>
              
              <div className="p-6">
                <div className="space-y-4">
                  {mockApplications.map((application) => (
                    <div key={application.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex-1">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                            <Briefcase className="w-6 h-6 text-primary-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{application.position}</h3>
                            <p className="text-gray-600">{application.company}</p>
                            <div className="flex items-center gap-4 mt-2 text-sm">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                                {application.status}
                              </span>
                              <span className="text-gray-500">Applied {application.date}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm text-gray-600">Match Score</span>
                          <span className="text-lg font-bold text-primary-600">{application.matchScore}%</span>
                        </div>
                        <div className="flex gap-2">
                          <button className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="px-3 py-1 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                            Track
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'skills' && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Skills & Expertise</h2>
                    <p className="text-gray-600">Your technical skills and proficiency levels</p>
                  </div>
                  <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Skill
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {mockProfile.skills.map((skill, index) => (
                    <div key={skill} className="p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-900">{skill}</h3>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < Math.floor(Math.random() * 3) + 3
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${Math.floor(Math.random() * 30) + 70}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'achievements' && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900">Achievements & Badges</h2>
                <p className="text-gray-600">Your accomplishments and earned rewards</p>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {mockAchievements.map((achievement) => (
                    <div key={achievement.id} className="p-6 border border-gray-200 rounded-xl hover:shadow-md transition-shadow">
                      <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Award className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
                        {achievement.title}
                      </h3>
                      <p className="text-gray-600 text-center mb-4">
                        {achievement.description}
                      </p>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">{achievement.date}</span>
                        <span className="font-semibold text-primary-600">+{achievement.points} pts</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}
