import { useEffect, useState } from "react";
import { db } from "../../firebase";
import "./adminDash.css"
import { collection, query, orderBy, getDocs } from "firebase/firestore";

function AdminDashboard(){
    const [botRequests, setBotRequests] = useState([]);

    useEffect(() => {
        const fetchBotRequests = async () => {
            const newBotRef = collection(db, "newBotRequest");
            const q = query(newBotRef, orderBy('timestamp', 'asc'));
            const querySnapshot = await getDocs(q);
            const newRequestData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setBotRequests(newRequestData);     
        };

        fetchBotRequests();
    }, []);

    return (
        <>
            <h1>New Bot Requests</h1>
            {botRequests.map(bot => (
                <div key={bot.id} className="new-bot-request-container">
                    <h3>Name: {bot.name}</h3>
                    <h3>Creator: {bot.creator}</h3>
                    <h3>Creator Id: {bot.creatorId}</h3>
                    <h3>Greeting: {bot.greeting}</h3>
                    <h3>Description: {bot.description}</h3>
                    <h3>Additional Message: {bot.additionalMessage}</h3>
                </div>
            ))}
        </>
    );
}

export default AdminDashboard;
