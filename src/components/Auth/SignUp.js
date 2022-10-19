import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useToast } from "@chakra-ui/react";
import { useHistory } from "react-router-dom";
import ApiHandle from "../../Utils/ApiHandle";
import { SIGNUP } from "../../Utils/ApiConstants";

const SignUp = () => {
  let formDetails = {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    pic: "",
  };
  const toast = useToast();
  const [userDetails, setUserDetails] = useState(formDetails);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (name === "pic") {
      setUserDetails({
        ...userDetails,
        [name]: e.target.files[0],
      });
    }
  };
  const handleClick = () => {
    setShow(!show);
  };

  const postDetails = (pics) => {
    setLoading(true);
    if (pics === undefined) {
      toast({
        title: "Please Select an Image.",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    console.log(pics, "pics");
    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "chat-app");
      data.append("cloud_name", "dxjxsvko5");

      fetch("https://api.cloudinary.com/v1_1/dxjxsvko5/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => {
          res.json().then((data) => {
            console.log(data, "data");
            setUserDetails((prev) => ({
              ...prev,
              ["pic"]: data?.url?.toString(),
            }));
            setLoading(false);
          });
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    } else {
      toast({
        title: "Please Select an Image.",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }
  };

  const handleLoader = () => {
    setLoading((prev) => !prev);
  };
  const submitHandler = async (e) => {
    e.preventDefault();
    const { name, email, password, confirmPassword } = userDetails;
    if (!name || !email || !password || !confirmPassword) {
      toast({
        title: "Please Fill all the Fields.",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      // setLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      toast({
        title: "Passwords do not Match.",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }
    const resp = await ApiHandle(
      SIGNUP,
      userDetails,
      "POST",
      handleLoader,
      toast
    );
    if (resp.statusCode === 201) {
      console.log(resp.responsePayload, "kdjhgkdbgkjb");
      toast({
        title: "User Registered Successfully!.",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
      localStorage.setItem("userInfo", JSON.stringify(resp.responsePayload));
      history.push("/chats");
    }
  };
  return (
    <VStack spacing="5px">
      <FormControl id="first-name" isRequired>
        <FormLabel>Name</FormLabel>
        <Input
          type={"text"}
          placeholder="Enter your Name"
          name="name"
          value={userDetails.name}
          onChange={(e) => handleChange(e)}
        />
      </FormControl>
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
      <FormControl id="confirm-password" isRequired>
        <FormLabel>Confirm Password</FormLabel>
        <InputGroup>
          <Input
            type={show ? "text" : "password"}
            placeholder="Confirm password"
            name="confirmPassword"
            value={userDetails.confirmPassword}
            onChange={(e) => handleChange(e)}
          />
          {console.log(userDetails.pic, "......")}
          <InputRightElement width={"4.5rem"}>
            <Button h="1.75rem" size="sm" onClick={handleClick}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl id="pic" isRequired>
        <FormLabel>Profile Pic</FormLabel>
        <InputGroup>
          <Input
            type="file"
            p={1.5}
            name="pic"
            accept="image/*"
            onChange={(e) => postDetails(e.target.files[0])}
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
        Sign up
      </Button>
      {console.log(userDetails)}
    </VStack>
  );
};

export default SignUp;
