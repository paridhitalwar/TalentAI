#!/usr/bin/env node

const { seedDatabase } = require('./scripts/seedDatabase');

console.log('🚀 Starting TalentAI Database Seeding...');
console.log('This will create:');
console.log('  - 1 Admin user (admin@talentai.com)');
console.log('  - 1 Dummy user (user@example.com)');
console.log('  - 1 Recruiter (recruiter@techcorp.com)');
console.log('  - 100,000 Virtual candidates');
console.log('  - 25 Sample jobs');
console.log('  - 1 Active challenge');
console.log('');

seedDatabase()
  .then(() => {
    console.log('\n✅ Seeding completed successfully!');
    console.log('\n🔑 Login Credentials:');
    console.log('  Admin: admin@talentai.com / admin123');
    console.log('  User: user@example.com / user123');
    console.log('  Recruiter: recruiter@techcorp.com / recruiter123');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Seeding failed:', error);
    process.exit(1);
  });
