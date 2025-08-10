const express = require('express');
const router = express.Router();

// Import models
const Challenge = require('../models/Challenge');
const Application = require('../models/Application');

// Import middleware
const auth = require('../middleware/auth');
const { checkRole } = require('../middleware/roles');

// @route   GET /api/challenges/active
// @desc    Get the currently active challenge
// @access  Public
router.get('/active', async (req, res) => {
  try {
    const activeChallenge = await Challenge.getActive();
    
    if (!activeChallenge) {
      return res.status(404).json({ error: 'No active challenge available' });
    }

    // Return challenge without test cases for security
    const challengeData = {
      id: activeChallenge._id,
      title: activeChallenge.title,
      description: activeChallenge.description,
      type: activeChallenge.type,
      difficulty: activeChallenge.difficulty,
      problem: {
        statement: activeChallenge.problem.statement,
        examples: activeChallenge.problem.examples,
        constraints: activeChallenge.problem.constraints,
        notes: activeChallenge.problem.notes
      },
      requirements: {
        languages: activeChallenge.requirements.languages,
        timeLimit: activeChallenge.requirements.timeLimit,
        memoryLimit: activeChallenge.requirements.memoryLimit,
        submissionFormat: activeChallenge.requirements.submissionFormat
      },
      template: activeChallenge.template,
      evaluation: activeChallenge.evaluation,
      stats: {
        totalAssignments: activeChallenge.stats.totalAssignments,
        totalCompletions: activeChallenge.stats.totalCompletions,
        averageScore: activeChallenge.stats.averageScore,
        completionRate: activeChallenge.completionRate
      }
    };

    res.json(challengeData);
  } catch (error) {
    console.error('Get active challenge error:', error);
    res.status(500).json({ error: 'Failed to fetch active challenge' });
  }
});

// @route   GET /api/challenges/active/with-test-cases
// @desc    Get active challenge with test cases (for evaluation)
// @access  Private (Admin/Recruiter)
router.get('/active/with-test-cases', auth, checkRole(['admin', 'recruiter']), async (req, res) => {
  try {
    const activeChallenge = await Challenge.getActive();
    
    if (!activeChallenge) {
      return res.status(404).json({ error: 'No active challenge available' });
    }

    res.json(activeChallenge);
  } catch (error) {
    console.error('Get active challenge with test cases error:', error);
    res.status(500).json({ error: 'Failed to fetch active challenge' });
  }
});

// @route   POST /api/challenges
// @desc    Create a new challenge
// @access  Private (Admin)
router.post('/', auth, checkRole(['admin']), async (req, res) => {
  try {
    const {
      title,
      description,
      type,
      difficulty,
      problem,
      requirements,
      testCases,
      template,
      evaluation
    } = req.body;

    const challenge = new Challenge({
      title,
      description,
      type,
      difficulty,
      problem,
      requirements,
      testCases,
      template,
      evaluation
    });

    await challenge.save();

    res.status(201).json({
      message: 'Challenge created successfully',
      challenge: {
        id: challenge._id,
        title: challenge.title,
        status: challenge.status
      }
    });
  } catch (error) {
    console.error('Create challenge error:', error);
    res.status(500).json({ error: 'Failed to create challenge' });
  }
});

// @route   PUT /api/challenges/:challengeId/activate
// @desc    Activate a challenge (deactivates all others)
// @access  Private (Admin)
router.put('/:challengeId/activate', auth, checkRole(['admin']), async (req, res) => {
  try {
    const { challengeId } = req.params;

    const challenge = await Challenge.findById(challengeId);
    if (!challenge) {
      return res.status(404).json({ error: 'Challenge not found' });
    }

    await challenge.activate();

    res.json({
      message: 'Challenge activated successfully',
      challenge: {
        id: challenge._id,
        title: challenge.title,
        status: challenge.status,
        isActive: challenge.isActive
      }
    });
  } catch (error) {
    console.error('Activate challenge error:', error);
    res.status(500).json({ error: 'Failed to activate challenge' });
  }
});

// @route   PUT /api/challenges/:challengeId/deactivate
// @desc    Deactivate a challenge
// @access  Private (Admin)
router.put('/:challengeId/deactivate', auth, checkRole(['admin']), async (req, res) => {
  try {
    const { challengeId } = req.params;

    const challenge = await Challenge.findById(challengeId);
    if (!challenge) {
      return res.status(404).json({ error: 'Challenge not found' });
    }

    await challenge.deactivate();

    res.json({
      message: 'Challenge deactivated successfully',
      challenge: {
        id: challenge._id,
        title: challenge.title,
        status: challenge.status,
        isActive: challenge.isActive
      }
    });
  } catch (error) {
    console.error('Deactivate challenge error:', error);
    res.status(500).json({ error: 'Failed to deactivate challenge' });
  }
});

// @route   GET /api/challenges
// @desc    Get all challenges
// @access  Private (Admin)
router.get('/', auth, checkRole(['admin']), async (req, res) => {
  try {
    const challenges = await Challenge.find()
      .sort({ createdAt: -1 });

    res.json(challenges);
  } catch (error) {
    console.error('Get challenges error:', error);
    res.status(500).json({ error: 'Failed to fetch challenges' });
  }
});

// @route   GET /api/challenges/:challengeId
// @desc    Get specific challenge
// @access  Private (Admin)
router.get('/:challengeId', auth, checkRole(['admin']), async (req, res) => {
  try {
    const { challengeId } = req.params;

    const challenge = await Challenge.findById(challengeId);
    if (!challenge) {
      return res.status(404).json({ error: 'Challenge not found' });
    }

    res.json(challenge);
  } catch (error) {
    console.error('Get challenge error:', error);
    res.status(500).json({ error: 'Failed to fetch challenge' });
  }
});

// @route   PUT /api/challenges/:challengeId
// @desc    Update a challenge
// @access  Private (Admin)
router.put('/:challengeId', auth, checkRole(['admin']), async (req, res) => {
  try {
    const { challengeId } = req.params;
    const updateData = req.body;

    const challenge = await Challenge.findByIdAndUpdate(
      challengeId,
      updateData,
      { new: true, runValidators: true }
    );

    if (!challenge) {
      return res.status(404).json({ error: 'Challenge not found' });
    }

    res.json({
      message: 'Challenge updated successfully',
      challenge: {
        id: challenge._id,
        title: challenge.title,
        status: challenge.status
      }
    });
  } catch (error) {
    console.error('Update challenge error:', error);
    res.status(500).json({ error: 'Failed to update challenge' });
  }
});

// @route   DELETE /api/challenges/:challengeId
// @desc    Delete a challenge
// @access  Private (Admin)
router.delete('/:challengeId', auth, checkRole(['admin']), async (req, res) => {
  try {
    const { challengeId } = req.params;

    const challenge = await Challenge.findById(challengeId);
    if (!challenge) {
      return res.status(404).json({ error: 'Challenge not found' });
    }

    if (challenge.isActive) {
      return res.status(400).json({ error: 'Cannot delete active challenge' });
    }

    await Challenge.findByIdAndDelete(challengeId);

    res.json({
      message: 'Challenge deleted successfully'
    });
  } catch (error) {
    console.error('Delete challenge error:', error);
    res.status(500).json({ error: 'Failed to delete challenge' });
  }
});

// @route   GET /api/challenges/stats
// @desc    Get challenge statistics
// @access  Private (Admin/Recruiter)
router.get('/stats', auth, checkRole(['admin', 'recruiter']), async (req, res) => {
  try {
    const activeChallenge = await Challenge.getActive();
    
    if (!activeChallenge) {
      return res.json({
        activeChallenge: null,
        totalChallenges: 0,
        totalAssignments: 0,
        totalCompletions: 0,
        averageScore: 0
      });
    }

    const totalChallenges = await Challenge.countDocuments();
    const totalAssignments = activeChallenge.stats.totalAssignments;
    const totalCompletions = activeChallenge.stats.totalCompletions;
    const averageScore = activeChallenge.stats.averageScore;

    res.json({
      activeChallenge: {
        id: activeChallenge._id,
        title: activeChallenge.title,
        difficulty: activeChallenge.difficulty,
        type: activeChallenge.type
      },
      totalChallenges,
      totalAssignments,
      totalCompletions,
      averageScore,
      completionRate: activeChallenge.completionRate
    });
  } catch (error) {
    console.error('Get challenge stats error:', error);
    res.status(500).json({ error: 'Failed to fetch challenge statistics' });
  }
});

// @route   GET /api/challenges/assignments
// @desc    Get all challenge assignments
// @access  Private (Admin/Recruiter)
router.get('/assignments', auth, checkRole(['admin', 'recruiter']), async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;

    const query = { 'challenge.challengeId': { $exists: true } };
    if (status) {
      query.status = status;
    }

    const applications = await Application.find(query)
      .populate('candidateId', 'name email')
      .populate('jobId', 'title company')
      .populate('challenge.challengeId', 'title difficulty')
      .sort({ 'challenge.assignedAt': -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Application.countDocuments(query);

    res.json({
      applications,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get challenge assignments error:', error);
    res.status(500).json({ error: 'Failed to fetch challenge assignments' });
  }
});

module.exports = router;
