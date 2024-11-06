const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const productSchema = new Schema({
  name: { type: String, required: true },                      
  images: [{ type: String }],                                   
  price: { type: Number, required: true },                      
  originalPrice: { type: Number },                              
  rating: { 
    score: { type: Number, default: 0 },                                         
  },
  description: { type: String },                                
  overview: { type: String },                                   
  features: [{ type: String }],                                 
  sizes: [{ type: String }],                                    
  colors: [{ type: String }],                                   
  material: { type: String },                                   
  stock: { type: Number, default: 0 },                          
  isFeatured: { type: Boolean, default: false },                
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
