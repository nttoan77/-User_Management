// src/models/TrackSchedule.js
import mongoose from 'mongoose';

const TrackScheduleSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    companyName: {
        type: String,
        required: true,
        trim: true
    },

    position: {
        type: String,
        required: true,
        trim: true
    },

    location: {
        type: String,
        trim: true
    },

    appliedDate: {
        type: Date,
        default: Date.now
    },

    status: {
        type: String,
        enum: ['applied', 'waiting', 'interview', 'offered', 'rejected'],
        default: 'applied'
    },

    interviewDate: {
        type: Date
    },

    interviewTime: {
        type: String
    },

    note: {
        type: String,
        trim: true
    },

    jobLink: {
        type: String,
        trim: true
    },

    salaryRange: {
        min: Number,
        max: Number,
        currency: {
            type: String,
            default: 'VND'
        }
    },

    isDeleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Index để query nhanh
TrackScheduleSchema.index({ userId: 1, status: 1 });
TrackScheduleSchema.index({ userId: 1, appliedDate: -1 });

const TrackSchedule = mongoose.model('TrackSchedule', TrackScheduleSchema);
export default TrackSchedule;