import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Input,
  Heading,
  Box,
  Button,
  Stack,
  StackDivider,
  Text,
  Flex,
  Alert,
  Textarea,
} from "@chakra-ui/react";
import axios from "axios";
import Cookies from "universal-cookie";
import { useToast } from "@chakra-ui/react";

const GroupID = ({ifTest}) => {
  const cookies = new Cookies();
  const toast = useToast();
  const token = cookies.get("TOKEN");
  const { id } = useParams();
  const [message, setMessage] = useState("");
  const [content, setContent] = useState([]);

  const sendM = async () => {
    try {
      if (message == "") {
        alert("Enter message");
        return;
      }
      const response = await axios
        .post("http://localhost:8000/api/v1/groups/messages/new-message", {
          GroupID: id,
          message: message,
          userID: token.user._id,
        })
        .catch((error) => console.log(error));
      // console.log(response.status);

      setMessage("");
      toast({
        title: "Message Sent!",
        // description: "We've created your account for you.",
        position: "top-right",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
      fetchM();
    } catch (error) {
      console.log(error);
      toast({
        title: error,
        // description: "We've created your account for you.",
        position: "top-right",
        status: "success",
        duration: 2000,
        isClosable: true,
      });

      setMessage("");
    }
  };

  const fetchM = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/groups/messages/get-message",
        { GroupID: id }
      );
      setContent(response.data);
      // console.log(response.data);
    } catch (error) {
      console.log(error);
      toast({
        title: error.response.data.message,
        // description: "We've created your account for you.",
        position: "top-right",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    fetchM();
  }, []);

  return (
    <>
        
      <Stack m="10px" w="800px" divider={<StackDivider />}>
      {!ifTest && <Flex direction="column" gap="10px" m="10px">
          <Text fontSize="2xl">Notes Pane</Text>
        </Flex>}
        <Box>
          <Card>
            {/* <CardHeader>
                            <Heading size='md'>Send a message!</Heading>
                        </CardHeader> */}
            <CardBody>
              <Textarea
                placeholder="Write a note!"
                resize="none"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault(); 
                    sendM();
                  } else if (e.key === "Enter" && e.shiftKey) {
                    setMessage(message); 
                  }
                }}
              />
            </CardBody>
            <Button onClick={sendM}>Save Note</Button>
          </Card>
        </Box>
        {/* <Box>{content}</Box> */}
        <Box>
          <Flex direction="column" gap="10px">
            {content.map((ele, index) => (
              <Card key={index}>
                <CardBody>
                  <Text fontSize="xl">{ele.content}</Text>
                </CardBody>
              </Card>
            ))}
          </Flex>
        </Box>
      </Stack>
    </>
  );
};

export default GroupID;
