import mongoose from 'mongoose';

const storePriceSchema = new mongoose.Schema({
  price: { type: Number, required: true },
  discounts: [String]
}, { _id: false });

const productSchema = new mongoose.Schema({
  productId: { type: String, required: true, unique: true },
  name: { type: String, required: true, index: true },
  brand: { type: String, required: true },
  category: { 
    type: String, 
    required: true, 
    enum: ['Mobile', 'Laptop', 'Tablet', 'Headphone', 'Smartwatch'],
    index: true 
  },
  basePrice: { type: Number, required: true },
  originalPrice: { type: Number },
  discountPct: { type: Number, default: 0 },
  budgetCategory: { 
    type: String, 
    enum: ['Budget', 'Medium', 'High'], 
    required: true 
  },
  useCases: [String],
  priorities: [String],
  image: { type: String },
  overview: { type: String },
  specs: { type: mongoose.Schema.Types.Mixed },
  rating: { type: Number, min: 0, max: 5, default: 4 },
  stock: { type: Number, default: 0 },
  dealScore: { type: Number, min: 0, max: 100 },
  nextSale: {
    name: String,
    date: String,
    expectedPrice: Number
  },
  buyAdvice: {
    status: { type: String, enum: ['buy', 'wait', 'neutral'] },
    headline: String,
    description: String
  },
  storePrices: {
    amazon: storePriceSchema,
    flipkart: storePriceSchema,
    croma: storePriceSchema
  }
}, { 
  timestamps: true 
});

// Text index for search
productSchema.index({ name: 'text', brand: 'text', overview: 'text' });

const Product = mongoose.model('Product', productSchema);
export default Product;
