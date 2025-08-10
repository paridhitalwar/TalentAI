const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  // Basic Information
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  
  candidateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Candidate',
    required: true
  },
  
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Application Status
  status: {
    type: String,
    enum: ['applied', 'reviewing', 'accepted', 'rejected', 'challenge_assigned', 'challenge_completed', 'interview_scheduled', 'hired'],
    default: 'applied'
  },
  
  // Application Details
  resume: {
    originalFile: String,
    parsedData: mongoose.Schema.Types.Mixed,
    confidence: Number,
    uploadedAt: Date
  },
  
  coverLetter: String,
  
  // Matching Information
  matchScore: {
    type: Number,
    min: 0,
    max: 100
  },
  
  matchedSkills: [String],
  missingSkills: [String],
  
  // Challenge Information
  challenge: {
    challengeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Challenge'
    },
    assignedAt: Date,
    completedAt: Date,
    score: Number,
    submission: mongoose.Schema.Types.Mixed
  },
  
  // Interview Information
  interview: {
    scheduledAt: Date,
    meetingSlot: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MeetingSlot'
    },
    notes: String,
    feedback: String
  },
  
  // Recruiter Actions
  recruiterNotes: String,
  recruiterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
  // Timestamps
  appliedAt: {
    type: Date,
    default: Date.now
  },
  
  updatedAt: {
    type: Date,
    default: Date.now
  },
  
  // Application History
  history: [{
    status: String,
    action: String,
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    notes: String,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }]
});

// Indexes
applicationSchema.index({ jobId: 1, candidateId: 1 }, { unique: true });
applicationSchema.index({ status: 1 });
applicationSchema.index({ matchScore: -1 });
applicationSchema.index({ appliedAt: -1 });
applicationSchema.index({ userId: 1 });

// Update timestamp on save
applicationSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Method to update status and add to history
applicationSchema.methods.updateStatus = function(newStatus, action, performedBy, notes = '') {
  this.status = newStatus;
  this.history.push({
    status: newStatus,
    action,
    performedBy,
    notes,
    timestamp: new Date()
  });
  return this.save();
};

// Method to assign challenge
applicationSchema.methods.assignChallenge = function(challengeId, recruiterId) {
  this.status = 'challenge_assigned';
  this.challenge.challengeId = challengeId;
  this.challenge.assignedAt = new Date();
  this.recruiterId = recruiterId;
  
  this.history.push({
    status: 'challenge_assigned',
    action: 'Challenge Assigned',
    performedBy: recruiterId,
    notes: 'Coding challenge assigned to candidate',
    timestamp: new Date()
  });
  
  return this.save();
};

// Method to complete challenge
applicationSchema.methods.completeChallenge = function(score, submission) {
  this.status = 'challenge_completed';
  this.challenge.score = score;
  this.challenge.submission = submission;
  this.challenge.completedAt = new Date();
  
  this.history.push({
    status: 'challenge_completed',
    action: 'Challenge Completed',
    performedBy: this.userId,
    notes: `Challenge completed with score: ${score}`,
    timestamp: new Date()
  });
  
  return this.save();
};

// Method to schedule interview
applicationSchema.methods.scheduleInterview = function(meetingSlotId, recruiterId, notes = '') {
  this.status = 'interview_scheduled';
  this.interview.meetingSlot = meetingSlotId;
  this.interview.scheduledAt = new Date();
  this.recruiterId = recruiterId;
  
  this.history.push({
    status: 'interview_scheduled',
    action: 'Interview Scheduled',
    performedBy: recruiterId,
    notes,
    timestamp: new Date()
  });
  
  return this.save();
};

// Static method to find applications by job
applicationSchema.statics.findByJob = function(jobId, limit = 1000) {
  return this.find({ jobId })
    .sort({ matchScore: -1, appliedAt: 1 })
    .limit(limit)
    .populate('candidateId', 'name email skills experience')
    .populate('userId', 'name email')
    .populate('challenge.challengeId', 'title description');
};

// Static method to find top candidates for a job
applicationSchema.statics.findTopCandidates = function(jobId, limit = 1000) {
  return this.find({ 
    jobId, 
    status: { $in: ['applied', 'reviewing', 'accepted', 'challenge_assigned'] }
  })
    .sort({ matchScore: -1 })
    .limit(limit)
    .populate('candidateId', 'name email skills experience')
    .populate('userId', 'name email');
};

module.exports = mongoose.model('Application', applicationSchema);
