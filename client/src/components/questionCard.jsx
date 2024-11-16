// QuestionCard.jsx
import React, { useState } from 'react';
import { Accordion, AccordionIcon, AccordionItem, AccordionButton, AccordionPanel, Box, HStack, Input, Button } from '@chakra-ui/react';
import axios from 'axios';
import { useToast, Stack } from '@chakra-ui/react';


const QuestionCard = ({ question, index, paperId, updateQuestion, updateOptions, uploadQuestionImage, uploadOptionImage }) => {
  const toast = useToast();
  const [questionText, setQuestionText] = useState(question.question);
  const [options, setOptions] = useState([...question.options])
  const [questionImage, setQuestionImage] = useState(question.questionImage)

  const handleOptionChange = (value, optionIndex) => {
    const updatedOptions = [...options];
    updatedOptions[optionIndex] = value;
    setOptions(updatedOptions);
  };

  return (
    <Accordion allowToggle>
      <AccordionItem>
        <h2>
          <AccordionButton>
            <Box as="span" flex="1" textAlign="left">
              {index === 1000 ? <h3>Instructions:</h3> : <h3>Notice {1+index}</h3>}
            </Box>
            <AccordionIcon />
          </AccordionButton>
        </h2>
        <AccordionPanel pb={4}>
          <HStack spacing="32px">
            <Input type="text" value={questionText} onChange={(e) => setQuestionText(e.target.value)} />
            {/* <Input type="file" placeholder='Add Image' width="20%" onChange={(e) => uploadQuestionImage(e, index)}/> */}
            <Button onClick={() => updateQuestion(index, questionText)}>Save Title</Button>
          </HStack>
          <ul>
            {question.options.slice(0, 1).map((opt, optionIndex) => (
              <li key={optionIndex}>
                <Input type="text" value={options[optionIndex]} onChange={(e) => handleOptionChange(e.target.value, optionIndex)} />
                {/* <Input type="file" placeholder='Add Image' width="20%" onChange={(e) => uploadOptionImage(e, index, optionIndex)}/> */}
                <Button onClick={() => updateOptions(index, options)}>Save Content</Button>
              </li>
            ))}
          </ul>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
};

export default QuestionCard;
