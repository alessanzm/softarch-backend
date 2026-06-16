const express = require('express');
const router = express.Router();
const courseDAO = require('../dao/courseDAO');

router.get('/', async (req, res) => {
const Course = require('../models/Course'); 

exports.getCourses = async (req, res) => {
    try {
        const { role, userId } = req.query;

        if (role === 'student' && userId) {
            const studentIdNum = parseInt(userId);

            const enrolledCourses = await Course.find({ 
                students: studentIdNum 
            });
            return res.status(200).json(enrolledCourses);
        }

        if (role === 'lecturer' && userId) {
            const lecturerIdNum = parseInt(userId);

            const lecturerCourses = await Course.find({ 
                lecturerId: lecturerIdNum 
            });
            return res.status(200).json(lecturerCourses);
        }

        const allCourses = await Course.find({});
        return res.status(200).json(allCourses);

    } catch (error) {
        console.error("Ralat Backend:", error);
        return res.status(500).json({ error: "Internal Server Error dalam pemprosesan data kursus." });
    }
};
});

router.post('/', async (req, res) => {
    const { title, courseCode, description, lecturerId, role } = req.body;

    if (req.body.role !== 'admin' && req.body.role !== 'lecturer') {
        return res.status(403).json({ error: "Access Denied: Only Admins or Lecturer can create courses." });
    }

    try {
        await courseDAO.createCourse(title, courseCode, description, lecturerId);
        return res.status(201).json({ success: true, message: "Course successfully added!" });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { title, courseCode, description, role } = req.body;

    if (req.body.role !== 'admin' && req.body.role !== 'lecturer') {
        return res.status(403).json({ error: "Access Denied: Only Admins or Lecturer can modify courses." });
    }

    try {
        await courseDAO.updateCourse(id, title, courseCode, description);
        return res.json({ success: true, message: "Course updated successfully!" });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    const { role } = req.body;

    if (req.body.role !== 'admin' && req.body.role !== 'lecturer') {
        return res.status(403).json({ error: "Access Denied: Only Admins and Lecturer can remove courses." });
    }

    try {
        await courseDAO.deleteCourse(id);
        return res.json({ success: true, message: "Course deleted successfully!" });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

router.post('/enroll', async (req, res) => {
    const { courseCode, studentId } = req.body;

    try {
        const course = await courseDAO.getCourseByCode(courseCode);
        if (!course) {
            return res.status(404).json({ error: "Course code not found in academic systems." });
        }

        const realCourseId = course.courseId; 

        const alreadyEnrolled = await courseDAO.checkEnrollment(studentId, realCourseId);
        if (alreadyEnrolled) {
            return res.status(400).json({ error: "You are already enrolled in this module." });
        }

        await courseDAO.enrollStudent(studentId, realCourseId);
        return res.json({ success: true, message: "Enrolled successfully!" });

    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

module.exports = router;
