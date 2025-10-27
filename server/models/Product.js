const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide product name'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide product description'],
    },
    price: {
      type: Number,
      required: [true, 'Please provide product price'],
      min: 0,
    },
    discount: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    category: {
      type: String,
      required: [true, 'Please provide product category'],
      enum: ['Men', 'Women', 'Accessories', 'Kids', 'Sale'],
    },
    subCategory: {
      type: String,
      enum: [
        'T-Shirts',
        'Shirts',
        'Jeans',
        'Trousers',
        'Dresses',
        'Tops',
        'Skirts',
        'Jackets',
        'Sweaters',
        'Bags',
        'Shoes',
        'Watches',
        'Jewelry',
        'Sunglasses',
      ],
    },
    sizes: [
      {
        type: String,
        enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'One Size'],
      },
    ],
    colors: [
      {
        name: String,
        hex: String,
      },
    ],
    images: [
      {
        url: String,
        public_id: String,
      },
    ],
    stock: {
      type: Number,
      required: [true, 'Please provide stock quantity'],
      default: 0,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    trending: {
      type: Boolean,
      default: false,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    brand: {
      type: String,
      default: 'Aurel',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Product', productSchema);
