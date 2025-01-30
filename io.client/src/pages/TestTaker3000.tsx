import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box,
    Button,
    CircularProgress,
    TextField,
    Typography,
    Paper,
    Checkbox,
    Container
} from '@mui/material';
import { ButtonAppBar } from '../comps/AppBar.tsx';
import { Link } from 'react-router-dom';

interface Question {
    answersClosed: string;
    category: string;
    key: number;
    id: number;
    name: string;
    points: number;
    type: string;
    text: string;
}

interface Answer {
    key: number;
    userAnswer: string;
    question: number;
    points: number;
}

const StartTest: React.FC = () => {
    const { testID } = useParams<{ testID: string }>();
    const [loading, setLoading] = useState<boolean>(true);
    const [questions, setQuestions] = useState<Question[]>([]);
    const navigate = useNavigate();

    const [index, setIndex] = useState<number>(0);
    const [question, setQuestion] = useState<Question>();
    const [answersClosed, setAnswersClosed] = useState<string[]>([]);
    const [selectedValues, setSelectedValues] = useState<boolean[]>([false, false, false, false]);
    const [answerText, setAnswerText] = useState<string>("");

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            navigate('/'); // Przekierowanie na stronê g³ówn¹
        }
    }, [navigate]);

    const handleCheckboxChange = (value: number, checked: boolean) => {
        try {
            let data = selectedValues;
            console.log(data);
            data[value] = checked
            setSelectedValues(data);
        }
        catch (err) {
            console.error(err);
        }
    };

    const createAnswer = async () => {
        const value = question?.type == "closed" ? (selectedValues[0] ? 8 : 0) + (selectedValues[1] ? 4 : 0) + (selectedValues[2] ? 2 : 0) + (selectedValues[3] ? 1 : 0) : 0;
        const points = question?.type == "closed" ? value == question.key ? question.points : 0 : 0;
        const answ: Answer = {
            key: value,
            userAnswer: answerText,
            question: question.id,
            points: points,
        }

        try {
            const response = await fetch('https://localhost:7293/api/TestManager/answer/add/test', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    Text: answ.userAnswer,
                    Test: parseInt(testID),
                    Question: answ.question,
                    Points: answ.points,
                    Key: answ.key,
                }),
            });
            if (response.ok) {
                console.log('Answer git!');
            }
        }
        catch (err) {
            console.log(err);
        }
    }

    const advanceQuestion = () => {
        if (question != undefined) {
            createAnswer();
        }
        setIndex(index + 1);
        console.log('Curr index:' + index);
        if (index >= questions.length) {
            navigate("/student/courses");
            return;
        }
        const quest = questions[index];
        const str = quest.answersClosed.split('\n');
        setAnswerText("");
        setQuestion(quest);
        setAnswersClosed(str);
        console.log('Answers: ' + str);
        console.log('Question: ' + question?.id);
    }

    const mapQuestion = (apiData: any[]): Question[] => {
        return apiData.map((quest) => ({
            answersClosed: quest.answers,
            category: quest.category,
            key: quest.correctAnswers,
            id: quest.id,
            name: quest.name,
            points: quest.points,
            type: quest.questionType,
            text: quest.text
        }));
    }

    useEffect(() => {

        const fetchQuestions = async () => {
            try {
                const response = await fetch(`https://localhost:59127/api/question/questions/from/${testID}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data: Question[] = await response.json();
                const x = mapQuestion(data);
                setQuestions(x);
            }
            catch (err) {
                console.error(err);
            }
            finally {
                setLoading(false);
            }
        }
        fetchQuestions();
    }, [testID]);

    if (loading) return <div>Loading...</div>;
    return (
        <div>
            <div id="loginContainer" style={{ marginTop: '20px' }}>
                <Box
                    sx={{
                        backgroundColor: '#333',
                        padding: '32px',
                        margin: 'auto',
                        width: '90%',
                        maxWidth: '500px',
                        borderRadius: '16px',
                        maxHeight: '90vh',
                        overflowY: 'auto',
                        boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.5)',
                        color: '#fff',
                    }}
                >
                    <Typography
                        variant="h5"
                        fontWeight="bold"
                        mb={3}
                        textAlign="center"
                        sx={{ color: '#fff' }}
                    >
                        TEST TIME
                    </Typography>

                    <Typography
                        variant="h5"
                        fontWeight="bold"
                        mb={3}
                        textAlign="center"
                        sx={{ color: '#fff' }}
                    >
                        {question?.text}
                    </Typography>


                    {question?.type === 'closed' ? (
                        <div>
                            {answersClosed.map((answer, i) => (
                                <Box key={i} display="flex" alignItems="center" gap={2}>
                                    <Checkbox
                                        onChange={(e) => handleCheckboxChange(i, e.target.checked)}
                                        sx={{ color: '#fff', '&.Mui-checked': { color: '#007bff' } }}
                                    />
                                    <Typography
                                        variant="h6"
                                        sx={{ color: '#fff' }}
                                    >
                                        {answer}
                                    </Typography>
                                </Box>
                            ))}
                        </div>

                    ) : question?.type === 'open' ? (
                        <div>
                            <Typography
                                variant="h5"
                                fontWeight="bold"
                                mb={3}
                                textAlign="center"
                                sx={{ color: '#fff' }}>
                                Answer below
                            </Typography>

                            <TextField
                                label="Answer"
                                fullWidth
                                margin="normal"
                                variant="outlined"
                                onChange={(e) => setAnswerText(e.target.value)}
                                value={answerText || ''}
                                sx={{
                                    mb: 2,
                                    backgroundColor: '#444',
                                    borderRadius: 1,
                                    input: { color: '#fff' },
                                    label: { color: '#aaa' },
                                }}
                            />
                        </div>
                    ) : (<div />)}

                    <Box display="flex" justifyContent="space-between">
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={advanceQuestion}
                            sx={{ backgroundColor: '#007bff', '&:hover': { backgroundColor: '#0056b3' } }}
                        >
                            Next question
                        </Button>
                    </Box>
                </Box>
            </div >
        </div >);
}

export default StartTest;