'use client'

import { useState, useEffect } from 'react'
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Check, 
  X, 
  Timer, 
  Trophy,
  Code,
  Lightbulb,
  Target
} from 'lucide-react'

interface CodeChallengeGameProps {
  onComplete: (score: number, time: number) => void
  onClose: () => void
}

interface Question {
  id: number
  title: string
  description: string
  code: string
  options: string[]
  correctAnswer: number
  explanation: string
  difficulty: 'easy' | 'medium' | 'hard'
}

const questions: Question[] = [
  {
    id: 1,
    title: 'Python List Comprehension',
    description: 'What will be the output of this Python code?',
    code: `numbers = [1, 2, 3, 4, 5]
squares = [x**2 for x in numbers if x % 2 == 0]
print(squares)`,
    options: ['[1, 4, 9, 16, 25]', '[4, 16]', '[2, 4]', '[1, 3, 5]'],
    correctAnswer: 1,
    explanation: 'The list comprehension squares even numbers only (2, 4) and raises them to power 2, resulting in [4, 16].',
    difficulty: 'easy'
  },
  {
    id: 2,
    title: 'JavaScript Array Methods',
    description: 'What does this JavaScript code return?',
    code: `const arr = [1, 2, 3, 4, 5];
const result = arr.filter(x => x > 2).map(x => x * 2);
console.log(result);`,
    options: ['[6, 8, 10]', '[2, 4, 6, 8, 10]', '[3, 4, 5]', '[1, 2, 3, 4, 5]'],
    correctAnswer: 0,
    explanation: 'filter(x > 2) returns [3, 4, 5], then map(x * 2) multiplies each by 2, giving [6, 8, 10].',
    difficulty: 'medium'
  },
  {
    id: 3,
    title: 'SQL Query Analysis',
    description: 'What will this SQL query return?',
    code: `SELECT COUNT(*) as total
FROM users 
WHERE age > 25 AND status = 'active'
GROUP BY department
HAVING COUNT(*) > 10;`,
    options: ['Total users over 25', 'Departments with >10 active users over 25', 'All active users', 'Users by department'],
    correctAnswer: 1,
    explanation: 'The query groups by department and only shows departments with more than 10 active users over 25.',
    difficulty: 'hard'
  },
  {
    id: 4,
    title: 'React State Management',
    description: 'What is the correct way to update state in React?',
    code: `const [count, setCount] = useState(0);

// Which is correct?
setCount(count + 1);  // Option A
setCount(prev => prev + 1);  // Option B`,
    options: ['Only Option A', 'Only Option B', 'Both are correct', 'Neither is correct'],
    correctAnswer: 2,
    explanation: 'Both are correct, but Option B (functional update) is preferred when the new state depends on the previous state.',
    difficulty: 'medium'
  },
  {
    id: 5,
    title: 'Algorithm Complexity',
    description: 'What is the time complexity of this algorithm?',
    code: `function findMax(arr) {
  let max = arr[0];
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] > max) {
      max = arr[i];
    }
  }
  return max;
}`,
    options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
    correctAnswer: 2,
    explanation: 'The algorithm iterates through the array once, making it O(n) linear time complexity.',
    difficulty: 'easy'
  }
]

export default function CodeChallengeGame({ onComplete, onClose }: CodeChallengeGameProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [isAnswered, setIsAnswered] = useState(false)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(300) // 5 minutes
  const [isTimerRunning, setIsTimerRunning] = useState(true)
  const [showExplanation, setShowExplanation] = useState(false)
  const [gameCompleted, setGameCompleted] = useState(false)

  const currentQuestion = questions[currentQuestionIndex]

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isTimerRunning && timeLeft > 0 && !gameCompleted) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsTimerRunning(false)
            handleGameComplete()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isTimerRunning, timeLeft, gameCompleted])

  const handleAnswerSelect = (answerIndex: number) => {
    if (isAnswered) return
    setSelectedAnswer(answerIndex)
  }

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return

    setIsAnswered(true)
    setShowExplanation(true)

    if (selectedAnswer === currentQuestion.correctAnswer) {
      const points = currentQuestion.difficulty === 'easy' ? 10 : 
                    currentQuestion.difficulty === 'medium' ? 20 : 30
      setScore(prev => prev + points)
    }
  }

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
      setSelectedAnswer(null)
      setIsAnswered(false)
      setShowExplanation(false)
    } else {
      handleGameComplete()
    }
  }

  const handleGameComplete = () => {
    setGameCompleted(true)
    setIsTimerRunning(false)
    const finalScore = Math.round((score / questions.length) * 100)
    onComplete(finalScore, 300 - timeLeft)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      case 'hard': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  if (gameCompleted) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Trophy className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Game Complete!</h2>
            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Final Score:</span>
                <span className="text-2xl font-bold text-green-600">{Math.round((score / questions.length) * 100)}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Time Taken:</span>
                <span className="text-lg font-medium">{formatTime(300 - timeLeft)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Questions Correct:</span>
                <span className="text-lg font-medium">{score / 20} / {questions.length}</span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 px-6 rounded-xl font-bold hover:from-green-600 hover:to-emerald-600 transition-all duration-300"
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
      <div className="bg-white rounded-3xl p-8 max-w-4xl w-full mx-4 shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
              <Code className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Code Challenge</h2>
              <p className="text-gray-600">Question {currentQuestionIndex + 1} of {questions.length}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Timer */}
            <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-xl">
              <Timer className="w-5 h-5 text-gray-600" />
              <span className="font-mono font-bold text-lg">{formatTime(timeLeft)}</span>
            </div>
            
            {/* Score */}
            <div className="flex items-center gap-2 bg-green-100 px-4 py-2 rounded-xl">
              <Target className="w-5 h-5 text-green-600" />
              <span className="font-bold text-green-600">{score} pts</span>
            </div>
            
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Question */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <h3 className="text-xl font-bold text-gray-900">{currentQuestion.title}</h3>
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${getDifficultyColor(currentQuestion.difficulty)}`}>
              {currentQuestion.difficulty.toUpperCase()}
            </span>
          </div>
          
          <p className="text-gray-700 mb-4">{currentQuestion.description}</p>
          
          {/* Code Block */}
          <div className="bg-gray-900 text-green-400 p-4 rounded-xl font-mono text-sm mb-6 overflow-x-auto">
            <pre>{currentQuestion.code}</pre>
          </div>
        </div>

        {/* Answer Options */}
        <div className="space-y-3 mb-6">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(index)}
              disabled={isAnswered}
              className={`w-full p-4 text-left rounded-xl border-2 transition-all duration-200 ${
                selectedAnswer === index
                  ? isAnswered
                    ? index === currentQuestion.correctAnswer
                      ? 'border-green-500 bg-green-50'
                      : 'border-red-500 bg-red-50'
                    : 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              } ${isAnswered ? 'cursor-default' : 'cursor-pointer'}`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  selectedAnswer === index
                    ? isAnswered
                      ? index === currentQuestion.correctAnswer
                        ? 'border-green-500 bg-green-500'
                        : 'border-red-500 bg-red-500'
                      : 'border-blue-500 bg-blue-500'
                    : 'border-gray-300'
                }`}>
                  {selectedAnswer === index && (
                    index === currentQuestion.correctAnswer ? 
                      <Check className="w-4 h-4 text-white" /> : 
                      <X className="w-4 h-4 text-white" />
                  )}
                </div>
                <span className="font-medium">{option}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Explanation */}
        {showExplanation && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="w-5 h-5 text-blue-600" />
              <h4 className="font-bold text-blue-900">Explanation</h4>
            </div>
            <p className="text-blue-800">{currentQuestion.explanation}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-between">
          <div className="flex gap-3">
            <button
              onClick={() => setIsTimerRunning(!isTimerRunning)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
            >
              {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {isTimerRunning ? 'Pause' : 'Resume'}
            </button>
          </div>
          
          <div className="flex gap-3">
            {!isAnswered ? (
              <button
                onClick={handleSubmitAnswer}
                disabled={selectedAnswer === null}
                className="px-6 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                Submit Answer
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                className="px-6 py-2 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-colors"
              >
                {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Finish Game'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
