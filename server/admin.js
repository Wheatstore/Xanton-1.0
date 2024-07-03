var admin = require("firebase-admin");
var serviceAccount = require("C:/Users/syoo2/OneDrive/Documents/Xanton-1.0-important/xanton-1-firebase-adminsdk-sxkma-926b7c4612.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://your-project-id.firebaseio.com'
});

const db = admin.firestore();

async function updateMessage(messageId, userId, characterId, reply){
    try {
        const docRef = db.collection('users').doc(userId).collection('characters').doc(characterId).collection('messages').doc(messageId);
        await docRef.update({ reply: reply });
        console.log('Document successfully updated');
    } catch (error) {
        console.error('Error updating document:', error);
        throw error;
    }
    
}
module.exports = { updateMessage }