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
  Zap,
  AlertTriangle,
  Lightbulb
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
  hints: string[]
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
      { input: '"hello"', expectedOutput: '"olleh"', description: 'Basic string reversal' },
      { input: '"world"', expectedOutput: '"dlrow"', description: 'Another basic test' },
      { input: '""', expectedOutput: '""', description: 'Empty string' },
      { input: '"a"', expectedOutput: '"a"', description: 'Single character' }
    ],
    difficulty: 'easy',
    timeLimit: 120,
    hints: [
      "Try using a loop to iterate through the string backwards",
      "You can also use the split(), reverse(), and join() methods",
      "Remember that strings are immutable in JavaScript"
    ]
  },
  {
    id: 2,
    title: "Find Missing Number",
    description: "Given an array containing n distinct numbers taken from 0, 1, 2, ..., n, find the one that is missing from the array.",
    starterCode: `function findMissingNumber(nums) {
  // Your code here
  return 0;
}

// Test your function
console.log(findMissingNumber([3, 0, 1])); // Should output: 2
console.log(findMissingNumber([9, 6, 4, 2, 3, 5, 7, 0, 1])); // Should output: 8`,
    testCases: [
      { input: '[3, 0, 1]', expectedOutput: '2', description: 'Missing number is 2' },
      { input: '[9, 6, 4, 2, 3, 5, 7, 0, 1]', expectedOutput: '8', description: 'Missing number is 8' },
      { input: '[0]', expectedOutput: '1', description: 'Missing number is 1' },
      { input: '[1]', expectedOutput: '0', description: 'Missing number is 0' }
    ],
    difficulty: 'medium',
    timeLimit: 180,
    hints: [
      "Think about the sum of numbers from 0 to n",
      "You can use the formula: sum = n * (n + 1) / 2",
      "Calculate the expected sum and subtract the actual sum"
    ]
  },
  {
    id: 3,
    title: "Valid Parentheses",
    description: "Given a string containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
    starterCode: `function isValid(s) {
  // Your code here
  return false;
}

// Test your function
console.log(isValid("()")); // Should output: true
console.log(isValid("()[]{}")); // Should output: true
console.log(isValid("(]")); // Should output: false`,
    testCases: [
      { input: '"()"', expectedOutput: 'true', description: 'Simple parentheses' },
      { input: '"()[]{}"', expectedOutput: 'true', description: 'Multiple brackets' },
      { input: '"(]"', expectedOutput: 'false', description: 'Invalid brackets' },
      { input: '"([)]"', expectedOutput: 'false', description: 'Wrong order' },
      { input: '"{[]}"', expectedOutput: 'true', description: 'Nested brackets' }
    ],
    difficulty: 'hard',
    timeLimit: 240,
    hints: [
      "Use a stack data structure",
      "Push opening brackets onto the stack",
      "Pop and match when you encounter closing brackets",
      "Check if the stack is empty at the end"
    ]
  }
]

export default function CodeBattleGame({ onComplete, onClose }: CodeBattleGameProps) {
  const [currentChallenge, setCurrentChallenge] = useState(0)
  const [code, setCode] = useState('')
  const [output, setOutput] = useState('')
  const [testResults, setTestResults] = useState<any[]>([])
  const [timeLeft, setTimeLeft] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [showHints, setShowHints] = useState(false)
  const [hintIndex, setHintIndex] = useState(0)
  const [gameCompleted, setGameCompleted] = useState(false)
  const [finalScore, setFinalScore] = useState(0)
  const [totalTime, setTotalTime] = useState(0)
  const editorRef = useRef<HTMLTextAreaElement>(null)

  const challenge = challenges[currentChallenge]

  useEffect(() => {
    if (currentChallenge < challenges.length) {
      setCode(challenge.starterCode)
      setTimeLeft(challenge.timeLimit)
      setOutput('')
      setTestResults([])
      setShowHints(false)
      setHintIndex(0)
    }
  }, [currentChallenge])

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
    setOutput('⏰ Time\'s up! Challenge failed.')
  }

  const executeCodeSafely = (code: string) => {
    try {
      // Create a safe execution environment
      const safeCode = `
        let output = [];
        const originalLog = console.log;
        console.log = (...args) => {
          output.push(args.map(arg => 
            typeof arg === 'string' ? JSON.stringify(arg) : 
            typeof arg === 'object' ? JSON.stringify(arg) : 
            String(arg)
          ).join(' '));
        };
        
        try {
          ${code}
        } catch (error) {
          output.push('Error: ' + error.message);
        }
        
        console.log = originalLog;
        output;
      `
      
      // Use Function constructor for safer execution
      const result = new Function(safeCode)()
      return result
    } catch (error) {
      return [`Error: ${error}`]
    }
  }

  const runCode = () => {
    setIsRunning(true)
    const results = executeCodeSafely(code)
    setOutput(results.join('\n'))
  }

  const runTests = () => {
    const results = []
    let passedTests = 0

    challenge.testCases.forEach((testCase, index) => {
      try {
        // Create a test environment
        const testCode = `
          ${code}
          
          // Test case ${index + 1}
          const result = ${challenge.title === 'reverseString' ? 'reverseString' : 
                         challenge.title === 'findMissingNumber' ? 'findMissingNumber' : 
                         'isValid'}(${testCase.input});
          JSON.stringify(result);
        `
        
        const testResult = executeCodeSafely(testCode)
        const actualOutput = testResult[testResult.length - 1] || 'undefined'
        const expectedOutput = testCase.expectedOutput
        
        const passed = actualOutput === expectedOutput
        if (passed) passedTests++
        
        results.push({
          testCase: index + 1,
          input: testCase.input,
          expected: expectedOutput,
          actual: actualOutput,
          passed,
          description: testCase.description
        })
      } catch (error) {
        results.push({
          testCase: index + 1,
          input: testCase.input,
          expected: testCase.expectedOutput,
          actual: `Error: ${error}`,
          passed: false,
          description: testCase.description
        })
      }
    })

    setTestResults(results)
    
    // Check if all tests passed
    if (passedTests === challenge.testCases.length) {
      handleChallengeComplete()
    }
  }

  const handleChallengeComplete = () => {
    setIsRunning(false)
    const timeUsed = challenge.timeLimit - timeLeft
    const score = Math.round((timeUsed / challenge.timeLimit) * 100)
    
    if (currentChallenge < challenges.length - 1) {
      // Move to next challenge
      setCurrentChallenge(prev => prev + 1)
    } else {
      // Game completed
      const totalScore = Math.round((challenges.length / challenges.length) * 100)
      setFinalScore(totalScore)
      setTotalTime(challenges.reduce((sum, _, index) => sum + (challenges[index].timeLimit - timeLeft), 0))
      setGameCompleted(true)
    }
  }

  const showHint = () => {
    if (hintIndex < challenge.hints.length) {
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

  if (gameCompleted) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-3xl p-8 max-w-2xl w-full mx-4 shadow-2xl">
          <div className="text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white mx-auto mb-6">
              <Trophy className="w-12 h-12" />
            </div>
            
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Code Battle Complete!</h2>
            <p className="text-gray-600 mb-8">Congratulations! You've completed all challenges.</p>

            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6">
                <div className="text-3xl font-bold text-blue-600 mb-2">{finalScore}%</div>
                <div className="text-gray-600 font-medium">Final Score</div>
              </div>
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6">
                <div className="text-3xl font-bold text-green-600 mb-2">{formatTime(totalTime)}</div>
                <div className="text-gray-600 font-medium">Total Time</div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-2xl p-6 mb-8">
              <h4 className="text-xl font-bold text-gray-900 mb-4">Challenge Summary</h4>
              <div className="space-y-3">
                {challenges.map((challenge, index) => (
                  <div key={challenge.id} className="flex items-center justify-between p-3 bg-white rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 bg-gradient-to-br ${getDifficultyColor(challenge.difficulty)} rounded-full flex items-center justify-center text-white text-sm font-bold`}>
                        {index + 1}
                      </div>
                      <span className="font-medium text-gray-700">{challenge.title}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-5 h-5 text-green-600" />
                      <span className="text-sm text-gray-600">Completed</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => onComplete(finalScore, totalTime)}
                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 px-6 rounded-xl font-bold hover:from-green-600 hover:to-emerald-600 transition-all duration-300"
              >
                <Trophy className="w-5 h-5 mr-2 inline" />
                Complete Battle
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

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl p-8 max-w-6xl w-full mx-4 shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
              <Code className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Code Battle</h2>
              <p className="text-gray-600">Challenge {currentChallenge + 1} of {challenges.length}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-gray-600">
              <Timer className="w-5 h-5" />
              <span className="font-mono font-bold">{formatTime(timeLeft)}</span>
            </div>
            <div className={`px-3 py-1 rounded-full text-sm font-bold ${getDifficultyColor(challenge.difficulty)} text-white`}>
              {challenge.difficulty.toUpperCase()}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Panel - Challenge and Code */}
          <div className="space-y-6">
            {/* Challenge Description */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">{challenge.title}</h3>
              <p className="text-gray-700 leading-relaxed mb-4">{challenge.description}</p>
              
              <button
                onClick={showHint}
                disabled={hintIndex >= challenge.hints.length}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Lightbulb className="w-4 h-4" />
                Show Hint ({hintIndex + 1}/{challenge.hints.length})
              </button>
              
              {showHints && hintIndex > 0 && (
                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <Lightbulb className="w-4 h-4 text-yellow-600" />
                    <span className="font-medium text-yellow-800">Hint {hintIndex}:</span>
                  </div>
                  <p className="text-yellow-700">{challenge.hints[hintIndex - 1]}</p>
                </div>
              )}
            </div>

            {/* Code Editor */}
            <div className="bg-gray-900 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-white font-bold">Code Editor</h4>
                <div className="flex gap-2">
                  <button
                    onClick={runCode}
                    className="flex items-center gap-2 px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Play className="w-4 h-4" />
                    Run
                  </button>
                  <button
                    onClick={runTests}
                    className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Target className="w-4 h-4" />
                    Test
                  </button>
                </div>
              </div>
              
              <textarea
                ref={editorRef}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full h-64 bg-gray-800 text-green-400 font-mono text-sm p-4 rounded-lg border border-gray-700 focus:outline-none focus:border-blue-500 resize-none"
                placeholder="Write your code here..."
              />
            </div>

            {/* Output */}
            {output && (
              <div className="bg-gray-100 rounded-2xl p-6">
                <h4 className="font-bold text-gray-900 mb-3">Output</h4>
                <pre className="bg-white p-4 rounded-lg border text-sm font-mono overflow-x-auto">
                  {output}
                </pre>
              </div>
            )}
          </div>

          {/* Right Panel - Test Cases */}
          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <h4 className="text-xl font-bold text-gray-900 mb-4">Test Cases</h4>
              
              <div className="space-y-4">
                {challenge.testCases.map((testCase, index) => {
                  const result = testResults.find(r => r.testCase === index + 1)
                  const isPassed = result?.passed
                  
                  return (
                    <div key={index} className={`p-4 rounded-xl border-2 ${
                      result ? (isPassed ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50') : 'border-gray-200 bg-gray-50'
                    }`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-700">Test Case {index + 1}</span>
                        {result && (
                          <div className="flex items-center gap-2">
                            {isPassed ? (
                              <Check className="w-5 h-5 text-green-600" />
                            ) : (
                              <X className="w-5 h-5 text-red-600" />
                            )}
                            <span className={`text-sm font-bold ${isPassed ? 'text-green-600' : 'text-red-600'}`}>
                              {isPassed ? 'PASSED' : 'FAILED'}
                            </span>
                          </div>
                        )}
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-2">{testCase.description}</p>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-gray-700">Input:</span>
                          <pre className="bg-white p-2 rounded border mt-1 font-mono">{testCase.input}</pre>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Expected:</span>
                          <pre className="bg-white p-2 rounded border mt-1 font-mono">{testCase.expectedOutput}</pre>
                        </div>
                      </div>
                      
                      {result && !isPassed && (
                        <div className="mt-3">
                          <span className="font-medium text-red-700">Actual Output:</span>
                          <pre className="bg-red-100 p-2 rounded border mt-1 font-mono text-red-800">{result.actual}</pre>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Progress */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6">
              <h4 className="text-xl font-bold text-gray-900 mb-4">Progress</h4>
              <div className="space-y-3">
                {challenges.map((ch, index) => (
                  <div key={ch.id} className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                      index < currentChallenge ? 'bg-green-500' :
                      index === currentChallenge ? 'bg-blue-500' : 'bg-gray-300'
                    }`}>
                      {index < currentChallenge ? '✓' : index + 1}
                    </div>
                    <span className={`font-medium ${
                      index < currentChallenge ? 'text-green-600' :
                      index === currentChallenge ? 'text-blue-600' : 'text-gray-400'
                    }`}>
                      {ch.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-bold"
          >
            Exit Battle
          </button>
          
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-600">
              <span className="font-medium">Passed Tests:</span> {testResults.filter(r => r.passed).length}/{challenge.testCases.length}
            </div>
            <div className="text-sm text-gray-600">
              <span className="font-medium">Time Remaining:</span> {formatTime(timeLeft)}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
