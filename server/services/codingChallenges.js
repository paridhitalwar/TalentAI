const { v4: uuidv4 } = require('uuid');

class CodingChallengesService {
  constructor() {
    this.challengeTemplates = {
      'machine-learning': [
        {
          id: 'ml-001',
          title: 'Implement a Simple Neural Network',
          description: 'Create a basic neural network with one hidden layer using only NumPy. The network should be able to learn XOR function.',
          difficulty: 'intermediate',
          category: 'machine-learning',
          requirements: ['numpy', 'neural networks', 'backpropagation'],
          starterCode: `import numpy as np

def sigmoid(x):
    # TODO: Implement sigmoid activation function
    pass

def sigmoid_derivative(x):
    # TODO: Implement sigmoid derivative
    pass

class SimpleNeuralNetwork:
    def __init__(self, input_size, hidden_size, output_size):
        # TODO: Initialize weights and biases
        pass
    
    def forward(self, X):
        # TODO: Implement forward propagation
        pass
    
    def backward(self, X, y, learning_rate=0.1):
        # TODO: Implement backpropagation
        pass

# Test your implementation
if __name__ == "__main__":
    # XOR dataset
    X = np.array([[0, 0], [0, 1], [1, 0], [1, 1]])
    y = np.array([[0], [1], [1], [0]])
    
    # Create and train network
    nn = SimpleNeuralNetwork(2, 4, 1)
    # TODO: Train the network and test predictions
`,
          testCases: [
            { input: [0, 0], expected: 0 },
            { input: [0, 1], expected: 1 },
            { input: [1, 0], expected: 1 },
            { input: [1, 1], expected: 0 }
          ],
          hints: [
            'Start with implementing the sigmoid function',
            'Use random initialization for weights',
            'Implement forward pass first, then backward pass',
            'Use mean squared error as loss function'
          ]
        },
        {
          id: 'ml-002',
          title: 'Optimize a Machine Learning Pipeline',
          description: 'Given a dataset, implement feature selection, hyperparameter tuning, and cross-validation to optimize model performance.',
          difficulty: 'advanced',
          category: 'machine-learning',
          requirements: ['scikit-learn', 'pandas', 'cross-validation', 'hyperparameter tuning'],
          starterCode: `import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, cross_val_score, GridSearchCV
from sklearn.ensemble import RandomForestClassifier
from sklearn.feature_selection import SelectKBest, f_classif
from sklearn.preprocessing import StandardScaler

# Load sample dataset (replace with your data)
# data = pd.read_csv('your_dataset.csv')

def optimize_pipeline(X, y):
    # TODO: Implement feature selection
    # TODO: Implement hyperparameter tuning
    # TODO: Implement cross-validation
    # TODO: Return best model and performance metrics
    pass

def evaluate_model(model, X_test, y_test):
    # TODO: Implement comprehensive model evaluation
    pass

# Example usage
if __name__ == "__main__":
    # Generate sample data for demonstration
    np.random.seed(42)
    X = np.random.randn(1000, 20)
    y = np.random.randint(0, 2, 1000)
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Optimize and evaluate
    best_model = optimize_pipeline(X_train, y_train)
    evaluate_model(best_model, X_test, y_test)
`,
          testCases: [
            { input: 'dataset', expected: 'improved_accuracy' },
            { input: 'cross_validation', expected: 'stable_performance' }
          ],
          hints: [
            'Use SelectKBest for feature selection',
            'Implement GridSearchCV for hyperparameter tuning',
            'Use multiple evaluation metrics',
            'Consider feature scaling'
          ]
        }
      ],
      'data-science': [
        {
          id: 'ds-001',
          title: 'Data Cleaning and Preprocessing Pipeline',
          description: 'Create a comprehensive data cleaning pipeline that handles missing values, outliers, and data type conversions.',
          difficulty: 'intermediate',
          category: 'data-science',
          requirements: ['pandas', 'numpy', 'data cleaning', 'preprocessing'],
          starterCode: `import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler, LabelEncoder
import matplotlib.pyplot as plt
import seaborn as sns

class DataCleaningPipeline:
    def __init__(self):
        # TODO: Initialize pipeline components
        pass
    
    def handle_missing_values(self, df, strategy='auto'):
        # TODO: Implement missing value handling
        pass
    
    def handle_outliers(self, df, columns, method='iqr'):
        # TODO: Implement outlier detection and handling
        pass
    
    def convert_data_types(self, df):
        # TODO: Implement automatic data type conversion
        pass
    
    def create_features(self, df):
        # TODO: Implement feature engineering
        pass
    
    def run_pipeline(self, df):
        # TODO: Run complete cleaning pipeline
        pass

def analyze_data_quality(df):
    # TODO: Implement comprehensive data quality analysis
    pass

# Example usage
if __name__ == "__main__":
    # Generate sample data with issues
    np.random.seed(42)
    data = pd.DataFrame({
        'numeric_col': np.random.randn(1000),
        'categorical_col': np.random.choice(['A', 'B', 'C'], 1000),
        'mixed_col': np.random.choice([1, 'text', np.nan], 1000)
    })
    
    # Add some missing values and outliers
    data.loc[np.random.choice(data.index, 100), 'numeric_col'] = np.nan
    data.loc[np.random.choice(data.index, 10), 'numeric_col'] = 1000
    
    pipeline = DataCleaningPipeline()
    cleaned_data = pipeline.run_pipeline(data)
    analyze_data_quality(cleaned_data)
`,
          testCases: [
            { input: 'dirty_data', expected: 'clean_data' },
            { input: 'missing_values', expected: 'handled_values' }
          ],
          hints: [
            'Use pandas methods for missing value handling',
            'Implement IQR method for outlier detection',
            'Consider data type inference',
            'Add data quality metrics'
          ]
        }
      ],
      'algorithms': [
        {
          id: 'algo-001',
          title: 'Implement a Custom Sorting Algorithm',
          description: 'Create an efficient sorting algorithm that outperforms built-in sort for specific use cases.',
          difficulty: 'intermediate',
          category: 'algorithms',
          requirements: ['algorithms', 'optimization', 'performance'],
          starterCode: `import time
import random

def custom_sort(arr, algorithm='hybrid'):
    """
    Custom sorting algorithm that combines multiple approaches
    """
    if algorithm == 'hybrid':
        return hybrid_sort(arr)
    elif algorithm == 'radix':
        return radix_sort(arr)
    else:
        return quick_sort(arr)

def hybrid_sort(arr):
    # TODO: Implement hybrid sorting algorithm
    # Combine quicksort for large arrays and insertion sort for small arrays
    pass

def radix_sort(arr):
    # TODO: Implement radix sort for integer arrays
    pass

def quick_sort(arr):
    # TODO: Implement optimized quicksort
    pass

def benchmark_sorting():
    # TODO: Implement benchmarking against built-in sort
    pass

# Test your implementation
if __name__ == "__main__":
    # Generate test data
    test_sizes = [100, 1000, 10000]
    
    for size in test_sizes:
        arr = [random.randint(1, 1000000) for _ in range(size)]
        
        # Test custom sort
        start_time = time.time()
        sorted_arr = custom_sort(arr.copy())
        custom_time = time.time() - start_time
        
        # Test built-in sort
        start_time = time.time()
        builtin_sorted = sorted(arr)
        builtin_time = time.time() - start_time
        
        print(f"Size {size}: Custom: {custom_time:.4f}s, Built-in: {builtin_time:.4f}s")
        print(f"Correctness: {sorted_arr == builtin_sorted}")
        print()
`,
          testCases: [
            { input: [3, 1, 4, 1, 5], expected: [1, 1, 3, 4, 5] },
            { input: [9, 8, 7, 6, 5], expected: [5, 6, 7, 8, 9] }
          ],
          hints: [
            'Use insertion sort for small arrays',
            'Implement pivot selection optimization',
            'Consider memory usage vs speed trade-offs',
            'Add early termination conditions'
          ]
        }
      ]
    };
    
    this.activeChallenges = new Map();
  }

  // Generate a new coding challenge
  async generateChallenge(category = 'machine-learning', difficulty = 'intermediate') {
    try {
      const availableChallenges = this.challengeTemplates[category] || this.challengeTemplates['machine-learning'];
      const filteredChallenges = availableChallenges.filter(challenge => 
        challenge.difficulty === difficulty
      );
      
      if (filteredChallenges.length === 0) {
        throw new Error(`No challenges available for category: ${category}, difficulty: ${difficulty}`);
      }
      
      // Randomly select a challenge
      const selectedChallenge = filteredChallenges[Math.floor(Math.random() * filteredChallenges.length)];
      
      // Create a unique instance of the challenge
      const challengeInstance = {
        ...selectedChallenge,
        instanceId: uuidv4(),
        createdAt: new Date().toISOString(),
        status: 'active',
        submissions: []
      };
      
      this.activeChallenges.set(challengeInstance.instanceId, challengeInstance);
      
      return challengeInstance;
    } catch (error) {
      console.error('Error generating challenge:', error);
      throw new Error('Failed to generate coding challenge');
    }
  }

  // Get challenge by ID
  getChallenge(challengeId) {
    return this.activeChallenges.get(challengeId);
  }

  // Submit solution for a challenge
  async submitSolution(challengeId, candidateId, solution, language = 'python') {
    try {
      const challenge = this.activeChallenges.get(challengeId);
      if (!challenge) {
        throw new Error('Challenge not found');
      }
      
      const submission = {
        id: uuidv4(),
        candidateId,
        challengeId,
        solution,
        language,
        submittedAt: new Date().toISOString(),
        status: 'submitted',
        evaluation: null
      };
      
      // Add submission to challenge
      challenge.submissions.push(submission);
      
      // Update challenge status
      this.activeChallenges.set(challengeId, challenge);
      
      return submission;
    } catch (error) {
      console.error('Error submitting solution:', error);
      throw new Error('Failed to submit solution');
    }
  }

  // Get all active challenges
  getActiveChallenges() {
    return Array.from(this.activeChallenges.values());
  }

  // Get challenges by category
  getChallengesByCategory(category) {
    return this.getActiveChallenges().filter(challenge => 
      challenge.category === category
    );
  }

  // Get challenges by difficulty
  getChallengesByDifficulty(difficulty) {
    return this.getActiveChallenges().filter(challenge => 
      challenge.difficulty === difficulty
    );
  }

  // Get challenge statistics
  getChallengeStats(challengeId) {
    const challenge = this.activeChallenges.get(challengeId);
    if (!challenge) {
      return null;
    }
    
    const totalSubmissions = challenge.submissions.length;
    const completedSubmissions = challenge.submissions.filter(sub => 
      sub.status === 'completed'
    ).length;
    
    const avgScore = challenge.submissions.length > 0 
      ? challenge.submissions.reduce((sum, sub) => 
          sum + (sub.evaluation?.overallScore || 0), 0
        ) / challenge.submissions.length
      : 0;
    
    return {
      challengeId,
      totalSubmissions,
      completedSubmissions,
      completionRate: totalSubmissions > 0 ? (completedSubmissions / totalSubmissions) * 100 : 0,
      averageScore: Math.round(avgScore),
      topScore: Math.max(...challenge.submissions.map(sub => sub.evaluation?.overallScore || 0)),
      category: challenge.category,
      difficulty: challenge.difficulty
    };
  }

  // Get leaderboard for a challenge
  getChallengeLeaderboard(challengeId) {
    const challenge = this.activeChallenges.get(challengeId);
    if (!challenge) {
      return [];
    }
    
    const validSubmissions = challenge.submissions.filter(sub => 
      sub.evaluation && sub.evaluation.overallScore > 0
    );
    
    return validSubmissions
      .sort((a, b) => b.evaluation.overallScore - a.evaluation.overallScore)
      .slice(0, 10) // Top 10
      .map((sub, index) => ({
        rank: index + 1,
        candidateId: sub.candidateId,
        score: sub.evaluation.overallScore,
        submittedAt: sub.submittedAt,
        language: sub.language
      }));
  }

  // Get candidate's challenge history
  getCandidateChallengeHistory(candidateId) {
    const history = [];
    
    this.activeChallenges.forEach(challenge => {
      const candidateSubmissions = challenge.submissions.filter(sub => 
        sub.candidateId === candidateId
      );
      
      candidateSubmissions.forEach(submission => {
        history.push({
          challengeId: challenge.id,
          challengeTitle: challenge.title,
          category: challenge.category,
          difficulty: challenge.difficulty,
          submission: submission,
          challenge: challenge
        });
      });
    });
    
    return history.sort((a, b) => 
      new Date(b.submission.submittedAt) - new Date(a.submission.submittedAt)
    );
  }

  // Create custom challenge
  async createCustomChallenge(challengeData) {
    try {
      const customChallenge = {
        id: uuidv4(),
        title: challengeData.title,
        description: challengeData.description,
        difficulty: challengeData.difficulty || 'intermediate',
        category: challengeData.category || 'custom',
        requirements: challengeData.requirements || [],
        starterCode: challengeData.starterCode || '',
        testCases: challengeData.testCases || [],
        hints: challengeData.hints || [],
        instanceId: uuidv4(),
        createdAt: new Date().toISOString(),
        status: 'active',
        submissions: [],
        isCustom: true,
        createdBy: challengeData.createdBy
      };
      
      this.activeChallenges.set(customChallenge.instanceId, customChallenge);
      
      return customChallenge;
    } catch (error) {
      console.error('Error creating custom challenge:', error);
      throw new Error('Failed to create custom challenge');
    }
  }

  // Update challenge status
  updateChallengeStatus(challengeId, status) {
    const challenge = this.activeChallenges.get(challengeId);
    if (challenge) {
      challenge.status = status;
      this.activeChallenges.set(challengeId, challenge);
      return true;
    }
    return false;
  }

  // Archive completed challenges
  archiveCompletedChallenges() {
    const archivedChallenges = [];
    
    this.activeChallenges.forEach((challenge, challengeId) => {
      if (challenge.status === 'completed' || challenge.submissions.length > 50) {
        archivedChallenges.push(challenge);
        this.activeChallenges.delete(challengeId);
      }
    });
    
    return archivedChallenges;
  }

  // Get challenge recommendations for candidate
  getChallengeRecommendations(candidateId, skills = []) {
    const recommendations = [];
    const candidateHistory = this.getCandidateChallengeHistory(candidateId);
    
    // Get completed challenges
    const completedChallenges = candidateHistory.filter(item => 
      item.submission.status === 'completed'
    );
    
    // Get skill-based recommendations
    const skillBasedChallenges = this.getActiveChallenges().filter(challenge => {
      const skillMatch = challenge.requirements.some(req => 
        skills.some(skill => 
          skill.toLowerCase().includes(req.toLowerCase()) ||
          req.toLowerCase().includes(skill.toLowerCase())
        )
      );
      
      const notAttempted = !candidateHistory.some(item => 
        item.challengeId === challenge.id
      );
      
      return skillMatch && notAttempted;
    });
    
    // Sort by difficulty progression
    const difficultyOrder = ['beginner', 'intermediate', 'advanced'];
    
    skillBasedChallenges.sort((a, b) => {
      const aIndex = difficultyOrder.indexOf(a.difficulty);
      const bIndex = difficultyOrder.indexOf(b.difficulty);
      return aIndex - bIndex;
    });
    
    return skillBasedChallenges.slice(0, 5); // Top 5 recommendations
  }
}

module.exports = new CodingChallengesService();
