'use client'

import { useState, useEffect } from 'react'
import { 
  Brain, 
  Heart, 
  Users, 
  Target, 
  Trophy,
  ArrowRight,
  ArrowLeft,
  Check,
  X,
  Clock,
  BarChart3,
  Zap
} from 'lucide-react'

interface PersonalityGameProps {
  onComplete: (score: number, personality: string) => void
  onClose: () => void
}

interface Question {
  id: number
  question: string
  options: {
    text: string
    personality: 'analytical' | 'creative' | 'collaborative' | 'driven'
    score: number
  }[]
}

const questions: Question[] = [
  {
    id: 1,
    question: "When faced with a complex problem, you prefer to:",
    options: [
      { text: "Analyze data and create a systematic approach", personality: 'analytical', score: 4 },
      { text: "Brainstorm creative solutions and think outside the box", personality: 'creative', score: 4 },
      { text: "Collaborate with team members to find the best solution", personality: 'collaborative', score: 4 },
      { text: "Take immediate action and learn from the results", personality: 'driven', score: 4 }
    ]
  },
  {
    id: 2,
    question: "In a team setting, you typically:",
    options: [
      { text: "Focus on logical reasoning and evidence-based decisions", personality: 'analytical', score: 4 },
      { text: "Bring innovative ideas and creative perspectives", personality: 'creative', score: 4 },
      { text: "Ensure everyone's voice is heard and build consensus", personality: 'collaborative', score: 4 },
      { text: "Push for quick decisions and rapid execution", personality: 'driven', score: 4 }
    ]
  },
  {
    id: 3,
    question: "Your ideal work environment is:",
    options: [
      { text: "Structured with clear processes and data-driven decisions", personality: 'analytical', score: 4 },
      { text: "Flexible and open to experimentation and new ideas", personality: 'creative', score: 4 },
      { text: "Supportive and team-oriented with strong relationships", personality: 'collaborative', score: 4 },
      { text: "Fast-paced and results-oriented with clear goals", personality: 'driven', score: 4 }
    ]
  },
  {
    id: 4,
    question: "When learning something new, you prefer:",
    options: [
      { text: "Understanding the underlying principles and theory", personality: 'analytical', score: 4 },
      { text: "Exploring different approaches and experimenting", personality: 'creative', score: 4 },
      { text: "Learning through discussion and collaboration", personality: 'collaborative', score: 4 },
      { text: "Hands-on practice and immediate application", personality: 'driven', score: 4 }
    ]
  },
  {
    id: 5,
    question: "Your biggest strength in problem-solving is:",
    options: [
      { text: "Logical analysis and systematic thinking", personality: 'analytical', score: 4 },
      { text: "Creative thinking and innovative solutions", personality: 'creative', score: 4 },
      { text: "Building consensus and leveraging team strengths", personality: 'collaborative', score: 4 },
      { text: "Quick decision-making and execution", personality: 'driven', score: 4 }
    ]
  }
]

const personalityTypes = {
  analytical: {
    name: 'Analytical Thinker',
    description: 'You excel at logical reasoning, data analysis, and systematic problem-solving. You prefer structured approaches and evidence-based decisions.',
    strengths: ['Logical thinking', 'Data analysis', 'Systematic approach', 'Attention to detail'],
    color: 'from-blue-500 to-indigo-600',
    icon: Brain
  },
  creative: {
    name: 'Creative Innovator',
    description: 'You thrive on innovation, creative thinking, and exploring new possibilities. You bring fresh perspectives and out-of-the-box solutions.',
    strengths: ['Innovation', 'Creative thinking', 'Adaptability', 'Vision'],
    color: 'from-purple-500 to-pink-600',
    icon: Zap
  },
  collaborative: {
    name: 'Team Collaborator',
    description: 'You excel at building relationships, fostering teamwork, and creating inclusive environments. You bring people together to achieve goals.',
    strengths: ['Team building', 'Communication', 'Empathy', 'Leadership'],
    color: 'from-green-500 to-emerald-600',
    icon: Users
  },
  driven: {
    name: 'Results Driver',
    description: 'You are goal-oriented, action-focused, and excel at execution. You drive results and push for rapid progress and achievement.',
    strengths: ['Goal orientation', 'Execution', 'Motivation', 'Efficiency'],
    color: 'from-orange-500 to-red-600',
    icon: Target
  }
}

export default function PersonalityGame({ onComplete, onClose }: PersonalityGameProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const [timeLeft, setTimeLeft] = useState(300) // 5 minutes
  const [showResults, setShowResults] = useState(false)
  const [personalityScores, setPersonalityScores] = useState({
    analytical: 0,
    creative: 0,
    collaborative: 0,
    driven: 0
  })

  useEffect(() => {
    if (timeLeft > 0 && !showResults) {
      const timer = setInterval(() => {
        setTimeLeft(prev => prev - 1)
      }, 1000)
      return () => clearInterval(timer)
    } else if (timeLeft === 0 && !showResults) {
      handleComplete()
    }
  }, [timeLeft, showResults])

  const handleAnswer = (answerIndex: number) => {
    const newAnswers = [...answers]
    newAnswers[currentQuestion] = answerIndex
    setAnswers(newAnswers)

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      handleComplete()
    }
  }

  const handleComplete = () => {
    // Calculate personality scores
    const scores = { analytical: 0, creative: 0, collaborative: 0, driven: 0 }
    
    answers.forEach((answerIndex, questionIndex) => {
      if (answerIndex !== undefined) {
        const question = questions[questionIndex]
        const selectedOption = question.options[answerIndex]
        scores[selectedOption.personality] += selectedOption.score
      }
    })

    setPersonalityScores(scores)
    setShowResults(true)
  }

  const getDominantPersonality = () => {
    const maxScore = Math.max(...Object.values(personalityScores))
    const dominant = Object.entries(personalityScores).find(([_, score]) => score === maxScore)
    return dominant ? dominant[0] as keyof typeof personalityTypes : 'analytical'
  }

  const calculateScore = () => {
    const totalPossible = questions.length * 4
    const totalAnswered = answers.filter(a => a !== undefined).length
    const completionRate = (totalAnswered / questions.length) * 100
    return Math.round(completionRate)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (showResults) {
    const dominantPersonality = getDominantPersonality()
    const personality = personalityTypes[dominantPersonality]
    const IconComponent = personality.icon
    const score = calculateScore()

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-3xl p-8 max-w-2xl w-full mx-4 shadow-2xl max-h-[90vh] overflow-y-auto">
          <div className="text-center">
            <div className={`w-24 h-24 bg-gradient-to-br ${personality.color} rounded-full flex items-center justify-center text-white mx-auto mb-6`}>
              <IconComponent className="w-12 h-12" />
            </div>
            
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Personality Assessment Complete!</h2>
            <p className="text-gray-600 mb-8">Here are your results:</p>

            {/* Score */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 mb-8">
              <div className="text-4xl font-bold text-blue-600 mb-2">{score}%</div>
              <div className="text-gray-600 font-medium">Completion Score</div>
            </div>

            {/* Personality Type */}
            <div className={`bg-gradient-to-r ${personality.color} text-white rounded-2xl p-6 mb-8`}>
              <h3 className="text-2xl font-bold mb-3">{personality.name}</h3>
              <p className="text-white/90 leading-relaxed">{personality.description}</p>
            </div>

            {/* Strengths */}
            <div className="bg-gray-50 rounded-2xl p-6 mb-8">
              <h4 className="text-xl font-bold text-gray-900 mb-4">Your Key Strengths</h4>
              <div className="grid grid-cols-2 gap-3">
                {personality.strengths.map((strength, index) => (
                  <div key={index} className="flex items-center gap-2 bg-white rounded-xl p-3">
                    <Check className="w-4 h-4 text-green-600" />
                    <span className="font-medium text-gray-700">{strength}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Detailed Scores */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-8">
              <h4 className="text-xl font-bold text-gray-900 mb-4">Detailed Scores</h4>
              <div className="space-y-4">
                {Object.entries(personalityScores).map(([type, score]) => {
                  const typeInfo = personalityTypes[type as keyof typeof personalityTypes]
                  const Icon = typeInfo.icon
                  const percentage = Math.round((score / (questions.length * 4)) * 100)
                  
                  return (
                    <div key={type} className="flex items-center gap-4">
                      <div className={`w-10 h-10 bg-gradient-to-br ${typeInfo.color} rounded-full flex items-center justify-center`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-gray-700">{typeInfo.name}</span>
                          <span className="text-sm font-bold text-gray-600">{percentage}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`bg-gradient-to-r ${typeInfo.color} h-2 rounded-full transition-all duration-500`}
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => onComplete(score, dominantPersonality)}
                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 px-6 rounded-xl font-bold hover:from-green-600 hover:to-emerald-600 transition-all duration-300"
              >
                <Trophy className="w-5 h-5 mr-2 inline" />
                Complete Assessment
              </button>
              <button
                onClick={onClose}
                className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const currentQ = questions[currentQuestion]
  const progress = ((currentQuestion + 1) / questions.length) * 100

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl p-8 max-w-2xl w-full mx-4 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Personality Assessment</h2>
              <p className="text-gray-600">Question {currentQuestion + 1} of {questions.length}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-gray-600">
            <Clock className="w-5 h-5" />
            <span className="font-mono font-bold">{formatTime(timeLeft)}</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-3 mb-8">
          <div 
            className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        {/* Question */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6 leading-relaxed">
            {currentQ.question}
          </h3>
          
          <div className="space-y-4">
            {currentQ.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(index)}
                className="w-full text-left p-4 border-2 border-gray-200 rounded-xl hover:border-purple-300 hover:bg-purple-50 transition-all duration-200 group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 border-2 border-gray-300 rounded-full group-hover:border-purple-500 transition-colors"></div>
                  <span className="font-medium text-gray-700">{option.text}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
            disabled={currentQuestion === 0}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Previous
          </button>
          
          <button
            onClick={onClose}
            className="px-6 py-2 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-bold"
          >
            Exit
          </button>
        </div>
      </div>
    </div>
  )
}
