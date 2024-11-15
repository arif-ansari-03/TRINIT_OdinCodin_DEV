// Cards.jsx
import React, { useEffect, useState } from 'react';
import { Stack, CircularProgress } from '@chakra-ui/react';
import axios from 'axios';
import { useToast } from '@chakra-ui/react';
import QuestionCard from './questionCard';
import { storage } from "../firebase"
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

const Cards = ({ questions, paperId }) => {
  const toast = useToast();
  const uploadQuestionImage = async (e, index) => {
    const file = e.target.files[0];
    const date = new Date().getTime();
    const storageRef = ref(storage, `${paperId +  date}`);

    await uploadBytesResumable(storageRef, file).then(async () => {
      getDownloadURL(storageRef).then(async (downloadURL) => {
        let newQuestionsState = [...questions];
      newQuestionsState[index].questionImage = downloadURL;
        const response = await axios.put(`http://localhost:8000/api/v1/papers/updateQuestions/${paperId}`,
          newQuestionsState, { withCredentials: true });
        toast({
          title: 'Question image updated!',
          position: 'top-left',
          status: 'success',
          duration: 1000,
          isClosable: true,
        });
      })
    }).catch((error) => {
      toast({
        title: error,
        position: 'top-left',
        status: 'error',
        duration: 1000,
        isClosable: true,
      });
      console.log(error)
    })
  }

  const uploadOptionImage = async (e, index, optionIndex) => {
    const file = e.target.files[0];
    const date = new Date().getTime();
    const storageRef = ref(storage, `${paperId + index + date}`);

    await uploadBytesResumable(storageRef, file).then(async () => {
      getDownloadURL(storageRef).then(async (downloadURL) => {
        const response = await axios.put(`http://localhost:8000/api/v1/papers/updateOptionImages/${paperId}`,
          {index: index, optionIndex: optionIndex, downloadURL: downloadURL}, { withCredentials: true });
        toast({
          title: 'Question image updated!',
          position: 'top-left',
          status: 'success',
          duration: 1000,
          isClosable: true,
        });
      })
    }).catch((error) => {
      toast({
        title: error,
        position: 'top-left',
        status: 'error',
        duration: 1000,
        isClosable: true,
      });
      console.log(error)
    })
  }

  const updateQuestion = async (index, value) => {
    let newQuestionsState = [...questions];
    newQuestionsState[index].question = value;

    try {
      // Your axios request for updating question
      const response = await axios.put(`http://localhost:8000/api/v1/papers/updateQuestions/${paperId}`,
        newQuestionsState, { withCredentials: true });

      toast({
        title: 'Question title updated!',
        position: 'top-left',
        status: 'success',
        duration: 1000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Some error!',
        position: 'top-left',
        status: 'error',
        duration: 1000,
        isClosable: true,
      });
    }
  };

  const updateOptions = async (index, options) => {
    let newQuestionsState = [...questions];
    newQuestionsState[index].options = options;

    try {
      // Your axios request for updating options
      const response = await axios.put(`http://localhost:8000/api/v1/papers/updateQuestions/${paperId}`,
        newQuestionsState, { withCredentials: true });

      toast({
        title: 'Test details updated!',
        position: 'top-left',
        status: 'success',
        duration: 1000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Some error!',
        position: 'top-left',
        status: 'error',
        duration: 1000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      {questions.length === 0 ? (
        <CircularProgress isIndeterminate color="green.300" />
      ) : (
        <Stack>
          {questions.slice(1).map((q, index) => (
            <QuestionCard
              key={index}
              question={q}
              index={index}
              paperId={paperId}
              updateQuestion={updateQuestion}
              updateOptions={updateOptions}
              uploadQuestionImage={uploadQuestionImage}
              uploadOptionImage = {uploadOptionImage}
            />
          ))}
        </Stack>
      )}
    </>
  );
};

export default Cards;
