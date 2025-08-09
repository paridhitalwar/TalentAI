const natural = require('natural');
const nlp = require('compromise');

// Mock AI model for demo - in production, use HuggingFace sentence-transformers
class AIMatchingService {
  constructor() {
    this.tokenizer = new natural.WordTokenizer();
    this.tfidf = new natural.TfIdf();
    
    // Skills taxonomy mapping (ESCO-based)
    this.skillsTaxonomy = {
      'machine-learning': ['ml', 'machine learning', 'deep learning', 'neural networks', 'ai', 'artificial intelligence'],
      'python': ['python', 'py', 'pandas', 'numpy', 'scikit-learn', 'tensorflow', 'pytorch'],
      'data-science': ['data science', 'data analysis', 'statistics', 'r', 'matlab', 'julia'],
      'mlops': ['mlops', 'machine learning operations', 'deployment', 'kubernetes', 'docker', 'aws', 'azure'],
      'nlp': ['nlp', 'natural language processing', 'text mining', 'bert', 'gpt', 'transformers'],
      'computer-vision': ['computer vision', 'image processing', 'opencv', 'cnn', 'object detection'],
      'big-data': ['big data', 'hadoop', 'spark', 'kafka', 'elasticsearch', 'mongodb'],
      'research': ['research', 'publications', 'papers', 'academic', 'phd', 'masters']
    };
  }

  // Calculate semantic similarity between candidate skills and job requirements
  async calculateMatch(candidateSkills, jobRequirements) {
    try {
      // Normalize and expand skills
      const normalizedCandidateSkills = this.normalizeSkills(candidateSkills);
      const normalizedJobRequirements = this.normalizeSkills(jobRequirements);
      
      // Calculate TF-IDF similarity
      const similarity = this.calculateTFIDFSimilarity(
        normalizedCandidateSkills, 
        normalizedJobRequirements
      );
      
      // Apply skill-specific bonuses
      const skillBonus = this.calculateSkillBonus(normalizedCandidateSkills, normalizedJobRequirements);
      
      // Calculate final match percentage
      const finalScore = Math.min(100, Math.max(0, (similarity * 100) + skillBonus));
      
      return {
        matchPercentage: Math.round(finalScore),
        similarity: similarity,
        skillBonus: skillBonus,
        matchedSkills: this.findMatchedSkills(normalizedCandidateSkills, normalizedJobRequirements),
        missingSkills: this.findMissingSkills(normalizedCandidateSkills, normalizedJobRequirements)
      };
    } catch (error) {
      console.error('Error calculating match:', error);
      throw new Error('Failed to calculate match score');
    }
  }

  // Normalize skills using taxonomy mapping
  normalizeSkills(skills) {
    if (typeof skills === 'string') {
      skills = skills.toLowerCase().split(/[,\s]+/);
    }
    
    const normalized = new Set();
    
    skills.forEach(skill => {
      const cleanSkill = skill.trim().toLowerCase();
      if (cleanSkill.length < 2) return;
      
      // Add original skill
      normalized.add(cleanSkill);
      
      // Add taxonomy mappings
      for (const [category, variations] of Object.entries(this.skillsTaxonomy)) {
        if (variations.some(v => cleanSkill.includes(v) || v.includes(cleanSkill))) {
          normalized.add(category);
          variations.forEach(v => normalized.add(v));
        }
      }
    });
    
    return Array.from(normalized);
  }

  // Calculate TF-IDF similarity
  calculateTFIDFSimilarity(skills1, skills2) {
    this.tfidf.resetDocument();
    this.tfidf.addDocument(skills1.join(' '));
    this.tfidf.addDocument(skills2.join(' '));
    
    const doc1 = this.tfidf.listTerms(0);
    const doc2 = this.tfidf.listTerms(1);
    
    const vector1 = this.createVector(doc1, skills1);
    const vector2 = this.createVector(doc2, skills2);
    
    return this.cosineSimilarity(vector1, vector2);
  }

  // Create feature vector from TF-IDF terms
  createVector(terms, skills) {
    const vector = {};
    terms.forEach(term => {
      vector[term.term] = term.score;
    });
    return vector;
  }

  // Calculate cosine similarity between two vectors
  cosineSimilarity(vec1, vec2) {
    const allTerms = new Set([...Object.keys(vec1), ...Object.keys(vec2)]);
    
    let dotProduct = 0;
    let norm1 = 0;
    let norm2 = 0;
    
    allTerms.forEach(term => {
      const val1 = vec1[term] || 0;
      const val2 = vec2[term] || 0;
      
      dotProduct += val1 * val2;
      norm1 += val1 * val1;
      norm2 += val2 * val2;
    });
    
    if (norm1 === 0 || norm2 === 0) return 0;
    
    return dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2));
  }

  // Calculate bonus for specific skill matches
  calculateSkillBonus(candidateSkills, jobSkills) {
    let bonus = 0;
    
    // Core AI/ML skills bonus
    const coreSkills = ['machine-learning', 'python', 'deep-learning', 'neural-networks'];
    const coreMatches = coreSkills.filter(skill => 
      candidateSkills.some(cs => cs.includes(skill)) && 
      jobSkills.some(js => js.includes(skill))
    );
    
    bonus += coreMatches.length * 5; // 5 points per core skill match
    
    // Experience level bonus (if available)
    const experienceBonus = this.calculateExperienceBonus(candidateSkills, jobSkills);
    bonus += experienceBonus;
    
    return Math.min(20, bonus); // Cap bonus at 20 points
  }

  // Calculate experience-based bonus
  calculateExperienceBonus(candidateSkills, jobSkills) {
    let bonus = 0;
    
    // Years of experience indicators
    const experienceIndicators = ['senior', 'lead', 'principal', 'architect', '5+', '10+'];
    const hasExperience = experienceIndicators.some(indicator => 
      candidateSkills.some(skill => skill.includes(indicator))
    );
    
    if (hasExperience) bonus += 10;
    
    return bonus;
  }

  // Find matched skills between candidate and job
  findMatchedSkills(candidateSkills, jobSkills) {
    return candidateSkills.filter(skill => 
      jobSkills.some(jobSkill => 
        skill.includes(jobSkill) || jobSkill.includes(skill)
      )
    );
  }

  // Find skills that job requires but candidate lacks
  findMissingSkills(candidateSkills, jobSkills) {
    return jobSkills.filter(jobSkill => 
      !candidateSkills.some(candidateSkill => 
        candidateSkill.includes(jobSkill) || jobSkill.includes(candidateSkill)
      )
    );
  }

  // Rank candidates by match score
  async rankCandidates(candidates, jobRequirements) {
    const rankedCandidates = [];
    
    for (const candidate of candidates) {
      const matchResult = await this.calculateMatch(candidate.skills, jobRequirements);
      rankedCandidates.push({
        ...candidate,
        matchResult
      });
    }
    
    // Sort by match percentage (descending)
    return rankedCandidates.sort((a, b) => b.matchResult.matchPercentage - a.matchResult.matchPercentage);
  }
}

module.exports = new AIMatchingService();
