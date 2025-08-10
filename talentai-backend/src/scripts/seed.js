const { sequelize } = require('../config/database');
const Candidate = require('../models/Candidate');
const Job = require('../models/Job');
const Assessment = require('../models/Assessment');
const embeddingService = require('../services/embeddingService');
const pineconeService = require('../services/pineconeService');

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');

    // Sync database
    await sequelize.sync({ force: true });
    console.log('✅ Database synced');

    // Initialize Pinecone
    await pineconeService.initialize();

    // Sample candidates data
    const candidates = [
      {
        name: 'John Smith',
        email: 'john.smith@email.com',
        phone: '+1-555-0123',
        location: 'San Francisco, CA',
        skills: ['JavaScript', 'React', 'Node.js', 'Python', 'MongoDB'],
        normalized_skills: [
          { original: 'JavaScript', normalized: 'JavaScript', category: 'Programming Languages' },
          { original: 'React', normalized: 'React.js', category: 'Frontend Frameworks' },
          { original: 'Node.js', normalized: 'Node.js', category: 'Backend Technologies' },
          { original: 'Python', normalized: 'Python', category: 'Programming Languages' },
          { original: 'MongoDB', normalized: 'MongoDB', category: 'Databases' }
        ],
        experience: [
          {
            title: 'Senior Software Engineer',
            company: 'Tech Corp',
            duration: '3 years',
            description: 'Led development of React-based web applications'
          }
        ],
        education: [
          {
            degree: 'Bachelor of Science',
            field: 'Computer Science',
            institution: 'Stanford University',
            year: '2018'
          }
        ]
      },
      {
        name: 'Sarah Johnson',
        email: 'sarah.johnson@email.com',
        phone: '+1-555-0124',
        location: 'New York, NY',
        skills: ['Python', 'Machine Learning', 'TensorFlow', 'SQL', 'Data Analysis'],
        normalized_skills: [
          { original: 'Python', normalized: 'Python', category: 'Programming Languages' },
          { original: 'Machine Learning', normalized: 'Machine Learning', category: 'AI/ML' },
          { original: 'TensorFlow', normalized: 'TensorFlow', category: 'AI/ML Frameworks' },
          { original: 'SQL', normalized: 'SQL', category: 'Databases' },
          { original: 'Data Analysis', normalized: 'Data Analysis', category: 'Data Science' }
        ],
        experience: [
          {
            title: 'Data Scientist',
            company: 'AI Solutions Inc',
            duration: '2 years',
            description: 'Developed ML models for predictive analytics'
          }
        ],
        education: [
          {
            degree: 'Master of Science',
            field: 'Data Science',
            institution: 'MIT',
            year: '2020'
          }
        ]
      },
      {
        name: 'Mike Chen',
        email: 'mike.chen@email.com',
        phone: '+1-555-0125',
        location: 'Seattle, WA',
        skills: ['Java', 'Spring Boot', 'AWS', 'Docker', 'Kubernetes'],
        normalized_skills: [
          { original: 'Java', normalized: 'Java', category: 'Programming Languages' },
          { original: 'Spring Boot', normalized: 'Spring Boot', category: 'Backend Frameworks' },
          { original: 'AWS', normalized: 'Amazon Web Services', category: 'Cloud Platforms' },
          { original: 'Docker', normalized: 'Docker', category: 'Containerization' },
          { original: 'Kubernetes', normalized: 'Kubernetes', category: 'Container Orchestration' }
        ],
        experience: [
          {
            title: 'DevOps Engineer',
            company: 'CloudTech Solutions',
            duration: '4 years',
            description: 'Managed cloud infrastructure and CI/CD pipelines'
          }
        ],
        education: [
          {
            degree: 'Bachelor of Engineering',
            field: 'Software Engineering',
            institution: 'University of Washington',
            year: '2017'
          }
        ]
      }
    ];

    // Create candidates
    console.log('👥 Creating candidates...');
    const createdCandidates = [];
    for (const candidateData of candidates) {
      const candidate = await Candidate.create(candidateData);
      
      // Generate embedding
      const embeddingResult = await embeddingService.generateCandidateEmbedding(candidate);
      if (embeddingResult.success) {
        const pineconeId = `candidate_${candidate.id}`;
        await pineconeService.upsertVector(pineconeId, embeddingResult.embedding, {
          type: 'candidate',
          candidate_id: candidate.id,
          name: candidate.name,
          email: candidate.email
        });

        await candidate.update({
          embedding_vector: JSON.stringify(embeddingResult.embedding),
          pinecone_id: pineconeId
        });
      }
      
      createdCandidates.push(candidate);
    }
    console.log(`✅ Created ${createdCandidates.length} candidates`);

    // Sample jobs data
    const jobs = [
      {
        title: 'Senior Frontend Developer',
        company: 'TechStart Inc',
        description: 'We are looking for a talented frontend developer to join our team and help build amazing user experiences.',
        skills: ['React', 'JavaScript', 'TypeScript', 'CSS', 'HTML'],
        requirements: ['5+ years experience', 'Strong React skills', 'Team player'],
        location: 'San Francisco, CA',
        salary_range: { min: 120000, max: 180000 },
        job_type: 'full-time',
        experience_level: 'senior'
      },
      {
        title: 'Data Scientist',
        company: 'AI Innovations',
        description: 'Join our AI team to develop cutting-edge machine learning models and drive data-driven decisions.',
        skills: ['Python', 'Machine Learning', 'TensorFlow', 'SQL', 'Statistics'],
        requirements: ['3+ years ML experience', 'PhD preferred', 'Strong analytical skills'],
        location: 'New York, NY',
        salary_range: { min: 130000, max: 200000 },
        job_type: 'full-time',
        experience_level: 'senior'
      },
      {
        title: 'Backend Engineer',
        company: 'CloudScale Systems',
        description: 'Build scalable backend services and APIs that power our platform.',
        skills: ['Node.js', 'Python', 'PostgreSQL', 'AWS', 'Docker'],
        requirements: ['3+ years backend experience', 'Database design skills', 'Cloud experience'],
        location: 'Seattle, WA',
        salary_range: { min: 110000, max: 160000 },
        job_type: 'full-time',
        experience_level: 'mid'
      }
    ];

    // Create jobs
    console.log('💼 Creating jobs...');
    const createdJobs = [];
    for (const jobData of jobs) {
      const job = await Job.create(jobData);
      
      // Generate embedding
      const embeddingResult = await embeddingService.generateJobEmbedding(job);
      if (embeddingResult.success) {
        const pineconeId = `job_${job.id}`;
        await pineconeService.upsertVector(pineconeId, embeddingResult.embedding, {
          type: 'job',
          job_id: job.id,
          title: job.title,
          company: job.company
        });

        await job.update({
          embedding_vector: JSON.stringify(embeddingResult.embedding),
          pinecone_id: pineconeId
        });
      }
      
      createdJobs.push(job);
    }
    console.log(`✅ Created ${createdJobs.length} jobs`);

    // Create sample assessments
    console.log('📝 Creating sample assessments...');
    const assessments = [
      {
        candidate_id: createdCandidates[0].id,
        job_id: createdJobs[0].id,
        status: 'invited',
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        test_details: {
          role_type: 'frontend_developer',
          similarity_score: 0.92,
          created_via: 'auto_invite'
        }
      },
      {
        candidate_id: createdCandidates[1].id,
        job_id: createdJobs[1].id,
        status: 'completed',
        score: 85,
        max_score: 100,
        completion_time: 45,
        started_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        completed_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 45 * 60 * 1000),
        test_details: {
          role_type: 'data_scientist',
          similarity_score: 0.89,
          created_via: 'auto_invite'
        }
      }
    ];

    for (const assessmentData of assessments) {
      await Assessment.create(assessmentData);
    }
    console.log(`✅ Created ${assessments.length} assessments`);

    console.log('🎉 Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`- ${createdCandidates.length} candidates created`);
    console.log(`- ${createdJobs.length} jobs created`);
    console.log(`- ${assessments.length} assessments created`);
    console.log('\n🔗 Test the API:');
    console.log('- Health check: GET http://localhost:3001/health');
    console.log('- Get candidates: GET http://localhost:3001/api/resume/candidates');
    console.log('- Get jobs: GET http://localhost:3001/api/matching/jobs');
    console.log('- Match candidates: POST http://localhost:3001/api/matching/match');

  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
}

// Run seeding if called directly
if (require.main === module) {
  seedDatabase().then(() => {
    console.log('✅ Seeding completed');
    process.exit(0);
  }).catch((error) => {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  });
}

module.exports = { seedDatabase };
