import "./chatWindow.css";
import { useState, useEffect, useRef } from "react";
import { auth, db } from "../../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useParams } from "react-router-dom";
import axios from "axios";
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, where, getDocs } from "firebase/firestore";
import UserMessage from "../messageCards/userMessage";
import BotMessage from "../messageCards/botMessage";
import Sidebar from "../sidebar/sidebar";

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


    const toggleSidebar = () => {
        setSidebarVisible(!isSidebarVisible);
    };

    const messageWrapperRef = useRef(null);
    const messageInputContainerRef = useRef(null);
    const textareaRef = useRef(null);
    const formRef = useRef(null);
    const endOfMessagesRef = useRef(null);

    const onSuggestedClick = (message) => {
        setDisplay(message);
        setInput(message);
    };

    const getBotById = async () => {
        try {
            const q = query(collection(db, 'bots'), where('id', '==', params.id));
            const querySnapshot = await getDocs(q);

            if (!loading) {
                const doc = querySnapshot.docs[0];
                const data = doc.data();
                setWelcomeMessage(data.welcomeMessage);
                setBotName(data.name);
                setBotProfilePicture(data.img);
            }
        } catch (error) {
            console.error("Error fetching bot data: ", error);
        }
    };

    const handleInputChange = (e) => {
        setDisplay(e.target.value);
        setInput(e.target.value);
        adjustTextareaHeight(e.target);
    };

    const adjustTextareaHeight = (textarea) => {
        textarea.style.height = "auto";
        const scrollHeight = textarea.scrollHeight;
        const maxHeight = 90;

        const newTextareaHeight = Math.min(scrollHeight, maxHeight);

        textarea.style.height = `${newTextareaHeight}px`;
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (input.trim() !== "") {
            const newMessage = {
                id: crypto.randomUUID(),
                message: input,
                reply: null,
                sender: 'user',
                timestamp: new Date(),
                loading: true,
            };
            setMessages((prevMessages) => [...prevMessages, newMessage]);
            setDisplay("");
            setInput("");
            adjustTextareaHeight(textareaRef.current);

            try {
                const messagesRef = collection(db, 'users', user.uid, 'characters', params.id, 'messages');
                const docRef = await addDoc(messagesRef, {
                    message: input,
                    reply: null,
                    sender: 'user',
                    timestamp: serverTimestamp(),
                });
                
                const response = await axios.post(`https://xanton-1-0-server.vercel.app/api/chat/${user.uid}/${params.id}`, { message: input, messageId: docRef.id });
                console.log(params.id)
                setMessages((prevMessages) =>
                    prevMessages.map((msg) =>
                        msg.id === docRef.id ? { ...msg, reply: response.data.reply, loading: false } : msg
                    )
                );

            } catch (error) {
                console.error('Error sending message:', error);
                setMessages((prevMessages) => prevMessages.filter(msg => msg.id !== newMessage.id));
            }
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            formRef.current.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
        }
    };

    useEffect(() => {
        if (textareaRef.current) {
            adjustTextareaHeight(textareaRef.current);
        }

        //get the messages and update the messae list to be rendered
        if (!loading) {
            const messagesRef = collection(db, 'users', user.uid, 'characters', params.id, 'messages');
            const q = query(messagesRef, orderBy('timestamp', 'asc'));

            const unsubscribe = onSnapshot(q, (snapshot) => {
                const messagesData = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                getBotById();
                setMessages(messagesData);
                console.log(loading)
                setLoadingMessages(false);
                console.log(loading)
                scrollToEnd();
            });

            return () => unsubscribe();
        }
    }, [loading, user, params.id]);

    const scrollToEnd = () => {
        endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToEnd();
    }, [messages]);

    const combinedMessages = [
        {
            id: 'welcome',
            reply: welcomeMessage,
            sender: 'bot',
            timestamp: new Date(),
        },
        ...messages,
    ];

    if (loading) {
        return (<><div className="loading-div"></div></>);
    }

    return (
        <div className="display-message-container">
            <div className="messages-wrapper" ref={messageWrapperRef}>
                <div className="welcome-message-container">
                    <div className="welcome-message-image-container">
                        {!botProfilePicture ? <div className="skeleton-profile-picture-container"><div className="skeleton-profile-picture"></div></div> : <img src={botProfilePicture} alt="" className="welcome-message-image-chatWindow" />}
                    </div>
                    <h2 className="welcome-message">Welcome to your conversation with {botName}</h2>
                </div>
                {loadingMessages ? (
                    <div className="skeleton-text-container">
                        <div className="skeleton-image"></div>
                        <div className="skeleton-content"></div>
                    </div>
                ) : (
                    combinedMessages.map((msg) => (
                        <div key={msg.id}>
                            {msg.message &&
                                <UserMessage userMessage={msg.message} />
                            }
                            {msg.reply ? (
                                <BotMessage image={botProfilePicture} botMessage={msg.reply} />
                            ) : (
                                <div className="skeleton-text-container">
                                    <div className="skeleton-image"></div>
                                    <div className="skeleton-content"></div>
                                </div>
                            )}
                        </div>
                    ))
                )}
                <div ref={endOfMessagesRef} />
            </div>
            <div className="display-input-container-chat-window">
                <div className="suggested-questions-div">
                    <button onClick={() => onSuggestedClick("Where were you born")} className="suggested-question">Where were you born</button>
                    <button onClick={() => onSuggestedClick("Who were your siblings")} className="suggested-question">Who were your siblings</button>
                    <button onClick={() => onSuggestedClick("What was your best moment in life")} className="suggested-question">What was your best moment in life</button>
                    <button onClick={() => onSuggestedClick("What are you famous for")} className="suggested-question">What are you famous for</button>
                </div>
                <div className="message-input-container" ref={messageInputContainerRef}>
                    <form ref={formRef} onSubmit={handleSendMessage}>
                        <textarea
                            inputMode="text"
                            ref={textareaRef}
                            onChange={handleInputChange}
                            onKeyDown={handleKeyDown}
                            placeholder="Message"
                            value={display}
                            type="text"
                            className="message-input"
                            rows="1"
                            style={{ overflow: 'auto' }} // Ensures scrollbar appears only when necessary
                        />
                    </form>
                    <p className="use-scrollbar-message">This character may provide false information</p>
                </div>
            </div>
            <button className="hamburger-menu-chat" onClick={toggleSidebar}>
                <span className="material-symbols-outlined" id="material-hamburger-menu-chat">menu</span>
            </button>
            {isSidebarVisible && (
                <div className="sidebar-chatwin">
                    <button onClick={toggleSidebar} className="close-sidebar-480-button">
                        <span className="material-symbols-outlined" id="close-button-sidebar-chatwin">close</span>
                    </button>
                    <Sidebar />
                </div>
            )}
        </div>
    );
}

export default ChatWindow;
