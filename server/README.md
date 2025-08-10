# TalentAI Backend Server

A comprehensive AI-powered recruitment platform backend with virtual candidate management, job matching, and challenge-based evaluation.

## Features

### 🔐 Authentication & Authorization
- JWT-based authentication
- Role-based access control (Admin, Recruiter, Candidate)
- Secure password hashing with bcrypt

### 👥 User Management
- **Admin**: System administration and challenge management
- **Recruiter**: Job posting, candidate evaluation, interview scheduling
- **Candidate**: Job applications, resume upload, challenge participation

### 💼 Job Management
- Create, update, and manage job postings
- AI-powered skill matching
- Automatic virtual candidate application
- Top 1000 candidate filtering

### 🤖 Virtual Candidate System
- 100,000 AI-generated virtual candidates
- Automatic application to new job postings
- Skill-based matching and ranking
- Realistic candidate profiles with diverse backgrounds

### 🎯 Challenge System
- Single active challenge at a time
- Multiple programming language support
- Automated evaluation and scoring
- Challenge assignment to accepted candidates

### 📅 Interview Scheduling
- Meeting slot management
- Interview scheduling and rescheduling
- Meeting completion and feedback
- Real-time notifications

## Database Models

### User
- Authentication and authorization
- Role-based permissions
- Profile management

### Candidate
- Professional information
- Skills and experience
- Education and certifications
- Assessment results

### Job
- Job posting details
- Requirements and responsibilities
- AI matching criteria
- Application analytics

### Application
- Job application tracking
- Status management
- Challenge assignment
- Interview scheduling

### Challenge
- Single active challenge system
- Problem statements and test cases
- Evaluation criteria
- Submission tracking

### MeetingSlot
- Interview scheduling
- Time slot management
- Meeting completion tracking

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Jobs
- `GET /api/jobs` - Get all active jobs
- `GET /api/jobs/:jobId` - Get specific job
- `POST /api/jobs` - Create new job (Recruiter)
- `PUT /api/jobs/:jobId` - Update job (Recruiter)
- `DELETE /api/jobs/:jobId` - Delete job (Recruiter)
- `GET /api/jobs/:jobId/top-candidates` - Get top candidates

### Applications
- `POST /api/applications/apply` - Apply for job (Candidate)
- `GET /api/applications/my-applications` - Get user applications
- `GET /api/applications/job/:jobId` - Get job applications (Recruiter)
- `PUT /api/applications/:applicationId/accept` - Accept application
- `PUT /api/applications/:applicationId/reject` - Reject application
- `POST /api/applications/:applicationId/submit-challenge` - Submit challenge

### Challenges
- `GET /api/challenges/active` - Get active challenge
- `POST /api/challenges` - Create challenge (Admin)
- `PUT /api/challenges/:challengeId/activate` - Activate challenge (Admin)
- `GET /api/challenges/stats` - Get challenge statistics

### Meetings
- `POST /api/meetings/slots` - Create meeting slots (Recruiter)
- `GET /api/meetings/slots/available` - Get available slots
- `POST /api/meetings/schedule` - Schedule interview
- `PUT /api/meetings/slots/:slotId/complete` - Complete meeting

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Configuration
Create a `.env` file in the server directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/talentai
JWT_SECRET=your_jwt_secret_here
CLIENT_URL=http://localhost:3000
```

### 3. Database Setup
Make sure MongoDB is running, then seed the database:
```bash
npm run seed
```

This will create:
- 1 Admin user (admin@talentai.com / admin123)
- 1 Dummy user (user@example.com / user123)
- 1 Recruiter (recruiter@techcorp.com / recruiter123)
- 100,000 Virtual candidates
- 25 Sample jobs
- 1 Active challenge

### 4. Start the Server
```bash
# Development mode
npm run dev

# Production mode
npm start
```

## Virtual Candidate System

The platform includes 100,000 AI-generated virtual candidates that automatically apply to new job postings. These candidates:

- Have realistic profiles with diverse skills and experience
- Are automatically matched to job requirements
- Provide instant application volume for recruiters
- Support the top 1000 candidate filtering system

### Virtual Candidate Features
- **Automatic Application**: Virtual candidates automatically apply to new job postings
- **Skill Matching**: AI-powered matching based on job requirements
- **Realistic Profiles**: Diverse backgrounds, skills, and experience levels
- **Performance Tracking**: Application statistics and success rates

## Challenge System

The platform maintains a single active challenge at a time:

- **Single Active Challenge**: Only one challenge can be active at a time
- **Multiple Languages**: Support for Python, JavaScript, Java, C++
- **Automated Evaluation**: Test case execution and scoring
- **Assignment Tracking**: Challenge assignment to accepted candidates

### Challenge Workflow
1. Admin creates and activates a challenge
2. Recruiter accepts candidate applications
3. Active challenge is automatically assigned
4. Candidates submit solutions
5. Automated evaluation and scoring

## API Usage Examples

### Create a Job Posting (Recruiter)
```javascript
const response = await fetch('/api/jobs', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    title: 'Senior ML Engineer',
    company: { name: 'TechCorp AI' },
    location: { city: 'San Francisco', state: 'CA' },
    type: 'full-time',
    aiRequirements: {
      primarySkills: ['Python', 'TensorFlow', 'PyTorch'],
      secondarySkills: ['AWS', 'Docker']
    }
  })
});
```

### Apply for a Job (Candidate)
```javascript
const formData = new FormData();
formData.append('resume', file);
formData.append('jobId', jobId);
formData.append('coverLetter', 'I am excited to apply...');

const response = await fetch('/api/applications/apply', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`
  },
  body: formData
});
```

### Get Top Candidates (Recruiter)
```javascript
const response = await fetch(`/api/jobs/${jobId}/top-candidates?limit=1000`, {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Role-based Access**: Granular permissions based on user roles
- **Input Validation**: Comprehensive request validation
- **File Upload Security**: Secure resume upload with type validation
- **Rate Limiting**: Protection against abuse

## Performance Optimizations

- **Database Indexing**: Optimized queries with proper indexes
- **Batch Processing**: Efficient handling of large datasets
- **Pagination**: Memory-efficient data retrieval
- **Caching**: Strategic caching for frequently accessed data

## Monitoring and Analytics

- **Application Tracking**: Comprehensive application lifecycle tracking
- **Performance Metrics**: Challenge completion rates and scores
- **Virtual Candidate Stats**: Application and success statistics
- **Job Analytics**: View counts and application rates

## Development

### Running Tests
```bash
npm test
```

### Code Structure
```
server/
├── config/          # Database configuration
├── middleware/      # Authentication and authorization
├── models/          # Database models
├── routes/          # API routes
├── services/        # Business logic services
├── scripts/         # Database seeding
└── uploads/         # File uploads
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
