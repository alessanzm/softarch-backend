const User = require('../models/user');

exports.getUserByEmail = async (email) => {
    try {
        return await User.findOne({ email });
    } catch (err) {
        throw new Error(`Database error in getUserByEmail: ${err.message}`);
    }
};


exports.getStudentByMatric = async (email, matricNo) => {
    try {
        return await User.findOne({
            email,
            matricNo
        });
    } catch (err) {
        throw new Error(`Database error in getStudentByMatric: ${err.message}`);
    }
};

exports.countByRole = async (role) => {

    return await User.countDocuments({
        role
    });

};
exports.createUser = async (
    userId,
    name,
    email,
    password,
    role,
    matricNo
) {
    try {

        const user = new User({
            userId,
            name,
            email,
            password,
            role,
            matricNo: matricNo || null
        });

        return await user.save();

    } catch (err) {

        throw new Error(
            `Database error in createUser: ${err.message}`
        );

    }
};

        return await user.save();
    } catch (err) {
        throw new Error(`Database error in createUser: ${err.message}`);
    }
};
