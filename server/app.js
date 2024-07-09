// Import all necessary files and dependencies
require('dotenv').config();
const express = require("express");
const path = require("path");
const cors = require("cors");
const axios = require("axios");
const { updateMessage, setNewBot, createNewUser } = require("./admin")

const API_KEY = process.env.OPENAI_API_KEY;

const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${API_KEY}`
};

const corsOptions = {
    origin: 'http://localhost:5173', // Your React app's URL
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Allow cookies to be sent with requests
    optionsSuccessStatus: 204
};

// Initialize app as express
const app = express();

app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true })); // Increase limit for URL-encoded payloads
app.use(express.json({ limit: '50mb' })); // Increase limit for JSON payloads
app.use(express.static(path.join(__dirname, '../client/build')));

app.post("/chat/:uid/:characterId", async (req, res) => {
    try {
        const userId = req.params.uid;
        const characterId = req.params.characterId;
        const message = req.body.message; // Assuming message is sent as { message: "your message" }
        const messageId = req.body.messageId

        console.log(req.body)

        const data = {
            model: 'gpt-3.5-turbo',
            messages: [
                { role: 'system', content: `You are ${characterId}. Respond to all prompts in this character's tone and mannerisms. When asked for real-life information about this character, such as their place of study or details about their children, provide accurate historical information.` },
                { role: 'user', content: message }
            ]
        };

        const completion = await axios.post('https://api.openai.com/v1/chat/completions', data, { headers });
        const reply = completion.data.choices[0].message.content;

        await updateMessage(messageId, userId, characterId, reply)

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
        console.log(req.body)
        const { name, creator, creatorId, greeting, description, additionalMessage } = req.body
        await setNewBot(name, creator, creatorId, greeting, description, additionalMessage)
        res.sendStatus(200)
    } catch (error){
        console.error("There was an error sending it to you")
        throw error
    }
})

app.post("/create/user", async (req, res) => {
    try {
        await createNewUser(req.body)
    } catch (error) {
        console.error("Failed to add user to database: ", error);
    }
})


app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html')); // Send the file to the user
});

const PORT = process.env.PORT || 3000; // Initialize the port and configure it

app.listen(PORT, () => {
    console.log(`Server on port ${PORT}...`);
});
