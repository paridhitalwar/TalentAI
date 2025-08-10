'use client'

import { useState } from 'react'
import { 
  Gamepad2, 
  Brain, 
  Target, 
  Trophy, 
  Star, 
  Clock, 
  Users, 
  Zap,
  Play,
  BarChart3,
  Award,
  CheckCircle,
  ArrowRight,
  Lock,
  Unlock,
  Code
} from 'lucide-react'
import Header from '@/components/Header'

import CodeChallengeGame from '@/components/CodeChallengeGame'
import PersonalityGame from '@/components/PersonalityGame'
import CodeBattleGame from '@/components/CodeBattleGame'
import AILogicGame from '@/components/AILogicGame'

const games = [
  {
    id: 1,
    title: 'Code Challenge',
    description: 'Solve coding problems and improve your technical skills',
    category: 'Technical',
    difficulty: 'Medium',
    duration: '30 min',
    players: 1250,
    rating: 4.8,
    icon: Gamepad2,
    color: 'from-purple-500 to-pink-500',
    bgColor: 'from-purple-50 to-pink-50',
    borderColor: 'border-purple-200',
    unlocked: true,
    completed: false,
    score: null
  },
  {
    id: 2,
    title: 'Personality Test',
    description: 'Discover your work style and team compatibility',
    category: 'Assessment',
    difficulty: 'Easy',
    duration: '15 min',
    players: 890,
    rating: 4.6,
    icon: Brain,
    color: 'from-blue-500 to-indigo-500',
    bgColor: 'from-blue-50 to-indigo-50',
    borderColor: 'border-blue-200',
    unlocked: true,
    completed: true,
    score: 85
  },
  {
    id: 3,
    title: 'Problem Solving',
    description: 'Test your analytical and problem-solving abilities',
    category: 'Cognitive',
    difficulty: 'Hard',
    duration: '45 min',
    players: 650,
    rating: 4.9,
    icon: Target,
    color: 'from-green-500 to-emerald-500',
    bgColor: 'from-green-50 to-emerald-50',
    borderColor: 'border-green-200',
    unlocked: false,
    completed: false,
    score: null
  },
  {
    id: 4,
    title: 'AI Logic Puzzle',
    description: 'Solve AI-related logic puzzles and brain teasers',
    category: 'Technical',
    difficulty: 'Medium',
    duration: '25 min',
    players: 420,
    rating: 4.7,
    icon: Brain,
    color: 'from-orange-500 to-red-500',
    bgColor: 'from-orange-50 to-red-50',
    borderColor: 'border-orange-200',
    unlocked: true,
    completed: false,
    score: null
  },
  {
    id: 5,
    title: 'Team Collaboration',
    description: 'Test your teamwork and communication skills',
    category: 'Soft Skills',
    difficulty: 'Easy',
    duration: '20 min',
    players: 780,
    rating: 4.5,
    icon: Users,
    color: 'from-teal-500 to-cyan-500',
    bgColor: 'from-teal-50 to-cyan-50',
    borderColor: 'border-teal-200',
    unlocked: false,
    completed: false,
    score: null
  },
  {
    id: 6,
    title: 'Speed Coding',
    description: 'Race against time to solve coding challenges',
    category: 'Technical',
    difficulty: 'Hard',
    duration: '15 min',
    players: 320,
    rating: 4.8,
    icon: Zap,
    color: 'from-yellow-500 to-orange-500',
    bgColor: 'from-yellow-50 to-orange-50',
    borderColor: 'border-yellow-200',
    unlocked: false,
    completed: false,
    score: null
  }
]

const achievements = [
  {
    id: 1,
    title: 'First Steps',
    description: 'Complete your first game',
    icon: Trophy,
    unlocked: true,
    progress: 100
  },
  {
    id: 2,
    title: 'Speed Demon',
    description: 'Complete 3 games under time pressure',
    icon: Clock,
    unlocked: false,
    progress: 33
  },
  {
    id: 3,
    title: 'Problem Solver',
    description: 'Solve 10 difficult problems',
    icon: Target,
    unlocked: false,
    progress: 60
  },
  {
    id: 4,
    title: 'Perfect Score',
    description: 'Get 100% on any game',
    icon: Star,
    unlocked: false,
    progress: 0
  }
]

export default function GamesPage() {
  const [selectedGame, setSelectedGame] = useState<typeof games[0] | null>(null)
  const [activeTab, setActiveTab] = useState('games')
  const [showCodeGame, setShowCodeGame] = useState(false)
  const [showPersonalityGame, setShowPersonalityGame] = useState(false)
  const [showCodeBattleGame, setShowCodeBattleGame] = useState(false)
  const [showAILogicGame, setShowAILogicGame] = useState(false)

  const completedGames = games.filter(game => game.completed).length
  const totalScore = games.reduce((sum, game) => sum + (game.score || 0), 0)
  const averageScore = completedGames > 0 ? Math.round(totalScore / completedGames) : 0

  const handlePlayGame = (game: typeof games[0]) => {
    if (game.unlocked) {
      if (game.title === 'Code Challenge') {
        setShowCodeGame(true)
      } else if (game.title === 'Personality Test') {
        setShowPersonalityGame(true)
      } else if (game.title === 'Problem Solving') {
        setShowCodeBattleGame(true)
      } else if (game.title === 'AI Logic Puzzle') {
        setShowAILogicGame(true)
      } else {
        setSelectedGame(game)
        // Here you would typically navigate to the actual game
        console.log(`Starting game: ${game.title}`)
      }
    }
  }

  const handleGameComplete = (score: number, time: number, gameType?: string) => {
    // Update the game score in the games array
    const updatedGames = games.map(game => {
      if (gameType === 'Code Challenge' && game.title === 'Code Challenge') {
        return { ...game, completed: true, score: score }
      } else if (gameType === 'Personality Assessment' && game.title === 'Personality Test') {
        return { ...game, completed: true, score: score }
      } else if (gameType === 'Code Battle' && game.title === 'Problem Solving') {
        return { ...game, completed: true, score: score }
      } else if (gameType === 'AI Logic Puzzle' && game.title === 'AI Logic Puzzle') {
        return { ...game, completed: true, score: score }
      }
      return game
    })
    // In a real app, you'd save this to the backend
    console.log(`Game completed with score: ${score}% in ${time} seconds`)
  }

  const handlePersonalityComplete = (score: number, personality: string) => {
    handleGameComplete(score, 0, 'Personality Assessment')
    console.log(`Personality assessment completed: ${personality} personality`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-purple-600 via-pink-600 to-indigo-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-white/10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Gamepad2 className="w-8 h-8 text-yellow-400 mr-3 animate-pulse" />
              <h1 className="text-4xl md:text-6xl font-black text-white mb-6 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                AI Assessment Games
              </h1>
            </div>
            <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto font-medium">
              Test your skills through interactive games and challenges. Improve your profile and discover your strengths.
            </p>
            
                          <div className="flex justify-center gap-4">
                <button 
                  onClick={() => setActiveTab('games')}
                  className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-8 py-4 rounded-2xl hover:from-yellow-500 hover:to-orange-600 transition-all duration-300 font-bold text-lg shadow-2xl hover:shadow-yellow-500/25 flex items-center transform hover:scale-105"
                >
                  <Play className="w-6 h-6 mr-3" />
                  Start Playing
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
                          { id: 'games', label: 'Games', icon: Gamepad2 },
            { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
            { id: 'achievements', label: 'Achievements', icon: Award },
            { id: 'stats', label: 'Statistics', icon: BarChart3 }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-bold transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg transform scale-105'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-white/60'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === 'games' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {games.map((game) => (
                <div
                  key={game.id}
                  className={`bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border ${game.borderColor} hover:shadow-2xl transition-all duration-300 transform hover:scale-105 ${
                    !game.unlocked ? 'opacity-60' : ''
                  }`}
                >
                  <div className={`h-32 bg-gradient-to-br ${game.bgColor} rounded-t-3xl flex items-center justify-center relative overflow-hidden`}>
                    <div className={`absolute inset-0 bg-gradient-to-br ${game.color} opacity-20`}></div>
                    <div className={`w-16 h-16 bg-gradient-to-br ${game.color} rounded-full flex items-center justify-center text-white relative z-10 shadow-2xl`}>
                      <game.icon className="w-8 h-8" />
                    </div>
                    {!game.unlocked && (
                      <div className="absolute top-4 right-4">
                        <Lock className="w-6 h-6 text-gray-400" />
                      </div>
                    )}
                    {game.completed && (
                      <div className="absolute top-4 left-4">
                        <CheckCircle className="w-6 h-6 text-green-500" />
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-bold text-gray-900">{game.title}</h3>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-medium text-gray-600">{game.rating}</span>
                      </div>
                    </div>

                    <p className="text-gray-600 mb-4 text-sm">{game.description}</p>

                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                      <span className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {game.duration}
                      </span>
                      <span className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        {game.players}
                      </span>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        game.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                        game.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {game.difficulty}
                      </span>
                      <span className="text-sm text-gray-500">{game.category}</span>
                    </div>

                    {game.completed && game.score && (
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-gray-600">Score</span>
                          <span className="font-bold text-green-600">{game.score}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full"
                            style={{ width: `${game.score}%` }}
                          ></div>
                        </div>
                      </div>
                    )}

                    <button
                      onClick={() => handlePlayGame(game)}
                      disabled={!game.unlocked}
                      className={`w-full py-3 px-4 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 ${
                        game.unlocked
                          ? `bg-gradient-to-r ${game.color} text-white hover:shadow-lg transform hover:scale-105`
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      {game.unlocked ? (
                        <>
                          <Play className="w-4 h-4" />
                          {game.completed ? 'Play Again' : 'Start Game'}
                        </>
                      ) : (
                        <>
                          <Lock className="w-4 h-4" />
                          Locked
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'achievements' && (
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20">
              <div className="p-8 border-b border-gray-100">
                <h2 className="text-3xl font-black text-gray-900">Achievements</h2>
                <p className="text-gray-600 font-medium">Unlock badges and track your progress</p>
              </div>
              
              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {achievements.map((achievement) => (
                    <div
                      key={achievement.id}
                      className={`p-6 rounded-2xl border-2 transition-all duration-300 ${
                        achievement.unlocked
                          ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200 shadow-lg'
                          : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto ${
                        achievement.unlocked
                          ? 'bg-gradient-to-br from-yellow-500 to-orange-500 text-white'
                          : 'bg-gray-300 text-gray-500'
                      }`}>
                        <achievement.icon className="w-8 h-8" />
                      </div>
                      
                      <h3 className={`text-lg font-bold text-center mb-2 ${
                        achievement.unlocked ? 'text-gray-900' : 'text-gray-500'
                      }`}>
                        {achievement.title}
                      </h3>
                      
                      <p className={`text-sm text-center mb-4 ${
                        achievement.unlocked ? 'text-gray-600' : 'text-gray-400'
                      }`}>
                        {achievement.description}
                      </p>

                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${
                            achievement.unlocked
                              ? 'bg-gradient-to-r from-yellow-500 to-orange-500'
                              : 'bg-gray-300'
                          }`}
                          style={{ width: `${achievement.progress}%` }}
                        ></div>
                      </div>
                      
                      <div className="text-center mt-2">
                        <span className={`text-xs font-medium ${
                          achievement.unlocked ? 'text-green-600' : 'text-gray-500'
                        }`}>
                          {achievement.progress}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'leaderboard' && (
            <div className="space-y-8">
              {/* Overall Leaderboard */}
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
                <h2 className="text-3xl font-black text-gray-900 mb-6">Global Leaderboard</h2>
                <div className="space-y-4">
                  {[
                    { rank: 1, name: 'Alex Johnson', score: 2850, games: 12, avatar: 'AJ', badge: '🏆' },
                    { rank: 2, name: 'Sarah Chen', score: 2720, games: 11, avatar: 'SC', badge: '🥈' },
                    { rank: 3, name: 'Mike Rodriguez', score: 2580, games: 10, avatar: 'MR', badge: '🥉' },
                    { rank: 4, name: 'Emily Davis', score: 2450, games: 9, avatar: 'ED', badge: '4' },
                    { rank: 5, name: 'David Kim', score: 2320, games: 8, avatar: 'DK', badge: '5' },
                    { rank: 6, name: 'Lisa Wang', score: 2180, games: 7, avatar: 'LW', badge: '6' },
                    { rank: 7, name: 'James Wilson', score: 2050, games: 6, avatar: 'JW', badge: '7' },
                    { rank: 8, name: 'Maria Garcia', score: 1920, games: 5, avatar: 'MG', badge: '8' },
                    { rank: 9, name: 'Tom Anderson', score: 1780, games: 4, avatar: 'TA', badge: '9' },
                    { rank: 10, name: 'Anna Lee', score: 1650, games: 3, avatar: 'AL', badge: '10' }
                  ].map((player, index) => (
                    <div key={player.rank} className={`flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 ${
                      index < 3 ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200' : 'bg-gray-50 hover:bg-gray-100'
                    }`}>
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg ${
                          index === 0 ? 'bg-gradient-to-br from-yellow-400 to-orange-500' :
                          index === 1 ? 'bg-gradient-to-br from-gray-400 to-gray-500' :
                          index === 2 ? 'bg-gradient-to-br from-orange-400 to-red-500' :
                          'bg-gradient-to-br from-blue-500 to-indigo-500'
                        }`}>
                          {player.badge}
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900">{player.name}</h3>
                          <p className="text-sm text-gray-600">{player.games} games completed</p>
                        </div>
                      </div>
                      <div className="ml-auto text-right">
                        <div className="text-2xl font-black text-gray-900">{player.score}</div>
                        <div className="text-sm text-gray-600">points</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Game-Specific Leaderboards */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6">
                  <h3 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-2">
                    <Gamepad2 className="w-5 h-5 text-purple-600" />
                    Code Challenge Top Players
                  </h3>
                  <div className="space-y-3">
                    {[
                      { name: 'Alex Johnson', score: 95, time: '12:30' },
                      { name: 'Sarah Chen', score: 92, time: '14:45' },
                      { name: 'Mike Rodriguez', score: 88, time: '16:20' }
                    ].map((player, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                            index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-500' : 'bg-orange-500'
                          }`}>
                            {index + 1}
                          </div>
                          <span className="font-medium text-gray-700">{player.name}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-gray-900">{player.score}%</div>
                          <div className="text-xs text-gray-600">{player.time}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6">
                  <h3 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-2">
                    <Brain className="w-5 h-5 text-blue-600" />
                    Personality Test Leaders
                  </h3>
                  <div className="space-y-3">
                    {[
                      { name: 'Emily Davis', score: 98, personality: 'Analytical' },
                      { name: 'David Kim', score: 95, personality: 'Creative' },
                      { name: 'Lisa Wang', score: 92, personality: 'Collaborative' }
                    ].map((player, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                            index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-500' : 'bg-orange-500'
                          }`}>
                            {index + 1}
                          </div>
                          <span className="font-medium text-gray-700">{player.name}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-gray-900">{player.score}%</div>
                          <div className="text-xs text-gray-600">{player.personality}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'stats' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Stats Cards */}
              <div className="space-y-6">
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/20">
                  <h3 className="text-xl font-black text-gray-900 mb-4">Game Statistics</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 font-medium">Games Completed</span>
                      <span className="text-3xl font-black text-purple-600">{completedGames}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 font-medium">Average Score</span>
                      <span className="text-3xl font-black text-green-600">{averageScore}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 font-medium">Total Play Time</span>
                      <span className="text-3xl font-black text-blue-600">2.5h</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/20">
                  <h3 className="text-xl font-black text-gray-900 mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-gray-600">Completed Personality Test</span>
                      <span className="text-gray-400">2h ago</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-gray-600">Started Code Challenge</span>
                      <span className="text-gray-400">1d ago</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span className="text-gray-600">Unlocked new achievement</span>
                      <span className="text-gray-400">3d ago</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress Chart */}
              <div className="lg:col-span-2">
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/20">
                  <h3 className="text-xl font-black text-gray-900 mb-4">Skill Progress</h3>
                  <div className="space-y-4">
                    {[
                      { skill: 'Problem Solving', progress: 75, color: 'from-blue-500 to-indigo-500' },
                      { skill: 'Technical Skills', progress: 60, color: 'from-purple-500 to-pink-500' },
                      { skill: 'Communication', progress: 85, color: 'from-green-500 to-emerald-500' },
                      { skill: 'Teamwork', progress: 45, color: 'from-orange-500 to-red-500' }
                    ].map((item, index) => (
                      <div key={index}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-gray-600 font-medium">{item.skill}</span>
                          <span className="font-bold text-gray-900">{item.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div 
                            className={`bg-gradient-to-r ${item.color} h-3 rounded-full transition-all duration-300`}
                            style={{ width: `${item.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {showCodeGame && (
        <CodeChallengeGame
          onComplete={(score, time) => handleGameComplete(score, time, 'Code Challenge')}
          onClose={() => setShowCodeGame(false)}
        />
      )}
      {showPersonalityGame && (
        <PersonalityGame
          onComplete={handlePersonalityComplete}
          onClose={() => setShowPersonalityGame(false)}
        />
      )}
      {showCodeBattleGame && (
        <CodeBattleGame
          onComplete={(score, time) => handleGameComplete(score, time, 'Code Battle')}
          onClose={() => setShowCodeBattleGame(false)}
        />
      )}
      {showAILogicGame && (
        <AILogicGame
          onComplete={(score, time) => handleGameComplete(score, time, 'AI Logic Puzzle')}
          onClose={() => setShowAILogicGame(false)}
        />
      )}
    </div>
  )
}
