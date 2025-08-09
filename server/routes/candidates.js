const express = require('express');
const router = express.Router();
const resumeParserService = require('../services/resumeParser');
const { v4: uuidv4 } = require('uuid');

// Mock data for demo purposes
const mockCandidates = new Map();
const mockResumes = new Map();

// Initialize with some sample candidates
const sampleCandidates = [
  {
    id: 'candidate-001',
    name: 'Alex Chen',
    email: 'alex.chen@email.com',
    region: 'San Francisco, CA',
    availability: 'immediate',
    graduationDate: '2023-05-15',
    skills: ['Python', 'TensorFlow', 'PyTorch', 'Deep Learning', 'Computer Vision'],
    experience: '2 years',
    education: 'MS Computer Science, Stanford University',
    matchScore: 0,
    status: 'active',
    createdAt: '2024-01-15T10:00:00Z'
  },
  {
    id: 'candidate-002',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    region: 'New York, NY',
    availability: '2 weeks',
    graduationDate: '2022-12-10',
    skills: ['Python', 'Scikit-learn', 'Pandas', 'Numpy', 'MLOps', 'AWS'],
    experience: '3 years',
    education: 'BS Data Science, MIT',
    matchScore: 0,
    status: 'active',
    createdAt: '2024-01-14T14:30:00Z'
  },
  {
    id: 'candidate-003',
    name: 'Michael Rodriguez',
    email: 'michael.rodriguez@email.com',
    region: 'Austin, TX',
    availability: '1 month',
    graduationDate: '2021-08-20',
    skills: ['Python', 'PyTorch', 'NLP', 'BERT', 'Transformers', 'Docker'],
    experience: '4 years',
    education: 'PhD Computer Science, UC Berkeley',
    matchScore: 0,
    status: 'active',
    createdAt: '2024-01-13T09:15:00Z'
  }
];

// Initialize mock data
sampleCandidates.forEach(candidate => {
  mockCandidates.set(candidate.id, candidate);
});

// Get all candidates (with pagination and filtering)
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 20, region, availability, skills, status } = req.query;
    
    let candidates = Array.from(mockCandidates.values());
    
    // Apply filters
    if (region) {
      candidates = candidates.filter(c => c.region.toLowerCase().includes(region.toLowerCase()));
    }
    
    if (availability) {
      candidates = candidates.filter(c => c.availability === availability);
    }
    
    if (skills) {
      const skillArray = skills.split(',').map(s => s.trim().toLowerCase());
      candidates = candidates.filter(c => 
        skillArray.some(skill => 
          c.skills.some(candidateSkill => 
            candidateSkill.toLowerCase().includes(skill)
          )
        )
      );
    }
    
    if (status) {
      candidates = candidates.filter(c => c.status === status);
    }
    
    // Sort by match score (descending) and creation date
    candidates.sort((a, b) => {
      if (b.matchScore !== a.matchScore) {
        return b.matchScore - a.matchScore;
      }
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
    
    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedCandidates = candidates.slice(startIndex, endIndex);
    
    res.json({
      success: true,
      candidates: paginatedCandidates,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: candidates.length,
        totalPages: Math.ceil(candidates.length / limit)
      }
    });

  } catch (error) {
    console.error('Get candidates error:', error);
    res.status(500).json({ error: 'Failed to get candidates' });
  }
});

// Get candidate by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const candidate = mockCandidates.get(id);
    if (!candidate) {
      return res.status(404).json({ error: 'Candidate not found' });
    }

    res.json({
      success: true,
      candidate
    });

  } catch (error) {
    console.error('Get candidate error:', error);
    res.status(500).json({ error: 'Failed to get candidate' });
  }
});

// Create new candidate
router.post('/', async (req, res) => {
  try {
    const { name, email, region, availability, graduationDate, skills, experience, education } = req.body;
    
    if (!name || !email || !region) {
      return res.status(400).json({ error: 'Name, email, and region are required' });
    }

    const candidateId = `candidate-${uuidv4().split('-')[0]}`;
    const newCandidate = {
      id: candidateId,
      name,
      email,
      region,
      availability: availability || 'flexible',
      graduationDate: graduationDate || null,
      skills: skills || [],
      experience: experience || 'entry-level',
      education: education || 'Not specified',
      matchScore: 0,
      status: 'active',
      createdAt: new Date().toISOString()
    };

    mockCandidates.set(candidateId, newCandidate);

    res.status(201).json({
      success: true,
      candidate: newCandidate,
      message: 'Candidate created successfully'
    });

  } catch (error) {
    console.error('Create candidate error:', error);
    res.status(500).json({ error: 'Failed to create candidate' });
  }
});

// Update candidate
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const candidate = mockCandidates.get(id);
    if (!candidate) {
      return res.status(404).json({ error: 'Candidate not found' });
    }

    // Update allowed fields
    const allowedUpdates = ['name', 'email', 'region', 'availability', 'skills', 'experience', 'education', 'status'];
    const updatedCandidate = { ...candidate };
    
    allowedUpdates.forEach(field => {
      if (updates[field] !== undefined) {
        updatedCandidate[field] = updates[field];
      }
    });

    updatedCandidate.updatedAt = new Date().toISOString();
    mockCandidates.set(id, updatedCandidate);

    res.json({
      success: true,
      candidate: updatedCandidate,
      message: 'Candidate updated successfully'
    });

  } catch (error) {
    console.error('Update candidate error:', error);
    res.status(500).json({ error: 'Failed to update candidate' });
  }
});

// Upload and parse resume
router.post('/:id/resume', async (req, res) => {
  try {
    const { id } = req.params;
    const { resumeText, fileType = 'text' } = req.body;
    
    if (!resumeText) {
      return res.status(400).json({ error: 'Resume text is required' });
    }

    const candidate = mockCandidates.get(id);
    if (!candidate) {
      return res.status(404).json({ error: 'Candidate not found' });
    }

    // Parse resume
    const parsedResume = await resumeParserService.parseResume(resumeText, fileType);
    
    // Store resume data
    const resumeId = uuidv4();
    const resumeData = {
      id: resumeId,
      candidateId: id,
      originalText: resumeText,
      parsedData: parsedResume,
      uploadedAt: new Date().toISOString(),
      confidence: parsedResume.confidence
    };
    
    mockResumes.set(resumeId, resumeData);

    // Update candidate with parsed information
    const updatedCandidate = {
      ...candidate,
      skills: parsedResume.skills || candidate.skills,
      experience: parsedResume.experience || candidate.experience,
      education: parsedResume.education || candidate.education,
      resumeId,
      updatedAt: new Date().toISOString()
    };

    mockCandidates.set(id, updatedCandidate);

    res.json({
      success: true,
      resumeId,
      parsedData: parsedResume,
      candidate: updatedCandidate,
      message: 'Resume parsed successfully'
    });

  } catch (error) {
    console.error('Resume parsing error:', error);
    res.status(500).json({ error: 'Failed to parse resume' });
  }
});

// Get candidate resume
router.get('/:id/resume', async (req, res) => {
  try {
    const { id } = req.params;
    
    const candidate = mockCandidates.get(id);
    if (!candidate) {
      return res.status(404).json({ error: 'Candidate not found' });
    }

    if (!candidate.resumeId) {
      return res.status(404).json({ error: 'No resume found for this candidate' });
    }

    const resume = mockResumes.get(candidate.resumeId);
    if (!resume) {
      return res.status(404).json({ error: 'Resume not found' });
    }

    res.json({
      success: true,
      resume
    });

  } catch (error) {
    console.error('Get resume error:', error);
    res.status(500).json({ error: 'Failed to get resume' });
  }
});

// Delete candidate
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const candidate = mockCandidates.get(id);
    if (!candidate) {
      return res.status(404).json({ error: 'Candidate not found' });
    }

    // Remove candidate and associated resume
    mockCandidates.delete(id);
    if (candidate.resumeId) {
      mockResumes.delete(candidate.resumeId);
    }

    res.json({
      success: true,
      message: 'Candidate deleted successfully'
    });

  } catch (error) {
    console.error('Delete candidate error:', error);
    res.status(500).json({ error: 'Failed to delete candidate' });
  }
});

// Get candidate statistics
router.get('/:id/stats', async (req, res) => {
  try {
    const { id } = req.params;
    
    const candidate = mockCandidates.get(id);
    if (!candidate) {
      return res.status(404).json({ error: 'Candidate not found' });
    }

    // Calculate statistics
    const totalCandidates = mockCandidates.size;
    const candidatesWithHigherScore = Array.from(mockCandidates.values())
      .filter(c => c.matchScore > candidate.matchScore).length;
    
    const rank = candidatesWithHigherScore + 1;
    const percentile = Math.round((1 - rank / totalCandidates) * 100);

    const stats = {
      candidateId: id,
      matchScore: candidate.matchScore,
      rank,
      percentile,
      totalCandidates,
      skillsCount: candidate.skills.length,
      daysSinceCreated: Math.floor((new Date() - new Date(candidate.createdAt)) / (1000 * 60 * 60 * 24))
    };

    res.json({
      success: true,
      stats
    });

  } catch (error) {
    console.error('Get candidate stats error:', error);
    res.status(500).json({ error: 'Failed to get candidate statistics' });
  }
});

// Search candidates
router.post('/search', async (req, res) => {
  try {
    const { query, filters = {} } = req.body;
    
    if (!query) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    let candidates = Array.from(mockCandidates.values());
    
    // Apply filters
    if (filters.region) {
      candidates = candidates.filter(c => c.region.toLowerCase().includes(filters.region.toLowerCase()));
    }
    
    if (filters.availability) {
      candidates = candidates.filter(c => c.availability === filters.availability);
    }
    
    if (filters.skills && filters.skills.length > 0) {
      candidates = candidates.filter(c => 
        filters.skills.some(skill => 
          c.skills.some(candidateSkill => 
            candidateSkill.toLowerCase().includes(skill.toLowerCase())
          )
        )
      );
    }

    // Simple text search across name, skills, and education
    const searchResults = candidates.filter(candidate => {
      const searchableText = [
        candidate.name,
        candidate.skills.join(' '),
        candidate.education,
        candidate.experience
      ].join(' ').toLowerCase();
      
      return query.toLowerCase().split(' ').some(term => 
        searchableText.includes(term)
      );
    });

    // Sort by relevance (simple scoring based on query matches)
    searchResults.sort((a, b) => {
      const aScore = calculateSearchScore(a, query);
      const bScore = calculateSearchScore(b, query);
      return bScore - aScore;
    });

    res.json({
      success: true,
      results: searchResults,
      total: searchResults.length,
      query
    });

  } catch (error) {
    console.error('Search candidates error:', error);
    res.status(500).json({ error: 'Failed to search candidates' });
  }
});

// Helper function to calculate search relevance score
function calculateSearchScore(candidate, query) {
  let score = 0;
  const queryTerms = query.toLowerCase().split(' ');
  
  // Name match (highest weight)
  if (candidate.name.toLowerCase().includes(query.toLowerCase())) {
    score += 10;
  }
  
  // Skills match
  queryTerms.forEach(term => {
    candidate.skills.forEach(skill => {
      if (skill.toLowerCase().includes(term)) {
        score += 5;
      }
    });
  });
  
  // Education match
  queryTerms.forEach(term => {
    if (candidate.education.toLowerCase().includes(term)) {
      score += 3;
    }
  });
  
  // Experience match
  queryTerms.forEach(term => {
    if (candidate.experience.toLowerCase().includes(term)) {
      score += 2;
    }
  });
  
  return score;
}

module.exports = router;
