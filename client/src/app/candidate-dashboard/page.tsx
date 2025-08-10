'use client'

import { useState } from 'react'
import { 
  Briefcase, 
  Plus, 
  Heart, 
  Star,
  MessageCircle,
  Eye,
  MapPin,
  Building,
  Zap,
  BarChart3,
  Upload,
  X,
  Check,
  Gamepad2,
  FileText,
  Settings,
  Brain,
  Target,
  Calendar
} from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import JobSwipe from '@/components/JobSwipe'
import BookingSection from '@/components/BookingSection'

const mockJobs = [
  {
    id: 1,
    title: 'Senior ML Engineer',
    company: 'TechCorp AI',
    location: 'San Francisco, CA',
    type: 'Full-time',
    salary: '$150k - $200k',
    description: 'Join our AI team to build cutting-edge machine learning models and scale them to millions of users.',
    requirements: ['Python', 'TensorFlow', 'PyTorch', 'MLOps', 'AWS'],
    responsibilities: [
      'Design and implement ML models',
      'Optimize model performance',
      'Collaborate with cross-functional teams',
      'Mentor junior engineers'
    ],
    matchScore: 95,
    posted: '2 days ago',
    applicants: 24,
    status: 'Active'
  },
  {
    id: 2,
    title: 'AI Research Scientist',
    company: 'InnovateAI',
    location: 'Remote',
    type: 'Full-time',
    salary: '$180k - $250k',
    description: 'Research and develop novel AI algorithms for natural language processing and computer vision.',
    requirements: ['PhD in CS/AI', 'PyTorch', 'Research Experience', 'Publications'],
    responsibilities: [
      'Conduct cutting-edge AI research',
      'Publish papers in top conferences',
      'Develop novel algorithms',
      'Collaborate with academic partners'
    ],
    matchScore: 88,
    posted: '1 week ago',
    applicants: 18,
    status: 'Active'
  },
  {
    id: 3,
    title: 'Data Scientist',
    company: 'DataFlow Inc',
    location: 'New York, NY',
    type: 'Full-time',
    salary: '$120k - $160k',
    description: 'Analyze large datasets and build predictive models to drive business decisions.',
    requirements: ['Python', 'SQL', 'Statistics', 'Machine Learning', 'Tableau'],
    responsibilities: [
      'Analyze complex datasets',
      'Build predictive models',
      'Create data visualizations',
      'Present insights to stakeholders'
    ],
    matchScore: 92,
    posted: '3 days ago',
    applicants: 31,
    status: 'Active'
  },
  {
    id: 4,
    title: 'ML Engineer',
    company: 'ScaleAI',
    location: 'Seattle, WA',
    type: 'Full-time',
    salary: '$140k - $180k',
    description: 'Build and deploy machine learning models at scale for production environments.',
    requirements: ['Python', 'Docker', 'Kubernetes', 'MLOps', 'Cloud Platforms'],
    responsibilities: [
      'Deploy ML models to production',
      'Monitor model performance',
      'Implement CI/CD pipelines',
      'Optimize model inference'
    ],
    matchScore: 85,
    posted: '5 days ago',
    applicants: 22,
    status: 'Active'
  },
  {
    id: 5,
    title: 'AI Software Engineer',
    company: 'RoboTech',
    location: 'Austin, TX',
    type: 'Full-time',
    salary: '$130k - $170k',
    description: 'Develop AI-powered software solutions for autonomous systems and robotics.',
    requirements: ['C++', 'Python', 'Computer Vision', 'Robotics', 'CUDA'],
    responsibilities: [
      'Develop AI algorithms for robots',
      'Implement computer vision systems',
      'Optimize real-time performance',
      'Test in simulation and real-world'
    ],
    matchScore: 78,
    posted: '1 week ago',
    applicants: 15,
    status: 'Active'
  }
]

export default function CandidateDashboard() {
  const [currentJobIndex, setCurrentJobIndex] = useState(0)
  const [activeTab, setActiveTab] = useState('swipe')
  const [likedJobs, setLikedJobs] = useState<number[]>([])
  const [rejectedJobs, setRejectedJobs] = useState<number[]>([])
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [skills, setSkills] = useState<string[]>([
    'Python', 'Machine Learning', 'Data Analysis', 'SQL'
  ])
  const [newSkill, setNewSkill] = useState('')
  const [showSkillInput, setShowSkillInput] = useState(false)
  const [showBooking, setShowBooking] = useState(false)

  const currentJob = mockJobs[currentJobIndex]

  const handleLike = () => {
    if (currentJob) {
      setLikedJobs(prev => [...prev, currentJob.id])
      nextJob()
    }
  }

  const handleReject = () => {
    if (currentJob) {
      setRejectedJobs(prev => [...prev, currentJob.id])
      nextJob()
    }
  }

  const nextJob = () => {
    if (currentJobIndex < mockJobs.length - 1) {
      setCurrentJobIndex(prev => prev + 1)
    } else {
      setCurrentJobIndex(0)
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setResumeFile(file)
    }
  }

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills(prev => [...prev, newSkill.trim()])
      setNewSkill('')
      setShowSkillInput(false)
    }
  }

  const removeSkill = (skillToRemove: string) => {
    setSkills(prev => prev.filter(skill => skill !== skillToRemove))
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
      <section className="pt-32 pb-16 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-white/10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Zap className="w-8 h-8 text-yellow-400 mr-3 animate-pulse" />
              <h1 className="text-4xl md:text-6xl font-black text-white mb-6 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                Candidate Dashboard
              </h1>
            </div>
            <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto font-medium">
              Discover amazing job opportunities with our intelligent matching system. Swipe through jobs and find your perfect match.
            </p>
            
            <div className="flex justify-center gap-4">
              <button className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-8 py-4 rounded-2xl hover:from-yellow-500 hover:to-orange-600 transition-all duration-300 font-bold text-lg shadow-2xl hover:shadow-yellow-500/25 flex items-center transform hover:scale-105">
                <Upload className="w-6 h-6 mr-3" />
                Upload Resume
              </button>
              <button className="border-2 border-white text-white px-8 py-4 rounded-2xl hover:bg-white hover:text-blue-600 transition-all duration-300 font-bold text-lg backdrop-blur-sm">
                View Profile
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
              { id: 'swipe', label: 'Swipe Jobs', icon: Briefcase },
              { id: 'profile', label: 'Profile', icon: FileText },
              { id: 'liked', label: 'Liked Jobs', icon: Heart },
              { id: 'games', label: 'Games', icon: Gamepad2 }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-bold transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg transform scale-105'
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
                    <h2 className="text-3xl font-black text-gray-900 mb-3">Swipe Through Jobs</h2>
                    <p className="text-gray-600 font-medium">Find your perfect job match</p>
                  </div>

                  {currentJob && (
                    <JobSwipe
                      job={currentJob}
                      onLike={handleLike}
                      onReject={handleReject}
                      currentIndex={currentJobIndex}
                      totalCount={mockJobs.length}
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
                      <span className="text-gray-600 font-medium">Jobs Viewed</span>
                      <span className="text-3xl font-black text-blue-600">{currentJobIndex + 1}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 font-medium">Jobs Liked</span>
                      <span className="text-3xl font-black text-green-600">{likedJobs.length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 font-medium">Jobs Rejected</span>
                      <span className="text-3xl font-black text-red-600">{rejectedJobs.length}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/20">
                  <h3 className="text-xl font-black text-gray-900 mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 font-bold">
                      Apply to Liked Jobs
                    </button>
                    <button className="w-full border-2 border-blue-600 text-blue-600 py-3 px-4 rounded-xl hover:bg-blue-600 hover:text-white transition-all duration-300 font-bold">
                      Update Profile
                    </button>
                    <button className="w-full border-2 border-gray-300 text-gray-600 py-3 px-4 rounded-xl hover:bg-gray-100 transition-all duration-300 font-bold">
                      View Applications
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20">
              <div className="p-8 border-b border-gray-100">
                <h2 className="text-3xl font-black text-gray-900">Profile & Skills</h2>
                <p className="text-gray-600 font-medium">Manage your resume and skills</p>
              </div>
              
              <div className="p-8 space-y-8">
                {/* Resume Upload */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border-2 border-dashed border-blue-200">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Resume Upload</h3>
                  <div className="flex items-center gap-4">
                    {resumeFile ? (
                      <div className="flex items-center gap-3 bg-white rounded-lg px-4 py-3 flex-1">
                        <FileText className="w-6 h-6 text-blue-600" />
                        <span className="font-medium text-gray-900">{resumeFile.name}</span>
                        <button 
                          onClick={() => setResumeFile(null)}
                          className="ml-auto text-red-500 hover:text-red-700"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    ) : (
                      <label className="flex items-center gap-3 bg-white rounded-lg px-4 py-3 flex-1 cursor-pointer hover:bg-gray-50 transition-colors">
                        <Upload className="w-6 h-6 text-blue-600" />
                        <span className="font-medium text-gray-900">Choose file or drag here</span>
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-2">Supported formats: PDF, DOC, DOCX (Max 10MB)</p>
                </div>

                {/* Skills Management */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Skills</h3>
                  <div className="flex flex-wrap gap-3 mb-4">
                    {skills.map((skill) => (
                      <div
                        key={skill}
                        className="flex items-center gap-2 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 px-4 py-2 rounded-full font-medium"
                      >
                        <span>{skill}</span>
                        <button
                          onClick={() => removeSkill(skill)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    {showSkillInput ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={newSkill}
                          onChange={(e) => setNewSkill(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                          placeholder="Add skill..."
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          autoFocus
                        />
                        <button
                          onClick={addSkill}
                          className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setShowSkillInput(false)
                            setNewSkill('')
                          }}
                          className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setShowSkillInput(true)}
                        className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-full hover:from-blue-700 hover:to-indigo-700 transition-all duration-300"
                      >
                        <Plus className="w-4 h-4" />
                        Add Skill
                      </button>
                    )}
                  </div>
                </div>

                {/* Profile Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 text-center">
                    <div className="text-3xl font-black text-blue-600 mb-2">{skills.length}</div>
                    <div className="text-gray-600 font-medium">Skills</div>
                  </div>
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 text-center">
                    <div className="text-3xl font-black text-green-600 mb-2">{likedJobs.length}</div>
                    <div className="text-gray-600 font-medium">Liked Jobs</div>
                  </div>
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 text-center">
                    <div className="text-3xl font-black text-purple-600 mb-2">95%</div>
                    <div className="text-gray-600 font-medium">Profile Complete</div>
                  </div>
                </div>

                {/* Booking Section */}
                <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-6 border-2 border-dashed border-orange-200">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Schedule Interview</h3>
                  <p className="text-gray-600 mb-4">Ready to take the next step? Schedule an interview with our recruiters.</p>
                  <button
                    onClick={() => setShowBooking(true)}
                    className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 px-6 rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-300 font-bold flex items-center gap-2"
                  >
                    <Calendar className="w-5 h-5" />
                    Book Interview
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'liked' && (
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20">
              <div className="p-8 border-b border-gray-100">
                <h2 className="text-3xl font-black text-gray-900">Liked Jobs</h2>
                <p className="text-gray-600 font-medium">Jobs you've shown interest in</p>
              </div>
              
              <div className="p-8">
                {likedJobs.length === 0 ? (
                  <div className="text-center py-16">
                    <Heart className="w-20 h-20 text-gray-400 mx-auto mb-6" />
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">No Liked Jobs Yet</h3>
                    <p className="text-gray-600 font-medium">Start swiping to find jobs you like</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {mockJobs
                      .filter(job => likedJobs.includes(job.id))
                      .map((job) => (
                        <div key={job.id} className="border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-shadow bg-white">
                          <div className="flex items-center gap-4 mb-4">
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                              {job.company.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                              <h3 className="text-xl font-bold text-gray-900">{job.title}</h3>
                              <p className="text-sm text-blue-600 font-medium">{job.company}</p>
                            </div>
                          </div>
                          
                          <div className="mb-4">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-sm text-gray-600">Match Score</span>
                              <span className="font-bold text-blue-600">{job.matchScore}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3">
                              <div 
                                className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full transition-all duration-300"
                                style={{ width: `${job.matchScore}%` }}
                              ></div>
                            </div>
                          </div>

                          <div className="flex gap-3">
                            <button className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 font-bold">
                              Apply Now
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

          {activeTab === 'games' && (
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20">
              <div className="p-8 border-b border-gray-100">
                <h2 className="text-3xl font-black text-gray-900">AI Assessment Games</h2>
                <p className="text-gray-600 font-medium">Test your skills through interactive games</p>
              </div>
              
              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white mb-4">
                      <Gamepad2 className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Code Challenge</h3>
                    <p className="text-gray-600 mb-4">Solve coding problems and improve your technical skills</p>
                    <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-4 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 font-bold">
                      Start Game
                    </button>
                  </div>

                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white mb-4">
                      <Brain className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Personality Test</h3>
                    <p className="text-gray-600 mb-4">Discover your work style and team compatibility</p>
                    <button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 font-bold">
                      Start Test
                    </button>
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white mb-4">
                      <Target className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Problem Solving</h3>
                    <p className="text-gray-600 mb-4">Test your analytical and problem-solving abilities</p>
                    <button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-4 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 font-bold">
                      Start Game
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {showBooking && (
        <BookingSection onClose={() => setShowBooking(false)} />
      )}
      <Footer />
    </div>
  )
}

