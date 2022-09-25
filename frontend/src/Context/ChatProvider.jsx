import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const [selectedChat, setSelectedChat] = useState(null);
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const [user, setUser] = useState(userInfo);
  const [reloadChats, setReloadChats] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [chats, setChats] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);


  const navigate = useNavigate();




  return (
    <ChatContext.Provider
    value={{user, setUser, selectedChat, setSelectedChat, chats, setChats, reloadChats, setReloadChats,notifications, setNotifications,onlineUsers, setOnlineUsers}}>
      {children}
    </ChatContext.Provider>
  );
};

export const ChatState = () => {
  return useContext(ChatContext);
};

export default ChatProvider;
