const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

// Import models
const User = require('../models/User');
const Candidate = require('../models/Candidate');
const Job = require('../models/Job');

// Import database connection
const database = require('../config/database');

// Sample data arrays
const sampleNames = [
  'Dr. Sarah Chen', 'Alex Rodriguez', 'Dr. Michael Kim', 'Priya Patel', 'Dr. James Wilson',
  'Maria Garcia', 'Dr. David Lee', 'Aisha Johnson', 'Dr. Robert Brown', 'Sofia Martinez',
  'Dr. Christopher Davis', 'Fatima Ahmed', 'Dr. Daniel Miller', 'Isabella Silva', 'Dr. Matthew Taylor',
  'Dr. Emily Anderson', 'Carlos Mendez', 'Dr. Joshua White', 'Dr. Amanda Thompson', 'Lucas Oliveira',
  'Dr. Kevin Martin', 'Dr. Rachel Green', 'Diego Hernandez', 'Dr. Steven Clark', 'Dr. Lisa Lewis',
  'Dr. Andrew Hall', 'Dr. Jennifer Young', 'Miguel Torres', 'Dr. Ryan King', 'Dr. Nicole Wright',
  'Dr. Brandon Lopez', 'Dr. Stephanie Hill', 'Rafael Santos', 'Dr. Tyler Scott', 'Dr. Danielle Baker',
  'Dr. Nathan Adams', 'Dr. Michelle Nelson', 'Gabriel Costa', 'Dr. Jonathan Carter', 'Dr. Ashley Mitchell',
  'Dr. Justin Perez', 'Dr. Samantha Roberts', 'Dr. Brandon Turner', 'Dr. Victoria Phillips', 'Dr. Sean Campbell',
  'Dr. Rebecca Parker', 'Dr. Adam Evans', 'Dr. Lauren Edwards', 'Dr. Kyle Collins', 'Dr. Megan Stewart',
  'Dr. Brandon Morris', 'Dr. Tiffany Rogers', 'Dr. Derek Reed', 'Dr. Crystal Cook', 'Dr. Marcus Morgan',
  'Dr. Natasha Bell', 'Dr. Travis Murphy', 'Dr. Jasmine Bailey', 'Dr. Corey Rivera', 'Dr. Brittany Cooper',
  'Dr. Jordan Richardson', 'Dr. Sierra Cox', 'Dr. Casey Ward', 'Dr. Alexis Torres', 'Dr. Riley Peterson',
  'Dr. Jordan Gray', 'Dr. Skylar James', 'Dr. Casey Watson', 'Dr. Riley Brooks', 'Dr. Jordan Kelly',
  'Dr. Skylar Sanders', 'Dr. Casey Price', 'Dr. Riley Bennett', 'Dr. Jordan Wood', 'Dr. Skylar Barnes',
  'Dr. Casey Ross', 'Dr. Riley Henderson', 'Dr. Jordan Coleman', 'Dr. Skylar Jenkins', 'Dr. Casey Perry',
  'Dr. Riley Powell', 'Dr. Jordan Long', 'Dr. Skylar Patterson', 'Dr. Casey Hughes', 'Dr. Riley Flores',
  'Dr. Jordan Washington', 'Dr. Skylar Butler', 'Dr. Casey Simmons', 'Dr. Riley Foster', 'Dr. Jordan Gonzales',
  'Dr. Skylar Bryant', 'Dr. Casey Alexander', 'Dr. Riley Russell', 'Dr. Jordan Griffin', 'Dr. Skylar Diaz',
  'Dr. Casey Hayes', 'Dr. Riley Myers', 'Dr. Jordan Ford', 'Dr. Skylar Hamilton', 'Dr. Casey Graham'
];

const sampleCompanies = [
  'TechCorp AI', 'DataFlow Systems', 'NeuralNet Solutions', 'QuantumML Inc', 'DeepMind Technologies',
  'AI Innovations Lab', 'Machine Learning Corp', 'Intelligent Systems', 'Cognitive Computing', 'Predictive Analytics',
  'Smart Algorithms', 'Neural Networks Pro', 'Deep Learning Hub', 'AI Research Institute', 'ML Engineering Co',
  'Data Science Partners', 'Intelligent Automation', 'Cognitive Robotics', 'AI Development Studio', 'ML Solutions Group',
  'Neural Computing', 'Deep Intelligence', 'Smart Systems Inc', 'AI Engineering Corp', 'Machine Intelligence',
  'Data Intelligence Lab', 'Cognitive Systems', 'Neural Solutions', 'Deep Learning Pro', 'AI Technologies',
  'ML Development', 'Intelligent Computing', 'Neural Engineering', 'Deep Systems', 'Smart Computing',
  'AI Solutions', 'Machine Learning Pro', 'Data Intelligence', 'Cognitive Computing', 'Neural Intelligence'
];

const sampleLocations = [
  'San Francisco, CA', 'New York, NY', 'Seattle, WA', 'Austin, TX', 'Boston, MA',
  'Los Angeles, CA', 'Chicago, IL', 'Denver, CO', 'Atlanta, GA', 'Washington, DC',
  'Portland, OR', 'Nashville, TN', 'Miami, FL', 'Phoenix, AZ', 'Dallas, TX',
  'Philadelphia, PA', 'San Diego, CA', 'Charlotte, NC', 'Minneapolis, MN', 'Detroit, MI',
  'Houston, TX', 'Columbus, OH', 'Indianapolis, IN', 'Kansas City, MO', 'Las Vegas, NV',
  'Orlando, FL', 'Cincinnati, OH', 'Pittsburgh, PA', 'Milwaukee, WI', 'Cleveland, OH',
  'Tampa, FL', 'St. Louis, MO', 'Raleigh, NC', 'Jacksonville, FL', 'Memphis, TN'
];

const technicalSkills = [
  'Python', 'TensorFlow', 'PyTorch', 'Scikit-learn', 'Keras', 'NumPy', 'Pandas', 'Matplotlib',
  'Seaborn', 'Jupyter', 'R', 'MATLAB', 'Julia', 'Java', 'C++', 'C#', 'JavaScript', 'TypeScript',
  'SQL', 'MongoDB', 'PostgreSQL', 'Redis', 'Elasticsearch', 'AWS', 'Azure', 'GCP', 'Docker',
  'Kubernetes', 'Jenkins', 'Git', 'GitHub', 'GitLab', 'Linux', 'Unix', 'Shell Scripting',
  'Apache Spark', 'Hadoop', 'Kafka', 'Airflow', 'MLflow', 'Kubeflow', 'SageMaker', 'Vertex AI',
  'Computer Vision', 'NLP', 'Deep Learning', 'Machine Learning', 'Data Science', 'Statistics',
  'Linear Algebra', 'Calculus', 'Probability', 'Optimization', 'Neural Networks', 'CNN', 'RNN',
  'LSTM', 'GRU', 'Transformer', 'BERT', 'GPT', 'XGBoost', 'LightGBM', 'Random Forest',
  'SVM', 'K-means', 'DBSCAN', 'PCA', 't-SNE', 'AutoML', 'MLOps', 'Model Deployment'
];

const softSkills = [
  'Leadership', 'Communication', 'Problem Solving', 'Critical Thinking', 'Creativity',
  'Adaptability', 'Time Management', 'Teamwork', 'Collaboration', 'Mentoring',
  'Project Management', 'Strategic Thinking', 'Innovation', 'Research', 'Analysis',
  'Documentation', 'Presentation', 'Negotiation', 'Conflict Resolution', 'Decision Making',
  'Risk Management', 'Quality Assurance', 'Continuous Learning', 'Mentoring', 'Coaching'
];

const educationDegrees = [
  'PhD Computer Science', 'PhD Machine Learning', 'PhD Data Science', 'PhD Statistics',
  'MS Computer Science', 'MS Machine Learning', 'MS Data Science', 'MS Statistics',
  'BS Computer Science', 'BS Mathematics', 'BS Statistics', 'BS Engineering',
  'MBA Technology Management', 'MS Business Analytics', 'PhD Artificial Intelligence'
];

const institutions = [
  'Stanford University', 'MIT', 'Carnegie Mellon University', 'UC Berkeley', 'Harvard University',
  'Georgia Tech', 'University of Washington', 'University of Michigan', 'Cornell University',
  'University of Illinois', 'University of Texas', 'University of Wisconsin', 'Purdue University',
  'University of Maryland', 'University of Pennsylvania', 'Columbia University', 'Yale University',
  'Princeton University', 'Duke University', 'Northwestern University', 'University of Chicago',
  'University of California', 'University of Southern California', 'New York University'
];

// Generate random candidate data
function generateCandidate(index) {
  const name = sampleNames[index % sampleNames.length];
  const email = `${name.toLowerCase().replace(/[^a-z]/g, '')}${index}@example.com`;
  const experienceYears = Math.floor(Math.random() * 15) + 1;
  const experienceLevel = experienceYears < 2 ? 'entry' : 
                         experienceYears < 4 ? 'junior' : 
                         experienceYears < 7 ? 'mid' : 
                         experienceYears < 10 ? 'senior' : 
                         experienceYears < 13 ? 'lead' : 'principal';
  
  // Generate skills based on experience level
  const numTechnicalSkills = Math.floor(Math.random() * 15) + 5;
  const numFrameworks = Math.floor(Math.random() * 8) + 3;
  const numTools = Math.floor(Math.random() * 10) + 5;
  
  const technical = technicalSkills.sort(() => 0.5 - Math.random()).slice(0, numTechnicalSkills);
  const frameworks = technicalSkills.filter(s => ['TensorFlow', 'PyTorch', 'Keras', 'Scikit-learn'].includes(s))
    .sort(() => 0.5 - Math.random()).slice(0, numFrameworks);
  const tools = technicalSkills.filter(s => ['Docker', 'Kubernetes', 'AWS', 'Git', 'Linux'].includes(s))
    .sort(() => 0.5 - Math.random()).slice(0, numTools);
  
  const soft = softSkills.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 8) + 3);
  
  // Generate education
  const education = [];
  if (Math.random() > 0.3) {
    education.push({
      degree: educationDegrees[Math.floor(Math.random() * educationDegrees.length)],
      field: 'Computer Science',
      institution: institutions[Math.floor(Math.random() * institutions.length)],
      graduationYear: 2024 - Math.floor(Math.random() * 10),
      gpa: 3.5 + Math.random() * 0.5
    });
  }
  
  // Generate experience companies
  const companies = [];
  const numCompanies = Math.floor(Math.random() * 4) + 1;
  for (let i = 0; i < numCompanies; i++) {
    companies.push({
      name: sampleCompanies[Math.floor(Math.random() * sampleCompanies.length)],
      position: `${experienceLevel} ${['ML Engineer', 'Data Scientist', 'AI Researcher', 'ML Researcher'][Math.floor(Math.random() * 4)]}`,
      duration: `${Math.floor(Math.random() * 3) + 1} years`,
      description: 'Developed and deployed machine learning models for production systems',
      startDate: new Date(2024 - experienceYears - i * 2, Math.floor(Math.random() * 12), 1),
      endDate: i === 0 ? null : new Date(2024 - experienceYears - i * 2 + 2, Math.floor(Math.random() * 12), 1),
      current: i === 0
    });
  }
  
  // Generate projects
  const projects = [];
  const numProjects = Math.floor(Math.random() * 5) + 2;
  for (let i = 0; i < numProjects; i++) {
    projects.push({
      name: `${['Image Classification', 'NLP Model', 'Recommendation System', 'Time Series Analysis', 'Computer Vision'][Math.floor(Math.random() * 5)]} Project`,
      description: 'Developed a machine learning model for real-world applications',
      technologies: technical.slice(0, Math.floor(Math.random() * 5) + 3),
      url: `https://github.com/${name.toLowerCase().replace(/[^a-z]/g, '')}/project-${i}`,
      github: `https://github.com/${name.toLowerCase().replace(/[^a-z]/g, '')}`,
      impact: 'Improved accuracy by 15% and reduced inference time by 30%'
    });
  }
  
  // Generate publications (more likely for PhDs)
  const publications = [];
  if (education.some(e => e.degree.includes('PhD')) && Math.random() > 0.5) {
    const numPublications = Math.floor(Math.random() * 8) + 1;
    for (let i = 0; i < numPublications; i++) {
      publications.push({
        title: `${['Deep Learning', 'Machine Learning', 'AI', 'Neural Networks'][Math.floor(Math.random() * 4)]} in ${['Computer Vision', 'NLP', 'Reinforcement Learning', 'Generative AI'][Math.floor(Math.random() * 4)]}`,
        authors: [name, 'Dr. John Smith', 'Dr. Jane Doe'],
        journal: `${['ICML', 'NeurIPS', 'ICLR', 'AAAI', 'IJCAI'][Math.floor(Math.random() * 5)]} 2024`,
        date: new Date(2024, Math.floor(Math.random() * 12), 1),
        url: `https://arxiv.org/abs/2024.${Math.floor(Math.random() * 10000)}`,
        citations: Math.floor(Math.random() * 50)
      });
    }
  }
  
  return {
    name,
    email,
    phone: `+1-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
    location: {
      city: sampleLocations[Math.floor(Math.random() * sampleLocations.length)].split(',')[0],
      state: sampleLocations[Math.floor(Math.random() * sampleLocations.length)].split(',')[1].trim(),
      country: 'USA',
      region: sampleLocations[Math.floor(Math.random() * sampleLocations.length)]
    },
    title: `${experienceLevel.charAt(0).toUpperCase() + experienceLevel.slice(1)} ${['Machine Learning Engineer', 'Data Scientist', 'AI Researcher', 'ML Engineer'][Math.floor(Math.random() * 4)]}`,
    summary: `Experienced ${experienceLevel} professional with expertise in ${technical.slice(0, 3).join(', ')}. Passionate about developing innovative AI solutions and driving business impact through machine learning.`,
    experience: {
      years: experienceYears,
      level: experienceLevel,
      companies
    },
    skills: {
      technical,
      soft,
      languages: ['English', 'Spanish', 'Mandarin', 'French'].slice(0, Math.floor(Math.random() * 3) + 1),
      frameworks,
      tools,
      domains: ['Machine Learning', 'Deep Learning', 'Computer Vision', 'NLP', 'Data Science'].slice(0, Math.floor(Math.random() * 3) + 1)
    },
    education,
    projects,
    publications,
    availability: ['immediate', '2-weeks', '1-month', '3-months'][Math.floor(Math.random() * 4)],
    salary: {
      current: 80000 + Math.random() * 120000,
      expected: 100000 + Math.random() * 150000,
      currency: 'USD'
    },
    preferences: {
      remote: Math.random() > 0.3,
      relocation: Math.random() > 0.5,
      travel: Math.random() > 0.7,
      industries: ['Technology', 'Healthcare', 'Finance', 'E-commerce', 'Education'].slice(0, Math.floor(Math.random() * 3) + 1),
      companySize: ['startup', 'small', 'medium', 'large'][Math.floor(Math.random() * 4)]
    },
    status: 'active',
    source: 'seeder',
    tags: [...technical.slice(0, 5), ...soft.slice(0, 3)],
    notes: 'Generated candidate for testing purposes'
  };
}

// Generate sample jobs
function generateJobs() {
  const jobTitles = [
    'Senior Machine Learning Engineer', 'ML Research Scientist', 'Data Scientist', 'AI Engineer',
    'Computer Vision Engineer', 'NLP Engineer', 'MLOps Engineer', 'Deep Learning Engineer',
    'Machine Learning Engineer', 'AI Research Engineer', 'ML Platform Engineer', 'Data Engineer',
    'Senior Data Scientist', 'AI Product Manager', 'ML Infrastructure Engineer'
  ];
  
  const jobs = [];
  
  for (let i = 0; i < 25; i++) {
    const company = sampleCompanies[Math.floor(Math.random() * sampleCompanies.length)];
    const location = sampleLocations[Math.floor(Math.random() * sampleLocations.length)];
    const experienceLevel = ['mid', 'senior', 'lead'][Math.floor(Math.random() * 3)];
    const experienceYears = experienceLevel === 'mid' ? [3, 5] : experienceLevel === 'senior' ? [5, 8] : [8, 12];
    
    const primarySkills = technicalSkills.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 8) + 5);
    const secondarySkills = technicalSkills.filter(s => !primarySkills.includes(s)).sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 5) + 3);
    
    jobs.push({
      title: jobTitles[Math.floor(Math.random() * jobTitles.length)],
      company: {
        name: company,
        size: ['startup', 'small', 'medium', 'large', 'enterprise'][Math.floor(Math.random() * 5)],
        industry: ['Technology', 'Healthcare', 'Finance', 'E-commerce', 'Education'][Math.floor(Math.random() * 5)]
      },
      location: {
        city: location.split(',')[0],
        state: location.split(',')[1].trim(),
        country: 'USA',
        remote: Math.random() > 0.4,
        hybrid: Math.random() > 0.6,
        onsite: Math.random() > 0.3
      },
      type: ['full-time', 'contract'][Math.floor(Math.random() * 2)],
      experience: {
        min: experienceYears[0],
        max: experienceYears[1],
        level: experienceLevel
      },
      salary: {
        min: 80000 + Math.random() * 80000,
        max: 150000 + Math.random() * 150000,
        currency: 'USD',
        equity: Math.random() > 0.5,
        bonus: Math.random() > 0.3
      },
      requirements: {
        technical: primarySkills,
        soft: softSkills.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 5) + 3),
        education: {
          degree: 'BS/MS/PhD',
          field: 'Computer Science or related',
          required: true
        }
      },
      responsibilities: [
        'Design and implement machine learning models',
        'Optimize model performance and scalability',
        'Collaborate with cross-functional teams',
        'Deploy models to production environments',
        'Conduct research and stay updated with latest ML trends'
      ],
      description: {
        short: `We are looking for a ${experienceLevel} ${jobTitles[Math.floor(Math.random() * jobTitles.length)]} to join our AI team.`,
        detailed: `Join our innovative team to build cutting-edge machine learning solutions that drive business value. You'll work on challenging problems in ${primarySkills.slice(0, 3).join(', ')} and collaborate with talented engineers and researchers.`
      },
      application: {
        deadline: new Date(2024, Math.floor(Math.random() * 6) + 6, Math.floor(Math.random() * 28) + 1),
        maxApplications: 100,
        currentApplications: Math.floor(Math.random() * 20)
      },
      status: 'active',
      aiRequirements: {
        primarySkills,
        secondarySkills,
        experienceWeight: 0.3,
        skillWeight: 0.4,
        educationWeight: 0.2,
        locationWeight: 0.1
      },
      tags: [...primarySkills.slice(0, 5), experienceLevel, 'AI', 'ML'],
      urgency: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)]
    });
  }
  
  return jobs;
}

// Generate sample users
function generateUsers() {
  const users = [];
  
  // Admin user
  users.push({
    email: 'admin@talentai.com',
    password: 'admin123',
    name: 'System Administrator',
    role: 'admin',
    permissions: ['manage_users', 'manage_system', 'view_all_data'],
    status: 'active',
    emailVerified: true
  });
  
  // Recruiter users
  for (let i = 0; i < 10; i++) {
    const company = sampleCompanies[Math.floor(Math.random() * sampleCompanies.length)];
    users.push({
      email: `recruiter${i + 1}@${company.toLowerCase().replace(/[^a-z]/g, '')}.com`,
      password: 'recruiter123',
      name: `Recruiter ${i + 1}`,
      role: 'recruiter',
      company: {
        name: company,
        position: 'Senior Recruiter',
        department: 'Talent Acquisition',
        verified: true
      },
      permissions: ['view_candidates', 'view_jobs', 'create_jobs', 'manage_applications'],
      status: 'active',
      emailVerified: true
    });
  }
  
  return users;
}

// Main seeding function
async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Connect to database
    await database.connect();
    
    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await User.deleteMany({});
    await Candidate.deleteMany({});
    await Job.deleteMany({});
    
    // Generate and insert users
    console.log('👥 Creating users...');
    const users = generateUsers();
    const createdUsers = await User.insertMany(users);
    console.log(`✅ Created ${createdUsers.length} users`);
    
    // Generate and insert candidates
    console.log('👨‍💼 Creating candidates...');
    const candidates = [];
    for (let i = 0; i < 120; i++) {
      candidates.push(generateCandidate(i));
    }
    const createdCandidates = await Candidate.insertMany(candidates);
    console.log(`✅ Created ${createdCandidates.length} candidates`);
    
    // Generate and insert jobs
    console.log('💼 Creating jobs...');
    const jobs = generateJobs();
    const createdJobs = await Job.insertMany(jobs);
    console.log(`✅ Created ${createdJobs.length} jobs`);
    
    // Update candidate users with candidate profiles
    console.log('🔗 Linking candidates to users...');
    const candidateUsers = createdUsers.filter(u => u.role === 'candidate');
    for (let i = 0; i < Math.min(candidateUsers.length, createdCandidates.length); i++) {
      await User.findByIdAndUpdate(candidateUsers[i]._id, {
        'candidate.id': createdCandidates[i]._id.toString(),
        'candidate.profile': createdCandidates[i]._id
      });
    }
    
    console.log('🎉 Database seeding completed successfully!');
    console.log(`📊 Summary:`);
    console.log(`   - Users: ${createdUsers.length}`);
    console.log(`   - Candidates: ${createdCandidates.length}`);
    console.log(`   - Jobs: ${createdJobs.length}`);
    
    // Disconnect from database
    await database.disconnect();
    
  } catch (error) {
    console.error('❌ Database seeding failed:', error);
    await database.disconnect();
    process.exit(1);
  }
}

// Run seeding if called directly
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase, generateCandidate, generateJobs, generateUsers };
