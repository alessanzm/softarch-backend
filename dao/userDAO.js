const User = require('../models/User');

/**
 * Find user by email
 */
exports.getUserByEmail = async (email) => {
    try {
        return await User.findOne({ email });
    } catch (err) {
        throw new Error(`Database error in getUserByEmail: ${err.message}`);
    }
};

/**
 * Find student by email and matric number
 */
exports.getStudentByMatric = async (email, matricNo) => {
    try {
        return await User.findOne({
            email,
            matricno: matricNo
        });
    } catch (err) {
        throw new Error(`Database error in getStudentByMatric: ${err.message}`);
    }
};

/**
 * Create new user
 */
exports.createUser = async (name, email, password, role, matricNo) => {
    try {
        const newUser = new User({
            name,
            email,
            password,
            role,
            matricno: matricNo || null
        });

        return await newUser.save();
    } catch (err) {
        throw new Error(`Database error in createUser: ${err.message}`);
    }
};
