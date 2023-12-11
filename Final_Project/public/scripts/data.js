const mongoose = require('mongoose');
const connectDB = require('../../modules/db.js');

// Connect to the database
connectDB(true);

// Create a schema for the User model
const userSchema = new mongoose.Schema({
    fullName: String,
    email: String,
    password: String,
    DateTime: String
});

// Create a User model
const Users = mongoose.model('Users', userSchema);

module.exports = Users;