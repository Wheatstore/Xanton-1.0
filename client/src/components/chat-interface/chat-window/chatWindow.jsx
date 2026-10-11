import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { addDoc, collection, doc, getDoc, getDocs, onSnapshot, orderBy, query, serverTimestamp, updateDoc, where } from "firebase/firestore";
import { useArchiveAuth } from "../../../hooks/useArchiveAuth";
import { auth, db } from "../../../firebase";
import ChatWorkspace from "../ChatWorkspace";
import Sidebar from "../sidebar/sidebar";

export default function ChatWindow() {
  const params = useParams();
  const [user, authLoading] = useArchiveAuth(auth);
  const [details, setDetails] = useState({});
  const [messages, setMessages] = useState([]);
  const [loadingBot, setLoadingBot] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState("");

  useEffect(() => {
    if (authLoading) return undefined;
    let active = true;
    const load = async () => {
      try {
        if (!db) throw new Error("The archive connection is unavailable. Please try again later.");
        const direct = await getDoc(doc(db, "bots", params.id));
        let bot = direct.exists() ? { ...direct.data(), id: direct.id } : null;
        if (!bot) {
          const snapshot = await getDocs(query(collection(db, "bots"), where("id", "==", params.id)));
          if (!snapshot.empty) bot = { ...snapshot.docs[0].data(), id: snapshot.docs[0].id };
        }
        if (!active) return;
        if (!bot) throw new Error("This figure is no longer available in the collection.");
        setDetails(bot);
      } catch (error) {
        console.error("Error fetching character:", error);
        if (active) setLoadError(error.message === "This figure is no longer available in the collection." ? error.message : "The archive connection is unavailable. Please return to the collection and try again.");
      } finally { if (active) setLoadingBot(false); }
    };
    load();
    return () => { active = false; };
  }, [authLoading, params.id]);

  useEffect(() => {
    if (authLoading || !user || !db) return undefined;
    const messagesQuery = query(collection(db, "users", user.uid, "characters", params.id, "messages"), orderBy("timestamp", "asc"));
    return onSnapshot(messagesQuery, snapshot => {
      setMessages(snapshot.docs.map(item => ({ ...item.data(), id: item.id })));
      setLoadingMessages(false);
    }, error => {
      console.error("Unable to load conversation:", error);
      setLoadError("Your messages could not be loaded. Please return to the collection and try again.");
      setLoadingMessages(false);
    });
  }, [authLoading, params.id, user]);

  const sendMessage = async text => {
    if (!text.trim() || sending || !user || !db) return false;
    setSending(true); setSendError("");
    let messageDoc;
    try {
      messageDoc = await addDoc(collection(db, "users", user.uid, "characters", params.id, "messages"), {
        message: text.trim(), reply: null, sender: "user", timestamp: serverTimestamp(), pendingReply: true,
      });
      const response = await axios.post(`https://historia-backend-ycj7.onrender.com/api/chat/${encodeURIComponent(user.uid)}/${encodeURIComponent(params.id)}/${encodeURIComponent(params.name)}`, { message: text.trim(), messageId: messageDoc.id });
      // Some service responses deliver the reply through the Firestore listener.
      if (response?.data?.reply) await updateDoc(messageDoc, { reply: response.data.reply, pendingReply: false, replyError: false });
      return true;
    } catch (error) {
      console.error("Error sending message:", error);
      setSendError("The reply couldn’t be completed. Your question is ready to send again.");
      // A failed request should not leave a message displaying an endless reply spinner.
      if (messageDoc) await updateDoc(messageDoc, { pendingReply: false, replyError: true }).catch(updateError => console.error("Unable to update failed reply:", updateError));
      return false;
    } finally { setSending(false); }
  };

  if (authLoading) return <div className="route-loading" role="status">Preparing your conversation…</div>;
  const name = details.name || details.profile?.fullName || params.name || "Historical figure";
  return <ChatWorkspace details={details} name={name} image={details.img || details.image || details.profileImage} welcomeMessage={details.welcomeMessage || details.conversation?.welcomeMessage} messages={messages} loading={loadingBot || loadingMessages} loadError={loadError} sending={sending} sendError={sendError} onSend={sendMessage} navigation={<Sidebar activeCharacter={{ id: params.id, name }} />} />;
}
