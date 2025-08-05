const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
    channel_id: {
        type: String,
        required: true
    },
    user_id: {
        type: String,
        required: true
    },
    user_name: {
        type: String,
        required: true,
        trim: true
    },
    subject: {
        type: String,
        required: true,
        trim: true
    },
    status: {
        type: String,
        enum: ['open', 'closed'],
        default: 'open'
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'urgent'],
        default: 'medium'
    },
    closed_at: {
        type: Date
    }
}, {
    timestamps: true
});

// Índices para melhor performance
ticketSchema.index({ channel_id: 1 }, { unique: true });
ticketSchema.index({ user_id: 1 });
ticketSchema.index({ status: 1 });
ticketSchema.index({ priority: 1 });
ticketSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Ticket', ticketSchema); 