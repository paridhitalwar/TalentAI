const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

// Mock data for demo purposes
const mockUsers = new Map();
const mockSessions = new Map();

// Initialize with some sample users
const sampleUsers = [
  {
    id: 'user-001',
    email: 'recruiter@techcorp.com',
    password: '$2a$10$rQJ8N5vK8N5vK8N5vK8N5u', // hashed 'password123'
    role: 'recruiter',
    name: 'Sarah Recruiter',
    company: 'TechCorp AI',
    permissions: ['view_candidates', 'view_jobs', 'manage_applications', 'view_analytics'],
    createdAt: '2024-01-15T10:00:00Z',
    lastLogin: null
  },
  {
    id: 'user-002',
    email: 'candidate@email.com',
    password: '$2a$10$rQJ8N5vK8N5vK8N5vK8N5u', // hashed 'password123'
    role: 'candidate',
    name: 'Alex Candidate',
    candidateId: 'candidate-001',
    permissions: ['view_profile', 'apply_jobs', 'take_tests', 'view_matches'],
    createdAt: '2024-01-15T11:00:00Z',
    lastLogin: null
  },
  {
    id: 'user-003',
    email: 'admin@talentai.com',
    password: '$2a$10$rQJ8N5vK8N5vK8N5vK8N5u', // hashed 'password123'
    role: 'admin',
    name: 'Admin User',
    permissions: ['*'], // All permissions
    createdAt: '2024-01-15T09:00:00Z',
    lastLogin: null
  }
];

// Initialize mock data
sampleUsers.forEach(user => {
  mockUsers.set(user.id, user);
  // Also index by email for quick lookup
  mockUsers.set(user.email, user);
});

// User registration
router.post('/register', async (req, res) => {
  try {
    const { email, password, name, role, company, candidateId } = req.body;
    
    if (!email || !password || !name || !role) {
      return res.status(400).json({ error: 'Email, password, name, and role are required' });
    }

    // Check if user already exists
    if (mockUsers.has(email)) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    // Validate role
    const validRoles = ['candidate', 'recruiter', 'admin'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Set permissions based on role
    let permissions = [];
    switch (role) {
      case 'candidate':
        permissions = ['view_profile', 'apply_jobs', 'take_tests', 'view_matches'];
        break;
      case 'recruiter':
        permissions = ['view_candidates', 'view_jobs', 'manage_applications', 'view_analytics'];
        break;
      case 'admin':
        permissions = ['*']; // All permissions
        break;
    }

    const userId = `user-${uuidv4().split('-')[0]}`;
    const newUser = {
      id: userId,
      email,
      password: hashedPassword,
      role,
      name,
      company: company || null,
      candidateId: candidateId || null,
      permissions,
      createdAt: new Date().toISOString(),
      lastLogin: null
    };

    mockUsers.set(userId, newUser);
    mockUsers.set(email, newUser);

    // Create JWT token
    const token = jwt.sign(
      { userId: newUser.id, email: newUser.email, role: newUser.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    // Create session
    const sessionId = uuidv4();
    const session = {
      id: sessionId,
      userId: newUser.id,
      token,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
    };
    mockSessions.set(sessionId, session);

    // Update last login
    newUser.lastLogin = new Date().toISOString();
    mockUsers.set(userId, newUser);
    mockUsers.set(email, newUser);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
        company: newUser.company,
        candidateId: newUser.candidateId,
        permissions: newUser.permissions
      },
      token,
      sessionId
    });

  } catch (error) {
    console.error('User registration error:', error);
    res.status(500).json({ error: 'Failed to register user' });
  }
});

// User login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user by email
    const user = mockUsers.get(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Create JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    // Create session
    const sessionId = uuidv4();
    const session = {
      id: sessionId,
      userId: user.id,
      token,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
    };
    mockSessions.set(sessionId, session);

    // Update last login
    user.lastLogin = new Date().toISOString();
    mockUsers.set(user.id, user);
    mockUsers.set(user.email, user);

    res.json({
      success: true,
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        company: user.company,
        candidateId: user.candidateId,
        permissions: user.permissions
      },
      token,
      sessionId
    });

  } catch (error) {
    console.error('User login error:', error);
    res.status(500).json({ error: 'Failed to login' });
  }
});

// User logout
router.post('/logout', async (req, res) => {
  try {
    const { sessionId } = req.body;
    
    if (!sessionId) {
      return res.status(400).json({ error: 'Session ID is required' });
    }

    // Remove session
    const session = mockSessions.get(sessionId);
    if (session) {
      mockSessions.delete(sessionId);
    }

    res.json({
      success: true,
      message: 'Logout successful'
    });

  } catch (error) {
    console.error('User logout error:', error);
    res.status(500).json({ error: 'Failed to logout' });
  }
});

// Get current user profile
router.get('/profile', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const user = mockUsers.get(decoded.userId);
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        company: user.company,
        candidateId: user.candidateId,
        permissions: user.permissions,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin
      }
    });

  } catch (error) {
    console.error('Get profile error:', error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    }
    res.status(500).json({ error: 'Failed to get profile' });
  }
});

// Update user profile
router.put('/profile', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const user = mockUsers.get(decoded.userId);
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const { name, company } = req.body;
    
    // Update allowed fields
    if (name !== undefined) user.name = name;
    if (company !== undefined) user.company = company;
    
    user.updatedAt = new Date().toISOString();
    
    mockUsers.set(user.id, user);
    mockUsers.set(user.email, user);

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        company: user.company,
        candidateId: user.candidateId,
        permissions: user.permissions
      }
    });

  } catch (error) {
    console.error('Update profile error:', error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    }
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Change password
router.put('/change-password', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const user = mockUsers.get(decoded.userId);
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current password and new password are required' });
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }

    // Hash new password
    const saltRounds = 10;
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);
    
    user.password = hashedNewPassword;
    user.updatedAt = new Date().toISOString();
    
    mockUsers.set(user.id, user);
    mockUsers.set(user.email, user);

    res.json({
      success: true,
      message: 'Password changed successfully'
    });

  } catch (error) {
    console.error('Change password error:', error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    }
    res.status(500).json({ error: 'Failed to change password' });
  }
});

// Verify token middleware
const verifyToken = (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const user = mockUsers.get(decoded.userId);
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    }
    res.status(500).json({ error: 'Token verification failed' });
  }
};

// Check permissions middleware
const checkPermission = (permission) => {
  return (req, res, next) => {
    const user = req.user;
    
    if (user.permissions.includes('*') || user.permissions.includes(permission)) {
      next();
    } else {
      res.status(403).json({ error: 'Insufficient permissions' });
    }
  };
};

// Get all users (admin only)
router.get('/users', verifyToken, checkPermission('*'), async (req, res) => {
  try {
    const users = Array.from(mockUsers.values())
      .filter(user => user.id && !user.email) // Filter out email-indexed entries
      .map(user => ({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        company: user.company,
        candidateId: user.candidateId,
        permissions: user.permissions,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin
      }));

    res.json({
      success: true,
      users
    });

  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Failed to get users' });
  }
});

// Delete user (admin only)
router.delete('/users/:id', verifyToken, checkPermission('*'), async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = mockUsers.get(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Remove user and associated sessions
    mockUsers.delete(id);
    mockUsers.delete(user.email);
    
    Array.from(mockSessions.values())
      .filter(session => session.userId === id)
      .forEach(session => mockSessions.delete(session.id));

    res.json({
      success: true,
      message: 'User deleted successfully'
    });

  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// Refresh token
router.post('/refresh', async (req, res) => {
  try {
    const { sessionId } = req.body;
    
    if (!sessionId) {
      return res.status(400).json({ error: 'Session ID is required' });
    }

    const session = mockSessions.get(sessionId);
    if (!session) {
      return res.status(401).json({ error: 'Invalid session' });
    }

    // Check if session is expired
    if (new Date() > new Date(session.expiresAt)) {
      mockSessions.delete(sessionId);
      return res.status(401).json({ error: 'Session expired' });
    }

    const user = mockUsers.get(session.userId);
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    // Create new token
    const newToken = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    // Update session
    session.token = newToken;
    session.expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    mockSessions.set(sessionId, session);

    res.json({
      success: true,
      token: newToken,
      message: 'Token refreshed successfully'
    });

  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(500).json({ error: 'Failed to refresh token' });
  }
});

module.exports = router;
