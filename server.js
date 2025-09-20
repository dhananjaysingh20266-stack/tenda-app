const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Routes
app.get('/', (req, res) => {
    res.json({
        message: 'Hi! Welcome to Tenda App',
        status: 'running',
        greeting: 'Hello there!'
    });
});

app.get('/hi', (req, res) => {
    res.json({
        response: 'Hi! How can I help you today?',
        app: 'tenda-app'
    });
});

app.get('/hello', (req, res) => {
    res.json({
        response: 'Hello! Nice to meet you!',
        app: 'tenda-app'
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Tenda App is running on port ${PORT}`);
    console.log(`Visit http://localhost:${PORT} to see the app`);
});