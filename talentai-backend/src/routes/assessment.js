const express = require('express');
const { body, validationResult } = require('express-validator');

const assessmentService = require('../services/assessmentService');
const Assessment = require('../models/Assessment');
const Candidate = require('../models/Candidate');
const Job = require('../models/Job');

const router = express.Router();

// Create assessment invitation for high-scoring candidates
router.post('/invite', [
  body('candidate_id').isUUID().withMessage('Valid candidate ID is required'),
  body('job_id').isUUID().withMessage('Valid job ID is required'),
  body('similarity_score').isFloat({ min: 0, max: 1 }).withMessage('Similarity score must be between 0 and 1')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { candidate_id, job_id, similarity_score } = req.body;

    // Check if similarity score meets threshold
    if (similarity_score < 0.85) {
      return res.status(400).json({
        status: 'error',
        message: 'Candidate similarity score must be >= 0.85 to send assessment'
      });
    }

    // Get candidate and job details
    const candidate = await Candidate.findByPk(candidate_id);
    const job = await Job.findByPk(job_id);

    if (!candidate || !job) {
      return res.status(404).json({
        status: 'error',
        message: 'Candidate or job not found'
      });
    }

    // Check if assessment already exists
    const existingAssessment = await Assessment.findOne({
      where: { candidate_id, job_id }
    });

    if (existingAssessment) {
      return res.status(400).json({
        status: 'error',
        message: 'Assessment already exists for this candidate and job'
      });
    }

    // Determine role type based on job title
    const roleType = this.determineRoleType(job.title);

    // Create HackerRank test
    const testResult = await assessmentService.createTest(
      candidate.email,
      job.title,
      roleType
    );

    if (!testResult.success) {
      return res.status(500).json({
        status: 'error',
        message: 'Failed to create HackerRank test',
        error: testResult.error
      });
    }

    // Create assessment record
    const assessment = await Assessment.create({
      candidate_id,
      job_id,
      hackerrank_test_id: testResult.testId,
      test_url: testResult.testUrl,
      status: 'invited',
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      test_details: {
        role_type: roleType,
        similarity_score,
        created_via: 'auto_invite'
      }
    });

    res.json({
      status: 'success',
      message: 'Assessment invitation created successfully',
      data: {
        assessment_id: assessment.id,
        test_url: assessment.test_url,
        expires_at: assessment.expires_at,
        candidate: {
          name: candidate.name,
          email: candidate.email
        },
        job: {
          title: job.title,
          company: job.company
        }
      }
    });

  } catch (error) {
    console.error('❌ Assessment invitation error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to create assessment invitation',
      error: error.message
    });
  }
});

// Get assessment by ID
router.get('/:id', async (req, res) => {
  try {
    const assessment = await Assessment.findByPk(req.params.id, {
      include: [
        { model: Candidate, attributes: ['id', 'name', 'email'] },
        { model: Job, attributes: ['id', 'title', 'company'] }
      ]
    });

    if (!assessment) {
      return res.status(404).json({
        status: 'error',
        message: 'Assessment not found'
      });
    }

    res.json({
      status: 'success',
      data: assessment
    });
  } catch (error) {
    console.error('❌ Get assessment error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve assessment',
      error: error.message
    });
  }
});

// Get assessments by candidate ID
router.get('/candidate/:candidateId', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const assessments = await Assessment.findAndCountAll({
      where: { candidate_id: req.params.candidateId },
      include: [
        { model: Job, attributes: ['id', 'title', 'company'] }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['created_at', 'DESC']]
    });

    res.json({
      status: 'success',
      data: {
        assessments: assessments.rows,
        total: assessments.count,
        page: parseInt(page),
        totalPages: Math.ceil(assessments.count / limit)
      }
    });
  } catch (error) {
    console.error('❌ Get candidate assessments error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve candidate assessments',
      error: error.message
    });
  }
});

// Get assessments by job ID
router.get('/job/:jobId', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const assessments = await Assessment.findAndCountAll({
      where: { job_id: req.params.jobId },
      include: [
        { model: Candidate, attributes: ['id', 'name', 'email'] }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['created_at', 'DESC']]
    });

    res.json({
      status: 'success',
      data: {
        assessments: assessments.rows,
        total: assessments.count,
        page: parseInt(page),
        totalPages: Math.ceil(assessments.count / limit)
      }
    });
  } catch (error) {
    console.error('❌ Get job assessments error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve job assessments',
      error: error.message
    });
  }
});

// Update assessment status
router.patch('/:id/status', [
  body('status').isIn(['invited', 'started', 'completed', 'expired']).withMessage('Invalid status')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { status } = req.body;
    const assessment = await Assessment.findByPk(req.params.id);

    if (!assessment) {
      return res.status(404).json({
        status: 'error',
        message: 'Assessment not found'
      });
    }

    const updateData = { status };

    if (status === 'started' && !assessment.started_at) {
      updateData.started_at = new Date();
    } else if (status === 'completed' && !assessment.completed_at) {
      updateData.completed_at = new Date();
      
      // Get results from HackerRank if available
      if (assessment.hackerrank_test_id) {
        const results = await assessmentService.getTestResults(assessment.hackerrank_test_id);
        if (results.success) {
          updateData.results = results.results;
        }
      }
    }

    await assessment.update(updateData);

    res.json({
      status: 'success',
      message: 'Assessment status updated successfully',
      data: assessment
    });

  } catch (error) {
    console.error('❌ Update assessment status error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to update assessment status',
      error: error.message
    });
  }
});

// Helper function to determine role type
determineRoleType(jobTitle) {
  const title = jobTitle.toLowerCase();
  
  if (title.includes('data') || title.includes('ml') || title.includes('ai')) {
    return 'data_scientist';
  } else if (title.includes('frontend') || title.includes('ui') || title.includes('react')) {
    return 'frontend_developer';
  } else {
    return 'software_engineer';
  }
}

module.exports = router;
