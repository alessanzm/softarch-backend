const express = require('express');
const router = express.Router();
const Course = require('../models/Course');

/*
=================================================
GET ALL / GET BY ROLE (DITAPIS KETAT)
=================================================
*/
router.get('/', async (req, res) => {
    try {
        const role = req.query.role;
        const userId = req.query.userId ? req.query.userId.trim() : null;

        // Jika student: Hanya pulangkan kursus yang ada studentId mereka dalam array 'students'
        if (role === 'student' && userId) {
            const courses = await Course.find({ students: userId });
            return res.status(200).json(courses);
        }

        // Jika lecturer: Hanya pulangkan kursus milik lecturer tersebut
        if (role === 'lecturer' && userId) {
            const courses = await Course.find({ lecturerId: userId });
            return res.status(200).json(courses);
        }

        // Jika admin atau peranan lain: Lihat semua kursus
        const allCourses = await Course.find({});
        return res.status(200).json(allCourses);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

/*
=================================================
CREATE COURSE
=================================================
*/
router.post('/', async (req, res) => {
    const { title, courseCode, description, lecturerId, role } = req.body;

    if (role !== 'admin' && role !== 'lecturer') {
        return res.status(403).json({ error: "Only Admin or Lecturer can create courses." });
    }

    try {
        const course = new Course({
            title,
            courseCode: courseCode ? courseCode.trim() : courseCode,
            description,
            lecturerId: lecturerId ? lecturerId.trim() : lecturerId,
            students: [] // Pastikan bermula dengan array kosong
        });

        await course.save();
        return res.status(201).json({ success: true, message: "Course created successfully." });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

/*
=================================================
UPDATE COURSE
=================================================
*/
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { title, courseCode, description, lecturerId, role } = req.body;

    if (role !== 'admin' && role !== 'lecturer') {
        return res.status(403).json({ error: "Only Admin or Lecturer can update courses." });
    }

    try {
        await Course.findByIdAndUpdate(id, {
            title,
            courseCode: courseCode ? courseCode.trim() : courseCode,
            description,
            lecturerId: lecturerId ? lecturerId.trim() : lecturerId
        });
        return res.status(200).json({ success: true, message: "Course updated successfully." });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

/*
=================================================
DELETE COURSE
=================================================
*/
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    const { role } = req.body;

    if (role !== 'admin' && role !== 'lecturer') {
        return res.status(403).json({ error: "Only Admin or Lecturer can delete courses." });
    }

    try {
        await Course.findByIdAndDelete(id);
        return res.status(200).json({ success: true, message: "Course deleted successfully." });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

/*
=================================================
ENROLL STUDENT (Diselaraskan dengan panggilan frontend)
=================================================
*/
router.post('/enroll', async (req, res) => {
    try {
        const courseCode = req.body.courseCode ? req.body.courseCode.trim() : null;
        const studentId = req.body.userId ? req.body.userId.trim() : null; // Terima parameter 'userId' dari frontend

        if (!courseCode || !studentId) {
            return res.status(400).json({ error: "Course code and Student ID are required." });
        }

        const course = await Course.findOne({ courseCode: courseCode });

        if (!course) {
            return res.status(404).json({ error: "Course code not found." });
        }

        if (!course.students) {
            course.students = [];
        }

        // Semak sekiranya pelajar sudah mendaftar untuk mengelakkan pertindihan
        if (course.students.includes(studentId)) {
            return res.status(400).json({ error: "You are already enrolled in this course." });
        }

        course.students.push(studentId);
        await course.save();

        return res.status(200).json({ success: true, message: "Enrollment successful." });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

module.exports = router;
