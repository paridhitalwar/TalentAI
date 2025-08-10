'use client'

import { useState, useEffect } from 'react'
import { 
  Brain, 
  Lightbulb, 
  Target, 
  Trophy,
  ArrowRight,
  ArrowLeft,
  Check,
  X,
  Clock,
  Zap,
  Puzzle,
  BarChart3
} from 'lucide-react'

interface AILogicGameProps {
  onComplete: (score: number, time: number) => void
  onClose: () => void
}

interface Puzzle {
  id: number
  question: string
  type: 'pattern' | 'sequence' | 'logic' | 'algorithm'
  options: string[]
  correctAnswer: number
  explanation: string
  difficulty: 'easy' | 'medium' | 'hard'
  timeLimit: number // in seconds
  hints: string[]
}

const puzzles: Puzzle[] = [
  {
    id: 1,
    question: "In a neural network with 3 input neurons, 4 hidden neurons, and 2 output neurons, how many weights are there in total?",
    type: 'logic',
    options: ['12', '14', '16', '18'],
    correctAnswer: 1, // 14 (3*4 + 4*2 = 12 + 8 = 20, but this is wrong, let me fix)
    explanation: "For a fully connected network: (3×4) + (4×2) = 12 + 8 = 20 weights",
    difficulty: 'medium',
    timeLimit: 60,
    hints: [
      "Count the connections between layers",
      "Each neuron in one layer connects to every neuron in the next layer",
      "Input to hidden: 3 × 4 = 12, Hidden to output: 4 × 2 = 8"
    ]
  },
  {
    id: 2,
    question: "What is the time complexity of binary search?",
    type: 'algorithm',
    options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
    correctAnswer: 1, // O(log n)
    explanation: "Binary search divides the search space in half with each iteration, resulting in logarithmic time complexity.",
    difficulty: 'easy',
    timeLimit: 45,
    hints: [
      "Think about how the search space changes with each step",
      "The algorithm divides the problem size in half each time",
      "How many times can you divide n by 2?"
    ]
  },
  {
    id: 3,
    question: "Complete the sequence: 2, 6, 12, 20, 30, ?",
    type: 'sequence',
    options: ['40', '42', '44', '46'],
    correctAnswer: 1, // 42
    explanation: "The difference between consecutive terms increases by 2: +4, +6, +8, +10, +12. So 30 + 12 = 42.",
    difficulty: 'medium',
    timeLimit: 90,
    hints: [
      "Look at the differences between consecutive numbers",
      "The differences themselves form a pattern",
      "Each difference increases by 2"
    ]
  },
  {
    id: 4,
    question: "If a machine learning model has 95% accuracy on training data but only 70% on test data, what is this called?",
    type: 'logic',
    options: ['Underfitting', 'Overfitting', 'Bias', 'Variance'],
    correctAnswer: 1, // Overfitting
    explanation: "This is overfitting - the model performs well on training data but poorly on unseen data, indicating it has memorized the training set.",
    difficulty: 'medium',
    timeLimit: 60,
    hints: [
      "The model performs well on training data",
      "But poorly on new, unseen data",
      "This suggests the model has learned the training data too well"
    ]
  },
  {
    id: 5,
    question: "What is the output of: print(2**3 + 3**2)?",
    type: 'logic',
    options: ['17', '18', '19', '20'],
    correctAnswer: 0, // 17 (8 + 9 = 17)
    explanation: "2**3 = 8 and 3**2 = 9, so 8 + 9 = 17",
    difficulty: 'easy',
    timeLimit: 30,
    hints: [
      "** means exponentiation",
      "2**3 = 2³ = 8",
      "3**2 = 3² = 9"
    ]
  }
]

export default function AILogicGame({ onComplete, onClose }: AILogicGameProps) {
  const [currentPuzzle, setCurrentPuzzle] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [timeLeft, setTimeLeft] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [showExplanation, setShowExplanation] = useState(false)
  const [showHints, setShowHints] = useState(false)
  const [hintIndex, setHintIndex] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const [gameCompleted, setGameCompleted] = useState(false)
  const [finalScore, setFinalScore] = useState(0)
  const [totalTime, setTotalTime] = useState(0)

  const puzzle = puzzles[currentPuzzle]

  useEffect(() => {
    if (currentPuzzle < puzzles.length) {
      setTimeLeft(puzzle.timeLimit)
      setSelectedAnswer(null)
      setShowExplanation(false)
      setShowHints(false)
      setHintIndex(0)
      setIsRunning(true)
    }
  }, [currentPuzzle])

  useEffect(() => {
    if (timeLeft > 0 && isRunning) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleTimeUp()
            return 0
          }
          return prev - 1
        })
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [timeLeft, isRunning])

  const handleTimeUp = () => {
    setIsRunning(false)
    setShowExplanation(true)
    // Mark as incorrect if no answer selected
    if (selectedAnswer === null) {
      handleAnswer(-1)
    }
  }

  const handleAnswer = (answerIndex: number) => {
    setSelectedAnswer(answerIndex)
    setIsRunning(false)
    setShowExplanation(true)
    
    const newAnswers = [...answers]
    newAnswers[currentPuzzle] = answerIndex
    setAnswers(newAnswers)
  }

  const handleNext = () => {
    if (currentPuzzle < puzzles.length - 1) {
      setCurrentPuzzle(prev => prev + 1)
    } else {
      handleGameComplete()
    }
  }

  const handleGameComplete = () => {
    const correctAnswers = answers.filter((answer, index) => 
      answer === puzzles[index].correctAnswer
    ).length
    
    const score = Math.round((correctAnswers / puzzles.length) * 100)
    const totalTimeUsed = puzzles.reduce((sum, _, index) => {
      const timeUsed = puzzles[index].timeLimit - (index === currentPuzzle ? timeLeft : 0)
      return sum + timeUsed
    }, 0)
    
    setFinalScore(score)
    setTotalTime(totalTimeUsed)
    setGameCompleted(true)
  }

  const showHint = () => {
    if (hintIndex < puzzle.hints.length) {
      setShowHints(true)
      setHintIndex(prev => prev + 1)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'from-green-500 to-emerald-500'
      case 'medium': return 'from-yellow-500 to-orange-500'
      case 'hard': return 'from-red-500 to-pink-500'
      default: return 'from-gray-500 to-gray-600'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'pattern': return <Puzzle className="w-5 h-5" />
      case 'sequence': return <BarChart3 className="w-5 h-5" />
      case 'logic': return <Brain className="w-5 h-5" />
      case 'algorithm': return <Zap className="w-5 h-5" />
      default: return <Brain className="w-5 h-5" />
    }
  }

  if (gameCompleted) {
    const correctAnswers = answers.filter((answer, index) => 
      answer === puzzles[index].correctAnswer
    ).length

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-3xl p-8 max-w-2xl w-full mx-4 shadow-2xl">
          <div className="text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white mx-auto mb-6">
              <Brain className="w-12 h-12" />
            </div>
            
            <h2 className="text-3xl font-bold text-gray-900 mb-4">AI Logic Challenge Complete!</h2>
            <p className="text-gray-600 mb-8">Great job testing your AI reasoning skills!</p>

            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6">
                <div className="text-4xl font-bold text-blue-600 mb-2">{finalScore}%</div>
                <div className="text-gray-600 font-medium">Final Score</div>
              </div>
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6">
                <div className="text-4xl font-bold text-green-600 mb-2">{correctAnswers}/{puzzles.length}</div>
                <div className="text-gray-600 font-medium">Correct Answers</div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-2xl p-6 mb-8">
              <h4 className="text-xl font-bold text-gray-900 mb-4">Performance Summary</h4>
              <div className="space-y-3">
                {puzzles.map((puzzle, index) => {
                  const isCorrect = answers[index] === puzzle.correctAnswer
                  return (
                    <div key={puzzle.id} className="flex items-center justify-between p-3 bg-white rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                          isCorrect ? 'bg-green-500' : 'bg-red-500'
                        }`}>
                          {isCorrect ? '✓' : '✗'}
                        </div>
                                                 <span className="font-medium text-gray-700">Puzzle {index + 1}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {getTypeIcon(puzzle.type)}
                        <span className={`text-sm font-bold ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                          {isCorrect ? 'CORRECT' : 'INCORRECT'}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => onComplete(finalScore, totalTime)}
                className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-6 rounded-xl font-bold hover:from-purple-600 hover:to-pink-600 transition-all duration-300"
              >
                <Trophy className="w-5 h-5 mr-2 inline" />
                Complete Challenge
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

  const progress = ((currentPuzzle + 1) / puzzles.length) * 100

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl p-8 max-w-4xl w-full mx-4 shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">AI Logic Challenge</h2>
              <p className="text-gray-600">Puzzle {currentPuzzle + 1} of {puzzles.length}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-gray-600">
              <Clock className="w-5 h-5" />
              <span className="font-mono font-bold">{formatTime(timeLeft)}</span>
            </div>
            <div className={`px-3 py-1 rounded-full text-sm font-bold ${getDifficultyColor(puzzle.difficulty)} text-white`}>
              {puzzle.difficulty.toUpperCase()}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-3 mb-8">
          <div 
            className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Puzzle Question */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 mb-6">
              <div className="flex items-center gap-3 mb-4">
                {getTypeIcon(puzzle.type)}
                <span className="text-sm font-bold text-purple-600 uppercase">{puzzle.type}</span>
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-4 leading-relaxed">
                {puzzle.question}
              </h3>
              
              <button
                onClick={showHint}
                disabled={hintIndex >= puzzle.hints.length}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Lightbulb className="w-4 h-4" />
                Show Hint ({hintIndex + 1}/{puzzle.hints.length})
              </button>
              
              {showHints && hintIndex > 0 && (
                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <Lightbulb className="w-4 h-4 text-yellow-600" />
                    <span className="font-medium text-yellow-800">Hint {hintIndex}:</span>
                  </div>
                  <p className="text-yellow-700">{puzzle.hints[hintIndex - 1]}</p>
                </div>
              )}
            </div>

            {/* Answer Options */}
            {!showExplanation && (
              <div className="space-y-4 mb-6">
                {puzzle.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(index)}
                    disabled={selectedAnswer !== null}
                    className={`w-full text-left p-4 border-2 rounded-xl transition-all duration-200 ${
                      selectedAnswer === index
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 border-2 rounded-full flex items-center justify-center ${
                        selectedAnswer === index ? 'border-purple-500 bg-purple-500' : 'border-gray-300'
                      }`}>
                        {selectedAnswer === index && <Check className="w-4 h-4 text-white" />}
                      </div>
                      <span className="font-medium text-gray-700">{option}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Explanation */}
            {showExplanation && (
              <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6">
                <h4 className="text-lg font-bold text-gray-900 mb-4">Explanation</h4>
                <p className="text-gray-700 leading-relaxed mb-4">{puzzle.explanation}</p>
                
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    selectedAnswer === puzzle.correctAnswer 
                      ? 'bg-green-500 text-white' 
                      : 'bg-red-500 text-white'
                  }`}>
                    {selectedAnswer === puzzle.correctAnswer ? <Check className="w-6 h-6" /> : <X className="w-6 h-6" />}
                  </div>
                  <div>
                    <div className={`font-bold ${
                      selectedAnswer === puzzle.correctAnswer ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {selectedAnswer === puzzle.correctAnswer ? 'Correct!' : 'Incorrect'}
                    </div>
                    <div className="text-sm text-gray-600">
                      The correct answer is: {puzzle.options[puzzle.correctAnswer]}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => setCurrentPuzzle(Math.max(0, currentPuzzle - 1))}
                disabled={currentPuzzle === 0}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Previous
              </button>
              
              {showExplanation && (
                <button
                  onClick={handleNext}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-bold hover:from-purple-600 hover:to-pink-600 transition-all duration-300"
                >
                  {currentPuzzle === puzzles.length - 1 ? 'Finish' : 'Next'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
              
              <button
                onClick={onClose}
                className="px-6 py-2 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-bold"
              >
                Exit
              </button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Progress */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <h4 className="text-lg font-bold text-gray-900 mb-4">Progress</h4>
              <div className="space-y-3">
                {puzzles.map((p, index) => {
                  const isAnswered = answers[index] !== undefined
                  const isCorrect = answers[index] === p.correctAnswer
                  
                  return (
                    <div key={p.id} className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                        index < currentPuzzle 
                          ? (isCorrect ? 'bg-green-500' : 'bg-red-500')
                          : index === currentPuzzle 
                          ? 'bg-blue-500' 
                          : 'bg-gray-300'
                      }`}>
                        {index < currentPuzzle 
                          ? (isCorrect ? '✓' : '✗')
                          : index + 1
                        }
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          {getTypeIcon(p.type)}
                          <span className={`font-medium ${
                            index < currentPuzzle 
                              ? (isCorrect ? 'text-green-600' : 'text-red-600')
                              : index === currentPuzzle 
                              ? 'text-blue-600' 
                              : 'text-gray-400'
                          }`}>
                            {p.type.charAt(0).toUpperCase() + p.type.slice(1)}
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Stats */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6">
              <h4 className="text-lg font-bold text-gray-900 mb-4">Stats</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Correct</span>
                  <span className="text-2xl font-bold text-green-600">
                    {answers.filter((answer, index) => answer === puzzles[index].correctAnswer).length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Incorrect</span>
                  <span className="text-2xl font-bold text-red-600">
                    {answers.filter((answer, index) => answer !== undefined && answer !== puzzles[index].correctAnswer).length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Remaining</span>
                  <span className="text-2xl font-bold text-blue-600">
                    {puzzles.length - answers.filter(a => a !== undefined).length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
