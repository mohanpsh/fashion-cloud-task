import mongoose from 'mongoose';

/**
 * Cache Schema
 */
const CacheSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true
  },
  value: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

/**
 * Statics
 */
CacheSchema.statics = {
  /**
   * Get cache
   * @param key - The key of cache.
   * @returns {Promise<Cache, null>}
   */
  get(key) {
    return this.findOne({ 'key': key })
      .exec()
      .then((cache) => {
        if (cache) {
          return cache;
        }
        return null;
      });
  },

  /**
   * List cache in descending order of 'createdAt' timestamp.
   * @returns {Promise<Cache[]>}
   */
  list() {
    return this.find()
      .sort({ createdAt: -1 })
      .exec();
  }
};

/**
 * @typedef Cache
 */
export default mongoose.model('Cache', CacheSchema);
