const express = require('express');
const router = express.Router();
const skillEvaluationService = require('../services/skillEvaluation');
const codingChallengesService = require('../services/codingChallenges');
const { v4: uuidv4 } = require('uuid');

// Mock data for demo purposes
const mockEvaluations = new Map();
const mockCommunicationTests = new Map();

// Submit coding challenge solution
router.post('/coding-challenge', async (req, res) => {
  try {
    const { candidateId, challengeId, solution, language = 'python' } = req.body;
    
    if (!candidateId || !challengeId || !solution) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Get challenge details
    const challenge = codingChallengesService.getChallenge(challengeId);
    if (!challenge) {
      return res.status(404).json({ error: 'Challenge not found' });
    }

    // Evaluate the solution
    const evaluation = await skillEvaluationService.evaluateCodingChallenge(
      candidateId, 
      challengeId, 
      solution, 
      language
    );

    // Store evaluation result
    const evaluationId = uuidv4();
    mockEvaluations.set(evaluationId, {
      id: evaluationId,
      candidateId,
      challengeId,
      solution,
      language,
      evaluation,
      submittedAt: new Date().toISOString(),
      status: 'completed'
    });

    // Update challenge stats
    codingChallengesService.submitSolution(challengeId, candidateId, solution, language);

    res.json({
      success: true,
      evaluationId,
      result: evaluation,
      message: 'Challenge evaluated successfully'
    });

  } catch (error) {
    console.error('Coding challenge evaluation error:', error);
    res.status(500).json({ error: 'Failed to evaluate challenge' });
  }
});

// Start communication test
router.post('/communication-test/start', async (req, res) => {
  try {
    const { candidateId, testType = 'general' } = req.body;
    
    if (!candidateId) {
      return res.status(400).json({ error: 'Candidate ID required' });
    }

    const testId = uuidv4();
    const testSession = {
      id: testId,
      candidateId,
      testType,
      status: 'active',
      startTime: new Date().toISOString(),
      conversation: [],
      currentQuestion: 0,
      questions: generateCommunicationQuestions(testType)
    };

    mockCommunicationTests.set(testId, testSession);

    res.json({
      success: true,
      testId,
      session: testSession,
      message: 'Communication test started'
    });

  } catch (error) {
    console.error('Communication test start error:', error);
    res.status(500).json({ error: 'Failed to start communication test' });
  }
});

// Submit communication test response
router.post('/communication-test/respond', async (req, res) => {
  try {
    const { testId, response, questionIndex } = req.body;
    
    if (!testId || !response || questionIndex === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const testSession = mockCommunicationTests.get(testId);
    if (!testSession) {
      return res.status(404).json({ error: 'Test session not found' });
    }

    if (testSession.status !== 'active') {
      return res.status(400).json({ error: 'Test session is not active' });
    }

    // Add response to conversation
    testSession.conversation.push({
      question: testSession.questions[questionIndex],
      response,
      timestamp: new Date().toISOString()
    });

    // Move to next question or complete test
    if (questionIndex < testSession.questions.length - 1) {
      testSession.currentQuestion = questionIndex + 1;
      
      res.json({
        success: true,
        nextQuestion: testSession.questions[testSession.currentQuestion],
        progress: `${testSession.currentQuestion + 1}/${testSession.questions.length}`,
        message: 'Response recorded'
      });
    } else {
      // Complete the test
      testSession.status = 'completed';
      testSession.endTime = new Date().toISOString();
      
      // Evaluate communication skills
      const communicationScore = await skillEvaluationService.evaluateCommunication(
        testSession.conversation
      );

      testSession.evaluation = communicationScore;

      res.json({
        success: true,
        status: 'completed',
        evaluation: communicationScore,
        message: 'Communication test completed'
      });
    }

  } catch (error) {
    console.error('Communication test response error:', error);
    res.status(500).json({ error: 'Failed to process response' });
  }
});

// Get evaluation results
router.get('/results/:evaluationId', async (req, res) => {
  try {
    const { evaluationId } = req.params;
    
    const evaluation = mockEvaluations.get(evaluationId);
    if (!evaluation) {
      return res.status(404).json({ error: 'Evaluation not found' });
    }

    res.json({
      success: true,
      evaluation
    });

  } catch (error) {
    console.error('Get evaluation results error:', error);
    res.status(500).json({ error: 'Failed to get evaluation results' });
  }
});

// Get communication test results
router.get('/communication-test/:testId', async (req, res) => {
  try {
    const { testId } = req.params;
    
    const testSession = mockCommunicationTests.get(testId);
    if (!testSession) {
      return res.status(404).json({ error: 'Test session not found' });
    }

    res.json({
      success: true,
      testSession
    });

  } catch (error) {
    console.error('Get communication test error:', error);
    res.status(500).json({ error: 'Failed to get test session' });
  }
});

// Get candidate evaluation history
router.get('/candidate/:candidateId/history', async (req, res) => {
  try {
    const { candidateId } = req.params;
    
    const evaluations = Array.from(mockEvaluations.values())
      .filter(eval => eval.candidateId === candidateId);
    
    const communicationTests = Array.from(mockCommunicationTests.values())
      .filter(test => test.candidateId === candidateId);

    res.json({
      success: true,
      evaluations,
      communicationTests,
      summary: {
        totalEvaluations: evaluations.length,
        totalCommunicationTests: communicationTests.length,
        averageScore: evaluations.length > 0 
          ? evaluations.reduce((sum, eval) => sum + eval.evaluation.overallScore, 0) / evaluations.length
          : 0
      }
    });

  } catch (error) {
    console.error('Get candidate history error:', error);
    res.status(500).json({ error: 'Failed to get candidate history' });
  }
});

// Generate communication test questions
function generateCommunicationQuestions(testType) {
  const questionSets = {
    general: [
      "Describe a complex technical concept to a non-technical stakeholder. How would you approach this?",
      "Tell me about a time when you had to work with a difficult team member. How did you handle it?",
      "How do you stay updated with the latest developments in AI/ML?",
      "Describe a project where you had to learn a new technology quickly. What was your process?",
      "How do you handle feedback and criticism on your work?"
    ],
    technical: [
      "Explain the difference between supervised and unsupervised learning to someone new to ML.",
      "How would you explain the concept of overfitting to a junior developer?",
      "Describe your approach to debugging a machine learning model that's performing poorly.",
      "How do you communicate technical trade-offs to business stakeholders?",
      "Explain a complex algorithm you've implemented in simple terms."
    ],
    leadership: [
      "How do you motivate team members when facing tight deadlines?",
      "Describe a situation where you had to make a difficult technical decision. How did you communicate it?",
      "How do you handle conflicts between team members with different technical opinions?",
      "What's your approach to mentoring junior developers?",
      "How do you ensure clear communication across different time zones and cultures?"
    ]
  };

  return questionSets[testType] || questionSets.general;
}

module.exports = router;
