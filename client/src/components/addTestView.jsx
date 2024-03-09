import React, { useRef, useState, useEffect } from "react";
import { Container, Flex, Input, InputGroup, InputLeftAddon, Box, Text, Stack, Button, ButtonGroup, Select } from '@chakra-ui/react'
import { Card, CardHeader, CardBody, CardFooter, Avatar, WrapItem } from '@chakra-ui/react'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Wrap,
    Divider,
    Switch,
    Editable,
    EditablePreview,
    EditableInput
} from '@chakra-ui/react';
import { FormControl, FormLabel } from "@chakra-ui/react";
import { useDisclosure } from '@chakra-ui/react'
import axios from "axios";
import QuestionParser from "./QuestionParser";
import Cards from "./Cards";
import Cookies from "universal-cookie";
import { useToast, Heading } from '@chakra-ui/react'
import { IconButton } from '@chakra-ui/react'
import { CheckIcon } from '@chakra-ui/icons'
import { Link } from "react-router-dom";

const AddTestView = () => {
    const { isOpen, onOpen, onClose } = useDisclosure()

    const [title, setTitle] = useState("");
    const [link, setLink] = useState("");
    const [time, setTime] = useState("");
    const [visibility, setVisibility] = useState("1");
    const [papers, setUserPapers] = useState([]);

    const initialRef = React.useRef(null)
    const finalRef = React.useRef(null)

    const [questions, setQuestions] = useState([])
    const [concatdata, setConcatData] = useState("");

    const cookies = new Cookies();
    const token = cookies.get("TOKEN");
    const toast = useToast()
    // https://ncert.nic.in/pdf/publication/exemplarproblem/classIX/science/ieep117.pdf


    const toggleSwitch = (paperId) => {
        const updatedPapers = papers.map((paper) =>
            paper._id === paperId ? { ...paper, Private: !paper.Private } : paper
        );

        setUserPapers(updatedPapers);
    };

    const updateTime = (paperId, value) => {
        // Find the paper by ID
        const updatedPapers = papers.map((paper) =>
            paper._id === paperId ? { ...paper, TimeLimit: Number(value) } : paper
        );

        // Update the state with the new papers array
        setUserPapers(updatedPapers);

        console.log(updatedPapers)
    };

    const [paperToUpdate, setPaperToUpdate] = useState("");

    const generate = async () => {
        try {
            const response = await axios.post("http://localhost:8000/api/v1/papers/create-paper", {
                userId: token.user._id,
                paperTitle: title,
                timelimit: time,
                Private: visibility,
                questions: questions
            }, { withCredentials: true });

            toast({
                title: "Paper has been generated!",
                position: 'top-left',
                status: 'success',
                duration: 1000,
                isClosable: true,
            })

        } catch (error) {
            // Handle error
            toast({
                title: error.response.data.message,
                position: 'top-left',
                status: 'error',
                duration: 1000,
                isClosable: true,
            })
        }
    };

    const fetchUserPapers = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/v1/papers/getPapers/' + token.user._id);
            setUserPapers(response.data);
        } catch (error) {
            console.error('Error:', error);
        }
    }

    const handleSubmit = async (value) => {
        try {
            const paperToUpdate = papers.find((paper) => paper._id === value);
            console.log(paperToUpdate)
            const response = await axios.put("http://localhost:8000/api/v1/papers/update-paper/" + value, paperToUpdate, { withCredentials: true });

            toast({
                title: "Test details updated!",
                position: 'top-left',
                status: 'success',
                duration: 1000,
                isClosable: true,
            })
        } catch (error) {
            toast({
                title: "Some error!",
                position: 'top-left',
                status: 'error',
                duration: 1000,
                isClosable: true,
            })
        }
    };


    const fetchData = async () => {
        let data = new FormData();
        data.append('url', link);
        data.append('language', 'eng');
        data.append('scale', 'true');
        data.append('isOverlayRequired', 'false');
        data.append('iscreatesearchablepdf', 'false');
        data.append('issearchablepdfhidetextlayer', 'false');
        data.append('filetype', 'pdf');
        data.append('detectOrientation', 'false');
        data.append('isTable', 'true');

        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'https://api.ocr.space/parse/image',
            headers: {
                'apikey': 'K81508780488957',
                'Content-Type': 'multipart/form-data' // Set the Content-Type manually
            },
            data: data
        };

        try {
            const response = await axios.request(config);
            response.data.ParsedResults.forEach(element => {
                const type = element.ParsedText
                console.log(type);
                setConcatData((prev) => prev + type)
                //setConcatData(concatdata + type);
                if (questions.length == 0) {
                    toast({
                        title: "Some error has occurred",
                        position: 'top-left',
                        status: 'error',
                        duration: 1000,
                        isClosable: true,
                    })
                    return;
                } else {
                    generate();
                }
            })
        } catch (error) {
            console.log(error);
        }
    };


    useEffect(() => {
        fetchUserPapers();
    }, [])

    return (
        <Flex direction="column" gap={10} p={5}>
            <Flex gap={10}>
                <Button colorScheme='blue'
                    size="lg"
                    width="100%"
                >
                    Create a test manually
                </Button>
                <Button colorScheme='blue'
                    size="lg"
                    width="100%"
                    onClick={onOpen}
                >
                    Generate a test from a PDF
                </Button>
            </Flex>
            <Flex gap={10}>
                <Wrap spacing="15px" justify="center" mt="15px">
                    {papers.map((paper) => (
                        <WrapItem key={paper._id}>
                            <Card maxW="sm" p="20px" border="1px" borderColor="gray.300">
                                <CardBody>
                                    <Stack mt="6" spacing="3">
                                        <Heading size="md">{paper.paperTitle}</Heading>
                                        <Flex direction="row" align="center" justifyContent="space-between">
                                            {
                                                paper.Private ? (<Text fontSize="xl">
                                                    Private
                                                </Text>) : <Text fontSize="xl">
                                                    Public
                                                </Text>
                                            }

                                            <Switch id='isChecked' isChecked={paper.Private}
                                                onChange={() => toggleSwitch(paper._id)} />
                                        </Flex>
                                        <Text>(Press enter to update time)</Text>
                                        <Flex direction="row" align="center" gap={10}>
                                            <Editable placeholder={paper.TimeLimit}
                                                onSubmit={(value) => updateTime(paper._id, value)}
                                                onChange={() => setPaperToUpdate(prev => prev = paper._id)}
                                                >

                                                <EditablePreview />
                                                <EditableInput type="Number" />
                                            </Editable>
                                            <Text>Minutes</Text>
                                        </Flex>
                                        <Text color="blue.600" fontSize="2xl">
                                            {token.user.username}
                                        </Text>
                                    </Stack>
                                </CardBody>
                                <Divider />
                                <CardFooter>
                                    <ButtonGroup spacing="2">
                                        <Link to={`/editQuestions/${paper._id}`}>
                                            <Button variant="solid" colorScheme="blue">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                                    <polygon points="16 3 21 8 8 21 3 21 3 16 16 3"></polygon>
                                                </svg>
                                                Edit questions
                                            </Button>
                                        </Link>
                                        <Button variant="solid" colorScheme="green" onClick={() => handleSubmit(paper._id)}>
                                            Submit
                                        </Button>
                                    </ButtonGroup>
                                </CardFooter>
                            </Card>
                        </WrapItem>
                    ))}
                </Wrap>
            </Flex>
            <div>
                <QuestionParser text={concatdata} questions={questions} setQuestions={setQuestions} />
                
            </div>
            <Modal
                initialFocusRef={initialRef}
                finalFocusRef={finalRef}
                isOpen={isOpen}
                onClose={onClose}
            >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Create your account</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        <FormControl>
                            <FormLabel>Paper title</FormLabel>
                            <Input ref={initialRef} placeholder='Paper title' onChange={(e) => setTitle(e.target.value)} />
                        </FormControl>

                        <FormControl mt={4}>
                            <FormLabel>Paper Link</FormLabel>
                            <Input placeholder='Paper link' onChange={(e) => setLink(e.target.value)} />
                        </FormControl>

                        <FormControl mt={4}>
                            <FormLabel>Visibility</FormLabel>
                            <Select onChange={(e) => setVisibility(e.target.value)}>
                                <option value='1'>Private</option>
                                <option value='2'>Public</option>
                            </Select>
                        </FormControl>

                        <FormControl mt={4}>
                            <FormLabel>Time Limit</FormLabel>
                            <Input placeholder='Time Limit in minutes' onChange={(e) => setTime(e.target.value)} />
                        </FormControl>
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='blue' mr={3} onClick={fetchData}>
                            Generate Test
                        </Button>
                        <Button onClick={onClose}>Cancel</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Flex>
    );
}

export default AddTestView;