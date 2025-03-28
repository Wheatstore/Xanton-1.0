import { useState, useEffect, useRef } from "react";
import { auth, db } from "../../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useParams } from "react-router-dom";
import axios from "axios";
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  addDoc, 
  updateDoc,
  doc,
  serverTimestamp, 
  where, 
  getDocs 
} from "firebase/firestore";
import Sidebar from "../sidebar/sidebar";
import CharacterAvatar from "../../avatar/CharacterAvatar";

function ChatWindow() {
    const params = useParams();
    const [input, setInput] = useState("");
    const [user, loading] = useAuthState(auth);
    const [messages, setMessages] = useState([]);
    const [display, setDisplay] = useState("");
    const [welcomeMessage, setWelcomeMessage] = useState("");
    const [botProfilePicture, setBotProfilePicture] = useState("");
    const [botName, setBotName] = useState("");
    const [loadingMessages, setLoadingMessages] = useState(true);
    const [isSidebarVisible, setSidebarVisible] = useState(false);
    const [currentBotMessage, setCurrentBotMessage] = useState("");
    const [sendingMessage, setSendingMessage] = useState(false);
    
    // Avatar animation states
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [mouthOpenness, setMouthOpenness] = useState(0);
    const [blinking, setBlinking] = useState(false);
    const animationRef = useRef(null);

    const messageWrapperRef = useRef(null);
    const messageInputContainerRef = useRef(null);
    const textareaRef = useRef(null);
    const formRef = useRef(null);
    const endOfMessagesRef = useRef(null);
    const lastMessageIdRef = useRef(null);

    const toggleSidebar = () => {
        setSidebarVisible(!isSidebarVisible);
    };

    // Handle blinking animation
    useEffect(() => {
        const blinkInterval = setInterval(() => {
            setBlinking(true);
            setTimeout(() => setBlinking(false), 200);
        }, 4000 + Math.random() * 3000); // Random blink timing

        return () => clearInterval(blinkInterval);
    }, []);

    // Animate mouth when bot is speaking
    useEffect(() => {
        let animationId;
        
        if (isSpeaking) {
            const animateMouth = () => {
                // More dramatic mouth animation with faster cycles
                const time = Date.now() / 100; // Speed of mouth movement
                
                // Use a combination of sine waves for more varied movement
                const primaryWave = Math.sin(time) * 0.5 + 0.5;
                const secondaryWave = Math.sin(time * 1.5) * 0.3;
                
                // Combine waves for natural movement
                let openness = primaryWave + secondaryWave;
                
                // Ensure values stay in reasonable range
                openness = Math.max(0, Math.min(1, openness));
                
                // Add occasional dramatic openings for emphasis
                if (Math.random() < 0.03) {
                    openness = 0.9 + (Math.random() * 0.1);
                }
                
                // Add occasional closures for consonants
                if (Math.random() < 0.05) {
                    openness = 0.1 * Math.random();
                }
                
                setMouthOpenness(openness);
                animationId = requestAnimationFrame(animateMouth);
            };
            
            animationId = requestAnimationFrame(animateMouth);
        } else {
            setMouthOpenness(0);
        }
        
        return () => {
            if (animationId) {
                cancelAnimationFrame(animationId);
            }
        };
    }, [isSpeaking]);

    const onSuggestedClick = (message) => {
        setDisplay(message);
        setInput(message);
        if (textareaRef.current) {
            adjustTextareaHeight(textareaRef.current);
        }
    };

    const getBotById = async () => {
        try {
            const q = query(collection(db, 'bots'), where('id', '==', params.id));
            const querySnapshot = await getDocs(q);

            if (!loading && querySnapshot.docs.length > 0) {
                const doc = querySnapshot.docs[0];
                const data = doc.data();
                setWelcomeMessage(data.welcomeMessage);
                setBotName(data.name);
                setBotProfilePicture(data.img);
                
                // Only set welcome message if no other bot message is displayed
                if (!currentBotMessage) {
                    setCurrentBotMessage(data.welcomeMessage);
                }
            }
        } catch (error) {
            console.error("Error fetching bot data: ", error);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (input.trim() !== "" && !sendingMessage) {
            setSendingMessage(true);
            const messageText = input.trim();
            
            // Clear input immediately for better UX
            setDisplay("");
            setInput("");
            adjustTextareaHeight(textareaRef.current);

            try {
                // Add document to Firestore first
                const messagesRef = collection(db, 'users', user.uid, 'characters', params.id, 'messages');
                const docRef = await addDoc(messagesRef, {
                    message: messageText,
                    reply: null,
                    sender: 'user',
                    timestamp: serverTimestamp(),
                    pendingReply: true
                });
                
                lastMessageIdRef.current = docRef.id;
                
                // Send message to backend API
                const response = await axios.post(
                    `https://historia-backend-8bvz.onrender.com/api/chat/${user.uid}/${params.id}/${params.name}`, 
                    { message: messageText, messageId: docRef.id }
                );
                
                // Update the document with the reply from backend
                if (response && response.data && response.data.reply) {
                    await updateDoc(doc(db, 'users', user.uid, 'characters', params.id, 'messages', docRef.id), {
                        reply: response.data.reply,
                        pendingReply: false
                    });
                    
                    // Set current bot message and animate
                    setCurrentBotMessage(response.data.reply);
                    animateBotResponse(response.data.reply);
                }
            } catch (error) {
                console.error('Error sending message:', error);
                // Handle error state if needed
            } finally {
                setSendingMessage(false);
            }
        }
    };

    // Animate the bot's mouth based on response length
    const animateBotResponse = (text) => {
        if (!text) return;
        
        // Start speaking animation
        setIsSpeaking(true);
        
        // Calculate speaking duration based on text length
        // Roughly 50ms per character for average reading speed
        const speakingDuration = Math.min(text.length * 50, 10000); // Cap at 10 seconds
        
        // Stop speaking after calculated duration
        clearTimeout(animationRef.current);
        animationRef.current = setTimeout(() => {
            setIsSpeaking(false);
        }, speakingDuration);
    };

    const handleInputChange = (e) => {
        setDisplay(e.target.value);
        setInput(e.target.value);
        adjustTextareaHeight(e.target);
    };

    const adjustTextareaHeight = (textarea) => {
        if (!textarea) return;
        
        textarea.style.height = "auto";
        const scrollHeight = textarea.scrollHeight;
        const maxHeight = 90;

        const newTextareaHeight = Math.min(scrollHeight, maxHeight);

        textarea.style.height = `${newTextareaHeight}px`;
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            formRef.current.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
        }
    };

    // Load messages from Firestore
    useEffect(() => {
        if (!loading && user) {
            getBotById();
            
            const messagesRef = collection(db, 'users', user.uid, 'characters', params.id, 'messages');
            const q = query(messagesRef, orderBy('timestamp', 'asc'));

            const unsubscribe = onSnapshot(q, (snapshot) => {
                const messagesData = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                
                setMessages(messagesData);
                setLoadingMessages(false);
                
                // Find the latest message with a bot reply
                if (messagesData.length > 0) {
                    // Sort by timestamp in descending order and find first with reply
                    const messagesWithReplies = messagesData
                        .filter(msg => msg.reply)
                        .sort((a, b) => {
                            // Convert Firestore timestamps or JS Date objects for comparison
                            const getTime = (timestamp) => {
                                if (timestamp && timestamp.seconds) {
                                    return timestamp.seconds * 1000;
                                }
                                if (timestamp instanceof Date) {
                                    return timestamp.getTime();
                                }
                                return 0;
                            };
                            
                            return getTime(b.timestamp) - getTime(a.timestamp);
                        });
                    
                    if (messagesWithReplies.length > 0) {
                        const latestReply = messagesWithReplies[0].reply;
                        setCurrentBotMessage(latestReply);
                    }
                }
                
                // Scroll to bottom after messages load
                scrollToEnd();
            });

            return () => unsubscribe();
        }
    }, [loading, user, params.id]);

    const scrollToEnd = () => {
        setTimeout(() => {
            endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
    };

    useEffect(() => {
        scrollToEnd();
    }, [messages]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-900">
                <div className="w-12 h-12 border-4 border-t-blue-500 border-solid rounded-full animate-spin"></div>
            </div>
        );
    }
    
    return (
        <div className="flex flex-col h-screen bg-black text-gray-200">
            {/* Main chat area with avatar and message display */}
            <div className="flex flex-1 flex-col md:flex-row items-center justify-center p-4 overflow-hidden">
                {/* Avatar container - now using the CharacterAvatar component */}
                <div className="w-100 h-100 md:w-48 md:h-48 mb-4 md:mb-0">
                    <img src={botProfilePicture} alt="Historical Figure Talking Portrait" className="rounded-full" />
                </div>
                
                {/* Message display box */}
                <div className="w-full md:w-2/3 max-w-2xl bg-gray-900 rounded-xl p-4 ml-0 md:ml-6 shadow-lg">
                    <div className="flex items-center mb-2">
                        <div className="w-0 h-8"></div>
                        <span className="font-bold text-white">{botName || "Bot"}</span>
                    </div>
                    <div className="bg-gray-700 rounded-lg p-4 max-h-48 overflow-y-auto">
                        {currentBotMessage ? (
                            <p className="text-gray-200">{currentBotMessage}</p>
                        ) : (
                            <p className="text-gray-400 italic">No messages yet</p>
                        )}
                    </div>
                </div>
            </div>
    
            {/* Message history scroll area */}
            <div className="flex-1 overflow-y-auto pb-4 px-4 max-h-40 bg-black">
                <div className="space-y-4" ref={messageWrapperRef}>
                    {messages.map((message) => (
                        <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-3/4 rounded-lg p-3 ${message.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-200'}`}>
                                <p>{message.sender === 'user' ? message.message : message.reply}</p>
                                {message.pendingReply && (
                                    <div className="flex space-x-1 mt-2 justify-center">
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                    <div ref={endOfMessagesRef} />
                </div>
            </div>
            
            {/* Input Area */}
            <div className="border-t border-gray-700 bg-black px-4 py-3">
                <div className="flex flex-wrap gap-2 mb-3">
                    <button onClick={() => onSuggestedClick("Where were you born")} className="px-3 py-1 text-sm bg-gray-700 hover:bg-gray-600 rounded-full text-gray-300 transition-colors">Where were you born</button>
                    <button onClick={() => onSuggestedClick("Who were your siblings")} className="px-3 py-1 text-sm bg-gray-700 hover:bg-gray-600 rounded-full text-gray-300 transition-colors">Who were your siblings</button>
                    <button onClick={() => onSuggestedClick("What was your best moment in life")} className="px-3 py-1 text-sm bg-gray-700 hover:bg-gray-600 rounded-full text-gray-300 transition-colors">What was your best moment in life</button>
                    <button onClick={() => onSuggestedClick("What are you famous for")} className="px-3 py-1 text-sm bg-gray-700 hover:bg-gray-600 rounded-full text-gray-300 transition-colors">What are you famous for</button>
                </div>
                
                <div className="relative" ref={messageInputContainerRef}>
                    <form ref={formRef} onSubmit={handleSendMessage} className="relative">
                        <textarea
                            inputMode="text"
                            ref={textareaRef}
                            onChange={handleInputChange}
                            onKeyDown={handleKeyDown}
                            placeholder="Message"
                            value={display}
                            disabled={sendingMessage}
                            className="w-full border border-gray-600 bg-gray-700 rounded-lg px-4 py-2 pr-12 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-200 placeholder-gray-400 disabled:opacity-70"
                            rows="1"
                            style={{ overflow: 'auto' }}
                        />
                        <button 
                            type="submit" 
                            className="absolute right-2 bottom-2 p-2 text-blue-400 hover:text-blue-300 focus:outline-none disabled:text-gray-500"
                            disabled={!input.trim() || sendingMessage}
                        >
                            {sendingMessage ? (
                                <svg className="animate-spin h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                                </svg>
                            )}
                        </button>
                    </form>
                    <p className="text-xs text-gray-500 mt-1">This character may provide false information</p>
                </div>
            </div>
            
            {/* Sidebar */}
            {isSidebarVisible && (
                <div className="fixed inset-y-0 left-0 w-64 bg-gray-800 shadow-xl z-40 transition-transform transform-gpu border-r border-gray-700">
                    <button 
                        onClick={toggleSidebar} 
                        className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-700 focus:outline-none text-gray-300"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                    <Sidebar />
                </div>
            )}
        </div>
    );
}

export default ChatWindow;