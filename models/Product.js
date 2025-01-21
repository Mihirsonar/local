import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String },  // URL of the product image
    category: { type: String, required: true },  // Example: 'Fruits', 'Vegetables', etc.
    quantity: { type: Number, required: true },  // Available quantity of the product
}, {
    timestamps: true, // Automatically adds createdAt and updatedAt
});

const Product = mongoose.model('Product', productSchema);

export default Product;
