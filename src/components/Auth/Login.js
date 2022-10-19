import React, { useState } from "react";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
} from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import { useHistory } from "react-router-dom";
import { ChatState } from "../../Context/ChatProvider";
import ApiHandle from "../../Utils/ApiHandle";
import { LOGIN } from "../../Utils/ApiConstants";

const Login = () => {
  let formDetails = {
    email: "",
    password: "",
  };
  const [userDetails, setUserDetails] = useState(formDetails);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const { setUser } = ChatState();
  const history = useHistory();

  const handleLoader = () => {
    setLoading((prev) => !prev);
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleClick = () => {
    setShow(!show);
  };
  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { email, password } = userDetails;
    if (!email || !password) {
      toast({
        title: "Please Fill all the Fields.",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }

    const resp = await ApiHandle(
      LOGIN,
      userDetails,
      "POST",
      handleLoader,
      toast
    );
    if (resp.statusCode === 200) {
      toast({
        title: "Login Successfully!.",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      const data = resp.responsePayload;
      let stringifyData = JSON.stringify(data);
      setUser(data);
      localStorage.setItem("userInfo", stringifyData);
      setLoading(false);
      history.push("/chats");
    }
  };
  return (
    <VStack spacing="5px">
      <FormControl id="email" isRequired>
        <FormLabel>Email Address</FormLabel>
        <Input
          type="email"
          name="email"
          value={userDetails.email}
          placeholder="Enter Your Email Address"
          onChange={(e) => handleChange(e)}
        />
      </FormControl>
      <FormControl id="password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            type={show ? "text" : "password"}
            placeholder="Enter your password"
            name="password"
            value={userDetails.password}
            onChange={(e) => handleChange(e)}
          />
          <InputRightElement width={"4.5rem"}>
            <Button h="1.75rem" size="sm" onClick={handleClick}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <Button
        colorScheme="blue"
        width="100%"
        style={{ marginTop: 15 }}
        onClick={submitHandler}
        isLoading={loading}
      >
        Login
      </Button>
      <Button
        variant="solid"
        colorScheme="red"
        width="100%"
        style={{ marginTop: 15 }}
        onClick={() => {
          setUserDetails((prev) => ({
            ...prev,
            ["email"]: "guest@gmail.com",
            ["password"]: "123456",
          }));
        }}
      >
        Get Guest User Credentials
      </Button>
    </VStack>
  );
};

export default Login;
