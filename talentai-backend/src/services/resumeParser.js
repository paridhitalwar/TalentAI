const axios = require('axios');
const fs = require('fs');
const path = require('path');

class ResumeParserService {
  constructor() {
    this.affindaApiKey = process.env.AFFINDA_API_KEY;
    this.affindaBaseUrl = process.env.AFFINDA_BASE_URL || 'https://api.affinda.com/v3';
    this.escoBaseUrl = process.env.ESCO_BASE_URL || 'https://ec.europa.eu/esco/api';
  }

  async parseResume(filePath, fileName) {
    try {
      console.log('📄 Starting resume parsing...');
      
      // Parse resume using Affinda API
      const parsedData = await this.parseWithAffinda(filePath);
      
      // Normalize skills using ESCO API
      const normalizedSkills = await this.normalizeSkills(parsedData.skills || []);
      
      return {
        success: true,
        data: {
          ...parsedData,
          normalized_skills: normalizedSkills
        }
      };
    } catch (error) {
      console.error('❌ Resume parsing error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async parseWithAffinda(filePath) {
    try {
      const fileBuffer = fs.readFileSync(filePath);
      const base64File = fileBuffer.toString('base64');
      
      const response = await axios.post(
        `${this.affindaBaseUrl}/resumes`,
        {
          file: base64File,
          file_name: path.basename(filePath)
        },
        {
          headers: {
            'Authorization': `Bearer ${this.affindaApiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const resumeData = response.data;
      
      return {
        name: resumeData.name || '',
        email: resumeData.email || '',
        phone: resumeData.phone || '',
        location: resumeData.location || '',
        skills: resumeData.skills || [],
        experience: resumeData.work_experience || [],
        education: resumeData.education || [],
        summary: resumeData.summary || '',
        languages: resumeData.languages || [],
        certifications: resumeData.certifications || []
      };
    } catch (error) {
      console.error('Affinda API error:', error.response?.data || error.message);
      
      // Fallback to basic parsing if Affinda fails
      return this.fallbackParsing(filePath);
    }
  }

  async normalizeSkills(skills) {
    try {
      const normalizedSkills = [];
      
      for (const skill of skills) {
        try {
          const response = await axios.get(`${this.escoBaseUrl}/search`, {
            params: {
              text: skill,
              type: 'skill',
              language: 'en'
            }
          });

          if (response.data._embedded && response.data._embedded.results.length > 0) {
            const topResult = response.data._embedded.results[0];
            normalizedSkills.push({
              original: skill,
              normalized: topResult.title,
              concept_uri: topResult._links.self.href,
              category: topResult._links.conceptType?.title || 'Unknown'
            });
          } else {
            normalizedSkills.push({
              original: skill,
              normalized: skill,
              concept_uri: null,
              category: 'Unknown'
            });
          }
        } catch (error) {
          console.warn(`Failed to normalize skill "${skill}":`, error.message);
          normalizedSkills.push({
            original: skill,
            normalized: skill,
            concept_uri: null,
            category: 'Unknown'
          });
        }
      }
      
      return normalizedSkills;
    } catch (error) {
      console.error('ESCO API error:', error);
      // Return original skills if normalization fails
      return skills.map(skill => ({
        original: skill,
        normalized: skill,
        concept_uri: null,
        category: 'Unknown'
      }));
    }
  }

  fallbackParsing(filePath) {
    // Basic fallback parsing for when Affinda API is not available
    const fileName = path.basename(filePath, path.extname(filePath));
    
    return {
      name: fileName.replace(/[_-]/g, ' '),
      email: '',
      phone: '',
      location: '',
      skills: [],
      experience: [],
      education: [],
      summary: '',
      languages: [],
      certifications: []
    };
  }
}

module.exports = new ResumeParserService();
