const express = require('express');
const cors = require('cors');
const authController = require('./controllers/authController');
const courseController = require('./controllers/courseController'); 

const app = express();
require('dotenv').config();

const connectDB = require('./config/db');

connectDB();

const allowedOrigins = [
    "https://softarch-frontend-fawn.vercel.app",
    "http://localhost:5500",   
    "http://127.0.0.1:5500",   
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) !== -1 || origin.startsWith('file://')) {
            return callback(null, true);
        } else {
            return callback(new Error('Blocked by SmartLearn Security CORS Policy'));
        }
    },
    credentials: true
}));

app.use(express.json());

app.post('/api/register', authController.register);
app.post('/api/login', authController.login);

app.use('/api/courses', courseController);

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
    console.log(`\n🚀 ===================================================`);
    console.log(`    SmartLearn Backend Server Stack Active on Port: ${PORT}`);
    console.log(`====================================================== 🚀\n`);
});
