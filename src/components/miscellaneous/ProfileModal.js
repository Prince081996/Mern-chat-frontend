import {
  IconButton,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Image,
  Text,
} from "@chakra-ui/react";
import React from "react";
import { ViewIcon,PhoneIcon } from "@chakra-ui/icons";
import { ChatState } from "../../Context/ChatProvider";
import {useHistory} from "react-router-dom"

const ProfileModal = ({socket, user, children,loggedInUser }) => {
  const {selectedChat} = ChatState()
  const history = useHistory()
  let payload = {
    loggedInUser,
    selectedChat
  }
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
                      <IconButton
          display={{ base: "flex" }}
          icon={<PhoneIcon />}
          onClick={() => { 
          socket.emit("calling",payload)
            history.push("/call")
          }
          }
        />
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <div style={{display:"flex"}}>
        <IconButton
          display={{ base: "flex" }}
          icon={<ViewIcon />}
          onClick={onOpen}
        />
        </div>
      )}

      <Modal size="lg" isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent h="410px">
          <ModalHeader
            fontSize="40px"
            fontFamily="Work sans"
            display="flex"
            justifyContent="center"
          >
            {user?.name}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            display="flex"
            flexDir="column"
            justifyContent="space-between"
            alignItems="center"
          >
            <Image
              borderRadius="full"
              boxSize="150px"
              src={user.pic}
              alt={user.name}
            />
            <Text
              fontSize={{ base: "28px", md: "30px" }}
              fontFamily="Work sans"
              p={2}
            >
              Email: {user.email}
            </Text>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProfileModal;
