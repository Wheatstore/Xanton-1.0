import { useState, useEffect } from "react";
import BotCard from "./bot-card/botCard";
import { db } from "../../firebase";
import { collection, getDocs, query } from "firebase/firestore";

function Product({ isLanding }) {
    const [bots, setBots] = useState([]);
    const [loadingBots, setLoadingBots] = useState(true);

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
                setLoadingBots(false);
            } catch (error) {
                console.error("Error fetching bots: ", error);
            }
        };

        getBots();
    }, []);

    return (
        <div className="p-5">
            {loadingBots ? (
                <div className="flex flex-wrap justify-center gap-4 md:gap-6 lg:gap-8 mt-8">
                        {[1, 2, 3].map((index) => (
                            <div key={index} className="w-full max-w-md h-96 md:h-[599px] bg-opacity-35 bg-gray-700 rounded-xl p-4 mb-4">
                                <div className="bg-gray-500 bg-opacity-50 h-3/5 md:h-[379px] w-full rounded-xl"></div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="mt-8 mb-12 mx-4 sm:mx-8 md:mx-12 lg:mx-[15%] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 lg:gap-8 justify-center">
                        {/* Use slice to limit array when isLanding is true */}
                        {(isLanding ? bots.slice(0, 8) : bots).map((bot, index) => (
                            <div key={bot.id}>
                                <BotCard person={bot} index={index} />
                            </div>
                        ))}
                    </div>
                )}
        </div>
    );
}

export default Product;