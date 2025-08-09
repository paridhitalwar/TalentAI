const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

// Mock data for demo purposes
const mockJobs = new Map();
const mockApplications = new Map();

// Initialize with some sample jobs
const sampleJobs = [
  {
    id: 'job-001',
    title: 'Senior Machine Learning Engineer',
    company: 'TechCorp AI',
    location: 'San Francisco, CA',
    type: 'full-time',
    salary: '$150,000 - $200,000',
    experience: '3-5 years',
    skills: ['Python', 'TensorFlow', 'PyTorch', 'Deep Learning', 'MLOps', 'AWS'],
    description: 'We are looking for a Senior ML Engineer to join our AI team and help build cutting-edge machine learning models.',
    requirements: [
      'Strong background in machine learning and deep learning',
      'Experience with PyTorch, TensorFlow, or similar frameworks',
      'Knowledge of MLOps and model deployment',
      'Experience with cloud platforms (AWS, GCP, or Azure)',
      'Strong programming skills in Python'
    ],
    responsibilities: [
      'Design and implement machine learning models',
      'Optimize model performance and scalability',
      'Collaborate with data scientists and engineers',
      'Deploy models to production environments'
    ],
    benefits: [
      'Competitive salary and equity',
      'Health, dental, and vision insurance',
      'Flexible work arrangements',
      'Professional development opportunities'
    ],
    status: 'active',
    postedAt: '2024-01-15T10:00:00Z',
    deadline: '2024-02-15T23:59:59Z',
    applications: 0,
    maxApplications: 100
  },
  {
    id: 'job-002',
    title: 'Data Scientist - NLP Specialist',
    company: 'AI Innovations Inc',
    location: 'New York, NY',
    type: 'full-time',
    salary: '$120,000 - $160,000',
    experience: '2-4 years',
    skills: ['Python', 'NLP', 'BERT', 'Transformers', 'Scikit-learn', 'Pandas'],
    description: 'Join our NLP team to develop state-of-the-art language models and text analysis solutions.',
    requirements: [
      'Experience with natural language processing',
      'Knowledge of transformer models (BERT, GPT, etc.)',
      'Strong Python programming skills',
      'Experience with ML libraries (scikit-learn, pandas, numpy)',
      'Understanding of statistical analysis'
    ],
    responsibilities: [
      'Develop and fine-tune NLP models',
      'Analyze and preprocess text data',
      'Evaluate model performance',
      'Collaborate with product teams'
    ],
    benefits: [
      'Competitive salary',
      'Remote work options',
      'Learning and development budget',
      'Team events and activities'
    ],
    status: 'active',
    postedAt: '2024-01-14T14:30:00Z',
    deadline: '2024-02-14T23:59:59Z',
    applications: 0,
    maxApplications: 75
  },
  {
    id: 'job-003',
    title: 'MLOps Engineer',
    company: 'CloudTech Solutions',
    location: 'Austin, TX',
    type: 'full-time',
    salary: '$130,000 - $180,000',
    experience: '3-6 years',
    skills: ['MLOps', 'Kubernetes', 'Docker', 'Python', 'AWS', 'CI/CD'],
    description: 'Help us build robust ML infrastructure and deployment pipelines for production machine learning models.',
    requirements: [
      'Experience with containerization (Docker, Kubernetes)',
      'Knowledge of cloud platforms (AWS, GCP, Azure)',
      'Experience with CI/CD pipelines',
      'Understanding of machine learning workflows',
      'Strong DevOps skills'
    ],
    responsibilities: [
      'Design and implement ML infrastructure',
      'Automate model deployment pipelines',
      'Monitor model performance in production',
      'Ensure system reliability and scalability'
    ],
    benefits: [
      'Competitive salary and benefits',
      'Stock options',
      'Flexible work schedule',
      'Professional development'
    ],
    status: 'active',
    postedAt: '2024-01-13T09:15:00Z',
    deadline: '2024-02-13T23:59:59Z',
    applications: 0,
    maxApplications: 50
  }
];

// Initialize mock data
sampleJobs.forEach(job => {
  mockJobs.set(job.id, job);
});

// Get all jobs (with pagination and filtering)
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 20, location, type, experience, skills, status } = req.query;
    
    let jobs = Array.from(mockJobs.values());
    
    // Apply filters
    if (location) {
      jobs = jobs.filter(j => j.location.toLowerCase().includes(location.toLowerCase()));
    }
    
    if (type) {
      jobs = jobs.filter(j => j.type === type);
    }
    
    if (experience) {
      jobs = jobs.filter(j => j.experience === experience);
    }
    
    if (skills) {
      const skillArray = skills.split(',').map(s => s.trim().toLowerCase());
      jobs = jobs.filter(j => 
        skillArray.some(skill => 
          j.skills.some(jobSkill => 
            jobSkill.toLowerCase().includes(skill)
          )
        )
      );
    }
    
    if (status) {
      jobs = jobs.filter(j => j.status === status);
    }
    
    // Sort by posting date (newest first)
    jobs.sort((a, b) => new Date(b.postedAt) - new Date(a.postedAt));
    
    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedJobs = jobs.slice(startIndex, endIndex);
    
    res.json({
      success: true,
      jobs: paginatedJobs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: jobs.length,
        totalPages: Math.ceil(jobs.length / limit)
      }
    });

  } catch (error) {
    console.error('Get jobs error:', error);
    res.status(500).json({ error: 'Failed to get jobs' });
  }
});

// Get job by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const job = mockJobs.get(id);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    res.json({
      success: true,
      job
    });

  } catch (error) {
    console.error('Get job error:', error);
    res.status(500).json({ error: 'Failed to get job' });
  }
});

// Create new job
router.post('/', async (req, res) => {
  try {
    const { 
      title, company, location, type, salary, experience, skills, 
      description, requirements, responsibilities, benefits, deadline 
    } = req.body;
    
    if (!title || !company || !location || !type) {
      return res.status(400).json({ error: 'Title, company, location, and type are required' });
    }

    const jobId = `job-${uuidv4().split('-')[0]}`;
    const newJob = {
      id: jobId,
      title,
      company,
      location,
      type,
      salary: salary || 'Competitive',
      experience: experience || 'Not specified',
      skills: skills || [],
      description: description || '',
      requirements: requirements || [],
      responsibilities: responsibilities || [],
      benefits: benefits || [],
      status: 'active',
      postedAt: new Date().toISOString(),
      deadline: deadline || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
      applications: 0,
      maxApplications: 100
    };

    mockJobs.set(jobId, newJob);

    res.status(201).json({
      success: true,
      job: newJob,
      message: 'Job created successfully'
    });

  } catch (error) {
    console.error('Create job error:', error);
    res.status(500).json({ error: 'Failed to create job' });
  }
});

// Update job
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const job = mockJobs.get(id);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    // Update allowed fields
    const allowedUpdates = [
      'title', 'company', 'location', 'type', 'salary', 'experience', 
      'skills', 'description', 'requirements', 'responsibilities', 
      'benefits', 'status', 'deadline', 'maxApplications'
    ];
    const updatedJob = { ...job };
    
    allowedUpdates.forEach(field => {
      if (updates[field] !== undefined) {
        updatedJob[field] = updates[field];
      }
    });

    updatedJob.updatedAt = new Date().toISOString();
    mockJobs.set(id, updatedJob);

    res.json({
      success: true,
      job: updatedJob,
      message: 'Job updated successfully'
    });

  } catch (error) {
    console.error('Update job error:', error);
    res.status(500).json({ error: 'Failed to update job' });
  }
});

// Delete job
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const job = mockJobs.get(id);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    // Remove job and associated applications
    mockJobs.delete(id);
    Array.from(mockApplications.values())
      .filter(app => app.jobId === id)
      .forEach(app => mockApplications.delete(app.id));

    res.json({
      success: true,
      message: 'Job deleted successfully'
    });

  } catch (error) {
    console.error('Delete job error:', error);
    res.status(500).json({ error: 'Failed to delete job' });
  }
});

// Apply for a job
router.post('/:id/apply', async (req, res) => {
  try {
    const { id: jobId } = req.params;
    const { candidateId, coverLetter, resumeUrl } = req.body;
    
    if (!candidateId) {
      return res.status(400).json({ error: 'Candidate ID is required' });
    }

    const job = mockJobs.get(jobId);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    if (job.status !== 'active') {
      return res.status(400).json({ error: 'Job is not accepting applications' });
    }

    if (job.applications >= job.maxApplications) {
      return res.status(400).json({ error: 'Job has reached maximum applications' });
    }

    // Check if already applied
    const existingApplication = Array.from(mockApplications.values())
      .find(app => app.jobId === jobId && app.candidateId === candidateId);
    
    if (existingApplication) {
      return res.status(400).json({ error: 'Already applied for this job' });
    }

    const applicationId = uuidv4();
    const application = {
      id: applicationId,
      jobId,
      candidateId,
      coverLetter: coverLetter || '',
      resumeUrl: resumeUrl || '',
      status: 'pending',
      appliedAt: new Date().toISOString(),
      reviewedAt: null,
      notes: ''
    };

    mockApplications.set(applicationId, application);
    
    // Update job application count
    job.applications += 1;
    mockJobs.set(jobId, job);

    res.status(201).json({
      success: true,
      application,
      message: 'Application submitted successfully'
    });

  } catch (error) {
    console.error('Job application error:', error);
    res.status(500).json({ error: 'Failed to submit application' });
  }
});

// Get job applications
router.get('/:id/applications', async (req, res) => {
  try {
    const { id: jobId } = req.params;
    const { status } = req.query;
    
    const job = mockJobs.get(jobId);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    let applications = Array.from(mockApplications.values())
      .filter(app => app.jobId === jobId);
    
    if (status) {
      applications = applications.filter(app => app.status === status);
    }

    // Sort by application date (newest first)
    applications.sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt));

    res.json({
      success: true,
      applications,
      total: applications.length
    });

  } catch (error) {
    console.error('Get job applications error:', error);
    res.status(500).json({ error: 'Failed to get job applications' });
  }
});

// Update application status
router.put('/applications/:applicationId', async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status, notes } = req.body;
    
    const application = mockApplications.get(applicationId);
    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    // Update application
    application.status = status || application.status;
    application.notes = notes || application.notes;
    application.reviewedAt = new Date().toISOString();
    
    mockApplications.set(applicationId, application);

    res.json({
      success: true,
      application,
      message: 'Application status updated successfully'
    });

  } catch (error) {
    console.error('Update application error:', error);
    res.status(500).json({ error: 'Failed to update application' });
  }
});

// Search jobs
router.post('/search', async (req, res) => {
  try {
    const { query, filters = {} } = req.body;
    
    if (!query) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    let jobs = Array.from(mockJobs.values());
    
    // Apply filters
    if (filters.location) {
      jobs = jobs.filter(j => j.location.toLowerCase().includes(filters.location.toLowerCase()));
    }
    
    if (filters.type) {
      jobs = jobs.filter(j => j.type === filters.type);
    }
    
    if (filters.experience) {
      jobs = jobs.filter(j => j.experience === filters.experience);
    }
    
    if (filters.skills && filters.skills.length > 0) {
      jobs = jobs.filter(j => 
        filters.skills.some(skill => 
          j.skills.some(jobSkill => 
            jobSkill.toLowerCase().includes(skill.toLowerCase())
          )
        )
      );
    }

    // Simple text search across title, company, description, and skills
    const searchResults = jobs.filter(job => {
      const searchableText = [
        job.title,
        job.company,
        job.description,
        job.skills.join(' '),
        job.requirements.join(' ')
      ].join(' ').toLowerCase();
      
      return query.toLowerCase().split(' ').some(term => 
        searchableText.includes(term)
      );
    });

    // Sort by relevance (simple scoring based on query matches)
    searchResults.sort((a, b) => {
      const aScore = calculateJobSearchScore(a, query);
      const bScore = calculateJobSearchScore(b, query);
      return bScore - aScore;
    });

    res.json({
      success: true,
      results: searchResults,
      total: searchResults.length,
      query
    });

  } catch (error) {
    console.error('Search jobs error:', error);
    res.status(500).json({ error: 'Failed to search jobs' });
  }
});

// Get job statistics
router.get('/:id/stats', async (req, res) => {
  try {
    const { id: jobId } = req.params;
    
    const job = mockJobs.get(jobId);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    const applications = Array.from(mockApplications.values())
      .filter(app => app.jobId === jobId);

    const stats = {
      jobId,
      totalApplications: applications.length,
      pendingApplications: applications.filter(app => app.status === 'pending').length,
      reviewedApplications: applications.filter(app => app.status !== 'pending').length,
      applicationRate: Math.round((applications.length / job.maxApplications) * 100),
      daysSincePosted: Math.floor((new Date() - new Date(job.postedAt)) / (1000 * 60 * 60 * 24)),
      daysUntilDeadline: Math.floor((new Date(job.deadline) - new Date()) / (1000 * 60 * 60 * 24))
    };

    res.json({
      success: true,
      stats
    });

  } catch (error) {
    console.error('Get job stats error:', error);
    res.status(500).json({ error: 'Failed to get job statistics' });
  }
});

// Helper function to calculate job search relevance score
function calculateJobSearchScore(job, query) {
  let score = 0;
  const queryTerms = query.toLowerCase().split(' ');
  
  // Title match (highest weight)
  if (job.title.toLowerCase().includes(query.toLowerCase())) {
    score += 10;
  }
  
  // Company match
  if (job.company.toLowerCase().includes(query.toLowerCase())) {
    score += 8;
  }
  
  // Skills match
  queryTerms.forEach(term => {
    job.skills.forEach(skill => {
      if (skill.toLowerCase().includes(term)) {
        score += 5;
      }
    });
  });
  
  // Description match
  queryTerms.forEach(term => {
    if (job.description.toLowerCase().includes(term)) {
      score += 3;
    }
  });
  
  // Requirements match
  queryTerms.forEach(term => {
    job.requirements.forEach(req => {
      if (req.toLowerCase().includes(term)) {
        score += 2;
      }
    });
  });
  
  return score;
}

module.exports = router;
