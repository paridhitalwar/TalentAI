const OpenAI = require('openai');

class EmbeddingService {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
    this.model = process.env.OPENAI_MODEL || 'text-embedding-3-small';
  }

  async generateEmbedding(text) {
    try {
      console.log('🧠 Generating embedding...');
      
      const response = await this.openai.embeddings.create({
        model: this.model,
        input: text,
        encoding_format: 'float'
      });

      return {
        success: true,
        embedding: response.data[0].embedding
      };
    } catch (error) {
      console.error('❌ Embedding generation error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async generateCandidateEmbedding(candidate) {
    try {
      // Create a comprehensive text representation of the candidate
      const skillsText = candidate.skills.join(', ');
      const normalizedSkillsText = candidate.normalized_skills
        .map(skill => skill.normalized || skill.original)
        .join(', ');
      
      const experienceText = candidate.experience
        .map(exp => `${exp.title} at ${exp.company}: ${exp.description}`)
        .join(' ');
      
      const educationText = candidate.education
        .map(edu => `${edu.degree} in ${edu.field} from ${edu.institution}`)
        .join(' ');
      
      const candidateText = `
        ${candidate.name}
        Skills: ${skillsText}
        Normalized Skills: ${normalizedSkillsText}
        Experience: ${experienceText}
        Education: ${educationText}
        Location: ${candidate.location || ''}
      `.trim();

      return await this.generateEmbedding(candidateText);
    } catch (error) {
      console.error('❌ Candidate embedding error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async generateJobEmbedding(job) {
    try {
      // Create a comprehensive text representation of the job
      const skillsText = job.skills.join(', ');
      const requirementsText = job.requirements.join(', ');
      
      const jobText = `
        ${job.title} at ${job.company}
        Description: ${job.description}
        Required Skills: ${skillsText}
        Requirements: ${requirementsText}
        Location: ${job.location || ''}
        Job Type: ${job.job_type}
        Experience Level: ${job.experience_level}
      `.trim();

      return await this.generateEmbedding(jobText);
    } catch (error) {
      console.error('❌ Job embedding error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  calculateSimilarity(embedding1, embedding2) {
    try {
      if (!embedding1 || !embedding2 || embedding1.length !== embedding2.length) {
        return 0;
      }

      // Calculate cosine similarity
      let dotProduct = 0;
      let norm1 = 0;
      let norm2 = 0;

      for (let i = 0; i < embedding1.length; i++) {
        dotProduct += embedding1[i] * embedding2[i];
        norm1 += embedding1[i] * embedding1[i];
        norm2 += embedding2[i] * embedding2[i];
      }

      norm1 = Math.sqrt(norm1);
      norm2 = Math.sqrt(norm2);

      if (norm1 === 0 || norm2 === 0) {
        return 0;
      }

      return dotProduct / (norm1 * norm2);
    } catch (error) {
      console.error('❌ Similarity calculation error:', error);
      return 0;
    }
  }
}

module.exports = new EmbeddingService();
