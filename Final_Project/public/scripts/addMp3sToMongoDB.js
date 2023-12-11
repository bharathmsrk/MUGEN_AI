// Run this script to add MP3 files to the MongoDB database

const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Connect to MongoDB
mongoose.connect('mongodb+srv://bradhakrishnan:MongoBD123@fullstackwebdev.kqm5gie.mongodb.net/Music_GenDB?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Define MP3 schema to store binary audio data
const mp3Schema = new mongoose.Schema({
    name: String,
    audioData: Buffer, // Store binary audio data
    contentType: String // Store content type (e.g., 'audio/mpeg')
});

const Mp3 = mongoose.model('Mp3', mp3Schema);

// path.resolve to get the parent directory of __dirname
const parentDir = path.resolve(__dirname, '..');

// Read MP3 files from the 'public/audio' directory
const audioDirectory = path.join(parentDir, 'audio');

fs.readdir(audioDirectory, (err, files) => {
    if (err) {
        console.error('Error reading directory:', err);
        return;
    }

    // Insert MP3 files into the database
    files.forEach(file => {
        const filePath = path.join(audioDirectory, file);
        const audioData = fs.readFileSync(filePath);

        const mp3 = new Mp3({
            name: path.parse(file).name,
            audioData: audioData,
            contentType: 'audio/mpeg'
        });

        mp3.save()
            .then(() => {
                console.log(`Added ${file} to the database.`);
            })
            .catch(error => {
                console.error(`Error adding ${file} to the database:`, error);
            });
    });
});

