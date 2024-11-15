import React, {useEffect, useState} from 'react'
import axios from 'axios'
import { Heading } from '@chakra-ui/react'
import { useParams, Link } from 'react-router-dom';
import Cookies from "universal-cookie";
import { Button, Flex } from '@chakra-ui/react';
import Cards from "./Cards";

const EditQuestions = ({}) => {
    const { paperId } = useParams();
    const cookies = new Cookies();
    const token = cookies.get("TOKEN");
    const [questions, setQuestions] = useState([]);
    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const queryString = token.user._id + "|" + paperId;
                const response = await axios.get('http://localhost:8000/api/v1/papers/getQuestions/' + queryString);
                console.log(response.data)
                setQuestions(response.data)
            } catch (error) {
                console.error('Error:', error);
            }
        }

        fetchQuestions();
    }, [])

    return (
        <>
        <Flex direction="column">
            <Flex direction="row" gap={10} align="center">
                <Link to="/app/addTest" >
                <Button>Go Back</Button>
                </Link>
                <Heading>Notice Board - Editor Window</Heading>
            </Flex>
            <Cards questions={questions} paperId = {paperId}/>
        </Flex>
        </>
    );
}

export default EditQuestions;