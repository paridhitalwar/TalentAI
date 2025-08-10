const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const resumeParser = require('../services/resumeParser');
const embeddingService = require('../services/embeddingService');
const pineconeService = require('../services/pineconeService');
const Candidate = require('../models/Candidate');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = process.env.UPLOAD_PATH || './uploads';
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}-${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024 // 10MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['.pdf', '.doc', '.docx'];
    const ext = path.extname(file.originalname).toLowerCase();
    
    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, DOC, and DOCX files are allowed.'));
    }
  }
});

// Upload and parse resume
router.post('/upload', upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        status: 'error',
        message: 'No resume file provided'
      });
    }

    console.log('📄 Processing resume upload:', req.file.originalname);

    // Parse resume
    const parseResult = await resumeParser.parseResume(req.file.path, req.file.originalname);
    
    if (!parseResult.success) {
      return res.status(500).json({
        status: 'error',
        message: 'Failed to parse resume',
        error: parseResult.error
      });
    }

    const parsedData = parseResult.data;

    // Create or update candidate
    let candidate = await Candidate.findOne({
      where: { email: parsedData.email }
    });

    if (candidate) {
      // Update existing candidate
      await candidate.update({
        name: parsedData.name,
        phone: parsedData.phone,
        location: parsedData.location,
        skills: parsedData.skills,
        normalized_skills: parsedData.normalized_skills,
        experience: parsedData.experience,
        education: parsedData.education,
        resume_file_path: req.file.path,
        resume_parsed_data: parsedData
      });
    } else {
      // Create new candidate
      candidate = await Candidate.create({
        name: parsedData.name,
        email: parsedData.email,
        phone: parsedData.phone,
        location: parsedData.location,
        skills: parsedData.skills,
        normalized_skills: parsedData.normalized_skills,
        experience: parsedData.experience,
        education: parsedData.education,
        resume_file_path: req.file.path,
        resume_parsed_data: parsedData
      });
    }

    // Generate embedding
    const embeddingResult = await embeddingService.generateCandidateEmbedding(candidate);
    
    if (embeddingResult.success) {
      // Store in Pinecone
      const pineconeId = `candidate_${candidate.id}`;
      await pineconeService.upsertVector(pineconeId, embeddingResult.embedding, {
        type: 'candidate',
        candidate_id: candidate.id,
        name: candidate.name,
        email: candidate.email
      });

      // Update candidate with embedding and Pinecone ID
      await candidate.update({
        embedding_vector: JSON.stringify(embeddingResult.embedding),
        pinecone_id: pineconeId
      });
    }

    res.json({
      status: 'success',
      message: 'Resume uploaded and parsed successfully',
      data: {
        candidate_id: candidate.id,
        name: candidate.name,
        email: candidate.email,
        skills: candidate.skills,
        normalized_skills: candidate.normalized_skills,
        experience: candidate.experience,
        education: candidate.education
      }
    });

  } catch (error) {
    console.error('❌ Resume upload error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to process resume',
      error: error.message
    });
  }
});

// Get candidate by ID
router.get('/candidate/:id', async (req, res) => {
  try {
    const candidate = await Candidate.findByPk(req.params.id);
    
    if (!candidate) {
      return res.status(404).json({
        status: 'error',
        message: 'Candidate not found'
      });
    }

    res.json({
      status: 'success',
      data: candidate
    });
  } catch (error) {
    console.error('❌ Get candidate error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve candidate',
      error: error.message
    });
  }
});

// Get all candidates
router.get('/candidates', async (req, res) => {
  try {
    const { page = 1, limit = 10, status = 'active' } = req.query;
    const offset = (page - 1) * limit;

    const candidates = await Candidate.findAndCountAll({
      where: { status },
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['created_at', 'DESC']]
    });

    res.json({
      status: 'success',
      data: {
        candidates: candidates.rows,
        total: candidates.count,
        page: parseInt(page),
        totalPages: Math.ceil(candidates.count / limit)
      }
    });
  } catch (error) {
    console.error('❌ Get candidates error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve candidates',
      error: error.message
    });
  }
});

module.exports = router;
