# TalentAI Backend

A comprehensive AI-powered recruitment platform backend that combines resume parsing, semantic search, and automated assessment capabilities.

## 🚀 Features

- **Resume Parsing + Skill Tagging**: Upload PDF/DOC resumes and extract structured data using Affinda API
- **Semantic Search**: Use OpenAI embeddings and Pinecone for intelligent candidate-job matching
- **Auto-Generated Assessments**: Integrate with HackerRank for automated coding challenges
- **Skill Normalization**: Use ESCO API to standardize skill names and categories
- **RESTful API**: Clean, well-documented endpoints with proper error handling

## 🛠 Tech Stack

- **Backend**: Node.js with Express.js
- **Database**: PostgreSQL with Sequelize ORM
- **Vector Database**: Pinecone for semantic search
- **AI/ML**: OpenAI Embeddings (text-embedding-3-small)
- **APIs**: 
  - Affinda (Resume Parsing)
  - ESCO (Skill Taxonomy)
  - HackerRank for Work (Assessments)
- **File Upload**: Multer for resume handling
- **Security**: Helmet, CORS, Rate limiting

## 📋 Prerequisites

- Node.js 18+ 
- PostgreSQL 12+
- API Keys for:
  - OpenAI
  - Pinecone
  - Affinda (or RChilli)
  - HackerRank for Work

## 🚀 Quick Start

### 1. Clone and Install

```bash
git clone <repository-url>
cd talentai-backend
npm install
```

### 2. Environment Setup

Copy the environment file and configure your API keys:

```bash
cp env.example .env
```

Edit `.env` with your actual API keys:

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=talentai_db
DB_USER=postgres
DB_PASSWORD=your_password

# OpenAI
OPENAI_API_KEY=your_openai_api_key

# Pinecone
PINECONE_API_KEY=your_pinecone_api_key
PINECONE_ENVIRONMENT=your_pinecone_environment
PINECONE_INDEX_NAME=talentai-embeddings

# Affinda
AFFINDA_API_KEY=your_affinda_api_key

# HackerRank
HACKERRANK_API_KEY=your_hackerrank_api_key

# JWT
JWT_SECRET=your_jwt_secret_key_here
```

### 3. Database Setup

Create a PostgreSQL database:

```sql
CREATE DATABASE talentai_db;
```

### 4. Run the Application

```bash
# Development mode
npm run dev

# Production mode
npm start
```

### 5. Seed Database (Optional)

```bash
npm run seed
```

## 📚 API Documentation

### Base URL
```
http://localhost:3001/api
```

### Health Check
```http
GET /health
```

### Resume Management

#### Upload Resume
```http
POST /resume/upload
Content-Type: multipart/form-data

Form Data:
- resume: PDF/DOC/DOCX file
```

**Response:**
```json
{
  "status": "success",
  "message": "Resume uploaded and parsed successfully",
  "data": {
    "candidate_id": "uuid",
    "name": "John Smith",
    "email": "john@example.com",
    "skills": ["JavaScript", "React"],
    "normalized_skills": [...],
    "experience": [...],
    "education": [...]
  }
}
```

#### Get Candidates
```http
GET /resume/candidates?page=1&limit=10&status=active
```

#### Get Candidate by ID
```http
GET /resume/candidate/:id
```

### Job Matching

#### Match Candidates to Job
```http
POST /matching/match
Content-Type: application/json

{
  "job_description": "We are looking for a React developer...",
  "job_title": "Frontend Developer",
  "required_skills": ["React", "JavaScript", "TypeScript"],
  "top_k": 10
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Found 5 matching candidates",
  "data": {
    "job_title": "Frontend Developer",
    "total_candidates": 5,
    "candidates": [
      {
        "id": "uuid",
        "name": "John Smith",
        "email": "john@example.com",
        "similarity_score": 0.92,
        "skill_match_percentage": 85,
        "matched_skills": ["React", "JavaScript"],
        "missing_skills": ["TypeScript"]
      }
    ]
  }
}
```

#### Create Job Posting
```http
POST /matching/jobs
Content-Type: application/json

{
  "title": "Senior Frontend Developer",
  "company": "Tech Corp",
  "description": "We are looking for...",
  "skills": ["React", "JavaScript"],
  "requirements": ["5+ years experience"],
  "location": "San Francisco, CA",
  "salary_range": {"min": 120000, "max": 180000},
  "job_type": "full-time",
  "experience_level": "senior"
}
```

#### Get Jobs
```http
GET /matching/jobs?page=1&limit=10&status=active
```

### Assessment Management

#### Create Assessment Invitation
```http
POST /assessment/invite
Content-Type: application/json

{
  "candidate_id": "uuid",
  "job_id": "uuid",
  "similarity_score": 0.92
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Assessment invitation created successfully",
  "data": {
    "assessment_id": "uuid",
    "test_url": "https://hackerrank.com/test/...",
    "expires_at": "2024-01-15T10:00:00Z",
    "candidate": {
      "name": "John Smith",
      "email": "john@example.com"
    },
    "job": {
      "title": "Frontend Developer",
      "company": "Tech Corp"
    }
  }
}
```

#### Get Assessment by ID
```http
GET /assessment/:id
```

#### Update Assessment Status
```http
PATCH /assessment/:id/status
Content-Type: application/json

{
  "status": "completed"
}
```

#### Get Candidate Assessments
```http
GET /assessment/candidate/:candidateId?page=1&limit=10
```

#### Get Job Assessments
```http
GET /assessment/job/:jobId?page=1&limit=10
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 3001 |
| `NODE_ENV` | Environment | development |
| `DB_HOST` | PostgreSQL host | localhost |
| `DB_PORT` | PostgreSQL port | 5432 |
| `DB_NAME` | Database name | talentai_db |
| `DB_USER` | Database user | postgres |
| `DB_PASSWORD` | Database password | - |
| `OPENAI_API_KEY` | OpenAI API key | - |
| `OPENAI_MODEL` | OpenAI model | text-embedding-3-small |
| `PINECONE_API_KEY` | Pinecone API key | - |
| `PINECONE_ENVIRONMENT` | Pinecone environment | - |
| `PINECONE_INDEX_NAME` | Pinecone index name | talentai-embeddings |
| `AFFINDA_API_KEY` | Affinda API key | - |
| `HACKERRANK_API_KEY` | HackerRank API key | - |
| `JWT_SECRET` | JWT secret key | - |
| `MAX_FILE_SIZE` | Max file upload size | 10MB |
| `UPLOAD_PATH` | File upload directory | ./uploads |

### Rate Limiting

- **Window**: 15 minutes
- **Max Requests**: 100 per IP
- **Configurable**: Via environment variables

## 🧪 Testing

### Manual Testing with curl

#### Health Check
```bash
curl http://localhost:3001/health
```

#### Upload Resume
```bash
curl -X POST http://localhost:3001/api/resume/upload \
  -F "resume=@path/to/resume.pdf"
```

#### Match Candidates
```bash
curl -X POST http://localhost:3001/api/matching/match \
  -H "Content-Type: application/json" \
  -d '{
    "job_description": "We need a React developer",
    "job_title": "Frontend Developer",
    "required_skills": ["React", "JavaScript"],
    "top_k": 5
  }'
```

#### Create Job
```bash
curl -X POST http://localhost:3001/api/matching/jobs \
  -H "Content-Type: application/json" \
  -d '{
    "title": "React Developer",
    "company": "Tech Corp",
    "description": "We are looking for...",
    "skills": ["React", "JavaScript"],
    "requirements": ["3+ years experience"]
  }'
```

## 📁 Project Structure

```
src/
├── config/
│   └── database.js          # Database configuration
├── models/
│   ├── Candidate.js         # Candidate model
│   ├── Job.js              # Job model
│   └── Assessment.js       # Assessment model
├── routes/
│   ├── resume.js           # Resume upload and parsing
│   ├── matching.js         # Job matching and creation
│   └── assessment.js       # Assessment management
├── services/
│   ├── resumeParser.js     # Resume parsing service
│   ├── embeddingService.js # OpenAI embeddings
│   ├── pineconeService.js  # Vector database operations
│   └── assessmentService.js # HackerRank integration
├── scripts/
│   └── seed.js             # Database seeding
├── middleware/             # Custom middleware
├── utils/                  # Utility functions
└── index.js               # Main application entry
```

## 🔒 Security Features

- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing
- **Rate Limiting**: Prevent abuse
- **Input Validation**: Express-validator
- **File Upload Security**: File type and size validation
- **Error Handling**: Proper error responses

## 🚀 Deployment

### Production Setup

1. Set `NODE_ENV=production`
2. Configure production database
3. Set up proper API keys
4. Use PM2 or similar process manager
5. Set up reverse proxy (nginx)
6. Configure SSL certificates

### Docker Deployment

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3001
CMD ["npm", "start"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

For issues and questions:
- Create an issue in the repository
- Check the API documentation
- Review the example requests

## 🔄 Changelog

### v1.0.0
- Initial release
- Resume parsing with Affinda
- Semantic search with OpenAI + Pinecone
- HackerRank assessment integration
- RESTful API endpoints
- Database seeding
- Comprehensive documentation

