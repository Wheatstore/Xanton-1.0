import React from 'react';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../../../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { collection, query, where, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';

function BotCard({ person, index }) {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();

  const onClick = async (botid) => {
    if (!user) {
      navigate(`/signup`);
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
          navigate(`/chat/${botid}/${person.name}`);
        } else {
          navigate(`/chat/${botid}/${person.name}`);
        }
      } catch (error) {
        console.error("Error checking or adding document: ", error);
      }
    }
  };

  return (
    <div className="border border-gray-800 bg-gray-790 p-4 flex flex-col h-full rounded-3xl shadow-md text-left transition-all duration-500 ease-in-out hover:-translate-y-2 hover:shadow-lg">
      <div className="flex flex-col h-full ml-1">
        {person.img && (
          <img
            className="w-full rounded-2xl mb-2"
            src={person.img}
            alt={`${person.name} image`}
            loading='lazy'
          />
        )}
        <div>
          <h2 className="mt-1 mb-0 break-words text-gray-300 leading-tight">{person.name}</h2>
          <p className="mt-1 mb-10 w-full break-words overflow-visible font-medium font-sans text-gray-400 text-lg tracking-tight leading-relaxed text-left">
            {person.description}
          </p>
        </div>
      </div>
      <div>
        <button 
          className="bg-blue-600 rounded-3xl border-0 w-24 h-12 font-sans text-sm text-white font-medium transition-all duration-500 ease-in-out hover:scale-110 hover:bg-blue-700" 
          onClick={() => onClick(person.id)}
        >
          Chat with
        </button>
      </div>
    </div>
  );
}

export default BotCard;