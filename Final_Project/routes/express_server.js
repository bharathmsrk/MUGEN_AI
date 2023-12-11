const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const Users = require('../public/scripts/data.js');
const axios = require('axios');

const app = express();

// Create constants for host and port
const HOST = 'localhost';
const PORT = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
    secret: 'fp386',
    resave: false,
    saveUninitialized: true
}));

// Add a middleware to check if user is logged in
app.use((req, res, next) => {
    res.locals.isLoggedIn = req.session.user ? true : false;
    next();
});

// Use path.resolve to get the parent directory of __dirname
const parentDir = path.resolve(__dirname, '..');

// Serve static files from the parent directory's public directory
app.use('/static', express.static(path.join(parentDir, 'public')));

// Middleware to parse JSON requests
app.use(bodyParser.json());

// Define routes
app.get('/', (req, res) => {
    if (req.session && req.session.user) {
        var isLoggedIn = true;
        res.sendFile(
            path.join(parentDir, 'public', 'pages', 'main.html'),
        );
    } else {
        res.redirect('/login');
    }
});

// API Key
const uberduckAuth = {
    username: "pub_gspglxmyaspvfwjsan",
    password: "pk_06cd03e4-ffbb-4224-afac-e8af36e5fd44"
};

// Defined the route to handle form submission and generate music
app.post('/generate_music', async (req, res) => {
    try {
        const { generation, subject, lyrics, background, voice, speed } = req.body;

        let output;
        if (generation === 'auto') {
            console.log('Auto generation selected');
            // Automatic generation
            output = await axios.post(
                "https://api.uberduck.ai/tts/freestyle",
                { subject, bpm: 144, backing_track: "84a34767-12c0-4dc0-aa64-c292ac7d13c9", voice: "zwf" },
                { auth: uberduckAuth }
            );
            console.log(output.data);
        } else {
            console.log('Manual generation selected');
            // Manual generation
            const lyricsArray = lyrics.split('\n').map(line => line.split(','));
            output = await axios.post(
                "https://api.uberduck.ai/tts/freestyle",
                { lyrics: lyricsArray, voicemodel_uuid: voice, backing_track: background, bpm: speed },
                { auth: uberduckAuth }
            );

            console.log("Response Status Code:", output.status);
            console.log("Response Content:", output.data);
        }

        if (output.status !== 200) {
            return res.status(output.status).json({ error: `Request failed with status code ${output.status}` });
        }

        const audioUrl = output.data.mix_url;

        if (audioUrl) {
            res.redirect(`/static/pages/playgen.html?audio_url=${encodeURIComponent(audioUrl)}`);
        } else {
            return res.status(500).json({ error: 'Failed to generate music.' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    }
});


app.get('/isLoggedIn', (req, res) => {
    res.json({ isLoggedIn: req.session.user ? true : false });
});

app.get('/about', (req, res) => {
    res.sendFile(path.join(parentDir, 'public', 'pages', 'about.html'));
});

app.get('/signup', (req, res) => {
    res.sendFile(path.join(parentDir, 'public', 'pages', 'signup.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(parentDir, 'public', 'pages', 'login.html'));
});

// '/signup' Route
app.post('/signup', (req, res) => {
    const { fullName, email, password } = req.body;

    const formData = new Users({
        fullName: fullName,
        email: email,
        password: password,
        DateTime: new Date().toLocaleString()
    });

    formData.save()
        .then(() => {
            console.log("Data is added successfully");
            res.redirect('/login?message=Registered%20successfully.%20Please%20login%20to%20continue.');
        })
        .catch(error => {
            console.error('Error saving user:', error);
            res.status(500).send('Error saving user.');
        });
});

// '/login' Route
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await Users.findOne({ email: email, password: password });

        if (user) {
            req.session.user = user;

            res.redirect('/');
        } else {
            res.redirect('/login?message=Invalid%20email%20or%20password.%20Please%20try%20again.');
        }
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).send('Error during login.');
    }
});


// Logout route
app.get('/logout', (req, res) => {

    if (req.session.user) {
        console.log('User does exist:', req.session.user.fullName);
    } else {
        console.log('User Session DOES NOT EXIST');
    }


    req.session.destroy((err) => {
        if (err) {
            console.error('Error logging out:', err);
            res.status(500).send('Error logging out.');
        } else {
            res.redirect('/static/pages/logout.html');
        }
    });
});


const mp3Schema = new mongoose.Schema({
    name: String,
    audioUrl: String,
});

const Mp3 = mongoose.model('Mp3', mp3Schema);

// Handle the form submission and save data to the database
app.post('/api/submit', async (req, res) => {
    try {
        const { name, audioUrl } = req.body;

        const newSong = new Mp3({
            name: name,
            audioUrl: audioUrl,
        });

        await newSong.save();

        res.status(200).json({ message: 'Data saved successfully' });
    } catch (error) {
        console.error('Error during form submission:', error);
        res.status(500).json({ error: 'Error during form submission' });
    }
});


// Add this route to fetch data from the MongoDB database
app.get('/api/songs', async (req, res) => {
    try {
        const songs = await Mp3.find({}, 'name audioUrl');

        res.json(songs);
    } catch (error) {
        console.error('Error fetching songs:', error);
        res.status(500).json({ error: 'Error fetching songs' });
    }
});

// Route to retrieve and send the song data based on the song name
app.get('/play/:songName', async (req, res) => {
    const songName = req.params.songName;

    try {
        const song = await Mp3.findOne({ name: songName });

        if (song) {
            res.set('Content-Type', song.contentType); 
            res.send(song.audioData); 
        } else {
            res.status(404).json({ message: 'Song not found' });
        }
    } catch (error) {
        console.error('Error fetching song:', error);
        res.status(500).json({ message: 'Error fetching song' });
    }
});

// Use bodyParser middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/playsong', async (req, res) => {
    try {
        // Extract form data from the Express request
        const { generation, subject, lyrics, background, voice, speed } = req.body;

        // Make a request to the Flask server to generate music
        const flaskResponse = await axios.post('http://localhost:5000/generate_music', {
            generation,
            subject,
            lyrics,
            background,
            voice,
            speed,
        });

        // Extract the audio URL from the Flask response
        const audioUrl = flaskResponse.data.audio_url;

        // Return the audio URL to the client
        res.json({ audio_url: audioUrl });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to get audio URL from Flask server.' });
    }
});

app.get('/search', (req, res) => {
    res.sendFile(path.join(parentDir, 'public', 'pages', 'results.html'));
});

// Start the server
app.listen(PORT, HOST, () => {
    console.log(`Server is running on http://${HOST}:${PORT}`);
});
