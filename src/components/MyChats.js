import { AddIcon } from "@chakra-ui/icons";
import { Box, Stack, Text } from "@chakra-ui/layout";
import { useToast } from "@chakra-ui/toast";
import { useEffect, useState } from "react";
import ChatLoading from "./ChatLoading";
import { Button } from "@chakra-ui/react";
import { ChatState } from "../Context/ChatProvider";
import { getSender } from "./config/ChatLogics";
import GroupChatModal from "./miscellaneous/GroupChatModal";
import ApiHandle from "../Utils/ApiHandle";
import { FETCH_CHAT } from "../Utils/ApiConstants";

const MyChats = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState();
  const [loading, setLoading] = useState(false);
  const { selectedChat, setSelectedChat, user, chats, setChats,setUser } = ChatState();

  const toast = useToast();

  useEffect(() => {
    let userInfo;
    if (localStorage.getItem("userInfo") !== undefined) {
      userInfo = JSON.parse(localStorage.getItem("userInfo"));
    }
    console.log(userInfo, "userinfo");
    if (userInfo) setUser(userInfo);
  }, [user?._id]);

  const handleLoader = () => {
    setLoading((prev) => !prev);
  };
  const fetchChats = async () => {
    if (user?.token) {
      const resp = await ApiHandle(FETCH_CHAT, {}, "GET", handleLoader, toast);
      if (resp.statusCode === 200) {
        setChats(resp?.responsePayload);
      }
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
    // eslint-disable-next-line
  }, [fetchAgain, user?.token]);

  return (
    <>
      <Box
        display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
        flexDir="column"
        alignItems="center"
        p={3}
        bg="white"
        w={{ base: "100%", md: "31%" }}
        borderRadius="lg"
        borderWidth="1px"
      >
        <Box
          pb={3}
          px={3}
          fontSize={{ base: "28px", md: "30px" }}
          fontFamily="Work sans"
          display="flex"
          w="100%"
          justifyContent="space-between"
          alignItems="center"
        >
          My Chats
          <GroupChatModal>
            <Button
              display="flex"
              fontSize={{ base: "17px", md: "10px", lg: "17px" }}
              rightIcon={<AddIcon />}
              cursor="pointer"
            >
              New Group Chat
            </Button>
          </GroupChatModal>
        </Box>
        <Box
          d="flex"
          flexDir="column"
          p={3}
          bg="#F8F8F8"
          w="100%"
          // h="100%"
          borderRadius="lg"
          overflowY="hidden"
        >
          {loading ? (
            <ChatLoading />
          ) : (
            chats.length > 0 && (
              <Stack overflowY="scroll">
                {chats.map((chat) => (
                  <Box
                    onClick={() => setSelectedChat(chat)}
                    cursor="pointer"
                    bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                    color={selectedChat === chat ? "white" : "black"}
                    px={3}
                    py={2}
                    borderRadius="lg"
                    key={chat._id}
                  >
                    <Text>
                      {!chat.isGroupChat
                        ? getSender(loggedUser, chat.users)
                        : chat.chatName}
                    </Text>
                    {console.log(chat, "chat")}
                    {chat?.latestMessage.length > 0 && (
                      <Text fontSize="xs">
                        <b>{chat.latestMessage[0].sender.name} : </b>
                        {chat.latestMessage[0].content.length > 50
                          ? chat.latestMessage[0].content.substring(0, 51) +
                            "..."
                          : chat.latestMessage[0].content}
                      </Text>
                    )}
                  </Box>
                ))}
              </Stack>
            )
          )}
        </Box>
      </Box>
    </>
  );
};

export default MyChats;
