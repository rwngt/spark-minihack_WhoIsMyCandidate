const express = require('express');
const cors = require('cors');
const { Configuration, OpenAIApi } = require('openai');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// OpenAI Configuration
const configuration = new Configuration({
    apiKey: 'YOUR_OPENAI_API_KEY' // Replace with your actual OpenAI API key
});
const openai = new OpenAIApi(configuration);

// Endpoint for Candidate 1's chatbot
app.post('/chatbot1', async (req, res) => {
    const { message } = req.body;
    try {
        const response = await openai.createChatCompletion({
            model: 'gpt-4', // Or 'gpt-3.5-turbo' depending on your needs
            messages: [{ role: 'user', content: message }],
        });

        res.json({
            response: response.data.choices[0].message.content
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error communicating with OpenAI API' });
    }
});

// Endpoint for Candidate 2's chatbot
app.post('/chatbot2', async (req, res) => {
    const { message } = req.body;
    try {
        const response = await openai.createChatCompletion({
            model: 'gpt-4',
            messages: [{ role: 'user', content: message }],
        });

        res.json({
            response: response.data.choices[0].message.content
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error communicating with OpenAI API' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
