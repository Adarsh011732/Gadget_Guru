import mongoose from 'mongoose';

const cachedSearchSchema = new mongoose.Schema({
  query: { type: String, required: true, index: true },
  category: { type: String, default: null },
  results: [{
    title: String,
    price: Number,
    source: String,
    link: String,
    thumbnail: String,
    rating: Number,
    reviews: Number,
  }],
  fetchedAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true, index: true },
});

// TTL index — MongoDB auto-deletes expired docs
cachedSearchSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Compound index for fast lookups
cachedSearchSchema.index({ query: 1, fetchedAt: -1 });

const CachedSearch = mongoose.model('CachedSearch', cachedSearchSchema);
export default CachedSearch;
