const express = require('express');
const { body, validationResult } = require('express-validator');

const embeddingService = require('../services/embeddingService');
const pineconeService = require('../services/pineconeService');
const Candidate = require('../models/Candidate');
const Job = require('../models/Job');

const router = express.Router();

// Match candidates to a job description
router.post('/match', [
  body('job_description').notEmpty().withMessage('Job description is required'),
  body('job_title').notEmpty().withMessage('Job title is required'),
  body('required_skills').isArray().withMessage('Required skills must be an array'),
  body('top_k').optional().isInt({ min: 1, max: 50 }).withMessage('Top K must be between 1 and 50')
], async (req, res) => {
  try {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { job_description, job_title, required_skills, top_k = 10 } = req.body;

    console.log('🔍 Starting candidate matching for:', job_title);

    // Create job text for embedding
    const jobText = `
      ${job_title}
      Description: ${job_description}
      Required Skills: ${required_skills.join(', ')}
    `.trim();

    // Generate embedding for job
    const embeddingResult = await embeddingService.generateEmbedding(jobText);
    
    if (!embeddingResult.success) {
      return res.status(500).json({
        status: 'error',
        message: 'Failed to generate job embedding',
        error: embeddingResult.error
      });
    }

    // Search for similar candidates in Pinecone
    const searchResult = await pineconeService.searchVectors(
      embeddingResult.embedding,
      top_k,
      { type: 'candidate' }
    );

    if (!searchResult.success) {
      return res.status(500).json({
        status: 'error',
        message: 'Failed to search candidates',
        error: searchResult.error
      });
    }

    // Get detailed candidate information
    const candidateIds = searchResult.matches.map(match => match.metadata.candidate_id);
    const candidates = await Candidate.findAll({
      where: { id: candidateIds },
      attributes: ['id', 'name', 'email', 'skills', 'normalized_skills', 'experience', 'education', 'location']
    });

    // Calculate skill match percentages
    const candidatesWithScores = candidates.map(candidate => {
      const match = searchResult.matches.find(m => m.metadata.candidate_id === candidate.id);
      const similarityScore = match ? match.score : 0;
      
      // Calculate skill match percentage
      const candidateSkills = candidate.skills.map(skill => skill.toLowerCase());
      const requiredSkillsLower = required_skills.map(skill => skill.toLowerCase());
      const matchedSkills = requiredSkillsLower.filter(skill => 
        candidateSkills.some(candidateSkill => 
          candidateSkill.includes(skill) || skill.includes(candidateSkill)
        )
      );
      const skillMatchPercentage = (matchedSkills.length / required_skills.length) * 100;

      return {
        ...candidate.toJSON(),
        similarity_score: similarityScore,
        skill_match_percentage: Math.round(skillMatchPercentage),
        matched_skills: matchedSkills,
        missing_skills: required_skillsLower.filter(skill => 
          !matchedSkills.includes(skill)
        )
      };
    });

    // Sort by similarity score (descending)
    candidatesWithScores.sort((a, b) => b.similarity_score - a.similarity_score);

    res.json({
      status: 'success',
      message: `Found ${candidatesWithScores.length} matching candidates`,
      data: {
        job_title,
        total_candidates: candidatesWithScores.length,
        candidates: candidatesWithScores
      }
    });

  } catch (error) {
    console.error('❌ Matching error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to match candidates',
      error: error.message
    });
  }
});

// Create job posting with embedding
router.post('/jobs', [
  body('title').notEmpty().withMessage('Job title is required'),
  body('company').notEmpty().withMessage('Company name is required'),
  body('description').notEmpty().withMessage('Job description is required'),
  body('skills').isArray().withMessage('Skills must be an array'),
  body('requirements').isArray().withMessage('Requirements must be an array')
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

    const {
      title,
      company,
      description,
      skills,
      requirements,
      location,
      salary_range,
      job_type = 'full-time',
      experience_level = 'mid',
      recruiter_id
    } = req.body;

    // Create job
    const job = await Job.create({
      title,
      company,
      description,
      skills,
      requirements,
      location,
      salary_range,
      job_type,
      experience_level,
      recruiter_id
    });

    // Generate embedding for job
    const embeddingResult = await embeddingService.generateJobEmbedding(job);
    
    if (embeddingResult.success) {
      // Store in Pinecone
      const pineconeId = `job_${job.id}`;
      await pineconeService.upsertVector(pineconeId, embeddingResult.embedding, {
        type: 'job',
        job_id: job.id,
        title: job.title,
        company: job.company
      });

      // Update job with embedding and Pinecone ID
      await job.update({
        embedding_vector: JSON.stringify(embeddingResult.embedding),
        pinecone_id: pineconeId
      });
    }

    res.json({
      status: 'success',
      message: 'Job created successfully',
      data: job
    });

  } catch (error) {
    console.error('❌ Create job error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to create job',
      error: error.message
    });
  }
});

// Get all jobs
router.get('/jobs', async (req, res) => {
  try {
    const { page = 1, limit = 10, status = 'active' } = req.query;
    const offset = (page - 1) * limit;

    const jobs = await Job.findAndCountAll({
      where: { status },
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['created_at', 'DESC']]
    });

    res.json({
      status: 'success',
      data: {
        jobs: jobs.rows,
        total: jobs.count,
        page: parseInt(page),
        totalPages: Math.ceil(jobs.count / limit)
      }
    });
  } catch (error) {
    console.error('❌ Get jobs error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve jobs',
      error: error.message
    });
  }
});

// Get job by ID
router.get('/jobs/:id', async (req, res) => {
  try {
    const job = await Job.findByPk(req.params.id);
    
    if (!job) {
      return res.status(404).json({
        status: 'error',
        message: 'Job not found'
      });
    }

    res.json({
      status: 'success',
      data: job
    });
  } catch (error) {
    console.error('❌ Get job error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve job',
      error: error.message
    });
  }
});

module.exports = router;
