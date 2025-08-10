const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Job = sequelize.define('Job', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  company: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  requirements: {
    type: DataTypes.JSONB,
    allowNull: false,
    defaultValue: []
  },
  skills: {
    type: DataTypes.JSONB,
    allowNull: false,
    defaultValue: []
  },
  location: {
    type: DataTypes.STRING,
    allowNull: true
  },
  salary_range: {
    type: DataTypes.JSONB,
    allowNull: true
  },
  job_type: {
    type: DataTypes.ENUM('full-time', 'part-time', 'contract', 'internship'),
    defaultValue: 'full-time'
  },
  experience_level: {
    type: DataTypes.ENUM('entry', 'mid', 'senior', 'lead'),
    defaultValue: 'mid'
  },
  embedding_vector: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  pinecone_id: {
    type: DataTypes.STRING,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('active', 'closed', 'draft'),
    defaultValue: 'active'
  },
  recruiter_id: {
    type: DataTypes.UUID,
    allowNull: true
  }
}, {
  tableName: 'jobs',
  indexes: [
    {
      fields: ['status']
    },
    {
      fields: ['job_type']
    },
    {
      fields: ['experience_level']
    },
    {
      fields: ['pinecone_id']
    }
  ]
});

module.exports = Job;
