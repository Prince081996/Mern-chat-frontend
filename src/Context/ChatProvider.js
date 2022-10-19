import { createContext, useContext, useEffect, useState } from "react";
const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const [user, setUser] = useState({});
  const [selectedChat, setSelectedChat] = useState();
  const [chats, setChats] = useState([]);
  const [notifications, setNotifications] = useState([]);
  useEffect(() => {
    let userInfo;
    if (localStorage.getItem("userInfo") !== undefined) {
      userInfo = JSON.parse(localStorage.getItem("userInfo"));
    }
    console.log(userInfo, "userinfo");
    if (userInfo) setUser(userInfo);
  }, [user?._id]);
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
