const mongoose = require('mongoose');

const challengeSchema = new mongoose.Schema({
  // Basic Information
  title: {
    type: String,
    required: true,
    trim: true
  },
  
  description: {
    type: String,
    required: true
  },
  
  // Challenge Type
  type: {
    type: String,
    enum: ['coding', 'algorithm', 'system_design', 'take_home', 'live_coding'],
    default: 'coding'
  },
  
  // Difficulty Level
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard', 'expert'],
    default: 'medium'
  },
  
  // Challenge Content
  problem: {
    statement: String,
    examples: [{
      input: String,
      output: String,
      explanation: String
    }],
    constraints: [String],
    notes: String
  },
  
  // Technical Requirements
  requirements: {
    languages: [String],
    frameworks: [String],
    timeLimit: Number, // in minutes
    memoryLimit: Number, // in MB
    submissionFormat: String
  },
  
  // Test Cases
  testCases: [{
    input: String,
    expectedOutput: String,
    isHidden: {
      type: Boolean,
      default: false
    },
    weight: {
      type: Number,
      default: 1
    }
  }],
  
  // Solution Template
  template: {
    python: String,
    javascript: String,
    java: String,
    cpp: String
  },
  
  // Evaluation Criteria
  evaluation: {
    correctness: {
      weight: {
        type: Number,
        default: 60
      }
    },
    efficiency: {
      weight: {
        type: Number,
        default: 20
      }
    },
    codeQuality: {
      weight: {
        type: Number,
        default: 20
      }
    },
    timeBonus: {
      enabled: {
        type: Boolean,
        default: true
      },
      maxBonus: {
        type: Number,
        default: 10
      }
    }
  },
  
  // Status and Visibility
  status: {
    type: String,
    enum: ['draft', 'active', 'inactive', 'archived'],
    default: 'draft'
  },
  
  isActive: {
    type: Boolean,
    default: false
  },
  
  // Usage Statistics
  stats: {
    totalAssignments: {
      type: Number,
      default: 0
    },
    totalCompletions: {
      type: Number,
      default: 0
    },
    averageScore: {
      type: Number,
      default: 0
    },
    averageTime: {
      type: Number,
      default: 0
    }
  },
  
  // Metadata
  tags: [String],
  categories: [String],
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  
  updatedAt: {
    type: Date,
    default: Date.now
  },
  
  activatedAt: Date,
  deactivatedAt: Date
});

// Indexes
challengeSchema.index({ status: 1 });
challengeSchema.index({ isActive: 1 });
challengeSchema.index({ difficulty: 1 });
challengeSchema.index({ type: 1 });
challengeSchema.index({ createdAt: -1 });

// Update timestamp on save
challengeSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Method to activate challenge
challengeSchema.methods.activate = async function() {
  // Deactivate all other challenges first
  await this.constructor.updateMany(
    { _id: { $ne: this._id } },
    { 
      isActive: false, 
      status: 'inactive',
      deactivatedAt: new Date()
    }
  );
  
  // Activate this challenge
  this.isActive = true;
  this.status = 'active';
  this.activatedAt = new Date();
  this.deactivatedAt = null;
  
  return this.save();
};

// Method to deactivate challenge
challengeSchema.methods.deactivate = function() {
  this.isActive = false;
  this.status = 'inactive';
  this.deactivatedAt = new Date();
  return this.save();
};

// Method to update statistics
challengeSchema.methods.updateStats = function(score, timeSpent) {
  this.stats.totalCompletions += 1;
  
  // Update average score
  const totalScore = this.stats.averageScore * (this.stats.totalCompletions - 1) + score;
  this.stats.averageScore = totalScore / this.stats.totalCompletions;
  
  // Update average time
  const totalTime = this.stats.averageTime * (this.stats.totalCompletions - 1) + timeSpent;
  this.stats.averageTime = totalTime / this.stats.totalCompletions;
  
  return this.save();
};

// Static method to get active challenge
challengeSchema.statics.getActive = function() {
  return this.findOne({ isActive: true, status: 'active' });
};

// Static method to ensure only one active challenge
challengeSchema.statics.ensureSingleActive = async function() {
  const activeChallenges = await this.find({ isActive: true });
  
  if (activeChallenges.length > 1) {
    // Keep the most recently activated one, deactivate others
    const sortedChallenges = activeChallenges.sort((a, b) => 
      new Date(b.activatedAt) - new Date(a.activatedAt)
    );
    
    const toDeactivate = sortedChallenges.slice(1);
    for (const challenge of toDeactivate) {
      await challenge.deactivate();
    }
  }
  
  return this.getActive();
};

// Virtual for completion rate
challengeSchema.virtual('completionRate').get(function() {
  if (this.stats.totalAssignments === 0) return 0;
  return (this.stats.totalCompletions / this.stats.totalAssignments * 100).toFixed(1);
});

module.exports = mongoose.model('Challenge', challengeSchema);
