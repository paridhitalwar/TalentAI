const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  // Basic Information
  title: {
    type: String,
    required: true,
    trim: true
  },
  company: {
    name: {
      type: String,
      required: true,
      trim: true
    },
    logo: String,
    website: String,
    size: {
      type: String,
      enum: ['startup', 'small', 'medium', 'large', 'enterprise']
    },
    industry: String,
    description: String
  },
  
  // Location and Type
  location: {
    city: String,
    state: String,
    country: String,
    remote: {
      type: Boolean,
      default: false
    },
    hybrid: {
      type: Boolean,
      default: false
    },
    onsite: {
      type: Boolean,
      default: true
    }
  },
  
  // Job Details
  type: {
    type: String,
    enum: ['full-time', 'part-time', 'contract', 'internship', 'freelance'],
    default: 'full-time'
  },
  
  experience: {
    min: Number,
    max: Number,
    level: {
      type: String,
      enum: ['entry', 'junior', 'mid', 'senior', 'lead', 'principal', 'executive']
    }
  },
  
  // Compensation
  salary: {
    min: Number,
    max: Number,
    currency: {
      type: String,
      default: 'USD'
    },
    equity: Boolean,
    bonus: Boolean,
    benefits: [String]
  },
  
  // Requirements and Skills
  requirements: {
    technical: [String],
    soft: [String],
    education: {
      degree: String,
      field: String,
      required: Boolean
    },
    certifications: [String],
    languages: [String]
  },
  
  // Responsibilities and Duties
  responsibilities: [String],
  duties: [String],
  
  // Description
  description: {
    short: String,
    detailed: String,
    highlights: [String]
  },
  
  // Application Process
  application: {
    deadline: Date,
    maxApplications: Number,
    currentApplications: {
      type: Number,
      default: 0
    },
    process: [String],
    requirements: [String]
  },
  
  // Status and Visibility
  status: {
    type: String,
    enum: ['draft', 'active', 'paused', 'closed', 'filled'],
    default: 'active'
  },
  
  visibility: {
    type: String,
    enum: ['public', 'private', 'invite-only'],
    default: 'public'
  },
  
  // AI Matching
  aiRequirements: {
    primarySkills: [String],
    secondarySkills: [String],
    experienceWeight: Number,
    skillWeight: Number,
    educationWeight: Number,
    locationWeight: Number
  },
  
  // Analytics
  analytics: {
    views: {
      type: Number,
      default: 0
    },
    applications: {
      type: Number,
      default: 0
    },
    matches: {
      type: Number,
      default: 0
    },
    topCandidates: [{
      candidateId: String,
      score: Number,
      matchedAt: Date
    }]
  },
  
  // Metadata
  tags: [String],
  categories: [String],
  urgency: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  
  // Timestamps
  postedAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  expiresAt: Date,
  filledAt: Date
});

// Indexes for efficient querying
jobSchema.index({ title: 'text', 'company.name': 'text', description: 'text' });
jobSchema.index({ 'location.city': 1, 'location.state': 1, 'location.country': 1 });
jobSchema.index({ 'experience.level': 1 });
jobSchema.index({ status: 1 });
jobSchema.index({ 'company.industry': 1 });
jobSchema.index({ postedAt: -1 });
jobSchema.index({ 'aiRequirements.primarySkills': 1 });

// Update timestamp on save
jobSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Virtual for salary range
jobSchema.virtual('salaryRange').get(function() {
  if (this.salary.min && this.salary.max) {
    return `${this.salary.currency}${this.salary.min.toLocaleString()} - ${this.salary.currency}${this.salary.max.toLocaleString()}`;
  } else if (this.salary.min) {
    return `${this.salary.currency}${this.salary.min.toLocaleString()}+`;
  }
  return 'Not specified';
});

// Virtual for experience range
jobSchema.virtual('experienceRange').get(function() {
  if (this.experience.min && this.experience.max) {
    return `${this.experience.min}-${this.experience.max} years`;
  } else if (this.experience.min) {
    return `${this.experience.min}+ years`;
  }
  return 'Not specified';
});

// Virtual for location summary
jobSchema.virtual('locationSummary').get(function() {
  const parts = [];
  if (this.location.city) parts.push(this.location.city);
  if (this.location.state) parts.push(this.location.state);
  if (this.location.country) parts.push(this.location.country);
  
  if (this.location.remote) parts.push('Remote');
  if (this.location.hybrid) parts.push('Hybrid');
  
  return parts.join(', ') || 'Not specified';
});

// Method to check if job is active
jobSchema.methods.isActive = function() {
  return this.status === 'active' && 
         (!this.application.deadline || new Date() < this.application.deadline) &&
         this.application.currentApplications < this.application.maxApplications;
};

// Method to increment application count
jobSchema.methods.incrementApplications = function() {
  if (this.application.currentApplications < this.application.maxApplications) {
    this.application.currentApplications += 1;
    return true;
  }
  return false;
};

// Method to get match score for a candidate
jobSchema.methods.calculateMatchScore = function(candidateSkills, candidateExperience) {
  let score = 0;
  
  // Skill matching
  if (this.aiRequirements.primarySkills) {
    const primaryMatches = this.aiRequirements.primarySkills.filter(skill => 
      candidateSkills.includes(skill)
    ).length;
    score += (primaryMatches / this.aiRequirements.primarySkills.length) * 40;
  }
  
  if (this.aiRequirements.secondarySkills) {
    const secondaryMatches = this.aiRequirements.secondarySkills.filter(skill => 
      candidateSkills.includes(skill)
    ).length;
    score += (secondaryMatches / this.aiRequirements.secondarySkills.length) * 20;
  }
  
  // Experience matching
  if (this.experience.level && candidateExperience) {
    const levelScores = {
      'entry': 0, 'junior': 20, 'mid': 40, 'senior': 60, 'lead': 80, 'principal': 90, 'executive': 100
    };
    const candidateLevel = this.getExperienceLevel(candidateExperience);
    const levelDiff = Math.abs(levelScores[this.experience.level] - levelScores[candidateLevel]);
    score += Math.max(0, 20 - levelDiff);
  }
  
  return Math.round(Math.min(100, score));
};

// Helper method to determine experience level
jobSchema.methods.getExperienceLevel = function(years) {
  if (years < 1) return 'entry';
  if (years < 3) return 'junior';
  if (years < 5) return 'mid';
  if (years < 8) return 'senior';
  if (years < 12) return 'lead';
  if (years < 15) return 'principal';
  return 'executive';
};

module.exports = mongoose.model('Job', jobSchema);
