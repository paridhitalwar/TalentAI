const express = require('express');
const router = express.Router();

// Import models
const Job = require('../models/Job');
const Application = require('../models/Application');

// Import services
const VirtualCandidateService = require('../services/virtualCandidateService');

// Import middleware
const auth = require('../middleware/auth');
const { checkRole } = require('../middleware/roles');

// @route   GET /api/jobs
// @desc    Get all active jobs
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      search, 
      location, 
      type, 
      experience,
      skills,
      remote
    } = req.query;

    const query = { status: 'active' };

    // Search filter
    if (search) {
      query.$text = { $search: search };
    }

    // Location filter
    if (location) {
      query['location.city'] = { $regex: location, $options: 'i' };
    }

    // Job type filter
    if (type) {
      query.type = type;
    }

    // Experience level filter
    if (experience) {
      query['experience.level'] = experience;
    }

    // Skills filter
    if (skills) {
      const skillArray = skills.split(',').map(s => s.trim());
      query['aiRequirements.primarySkills'] = { $in: skillArray };
    }

    // Remote work filter
    if (remote === 'true') {
      query['location.remote'] = true;
    }

    const jobs = await Job.find(query)
      .sort({ postedAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Job.countDocuments(query);

    res.json({
      jobs,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get jobs error:', error);
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
});

// @route   GET /api/jobs/:jobId
// @desc    Get specific job details
// @access  Public
router.get('/:jobId', async (req, res) => {
  try {
    const { jobId } = req.params;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    // Increment view count
    await Job.findByIdAndUpdate(jobId, { $inc: { 'analytics.views': 1 } });

    res.json(job);
  } catch (error) {
    console.error('Get job error:', error);
    res.status(500).json({ error: 'Failed to fetch job' });
  }
});

// @route   POST /api/jobs
// @desc    Create a new job posting
// @access  Private (Recruiter)
router.post('/', auth, checkRole(['recruiter']), async (req, res) => {
  try {
    const {
      title,
      company,
      location,
      type,
      experience,
      salary,
      requirements,
      responsibilities,
      description,
      aiRequirements
    } = req.body;

    const job = new Job({
      title,
      company,
      location,
      type,
      experience,
      salary,
      requirements,
      responsibilities,
      description,
      aiRequirements,
      application: {
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        maxApplications: 1000
      }
    });

    await job.save();

    // Apply virtual candidates to this new job
    try {
      await VirtualCandidateService.applyVirtualCandidatesToJob(job._id, 1000);
    } catch (error) {
      console.error('Error applying virtual candidates:', error);
      // Don't fail the job creation if virtual candidate application fails
    }

    res.status(201).json({
      message: 'Job posted successfully',
      job: {
        id: job._id,
        title: job.title,
        company: job.company.name,
        status: job.status
      }
    });
  } catch (error) {
    console.error('Create job error:', error);
    res.status(500).json({ error: 'Failed to create job' });
  }
});

// @route   PUT /api/jobs/:jobId
// @desc    Update a job posting
// @access  Private (Recruiter)
router.put('/:jobId', auth, checkRole(['recruiter']), async (req, res) => {
  try {
    const { jobId } = req.params;
    const updateData = req.body;

    const job = await Job.findByIdAndUpdate(
      jobId,
      updateData,
      { new: true, runValidators: true }
    );

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    res.json({
      message: 'Job updated successfully',
      job: {
        id: job._id,
        title: job.title,
        status: job.status
      }
    });
  } catch (error) {
    console.error('Update job error:', error);
    res.status(500).json({ error: 'Failed to update job' });
  }
});

// @route   DELETE /api/jobs/:jobId
// @desc    Delete a job posting
// @access  Private (Recruiter)
router.delete('/:jobId', auth, checkRole(['recruiter']), async (req, res) => {
  try {
    const { jobId } = req.params;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    await Job.findByIdAndDelete(jobId);

    res.json({
      message: 'Job deleted successfully'
    });
  } catch (error) {
    console.error('Delete job error:', error);
    res.status(500).json({ error: 'Failed to delete job' });
  }
});

// @route   GET /api/jobs/:jobId/applications
// @desc    Get applications for a specific job
// @access  Private (Recruiter)
router.get('/:jobId/applications', auth, checkRole(['recruiter']), async (req, res) => {
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

// @route   GET /api/jobs/:jobId/top-candidates
// @desc    Get top candidates for a job
// @access  Private (Recruiter)
router.get('/:jobId/top-candidates', auth, checkRole(['recruiter']), async (req, res) => {
  try {
    const { jobId } = req.params;
    const { limit = 1000 } = req.query;

    const applications = await VirtualCandidateService.getTopCandidatesForJob(jobId, parseInt(limit));

    res.json({
      applications,
      total: applications.length
    });
  } catch (error) {
    console.error('Get top candidates error:', error);
    res.status(500).json({ error: 'Failed to fetch top candidates' });
  }
});

// @route   GET /api/jobs/stats/overview
// @desc    Get job statistics overview
// @access  Private (Recruiter)
router.get('/stats/overview', auth, checkRole(['recruiter']), async (req, res) => {
  try {
    const totalJobs = await Job.countDocuments();
    const activeJobs = await Job.countDocuments({ status: 'active' });
    const totalApplications = await Application.countDocuments();
    
    const virtualCandidateStats = await VirtualCandidateService.getVirtualCandidateStats();

    res.json({
      totalJobs,
      activeJobs,
      totalApplications,
      virtualCandidates: virtualCandidateStats
    });
  } catch (error) {
    console.error('Get job stats error:', error);
    res.status(500).json({ error: 'Failed to fetch job statistics' });
  }
});

// @route   POST /api/jobs/:jobId/apply-virtual-candidates
// @desc    Manually apply virtual candidates to a job
// @access  Private (Recruiter)
router.post('/:jobId/apply-virtual-candidates', auth, checkRole(['recruiter']), async (req, res) => {
  try {
    const { jobId } = req.params;
    const { limit = 1000 } = req.body;

    const appliedCount = await VirtualCandidateService.applyVirtualCandidatesToJob(jobId, limit);

    res.json({
      message: `Successfully applied ${appliedCount} virtual candidates`,
      appliedCount
    });
  } catch (error) {
    console.error('Apply virtual candidates error:', error);
    res.status(500).json({ error: 'Failed to apply virtual candidates' });
  }
});

// @route   GET /api/jobs/search/suggestions
// @desc    Get job search suggestions
// @access  Public
router.get('/search/suggestions', async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q || q.length < 2) {
      return res.json({ suggestions: [] });
    }

    const suggestions = await Job.aggregate([
      {
        $match: {
          status: 'active',
          $or: [
            { title: { $regex: q, $options: 'i' } },
            { 'company.name': { $regex: q, $options: 'i' } },
            { 'location.city': { $regex: q, $options: 'i' } }
          ]
        }
      },
      {
        $group: {
          _id: null,
          titles: { $addToSet: '$title' },
          companies: { $addToSet: '$company.name' },
          locations: { $addToSet: '$location.city' }
        }
      }
    ]);

    const result = suggestions[0] || { titles: [], companies: [], locations: [] };
    
    res.json({
      suggestions: {
        titles: result.titles.slice(0, 5),
        companies: result.companies.slice(0, 5),
        locations: result.locations.slice(0, 5)
      }
    });
  } catch (error) {
    console.error('Get search suggestions error:', error);
    res.status(500).json({ error: 'Failed to fetch search suggestions' });
  }
});

module.exports = router;
