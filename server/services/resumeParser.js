const natural = require('natural');
const nlp = require('compromise');
const fs = require('fs');
const path = require('path');

class ResumeParserService {
  constructor() {
    this.tokenizer = new natural.WordTokenizer();
    this.tagger = new natural.BrillPOSTagger();
    
    // Skills patterns and keywords
    this.skillPatterns = {
      'programming': ['python', 'java', 'javascript', 'c++', 'c#', 'go', 'rust', 'scala', 'r', 'matlab', 'julia'],
      'ml_frameworks': ['tensorflow', 'pytorch', 'scikit-learn', 'keras', 'mxnet', 'caffe', 'theano'],
      'data_tools': ['pandas', 'numpy', 'matplotlib', 'seaborn', 'plotly', 'jupyter', 'rstudio'],
      'cloud_platforms': ['aws', 'azure', 'gcp', 'ibm cloud', 'oracle cloud', 'digitalocean'],
      'databases': ['postgresql', 'mysql', 'mongodb', 'redis', 'elasticsearch', 'cassandra', 'dynamodb'],
      'devops': ['docker', 'kubernetes', 'jenkins', 'gitlab', 'github actions', 'terraform', 'ansible'],
      'big_data': ['hadoop', 'spark', 'kafka', 'flink', 'storm', 'airflow', 'presto'],
      'research_tools': ['latex', 'mathematica', 'sas', 'spss', 'stata', 'minitab']
    };
    
    // Experience indicators
    this.experienceIndicators = [
      'years', 'yr', 'experience', 'worked', 'developed', 'implemented', 'designed',
      'architected', 'led', 'managed', 'supervised', 'mentored', 'trained'
    ];
    
    // Education indicators
    this.educationIndicators = [
      'university', 'college', 'institute', 'school', 'bachelor', 'master', 'phd', 'doctorate',
      'degree', 'diploma', 'certificate', 'graduated', 'alumni'
    ];
  }

  // Parse resume text and extract structured information
  async parseResume(resumeText, fileType = 'text') {
    try {
      const normalizedText = this.normalizeText(resumeText);
      
      const parsedData = {
        skills: this.extractSkills(normalizedText),
        experience: this.extractExperience(normalizedText),
        education: this.extractEducation(normalizedText),
        contact: this.extractContact(normalizedText),
        summary: this.extractSummary(normalizedText),
        languages: this.extractLanguages(normalizedText),
        certifications: this.extractCertifications(normalizedText),
        projects: this.extractProjects(normalizedText),
        publications: this.extractPublications(normalizedText)
      };
      
      // Calculate confidence scores
      parsedData.confidence = this.calculateConfidence(parsedData);
      
      // Normalize and clean extracted data
      parsedData.skills = this.normalizeSkills(parsedData.skills);
      parsedData.experience = this.normalizeExperience(parsedData.experience);
      
      return parsedData;
    } catch (error) {
      console.error('Error parsing resume:', error);
      throw new Error('Failed to parse resume');
    }
  }

  // Normalize text for processing
  normalizeText(text) {
    return text
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .replace(/[^\w\s\-\.\,\;\:\!\?]/g, '')
      .trim();
  }

  // Extract skills using pattern matching and NLP
  extractSkills(text) {
    const skills = new Set();
    
    // Extract skills using predefined patterns
    Object.values(this.skillPatterns).flat().forEach(skill => {
      if (text.includes(skill.toLowerCase())) {
        skills.add(skill);
      }
    });
    
    // Extract skills using NLP patterns
    const doc = nlp(text);
    
    // Look for technical terms (nouns that might be skills)
    const technicalTerms = doc.match('#Noun+ (framework|library|tool|platform|language|database)').out('array');
    technicalTerms.forEach(term => {
      const cleanTerm = term.replace(/\s+(framework|library|tool|platform|language|database)/, '').trim();
      if (cleanTerm.length > 2) {
        skills.add(cleanTerm);
      }
    });
    
    // Look for version numbers (e.g., Python 3.8, TensorFlow 2.x)
    const versionPattern = /(\w+)\s+[\d\.]+/g;
    let match;
    while ((match = versionPattern.exec(text)) !== null) {
      if (match[1].length > 2) {
        skills.add(match[1]);
      }
    }
    
    return Array.from(skills);
  }

  // Extract work experience
  extractExperience(text) {
    const experience = [];
    
    // Split text into sentences
    const sentences = text.split(/[.!?]+/);
    
    sentences.forEach(sentence => {
      if (this.isExperienceSentence(sentence)) {
        const exp = this.parseExperienceSentence(sentence);
        if (exp) {
          experience.push(exp);
        }
      }
    });
    
    return experience;
  }

  // Check if sentence contains experience information
  isExperienceSentence(sentence) {
    return this.experienceIndicators.some(indicator => 
      sentence.includes(indicator)
    );
  }

  // Parse individual experience sentence
  parseExperienceSentence(sentence) {
    const doc = nlp(sentence);
    
    // Extract company/organization names
    const organizations = doc.organizations().out('array');
    
    // Extract time periods
    const timePeriods = doc.match('#Time+').out('array');
    
    // Extract job titles
    const jobTitles = doc.match('#JobTitle+').out('array');
    
    if (organizations.length > 0 || jobTitles.length > 0) {
      return {
        title: jobTitles[0] || 'Unknown',
        company: organizations[0] || 'Unknown',
        duration: timePeriods[0] || 'Unknown',
        description: sentence.trim()
      };
    }
    
    return null;
  }

  // Extract education information
  extractEducation(text) {
    const education = [];
    
    const sentences = text.split(/[.!?]+/);
    
    sentences.forEach(sentence => {
      if (this.isEducationSentence(sentence)) {
        const edu = this.parseEducationSentence(sentence);
        if (edu) {
          education.push(edu);
        }
      }
    });
    
    return education;
  }

  // Check if sentence contains education information
  isEducationSentence(sentence) {
    return this.educationIndicators.some(indicator => 
      sentence.includes(indicator)
    );
  }

  // Parse individual education sentence
  parseEducationSentence(sentence) {
    const doc = nlp(sentence);
    
    const institutions = doc.organizations().out('array');
    const degrees = doc.match('#Degree+').out('array');
    const fields = doc.match('#Noun+ (science|engineering|technology|mathematics|statistics)').out('array');
    
    if (institutions.length > 0 || degrees.length > 0) {
      return {
        degree: degrees[0] || 'Unknown',
        field: fields[0] || 'Unknown',
        institution: institutions[0] || 'Unknown',
        description: sentence.trim()
      };
    }
    
    return null;
  }

  // Extract contact information
  extractContact(text) {
    const contact = {};
    
    // Extract email
    const emailPattern = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g;
    const emails = text.match(emailPattern);
    if (emails) {
      contact.email = emails[0];
    }
    
    // Extract phone (basic pattern)
    const phonePattern = /(\+?[\d\s\-\(\)]{10,})/g;
    const phones = text.match(phonePattern);
    if (phones) {
      contact.phone = phones[0];
    }
    
    // Extract location
    const locationPattern = /(in|at|from)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/g;
    const locations = text.match(locationPattern);
    if (locations) {
      contact.location = locations[0].replace(/^(in|at|from)\s+/, '');
    }
    
    return contact;
  }

  // Extract summary/objective
  extractSummary(text) {
    const sentences = text.split(/[.!?]+/);
    
    // Look for first few sentences that might be a summary
    const summarySentences = sentences.slice(0, 3).filter(sentence => 
      sentence.length > 20 && sentence.length < 200
    );
    
    return summarySentences.join('. ').trim();
  }

  // Extract languages
  extractLanguages(text) {
    const languages = [];
    const commonLanguages = ['english', 'spanish', 'french', 'german', 'chinese', 'japanese', 'korean', 'russian'];
    
    commonLanguages.forEach(lang => {
      if (text.includes(lang)) {
        languages.push(lang);
      }
    });
    
    return languages;
  }

  // Extract certifications
  extractCertifications(text) {
    const certifications = [];
    
    const certPatterns = [
      /(?:certified|certification)\s+in\s+([A-Z][a-z\s]+)/gi,
      /([A-Z][a-z\s]+)\s+certification/gi
    ];
    
    certPatterns.forEach(pattern => {
      const matches = text.match(pattern);
      if (matches) {
        matches.forEach(match => {
          const cert = match.replace(/(?:certified|certification)\s+in\s+/i, '').trim();
          if (cert.length > 3) {
            certifications.push(cert);
          }
        });
      }
    });
    
    return certifications;
  }

  // Extract projects
  extractProjects(text) {
    const projects = [];
    
    const projectPatterns = [
      /(?:developed|built|created|implemented)\s+([A-Z][a-z\s]+)/gi,
      /(?:project|application|system)\s+([A-Z][a-z\s]+)/gi
    ];
    
    projectPatterns.forEach(pattern => {
      const matches = text.match(pattern);
      if (matches) {
        matches.forEach(match => {
          const project = match.replace(/(?:developed|built|created|implemented)\s+/i, '').trim();
          if (project.length > 3) {
            projects.push(project);
          }
        });
      }
    });
    
    return projects;
  }

  // Extract publications
  extractPublications(text) {
    const publications = [];
    
    const pubPatterns = [
      /(?:published|paper|research|journal)\s+([A-Z][a-z\s]+)/gi,
      /([A-Z][a-z\s]+)\s+(?:conference|journal|workshop)/gi
    ];
    
    pubPatterns.forEach(pattern => {
      const matches = text.match(pattern);
      if (matches) {
        matches.forEach(match => {
          const pub = match.replace(/(?:published|paper|research|journal)\s+/i, '').trim();
          if (pub.length > 3) {
            publications.push(pub);
          }
        });
      }
    });
    
    return publications;
  }

  // Normalize skills list
  normalizeSkills(skills) {
    return skills
      .map(skill => skill.toLowerCase().trim())
      .filter(skill => skill.length > 2)
      .filter((skill, index, arr) => arr.indexOf(skill) === index); // Remove duplicates
  }

  // Normalize experience data
  normalizeExperience(experience) {
    return experience.map(exp => ({
      ...exp,
      title: exp.title.toLowerCase().trim(),
      company: exp.company.toLowerCase().trim(),
      duration: exp.duration.toLowerCase().trim()
    }));
  }

  // Calculate parsing confidence
  calculateConfidence(parsedData) {
    let score = 0;
    let total = 0;
    
    // Skills confidence
    if (parsedData.skills.length > 0) {
      score += Math.min(100, parsedData.skills.length * 10);
      total += 100;
    }
    
    // Experience confidence
    if (parsedData.experience.length > 0) {
      score += Math.min(100, parsedData.experience.length * 20);
      total += 100;
    }
    
    // Education confidence
    if (parsedData.education.length > 0) {
      score += Math.min(100, parsedData.education.length * 25);
      total += 100;
    }
    
    // Contact confidence
    if (parsedData.contact.email || parsedData.contact.phone) {
      score += 50;
      total += 100;
    }
    
    return total > 0 ? Math.round((score / total) * 100) : 0;
  }
}

module.exports = new ResumeParserService();
