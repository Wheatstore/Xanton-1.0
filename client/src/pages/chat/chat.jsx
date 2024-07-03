import React, { useState } from 'react';
import "./chat.css"
import { Sidebar, ChatWindow } from '../../components/chat-interface/chatExport';

function Chat(){
  return (
    <>
    <div className="chat-page-container">
        <Sidebar />
        <div className="user-interface-chat-container">
          <ChatWindow />
        </div>
    </div>
    </>
  )
};

export default Chat;
