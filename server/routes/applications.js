const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Import models
const Application = require('../models/Application');
const Job = require('../models/Job');
const Candidate = require('../models/Candidate');
const User = require('../models/User');
const Challenge = require('../models/Challenge');

// Import services
const { parseResume } = require('../services/resumeParser');
const { calculateMatch } = require('../services/aiMatching');

// Import middleware
const auth = require('../middleware/auth');
const { checkRole } = require('../middleware/roles');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads/resumes');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['.pdf', '.doc', '.docx'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF, DOC, and DOCX files are allowed'));
    }
  }
});

// @route   POST /api/applications/apply
// @desc    Apply for a job with resume upload
// @access  Private (Candidate)
router.post('/apply', auth, checkRole(['candidate']), upload.single('resume'), async (req, res) => {
  try {
    const { jobId, coverLetter } = req.body;
    const userId = req.user.id;

    // Check if job exists and is active
    const job = await Job.findById(jobId);
    if (!job || job.status !== 'active') {
      return res.status(404).json({ error: 'Job not found or not active' });
    }

    // Check if user already applied
    const existingApplication = await Application.findOne({ jobId, userId });
    if (existingApplication) {
      return res.status(400).json({ error: 'You have already applied for this job' });
    }

    // Get or create candidate profile
    let candidate = await Candidate.findOne({ email: req.user.email });
    if (!candidate) {
      candidate = new Candidate({
        name: req.user.name,
        email: req.user.email,
        phone: req.user.phone || '',
        status: 'active'
      });
      await candidate.save();
    }

    // Parse resume if uploaded
    let parsedResume = null;
    let confidence = 0;
    
    if (req.file) {
      try {
        parsedResume = await parseResume(req.file.path);
        confidence = parsedResume.confidence || 0;
        
        // Update candidate profile with parsed data
        if (parsedResume.skills) {
          candidate.skills = {
            ...candidate.skills,
            technical: [...new Set([...(candidate.skills?.technical || []), ...(parsedResume.skills.technical || [])])],
            soft: [...new Set([...(candidate.skills?.soft || []), ...(parsedResume.skills.soft || [])])]
          };
        }
        
        if (parsedResume.experience) {
          candidate.experience = {
            ...candidate.experience,
            years: parsedResume.experience.years || candidate.experience?.years,
            level: parsedResume.experience.level || candidate.experience?.level
          };
        }
        
        await candidate.save();
      } catch (error) {
        console.error('Resume parsing error:', error);
      }
    }

    // Calculate match score
    const matchScore = await calculateMatch(candidate, job);
    const matchedSkills = candidate.skills?.technical?.filter(skill => 
      job.aiRequirements?.primarySkills?.includes(skill) || 
      job.aiRequirements?.secondarySkills?.includes(skill)
    ) || [];
    
    const missingSkills = job.aiRequirements?.primarySkills?.filter(skill => 
      !candidate.skills?.technical?.includes(skill)
    ) || [];

    // Create application
    const application = new Application({
      jobId,
      candidateId: candidate._id,
      userId,
      resume: {
        originalFile: req.file ? req.file.filename : null,
        parsedData: parsedResume,
        confidence,
        uploadedAt: new Date()
      },
      coverLetter,
      matchScore,
      matchedSkills,
      missingSkills
    });

    await application.save();

    // Update job application count
    await Job.findByIdAndUpdate(jobId, {
      $inc: { 'application.currentApplications': 1 }
    });

    res.json({
      message: 'Application submitted successfully',
      application: {
        id: application._id,
        status: application.status,
        matchScore: application.matchScore,
        appliedAt: application.appliedAt
      }
    });

  } catch (error) {
    console.error('Application error:', error);
    res.status(500).json({ error: 'Failed to submit application' });
  }
});

// @route   GET /api/applications/my-applications
// @desc    Get user's applications
// @access  Private (Candidate)
router.get('/my-applications', auth, checkRole(['candidate']), async (req, res) => {
  try {
    const applications = await Application.find({ userId: req.user.id })
      .populate('jobId', 'title company location salary status')
      .populate('challenge.challengeId', 'title description')
      .sort({ appliedAt: -1 });

    res.json(applications);
  } catch (error) {
    console.error('Get applications error:', error);
    res.status(500).json({ error: 'Failed to fetch applications' });
  }
});

// @route   GET /api/applications/job/:jobId
// @desc    Get applications for a specific job (recruiter only)
// @access  Private (Recruiter)
router.get('/job/:jobId', auth, checkRole(['recruiter']), async (req, res) => {
  try {
    const { jobId } = req.params;
    const { page = 1, limit = 20, status } = req.query;

    const query = { jobId };
    if (status) {
      query.status = status;
    }

    const applications = await Application.find(query)
      .populate('candidateId', 'name email skills experience')
      .populate('userId', 'name email')
      .populate('challenge.challengeId', 'title description')
      .sort({ matchScore: -1, appliedAt: 1 })
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
    console.error('Get job applications error:', error);
    res.status(500).json({ error: 'Failed to fetch applications' });
  }
});

// @route   GET /api/applications/top-candidates/:jobId
// @desc    Get top 1000 candidates for a job
// @access  Private (Recruiter)
router.get('/top-candidates/:jobId', auth, checkRole(['recruiter']), async (req, res) => {
  try {
    const { jobId } = req.params;
    const { limit = 1000 } = req.query;

    const applications = await Application.findTopCandidates(jobId, parseInt(limit));

    res.json({
      applications,
      total: applications.length
    });
  } catch (error) {
    console.error('Get top candidates error:', error);
    res.status(500).json({ error: 'Failed to fetch top candidates' });
  }
});

// @route   PUT /api/applications/:applicationId/accept
// @desc    Accept an application and assign challenge
// @access  Private (Recruiter)
router.put('/:applicationId/accept', auth, checkRole(['recruiter']), async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { notes } = req.body;

    const application = await Application.findById(applicationId)
      .populate('candidateId')
      .populate('jobId');

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    // Get the active challenge
    const activeChallenge = await Challenge.getActive();
    if (!activeChallenge) {
      return res.status(400).json({ error: 'No active challenge available' });
    }

    // Update application status and assign challenge
    await application.updateStatus('accepted', 'Application Accepted', req.user.id, notes);
    await application.assignChallenge(activeChallenge._id, req.user.id);

    // Update challenge stats
    activeChallenge.stats.totalAssignments += 1;
    await activeChallenge.save();

    res.json({
      message: 'Application accepted and challenge assigned',
      application: {
        id: application._id,
        status: application.status,
        challenge: application.challenge
      }
    });

  } catch (error) {
    console.error('Accept application error:', error);
    res.status(500).json({ error: 'Failed to accept application' });
  }
});

// @route   PUT /api/applications/:applicationId/reject
// @desc    Reject an application
// @access  Private (Recruiter)
router.put('/:applicationId/reject', auth, checkRole(['recruiter']), async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { reason } = req.body;

    const application = await Application.findById(applicationId);
    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    await application.updateStatus('rejected', 'Application Rejected', req.user.id, reason);

    res.json({
      message: 'Application rejected',
      application: {
        id: application._id,
        status: application.status
      }
    });

  } catch (error) {
    console.error('Reject application error:', error);
    res.status(500).json({ error: 'Failed to reject application' });
  }
});

// @route   GET /api/applications/:applicationId
// @desc    Get specific application details
// @access  Private
router.get('/:applicationId', auth, async (req, res) => {
  try {
    const { applicationId } = req.params;

    const application = await Application.findById(applicationId)
      .populate('jobId', 'title company location salary requirements')
      .populate('candidateId', 'name email skills experience education')
      .populate('userId', 'name email')
      .populate('challenge.challengeId', 'title description problem requirements')
      .populate('interview.meetingSlot');

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    // Check if user has permission to view this application
    if (req.user.role === 'candidate' && application.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json(application);

  } catch (error) {
    console.error('Get application error:', error);
    res.status(500).json({ error: 'Failed to fetch application' });
  }
});

// @route   POST /api/applications/:applicationId/submit-challenge
// @desc    Submit challenge solution
// @access  Private (Candidate)
router.post('/:applicationId/submit-challenge', auth, checkRole(['candidate']), async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { solution, language, timeSpent } = req.body;

    const application = await Application.findById(applicationId)
      .populate('challenge.challengeId');

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    if (application.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    if (application.status !== 'challenge_assigned') {
      return res.status(400).json({ error: 'No challenge assigned to this application' });
    }

    // Evaluate the solution (simplified for now)
    const score = Math.floor(Math.random() * 40) + 60; // Random score between 60-100

    // Complete the challenge
    await application.completeChallenge(score, {
      solution,
      language,
      timeSpent,
      submittedAt: new Date()
    });

    // Update challenge stats
    if (application.challenge.challengeId) {
      await application.challenge.challengeId.updateStats(score, timeSpent);
    }

    res.json({
      message: 'Challenge submitted successfully',
      application: {
        id: application._id,
        status: application.status,
        challenge: {
          score: application.challenge.score,
          completedAt: application.challenge.completedAt
        }
      }
    });

  } catch (error) {
    console.error('Submit challenge error:', error);
    res.status(500).json({ error: 'Failed to submit challenge' });
  }
});

module.exports = router;
