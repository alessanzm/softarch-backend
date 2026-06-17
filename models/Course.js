const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    courseCode: {
        type: String,
        required: true,
        unique: true 
    },
    description: {
        type: String,
        default: ''
    },
    lecturerId: {
        type: String,
        required: true
    },
    students: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: []
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('Course', courseSchema);
