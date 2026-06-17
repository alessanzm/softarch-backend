const express = require('express');
const router = express.Router();

const Course = require('../models/Course');
const courseDAO = require('../dao/courseDAO');

/*
=================================================
GET ALL / GET BY ROLE
=================================================
*/
router.get('/', async (req, res) => {
    try {

        const { role, userId } = req.query;

        // Student view
        if (role === 'student' && userId) {

            const courses = await Course.find({
                students: userId
            });

            return res.status(200).json(courses);
        }

        // Lecturer view
        if (role === 'lecturer' && userId) {

            const courses = await Course.find({
                lecturerId: userId
            });

            return res.status(200).json(courses);
        }

        // Admin view
        const allCourses = await Course.find({});

        return res.status(200).json(allCourses);

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            error: "Internal Server Error"
        });

    }
});

/*
=================================================
CREATE COURSE
=================================================
*/
router.post('/', async (req, res) => {

    const {
        title,
        courseCode,
        description,
        lecturerId,
        role
    } = req.body;

    if (role !== 'admin' && role !== 'lecturer') {
        return res.status(403).json({
            error: "Only Admin or Lecturer can create courses."
        });
    }

    try {

        const course = new Course({
            title,
            courseCode,
            description,
            lecturerId
        });

        await course.save();

        return res.status(201).json({
            success: true,
            message: "Course created successfully."
        });

    } catch (err) {

        return res.status(500).json({
            error: err.message
        });

    }
});

/*
=================================================
UPDATE COURSE
=================================================
*/
router.put('/:id', async (req, res) => {

    const { id } = req.params;

    const {
        title,
        courseCode,
        description,
        role
    } = req.body;

    if (role !== 'admin' && role !== 'lecturer') {
        return res.status(403).json({
            error: "Only Admin or Lecturer can update courses."
        });
    }

    try {

        await Course.findByIdAndUpdate(
            id,
            {
                title,
                courseCode,
                description
            }
        );

        return res.status(200).json({
            success: true,
            message: "Course updated successfully."
        });

    } catch (err) {

        return res.status(500).json({
            error: err.message
        });

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
        return res.status(403).json({
            error: "Only Admin or Lecturer can delete courses."
        });
    }

    try {

        await Course.findByIdAndDelete(id);

        return res.status(200).json({
            success: true,
            message: "Course deleted successfully."
        });

    } catch (err) {

        return res.status(500).json({
            error: err.message
        });

    }
});

/*
=================================================
ENROLL STUDENT
=================================================
*/
router.post('/enroll', async (req, res) => {

    try {

        const {
            courseCode,
            studentId
        } = req.body;

        const course = await Course.findOne({
            courseCode
        });

        if (!course) {
            return res.status(404).json({
                error: "Course code not found."
            });
        }

        if (!course.students) {
            course.students = [];
        }

        if (course.students.includes(studentId)) {
            return res.status(400).json({
                error: "Student already enrolled."
            });
        }

        course.students.push(studentId);

        await course.save();

        return res.status(200).json({
            success: true,
            message: "Enrollment successful."
        });

    } catch (err) {

        return res.status(500).json({
            error: err.message
        });

    }
});

module.exports = router;
