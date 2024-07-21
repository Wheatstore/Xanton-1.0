require('dotenv').config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const nodeMailer = require("nodemailer")
const { updateMessage, setNewBot, createNewUser, addFeedback, countAllUser, countDatabase } = require("./admin");
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.simple()
  ),
  transports: [
    new winston.transports.Console()
  ],
});

const API_KEY = process.env.OPENAI_API_KEY;

const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${API_KEY}`
};

const app = express();

// Enable CORS for specific origin
const corsOptions = {
    origin: 'https://www.xantonai.com',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));

app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: '50mb' }));

// API Routes
app.post("/api/chat/:uid/:characterId", async (req, res) => {
    try {
        const { uid: userId, characterId } = req.params;
        const { message, messageId } = req.body;

        //user gets data from the openai api
        const data = {
            model: 'gpt-4o-mini',
            messages: [
                //prompt for the openAI api
                { role: 'system', content: `You are ${characterId}. Respond to all prompts in this character's tone and mannerisms. When asked for real-life information about this character, such as their place of study or details about their children, provide accurate historical information.` },
                { role: 'user', content: message }
            ]
        };

        const completion = await axios.post('https://api.openai.com/v1/chat/completions', data, { headers });
        const reply = completion.data.choices[0].message.content;

        //new function to update the message in the database
        await updateMessage(messageId, userId, characterId, reply);
        logger.info(req.body);

        //once the server gets that data from the api sends it back to the client or frontend to be displayed
        res.status(200).json({ reply });
    } catch (error) {
        //if there is an error display the error as a log in vercel
        logger.error('Error calling OpenAI API:', error.response ? error.response.data : error.message);
        res.status(error.response ? error.response.status : 500).json({
            error: error.response ? error.response.data : 'Internal Server Error'
        });
    }
});

app.post("/api/create-new-bot", async (req, res) => {
    try {
        const { name, creator, creatorId, greeting, description, additionalMessage } = req.body; //defining the variables that come from the user
        await setNewBot(name, creator, creatorId, greeting, description, additionalMessage); //set a new bot in firestore
        logger.info(req.body); //log that information in vercel
        res.sendStatus(200);
    } catch (error) {
        logger.error("There was an error sending it to you", error);
        res.status(500).json({ error: 'Failed to create new bot' });
    }
});

app.post("/api/feedback", async (req, res)=> {
    const {sender, title, email, description} = req.body //define variables from the user
    try{
        await addFeedback(sender, title, email, description) //add this to a new collection in firestore
        logger.info(req.body) //log the body in vercel
        res.sendStatus(200)
    } catch (error){
        logger.error("There was an error sending an email", error)
    }
})

app.post("/api/create/user", async (req, res) => {
    try {
        //this route is called whenever a new user signs up or is created
        logger.info("Initiated user creation", req.body)
        await createNewUser(req.body);
        res.sendStatus(200);
    } catch (error) {
        logger.error("Failed to add user to database: ", error);
        res.status(500).json({ error: 'Failed to create user' });
    }
});

app.get("/api/user-count", async (req, res)=> {
    try{
        countAllUser(0)

    } catch(error){
        logger.error("There was an error fetching info", error)
    }
})

app.get('/', (req, res) => {
    res.send("server is running");
});

// Export the app for Vercel's serverless functions
module.exports = app;
