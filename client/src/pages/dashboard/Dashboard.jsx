import { chakra, Box, Wrap, WrapItem } from "@chakra-ui/react";
import {
  Card,
  CardBody,
  Flex,
  Stack,
  VStack,
  Heading,
  Text,
  Divider,
  CardFooter,
  Button,
  ButtonGroup,
} from "@chakra-ui/react";
import Navbar from "../../components/Navbar";
import Cookies from "universal-cookie";
import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { ArrowUpIcon, ArrowDownIcon } from "@chakra-ui/icons";

export default function Dashboard() {
  const cookies = new Cookies();
  const [userPapers, setUserPapers] = useState([]);
  const [allPapers, setAllPapers] = useState([]);
  const token = cookies.get("TOKEN");
  const toast = useToast();

  const navigate = useNavigate();

  const paperAttempt = (testId) => {
    console.log(testId._id);
    navigate(`/attempt/${testId._id}`);
  }

  const fetchUserPapers = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/v1/papers/getPapers/" + token.user._id
      );
      setUserPapers(response.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const fetchPapers = async () => {
    try {
        console.log("fetching...")
      const response = await axios.get(
        "http://localhost:8000/api/v1/papers/getAllPapers/"+ token.user._id
      );
      setAllPapers(response.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const checkifMember = async (grpID) => {
    try {
        navigate(`/app/groups/${grpID}`);
        if (grpID == undefined) return false;
      const value = await axios.post(
        "http://localhost:8000/api/v1/groups/check-members",
        { GroupID: grpID, userID: token.user._id }
      );
      if (value.data) {
        navigate(`/app/groups/${grpID}`);
      } else {
        toast({
          title: "Paper not attempted. Cannot discuss",
          position: "top-left",
          status: "error",
          duration: 1000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Error:", error);
      return false;
    }
  };

  const handleLike = async (paperId) => {
    try {
      console.log("hi");
      await axios.put(
        `http://localhost:8000/api/v1/papers/updateLikes/${paperId}?userId=${token.user._id}`
      );
      fetchPapers();
      fetchUserPapers();
      console.log("done");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleDislike = async (paperId) => {
    try {
      await axios.put(
        `http://localhost:8000/api/v1/papers/updateDislikes/${paperId}?userId=${token.user._id}`
      );
      fetchPapers();
      fetchUserPapers();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    fetchPapers();
    fetchUserPapers();
  }, []);

  return (
    <>
      <Box p="4" flex={1}>
        <Tabs>
          <TabList>
            <Tab>Shared</Tab>
            <Tab>Owned</Tab>
            <Tab>Bookmarked</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Wrap spacing="15px" justify="left" mt="15px">
                {allPapers.map((paper, index) => (
                  <WrapItem key={index}>
                    <Card maxW="sm" p="8px" border="1px" borderColor="gray.300">
                      <CardBody>
                        <Stack mt="6" spacing="3">
                          <Flex direction="row" justify="space-between">
                            <Heading size="md">{paper.paperTitle}</Heading>

                          </Flex>
                          <Text color="blue.600" fontSize="2xl">
                            {paper.userId.username}
                          </Text>
                        </Stack>
                      </CardBody>
                      <Divider />
                      <CardFooter>
                        <ButtonGroup spacing="2">
                          <Button variant="solid" colorScheme="green" onClick={() => paperAttempt(paper)}>
                            Open
                          </Button>
                          <Button
                            variant="solid"
                            colorScheme="gray"
                            color="gray"
                            onClick={() => checkifMember(paper.GroupID)}
                          >
                            Notes
                          </Button>
                        </ButtonGroup>
                      </CardFooter>
                    </Card>
                  </WrapItem>
                ))}
              </Wrap>
            </TabPanel>
            <TabPanel>
              <Wrap spacing="15px" justify="left" mt="15px">
                {userPapers.map((paper, index) => (
                  <WrapItem key={index}>
                    <Card maxW="md" p="8px" border="1px" borderColor="gray.300">
                      <CardBody>
                        <Stack mt="6" spacing="3">
                          <Flex direction="row" justify="space-between">
                            <Heading size="md">{paper.paperTitle}</Heading>

                            {/* <VStack>
                              <ArrowUpIcon
                            cursor="pointer"
                                onClick={() => handleLike(paper._id)}
                                boxSize={7}
                              />
                              <Text fontSize="lg">
                                {paper.likes_users.length -
                                  paper.dislikes_users.length}
                              </Text>
                              <ArrowDownIcon
                            cursor="pointer"
                                onClick={() => handleDislike(paper._id)}
                                boxSize={7}
                              />
                            </VStack> */}
                          </Flex>
                          <Text color="blue.600" fontSize="2xl">
                            You
                          </Text>
                        </Stack>
                      </CardBody>
                      <Divider />
                      <CardFooter>
                        <ButtonGroup spacing="2">
                          <Button variant="solid" colorScheme="green" onClick={() => paperAttempt(paper)}>
                            Open
                          </Button>
                          <Button
                            variant="solid"
                            colorScheme="gray"
                            color="gray"
                            onClick={() => checkifMember(paper.GroupID)}
                          >
                            Notes
                          </Button>
                        </ButtonGroup>
                      </CardFooter>
                    </Card>
                  </WrapItem>
                ))}
              </Wrap>
            </TabPanel>
            <TabPanel>
              <Wrap spacing="15px" justify="left" mt="15px">
                {allPapers.map((paper, index) => (
                  <WrapItem key={index}>
                    <Card maxW="sm" p="8px" border="1px" borderColor="gray.300">
                      <CardBody>
                        <Stack mt="6" spacing="3">
                          <Flex direction="row" justify="space-between">
                            <Heading size="md">{paper.paperTitle}</Heading>

                          </Flex>
                          <Text color="blue.600" fontSize="2xl">
                            {paper.userId.username}
                          </Text>
                        </Stack>
                      </CardBody>
                      <Divider />
                      <CardFooter>
                        <ButtonGroup spacing="2">
                          <Button variant="solid" colorScheme="green" onClick={() => paperAttempt(paper)}>
                            Open
                          </Button>
                          <Button
                            variant="solid"
                            colorScheme="gray"
                            color="gray"
                            onClick={() => checkifMember(paper.GroupID)}
                          >
                            Notes
                          </Button>
                        </ButtonGroup>
                      </CardFooter>
                    </Card>
                  </WrapItem>
                ))}
              </Wrap>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </>
  );
}
