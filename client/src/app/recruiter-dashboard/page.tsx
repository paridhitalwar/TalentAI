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
  BarChart3,
  Trophy,
  X,
  Calendar
} from 'lucide-react'
import Header from '@/components/Header'

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
  
  // Job posting form state
  const [jobForm, setJobForm] = useState({
    title: '',
    location: '',
    description: '',
    skills: ['Python', 'LLMs'],
    graduationDate: '',
    availability: 'Full-time'
  })
  const [newSkill, setNewSkill] = useState('')
  
  // Posted jobs state
  const [postedJobs, setPostedJobs] = useState([
    {
      id: 1,
      title: 'Senior ML Engineer',
      company: 'TechCorp AI',
      location: 'San Francisco, CA',
      type: 'Full-time',
      salary: '$150k - $200k',
      status: 'Active',
      applicants: 24,
      posted: '2 days ago',
      skills: ['Python', 'TensorFlow', 'PyTorch', 'MLOps', 'AWS'],
      applications: [
        {
          id: 1,
          candidateId: 1,
          candidateName: 'Sarah Chen',
          candidateTitle: 'Senior ML Engineer',
          candidateAvatar: '/avatars/sarah.jpg',
          appliedDate: '2 days ago',
          status: 'Applied',
          matchScore: 95,
          personalityScore: 88,
          codeBattleScore: 92,
          gameScore: 89,
          resume: 'sarah_chen_resume.pdf',
          stage: 'Applied'
        },
        {
          id: 2,
          candidateId: 2,
          candidateName: 'Michael Rodriguez',
          candidateTitle: 'ML Engineer',
          candidateAvatar: '/avatars/michael.jpg',
          appliedDate: '1 day ago',
          status: 'In Progress',
          matchScore: 87,
          personalityScore: 92,
          codeBattleScore: 85,
          gameScore: 90,
          resume: 'michael_rodriguez_resume.pdf',
          stage: 'Personality Test'
        },
        {
          id: 3,
          candidateId: 3,
          candidateName: 'Emily Johnson',
          candidateTitle: 'Data Scientist',
          candidateAvatar: '/avatars/emily.jpg',
          appliedDate: '3 days ago',
          status: 'Completed',
          matchScore: 93,
          personalityScore: 89,
          codeBattleScore: 96,
          gameScore: 91,
          resume: 'emily_johnson_resume.pdf',
          stage: 'Interview'
        }
      ]
    },
    {
      id: 2,
      title: 'AI Research Scientist',
      company: 'InnovateAI',
      location: 'Remote',
      type: 'Full-time',
      salary: '$180k - $250k',
      status: 'Active',
      applicants: 18,
      posted: '1 week ago',
      skills: ['Python', 'PyTorch', 'Research', 'Mathematics', 'Deep Learning'],
      applications: [
        {
          id: 4,
          candidateId: 4,
          candidateName: 'David Kim',
          candidateTitle: 'Research Scientist',
          candidateAvatar: '/avatars/david.jpg',
          appliedDate: '5 days ago',
          status: 'Completed',
          matchScore: 96,
          personalityScore: 94,
          codeBattleScore: 98,
          gameScore: 93,
          resume: 'david_kim_resume.pdf',
          stage: 'Interview'
        }
      ]
    },
    {
      id: 3,
      title: 'Data Scientist',
      company: 'DataFlow Inc',
      location: 'New York, NY',
      type: 'Full-time',
      salary: '$120k - $160k',
      status: 'Paused',
      applicants: 31,
      posted: '3 days ago',
      skills: ['Python', 'SQL', 'Statistics', 'Machine Learning', 'Tableau'],
      applications: []
    }
  ])
  const [showJobForm, setShowJobForm] = useState(false)
  const [selectedJob, setSelectedJob] = useState<number | null>(null)
  const [showApplications, setShowApplications] = useState(false)

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

  // Job posting form handlers
  const handleJobFormChange = (field: string, value: string) => {
    setJobForm(prev => ({ ...prev, [field]: value }))
  }

  const handleAddSkill = () => {
    if (newSkill.trim() && !jobForm.skills.includes(newSkill.trim())) {
      setJobForm(prev => ({ ...prev, skills: [...prev.skills, newSkill.trim()] }))
      setNewSkill('')
    }
  }

  const handleRemoveSkill = (skillToRemove: string) => {
    setJobForm(prev => ({ ...prev, skills: prev.skills.filter(skill => skill !== skillToRemove) }))
  }

  const handleJobSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Create new job object
    const newJob = {
      id: Date.now(), // Simple ID generation
      title: jobForm.title,
      company: 'Your Company', // You could add company field to form
      location: jobForm.location,
      type: jobForm.availability,
      salary: '$100k - $150k', // You could add salary field to form
      status: 'Active',
      applicants: 0,
      posted: 'Just now',
      skills: jobForm.skills,
      applications: []
    }
    
    // Add to posted jobs
    setPostedJobs(prev => [newJob, ...prev])
    
    // Reset form
    setJobForm({
      title: '',
      location: '',
      description: '',
      skills: ['Python', 'LLMs'],
      graduationDate: '',
      availability: 'Full-time'
    })
    
    // Hide form and show jobs list
    setShowJobForm(false)
    
    alert('Job posted successfully!')
  }

  const handleViewApplications = (jobId: number) => {
    setSelectedJob(jobId)
    setShowApplications(true)
  }

  const handleCloseApplications = () => {
    setShowApplications(false)
    setSelectedJob(null)
  }

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'Applied': return 'bg-blue-100 text-blue-800'
      case 'Personality Test': return 'bg-yellow-100 text-yellow-800'
      case 'Code Battle': return 'bg-purple-100 text-purple-800'
      case 'Interview': return 'bg-green-100 text-green-800'
      case 'Hired': return 'bg-emerald-100 text-emerald-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-white/10"></div>
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
              <button 
                onClick={() => setActiveTab('jobs')}
                className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-8 py-4 rounded-2xl hover:from-yellow-500 hover:to-orange-600 transition-all duration-300 font-bold text-lg shadow-2xl hover:shadow-yellow-500/25 flex items-center transform hover:scale-105"
              >
                <Plus className="w-6 h-6 mr-3" />
                Post New Job
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
            <div className="space-y-8">
              {/* Header with toggle */}
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-3xl font-black text-gray-900">Job Postings</h2>
                    <p className="text-gray-600 font-medium">Manage your job postings and applications</p>
                  </div>
                  <button
                    onClick={() => setShowJobForm(!showJobForm)}
                    className="bg-gradient-to-r from-violet-600 to-purple-600 text-white py-3 px-6 rounded-xl hover:from-violet-700 hover:to-purple-700 transition-all duration-300 font-bold flex items-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    {showJobForm ? 'View Jobs' : 'Add New Job'}
                  </button>
                </div>

                {/* Job Form */}
                {showJobForm && (
                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="text-xl font-black text-gray-900 mb-6">Add job posting</h3>
                    <form onSubmit={handleJobSubmit} className="space-y-6">
                      {/* Title and Location Row */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                          <input
                            type="text"
                            value={jobForm.title}
                            onChange={(e) => handleJobFormChange('title', e.target.value)}
                            placeholder="Senior ML Engineer"
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                          <input
                            type="text"
                            value={jobForm.location}
                            onChange={(e) => handleJobFormChange('location', e.target.value)}
                            placeholder="Remote / NYC"
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                          />
                        </div>
                      </div>

                      {/* Description */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                        <textarea
                          value={jobForm.description}
                          onChange={(e) => handleJobFormChange('description', e.target.value)}
                          placeholder="Stack, responsibilities, impact..."
                          rows={6}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent resize-none"
                        />
                      </div>

                      {/* Required Skills */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Required skills</label>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {jobForm.skills.map((skill) => (
                            <div key={skill} className="flex items-center gap-2 bg-violet-100 text-violet-800 px-3 py-1 rounded-full">
                              <span>{skill}</span>
                              <button 
                                type="button" 
                                onClick={() => handleRemoveSkill(skill)}
                                className="text-violet-600 hover:text-violet-800"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={newSkill}
                            onChange={(e) => setNewSkill(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                            placeholder="Add skill and press Enter"
                            className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                          />
                          <button
                            type="button"
                            onClick={handleAddSkill}
                            className="px-4 py-3 bg-violet-600 text-white rounded-xl hover:bg-violet-700 transition-colors"
                          >
                            Add
                          </button>
                        </div>
                      </div>

                      {/* Graduation Date and Availability Row */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Min. graduation date (optional)</label>
                          <div className="relative">
                            <input
                              type="text"
                              value={jobForm.graduationDate}
                              onChange={(e) => handleJobFormChange('graduationDate', e.target.value)}
                              placeholder="mm/dd/yyyy"
                              className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                            />
                            <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Availability</label>
                          <div className="relative">
                            <select 
                              value={jobForm.availability}
                              onChange={(e) => handleJobFormChange('availability', e.target.value)}
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent appearance-none bg-white"
                            >
                              <option>Full-time</option>
                              <option>Part-time</option>
                              <option>Contract</option>
                              <option>Internship</option>
                            </select>
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Submit Button */}
                      <div className="pt-6">
                        <button
                          type="submit"
                          className="w-full bg-black text-white py-4 px-8 rounded-xl hover:bg-gray-800 transition-all duration-300 font-bold text-lg"
                        >
                          Post job
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>

              {/* Posted Jobs List */}
              {!showJobForm && (
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
                  <h3 className="text-2xl font-black text-gray-900 mb-6">Your Posted Jobs</h3>
                  
                  {postedJobs.length === 0 ? (
                    <div className="text-center py-16">
                      <Briefcase className="w-20 h-20 text-gray-400 mx-auto mb-6" />
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">No Jobs Posted Yet</h3>
                      <p className="text-gray-600 font-medium mb-6">Create your first job posting to start attracting candidates</p>
                      <button
                        onClick={() => setShowJobForm(true)}
                        className="bg-gradient-to-r from-violet-600 to-purple-600 text-white py-3 px-6 rounded-xl hover:from-violet-700 hover:to-purple-700 transition-all duration-300 font-bold"
                      >
                        Create First Job
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {postedJobs.map((job) => (
                        <div key={job.id} className="border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-shadow bg-white">
                          <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                              {job.company.split(' ').map(n => n[0]).join('')}
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(job.status)}`}>
                              {job.status}
                            </span>
                          </div>
                          
                          <h3 className="text-xl font-bold text-gray-900 mb-2">{job.title}</h3>
                          <p className="text-sm text-violet-600 font-medium mb-3">{job.company}</p>
                          
                          <div className="space-y-2 mb-4">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <MapPin className="w-4 h-4" />
                              {job.location}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Briefcase className="w-4 h-4" />
                              {job.type}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Trophy className="w-4 h-4" />
                              {job.salary}
                            </div>
                          </div>

                          {/* Skills */}
                          <div className="mb-4">
                            <div className="flex flex-wrap gap-1">
                              {job.skills.slice(0, 3).map((skill) => (
                                <span key={skill} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                  {skill}
                                </span>
                              ))}
                              {job.skills.length > 3 && (
                                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                  +{job.skills.length - 3} more
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center justify-between mb-4">
                            <div className="text-center">
                              <div className="text-2xl font-black text-violet-600">{job.applicants}</div>
                              <div className="text-xs text-gray-500">Applicants</div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm text-gray-500">Posted</div>
                              <div className="text-sm font-medium text-gray-900">{job.posted}</div>
                            </div>
                          </div>

                          <div className="flex gap-3">
                            <button 
                              onClick={() => handleViewApplications(job.id)}
                              className="flex-1 bg-gradient-to-r from-violet-600 to-purple-600 text-white py-3 px-4 rounded-xl hover:from-violet-700 hover:to-purple-700 transition-all duration-300 font-bold"
                            >
                              View Applications ({job.applications.length})
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
              )}
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

      {/* Applications Modal */}
      {showApplications && selectedJob && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 max-w-4xl w-full mx-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-3xl font-black text-gray-900">
                  Applications for {postedJobs.find(job => job.id === selectedJob)?.title}
                </h2>
                <p className="text-gray-600 font-medium">
                  {postedJobs.find(job => job.id === selectedJob)?.applications.length} candidates applied
                </p>
              </div>
              <button
                onClick={handleCloseApplications}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {postedJobs.find(job => job.id === selectedJob)?.applications.length === 0 ? (
              <div className="text-center py-16">
                <Users className="w-20 h-20 text-gray-400 mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-gray-900 mb-3">No Applications Yet</h3>
                <p className="text-gray-600 font-medium">Candidates will appear here once they apply</p>
              </div>
            ) : (
              <div className="space-y-4">
                {postedJobs.find(job => job.id === selectedJob)?.applications.map((application) => (
                  <div key={application.id} className="border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-shadow bg-white">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                          {application.candidateName.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">{application.candidateName}</h3>
                          <p className="text-violet-600 font-medium">{application.candidateTitle}</p>
                          <p className="text-sm text-gray-600">Applied {application.appliedDate}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-black text-violet-600 mb-1">{application.matchScore}%</div>
                        <div className="text-sm text-gray-600">Match Score</div>
                      </div>
                    </div>

                    {/* Progress Scores */}
                    <div className="grid grid-cols-4 gap-4 mb-4">
                      <div className="text-center">
                        <div className="text-lg font-bold text-blue-600">{application.personalityScore}%</div>
                        <div className="text-xs text-gray-600">Personality</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-purple-600">{application.codeBattleScore}%</div>
                        <div className="text-xs text-gray-600">Code Battle</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-green-600">{application.gameScore}%</div>
                        <div className="text-xs text-gray-600">Games</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-orange-600">{application.matchScore}%</div>
                        <div className="text-xs text-gray-600">Overall</div>
                      </div>
                    </div>

                    {/* Stage and Actions */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-sm font-bold ${getStageColor(application.stage)}`}>
                          {application.stage}
                        </span>
                        <span className="text-sm text-gray-600">Stage in pipeline</span>
                      </div>
                      <div className="flex gap-3">
                        <button className="px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors text-sm font-medium">
                          <Download className="w-4 h-4 mr-2 inline" />
                          Download Resume
                        </button>
                        <button className="px-4 py-2 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl hover:from-violet-700 hover:to-purple-700 transition-all duration-300 font-bold text-sm">
                          View Full Profile
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
