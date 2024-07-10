require('dotenv').config();
const express = require("express");
const path = require("path");
const axios = require("axios");
const { updateMessage, setNewBot, createNewUser } = require("./admin");

const API_KEY = process.env.OPENAI_API_KEY;
const CLIENT_URL = process.env.CLIENT_URL;

const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${API_KEY}`
};

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: '50mb' }));

// API Routes
app.post("/api/chat/:uid/:characterId", async (req, res) => {
    try {
        const { uid: userId, characterId } = req.params;
        const { message, messageId } = req.body;

        const data = {
            model: 'gpt-3.5-turbo',
            messages: [
                { role: 'system', content: `You are ${characterId}. Respond to all prompts in this character's tone and mannerisms. When asked for real-life information about this character, such as their place of study or details about their children, provide accurate historical information.` },
                { role: 'user', content: message }
            ]
        };

        const completion = await axios.post('https://api.openai.com/v1/chat/completions', data, { headers });
        const reply = completion.data.choices[0].message.content;

        await updateMessage(messageId, userId, characterId, reply);
        console.log(req.body)

        res.status(200).json({ reply });
    } catch (error) {
        console.error('Error calling OpenAI API:', error.response ? error.response.data : error.message);
        res.status(error.response ? error.response.status : 500).json({
            error: error.response ? error.response.data : 'Internal Server Error'
        });
    }
});

app.post("/api/create-new-bot", async (req, res) => {
    try {
        console.log(API_KEY)
        const { name, creator, creatorId, greeting, description, additionalMessage } = req.body;
        await setNewBot(name, creator, creatorId, greeting, description, additionalMessage);
        console.log(req.body)
        res.sendStatus(200);
    } catch (error) {
        console.error("There was an error sending it to you", error);
        res.status(500).json({ error: 'Failed to create new bot' });
    }
});

app.post("/create/user", async (req, res) => {
    try {
        await createNewUser(req.body);
        res.sendStatus(200);
    } catch (error) {
        console.error("Failed to add user to database: ", error);
        res.status(500).json({ error: 'Failed to create user' });
    }
});

// Serve the frontend
app.use(express.static(path.join(__dirname, '../client/dist')));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist', 'index.html'));
});

app.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist', 'index.html'));
})

// Export the app for Vercel's serverless functions
module.exports = app;
