const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    customer_id: {
        type: String,
        required: true
    },
    customer_name: {
        type: String,
        required: true,
        trim: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    total_price: {
        type: Number,
        required: true,
        min: 0
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'cancelled', 'refunded'],
        default: 'pending'
    },
    payment_method: {
        type: String,
        trim: true
    },
    transaction_id: {
        type: String,
        sparse: true,
        index: true
    }
}, {
    timestamps: true
});

// Índices para melhor performance
saleSchema.index({ customer_id: 1 });
saleSchema.index({ status: 1 });
saleSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Sale', saleSchema); 