const { sequelize } = require('./src/config/database');

async function testSetup() {
  console.log('🧪 Testing TalentAI Backend Setup...\n');

  try {
    // Test database connection
    console.log('1. Testing database connection...');
    await sequelize.authenticate();
    console.log('✅ Database connection successful\n');

    // Test environment variables
    console.log('2. Checking environment variables...');
    const requiredEnvVars = [
      'DB_HOST', 'DB_PORT', 'DB_NAME', 'DB_USER', 'DB_PASSWORD',
      'OPENAI_API_KEY', 'PINECONE_API_KEY', 'PINECONE_ENVIRONMENT',
      'AFFINDA_API_KEY', 'HACKERRANK_API_KEY', 'JWT_SECRET'
    ];

    const missingVars = [];
    for (const varName of requiredEnvVars) {
      if (!process.env[varName]) {
        missingVars.push(varName);
      }
    }

    if (missingVars.length > 0) {
      console.log('⚠️  Missing environment variables:');
      missingVars.forEach(varName => console.log(`   - ${varName}`));
      console.log('\n💡 Please set these in your .env file\n');
    } else {
      console.log('✅ All required environment variables are set\n');
    }

    // Test model imports
    console.log('3. Testing model imports...');
    const Candidate = require('./src/models/Candidate');
    const Job = require('./src/models/Job');
    const Assessment = require('./src/models/Assessment');
    console.log('✅ All models imported successfully\n');

    // Test service imports
    console.log('4. Testing service imports...');
    const resumeParser = require('./src/services/resumeParser');
    const embeddingService = require('./src/services/embeddingService');
    const pineconeService = require('./src/services/pineconeService');
    const assessmentService = require('./src/services/assessmentService');
    console.log('✅ All services imported successfully\n');

    // Test route imports
    console.log('5. Testing route imports...');
    const resumeRoutes = require('./src/routes/resume');
    const matchingRoutes = require('./src/routes/matching');
    const assessmentRoutes = require('./src/routes/assessment');
    console.log('✅ All routes imported successfully\n');

    console.log('🎉 Setup test completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('1. Set up your PostgreSQL database');
    console.log('2. Configure your .env file with API keys');
    console.log('3. Run: npm run seed (to populate with sample data)');
    console.log('4. Run: npm run dev (to start the server)');
    console.log('\n🔗 API will be available at: http://localhost:3001');

  } catch (error) {
    console.error('❌ Setup test failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Make sure PostgreSQL is running');
    console.log('2. Check your database credentials in .env');
    console.log('3. Verify all dependencies are installed');
  }
}

testSetup();
