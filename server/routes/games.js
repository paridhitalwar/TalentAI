const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

// Mock data for demo purposes
const mockGames = new Map();
const mockLeaderboards = new Map();
const mockGameSessions = new Map();

// Game templates for different puzzle types
const gameTemplates = {
  'algorithm-puzzle': {
    name: 'Algorithm Optimization Challenge',
    description: 'Optimize the given algorithm for better performance',
    difficulty: 'intermediate',
    timeLimit: 300, // 5 minutes
    maxScore: 100,
    instructions: 'Analyze the algorithm and suggest optimizations. Consider time complexity, space complexity, and edge cases.'
  },
  'logic-grid': {
    name: 'AI Logic Grid',
    description: 'Solve the logic puzzle using AI/ML concepts',
    difficulty: 'beginner',
    timeLimit: 180, // 3 minutes
    maxScore: 80,
    instructions: 'Fill in the grid following the given rules and constraints.'
  },
  'code-debugging': {
    name: 'ML Model Debugging',
    description: 'Identify and fix issues in the machine learning code',
    difficulty: 'advanced',
    timeLimit: 420, // 7 minutes
    maxScore: 120,
    instructions: 'Find bugs in the ML pipeline and suggest fixes. Consider data quality, model architecture, and evaluation metrics.'
  },
  'pattern-recognition': {
    name: 'Data Pattern Recognition',
    description: 'Identify patterns in the given dataset',
    difficulty: 'intermediate',
    timeLimit: 240, // 4 minutes
    maxScore: 90,
    instructions: 'Analyze the data and identify meaningful patterns, anomalies, or trends.'
  }
};

// Start a new game session
router.post('/start', async (req, res) => {
  try {
    const { candidateId, gameType = 'algorithm-puzzle' } = req.body;
    
    if (!candidateId) {
      return res.status(400).json({ error: 'Candidate ID required' });
    }

    const gameTemplate = gameTemplates[gameType];
    if (!gameTemplate) {
      return res.status(400).json({ error: 'Invalid game type' });
    }

    const gameId = uuidv4();
    const gameSession = {
      id: gameId,
      candidateId,
      gameType,
      template: gameTemplate,
      status: 'active',
      startTime: new Date().toISOString(),
      score: 0,
      timeSpent: 0,
      attempts: 0,
      maxAttempts: 3,
      gameData: generateGameData(gameType)
    };

    mockGameSessions.set(gameId, gameSession);

    res.json({
      success: true,
      gameId,
      gameSession,
      message: 'Game session started'
    });

  } catch (error) {
    console.error('Game start error:', error);
    res.status(500).json({ error: 'Failed to start game' });
  }
});

// Submit game solution
router.post('/submit', async (req, res) => {
  try {
    const { gameId, solution, timeSpent } = req.body;
    
    if (!gameId || !solution) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const gameSession = mockGameSessions.get(gameId);
    if (!gameSession) {
      return res.status(404).json({ error: 'Game session not found' });
    }

    if (gameSession.status !== 'active') {
      return res.status(400).json({ error: 'Game session is not active' });
    }

    // Evaluate solution
    const evaluation = evaluateGameSolution(gameSession.gameType, solution, gameSession.gameData);
    const score = Math.round(evaluation.score * gameSession.template.maxScore);
    
    // Update game session
    gameSession.score = score;
    gameSession.timeSpent = timeSpent || 0;
    gameSession.attempts += 1;
    gameSession.solution = solution;
    gameSession.evaluation = evaluation;
    gameSession.endTime = new Date().toISOString();

    // Check if max attempts reached or score is high enough
    if (gameSession.attempts >= gameSession.maxAttempts || score >= gameSession.template.maxScore * 0.8) {
      gameSession.status = 'completed';
      
      // Update leaderboard
      updateLeaderboard(gameSession);
    }

    res.json({
      success: true,
      score,
      evaluation,
      gameSession,
      message: gameSession.status === 'completed' ? 'Game completed' : 'Solution submitted'
    });

  } catch (error) {
    console.error('Game submission error:', error);
    res.status(500).json({ error: 'Failed to submit solution' });
  }
});

// Get game session
router.get('/session/:gameId', async (req, res) => {
  try {
    const { gameId } = req.params;
    
    const gameSession = mockGameSessions.get(gameId);
    if (!gameSession) {
      return res.status(404).json({ error: 'Game session not found' });
    }

    res.json({
      success: true,
      gameSession
    });

  } catch (error) {
    console.error('Get game session error:', error);
    res.status(500).json({ error: 'Failed to get game session' });
  }
});

// Get leaderboard for a specific game type
router.get('/leaderboard/:gameType', async (req, res) => {
  try {
    const { gameType } = req.params;
    
    const leaderboard = mockLeaderboards.get(gameType) || [];
    
    res.json({
      success: true,
      gameType,
      leaderboard: leaderboard.slice(0, 50) // Top 50
    });

  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({ error: 'Failed to get leaderboard' });
  }
});

// Get overall leaderboard across all games
router.get('/leaderboard', async (req, res) => {
  try {
    const allLeaderboards = Array.from(mockLeaderboards.values());
    const overallScores = new Map();

    // Aggregate scores across all games
    allLeaderboards.forEach(leaderboard => {
      leaderboard.forEach(entry => {
        const currentScore = overallScores.get(entry.candidateId) || 0;
        overallScores.set(entry.candidateId, currentScore + entry.score);
      });
    });

    // Convert to array and sort
    const overallLeaderboard = Array.from(overallScores.entries())
      .map(([candidateId, totalScore]) => ({
        candidateId,
        totalScore,
        gamesPlayed: allLeaderboards.flat().filter(entry => entry.candidateId === candidateId).length
      }))
      .sort((a, b) => b.totalScore - a.totalScore)
      .slice(0, 100); // Top 100 overall

    res.json({
      success: true,
      leaderboard: overallLeaderboard
    });

  } catch (error) {
    console.error('Get overall leaderboard error:', error);
    res.status(500).json({ error: 'Failed to get overall leaderboard' });
  }
});

// Get candidate game history
router.get('/candidate/:candidateId/history', async (req, res) => {
  try {
    const { candidateId } = req.params;
    
    const gameHistory = Array.from(mockGameSessions.values())
      .filter(session => session.candidateId === candidateId && session.status === 'completed');

    const leaderboardPositions = Array.from(mockLeaderboards.values())
      .flat()
      .filter(entry => entry.candidateId === candidateId)
      .map(entry => ({
        gameType: entry.gameType,
        position: mockLeaderboards.get(entry.gameType).findIndex(e => e.candidateId === candidateId) + 1,
        score: entry.score
      }));

    res.json({
      success: true,
      gameHistory,
      leaderboardPositions,
      summary: {
        totalGames: gameHistory.length,
        averageScore: gameHistory.length > 0 
          ? Math.round(gameHistory.reduce((sum, game) => sum + game.score, 0) / gameHistory.length)
          : 0,
        bestScore: gameHistory.length > 0 
          ? Math.max(...gameHistory.map(game => game.score))
          : 0
      }
    });

  } catch (error) {
    console.error('Get candidate game history error:', error);
    res.status(500).json({ error: 'Failed to get candidate game history' });
  }
});

// Get available game types
router.get('/types', async (req, res) => {
  try {
    const gameTypes = Object.keys(gameTemplates).map(type => ({
      type,
      ...gameTemplates[type]
    }));

    res.json({
      success: true,
      gameTypes
    });

  } catch (error) {
    console.error('Get game types error:', error);
    res.status(500).json({ error: 'Failed to get game types' });
  }
});

// Helper functions
function generateGameData(gameType) {
  switch (gameType) {
    case 'algorithm-puzzle':
      return {
        algorithm: 'bubble sort',
        problem: 'Optimize this sorting algorithm for better performance',
        code: 'function bubbleSort(arr) { /* implementation */ }',
        constraints: ['Time complexity should be O(n log n) or better', 'Space complexity should be O(1)']
      };
    
    case 'logic-grid':
      return {
        grid: Array(4).fill().map(() => Array(4).fill(null)),
        rules: [
          'Each row must contain exactly one AI framework',
          'Each column must contain exactly one programming language',
          'PyTorch cannot be in the same row as TensorFlow',
          'Python must be in the first column'
        ],
        clues: ['PyTorch is in row 2', 'TensorFlow is in column 3']
      };
    
    case 'code-debugging':
      return {
        code: `
def train_model(X, y):
    model = RandomForestClassifier()
    model.fit(X, y)
    return model.score(X, y)  # This is wrong!
        `,
        issues: ['Data leakage', 'Missing validation', 'Incorrect evaluation metric'],
        expectedOutput: 'Cross-validation score'
      };
    
    case 'pattern-recognition':
      return {
        dataset: [1, 2, 4, 8, 16, 32, 64, 128],
        question: 'What is the next number in this sequence?',
        pattern: 'geometric progression with ratio 2',
        answer: 256
      };
    
    default:
      return {};
  }
}

function evaluateGameSolution(gameType, solution, gameData) {
  // Simple evaluation logic - in production, this would be more sophisticated
  let score = 0;
  let feedback = [];

  switch (gameType) {
    case 'algorithm-puzzle':
      if (solution.includes('quicksort') || solution.includes('mergesort')) {
        score = 0.9;
        feedback.push('Excellent choice of algorithm');
      } else if (solution.includes('optimization')) {
        score = 0.7;
        feedback.push('Good optimization approach');
      } else {
        score = 0.4;
        feedback.push('Consider more efficient algorithms');
      }
      break;
    
    case 'logic-grid':
      if (solution && solution.length > 0) {
        score = 0.8;
        feedback.push('Logic grid completed successfully');
      } else {
        score = 0.3;
        feedback.push('Grid needs to be completed');
      }
      break;
    
    case 'code-debugging':
      if (solution.includes('cross_val_score') || solution.includes('validation')) {
        score = 0.9;
        feedback.push('Correctly identified validation issue');
      } else if (solution.includes('bug') || solution.includes('fix')) {
        score = 0.6;
        feedback.push('Identified some issues');
      } else {
        score = 0.3;
        feedback.push('Review the code more carefully');
      }
      break;
    
    case 'pattern-recognition':
      if (solution === gameData.answer.toString()) {
        score = 1.0;
        feedback.push('Perfect! Pattern correctly identified');
      } else if (solution && !isNaN(solution)) {
        score = 0.5;
        feedback.push('Close, but not quite right');
      } else {
        score = 0.2;
        feedback.push('Try to identify the mathematical pattern');
      }
      break;
  }

  return {
    score,
    feedback,
    timestamp: new Date().toISOString()
  };
}

function updateLeaderboard(gameSession) {
  const { gameType } = gameSession;
  
  if (!mockLeaderboards.has(gameType)) {
    mockLeaderboards.set(gameType, []);
  }

  const leaderboard = mockLeaderboards.get(gameType);
  
  // Remove existing entry for this candidate
  const existingIndex = leaderboard.findIndex(entry => entry.candidateId === gameSession.candidateId);
  if (existingIndex !== -1) {
    leaderboard.splice(existingIndex, 1);
  }

  // Add new entry
  leaderboard.push({
    candidateId: gameSession.candidateId,
    gameType: gameSession.gameType,
    score: gameSession.score,
    timeSpent: gameSession.timeSpent,
    attempts: gameSession.attempts,
    completedAt: gameSession.endTime
  });

  // Sort by score (descending) and then by time (ascending)
  leaderboard.sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    return a.timeSpent - b.timeSpent;
  });
}

module.exports = router;
