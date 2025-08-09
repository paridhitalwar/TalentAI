const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
  // Basic Information
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  location: {
    city: String,
    state: String,
    country: String,
    region: String
  },
  
  // Professional Information
  title: String,
  summary: String,
  experience: {
    years: Number,
    level: {
      type: String,
      enum: ['entry', 'junior', 'mid', 'senior', 'lead', 'principal', 'executive']
    },
    companies: [{
      name: String,
      position: String,
      duration: String,
      description: String,
      startDate: Date,
      endDate: Date,
      current: Boolean
    }]
  },
  
  // Skills and Expertise
  skills: {
    technical: [String],
    soft: [String],
    languages: [String],
    frameworks: [String],
    tools: [String],
    domains: [String]
  },
  
  // Education
  education: [{
    degree: String,
    field: String,
    institution: String,
    graduationYear: Number,
    gpa: Number,
    honors: [String]
  }],
  
  // Certifications
  certifications: [{
    name: String,
    issuer: String,
    date: Date,
    expiryDate: Date,
    credentialId: String
  }],
  
  // Projects and Publications
  projects: [{
    name: String,
    description: String,
    technologies: [String],
    url: String,
    github: String,
    impact: String
  }],
  publications: [{
    title: String,
    authors: [String],
    journal: String,
    date: Date,
    url: String,
    citations: Number
  }],
  
  // Resume and Documents
  resume: {
    originalFile: String,
    parsedData: mongoose.Schema.Types.Mixed,
    confidence: Number,
    lastUpdated: Date
  },
  
  // Assessment Results
  assessments: {
    codingChallenges: [{
      challengeId: String,
      score: Number,
      language: String,
      submittedAt: Date,
      feedback: mongoose.Schema.Types.Mixed
    }],
    communicationTests: [{
      testId: String,
      score: Number,
      completedAt: Date,
      feedback: mongoose.Schema.Types.Mixed
    }],
    puzzleGames: [{
      gameId: String,
      score: Number,
      timeSpent: Number,
      completedAt: Date
    }]
  },
  
  // Matching and Status
  matchScores: [{
    jobId: String,
    score: Number,
    matchedSkills: [String],
    missingSkills: [String],
    calculatedAt: Date
  }],
  
  status: {
    type: String,
    enum: ['active', 'inactive', 'placed', 'blacklisted'],
    default: 'active'
  },
  
  availability: {
    type: String,
    enum: ['immediate', '2-weeks', '1-month', '3-months', 'negotiable'],
    default: 'immediate'
  },
  
  salary: {
    current: Number,
    expected: Number,
    currency: {
      type: String,
      default: 'USD'
    }
  },
  
  preferences: {
    remote: Boolean,
    relocation: Boolean,
    travel: Boolean,
    industries: [String],
    companySize: [String]
  },
  
  // Metadata
  source: String,
  tags: [String],
  notes: String,
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  lastActive: Date
});

// Indexes for efficient querying
candidateSchema.index({ 'skills.technical': 1 });
candidateSchema.index({ 'skills.domains': 1 });
candidateSchema.index({ location: 1 });
candidateSchema.index({ 'experience.level': 1 });
candidateSchema.index({ status: 1 });
candidateSchema.index({ availability: 1 });
candidateSchema.index({ createdAt: -1 });

// Update timestamp on save
candidateSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Virtual for full name
candidateSchema.virtual('fullName').get(function() {
  return this.name;
});

// Virtual for experience summary
candidateSchema.virtual('experienceSummary').get(function() {
  if (this.experience && this.experience.years) {
    return `${this.experience.years}+ years`;
  }
  return 'Not specified';
});

// Method to calculate overall skill score
candidateSchema.methods.calculateSkillScore = function() {
  let score = 0;
  if (this.skills.technical) score += this.skills.technical.length * 2;
  if (this.skills.frameworks) score += this.skills.frameworks.length * 1.5;
  if (this.skills.tools) score += this.skills.tools.length * 1;
  if (this.assessments.codingChallenges.length > 0) {
    const avgScore = this.assessments.codingChallenges.reduce((sum, c) => sum + c.score, 0) / this.assessments.codingChallenges.length;
    score += avgScore * 0.1;
  }
  return Math.round(score);
};

// Method to get top skills
candidateSchema.methods.getTopSkills = function(limit = 5) {
  const allSkills = [
    ...(this.skills.technical || []),
    ...(this.skills.frameworks || []),
    ...(this.skills.tools || [])
  ];
  return allSkills.slice(0, limit);
};

module.exports = mongoose.model('Candidate', candidateSchema);
