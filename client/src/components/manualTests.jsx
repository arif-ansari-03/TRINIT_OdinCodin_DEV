import React, { useState, useEffect } from "react";
import {
    Heading,
    Flex,
    FormControl,
    FormLabel,
    Input,
    Select,
    Button,
    Stack,
    HStack
} from "@chakra-ui/react";
import { useToast } from '@chakra-ui/react';
import Cookies from "universal-cookie";
import { BeatLoader } from 'react-spinners';
import axios from "axios";
import QuestionParser from "./QuestionParser";

const ManualTests = () => {
    const [title, setTitle] = useState("");
    const [numberOfQuestions, setNumberOfQuestions] = useState("");
    const [visibility, setVisibility] = useState("");
    const [time, setTime] = useState("");
    const [questions, setQuestions] = useState([{question: "Exam", options: [], questionImage: "", ansVal: null}]);
    const toast = useToast();
    const cookies = new Cookies();
    const [generating, setGenerating] = useState(false);
    const token = cookies.get("TOKEN");

    const createCustomPaper = async () => {
        try {
            console.log(questions)
            const response = await axios.post("http://localhost:8000/api/v1/papers/create-paper", {
                userId: token.user._id,
                paperTitle: title,
                timelimit: time,
                Private: visibility,
                questions: questions
            }, { withCredentials: true });
            
            setQuestions([])

            toast({
                title: "Paper has been generated!",
                position: 'top-left',
                status: 'success',
                duration: 1000,
                isClosable: true,
            })

            setGenerating(false);

        } catch (error) {
            // Handle error
            toast({
                title: error.response.data.message + ".Please try again",
                position: 'top-left',
                status: 'error',
                duration: 1000,
                isClosable: true,
            })

            setGenerating(false);
        }
    }

    const renderQuestionCards = () => {
        const cards = [];
        for (let i = 0; i < numberOfQuestions; i++) {
            cards.push(
                <Flex
                    direction="column"
                    width="100%"
                    border="1px solid #ccc"
                    borderRadius="md"
                    p={4}
                    mb={4}
                >
                    <Heading as="h3" size="md" mb={4}>
                        Notice {i + 1}
                    </Heading>

                    <FormControl mb={4}>
                        <FormLabel>Notice Title</FormLabel>
                        <Input placeholder={`Enter title for Notice ${i + 1}`} id={`question${i}`}/>
                    </FormControl>

                    <FormControl mb={4}>
                        <FormLabel>{`Enter Content`}</FormLabel>
                        <Input placeholder={`Enter Content`} id={`option1${i}`}/>
                    </FormControl>
                    
                    <FormControl mb={4} style={{display: 'none'}}>
                        <FormLabel>{`Option 2`}</FormLabel>
                        <Input value={`Enter Option 2`} id={`option2${i}`}/>
                    </FormControl>

                    <FormControl mb={4} style={{display: 'none'}}>
                        <FormLabel>{`Option 3`}</FormLabel>
                        <Input value={`Enter Option 3`} id={`option3${i}`}/>
                    </FormControl>

                    <FormControl mb={4} style={{display: 'none'}}>
                        <FormLabel>{`Option 4`}</FormLabel>
                        <Input value={`Enter Option 4`} id={`option4${i}`}/>
                    </FormControl>

                    <FormControl mb={4} style={{display: 'none'}}>
                        <FormLabel>Answer Option:</FormLabel>
                        <Input type="text" value="a" id={`answer${i}`}/>
                    </FormControl>
                   
                </Flex>
            );
        }
        return cards;
    };

    let allCards = renderQuestionCards();

    const displayContents = () => {
        setGenerating(true);
        for (let i = 0; i < numberOfQuestions; i++) {
            const questionText = document.getElementById(`question${i}`).value
            const option1 = document.getElementById(`option1${i}`).value
            const option2 = ""
            const option3 = ""
            const option4 = ""
            const answer = document.getElementById(`answer${i}`).value

            // if (questionText === "" || option1 === "" || option2 === "" || option3 === "" || option4 === "" || answer === "") {
            //     toast({
            //         title: 'Some fields are empty!',
            //         position: 'top-left',
            //         status: 'error',
            //         duration: 1000,
            //         isClosable: true,
            //     });

            //     setGenerating(false);
            //     return;
            // }

            // if (answer !== "a" || answer !== "b" || answer !== "c" || answer !== "d") {
            //     toast({
            //         title: 'Answer should be a,b,c or d',
            //         position: 'top-left',
            //         status: 'error',
            //         duration: 1000,
            //         isClosable: true,
            //     });

            //     setGenerating(true);
            //     // return;
            // }

            const questionObj = {question: questionText, options: [option1.split(''), option2.split(''), option3.split(''), option4.split('')], questionImage: "", ansVal: answer}
            questions.push(questionObj)
            setQuestions(questions)
        }

        console.log(questions)
        createCustomPaper();
    };


    return (
        <Flex
            direction="column"
            alignItems="center"
            justifyContent="center"
            p={5}
            gap={5}
            bg="gray.100"
        >
            <Heading mb={4}>OneBoard Noticeboard Generator</Heading>
            <Flex
                direction="row"
                alignItems="center"
                justifyContent="space-evenly"
                width="100%"
                margin="auto"
                bg="white"
                p={5}
                borderRadius="md"
                boxShadow="md"
            >
                <FormControl>
                    <FormLabel>Noticeboard Title</FormLabel>
                    <Input type="text" placeholder="Enter Noticeboard Title" onChange={(e) => setTitle(e.target.value)} />
                </FormControl>

                <FormControl>
                    <FormLabel>Number of Notices</FormLabel>
                    <Input type="Number" placeholder="Enter number of Notices" onChange={(e) => setNumberOfQuestions(e.target.value)} />
                </FormControl>
                {/*}
                <FormControl>
                    <FormLabel>Visibility</FormLabel>
                    <Select onChange={(e) => setVisibility(e.target.value)}>
                        <option value="private">Private</option>
                        <option value="public">Public</option>
                    </Select>
                </FormControl>

                <FormControl>
                    <FormLabel>Time Limit</FormLabel>
                    <Input type="number" placeholder="Enter Time Limit (minutes)" onChange={(e) => setTime(e.target.value)} />
                </FormControl> 
                */}
            </Flex>
            <Flex direction="column">
                <Heading>{title}  {time.length === 0 ? "" : " for " + time + " minutes"}</Heading>
                <HStack width="100%" spacing={4} style={{ flexWrap: 'wrap', justifyContent: 'space-between' }}>
                    {allCards}
                </HStack>
                {allCards.length !== 0 ?
                    (<Button variant="solid" colorScheme="green" 
                    onClick={displayContents}
                    isLoading={generating}
                    spinner={<BeatLoader size={8} color='white' />}
                    >Submit</Button>) : (null)
                }
            </Flex>
        </Flex>
    );
};

const ManualTests2 = () => {
    const [title, setTitle] = useState("");
    const [numberOfQuestions, setNumberOfQuestions] = useState("");
    const [visibility, setVisibility] = useState("");
    const [time, setTime] = useState("");
    const [questions, setQuestions] = useState([{question: "Exam", options: [], questionImage: "", ansVal: null}]);
    const toast = useToast();
    const cookies = new Cookies();
    const [generating, setGenerating] = useState(false);
    const token = cookies.get("TOKEN");

    const createCustomPaper = async () => {
        try {
            console.log(questions)
            const response = await axios.post("http://localhost:8000/api/v1/papers/create-paper", {
                userId: token.user._id,
                paperTitle: title,
                timelimit: time,
                Private: visibility,
                questions: questions
            }, { withCredentials: true });
            
            setQuestions([])

            toast({
                title: "Paper has been generated!",
                position: 'top-left',
                status: 'success',
                duration: 1000,
                isClosable: true,
            })

            setGenerating(false);

        } catch (error) {
            // Handle error
            toast({
                title: error.response.data.message + ".Please try again",
                position: 'top-left',
                status: 'error',
                duration: 1000,
                isClosable: true,
            })

            setGenerating(false);
        }
    }

    const renderQuestionCards = () => {
        const cards = [];
        for (let i = 0; i < numberOfQuestions; i++) {
            cards.push(
                <Flex
                    direction="column"
                    width="100%"
                    border="1px solid #ccc"
                    borderRadius="md"
                    p={4}
                    mb={4}
                >
                    <Heading as="h3" size="md" mb={4}>
                        Question {i + 1}
                    </Heading>

                    <FormControl mb={4}>
                        <FormLabel>Content</FormLabel>
                        <Input placeholder={`Enter Content for Notice ${i + 1}`} id={`question${i}`}/>
                    </FormControl>
                    
                    <FormControl mb={4}>
                        <FormLabel>{`Body`}</FormLabel>
                        <Input placeholder={`Enter Body`} id={`option1${i}`}/>
                    </FormControl>
                    

                    <FormControl mb={4}>
                        <FormLabel>{`Option 2`}</FormLabel>
                        <Input placeholder={`Enter Option 2`} id={`option2${i}`}/>
                    </FormControl>

                    <FormControl mb={4}>
                        <FormLabel>{`Option 3`}</FormLabel>
                        <Input placeholder={`Enter Option 3`} id={`option3${i}`}/>
                    </FormControl>

                    <FormControl mb={4}>
                        <FormLabel>{`Option 4`}</FormLabel>
                        <Input placeholder={`Enter Option 4`} id={`option4${i}`}/>
                    </FormControl>

                    <FormControl mb={4}>
                        <FormLabel>Answer Option:</FormLabel>
                        <Input type="text" placeholder="Enter a,b,c or d" id={`answer${i}`}/>
                    </FormControl>

                    
                </Flex>
            );
        }
        return cards;
    };

    let allCards = renderQuestionCards();

    const displayContents = () => {
        setGenerating(true);
        for (let i = 0; i < numberOfQuestions; i++) {
            const questionText = document.getElementById(`question${i}`).value
            const option1 = document.getElementById(`option1${i}`).value
            const option2 = ""
            const option3 = ""
            const option4 = ""
            const answer = ""

            // if (questionText === "" || option1 === "" || option2 === "" || option3 === "" || option4 === "" || answer === "") {
            //     toast({
            //         title: 'Some fields are empty!',
            //         position: 'top-left',
            //         status: 'error',
            //         duration: 1000,
            //         isClosable: true,
            //     });

            //     setGenerating(false);
            //     return;
            // }

            // if (answer !== "a" || answer !== "b" || answer !== "c" || answer !== "d") {
            //     toast({
            //         title: 'Answer should be a,b,c or d',
            //         position: 'top-left',
            //         status: 'error',
            //         duration: 1000,
            //         isClosable: true,
            //     });

            //     setGenerating(true);
            //     // return;
            // }

            const questionObj = {question: questionText, options: [option1.split(''), option2.split(''), option3.split(''), option4.split('')], questionImage: "", ansVal: answer}
            questions.push(questionObj)
            setQuestions(questions)
        }

        console.log(questions)
        createCustomPaper();
    };


    return (
        <Flex
            direction="column"
            alignItems="center"
            justifyContent="center"
            p={5}
            gap={5}
            bg="gray.100"
        >
            <Heading mb={8}>OneBoard Noticeboard Creator Tool</Heading>
            <Flex
                direction="row"
                alignItems="center"
                justifyContent="space-evenly"
                width="100%"
                margin="auto"
                bg="white"
                p={5}
                borderRadius="md"
                boxShadow="md"
            >
                <FormControl>
                    <FormLabel>Noticeboard Title</FormLabel>
                    <Input type="text" placeholder="Enter Noticeboard Title" onChange={(e) => setTitle(e.target.value)} />
                </FormControl>

                <FormControl>
                    <FormLabel>Number of Notices</FormLabel>
                    <Input type="Number" placeholder="Enter number of notices" onChange={(e) => setNumberOfQuestions(e.target.value)} />
                </FormControl>

                <FormControl>
                    <FormLabel>Visibility</FormLabel>
                    <Select onChange={(e) => setVisibility(e.target.value)}>
                        <option value="private">Private</option>
                        <option value="public">Public</option>
                    </Select>
                </FormControl>

                <FormControl>
                    <FormLabel>Time Limit</FormLabel>
                    <Input type="number" placeholder="Enter Time Limit (minutes)" onChange={(e) => setTime(e.target.value)} />
                </FormControl>
            </Flex>
            <Flex direction="column">
                <Heading>{title}  {time.length === 0 ? "" : " for " + time + " minutes"}</Heading>
                <HStack width="100%" spacing={4} style={{ flexWrap: 'wrap', justifyContent: 'space-between' }}>
                    {allCards}
                </HStack>
                {allCards.length !== 0 ?
                    (<Button variant="solid" colorScheme="green" 
                    onClick={displayContents}
                    isLoading={generating}
                    spinner={<BeatLoader size={8} color='white' />}
                    >Submit</Button>) : (null)
                }
            </Flex>
        </Flex>
    );
};



export default ManualTests;
