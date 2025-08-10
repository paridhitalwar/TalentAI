const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Candidate = sequelize.define('Candidate', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true
  },
  location: {
    type: DataTypes.STRING,
    allowNull: true
  },
  skills: {
    type: DataTypes.JSONB,
    allowNull: false,
    defaultValue: []
  },
  normalized_skills: {
    type: DataTypes.JSONB,
    allowNull: false,
    defaultValue: []
  },
  experience: {
    type: DataTypes.JSONB,
    allowNull: false,
    defaultValue: []
  },
  education: {
    type: DataTypes.JSONB,
    allowNull: false,
    defaultValue: []
  },
  resume_file_path: {
    type: DataTypes.STRING,
    allowNull: true
  },
  resume_parsed_data: {
    type: DataTypes.JSONB,
    allowNull: true
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
    type: DataTypes.ENUM('active', 'inactive', 'archived'),
    defaultValue: 'active'
  }
}, {
  tableName: 'candidates',
  indexes: [
    {
      fields: ['email']
    },
    {
      fields: ['status']
    },
    {
      fields: ['pinecone_id']
    }
  ]
});

module.exports = Candidate;
