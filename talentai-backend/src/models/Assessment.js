const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Assessment = sequelize.define('Assessment', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  candidate_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'candidates',
      key: 'id'
    }
  },
  job_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'jobs',
      key: 'id'
    }
  },
  hackerrank_test_id: {
    type: DataTypes.STRING,
    allowNull: true
  },
  test_url: {
    type: DataTypes.STRING,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('invited', 'started', 'completed', 'expired'),
    defaultValue: 'invited'
  },
  score: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  max_score: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  completion_time: {
    type: DataTypes.INTEGER, // in minutes
    allowNull: true
  },
  started_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  completed_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  expires_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  test_details: {
    type: DataTypes.JSONB,
    allowNull: true
  },
  results: {
    type: DataTypes.JSONB,
    allowNull: true
  }
}, {
  tableName: 'assessments',
  indexes: [
    {
      fields: ['candidate_id']
    },
    {
      fields: ['job_id']
    },
    {
      fields: ['status']
    },
    {
      fields: ['hackerrank_test_id']
    }
  ]
});

module.exports = Assessment;
