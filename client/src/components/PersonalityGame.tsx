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
  X
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
    question: "When faced with a complex problem, I prefer to:",
    options: [
      { text: "Analyze all the data systematically", personality: "analytical", score: 3 },
      { text: "Think outside the box for creative solutions", personality: "creative", score: 3 },
      { text: "Collaborate with others to find the best approach", personality: "collaborative", score: 3 },
      { text: "Take immediate action to solve it quickly", personality: "driven", score: 3 }
    ]
  },
  {
    id: 2,
    question: "In a team setting, I typically:",
    options: [
      { text: "Focus on facts and logical reasoning", personality: "analytical", score: 3 },
      { text: "Bring innovative ideas and perspectives", personality: "creative", score: 3 },
      { text: "Ensure everyone feels heard and included", personality: "collaborative", score: 3 },
      { text: "Push the team to achieve ambitious goals", personality: "driven", score: 3 }
    ]
  },
  {
    id: 3,
    question: "When working on a project, I'm most motivated by:",
    options: [
      { text: "Understanding the underlying principles", personality: "analytical", score: 3 },
      { text: "Creating something unique and original", personality: "creative", score: 3 },
      { text: "Building strong relationships with colleagues", personality: "collaborative", score: 3 },
      { text: "Achieving measurable results and success", personality: "driven", score: 3 }
    ]
  },
  {
    id: 4,
    question: "My ideal work environment is:",
    options: [
      { text: "Quiet and focused, with clear processes", personality: "analytical", score: 3 },
      { text: "Dynamic and inspiring, with room for experimentation", personality: "creative", score: 3 },
      { text: "Supportive and team-oriented, with open communication", personality: "collaborative", score: 3 },
      { text: "Fast-paced and results-driven, with clear goals", personality: "driven", score: 3 }
    ]
  },
  {
    id: 5,
    question: "When making decisions, I rely most on:",
    options: [
      { text: "Data, research, and logical analysis", personality: "analytical", score: 3 },
      { text: "Intuition, creativity, and innovative thinking", personality: "creative", score: 3 },
      { text: "Team input, consensus, and shared values", personality: "collaborative", score: 3 },
      { text: "Results, efficiency, and achieving objectives", personality: "driven", score: 3 }
    ]
  }
]

export default function PersonalityGame({ onComplete, onClose }: PersonalityGameProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [gameCompleted, setGameCompleted] = useState(false)
  const [personalityScores, setPersonalityScores] = useState({
    analytical: 0,
    creative: 0,
    collaborative: 0,
    driven: 0
  })

  const currentQuestion = questions[currentQuestionIndex]

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex)
  }

  const handleNextQuestion = () => {
    if (selectedAnswer !== null) {
      const newAnswers = { ...answers, [currentQuestion.id]: selectedAnswer }
      setAnswers(newAnswers)

      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1)
        setSelectedAnswer(null)
      } else {
        calculatePersonality(newAnswers)
        setGameCompleted(true)
      }
    }
  }

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1)
      setSelectedAnswer(answers[questions[currentQuestionIndex - 1].id] || null)
    }
  }

  const calculatePersonality = (finalAnswers: Record<number, number>) => {
    const scores = { analytical: 0, creative: 0, collaborative: 0, driven: 0 }
    
    Object.entries(finalAnswers).forEach(([questionId, answerIndex]) => {
      const question = questions.find(q => q.id === parseInt(questionId))
      if (question) {
        const selectedOption = question.options[answerIndex]
        scores[selectedOption.personality] += selectedOption.score
      }
    })

    setPersonalityScores(scores)
    
    // Determine dominant personality
    const dominantPersonality = Object.entries(scores).reduce((a, b) => 
      scores[a[0] as keyof typeof scores] > scores[b[0] as keyof typeof scores] ? a : b
    )[0]

    const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0)
    onComplete(totalScore, dominantPersonality)
  }

  const getPersonalityDescription = (personality: string) => {
    const descriptions = {
      analytical: "You're a logical thinker who excels at problem-solving through systematic analysis and data-driven decision making.",
      creative: "You're an innovative mind who thrives on thinking outside the box and bringing fresh perspectives to challenges.",
      collaborative: "You're a team player who excels at building relationships and fostering cooperation to achieve shared goals.",
      driven: "You're a results-oriented achiever who focuses on efficiency and pushing boundaries to reach ambitious objectives."
    }
    return descriptions[personality as keyof typeof descriptions] || ""
  }

  const getPersonalityColor = (personality: string) => {
    const colors = {
      analytical: "from-blue-500 to-indigo-600",
      creative: "from-purple-500 to-pink-600",
      collaborative: "from-green-500 to-emerald-600",
      driven: "from-orange-500 to-red-600"
    }
    return colors[personality as keyof typeof colors] || "from-gray-500 to-gray-600"
  }

  if (gameCompleted) {
    const dominantPersonality = Object.entries(personalityScores).reduce((a, b) => 
      personalityScores[a[0] as keyof typeof personalityScores] > personalityScores[b[0] as keyof typeof personalityScores] ? a : b
    )[0]

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-3xl p-8 max-w-2xl w-full mx-4 shadow-2xl">
          <div className="text-center">
            <div className={`w-20 h-20 bg-gradient-to-br ${getPersonalityColor(dominantPersonality)} rounded-full flex items-center justify-center mx-auto mb-6`}>
              <Brain className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Personality Assessment Complete!</h2>
            
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-2 capitalize">{dominantPersonality} Personality</h3>
              <p className="text-gray-600">{getPersonalityDescription(dominantPersonality)}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              {Object.entries(personalityScores).map(([personality, score]) => (
                <div key={personality} className="text-center">
                  <div className={`text-lg font-bold capitalize ${personality === dominantPersonality ? 'text-blue-600' : 'text-gray-600'}`}>
                    {personality}
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{score}</div>
                </div>
              ))}
            </div>

            <button
              onClick={onClose}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-3 px-6 rounded-xl font-bold hover:from-blue-600 hover:to-indigo-600 transition-all duration-300"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl p-8 max-w-2xl w-full mx-4 shadow-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Personality Assessment</h2>
          <p className="text-gray-600">Question {currentQuestionIndex + 1} of {questions.length}</p>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-8">
          <div 
            className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
          ></div>
        </div>

        {/* Question */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">
            {currentQuestion.question}
          </h3>
          
          {/* Answer Options */}
          <div className="space-y-4">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                className={`w-full p-4 text-left rounded-xl border-2 transition-all duration-200 ${
                  selectedAnswer === index
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    selectedAnswer === index
                      ? 'border-purple-500 bg-purple-500'
                      : 'border-gray-300'
                  }`}>
                    {selectedAnswer === index && <Check className="w-4 h-4 text-white" />}
                  </div>
                  <span className="font-medium">{option.text}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <button
            onClick={handlePreviousQuestion}
            disabled={currentQuestionIndex === 0}
            className="flex items-center gap-2 px-6 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Previous
          </button>
          
          <button
            onClick={handleNextQuestion}
            disabled={selectedAnswer === null}
            className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-bold hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
          >
            {currentQuestionIndex === questions.length - 1 ? 'Finish' : 'Next'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
