import mongoose from 'mongoose';
import config from '../../config/config';

let randomString = require('random-string');

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
  timeToLive:{
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
          if(new Date() > cache.timeToLive) {
            // If TTL exceed we update the value
            cache.value = randomString({length: config.rand_str_len});
          }
          var ttl = new Date();
          ttl.setSeconds(ttl.getSeconds() + config.ttl_sec);
          // Update TTL every time when we retrive
          cache.timeToLive = ttl;
          cache.save()
            .then((savedCache) => {return savedCache });
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
