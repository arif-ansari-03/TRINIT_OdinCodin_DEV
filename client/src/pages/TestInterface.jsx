import { useState,useEffect } from "react";
import { chakra, Box, Wrap, WrapItem, Grid, GridItem, Radio, RadioGroup, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Toast, useToast } from "@chakra-ui/react";
import { Card, CardBody, Stack, Heading, Text, Divider, CardFooter, Button, ButtonGroup,Flex,Spacer,Avatar } from "@chakra-ui/react";
// import Navbar from "../../components/Navbar";
import Cookies from "universal-cookie";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import { ArrowLeftIcon, ArrowRightIcon } from "@chakra-ui/icons";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./TestInterface.css";

export default function TestInterface() {
    const toast = useToast()
    const cookies = new Cookies();
    const token = cookies.get("TOKEN");

    useEffect(() => {
        const launchFullScreen = (element) => {
          if (element.requestFullscreen) {
            element.requestFullscreen();
          } else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
          } else if (element.webkitRequestFullscreen) {
            element.webkitRequestFullscreen();
          } else if (element.msRequestFullscreen) {
            element.msRequestFullscreen();
          }
        };
    
        const exitFullScreen = () => {
          if (
            document.fullscreenElement ||
            document.mozFullScreenElement ||
            document.webkitFullscreenElement ||
            document.msFullscreenElement
          ) {
            if (document.exitFullscreen) {
              document.exitFullscreen();
            } else if (document.mozCancelFullScreen) {
              document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) {
              document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) {
              document.msExitFullscreen();
            }
          }
        };
    
        // Fullscreen the document body on component mount
        // launchFullScreen(document.documentElement);
    
        // Exit fullscreen on component unmount (optional)
        return () => {
          exitFullScreen();
        };
      }, []);


    const [value, setValue] = useState('1');

    const trapeziumStyles = {
        clipPath: "polygon(20% 0%, 90% 20%, 90% 80%, 20% 100%)",
    };

    const navigate = useNavigate();

    const [seconds, setSeconds] = useState(0);
    const [minutes, setMinutes] = useState(0);
    const [hours, setHours] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [questionPaper,setQuestionPaper] = useState();
    const [selectedAnswers, setSelectedAnswers] = useState([]);
    const [questionButton, setQuestionButton] = useState([]);
    const [currentQuestion,setCurrentQuestion] = useState(1);
    const [selectedRadioButton, setSelectedRadioButton] = useState([]);


    useEffect(() => {
        const timerInterval = setInterval(() => {
          if (seconds > 0 || minutes > 0 || hours > 0) {
            setSeconds((prevSeconds) => (prevSeconds === 0 ? 59 : prevSeconds - 1));
    
            if (seconds === 0 && minutes > 0) {
              setMinutes((prevMinutes) => prevMinutes - 1);
            }
    
            if (seconds === 0 && minutes === 0 && hours > 0) {
              setHours((prevHours) => prevHours - 1);
            }
          } else {
            clearInterval(timerInterval); // Stop the timer when it reaches zero
            handleTimerEnd();
          }
        }, 1000);
    
        return () => clearInterval(timerInterval);
      }, [seconds, minutes, hours]);

      const handleTimerEnd = () =>{
        setIsModalOpen(true);
        setTimeout(function() {
            navigate('/app/dashboard');
            console.log("This will be executed after 2 seconds");
          }, 2000);
      }

      const handleCloseModal = () => {
        setIsModalOpen(false);
      };
    // const [paperId, setPaperId] = useState(null); // State variable to store paperId

    const { testId } = useParams(); // Get paperId from the URL using useParams

    const PaperSubmitHandler = () => {
    //   const analyticsData = {
    //     userId: token.user._id,
    //     paperId: testId,
    //     userAnswers: selectedAnswers,
    //     timeWasted: [],
    //     totalScore: 0,
    //     scorePerQuestion: [],
    //   };
      navigate("/app/dashboard");
      
      // Replace 'http://your-api-server/api/analytics/create' with the actual URL of your server endpoint
    //   axios.post('http://localhost:8000/api/v1/analytics/submit-paper/', analyticsData)
    //     .then(response => {
    //       console.log('Success:', response.data);
    //       navigate("/app/dashboard")
    //     })
    //     .catch(error => {
    //       console.error('Error:', error);
    //       toast({
    //         title: "Some error has occurred",
    //         position: 'bottom-right',
    //         status: 'error',
    //         duration: 1000,
    //         isClosable: true,
    //     })
    //     });
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (testId) {
                    // Make an API request to fetch the question paper based on the paperId
                    // Replace the placeholder URL with your actual API endpoint
                    const response = await axios.get(`http://localhost:8000/api/v1/papers/getPaper/${testId}`);
                    setQuestionPaper(response.data); // Assuming your question paper data is stored in response.data
                    console.log(response.data);
                }
            } catch (error) {
                console.error("Error fetching question paper:", error);
            }
        };
    
        fetchData();
    }, [testId]);

    useEffect(() => {
        if (questionPaper) {
            setHours(Math.floor(questionPaper._doc.TimeLimit/60) || 0);
            setMinutes(questionPaper._doc.TimeLimit%60 || 99);
            setSelectedAnswers(Array(questionPaper.questions.length).fill(0));
            setQuestionButton(Array(questionPaper.questions.length).fill(0));
        }

    }, [questionPaper]);

    const handleQuestionButtonClick = (questionNumber) => {
        // Update the value state when a question button is clicked
        if(selectedAnswers[currentQuestion] === 0){
            questionButton[currentQuestion] = 2;
        }else{
            questionButton[currentQuestion] = 1;
        }
        setValue(questionNumber.toString());
        setCurrentQuestion(questionNumber)
    };

    
    const handleOptionChange = (value) => {
        const updatedAnswers = selectedAnswers.map((c, i) => (i === currentQuestion ? value : c));
      
        setSelectedAnswers(updatedAnswers);
      };
      
      // Use console.log outside the event handler
      useEffect(() => {
        console.log(selectedAnswers); // This will log the updated state
      }, [selectedAnswers]);

      const handleSaveAndNext = () => {
        // Check if an answer is selected for the current question
        if (selectedAnswers[currentQuestion] !== 0) {
      
          // Proceed to the next question
          const nextQuestion = currentQuestion + 1;
          questionButton[currentQuestion] = 1;
          handleQuestionButtonClick(nextQuestion);
          let answers = [false, false, false, false]
          answers[parseInt(selectedAnswers[currentQuestion])] = true;
          setSelectedRadioButton(selectedRadioButton => [...selectedRadioButton, answers])
        } else {
            toast({
                title: "Please Select an Answer",
                position: 'bottom-right',
                status: 'error',
                duration: 1000,
                isClosable: true,
            })
        }
      };

      const handleSaveAndMarkForReview = () => {
        // Check if an answer is selected for the current question
        if (selectedAnswers[currentQuestion] !== 0) {
      
          // Proceed to the next question
          const nextQuestion = currentQuestion + 1;
          questionButton[currentQuestion] = 4;
          handleQuestionButtonClick(nextQuestion);
        } else {
        //   console.log("Please select an answer before proceeding.");
        toast({
            title: "Please Select an Answer",
            position: 'bottom-right',
            status: 'error',
            duration: 1000,
            isClosable: true,
        })
        }
      };

      const handleClearResponse = () => {
        const updatedAnswers = selectedAnswers.map((c, i) => (i === currentQuestion ? 0 : c));
        let answers = [false, false, false, false]
          setSelectedRadioButton(selectedRadioButton => [...selectedRadioButton, answers])
        setSelectedAnswers(updatedAnswers);
      };

      const handleMarkForReviewAndNext = () => {
            const nextQuestion = currentQuestion + 1;
            questionButton[currentQuestion] = 3;
            handleQuestionButtonClick(nextQuestion);
      };

      const handleNext = () => {
            const nextQuestion = currentQuestion + 1;
            if(selectedAnswers[currentQuestion] ===0){
                questionButton[currentQuestion] = 2;
            }else{
                questionButton[currentQuestion] = 1;
            }
            handleQuestionButtonClick(nextQuestion);
      }

    const handlePrev = () => {
        const prevQuestion = currentQuestion - 1;
        if(selectedAnswers[currentQuestion] ===0){
            questionButton[currentQuestion] = 2;
        }else{
            questionButton[currentQuestion] = 1;
        }
        handleQuestionButtonClick(prevQuestion);
    }

      const getButtonProps = (index) => {
        let buttonProps = {
          size: "md",
          onClick: () => handleQuestionButtonClick(index + 1),
          w: "40px",
        };
        if (questionButton[index+1] === 1){ //answered questions
            buttonProps.style = {...trapeziumStyles}
            buttonProps.borderRadius="0" 
            buttonProps.colorScheme="green" 
        }else if (questionButton[index+1] === 2) { //unanswered questions
            buttonProps.style={...trapeziumStyles} 
            buttonProps.borderRadius="0" 
            buttonProps.colorScheme="red" 
        } else if (questionButton[index + 1] === 3) { //marked for review
            buttonProps.borderRadius = 'full'
            buttonProps.colorScheme = 'purple';
        } else if (questionButton[index + 1] === 4) { //marked for review and evaluation
            buttonProps.borderRadius = 'full';
            buttonProps.colorScheme = 'purple';
            buttonProps.position = 'relative';
            buttonProps.rightIcon = (
                <Box
                  key={`circle-${index}`}
                  position="absolute"
                  bottom="-0.7"
                  right="-0.5"
                  width="20px"
                  height="20px"
                  borderRadius="full"
                  backgroundColor="green.400"
                />
            );
        }
        return buttonProps;
      };


  return (
    <div class='screen'>
    <Flex as="nav" p="2px" alignItems='center' gap='10px' bgColor='#FFFFFF' justifyContent='center'>
        <Heading as="h1" p="10px">NoticeBoard</Heading>
        <Spacer />
        {/* <Text fontSize='2xl'>{token.user.username}</Text> */}
        <Button size="md" borderRadius="0px" colorScheme='green' onClick={PaperSubmitHandler}>Dashboard</Button>
    </ Flex>
    <Flex flexWrap="wrap" gap="12px" p="20px">
                    {questionPaper &&
                        questionPaper.questions.slice(1).map((question, index) => (
                        // <Button key={index} {...getButtonProps(index)}>
                        //     {String(index + 1).padStart(2, '0')}
                        // </Button>
                        <div class='box'>
                            <heading class="noticeTitle">
                                {question.question}
                            </heading>
                            <div>
                                {question.options}
                            </div>
                        </div>
                    ))}
    </Flex>
    {/* <Flex bgColor='orange' p='15px' alignItems='center' >
        <Text fontSize='30px' >JEE MAIN</Text>
        <Spacer />
        <Button colorScheme='blue' size='lg'>
            PHYSICS
        </Button>
        <Button colorScheme='blue' size='lg'>
            CHEMISTRY
        </Button>
        <Button colorScheme='blue' size='lg'>
            MATHEMATICS
        </Button>
    </Flex>
    <Grid templateColumns="70% 30%" gap={4}>
        <GridItem colSpan={1}>
            <Box height='100%' p="20px" display='flex' flexDirection="column" >
                {questionPaper && (
                    <>
                    <Text fontWeight='bold' fontSize="2xl">{`Question ${value}`}</Text>
                    <Divider borderWidth="1px" borderColor="black"/>
                    <Box width="85%" maxHeight="350px" overflowY="scroll"
                    css={{
                        '::-webkit-scrollbar': {
                        width: '5px', // Adjust the width as needed
                        },
                        '::-webkit-scrollbar-thumb': {
                        backgroundColor: 'gray',
                        borderRadius: '10px', // Adjust the border radius as needed
                        },
                        '::-webkit-scrollbar-track': {
                        backgroundColor: 'transparent',
                        },
                    }}
                    >
                        <Text fontSize='xl' p='25px' fontWeight='500'>{questionPaper.questions[parseInt(value)].question}</Text>
                        <RadioGroup p="15px" onChange={handleOptionChange} value={parseInt(selectedAnswers[parseInt(value)])}>
                        <Stack direction='column'>
                            {questionPaper.questions[parseInt(value)].options.map((option, index) => (
                                <Radio key={index} size="lg" value={index + 1}>
                                    <Text fontSize="20px">{option}</Text>
                                </Radio>
                            ))}

                        </Stack>
                        </RadioGroup>
                    </Box>
                    <Divider borderWidth="1px" borderColor="black"/>
                    <Flex p="10px" gap="15px">
                        <Button borderRadius="0px" colorScheme='green' onClick={handleSaveAndNext}>SAVE & NEXT</Button>
                        <Button borderRadius="0px" colorScheme='orange' onClick={handleSaveAndMarkForReview}>SAVE & MARK FOR REVIEW</Button>
                        <Button borderRadius="0px" colorScheme='white' color="black" borderColor="black" borderWidth="1px" onClick={handleClearResponse}>CLEAR RESPONSE</Button>
                        <Button borderRadius="0px" colorScheme='blue' onClick={handleMarkForReviewAndNext}>MARK FOR REVIEW AND NEXT</Button>
                    </Flex>

                    <Flex bgColor="gray.300" gap="2px" height="60px" alignItems="center" p="15px">
                    <Button size="md" borderRadius="0px" colorScheme='white' color="black" borderWidth="1px" borderColor="black" isDisabled={currentQuestion === 1} onClick={handlePrev}><ArrowLeftIcon p="2px"/>PREV</Button>
                    <Button size="md" borderRadius="0px" colorScheme='white' color="black" borderWidth="1px" borderColor="black" isDisabled={currentQuestion === questionPaper.questions.length-1} onClick={handleNext}>NEXT<ArrowRightIcon p="2px" /></Button>

                    <Spacer />
                    <Button size="md" borderRadius="0px" colorScheme='green' onClick={PaperSubmitHandler}>SUBMIT</Button>
                    </Flex>
                    </>
                )}
            </Box>
        </GridItem>
        <GridItem colSpan={1}>
            <Flex p="10px" gap="40px">
                <Flex alignItems="center" width="140px" gap="10px">
                    <Button size="md">89</Button>
                    <Text fontWeight="bold">Not Visited</Text>
                </Flex>
                <Flex alignItems="center" gap="10px">
                <Button style={trapeziumStyles} borderRadius="0" size="md" colorScheme="red">
                    1
                </Button>
                <Text fontWeight="bold">Not Answered</Text>
                </Flex>
            </Flex>
            <Flex p="10px" gap="40px">
                <Flex alignItems="center" width="140px" gap="10px">
                <Button style={trapeziumStyles} borderRadius="0" size="md" colorScheme="green">
                    0
                </Button>
                <Text fontWeight="bold">Answered</Text>
                </Flex>
                <Flex alignItems="center" gap="10px">
                    <Button borderRadius="full" size="md" colorScheme="purple">0</Button>
                    <Text fontWeight="bold">Marked For Review</Text>
                </Flex>
            </Flex>
            <Flex p="10px" alignItems="center" gap="10px">
                <Button borderRadius="full" size="md" colorScheme="purple" position="relative">
                <Box
                position="absolute"
                bottom="-0.7"
                right="-0.5"
                width="20px"
                height="20px"
                borderRadius="full"
                backgroundColor="green.400"
                />
                    0
                </Button>
                
                <Text fontWeight="bold">Answered & Marked For Review (will be considered for evaluation)</Text>
            </Flex>




                <Flex flexWrap="wrap" gap="12px" p="20px">
                    {questionPaper &&
                        questionPaper.questions.slice(0,-1).map((question, index) => (
                        // <Button key={index} {...getButtonProps(index)}>
                        //     {String(index + 1).padStart(2, '0')}
                        // </Button>
                        <div class='box'>
                            {question.question}
                        </div>
                    ))}
                </Flex>
        </GridItem>
    </Grid>
    <Modal isOpen={isModalOpen} onClose={handleCloseModal} size="xl" isCentered closeOnOverlayClick={false}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader color="red">Time's Up!</ModalHeader>
          <ModalBody>
            <Text fontSize="xl">
              Your time has run out. You will be redirected to the dashboard shortly.
            </Text>
          </ModalBody>
        </ModalContent>
      </Modal> */}
    </div>
  )
}
