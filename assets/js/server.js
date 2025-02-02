const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Chatbot API endpoint
app.post('/chat', async (req, res) => {
    const { message } = req.body;

    try {
        // Send request to Gemini API (example URL)
        const response = await axios.post('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyD_aIsfF0GxOCVKMjD8dYhHSslcd56qG20', {
            prompt: message, // The user's message
            apiKey: 'AIzaSyD_aIsfF0GxOCVKMjD8dYhHSslcd56qG20', // Replace with your API key
        });

        // Assuming the response contains a field 'response' with the chatbot's reply
        const chatbotReply = response.data.response;

        // Send back the chatbot's reply
        res.json({ reply: chatbotReply });

    } catch (error) {
        console.error('Error communicating with Gemini API:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
