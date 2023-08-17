import { createContext, useContext, useEffect, useState } from "react";
const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const [user, setUser] = useState({});
  const [selectedChat, setSelectedChat] = useState();
  const [chats, setChats] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [isThreadCreated,setisThreadCreated] = useState(null)
  const [threadId,setThreadId] = useState("")

  return (
    <ChatContext.Provider
      value={{
        user,
        setUser,
        setSelectedChat,
        chats,
        setChats,
        selectedChat,
        notifications,
        setNotifications,
        setisThreadCreated,
        isThreadCreated,
        threadId,
        setThreadId
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const ChatState = () => {
  return useContext(ChatContext);
};
export default ChatProvider;
