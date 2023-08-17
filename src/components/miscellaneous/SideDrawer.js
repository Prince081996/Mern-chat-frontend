import {
  Box,
  Button,
  Tooltip,
  Text,
  Menu,
  MenuList,
  MenuButton,
  MenuItem,
  MenuDivider,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerBody,
  Input,
  DrawerFooter,
  useDisclosure,
  DrawerHeader,
  Spinner,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { Effect } from "react-notification-badge";
import NotificationBadge from "react-notification-badge/lib/components/NotificationBadge";
import { BellFill, Search, ChevronDown } from "react-bootstrap-icons";
import { Avatar } from "@chakra-ui/react";
import { ChatState } from "../../Context/ChatProvider";
import ProfileModal from "./ProfileModal";
import { useHistory } from "react-router-dom";
import { useToast } from "@chakra-ui/react";
import ChatLoading from "../ChatLoading";
import UserListItem from "../UserAvatar/UserListItem";
import { getSender } from "../config/ChatLogics";
import ApiHandle from "../../Utils/ApiHandle";
import { ACESSS_CHAT, GET_THREAD, SEARCH_USER } from "../../Utils/ApiConstants";

const SideDrawer = () => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const history = useHistory();
  const {
    user,
    setSelectedChat,
    chats,
    setChats,
    notifications,
    setNotifications,
    setisThreadCreated
  } = ChatState();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleLoader = () => {
    setLoading((prev) => !prev);
  };

  const logOutHandler = () => {
    localStorage.removeItem("userInfo");
    history.push("/");
  };

  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "Please Enter Something in Search.",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }
    const resp = await ApiHandle(
      `${SEARCH_USER}?search=${search}`,
      {},
      "GET",
      handleLoader,
      toast
    );
    if (resp.statusCode === 200) {
      setSearchResult(resp.responsePayload);
    }
  };

  const accessChat = async (userId) => {
    const resp = await ApiHandle(
      ACESSS_CHAT,
      { userId },
      "POST",
      handleLoader,
      toast
    );
    if (resp.statusCode === 200) {
      const sender_id = resp?.responsePayload?.users.find((u) => u._id !== userId)
      console.log(sender_id,"senders")
      let params = {
        sender_id:sender_id._id,
        receiver_id:userId
      }
      const threadResp = await ApiHandle(
        GET_THREAD,
       {},
        "GET",
        handleLoader,
        toast,
        params
      )
      if(threadResp.responsePayload === 200){
        console.log(threadResp.responsePayload?.is_thread_created)
        setisThreadCreated(threadResp.responsePayload?.is_thread_created)
      }
      console.log(threadResp,"threadresp")
      if (!chats.find((c) => c._id === resp.responsePayload._id)) {
        setChats([resp.responsePayload, ...chats]);
      }
      setSelectedChat(resp.responsePayload);
      onClose();
    }
  };

  return (
    <div>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="white"
        w="100%"
        p="5px 10px 5px 10px"
        borderWidth="5px"
      >
        <Button variant="ghost" onClick={onOpen}>
          <Search />
          <Text display={{ base: "none", md: "flex" }} px="4">
            Search User
          </Text>
        </Button>
        <Text fontSize="2xl" fontFamily="work sans">
        Chit Chat
        </Text>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Menu>
            <MenuButton p={1}>
              <NotificationBadge
                count={notifications.length}
                effect={Effect.scale}
              />
              <BellFill fontSize="20px" />
            </MenuButton>
            <MenuList pl={2}>
              {!notifications.length && "No New Messages"}
              {notifications.map((notif) => (
                <MenuItem
                  key={notif._id}
                  onClick={() => {
                    setSelectedChat(notif.chat);
                    setNotifications(notifications.filter((n) => n !== notif));
                  }}
                >
                  {console.log(notifications, "notifications")}
                  {notif.chat.isGroupChat
                    ? `New Message in ${notif.chat.chatName}`
                    : `New Message from ${getSender(user, notif?.chat?.users)}`}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
          <Menu p="1">
            <MenuButton as={Button} rightIcon={<ChevronDown />}>
              <Avatar
                size="sm"
                cursor="pointer"
                name={user?.name}
                src={user?.pic}
              />
            </MenuButton>
            <MenuList>
              <ProfileModal user={user}>
                <MenuItem>My Profile</MenuItem>
              </ProfileModal>
              <MenuDivider />
              <MenuItem onClick={logOutHandler}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        // finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Create your account</DrawerHeader>

          <DrawerBody>
            <Box display="flex">
              <Input
                placeholder="Search by name or email..."
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={handleSearch}>Go</Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                />
              ))
            )}
            {loadingChat && <Spinner ml="auto" display="flex" />}
          </DrawerBody>

          <DrawerFooter>
            <Button variant="outline" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="blue">Save</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default SideDrawer;
