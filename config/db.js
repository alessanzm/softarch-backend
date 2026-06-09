const mongoose = require('mongoose');
const path = require('path');

// Menguruskan pembacaan .env untuk lokal laptop secara dinamik mengikut root folder
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
require('dotenv').config({ path: path.join(__dirname, '.env') });

const connectDB = async () => {
  try {
    // Render akan terus ambil dari Environment Variables dashboard jika ada, 
    // jika tiada baru ia semak fail .env lokal
    const uri = process.env.MONGO_URI;
    
    if (!uri) {
      console.error('❌ Ralat Kritikal: process.env.MONGO_URI tidak dikesan!');
      console.error('Sila pastikan nama KEY di dashboard Render dieja MONGO_URI dengan huruf besar.');
      throw new Error("MONGO_URI is undefined");
    }

    await mongoose.connect(uri);
    console.log('✨ Berjaya disambungkan ke MongoDB Atlas via Mongoose!');
  } catch (error) {
    console.error('❌ Gagal menyambung ke MongoDB:', error.message);
    process.exit(1); 
  }
};

module.exports = connectDB;
