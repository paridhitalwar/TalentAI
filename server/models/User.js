const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  // Basic Information
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  
  password: {
    type: String,
    required: true,
    minlength: 8
  },
  
  name: {
    type: String,
    required: true,
    trim: true
  },
  
  // Profile Information
  avatar: String,
  phone: String,
  bio: String,
  
  // Role and Permissions
  role: {
    type: String,
    enum: ['candidate', 'recruiter', 'admin', 'company_admin'],
    required: true
  },
  
  permissions: [{
    type: String,
    enum: [
      // Candidate permissions
      'view_profile', 'edit_profile', 'view_jobs', 'apply_jobs', 'view_applications',
      'take_assessments', 'view_results', 'view_leaderboard',
      
      // Recruiter permissions
      'view_candidates', 'view_jobs', 'create_jobs', 'edit_jobs', 'delete_jobs',
      'manage_applications', 'view_analytics', 'send_messages', 'schedule_interviews',
      
      // Admin permissions
      'manage_users', 'manage_system', 'view_all_data', 'manage_content',
      'view_logs', 'manage_settings', 'backup_restore'
    ]
  }],
  
  // Company Information (for recruiters and company admins)
  company: {
    id: String,
    name: String,
    position: String,
    department: String,
    verified: {
      type: Boolean,
      default: false
    }
  },
  
  // Candidate Information (for candidates)
  candidate: {
    id: String,
    profile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Candidate'
    },
    preferences: {
      jobTypes: [String],
      locations: [String],
      industries: [String],
      salaryRange: {
        min: Number,
        max: Number,
        currency: String
      },
      remote: Boolean,
      relocation: Boolean
    },
    applications: [{
      jobId: String,
      status: {
        type: String,
        enum: ['applied', 'reviewing', 'interviewing', 'offered', 'rejected', 'withdrawn'],
        default: 'applied'
      },
      appliedAt: Date,
      lastUpdated: Date
    }]
  },
  
  // Account Status
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended', 'pending_verification'],
    default: 'pending_verification'
  },
  
  // Email Verification
  emailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: String,
  emailVerificationExpires: Date,
  
  // Password Reset
  passwordResetToken: String,
  passwordResetExpires: Date,
  
  // Security
  lastLogin: Date,
  loginAttempts: {
    type: Number,
    default: 0
  },
  lockUntil: Date,
  
  // Two-Factor Authentication
  twoFactorEnabled: {
    type: Boolean,
    default: false
  },
  twoFactorSecret: String,
  twoFactorBackupCodes: [String],
  
  // Session Management
  activeSessions: [{
    sessionId: String,
    device: String,
    ip: String,
    userAgent: String,
    createdAt: Date,
    lastActivity: Date
  }],
  
  // Preferences
  preferences: {
    notifications: {
      email: {
        type: Boolean,
        default: true
      },
      push: {
        type: Boolean,
        default: true
      },
      sms: {
        type: Boolean,
        default: false
      }
    },
    privacy: {
      profileVisibility: {
        type: String,
        enum: ['public', 'recruiters_only', 'private'],
        default: 'recruiters_only'
      },
      showContactInfo: {
        type: Boolean,
        default: false
      }
    },
    language: {
      type: String,
      default: 'en'
    },
    timezone: String
  },
  
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
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ status: 1 });
userSchema.index({ 'company.id': 1 });
userSchema.index({ 'candidate.id': 1 });
userSchema.index({ createdAt: -1 });

// Update timestamp on save
userSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  return this.name;
});

// Virtual for display name
userSchema.virtual('displayName').get(function() {
  if (this.company && this.company.position) {
    return `${this.name} - ${this.company.position}`;
  }
  return this.name;
});

// Method to check password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Method to check if account is locked
userSchema.methods.isLocked = function() {
  return !!(this.lockUntil && this.lockUntil > Date.now());
};

// Method to increment login attempts
userSchema.methods.incLoginAttempts = function() {
  // If we have a previous lock that has expired, restart at 1
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.updateOne({
      $unset: { lockUntil: 1 },
      $set: { loginAttempts: 1 }
    });
  }
  
  const updates = { $inc: { loginAttempts: 1 } };
  
  // Lock account after 5 failed attempts
  if (this.loginAttempts + 1 >= 5 && !this.isLocked()) {
    updates.$set = { lockUntil: Date.now() + 2 * 60 * 60 * 1000 }; // 2 hours
  }
  
  return this.updateOne(updates);
};

// Method to reset login attempts
userSchema.methods.resetLoginAttempts = function() {
  return this.updateOne({
    $unset: { loginAttempts: 1, lockUntil: 1 }
  });
};

// Method to check permission
userSchema.methods.hasPermission = function(permission) {
  return this.permissions.includes(permission) || this.role === 'admin';
};

// Method to check role
userSchema.methods.hasRole = function(role) {
  return this.role === role;
};

// Method to get user summary (for public display)
userSchema.methods.getPublicSummary = function() {
  const summary = {
    id: this._id,
    name: this.name,
    role: this.role,
    avatar: this.avatar
  };
  
  if (this.company && this.company.verified) {
    summary.company = {
      name: this.company.name,
      position: this.company.position
    };
  }
  
  return summary;
};

// Static method to find by email
userSchema.statics.findByEmail = function(email) {
  return this.findOne({ email: email.toLowerCase() });
};

// Static method to find active users
userSchema.statics.findActive = function() {
  return this.find({ status: 'active' });
};

module.exports = mongoose.model('User', userSchema);
