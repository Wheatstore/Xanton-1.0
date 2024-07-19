var admin = require("firebase-admin");
const { FieldValue } = require('firebase-admin/firestore');

// const serviceAccount = JSON.parse(Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT, 'base64').toString('utf8'));
const serviceAccount = require("C:/Users/syoo2/OneDrive/Documents/Xanton-1.0-important/xanton-1-firebase-adminsdk-sxkma-926b7c4612.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://xanton-1.firebaseio.com'
});

const db = admin.firestore();

async function updateMessage(messageId, userId, characterId, reply) {
    try {
        const docRef = db.collection('users').doc(userId).collection('characters').doc(characterId).collection('messages').doc(messageId);
        await docRef.update({ reply: reply });
        console.log('Document successfully updated');
    } catch (error) {
        console.error('Error updating document:', error);
        throw error;
    }

}

async function setNewBot(name, creator, creatorId, greeting, description, additionalMessage) {
    try {
        const newBotref = db.collection('newBotRequest')
        await newBotref.add({
            name: name,
            creator: creator,
            creatorId: creatorId,
            greeting: greeting,
            description: description,
            additionalMessage: additionalMessage,
            timestamp: FieldValue.serverTimestamp()
        })
        console.log("A new doc was created")
    } catch (error) {
        console.error("There was an error setting a new Bot", error)
        throw error
    }
}

async function createNewUser(user) {
    try {
        const userDatabaseRef = db.collection('userDatabase')
        const snapshot = await userDatabaseRef.where('email', '==', user.email).get();

        if (!snapshot.empty){
            console.log("User already exisits ")
        }

        await userDatabaseRef.add(user)
        console.log("New user-created")
    } catch (error) {
        console.error("Error creating user adding to database:", error);
        throw error
    }
}

async function addFeedback(sender, title, email, description){
    try {
        const feedbackRef = db.collection("feedback")
        await feedbackRef.add({
            sender: sender,
            title: title,
            email: email,
            description: description,
        })
    } catch (error){

    }
}

async function countAllUsers(count, nextPageToken){
    const listUsers =  await admin.auth().listUsers(1000, nextPageToken)
    listUsers.users.map(user => {
        count++
    })
    if (listUsers.pageToken) {
        count = await countUsers(count, listUsers.pageToken);
    }   

    return count;
}

async function countDatabase(){
    const query = db.collection("userDatabase");
    const snapshot = await query.get();
    const count = snapshot.size;
    console.log(count)
}
module.exports = { updateMessage, setNewBot, createNewUser, addFeedback }