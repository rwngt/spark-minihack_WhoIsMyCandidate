const express = require('express');
const bodyParser = require('body-parser');
const trumpChatbotLogic = require('./trump_chatbot_logic');
const harrisChatbotLogic = require('./harris_chatbot_logic');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static('..')); // Serve static files from the parent directory

// Root route for testing the server
app.get('/', (req, res) => {
    res.send('Welcome to the Chatbot API!');
});

// Chat endpoint for handling Trump chatbot queries
app.post('/chat/trump', async (req, res) => {
    const userMessage = req.body.message;
    console.log('Trump Chatbot - User Message:', userMessage); // Log the user message

    try {
        const answer = await trumpChatbotLogic.getTrumpChatbotResponse(userMessage);
        console.log('Trump Chatbot - Response:', answer); // Log the response
        res.json({ answer });
    } catch (error) {
        console.error('Error in Trump Chatbot:', error);
        res.status(500).json({ error: 'Error processing the request.' });
    }
});

// Chat endpoint for handling Harris chatbot queries
app.post('/chat/harris', async (req, res) => {
    const userMessage = req.body.message;
    console.log('Harris Chatbot - User Message:', userMessage); // Log the user message

    try {
        const answer = await harrisChatbotLogic.getHarrisChatbotResponse(userMessage);
        console.log('Harris Chatbot - Response:', answer); // Log the response
        res.json({ answer });
    } catch (error) {
        console.error('Error in Harris Chatbot:', error);
        res.status(500).json({ error: 'Error processing the request.' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
