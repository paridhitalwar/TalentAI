'use client'

import { useState } from 'react'
import { 
  Puzzle, 
  Brain, 
  Clock, 
  Trophy, 
  Users, 
  Star,
  Play,
  Target,
  Zap,
  TrendingUp,
  Gamepad2,
  Lightbulb
} from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const mockGames = [
  {
    id: 1,
    title: 'Neural Network Puzzle',
    category: 'Logic & Pattern',
    difficulty: 'Medium',
    timeLimit: '15 min',
    participants: 234,
    highScore: 950,
    description: 'Connect neurons in the correct pattern to complete the neural network. Test your understanding of AI architecture.',
    skills: ['Pattern Recognition', 'Logic', 'AI Concepts', 'Problem Solving'],
    tags: ['AI', 'Neural Networks', 'Logic']
  },
  {
    id: 2,
    title: 'Data Flow Maze',
    category: 'Strategy',
    difficulty: 'Hard',
    timeLimit: '20 min',
    participants: 156,
    highScore: 1200,
    description: 'Navigate through a complex data pipeline maze. Optimize data flow and avoid bottlenecks.',
    skills: ['Data Engineering', 'Optimization', 'Strategic Thinking', 'Flow Analysis'],
    tags: ['Data', 'Strategy', 'Optimization']
  },
  {
    id: 3,
    title: 'Algorithm Race',
    category: 'Speed & Accuracy',
    difficulty: 'Easy',
    timeLimit: '10 min',
    participants: 445,
    highScore: 800,
    description: 'Race against time to implement algorithms correctly. Balance speed with accuracy.',
    skills: ['Algorithm Design', 'Speed', 'Accuracy', 'Code Quality'],
    tags: ['Algorithms', 'Speed', 'Coding']
  },
  {
    id: 4,
    title: 'Model Optimization Challenge',
    category: 'Problem Solving',
    difficulty: 'Hard',
    timeLimit: '25 min',
    participants: 89,
    highScore: 1500,
    description: 'Optimize machine learning models for better performance. Find the best hyperparameters.',
    skills: ['ML Optimization', 'Hyperparameter Tuning', 'Performance Analysis', 'Critical Thinking'],
    tags: ['ML', 'Optimization', 'Problem Solving']
  },
  {
    id: 5,
    title: 'Code Debugging',
    category: 'Debugging',
    difficulty: 'Medium',
    timeLimit: '12 min',
    participants: 178,
    highScore: 1100,
    description: 'Find and fix bugs in AI code snippets. Test your debugging skills and attention to detail.',
    skills: ['Debugging', 'Code Review', 'Attention to Detail', 'Problem Solving'],
    tags: ['Debugging', 'Code', 'AI']
  },
  {
    id: 6,
    title: 'Data Visualization Puzzle',
    category: 'Creative',
    difficulty: 'Medium',
    timeLimit: '18 min',
    participants: 134,
    highScore: 1050,
    description: 'Create meaningful visualizations from complex datasets. Express data insights creatively.',
    skills: ['Data Visualization', 'Creativity', 'Data Analysis', 'Visual Design'],
    tags: ['Visualization', 'Data', 'Creative']
  }
]

const categories = [
  'All',
  'Logic & Pattern',
  'Strategy',
  'Speed & Accuracy',
  'Problem Solving',
  'Debugging',
  'Creative'
]

const difficulties = ['All', 'Easy', 'Medium', 'Hard']

export default function GamesPage() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedDifficulty, setSelectedDifficulty] = useState('All')
  const [searchTerm, setSearchTerm] = useState('')

  const filteredGames = mockGames.filter(game => {
    const matchesCategory = selectedCategory === 'All' || game.category === selectedCategory
    const matchesDifficulty = selectedDifficulty === 'All' || game.difficulty === selectedDifficulty
    const matchesSearch = game.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         game.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         game.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))

    return matchesCategory && matchesDifficulty && matchesSearch
  })

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800'
      case 'Medium': return 'bg-yellow-100 text-yellow-800'
      case 'Hard': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Logic & Pattern': return Brain
      case 'Strategy': return Target
      case 'Speed & Accuracy': return Zap
      case 'Problem Solving': return Lightbulb
      case 'Debugging': return Puzzle
      case 'Creative': return Star
      default: return Gamepad2
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-accent-500 to-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            AI Brain Games
          </h1>
          <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
            Challenge your mind with interactive puzzles, brain teasers, and AI-focused games. 
            Have fun while sharpening your skills and competing with others.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Puzzle className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" />
              <input
                type="text"
                placeholder="Search games, skills, or categories..."
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
              {filteredGames.length} Games Available
            </h2>
            <p className="text-gray-600">Choose your next brain challenge</p>
          </div>

          {/* Games Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGames.map((game) => {
              const CategoryIcon = getCategoryIcon(game.category)
              return (
                <div key={game.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        <CategoryIcon className="w-5 h-5 text-accent-600" />
                        <span className="text-sm text-gray-500">{game.category}</span>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {game.title}
                      </h3>
                      <div className="flex items-center gap-2 mb-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(game.difficulty)}`}>
                          {game.difficulty}
                        </span>
                        <span className="px-2 py-1 bg-accent-100 text-accent-800 rounded-full text-xs font-medium">
                          {game.timeLimit}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {game.description}
                  </p>

                  {/* Skills */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Skills Tested</h4>
                    <div className="flex flex-wrap gap-2">
                      {game.skills.slice(0, 3).map((skill) => (
                        <span
                          key={skill}
                          className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                        >
                          {skill}
                        </span>
                      ))}
                      {game.skills.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                          +{game.skills.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      {game.participants} players
                    </div>
                    <div className="flex items-center">
                      <Trophy className="w-4 h-4 mr-1" />
                      High: {game.highScore}
                    </div>
                  </div>

                  {/* Action Button */}
                  <button className="w-full bg-accent-600 text-white py-3 px-4 rounded-xl hover:bg-accent-700 transition-colors font-medium flex items-center justify-center">
                    <Play className="w-4 h-4 mr-2" />
                    Play Now
                  </button>
                </div>
              )
            })}
          </div>

          {/* No Results */}
          {filteredGames.length === 0 && (
            <div className="text-center py-12">
              <Puzzle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Games Found</h3>
              <p className="text-gray-600">Try adjusting your filters or search terms</p>
            </div>
          )}
        </div>
      </section>

      {/* Leaderboard Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Top Players
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See who's leading the leaderboards and competing for the top spots
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Weekly Leaderboard */}
            <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Trophy className="w-5 h-5 mr-2 text-primary-600" />
                Weekly Champions
              </h3>
              <div className="space-y-3">
                {[
                  { name: 'Alex Chen', score: 2850, rank: 1 },
                  { name: 'Sarah Kim', score: 2720, rank: 2 },
                  { name: 'Marcus Rodriguez', score: 2680, rank: 3 }
                ].map((player, index) => (
                  <div key={player.rank} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mr-3 ${
                        index === 0 ? 'bg-yellow-500 text-white' :
                        index === 1 ? 'bg-gray-400 text-white' :
                        'bg-orange-500 text-white'
                      }`}>
                        {player.rank}
                      </span>
                      <span className="font-medium text-gray-900">{player.name}</span>
                    </div>
                    <span className="font-bold text-primary-600">{player.score}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Monthly Leaderboard */}
            <div className="bg-gradient-to-br from-secondary-50 to-secondary-100 rounded-2xl p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-secondary-600" />
                Monthly Leaders
              </h3>
              <div className="space-y-3">
                {[
                  { name: 'Priya Patel', score: 12450, rank: 1 },
                  { name: 'David Wilson', score: 11890, rank: 2 },
                  { name: 'Emma Thompson', score: 11560, rank: 3 }
                ].map((player, index) => (
                  <div key={player.rank} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mr-3 ${
                        index === 0 ? 'bg-yellow-500 text-white' :
                        index === 1 ? 'bg-gray-400 text-white' :
                        'bg-orange-500 text-white'
                      }`}>
                        {player.rank}
                      </span>
                      <span className="font-medium text-gray-900">{player.name}</span>
                    </div>
                    <span className="font-bold text-secondary-600">{player.score}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* All-Time Best */}
            <div className="bg-gradient-to-br from-accent-50 to-accent-100 rounded-2xl p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Star className="w-5 h-5 mr-2 text-accent-600" />
                All-Time Best
              </h3>
              <div className="space-y-3">
                {[
                  { name: 'Dr. Sarah Chen', score: 45680, rank: 1 },
                  { name: 'Alex Rodriguez', score: 42340, rank: 2 },
                  { name: 'Marcus Johnson', score: 39890, rank: 3 }
                ].map((player, index) => (
                  <div key={player.rank} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mr-3 ${
                        index === 0 ? 'bg-yellow-500 text-white' :
                        index === 1 ? 'bg-gray-400 text-white' :
                        'bg-orange-500 text-white'
                      }`}>
                        {player.rank}
                      </span>
                      <span className="font-medium text-gray-900">{player.name}</span>
                    </div>
                    <span className="font-bold text-accent-600">{player.score}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gradient-to-r from-accent-50 to-primary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Why Play AI Games?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Have fun while developing essential AI and problem-solving skills
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Mental Agility</h3>
              <p className="text-gray-600">Keep your mind sharp with challenging puzzles and brain teasers</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Skill Development</h3>
              <p className="text-gray-600">Improve your AI, logic, and problem-solving abilities</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-accent-500 to-accent-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Competition</h3>
              <p className="text-gray-600">Compete with others and climb the leaderboards</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-success-500 to-success-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Quick Learning</h3>
              <p className="text-gray-600">Learn AI concepts through interactive gameplay</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
