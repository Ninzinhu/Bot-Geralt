const mongoose = require('mongoose');

const ticketMessageSchema = new mongoose.Schema({
    ticket: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ticket',
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
    message: {
        type: String,
        required: true,
        trim: true
    },
    is_staff: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Índices para melhor performance
ticketMessageSchema.index({ ticket: 1 });
ticketMessageSchema.index({ user_id: 1 });
ticketMessageSchema.index({ createdAt: 1 });

module.exports = mongoose.model('TicketMessage', ticketMessageSchema); 