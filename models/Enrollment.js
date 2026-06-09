const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema({
    studentId: String,
    courseId: String
}, { timestamps: true });

module.exports = mongoose.model('Enrollment', enrollmentSchema);
