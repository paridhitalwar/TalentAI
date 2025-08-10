const axios = require('axios');

class AssessmentService {
  constructor() {
    this.apiKey = process.env.HACKERRANK_API_KEY;
    this.baseUrl = process.env.HACKERRANK_BASE_URL || 'https://www.hackerrank.com/api/v3';
  }

  async createTest(candidateEmail, jobTitle, roleType = 'software_engineer') {
    try {
      const testConfig = this.getTestConfig(roleType);
      
      const response = await axios.post(
        `${this.baseUrl}/tests`,
        {
          name: `${jobTitle} - Coding Assessment`,
          duration: testConfig.duration,
          instructions: testConfig.instructions,
          questions: testConfig.questions,
          candidates: [candidateEmail]
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return {
        success: true,
        testId: response.data.id,
        testUrl: response.data.url
      };
    } catch (error) {
      console.error('HackerRank API error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }

  getTestConfig(roleType) {
    const configs = {
      software_engineer: {
        duration: 60,
        instructions: 'Complete the coding challenges within the time limit.',
        questions: ['basic_algorithms', 'data_structures']
      },
      data_scientist: {
        duration: 90,
        instructions: 'Solve the data analysis and machine learning problems.',
        questions: ['python', 'machine_learning', 'data_analysis']
      },
      frontend_developer: {
        duration: 60,
        instructions: 'Complete the frontend development challenges.',
        questions: ['javascript', 'html_css', 'react']
      }
    };

    return configs[roleType] || configs.software_engineer;
  }

  async getTestResults(testId) {
    try {
      const response = await axios.get(
        `${this.baseUrl}/tests/${testId}/results`,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`
          }
        }
      );

      return {
        success: true,
        results: response.data
      };
    } catch (error) {
      console.error('HackerRank results error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

module.exports = new AssessmentService();
