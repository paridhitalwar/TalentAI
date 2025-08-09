'use client'

import { useState } from 'react'
import { 
  Code, 
  Brain, 
  Clock, 
  Trophy, 
  Users, 
  Star,
  Play,
  BookOpen,
  Target,
  Zap,
  CheckCircle,
  TrendingUp
} from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const mockChallenges = [
  {
    id: 1,
    title: 'ML Model Optimization Challenge',
    difficulty: 'Hard',
    category: 'Machine Learning',
    timeLimit: '4 hours',
    participants: 156,
    reward: '$500',
    description: 'Optimize a deep learning model for both accuracy and inference speed. Balance the trade-off between model complexity and performance.',
    skills: ['Python', 'TensorFlow', 'PyTorch', 'MLOps', 'Performance Optimization'],
    tags: ['Deep Learning', 'Optimization', 'Production ML']
  },
  {
    id: 2,
    title: 'NLP Text Classification',
    difficulty: 'Medium',
    category: 'Natural Language Processing',
    timeLimit: '3 hours',
    participants: 89,
    reward: '$300',
    description: 'Build a text classification model that can accurately categorize news articles into predefined topics with high precision.',
    skills: ['Python', 'NLP', 'Scikit-learn', 'Transformers', 'Data Preprocessing'],
    tags: ['Text Classification', 'NLP', 'Machine Learning']
  },
  {
    id: 3,
    title: 'Computer Vision Object Detection',
    difficulty: 'Hard',
    category: 'Computer Vision',
    timeLimit: '5 hours',
    participants: 67,
    reward: '$400',
    description: 'Implement a real-time object detection system using YOLO or similar architecture. Focus on speed and accuracy.',
    skills: ['Python', 'OpenCV', 'PyTorch', 'Computer Vision', 'Real-time Systems'],
    tags: ['Object Detection', 'Computer Vision', 'Real-time ML']
  },
  {
    id: 4,
    title: 'Data Pipeline Architecture',
    difficulty: 'Medium',
    category: 'Data Engineering',
    timeLimit: '3 hours',
    participants: 124,
    reward: '$250',
    description: 'Design and implement a scalable data pipeline for processing large-scale ML datasets with proper error handling.',
    skills: ['Python', 'Apache Spark', 'Airflow', 'Data Engineering', 'Scalability'],
    tags: ['Data Pipelines', 'Big Data', 'ML Infrastructure']
  },
  {
    id: 5,
    title: 'Reinforcement Learning Agent',
    difficulty: 'Expert',
    category: 'Reinforcement Learning',
    timeLimit: '6 hours',
    participants: 34,
    reward: '$600',
    description: 'Create an RL agent that can learn to play a simple game environment. Implement Q-learning or policy gradient methods.',
    skills: ['Python', 'Reinforcement Learning', 'Gym', 'Neural Networks', 'RL Algorithms'],
    tags: ['Reinforcement Learning', 'Game AI', 'Neural Networks']
  },
  {
    id: 6,
    title: 'MLOps Deployment Challenge',
    difficulty: 'Medium',
    category: 'MLOps',
    timeLimit: '4 hours',
    participants: 78,
    reward: '$350',
    description: 'Deploy a machine learning model to production using Docker, Kubernetes, and implement monitoring and logging.',
    skills: ['Docker', 'Kubernetes', 'MLOps', 'Monitoring', 'DevOps'],
    tags: ['MLOps', 'Deployment', 'Production ML']
  }
]

const categories = [
  'All',
  'Machine Learning',
  'Natural Language Processing',
  'Computer Vision',
  'Data Engineering',
  'Reinforcement Learning',
  'MLOps'
]

const difficulties = ['All', 'Easy', 'Medium', 'Hard', 'Expert']

export default function ChallengesPage() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedDifficulty, setSelectedDifficulty] = useState('All')
  const [searchTerm, setSearchTerm] = useState('')

  const filteredChallenges = mockChallenges.filter(challenge => {
    const matchesCategory = selectedCategory === 'All' || challenge.category === selectedCategory
    const matchesDifficulty = selectedDifficulty === 'All' || challenge.difficulty === selectedDifficulty
    const matchesSearch = challenge.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         challenge.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         challenge.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))

    return matchesCategory && matchesDifficulty && matchesSearch
  })

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800'
      case 'Medium': return 'bg-yellow-100 text-yellow-800'
      case 'Hard': return 'bg-orange-100 text-orange-800'
      case 'Expert': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-primary-500 to-secondary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            AI Skill Challenges
          </h1>
          <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
            Test your AI and machine learning skills with real-world challenges. 
            Compete with top talent and showcase your expertise to recruiters.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Code className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" />
              <input
                type="text"
                placeholder="Search challenges, skills, or topics..."
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
          {/* Filters */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-4">
              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              {/* Difficulty Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  {difficulties.map((difficulty) => (
                    <option key={difficulty} value={difficulty}>{difficulty}</option>
                  ))}
                </select>
              </div>

              {/* Clear Filters */}
              <div className="flex items-end">
                <button
                  onClick={() => {
                    setSelectedCategory('All')
                    setSelectedDifficulty('All')
                    setSearchTerm('')
                  }}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {filteredChallenges.length} Challenges Found
            </h2>
            <p className="text-gray-600">Showing challenges that match your criteria</p>
          </div>

          {/* Challenges Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredChallenges.map((challenge) => (
              <div key={challenge.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {challenge.title}
                    </h3>
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(challenge.difficulty)}`}>
                        {challenge.difficulty}
                      </span>
                      <span className="px-2 py-1 bg-primary-100 text-primary-800 rounded-full text-xs font-medium">
                        {challenge.category}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary-600 mb-1">
                      {challenge.reward}
                    </div>
                    <div className="text-sm text-gray-500">Reward</div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {challenge.description}
                </p>

                {/* Skills */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Required Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {challenge.skills.slice(0, 3).map((skill) => (
                      <span
                        key={skill}
                        className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                      >
                        {skill}
                      </span>
                    ))}
                    {challenge.skills.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                        +{challenge.skills.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {challenge.timeLimit}
                  </div>
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    {challenge.participants} participants
                  </div>
                </div>

                {/* Action Button */}
                <button className="w-full bg-primary-600 text-white py-3 px-4 rounded-xl hover:bg-primary-700 transition-colors font-medium flex items-center justify-center">
                  <Play className="w-4 h-4 mr-2" />
                  Start Challenge
                </button>
              </div>
            ))}
          </div>

          {/* No Results */}
          {filteredChallenges.length === 0 && (
            <div className="text-center py-12">
              <Code className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Challenges Found</h3>
              <p className="text-gray-600">Try adjusting your filters or search terms</p>
            </div>
          )}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Why Participate in Challenges?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Challenge yourself, showcase your skills, and connect with opportunities
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Win Rewards</h3>
              <p className="text-gray-600">Earn cash prizes and recognition for your achievements</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Showcase Skills</h3>
              <p className="text-gray-600">Demonstrate your expertise to top companies and recruiters</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-accent-500 to-accent-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Career Growth</h3>
              <p className="text-gray-600">Build your portfolio and advance your AI career</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-success-500 to-success-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Network</h3>
              <p className="text-gray-600">Connect with other AI professionals and industry leaders</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
