import React, { useState } from 'react';
import "./chat.css"
import { Sidebar, ChatWindow } from '../../components/chat-interface/chatExport';

function Chat(){
  return (
    <>
    <div className="chat-page-container">
        <div className="sidebar-chat-page-container">
          <Sidebar />
        </div>
        <div className="user-interface-chat-container">
          <ChatWindow />
        </div>
    </div>
    </>
  )
};

export default Chat;
