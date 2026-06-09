const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    title: String,
    courseCode: {
        type: String,
        unique: true
    },
    description: String,
    lecturerId: String
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);
