const express = require('express');
const router = express.Router();
const aiMatchingService = require('../services/aiMatching');
const { v4: uuidv4 } = require('uuid');

// Mock data for demo purposes
const mockCandidates = [
  {
    id: 'candidate-001',
    name: 'Dr. Sarah Chen',
    skills: ['python', 'tensorflow', 'pytorch', 'deep learning', 'neural networks', 'nlp', 'research', 'phd'],
    experience: '5+ years',
    region: 'San Francisco, CA',
    availability: 'immediate',
    education: 'PhD Computer Science, Stanford',
    publications: 12,
    matchScore: 0
  },
  {
    id: 'candidate-002',
    name: 'Alex Rodriguez',
    skills: ['python', 'scikit-learn', 'pandas', 'numpy', 'mlops', 'docker', 'kubernetes', 'aws'],
    experience: '3+ years',
    region: 'New York, NY',
    availability: '2 weeks',
    education: 'MS Data Science, Columbia',
    publications: 3,
    matchScore: 0
  },
  {
    id: 'candidate-003',
    name: 'Dr. Michael Kim',
    skills: ['python', 'tensorflow', 'computer vision', 'cnn', 'opencv', 'research', 'phd', 'publications'],
    experience: '7+ years',
    region: 'Seattle, WA',
    availability: '1 month',
    education: 'PhD Computer Vision, MIT',
    publications: 18,
    matchScore: 0
  },
  {
    id: 'candidate-004',
    name: 'Emily Watson',
    skills: ['python', 'pandas', 'numpy', 'matplotlib', 'seaborn', 'statistics', 'data analysis', 'sql'],
    experience: '2+ years',
    region: 'Austin, TX',
    availability: 'immediate',
    education: 'BS Statistics, UT Austin',
    publications: 1,
    matchScore: 0
  },
  {
    id: 'candidate-005',
    name: 'David Park',
    skills: ['python', 'tensorflow', 'pytorch', 'nlp', 'bert', 'transformers', 'deployment', 'mlops'],
    experience: '4+ years',
    region: 'Boston, MA',
    availability: '3 weeks',
    education: 'MS Machine Learning, Harvard',
    publications: 6,
    matchScore: 0
  }
];

const mockJobs = [
  {
    id: 'job-001',
    title: 'Senior ML Engineer',
    company: 'TechCorp AI',
    requirements: ['python', 'tensorflow', 'deep learning', 'mlops', 'deployment', 'senior'],
    location: 'San Francisco, CA',
    type: 'full-time',
    salary: '$150k-$200k',
    description: 'Leading ML model development and deployment for production systems'
  },
  {
    id: 'job-002',
    title: 'Research Scientist - NLP',
    company: 'AI Research Lab',
    requirements: ['python', 'nlp', 'research', 'phd', 'publications', 'transformers'],
    location: 'Remote',
    type: 'full-time',
    salary: '$120k-$180k',
    description: 'Cutting-edge NLP research with focus on transformer architectures'
  },
  {
    id: 'job-003',
    title: 'Data Scientist',
    company: 'DataTech Solutions',
    requirements: ['python', 'pandas', 'numpy', 'statistics', 'data analysis', 'sql'],
    location: 'New York, NY',
    type: 'full-time',
    salary: '$100k-$140k',
    description: 'Data analysis and insights generation for business decisions'
  }
];

// Get all candidates with AI matching scores for a specific job
router.post('/candidates-for-job', async (req, res) => {
  try {
    const { jobId, limit = 20 } = req.body;
    
    if (!jobId) {
      return res.status(400).json({ error: 'Job ID is required' });
    }
    
    const job = mockJobs.find(j => j.id === jobId);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }
    
    // Calculate AI matching scores for all candidates
    const candidatesWithScores = [];
    
    for (const candidate of mockCandidates) {
      const matchResult = await aiMatchingService.calculateMatch(
        candidate.skills, 
        job.requirements
      );
      
      candidatesWithScores.push({
        ...candidate,
        matchResult,
        matchScore: matchResult.matchPercentage
      });
    }
    
    // Rank candidates by match score
    const rankedCandidates = await aiMatchingService.rankCandidates(
      candidatesWithScores, 
      job.requirements
    );
    
    // Apply filters and pagination
    const filteredCandidates = rankedCandidates
      .filter(candidate => candidate.matchScore >= 60) // Only show candidates with 60%+ match
      .slice(0, limit);
    
    res.json({
      job,
      candidates: filteredCandidates,
      totalCandidates: filteredCandidates.length,
      averageMatchScore: Math.round(
        filteredCandidates.reduce((sum, c) => sum + c.matchScore, 0) / filteredCandidates.length
      )
    });
    
  } catch (error) {
    console.error('Error matching candidates to job:', error);
    res.status(500).json({ error: 'Failed to match candidates to job' });
  }
});

// Get top candidates across all jobs
router.get('/top-candidates', async (req, res) => {
  try {
    const { limit = 10, region, availability } = req.query;
    
    // Calculate average match scores across all jobs
    const candidatesWithScores = [];
    
    for (const candidate of mockCandidates) {
      let totalScore = 0;
      let jobCount = 0;
      
      for (const job of mockJobs) {
        const matchResult = await aiMatchingService.calculateMatch(
          candidate.skills, 
          job.requirements
        );
        totalScore += matchResult.matchPercentage;
        jobCount++;
      }
      
      const averageScore = Math.round(totalScore / jobCount);
      
      candidatesWithScores.push({
        ...candidate,
        averageMatchScore: averageScore,
        topMatchScore: Math.max(...mockJobs.map(job => 
          aiMatchingService.calculateMatch(candidate.skills, job.requirements)
        ).map(match => match.matchPercentage))
      });
    }
    
    // Apply filters
    let filteredCandidates = candidatesWithScores;
    
    if (region) {
      filteredCandidates = filteredCandidates.filter(candidate => 
        candidate.region.toLowerCase().includes(region.toLowerCase())
      );
    }
    
    if (availability) {
      filteredCandidates = filteredCandidates.filter(candidate => 
        candidate.availability.toLowerCase().includes(availability.toLowerCase())
      );
    }
    
    // Sort by average match score and return top candidates
    const topCandidates = filteredCandidates
      .sort((a, b) => b.averageMatchScore - a.averageMatchScore)
      .slice(0, parseInt(limit));
    
    res.json({
      candidates: topCandidates,
      totalCandidates: topCandidates.length,
      filters: { region, availability },
      averageScore: Math.round(
        topCandidates.reduce((sum, c) => sum + c.averageMatchScore, 0) / topCandidates.length
      )
    });
    
  } catch (error) {
    console.error('Error getting top candidates:', error);
    res.status(500).json({ error: 'Failed to get top candidates' });
  }
});

// Get candidate recommendations for a specific job
router.post('/job-recommendations', async (req, res) => {
  try {
    const { jobId, candidateCount = 5 } = req.body;
    
    if (!jobId) {
      return res.status(400).json({ error: 'Job ID is required' });
    }
    
    const job = mockJobs.find(j => j.id === jobId);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }
    
    // Get AI-powered recommendations
    const recommendations = await aiMatchingService.rankCandidates(
      mockCandidates, 
      job.requirements
    );
    
    // Apply additional filtering for recommendations
    const filteredRecommendations = recommendations
      .filter(candidate => candidate.matchScore >= 70) // Higher threshold for recommendations
      .slice(0, candidateCount);
    
    res.json({
      job,
      recommendations: filteredRecommendations,
      reasoning: {
        skillMatch: filteredRecommendations.map(c => ({
          candidateId: c.id,
          matchedSkills: c.matchResult.matchedSkills,
          missingSkills: c.matchResult.missingSkills
        })),
        overallInsights: `Found ${filteredRecommendations.length} highly qualified candidates with ${Math.round(
          filteredRecommendations.reduce((sum, c) => sum + c.matchScore, 0) / filteredRecommendations.length
        )}% average match score`
      }
    });
    
  } catch (error) {
    console.error('Error getting job recommendations:', error);
    res.status(500).json({ error: 'Failed to get job recommendations' });
  }
});

// Get candidate insights and skill analysis
router.get('/candidate-insights/:candidateId', async (req, res) => {
  try {
    const { candidateId } = req.params;
    const { jobId } = req.query;
    
    const candidate = mockCandidates.find(c => c.id === candidateId);
    if (!candidate) {
      return res.status(404).json({ error: 'Candidate not found' });
    }
    
    let insights = {
      candidate,
      skillAnalysis: {},
      jobMatches: [],
      recommendations: []
    };
    
    // Analyze skills if job context is provided
    if (jobId) {
      const job = mockJobs.find(j => j.id === jobId);
      if (job) {
        const matchResult = await aiMatchingService.calculateMatch(
          candidate.skills, 
          job.requirements
        );
        
        insights.jobMatch = {
          job,
          matchResult,
          strengths: matchResult.matchedSkills,
          areasForImprovement: matchResult.missingSkills,
          overallScore: matchResult.matchPercentage
        };
      }
    }
    
    // Get skill analysis across all jobs
    const skillAnalysis = {};
    for (const skill of candidate.skills) {
      let totalScore = 0;
      let jobCount = 0;
      
      for (const job of mockJobs) {
        const matchResult = await aiMatchingService.calculateMatch([skill], job.requirements);
        totalScore += matchResult.matchPercentage;
        jobCount++;
      }
      
      skillAnalysis[skill] = {
        demandScore: Math.round(totalScore / jobCount),
        jobRelevance: mockJobs.filter(job => 
          job.requirements.some(req => 
            req.toLowerCase().includes(skill.toLowerCase()) ||
            skill.toLowerCase().includes(req.toLowerCase())
          )
        ).length
      };
    }
    
    insights.skillAnalysis = skillAnalysis;
    
    // Get top job matches
    const jobMatches = [];
    for (const job of mockJobs) {
      const matchResult = await aiMatchingService.calculateMatch(
        candidate.skills, 
        job.requirements
      );
      
      jobMatches.push({
        job,
        matchScore: matchResult.matchPercentage,
        matchedSkills: matchResult.matchedSkills,
        missingSkills: matchResult.missingSkills
      });
    }
    
    insights.jobMatches = jobMatches
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 5);
    
    // Generate improvement recommendations
    const allMissingSkills = new Set();
    jobMatches.forEach(match => {
      match.missingSkills.forEach(skill => allMissingSkills.add(skill));
    });
    
    insights.recommendations = {
      skillImprovements: Array.from(allMissingSkills).slice(0, 5),
      careerSuggestions: this.generateCareerSuggestions(candidate, insights.jobMatches),
      learningPath: this.generateLearningPath(candidate, insights.skillAnalysis)
    };
    
    res.json(insights);
    
  } catch (error) {
    console.error('Error getting candidate insights:', error);
    res.status(500).json({ error: 'Failed to get candidate insights' });
  }
});

// Generate career suggestions based on candidate profile and job matches
function generateCareerSuggestions(candidate, jobMatches) {
  const suggestions = [];
  
  if (candidate.publications > 10) {
    suggestions.push('Consider research-focused roles in academia or research labs');
  }
  
  if (candidate.experience.includes('5+') || candidate.experience.includes('7+')) {
    suggestions.push('Ready for senior/lead positions in ML engineering');
  }
  
  const topJobMatch = jobMatches[0];
  if (topJobMatch && topJobMatch.matchScore > 85) {
    suggestions.push(`Excellent match for ${topJobMatch.job.title} roles`);
  }
  
  if (candidate.skills.includes('mlops') || candidate.skills.includes('deployment')) {
    suggestions.push('Strong fit for production ML engineering roles');
  }
  
  return suggestions;
}

// Generate learning path recommendations
function generateLearningPath(candidate, skillAnalysis) {
  const learningPath = [];
  
  // Identify skills with low demand scores
  const lowDemandSkills = Object.entries(skillAnalysis)
    .filter(([skill, analysis]) => analysis.demandScore < 60)
    .sort((a, b) => a[1].demandScore - b[1].demandScore);
  
  if (lowDemandSkills.length > 0) {
    learningPath.push({
      priority: 'high',
      skill: lowDemandSkills[0][0],
      reason: 'Low market demand, consider upskilling or specialization'
    });
  }
  
  // Recommend complementary skills
  const complementarySkills = {
    'python': ['mlops', 'deployment', 'cloud platforms'],
    'tensorflow': ['pytorch', 'deployment', 'mlops'],
    'nlp': ['computer vision', 'multimodal learning'],
    'data analysis': ['machine learning', 'deep learning']
  };
  
  for (const [skill, complements] of Object.entries(complementarySkills)) {
    if (candidate.skills.includes(skill)) {
      const missingComplements = complements.filter(comp => 
        !candidate.skills.includes(comp)
      );
      
      if (missingComplements.length > 0) {
        learningPath.push({
          priority: 'medium',
          skill: missingComplements[0],
          reason: `Complementary to your strong ${skill} skills`
        });
      }
    }
  }
  
  return learningPath.slice(0, 3); // Top 3 recommendations
}

// Get matching statistics and analytics
router.get('/analytics', async (req, res) => {
  try {
    const analytics = {
      totalCandidates: mockCandidates.length,
      totalJobs: mockJobs.length,
      averageMatchScore: 0,
      skillDemand: {},
      regionDistribution: {},
      experienceDistribution: {}
    };
    
    // Calculate average match scores
    let totalScore = 0;
    let totalMatches = 0;
    
    for (const candidate of mockCandidates) {
      for (const job of mockJobs) {
        const matchResult = await aiMatchingService.calculateMatch(
          candidate.skills, 
          job.requirements
        );
        totalScore += matchResult.matchPercentage;
        totalMatches++;
      }
    }
    
    analytics.averageMatchScore = Math.round(totalScore / totalMatches);
    
    // Analyze skill demand
    const skillDemand = {};
    for (const job of mockJobs) {
      for (const requirement of job.requirements) {
        skillDemand[requirement] = (skillDemand[requirement] || 0) + 1;
      }
    }
    
    analytics.skillDemand = Object.entries(skillDemand)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .reduce((obj, [skill, count]) => {
        obj[skill] = count;
        return obj;
      }, {});
    
    // Analyze region distribution
    const regionCount = {};
    mockCandidates.forEach(candidate => {
      const region = candidate.region.split(',')[0]; // Extract city
      regionCount[region] = (regionCount[region] || 0) + 1;
    });
    
    analytics.regionDistribution = regionCount;
    
    // Analyze experience distribution
    const experienceCount = {};
    mockCandidates.forEach(candidate => {
      experienceCount[candidate.experience] = (experienceCount[candidate.experience] || 0) + 1;
    });
    
    analytics.experienceDistribution = experienceCount;
    
    res.json(analytics);
    
  } catch (error) {
    console.error('Error getting analytics:', error);
    res.status(500).json({ error: 'Failed to get analytics' });
  }
});

module.exports = router;
