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
    category: { type: String },
    description: { type: String },
    overview: { type: String },
    features: [{ type: String }],
    sizes: [{ type: String }],
    colors: [{ type: String }],
    material: { type: String },
    stock: { type: Number, default: 0 },
    sold: { type: Number, default: 0 },
    label: { type: String },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
