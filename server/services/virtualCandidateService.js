const Candidate = require('../models/Candidate');
const Job = require('../models/Job');
const Application = require('../models/Application');
const { calculateMatch } = require('./aiMatching');

class VirtualCandidateService {
  // Apply virtual candidates to a new job posting
  static async applyVirtualCandidatesToJob(jobId, limit = 1000) {
    try {
      console.log(`🤖 Applying virtual candidates to job ${jobId}...`);
      
      const job = await Job.findById(jobId);
      if (!job || job.status !== 'active') {
        throw new Error('Job not found or not active');
      }

      // Get virtual candidates (those without associated users)
      const virtualCandidates = await Candidate.find({
        email: { $regex: /@example\.com$/ } // Virtual candidates have example.com emails
      }).limit(limit);

      console.log(`📊 Found ${virtualCandidates.length} virtual candidates to apply`);

      const applications = [];
      const batchSize = 100;

      for (let i = 0; i < virtualCandidates.length; i++) {
        const candidate = virtualCandidates[i];
        
        try {
          // Calculate match score
          const matchScore = await calculateMatch(candidate, job);
          
          // Determine matched and missing skills
          const matchedSkills = candidate.skills?.technical?.filter(skill => 
            job.aiRequirements?.primarySkills?.includes(skill) || 
            job.aiRequirements?.secondarySkills?.includes(skill)
          ) || [];
          
          const missingSkills = job.aiRequirements?.primarySkills?.filter(skill => 
            !candidate.skills?.technical?.includes(skill)
          ) || [];

          // Create application
          const application = new Application({
            jobId,
            candidateId: candidate._id,
            userId: null, // Virtual candidates don't have user accounts
            matchScore,
            matchedSkills,
            missingSkills,
            status: 'applied'
          });

          applications.push(application);

          // Insert in batches to avoid memory issues
          if (applications.length >= batchSize) {
            await Application.insertMany(applications);
            console.log(`✅ Applied ${i + 1} virtual candidates`);
            applications.length = 0; // Clear array
          }

        } catch (error) {
          console.error(`Error applying candidate ${candidate._id}:`, error);
          continue; // Continue with next candidate
        }
      }

      // Insert remaining applications
      if (applications.length > 0) {
        await Application.insertMany(applications);
      }

      // Update job application count
      const totalApplications = await Application.countDocuments({ jobId });
      await Job.findByIdAndUpdate(jobId, {
        'application.currentApplications': totalApplications
      });

      console.log(`🎉 Successfully applied ${virtualCandidates.length} virtual candidates to job ${jobId}`);
      return virtualCandidates.length;

    } catch (error) {
      console.error('Error applying virtual candidates:', error);
      throw error;
    }
  }

  // Get top candidates for a job (including virtual candidates)
  static async getTopCandidatesForJob(jobId, limit = 1000) {
    try {
      const applications = await Application.findTopCandidates(jobId, limit);
      
      // Enrich with candidate details
      const enrichedApplications = applications.map(app => ({
        ...app.toObject(),
        candidate: app.candidateId,
        isVirtual: !app.userId // Virtual candidates don't have user IDs
      }));

      return enrichedApplications;
    } catch (error) {
      console.error('Error getting top candidates:', error);
      throw error;
    }
  }

  // Simulate virtual candidate activity (for demo purposes)
  static async simulateVirtualCandidateActivity() {
    try {
      console.log('🤖 Simulating virtual candidate activity...');
      
      // Get active jobs
      const activeJobs = await Job.find({ status: 'active' });
      
      for (const job of activeJobs) {
        // Check if virtual candidates have already applied
        const existingApplications = await Application.countDocuments({ 
          jobId: job._id,
          userId: null // Virtual candidates
        });

        if (existingApplications === 0) {
          // Apply virtual candidates to this job
          await this.applyVirtualCandidatesToJob(job._id, 1000);
        }
      }

      console.log('✅ Virtual candidate activity simulation completed');
    } catch (error) {
      console.error('Error simulating virtual candidate activity:', error);
      throw error;
    }
  }

  // Get virtual candidate statistics
  static async getVirtualCandidateStats() {
    try {
      const totalVirtualCandidates = await Candidate.countDocuments({
        email: { $regex: /@example\.com$/ }
      });

      const totalApplications = await Application.countDocuments({
        userId: null // Virtual candidates
      });

      const activeJobs = await Job.countDocuments({ status: 'active' });

      const averageApplicationsPerJob = activeJobs > 0 ? Math.round(totalApplications / activeJobs) : 0;

      return {
        totalVirtualCandidates,
        totalApplications,
        activeJobs,
        averageApplicationsPerJob
      };
    } catch (error) {
      console.error('Error getting virtual candidate stats:', error);
      throw error;
    }
  }

  // Clean up old virtual candidate applications (optional)
  static async cleanupOldApplications(daysOld = 30) {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysOld);

      const result = await Application.deleteMany({
        userId: null, // Virtual candidates only
        appliedAt: { $lt: cutoffDate },
        status: { $in: ['rejected', 'withdrawn'] }
      });

      console.log(`🧹 Cleaned up ${result.deletedCount} old virtual candidate applications`);
      return result.deletedCount;
    } catch (error) {
      console.error('Error cleaning up old applications:', error);
      throw error;
    }
  }
}

module.exports = VirtualCandidateService;
