const { Pinecone } = require('@pinecone-database/pinecone');

class PineconeService {
  constructor() {
    this.pinecone = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY
    });
    this.indexName = process.env.PINECONE_INDEX_NAME || 'talentai-embeddings';
    this.index = null;
  }

  async initialize() {
    try {
      console.log('🌲 Initializing Pinecone...');
      
      // Get or create index
      const indexes = await this.pinecone.listIndexes();
      const indexExists = indexes.some(index => index.name === this.indexName);
      
      if (!indexExists) {
        console.log(`Creating Pinecone index: ${this.indexName}`);
        await this.pinecone.createIndex({
          name: this.indexName,
          dimension: 1536, // OpenAI text-embedding-3-small dimension
          metric: 'cosine'
        });
        
        // Wait for index to be ready
        await this.waitForIndex();
      }
      
      this.index = this.pinecone.index(this.indexName);
      console.log('✅ Pinecone initialized successfully');
      
      return { success: true };
    } catch (error) {
      console.error('❌ Pinecone initialization error:', error);
      return { success: false, error: error.message };
    }
  }

  async waitForIndex() {
    let attempts = 0;
    const maxAttempts = 30;
    
    while (attempts < maxAttempts) {
      try {
        const indexStats = await this.pinecone.describeIndex(this.indexName);
        if (indexStats.status?.ready) {
          console.log('✅ Pinecone index is ready');
          return;
        }
      } catch (error) {
        console.log('Waiting for index to be ready...');
      }
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      attempts++;
    }
    
    throw new Error('Pinecone index initialization timeout');
  }

  async upsertVector(id, embedding, metadata = {}) {
    try {
      if (!this.index) {
        await this.initialize();
      }

      await this.index.upsert([{
        id: id,
        values: embedding,
        metadata: {
          ...metadata,
          timestamp: new Date().toISOString()
        }
      }]);

      return { success: true };
    } catch (error) {
      console.error('❌ Pinecone upsert error:', error);
      return { success: false, error: error.message };
    }
  }

  async searchVectors(queryEmbedding, topK = 10, filter = {}) {
    try {
      if (!this.index) {
        await this.initialize();
      }

      const searchResponse = await this.index.query({
        vector: queryEmbedding,
        topK: topK,
        includeMetadata: true,
        filter: Object.keys(filter).length > 0 ? filter : undefined
      });

      return {
        success: true,
        matches: searchResponse.matches || []
      };
    } catch (error) {
      console.error('❌ Pinecone search error:', error);
      return { success: false, error: error.message };
    }
  }

  async deleteVector(id) {
    try {
      if (!this.index) {
        await this.initialize();
      }

      await this.index.deleteOne(id);
      return { success: true };
    } catch (error) {
      console.error('❌ Pinecone delete error:', error);
      return { success: false, error: error.message };
    }
  }

  async deleteVectors(ids) {
    try {
      if (!this.index) {
        await this.initialize();
      }

      await this.index.deleteMany(ids);
      return { success: true };
    } catch (error) {
      console.error('❌ Pinecone bulk delete error:', error);
      return { success: false, error: error.message };
    }
  }

  async getIndexStats() {
    try {
      if (!this.index) {
        await this.initialize();
      }

      const stats = await this.index.describeIndexStats();
      return { success: true, stats };
    } catch (error) {
      console.error('❌ Pinecone stats error:', error);
      return { success: false, error: error.message };
    }
  }
}

module.exports = new PineconeService();
