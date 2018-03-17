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
 * @typedef Cache
 */
export default mongoose.model('Cache', CacheSchema);
