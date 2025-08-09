const natural = require('natural');
const { v4: uuidv4 } = require('uuid');

class SkillEvaluationService {
  constructor() {
    this.tokenizer = new natural.WordTokenizer();
    this.tfidf = new natural.TfIdf();
    
    // Evaluation criteria weights
    this.criteriaWeights = {
      codeQuality: 0.3,
      efficiency: 0.25,
      correctness: 0.25,
      communication: 0.2
    };
    
    // Communication assessment patterns
    this.communicationPatterns = {
      clarity: ['clear', 'understandable', 'well-explained', 'concise', 'logical'],
      technicalDepth: ['technical', 'detailed', 'comprehensive', 'thorough', 'in-depth'],
      problemSolving: ['solution', 'approach', 'strategy', 'methodology', 'reasoning'],
      collaboration: ['team', 'collaboration', 'feedback', 'communication', 'sharing']
    };
  }

  // Evaluate coding challenge submission
  async evaluateCodingChallenge(candidateId, challengeId, solution, language = 'python') {
    try {
      const evaluation = {
        id: uuidv4(),
        candidateId,
        challengeId,
        timestamp: new Date().toISOString(),
        language,
        scores: {},
        feedback: {},
        overallScore: 0
      };

      // Evaluate code quality
      evaluation.scores.codeQuality = this.evaluateCodeQuality(solution, language);
      
      // Evaluate efficiency
      evaluation.scores.efficiency = this.evaluateEfficiency(solution, language);
      
      // Evaluate correctness (basic syntax and logic)
      evaluation.scores.correctness = this.evaluateCorrectness(solution, language);
      
      // Generate feedback
      evaluation.feedback = this.generateFeedback(evaluation.scores);
      
      // Calculate overall score
      evaluation.overallScore = this.calculateOverallScore(evaluation.scores);
      
      return evaluation;
    } catch (error) {
      console.error('Error evaluating coding challenge:', error);
      throw new Error('Failed to evaluate coding challenge');
    }
  }

  // Evaluate code quality aspects
  evaluateCodeQuality(code, language) {
    let score = 0;
    const feedback = [];
    
    // Check code structure
    if (this.hasProperStructure(code, language)) {
      score += 25;
    } else {
      feedback.push('Code structure could be improved');
    }
    
    // Check naming conventions
    if (this.hasGoodNaming(code, language)) {
      score += 25;
    } else {
      feedback.push('Variable and function naming could be more descriptive');
    }
    
    // Check readability
    if (this.isReadable(code)) {
      score += 25;
    } else {
      feedback.push('Code readability could be improved');
    }
    
    // Check documentation
    if (this.hasDocumentation(code)) {
      score += 25;
    } else {
      feedback.push('Adding comments would improve code understanding');
    }
    
    return {
      score: Math.round(score),
      feedback
    };
  }

  // Evaluate code efficiency
  evaluateEfficiency(code, language) {
    let score = 0;
    const feedback = [];
    
    // Check for efficient algorithms
    if (this.usesEfficientAlgorithms(code)) {
      score += 40;
    } else {
      feedback.push('Consider using more efficient algorithms');
    }
    
    // Check for unnecessary operations
    if (!this.hasUnnecessaryOperations(code)) {
      score += 30;
    } else {
      feedback.push('Code contains some unnecessary operations');
    }
    
    // Check for optimization opportunities
    if (this.hasOptimizationOpportunities(code)) {
      score += 30;
    } else {
      feedback.push('Code is well-optimized');
    }
    
    return {
      score: Math.round(score),
      feedback
    };
  }

  // Evaluate code correctness
  evaluateCorrectness(code, language) {
    let score = 0;
    const feedback = [];
    
    // Check syntax
    if (this.hasValidSyntax(code, language)) {
      score += 40;
    } else {
      feedback.push('Code contains syntax errors');
    }
    
    // Check logic
    if (this.hasValidLogic(code)) {
      score += 30;
    } else {
      feedback.push('Code logic could be improved');
    }
    
    // Check edge cases
    if (this.handlesEdgeCases(code)) {
      score += 30;
    } else {
      feedback.push('Consider handling edge cases');
    }
    
    return {
      score: Math.round(score),
      feedback
    };
  }

  // Evaluate communication skills from chat/interview
  async evaluateCommunication(conversation) {
    try {
      const evaluation = {
        clarity: this.evaluateClarity(conversation),
        technicalDepth: this.evaluateTechnicalDepth(conversation),
        problemSolving: this.evaluateProblemSolving(conversation),
        collaboration: this.evaluateCollaboration(conversation),
        overallScore: 0
      };
      
      // Calculate overall communication score
      evaluation.overallScore = Math.round(
        evaluation.clarity.score * 0.3 +
        evaluation.technicalDepth.score * 0.3 +
        evaluation.problemSolving.score * 0.25 +
        evaluation.collaboration.score * 0.15
      );
      
      return evaluation;
    } catch (error) {
      console.error('Error evaluating communication:', error);
      throw new Error('Failed to evaluate communication skills');
    }
  }

  // Evaluate clarity of communication
  evaluateClarity(conversation) {
    let score = 0;
    const feedback = [];
    
    // Analyze sentence structure
    const sentences = conversation.split(/[.!?]+/);
    const avgSentenceLength = sentences.reduce((sum, sent) => sum + sent.split(' ').length, 0) / sentences.length;
    
    if (avgSentenceLength < 20) {
      score += 40;
    } else {
      feedback.push('Consider using shorter, clearer sentences');
    }
    
    // Check for technical jargon explanation
    if (this.explainsTechnicalTerms(conversation)) {
      score += 30;
    } else {
      feedback.push('Consider explaining technical terms for clarity');
    }
    
    // Check for logical flow
    if (this.hasLogicalFlow(conversation)) {
      score += 30;
    } else {
      feedback.push('Communication could follow a more logical structure');
    }
    
    return {
      score: Math.round(score),
      feedback
    };
  }

  // Evaluate technical depth
  evaluateTechnicalDepth(conversation) {
    let score = 0;
    const feedback = [];
    
    // Check for technical concepts
    const technicalTerms = this.extractTechnicalTerms(conversation);
    if (technicalTerms.length > 5) {
      score += 40;
    } else {
      feedback.push('Could demonstrate more technical knowledge');
    }
    
    // Check for detailed explanations
    if (this.hasDetailedExplanations(conversation)) {
      score += 30;
    } else {
      feedback.push('Consider providing more detailed technical explanations');
    }
    
    // Check for practical examples
    if (this.hasPracticalExamples(conversation)) {
      score += 30;
    } else {
      feedback.push('Adding practical examples would strengthen technical depth');
    }
    
    return {
      score: Math.round(score),
      feedback
    };
  }

  // Evaluate problem-solving approach
  evaluateProblemSolving(conversation) {
    let score = 0;
    const feedback = [];
    
    // Check for systematic approach
    if (this.hasSystematicApproach(conversation)) {
      score += 40;
    } else {
      feedback.push('Consider using a more systematic problem-solving approach');
    }
    
    // Check for alternative solutions
    if (this.considersAlternatives(conversation)) {
      score += 30;
    } else {
      feedback.push('Consider discussing alternative solutions');
    }
    
    // Check for risk assessment
    if (this.assessesRisks(conversation)) {
      score += 30;
    } else {
      feedback.push('Consider discussing potential risks and trade-offs');
    }
    
    return {
      score: Math.round(score),
      feedback
    };
  }

  // Evaluate collaboration skills
  evaluateCollaboration(conversation) {
    let score = 0;
    const feedback = [];
    
    // Check for team-oriented language
    if (this.usesTeamLanguage(conversation)) {
      score += 40;
    } else {
      feedback.push('Consider using more collaborative language');
    }
    
    // Check for feedback acceptance
    if (this.acceptsFeedback(conversation)) {
      score += 30;
    } else {
      feedback.push('Consider being more open to feedback');
    }
    
    // Check for knowledge sharing
    if (this.sharesKnowledge(conversation)) {
      score += 30;
    } else {
      feedback.push('Consider sharing knowledge with team members');
    }
    
    return {
      score: Math.round(score),
      feedback
    };
  }

  // Generate comprehensive feedback
  generateFeedback(scores) {
    const feedback = {
      strengths: [],
      improvements: [],
      recommendations: []
    };
    
    // Identify strengths
    Object.entries(scores).forEach(([criterion, data]) => {
      if (data.score >= 80) {
        feedback.strengths.push(`${criterion}: ${data.score}/100`);
      } else if (data.score < 60) {
        feedback.improvements.push(`${criterion}: ${data.score}/100`);
      }
    });
    
    // Generate recommendations
    Object.entries(scores).forEach(([criterion, data]) => {
      if (data.score < 80) {
        feedback.recommendations.push(...data.feedback);
      }
    });
    
    return feedback;
  }

  // Calculate overall score
  calculateOverallScore(scores) {
    let totalScore = 0;
    let totalWeight = 0;
    
    Object.entries(this.criteriaWeights).forEach(([criterion, weight]) => {
      if (scores[criterion]) {
        totalScore += scores[criterion].score * weight;
        totalWeight += weight;
      }
    });
    
    return totalWeight > 0 ? Math.round(totalScore / totalWeight) : 0;
  }

  // Helper methods for code evaluation
  hasProperStructure(code, language) {
    // Basic structure checks
    const hasFunctions = /def\s+\w+\s*\(/.test(code) || /function\s+\w+\s*\(/.test(code);
    const hasMainBlock = /if\s+__name__\s*==\s*['"]__main__['"]/.test(code) || /main\s*\(\)/.test(code);
    return hasFunctions || hasMainBlock;
  }

  hasGoodNaming(code, language) {
    const goodNamingPattern = /\b[a-z][a-z0-9_]*\b/g;
    const badNamingPattern = /\b[a-z0-9_]*[A-Z][a-z0-9_]*\b/g;
    
    const goodNames = code.match(goodNamingPattern) || [];
    const badNames = code.match(badNamingPattern) || [];
    
    return goodNames.length > badNames.length;
  }

  isReadable(code) {
    const lines = code.split('\n');
    const avgLineLength = lines.reduce((sum, line) => sum + line.length, 0) / lines.length;
    return avgLineLength < 80;
  }

  hasDocumentation(code) {
    return /#.*/.test(code) || /\/\*.*\*\//.test(code) || /\/\/.*/.test(code);
  }

  usesEfficientAlgorithms(code) {
    // Check for common efficient patterns
    const efficientPatterns = [
      /\.sort\(\)/, // Built-in sorting
      /\.filter\(\)/, // Array filtering
      /\.map\(\)/, // Array mapping
      /Set\(/, // Set data structure
      /Map\(/ // Map data structure
    ];
    
    return efficientPatterns.some(pattern => pattern.test(code));
  }

  hasUnnecessaryOperations(code) {
    // Check for common inefficient patterns
    const inefficientPatterns = [
      /for\s*\(\s*let\s+i\s*=\s*0\s*;\s*i\s*<\s*array\.length\s*;\s*i\+\+\)/, // C-style loops
      /\.split\(''\)\.reverse\(\)\.join\(''\)/, // String reverse
      /new\s+Array\(.*\)\.fill\(/ // Array fill
    ];
    
    return inefficientPatterns.some(pattern => pattern.test(code));
  }

  hasOptimizationOpportunities(code) {
    // Check for optimization opportunities
    const optimizationPatterns = [
      /\.forEach\(/, // Could use for...of
      /\.filter\(.*\)\.map\(/, // Could combine operations
      /\.reduce\(.*\)\.filter\(/ // Could combine operations
    ];
    
    return optimizationPatterns.some(pattern => pattern.test(code));
  }

  hasValidSyntax(code, language) {
    // Basic syntax validation (simplified)
    try {
      if (language === 'python') {
        // Python syntax check would go here
        return true;
      } else if (language === 'javascript') {
        // JavaScript syntax check would go here
        return true;
      }
      return true;
    } catch (error) {
      return false;
    }
  }

  hasValidLogic(code) {
    // Basic logic validation
    const hasLoops = /for|while|forEach|map|filter/.test(code);
    const hasConditions = /if|else|switch|case/.test(code);
    const hasFunctions = /def|function/.test(code);
    
    return hasLoops || hasConditions || hasFunctions;
  }

  handlesEdgeCases(code) {
    // Check for edge case handling
    const edgeCasePatterns = [
      /if\s*\(.*null/, // Null checks
      /if\s*\(.*undefined/, // Undefined checks
      /if\s*\(.*length\s*[=<>]/, // Length checks
      /try\s*\{/, // Try-catch blocks
      /\.trim\(\)/, // String trimming
    ];
    
    return edgeCasePatterns.some(pattern => pattern.test(code));
  }

  // Helper methods for communication evaluation
  explainsTechnicalTerms(conversation) {
    const technicalTerms = this.extractTechnicalTerms(conversation);
    const explanationPatterns = [
      /means\s+that/,
      /refers\s+to/,
      /is\s+a/,
      /are\s+used\s+for/
    ];
    
    return technicalTerms.length > 0 && explanationPatterns.some(pattern => pattern.test(conversation));
  }

  hasLogicalFlow(conversation) {
    const flowIndicators = ['first', 'then', 'next', 'finally', 'therefore', 'however', 'meanwhile'];
    return flowIndicators.some(indicator => conversation.includes(indicator));
  }

  extractTechnicalTerms(conversation) {
    const technicalTerms = [
      'algorithm', 'data structure', 'optimization', 'complexity', 'framework',
      'architecture', 'deployment', 'scalability', 'performance', 'efficiency'
    ];
    
    return technicalTerms.filter(term => conversation.toLowerCase().includes(term));
  }

  hasDetailedExplanations(conversation) {
    const detailedPatterns = [
      /because\s+/,
      /the\s+reason\s+is/,
      /this\s+happens\s+when/,
      /in\s+detail/
    ];
    
    return detailedPatterns.some(pattern => pattern.test(conversation));
  }

  hasPracticalExamples(conversation) {
    const examplePatterns = [
      /for\s+example/,
      /such\s+as/,
      /like\s+/,
      /instance/
    ];
    
    return examplePatterns.some(pattern => pattern.test(conversation));
  }

  hasSystematicApproach(conversation) {
    const systematicPatterns = [
      /step\s+by\s+step/,
      /first\s+.*\s+then/,
      /approach/,
      /methodology/
    ];
    
    return systematicPatterns.some(pattern => pattern.test(conversation));
  }

  considersAlternatives(conversation) {
    const alternativePatterns = [
      /alternative/,
      /another\s+way/,
      /instead/,
      /option/
    ];
    
    return alternativePatterns.some(pattern => pattern.test(conversation));
  }

  assessesRisks(conversation) {
    const riskPatterns = [
      /risk/,
      /trade-off/,
      /downside/,
      /challenge/
    ];
    
    return riskPatterns.some(pattern => pattern.test(conversation));
  }

  usesTeamLanguage(conversation) {
    const teamPatterns = [
      /we\s+/,
      /our\s+team/,
      /collaborate/,
      /work\s+together/
    ];
    
    return teamPatterns.some(pattern => pattern.test(conversation));
  }

  acceptsFeedback(conversation) {
    const feedbackPatterns = [
      /feedback/,
      /suggestions/,
      /improve/,
      /learn/
    ];
    
    return feedbackPatterns.some(pattern => pattern.test(conversation));
  }

  sharesKnowledge(conversation) {
    const sharingPatterns = [
      /share/,
      /teach/,
      /mentor/,
      /help/
    ];
    
    return sharingPatterns.some(pattern => pattern.test(conversation));
  }
}

module.exports = new SkillEvaluationService();
