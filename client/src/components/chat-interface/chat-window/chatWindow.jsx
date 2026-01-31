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
        }, 4000 + Math.random() * 3000);

        return () => clearInterval(blinkInterval);
    }, []);

    // Animate mouth when bot is speaking
    useEffect(() => {
        let animationId;
        
        if (isSpeaking) {
            const animateMouth = () => {
                const time = Date.now() / 100;
                const primaryWave = Math.sin(time) * 0.5 + 0.5;
                const secondaryWave = Math.sin(time * 1.5) * 0.3;
                let openness = primaryWave + secondaryWave;
                openness = Math.max(0, Math.min(1, openness));
                
                if (Math.random() < 0.03) {
                    openness = 0.9 + (Math.random() * 0.1);
                }
                
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
            
            setDisplay("");
            setInput("");
            adjustTextareaHeight(textareaRef.current);

            try {
                const messagesRef = collection(db, 'users', user.uid, 'characters', params.id, 'messages');
                const docRef = await addDoc(messagesRef, {
                    message: messageText,
                    reply: null,
                    sender: 'user',
                    timestamp: serverTimestamp(),
                    pendingReply: true
                });
                
                lastMessageIdRef.current = docRef.id;
                
                const response = await axios.post(
                    `https://historia-backend-8bvz.onrender.com/api/chat/${user.uid}/${params.id}/${params.name}`, 
                    { message: messageText, messageId: docRef.id }
                );
                
                if (response && response.data && response.data.reply) {
                    await updateDoc(doc(db, 'users', user.uid, 'characters', params.id, 'messages', docRef.id), {
                        reply: response.data.reply,
                        pendingReply: false
                    });
                    
                    setCurrentBotMessage(response.data.reply);
                    animateBotResponse(response.data.reply);
                }
            } catch (error) {
                console.error('Error sending message:', error);
            } finally {
                setSendingMessage(false);
            }
        }
    };

    const animateBotResponse = (text) => {
        if (!text) return;
        
        setIsSpeaking(true);
        const speakingDuration = Math.min(text.length * 50, 10000);
        
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
                
                if (messagesData.length > 0) {
                    const messagesWithReplies = messagesData
                        .filter(msg => msg.reply)
                        .sort((a, b) => {
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
            <div className="flex items-center justify-center h-screen bg-black">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
                    <div className="absolute inset-0 w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin-reverse"></div>
                </div>
            </div>
        );
    }
    
    return (
        <div className="flex flex-col h-screen bg-black text-gray-200 relative overflow-hidden">
            {/* Enhanced animated background */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {/* Gradient orbs */}
                <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-gradient-to-br from-purple-600/15 via-purple-500/10 to-transparent rounded-full blur-[120px] animate-float-slow" />
                <div className="absolute bottom-0 right-1/4 w-[900px] h-[900px] bg-gradient-to-tl from-blue-600/15 via-blue-500/10 to-transparent rounded-full blur-[140px] animate-float-slower" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-violet-600/10 via-fuchsia-600/10 to-blue-600/10 rounded-full blur-[100px] animate-pulse-gentle" />
                
                {/* Animated grid */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.03)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />
                
                {/* Floating particles */}
                <div className="absolute top-1/4 left-1/3 w-2 h-2 bg-purple-400/40 rounded-full animate-float-particle-1" />
                <div className="absolute top-3/4 left-2/3 w-1.5 h-1.5 bg-blue-400/40 rounded-full animate-float-particle-2" />
                <div className="absolute top-1/2 right-1/4 w-2 h-2 bg-violet-400/40 rounded-full animate-float-particle-3" />
                <div className="absolute bottom-1/4 left-1/2 w-1 h-1 bg-fuchsia-400/40 rounded-full animate-float-particle-4" />
            </div>

            {/* Main content area */}
            <div className="flex flex-1 flex-col lg:flex-row items-center justify-center p-6 lg:p-8 gap-8 overflow-hidden relative z-10">
                {/* Avatar section with enhanced effects */}
                <div className="relative w-64 h-64 lg:w-80 lg:h-80 flex-shrink-0">
                    {/* Outer glow rings */}
                    <div className="absolute inset-0 -m-8">
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-blue-600/20 to-violet-600/20 rounded-full blur-3xl animate-pulse-gentle" />
                    </div>
                    
                    {/* Rotating ring */}
                    <div className="absolute inset-0 -m-3">
                        <div className="w-full h-full border-2 border-transparent bg-gradient-to-r from-purple-500/30 via-blue-500/30 to-violet-500/30 rounded-full animate-spin-very-slow bg-clip-padding" style={{ 
                            WebkitMaskImage: 'linear-gradient(transparent 0%, black 25%, black 75%, transparent 100%)',
                            maskImage: 'linear-gradient(transparent 0%, black 25%, black 75%, transparent 100%)'
                        }} />
                    </div>

                    {/* Counter-rotating ring */}
                    <div className="absolute inset-0 -m-4">
                        <div className="w-full h-full border border-purple-500/20 rounded-full animate-spin-reverse-slow" />
                    </div>
                    
                    {/* Avatar container */}
                    <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-purple-500/20 shadow-2xl shadow-purple-500/30 group">
                        {/* Image */}
                        <img 
                            src={botProfilePicture} 
                            alt={botName} 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                        />
                        
                        {/* Gradient overlays */}
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-purple-900/30" />
                        <div className="absolute inset-0 bg-gradient-to-tr from-purple-600/10 via-transparent to-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        
                        {/* Speaking indicator */}
                        {isSpeaking && (
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                                <div className="w-1.5 h-8 bg-gradient-to-t from-purple-500 to-blue-500 rounded-full animate-sound-wave" />
                                <div className="w-1.5 h-10 bg-gradient-to-t from-purple-500 to-blue-500 rounded-full animate-sound-wave" style={{ animationDelay: '0.1s' }} />
                                <div className="w-1.5 h-6 bg-gradient-to-t from-purple-500 to-blue-500 rounded-full animate-sound-wave" style={{ animationDelay: '0.2s' }} />
                                <div className="w-1.5 h-9 bg-gradient-to-t from-purple-500 to-blue-500 rounded-full animate-sound-wave" style={{ animationDelay: '0.3s' }} />
                                <div className="w-1.5 h-7 bg-gradient-to-t from-purple-500 to-blue-500 rounded-full animate-sound-wave" style={{ animationDelay: '0.4s' }} />
                            </div>
                        )}
                    </div>

                    {/* Floating accent dots */}
                    <div className="absolute -top-2 -right-2 w-4 h-4 bg-purple-500 rounded-full animate-bounce-slow shadow-lg shadow-purple-500/50" />
                    <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-blue-500 rounded-full animate-bounce-slower shadow-lg shadow-blue-500/50" />
                </div>
                
                {/* Message display with glassmorphism */}
                <div className="w-full lg:flex-1 max-w-3xl">
                    <div className="relative bg-gradient-to-br from-gray-900/40 via-gray-800/30 to-gray-900/40 backdrop-blur-2xl rounded-3xl p-8 shadow-2xl border border-purple-500/20 overflow-hidden group hover:border-purple-500/30 transition-all duration-500">
                        {/* Top accent line */}
                        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
                        
                        {/* Corner accents */}
                        <div className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-br from-purple-500/10 to-transparent rounded-br-full" />
                        <div className="absolute bottom-0 right-0 w-20 h-20 bg-gradient-to-tl from-blue-500/10 to-transparent rounded-tl-full" />
                        
                        {/* Header */}
                        <div className="flex items-center gap-3 mb-6">
                            <div className="relative">
                                <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full animate-pulse-gentle" />
                                <div className="absolute inset-0 w-3 h-3 bg-purple-500 rounded-full animate-ping" />
                            </div>
                            <h2 className="font-semibold text-xl text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-violet-400 to-blue-400">
                                {botName || "Historical Figure"}
                            </h2>
                            <div className="ml-auto flex gap-1">
                                <div className="w-1.5 h-1.5 rounded-full bg-purple-500/40" />
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500/40" />
                                <div className="w-1.5 h-1.5 rounded-full bg-violet-500/40" />
                            </div>
                        </div>
                        
                        {/* Message content */}
                        <div className="relative bg-black/30 backdrop-blur-sm rounded-2xl p-6 max-h-64 overflow-y-auto custom-scrollbar border border-purple-500/10">
                            {/* Inner glow */}
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-blue-500/5 rounded-2xl pointer-events-none" />
                            
                            {currentBotMessage ? (
                                <p className="text-gray-200 leading-relaxed text-lg relative z-10">
                                    {currentBotMessage}
                                </p>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                                    <svg className="w-12 h-12 mb-3 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                    </svg>
                                    <p className="italic">Awaiting your first message...</p>
                                </div>
                            )}
                        </div>
                        
                        {/* Decorative bottom line */}
                        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
                    </div>
                </div>
            </div>

            {/* Message history */}
            <div className="flex-1 overflow-y-auto px-4 lg:px-8 pb-4 max-h-48 relative z-10">
                <div className="max-w-5xl mx-auto space-y-4" ref={messageWrapperRef}>
                    {messages.map((message, index) => (
                        <div 
                            key={message.id} 
                            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} animate-slide-up`}
                            style={{ animationDelay: `${index * 0.05}s` }}
                        >
                            <div className={`max-w-[75%] rounded-2xl p-4 backdrop-blur-xl relative group ${
                                message.sender === 'user' 
                                    ? 'bg-gradient-to-br from-purple-600/90 via-purple-500/80 to-blue-600/90 text-white shadow-xl shadow-purple-500/30 border border-purple-400/20' 
                                    : 'bg-gray-900/60 text-gray-200 border border-gray-700/40 shadow-lg'
                            }`}>
                                {/* Message accent */}
                                <div className={`absolute top-0 left-0 w-1 h-full rounded-l-2xl ${
                                    message.sender === 'user' ? 'bg-gradient-to-b from-white/40 to-transparent' : 'bg-gradient-to-b from-purple-500/40 to-transparent'
                                }`} />
                                
                                <p className="leading-relaxed relative z-10">
                                    {message.sender === 'user' ? message.message : message.reply}
                                </p>
                                
                                {message.pendingReply && (
                                    <div className="flex gap-2 mt-4 justify-center">
                                        <div className="w-2.5 h-2.5 bg-purple-400 rounded-full animate-bounce-delay-0" />
                                        <div className="w-2.5 h-2.5 bg-purple-400 rounded-full animate-bounce-delay-1" />
                                        <div className="w-2.5 h-2.5 bg-purple-400 rounded-full animate-bounce-delay-2" />
                                    </div>
                                )}
                                
                                {/* Hover effect */}
                                <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                                    message.sender === 'user' 
                                        ? 'bg-gradient-to-br from-white/10 to-transparent' 
                                        : 'bg-gradient-to-br from-purple-500/10 to-transparent'
                                }`} />
                            </div>
                        </div>
                    ))}
                    <div ref={endOfMessagesRef} />
                </div>
            </div>
            
            {/* Input section */}
            <div className="border-t border-purple-500/20 bg-black/60 backdrop-blur-2xl px-4 lg:px-8 py-6 relative z-10">
                <div className="max-w-5xl mx-auto">
                    {/* Suggested prompts */}
                    <div className="flex flex-wrap gap-3 mb-6">
                        {[
                            { text: "Where were you born", icon: "📍" },
                            { text: "Who were your siblings", icon: "👥" },
                            { text: "What was your best moment in life", icon: "✨" },
                            { text: "What are you famous for", icon: "🏆" }
                        ].map((prompt, i) => (
                            <button 
                                key={i}
                                onClick={() => onSuggestedClick(prompt.text)} 
                                className="group px-5 py-2.5 text-sm bg-gradient-to-br from-gray-900/60 to-gray-800/60 hover:from-purple-900/50 hover:to-blue-900/50 rounded-full text-gray-400 hover:text-white transition-all duration-300 border border-purple-500/20 hover:border-purple-500/50 backdrop-blur-sm hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20 flex items-center gap-2"
                            >
                                <span className="group-hover:scale-110 transition-transform duration-300">{prompt.icon}</span>
                                <span>{prompt.text}</span>
                            </button>
                        ))}
                    </div>
                    
                    {/* Input form */}
                    <div className="relative" ref={messageInputContainerRef}>
                        <form ref={formRef} onSubmit={handleSendMessage} className="relative">
                            <div className="relative rounded-3xl bg-gradient-to-br from-gray-900/80 via-gray-800/70 to-gray-900/80 backdrop-blur-2xl border-2 border-purple-500/20 focus-within:border-purple-500/50 focus-within:shadow-lg focus-within:shadow-purple-500/20 transition-all duration-300 overflow-hidden group">
                                {/* Top shimmer */}
                                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-400/60 to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity duration-300" />
                                
                                {/* Animated gradient background */}
                                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 via-blue-600/5 to-violet-600/5 opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
                                
                                <textarea
                                    inputMode="text"
                                    ref={textareaRef}
                                    onChange={handleInputChange}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Share your thoughts..."
                                    value={display}
                                    disabled={sendingMessage}
                                    className="w-full bg-transparent px-6 py-5 pr-20 resize-none focus:outline-none text-gray-200 placeholder-gray-500 disabled:opacity-70 relative z-10"
                                    rows="1"
                                    style={{ overflow: 'auto' }}
                                />
                                
                                {/* Send button */}
                                <button 
                                    type="submit" 
                                    className={`absolute right-3 bottom-3 p-3.5 rounded-2xl transition-all duration-300 group ${
                                        !input.trim() || sendingMessage
                                            ? 'bg-gray-800/60 text-gray-600 cursor-not-allowed'
                                            : 'bg-gradient-to-br from-purple-600 via-violet-600 to-blue-600 hover:from-purple-500 hover:via-violet-500 hover:to-blue-500 text-white shadow-xl shadow-purple-500/40 hover:scale-110 hover:rotate-12'
                                    }`}
                                    disabled={!input.trim() || sendingMessage}
                                >
                                    {sendingMessage ? (
                                        <div className="relative">
                                            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                        </div>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transition-transform duration-300 group-hover:translate-y-[-2px]" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </form>
                        
                        {/* Footer text */}
                        <p className="text-xs text-gray-600 mt-3 text-center flex items-center justify-center gap-2">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                            This character may provide historically inaccurate information
                        </p>
                    </div>
                </div>
            </div>

            {/* Sidebar */}
            {isSidebarVisible && (
                <>
                    {/* Backdrop */}
                    <div 
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 animate-fade-in"
                        onClick={toggleSidebar}
                    />
                    
                    {/* Sidebar panel */}
                    <div className="fixed inset-y-0 left-0 w-80 bg-gradient-to-br from-gray-900/95 via-gray-800/95 to-gray-900/95 backdrop-blur-2xl shadow-2xl z-40 border-r border-purple-500/20 animate-slide-in-left">
                        <button 
                            onClick={toggleSidebar} 
                            className="absolute top-6 right-6 p-2.5 rounded-xl hover:bg-purple-900/40 focus:outline-none text-gray-400 hover:text-white transition-all duration-300 hover:rotate-90 group"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        <Sidebar />
                    </div>
                </>
            )}

            {/* Enhanced CSS animations */}
            <style jsx>{`
                @keyframes float-slow {
                    0%, 100% { 
                        transform: translate(0, 0) rotate(0deg);
                    }
                    25% { 
                        transform: translate(30px, -30px) rotate(5deg);
                    }
                    50% { 
                        transform: translate(-20px, 30px) rotate(-5deg);
                    }
                    75% { 
                        transform: translate(20px, 20px) rotate(3deg);
                    }
                }

                @keyframes float-slower {
                    0%, 100% { 
                        transform: translate(0, 0) rotate(0deg) scale(1);
                    }
                    33% { 
                        transform: translate(-40px, 40px) rotate(-7deg) scale(1.05);
                    }
                    66% { 
                        transform: translate(40px, -20px) rotate(7deg) scale(0.95);
                    }
                }

                @keyframes pulse-gentle {
                    0%, 100% { 
                        opacity: 0.4;
                        transform: scale(1);
                    }
                    50% { 
                        opacity: 0.8;
                        transform: scale(1.05);
                    }
                }

                @keyframes spin-very-slow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }

                @keyframes spin-reverse-slow {
                    from { transform: rotate(360deg); }
                    to { transform: rotate(0deg); }
                }

                @keyframes slide-up {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes sound-wave {
                    0%, 100% { 
                        height: 1.5rem;
                        opacity: 0.6;
                    }
                    50% { 
                        height: 2.5rem;
                        opacity: 1;
                    }
                }

                @keyframes bounce-slow {
                    0%, 100% { 
                        transform: translateY(0);
                    }
                    50% { 
                        transform: translateY(-10px);
                    }
                }

                @keyframes bounce-slower {
                    0%, 100% { 
                        transform: translateY(0);
                    }
                    50% { 
                        transform: translateY(-15px);
                    }
                }

                @keyframes float-particle-1 {
                    0%, 100% { 
                        transform: translate(0, 0);
                        opacity: 0.3;
                    }
                    50% { 
                        transform: translate(-30px, -40px);
                        opacity: 0.7;
                    }
                }

                @keyframes float-particle-2 {
                    0%, 100% { 
                        transform: translate(0, 0);
                        opacity: 0.4;
                    }
                    50% { 
                        transform: translate(40px, -30px);
                        opacity: 0.8;
                    }
                }

                @keyframes float-particle-3 {
                    0%, 100% { 
                        transform: translate(0, 0);
                        opacity: 0.3;
                    }
                    50% { 
                        transform: translate(-25px, 35px);
                        opacity: 0.6;
                    }
                }

                @keyframes float-particle-4 {
                    0%, 100% { 
                        transform: translate(0, 0);
                        opacity: 0.5;
                    }
                    50% { 
                        transform: translate(35px, -25px);
                        opacity: 0.9;
                    }
                }

                @keyframes fade-in {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                @keyframes slide-in-left {
                    from { 
                        transform: translateX(-100%);
                        opacity: 0;
                    }
                    to { 
                        transform: translateX(0);
                        opacity: 1;
                    }
                }

                @keyframes spin-reverse {
                    from { transform: rotate(360deg); }
                    to { transform: rotate(0deg); }
                }

                .animate-float-slow {
                    animation: float-slow 25s ease-in-out infinite;
                }

                .animate-float-slower {
                    animation: float-slower 30s ease-in-out infinite;
                }

                .animate-pulse-gentle {
                    animation: pulse-gentle 6s ease-in-out infinite;
                }

                .animate-spin-very-slow {
                    animation: spin-very-slow 30s linear infinite;
                }

                .animate-spin-reverse-slow {
                    animation: spin-reverse-slow 25s linear infinite;
                }

                .animate-slide-up {
                    animation: slide-up 0.4s ease-out forwards;
                }

                .animate-sound-wave {
                    animation: sound-wave 0.8s ease-in-out infinite;
                }

                .animate-bounce-slow {
                    animation: bounce-slow 3s ease-in-out infinite;
                }

                .animate-bounce-slower {
                    animation: bounce-slower 4s ease-in-out infinite;
                }

                .animate-float-particle-1 {
                    animation: float-particle-1 20s ease-in-out infinite;
                }

                .animate-float-particle-2 {
                    animation: float-particle-2 18s ease-in-out infinite;
                }

                .animate-float-particle-3 {
                    animation: float-particle-3 22s ease-in-out infinite;
                }

                .animate-float-particle-4 {
                    animation: float-particle-4 19s ease-in-out infinite;
                }

                .animate-fade-in {
                    animation: fade-in 0.3s ease-out;
                }

                .animate-slide-in-left {
                    animation: slide-in-left 0.3s ease-out;
                }

                .animate-spin-reverse {
                    animation: spin-reverse 1s linear infinite;
                }

                .animate-bounce-delay-0 {
                    animation: bounce 1s infinite;
                }

                .animate-bounce-delay-1 {
                    animation: bounce 1s infinite 0.2s;
                }

                .animate-bounce-delay-2 {
                    animation: bounce 1s infinite 0.4s;
                }

                /* Custom scrollbar */
                .custom-scrollbar::-webkit-scrollbar {
                    width: 8px;
                }

                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(0, 0, 0, 0.2);
                    border-radius: 10px;
                }

                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: linear-gradient(to bottom, rgba(168, 85, 247, 0.5), rgba(59, 130, 246, 0.5));
                    border-radius: 10px;
                    border: 2px solid transparent;
                    background-clip: padding-box;
                }

                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: linear-gradient(to bottom, rgba(168, 85, 247, 0.8), rgba(59, 130, 246, 0.8));
                    background-clip: padding-box;
                }
            `}</style>
        </div>
    );
}

export default ChatWindow;