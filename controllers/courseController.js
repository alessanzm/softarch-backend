const express = require('express');
const router = express.Router();
const Course = require('../models/Course');

/*
=================================================
1. GET COURSES BY ROLE & USERID
=================================================
*/
router.get('/', async (req, res) => {
    try {
        const role = req.query.role;
        const userId = req.query.userId ? req.query.userId.trim() : null;

        if (role === 'student' && userId) {
            const courses = await Course.find({ students: userId });
            return res.status(200).json(courses);
        }

        if (role === 'lecturer' && userId) {
            const courses = await Course.find({ lecturerId: userId });
            return res.status(200).json(courses);
        }

        const allCourses = await Course.find({});
        return res.status(200).json(allCourses);

    } catch (error) {
        console.error("Ralat GET /api/courses:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

/*
=================================================
2. CREATE COURSE
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
            students: [] 
        });

        await course.save();
        return res.status(201).json({ success: true, message: "Course created successfully." });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

/*
=================================================
3. UPDATE COURSE
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
4. DELETE COURSE
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
5. ENROLL STUDENT (DISELARESKAN NAMA FIELD)
=================================================
*/
router.post('/enroll', async (req, res) => {
    try {
        const courseCode = req.body.courseCode ? req.body.courseCode.trim() : null;
        // DISELARESKAN: Membaca 'userId' dari body request frontend
        const userId = req.body.userId ? req.body.userId.trim() : null; 

        if (!courseCode || !userId) {
            return res.status(400).json({ error: "Course code and Student ID (userId) are required." });
        }

        const course = await Course.findOne({ courseCode: courseCode });

        if (!course) {
            return res.status(404).json({ error: "Course code not found." });
        }

        if (!course.students) {
            course.students = [];
        }

        if (course.students.includes(userId)) {
            return res.status(400).json({ error: "You are already enrolled in this course." });
        }

        course.students.push(userId);
        await course.save();

        return res.status(200).json({ success: true, message: "Enrollment successful." });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

module.exports = router;
