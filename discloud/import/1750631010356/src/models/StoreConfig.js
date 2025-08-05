const mongoose = require('mongoose');

const storeConfigSchema = new mongoose.Schema({
    key: {
        type: String,
        required: true,
        trim: true
    },
    value: {
        type: String,
        required: true,
        trim: true
    }
}, {
    timestamps: true
});

// Índice único para key
storeConfigSchema.index({ key: 1 }, { unique: true });

module.exports = mongoose.model('StoreConfig', storeConfigSchema); 