const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');

class CourseDao {

    async getCoursesByRole(role, userId) {
        try {
            if (role === 'student') {
                const enrollments = await Enrollment.find({ studentId: userId });
                const courseIds = enrollments.map(e => e.courseId);

                return await Course.find({ _id: { $in: courseIds } });
            }

            if (role === 'lecturer') {
                return await Course.find({ lecturerId: userId });
            }

            return await Course.find();

        } catch (err) {
            throw new Error(`Database error in getCoursesByRole: ${err.message}`);
        }
    }

    async createCourse(title, courseCode, description, lecturerId) {
        try {
            return await Course.create({
                title,
                courseCode,
                description,
                lecturerId: lecturerId || null
            });
        } catch (err) {
            throw new Error(`Database error in createCourse: ${err.message}`);
        }
    }

    async updateCourse(courseId, title, courseCode, description) {
        try {
            return await Course.findByIdAndUpdate(
                courseId,
                { title, courseCode, description },
                { new: true }
            );
        } catch (err) {
            throw new Error(`Database error in updateCourse: ${err.message}`);
        }
    }

    async deleteCourse(courseId) {
        try {
            return await Course.findByIdAndDelete(courseId);
        } catch (err) {
            throw new Error(`Database error in deleteCourse: ${err.message}`);
        }
    }

    async getCourseByCode(courseCode) {
        try {
            return await Course.findOne({ courseCode });
        } catch (err) {
            throw new Error(`Database error in getCourseByCode: ${err.message}`);
        }
    }

    async checkEnrollment(studentId, courseId) {
        try {
            const existing = await Enrollment.findOne({ studentId, courseId });
            return !!existing;
        } catch (err) {
            throw new Error(`Database error in checkEnrollment: ${err.message}`);
        }
    }

    async enrollStudent(studentId, courseId) {
        try {
            return await Enrollment.create({ studentId, courseId });
        } catch (err) {
            throw new Error(`Database error in enrollStudent: ${err.message}`);
        }
    }
}

module.exports = new CourseDao();
