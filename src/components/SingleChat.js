import { ArrowBackIcon } from "@chakra-ui/icons";
import {
  Box,
  FormControl,
  IconButton,
  Input,
  Spinner,
  Text,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { ChatState } from "../Context/ChatProvider";
import { getSender, getSenderFull } from "./config/ChatLogics";
import ProfileModal from "./miscellaneous/ProfileModal";
import UpdateGroupChatModal from "./miscellaneous/UpdateGroupChatModal";
import { useToast } from "@chakra-ui/react";
import "./styles.css";
import ScrollableChat from "./ScrollableChat";
import Lottie from "react-lottie";
import animationData from "../animation/typing.json";
import io from "socket.io-client";
import { JitsiMeeting } from "@jitsi/react-sdk";
import ApiHandle from "../Utils/ApiHandle";
import { FETCH_MESSAGES, SEND_MESSAGE } from "../Utils/ApiConstants";
// import { m } from "framer-motion";

const ENDPOINT = process.env.REACT_APP_BASE_API_URL;
var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const {
    user,
    selectedChat,
    setSelectedChat,
    notifications,
    setNotifications,
    setisThreadCreated,
    isThreadCreated,
    threadId,
  } = ChatState();
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState();
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const toast = useToast();

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  const handleLoader = () => {
    setLoading((prev) => !prev);
  };

  const fetchMessages = async () => {
    if (!selectedChat) return;
    const resp = await ApiHandle(
      `${FETCH_MESSAGES}${selectedChat._id}`,
      {},
      "GET",
      handleLoader,
      toast
    );
    if (resp.statusCode === 200) {
      setMessages(resp.responsePayload);
      socket.emit("join chat", selectedChat._id);
    }
  };

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  // useEffect(() => {
    if (user) {
      socket = io(ENDPOINT);
      socket.emit("setup", user);
      socket.on("connected", () => {
        setSocketConnected(true);
      });
      socket.on("typing", () => {
        setTyping(true);
      });
      socket.on("stop typing", () => {
        setTyping(false);
      });

      socket.on("message received", (newMessageReceived) => {
        if (
          !selectedChatCompare ||
          selectedChatCompare._id !== newMessageReceived.chat._id
        ) {
          if (!notifications.includes(newMessageReceived)) {
            setNotifications([...notifications, newMessageReceived]);
            setFetchAgain(!fetchAgain);
          }
          //give notification
        } else {
          console.log(messages,"messages")
            setMessages([...messages, newMessageReceived]);
          // }

        }
      });
    }
  // });

  const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessage) {
      let _user = "";
      selectedChat.users.forEach((item) => {
        if (item._id !== user._id) {
          _user = item._id;
        }
      });
      let payload = {
        content: newMessage,
        chatId: selectedChat._id,
        is_thread_created:isThreadCreated,
        thread_id:threadId
      };
      socket.emit("stop typing", _user);
      setNewMessage("");
      const resp = await ApiHandle(SEND_MESSAGE, payload, "POST", "", toast);
      if (resp.statusCode === 200) {
        socket.emit("new message", resp.responsePayload);
        setMessages([...messages, resp.responsePayload]);
      }
    }
  };
  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    //Typing Idicator logic
    if (!socketConnected) return;
    if (!typing) {
      // setTyping(true);
      console.log(selectedChat.users, user, "typing");
      let _user = "";
      selectedChat.users.forEach((item) => {
        if (item._id !== user._id) {
          _user = item._id;
        }
      });
      socket.emit("typing", _user);
    }

    let lastTypingTime = new Date().getTime();
    var timerLength = 500;
    setTimeout(() => {
      // var timeNow = new Date().getTime();
      // var timeDiff = timeNow - lastTypingTime;
      // if (timeDiff >= timerLength && typing) {
      let _user = "";
      selectedChat.users.forEach((item) => {
        if (item._id !== user._id) {
          _user = item._id;
        }
      });
      socket.emit("stop typing", _user);
      // }
    }, [timerLength]);
  };
  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="Work sans"
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />
            {!selectedChat.isGroupChat ? (
              <>
                {getSender(user, selectedChat.users)}
                {/* <JitsiMeeting
                  domain="meet.jit.si/"
                  roomName="myroom"
                  configOverwrite={{
                    startWithAudioMuted: true,
                    disableModeratorIndicator: true,
                    startScreenSharing: true,
                    enableEmailInStats: false,
                  }}
                  interfaceConfigOverwrite={{
                    DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
                  }}
                  userInfo={{
                    displayName: user?.name,
                  }}
                  getIFrameRef={(iframeRef) => {
                    iframeRef.style.height = "400px";
                  }}
                /> */}
                <ProfileModal loggedInUser={user} socket={socket} user={getSenderFull(user, selectedChat.users)} />
              </>
            ) : (
              <>
                {selectedChat.chatName.toUpperCase()}
                {
                  <UpdateGroupChatModal
                    fetchAgain={fetchAgain}
                    setFetchAgain={setFetchAgain}
                    fetchMessages={fetchMessages}
                  />
                }
              </>
            )}
          </Text>
          <Box
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg="#E8E8E8"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
          >
            {/* {Messgae Here} */}
            {loading ? (
              <Spinner
                size="xl"
                w={20}
                h={20}
                alignSelf="center"
                margin="auto"
              />
            ) : (
              <div className="messages">
                {/* {Messages} */}
                <ScrollableChat messages={messages} />
              </div>
            )}
            <FormControl onKeyDown={sendMessage} isRequired mt={3}>
              {typing ? (
                <div>
                  {" "}
                  <Lottie
                    options={defaultOptions}
                    // height={50}
                    width={70}
                    style={{ marginBottom: 15, marginLeft: 0 }}
                  />
                </div>
              ) : (
                <></>
              )}
              <Input
                variant="filled"
                bg="#E0E0E0"
                placeholder="Enter a Message"
                onChange={typingHandler}
                value={newMessage}
              />
            </FormControl>
          </Box>
        </>
      ) : (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          h="100%"
        >
          <Text fontSize="3xl" pb={3} fontFamily="Work sans">
            Click on a user to Start Chatting
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
