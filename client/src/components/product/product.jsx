import { useState, useEffect } from "react";
import BotCard from "../bot-card/botCard";
import "./product.css";
import { db } from "../../firebase";
import { collection, getDocs, query, addDoc } from "firebase/firestore";

function Product() {
    const [bots, setBots] = useState([]);

    useEffect(() => {
        const getBots = async () => {
            try {
                const botsRef = collection(db, 'bots');
                const q = query(botsRef);
                const snapshot = await getDocs(q);

                const botsList = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));

                setBots(botsList);
            } catch (error) {
                console.error("Error fetching bots: ", error);
            }
        };

        getBots();
    }, []);

    return (
        <>
            <div className="product-card-page-container">
                <div className="product-card-container">
                    {bots.map(bot => (
                        <BotCard key={bot.id} person={bot} />
                    ))}
                </div>
            </div>
        </>
    );
}

export default Product;
