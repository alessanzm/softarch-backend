const { getDb } = require('../config/db'); 

/**
 * Finds a user by their unique email address.
 */
exports.getUserByEmail = async (email) => {
    try {
        const db = getDb(); // Access the active MongoDB database instance
        
        // MongoDB syntax to find a single document matching the filter
        const user = await db.collection('users').findOne({ email: email });
        return user; // Crucial fix: Added missing return statement!
    } catch (err) {
        throw new Error(`Database error in getUserByEmail: ${err.message}`);
    }
};

/**
 * Finds a student user by matching both their email and matric number.
 */
exports.getStudentByMatric = async (email, matricNo) => {
    try {
        const db = getDb();
        
        // MongoDB syntax for an AND query using an object with multiple properties
        const student = await db.collection('users').findOne({ 
            email: email, 
            matricno: matricNo 
        });
        return student;
    } catch (err) {
        throw new Error(`Database error in getStudentByMatric: ${err.message}`);
    }
};

/**
 * Creates a brand new user document inside your MongoDB 'users' collection.
 */
exports.createUser = async (name, email, password, role, matricNo) => {
    try {
        const db = getDb();
        
        // Prepare the document to match your document structure
        const newUser = {
            name: name,
            email: email,
            password: password,
            role: role,
            matricno: matricNo || null // Default to null if no matric number is provided
        };

        // MongoDB syntax to insert a single document
        const result = await db.collection('users').insertOne(newUser);
        return result;
    } catch (err) {
        throw new Error(`Database error in createUser: ${err.message}`);
    }
};