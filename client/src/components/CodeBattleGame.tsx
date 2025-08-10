'use client'

import { useState, useEffect, useRef } from 'react'
import { 
  Code, 
  Play, 
  Square, 
  RotateCcw, 
  Trophy,
  Timer,
  Target,
  Check,
  X,
  Zap
} from 'lucide-react'

interface CodeBattleGameProps {
  onComplete: (score: number, time: number) => void
  onClose: () => void
}

interface Challenge {
  id: number
  title: string
  description: string
  starterCode: string
  testCases: {
    input: string
    expectedOutput: string
    description: string
  }[]
  difficulty: 'easy' | 'medium' | 'hard'
  timeLimit: number // in seconds
}

const challenges: Challenge[] = [
  {
    id: 1,
    title: "Reverse String",
    description: "Write a function that reverses a string. The function should take a string as input and return the reversed string.",
    starterCode: `function reverseString(str) {
  // Your code here
  return str;
}

// Test your function
console.log(reverseString("hello")); // Should output: "olleh"
console.log(reverseString("world")); // Should output: "dlrow"`,
    testCases: [
      { input: '"hello"', expectedOutput: '"olleh"', description: "Basic string reversal" },
      { input: '"world"', expectedOutput: '"dlrow"', description: "Another basic test" },
      { input: '""', expectedOutput: '""', description: "Empty string" }
    ],
    difficulty: 'easy',
    timeLimit: 300
  },
  {
    id: 2,
    title: "Find Maximum",
    description: "Write a function that finds the maximum number in an array. Return the maximum value.",
    starterCode: `function findMax(arr) {
  // Your code here
  return 0;
}

// Test your function
console.log(findMax([1, 5, 3, 9, 2])); // Should output: 9
console.log(findMax([-1, -5, -3])); // Should output: -1`,
    testCases: [
      { input: '[1, 5, 3, 9, 2]', expectedOutput: '9', description: "Array with positive numbers" },
      { input: '[-1, -5, -3]', expectedOutput: '-1', description: "Array with negative numbers" },
      { input: '[42]', expectedOutput: '42', description: "Single element array" }
    ],
    difficulty: 'easy',
    timeLimit: 300
  },
  {
    id: 3,
    title: "Palindrome Checker",
    description: "Write a function that checks if a string is a palindrome (reads the same forwards and backwards). Return true if it is, false otherwise.",
    starterCode: `function isPalindrome(str) {
  // Your code here
  return false;
}

// Test your function
console.log(isPalindrome("racecar")); // Should output: true
console.log(isPalindrome("hello")); // Should output: false`,
    testCases: [
      { input: '"racecar"', expectedOutput: 'true', description: "Valid palindrome" },
      { input: '"hello"', expectedOutput: 'false', description: "Not a palindrome" },
      { input: '"anna"', expectedOutput: 'true', description: "Another palindrome" }
    ],
    difficulty: 'medium',
    timeLimit: 400
  }
]

export default function CodeBattleGame({ onComplete, onClose }: CodeBattleGameProps) {
  const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0)
  const [code, setCode] = useState('')
  const [output, setOutput] = useState('')
  const [testResults, setTestResults] = useState<Array<{ passed: boolean; message: string }>>([])
  const [isRunning, setIsRunning] = useState(false)
  const [timeLeft, setTimeLeft] = useState(0)
  const [gameCompleted, setGameCompleted] = useState(false)
  const [score, setScore] = useState(0)
  const [challengeCompleted, setChallengeCompleted] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const currentChallenge = challenges[currentChallengeIndex]

  useEffect(() => {
    if (currentChallenge) {
      setCode(currentChallenge.starterCode)
      setTimeLeft(currentChallenge.timeLimit)
      setOutput('')
      setTestResults([])
      setChallengeCompleted(false)
    }
  }, [currentChallengeIndex])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (timeLeft > 0 && !challengeCompleted && !gameCompleted) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleTimeUp()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [timeLeft, challengeCompleted, gameCompleted])

  const handleTimeUp = () => {
    setIsRunning(false)
    setOutput('⏰ Time\'s up! Challenge failed.')
  }

  const runCode = () => {
    setIsRunning(true)
    setOutput('Running code...')

    try {
      // Create a safe execution environment
      const safeCode = `
        try {
          ${code}
          return { success: true, output: 'Code executed successfully' };
        } catch (error) {
          return { success: false, error: error.message };
        }
      `

      // Execute the code in a safe way
      const result = executeCodeSafely(safeCode)
      
      if (result.success) {
        setOutput(result.output)
        runTests()
      } else {
        setOutput(`Error: ${result.error}`)
      }
    } catch (error) {
      setOutput(`Execution error: ${error}`)
    } finally {
      setIsRunning(false)
    }
  }

  const executeCodeSafely = (code: string) => {
    try {
      // Create a new function with the code
      const func = new Function(code)
      const result = func()
      return result
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const runTests = () => {
    const results = currentChallenge.testCases.map(testCase => {
      try {
        // Extract the function name from the code
        const functionMatch = code.match(/function\s+(\w+)/)
        if (!functionMatch) {
          return { passed: false, message: 'No function found' }
        }

        const functionName = functionMatch[1]
        const testCode = `
          ${code}
          const result = ${functionName}(${testCase.input});
          result === ${testCase.expectedOutput};
        `

        const testResult = executeCodeSafely(testCode)
        const passed = testResult.success && testResult.output === true

        return {
          passed,
          message: passed ? 'Test passed' : `Expected ${testCase.expectedOutput}, got ${testResult.output}`
        }
      } catch (error) {
        return { passed: false, message: `Test error: ${error}` }
      }
    })

    setTestResults(results)
    
    const passedTests = results.filter(r => r.passed).length
    const totalTests = results.length
    
    if (passedTests === totalTests) {
      const challengeScore = currentChallenge.difficulty === 'easy' ? 100 : 
                           currentChallenge.difficulty === 'medium' ? 200 : 300
      setScore(prev => prev + challengeScore)
      setChallengeCompleted(true)
      
      if (currentChallengeIndex < challenges.length - 1) {
        setTimeout(() => {
          setCurrentChallengeIndex(prev => prev + 1)
        }, 2000)
      } else {
        setTimeout(() => {
          setGameCompleted(true)
          onComplete(score + challengeScore, currentChallenge.timeLimit - timeLeft)
        }, 2000)
      }
    }
  }

  const resetCode = () => {
    setCode(currentChallenge.starterCode)
    setOutput('')
    setTestResults([])
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
        <div className="bg-white rounded-3xl p-8 max-w-2xl w-full mx-4 shadow-2xl">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Trophy className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Code Battle Complete!</h2>
            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Final Score:</span>
                <span className="text-2xl font-bold text-orange-600">{score} pts</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Challenges Completed:</span>
                <span className="text-lg font-medium">{currentChallengeIndex + 1} / {challenges.length}</span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 px-6 rounded-xl font-bold hover:from-orange-600 hover:to-red-600 transition-all duration-300"
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
      <div className="bg-white rounded-3xl p-6 max-w-6xl w-full mx-4 shadow-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
              <Code className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Code Battle</h2>
              <p className="text-gray-600">Challenge {currentChallengeIndex + 1} of {challenges.length}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Timer */}
            <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-xl">
              <Timer className="w-5 h-5 text-gray-600" />
              <span className="font-mono font-bold text-lg">{formatTime(timeLeft)}</span>
            </div>
            
            {/* Score */}
            <div className="flex items-center gap-2 bg-orange-100 px-4 py-2 rounded-xl">
              <Target className="w-5 h-5 text-orange-600" />
              <span className="font-bold text-orange-600">{score} pts</span>
            </div>
            
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(90vh-120px)]">
          {/* Left Panel - Code Editor */}
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <h3 className="text-xl font-bold text-gray-900">{currentChallenge.title}</h3>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${getDifficultyColor(currentChallenge.difficulty)}`}>
                  {currentChallenge.difficulty.toUpperCase()}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={resetCode}
                  className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  Reset
                </button>
                <button
                  onClick={runCode}
                  disabled={isRunning}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isRunning ? <Square className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  {isRunning ? 'Running...' : 'Run Code'}
                </button>
              </div>
            </div>

            <p className="text-gray-700 mb-4">{currentChallenge.description}</p>

            {/* Code Editor */}
            <div className="flex-1 bg-gray-900 rounded-xl p-4 overflow-hidden">
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full h-full bg-transparent text-green-400 font-mono text-sm resize-none outline-none"
                placeholder="Write your code here..."
              />
            </div>
          </div>

          {/* Right Panel - Output and Tests */}
          <div className="flex flex-col">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Output & Tests</h3>
            
            {/* Output */}
            <div className="bg-gray-100 rounded-xl p-4 mb-4 flex-1">
              <h4 className="font-bold text-gray-900 mb-2">Console Output:</h4>
              <div className="bg-white rounded-lg p-3 font-mono text-sm text-gray-800 min-h-[100px]">
                {output || 'No output yet. Run your code to see results.'}
              </div>
            </div>

            {/* Test Results */}
            <div className="bg-gray-100 rounded-xl p-4">
              <h4 className="font-bold text-gray-900 mb-2">Test Cases:</h4>
              <div className="space-y-2">
                {currentChallenge.testCases.map((testCase, index) => (
                  <div key={index} className="flex items-center gap-3 p-2 bg-white rounded-lg">
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                      testResults[index]?.passed 
                        ? 'bg-green-500' 
                        : testResults.length > 0 
                        ? 'bg-red-500' 
                        : 'bg-gray-300'
                    }`}>
                      {testResults[index]?.passed ? (
                        <Check className="w-3 h-3 text-white" />
                      ) : testResults.length > 0 ? (
                        <X className="w-3 h-3 text-white" />
                      ) : null}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">{testCase.description}</div>
                      <div className="text-xs text-gray-600">
                        Input: {testCase.input} → Expected: {testCase.expectedOutput}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
