import React from 'react';
import './botCard.css'; // Import the updated CSS
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { collection, query, where, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';

function BotCard({ person, index, delay }) {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();

  const onClick = async (botid) => {
    if (!user) {
      navigate(`/chat/${botid}`);
    } else {
      try {
        const previousChatsRef = collection(db, 'users', user.uid, 'previousChats');
        const q = query(previousChatsRef, where('character', '==', botid));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          await addDoc(previousChatsRef, {
            img: person.img,
            name: person.name,
            character: botid,
            timestamp: serverTimestamp()
          });
          navigate(`/chat/${botid}`);
        } else {
          navigate(`/chat/${botid}`);
        }
      } catch (error) {
        console.error("Error checking or adding document: ", error);
      }
    }
  };

  return (
    <div className="bot-card" style={{ "--delay": delay }}>
      <div className="person-container">
        <div className="content-container">
          {person.img && (
            <img
              className="person-image-container"
              src={person.img}
              alt={`${person.name} image`}
              loading='lazy'
            />
          )}
          <div className="information-container">
            <h2 className="person-name">{person.name}</h2>
            <p className="person-description">{person.description}</p>
          </div>
        </div>
        <div className="button-container">
          <button className="chat-with-button" onClick={() => onClick(person.id)}>Chat with</button>
        </div>
      </div>
    </div>
  );
}

export default BotCard;
