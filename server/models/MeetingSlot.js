const mongoose = require('mongoose');

const meetingSlotSchema = new mongoose.Schema({
  // Basic Information
  title: {
    type: String,
    required: true,
    trim: true
  },
  
  description: String,
  
  // Time Information
  startTime: {
    type: Date,
    required: true
  },
  
  endTime: {
    type: Date,
    required: true
  },
  
  duration: {
    type: Number, // in minutes
    default: 60
  },
  
  // Meeting Type
  type: {
    type: String,
    enum: ['technical_interview', 'hr_interview', 'final_interview', 'challenge_review', 'general'],
    default: 'technical_interview'
  },
  
  // Participants
  recruiterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  candidateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Candidate'
  },
  
  applicationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Application'
  },
  
  // Meeting Details
  meetingLink: String,
  meetingPlatform: {
    type: String,
    enum: ['zoom', 'teams', 'google_meet', 'skype', 'other'],
    default: 'zoom'
  },
  
  // Status
  status: {
    type: String,
    enum: ['available', 'booked', 'completed', 'cancelled', 'rescheduled'],
    default: 'available'
  },
  
  // Booking Information
  bookedAt: Date,
  bookedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
  // Notes and Feedback
  notes: String,
  feedback: String,
  
  // Reminders
  reminders: [{
    type: {
      type: String,
      enum: ['email', 'sms', 'push'],
      default: 'email'
    },
    sentAt: Date,
    scheduledFor: Date
  }],
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Indexes
meetingSlotSchema.index({ recruiterId: 1, startTime: 1 });
meetingSlotSchema.index({ candidateId: 1 });
meetingSlotSchema.index({ status: 1 });
meetingSlotSchema.index({ startTime: 1, endTime: 1 });
meetingSlotSchema.index({ applicationId: 1 });

// Update timestamp on save
meetingSlotSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Method to book slot
meetingSlotSchema.methods.book = function(candidateId, applicationId, bookedBy) {
  this.status = 'booked';
  this.candidateId = candidateId;
  this.applicationId = applicationId;
  this.bookedAt = new Date();
  this.bookedBy = bookedBy;
  
  return this.save();
};

// Method to cancel booking
meetingSlotSchema.methods.cancel = function() {
  this.status = 'cancelled';
  this.candidateId = null;
  this.applicationId = null;
  this.bookedAt = null;
  this.bookedBy = null;
  
  return this.save();
};

// Method to complete meeting
meetingSlotSchema.methods.complete = function(feedback = '') {
  this.status = 'completed';
  this.feedback = feedback;
  
  return this.save();
};

// Method to reschedule
meetingSlotSchema.methods.reschedule = function(newStartTime, newEndTime) {
  this.startTime = newStartTime;
  this.endTime = newEndTime;
  this.status = 'rescheduled';
  
  return this.save();
};

// Static method to find available slots for a recruiter
meetingSlotSchema.statics.findAvailable = function(recruiterId, startDate, endDate) {
  return this.find({
    recruiterId,
    status: 'available',
    startTime: { $gte: startDate, $lte: endDate }
  }).sort({ startTime: 1 });
};

// Static method to find booked slots for a candidate
meetingSlotSchema.statics.findByCandidate = function(candidateId) {
  return this.find({
    candidateId,
    status: { $in: ['booked', 'completed'] }
  }).sort({ startTime: 1 });
};

// Static method to find upcoming meetings for a recruiter
meetingSlotSchema.statics.findUpcomingForRecruiter = function(recruiterId, limit = 10) {
  return this.find({
    recruiterId,
    status: 'booked',
    startTime: { $gte: new Date() }
  })
    .sort({ startTime: 1 })
    .limit(limit)
    .populate('candidateId', 'name email')
    .populate('applicationId', 'jobId')
    .populate('applicationId.jobId', 'title company');
};

// Virtual for timezone-adjusted times
meetingSlotSchema.virtual('formattedStartTime').get(function() {
  return this.startTime.toLocaleString();
});

meetingSlotSchema.virtual('formattedEndTime').get(function() {
  return this.endTime.toLocaleString();
});

// Virtual for meeting duration in minutes
meetingSlotSchema.virtual('durationMinutes').get(function() {
  return Math.round((this.endTime - this.startTime) / (1000 * 60));
});

module.exports = mongoose.model('MeetingSlot', meetingSlotSchema);
