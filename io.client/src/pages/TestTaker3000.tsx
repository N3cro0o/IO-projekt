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
            const tok = localStorage.getItem('authToken');
            const decod = jwtDecode(tok);

            const response = await fetch('https://localhost:7293/api/TestManager/answer/add/test', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    Text: answ.userAnswer,
                    Test: parseInt(testID),
                    User: parseInt(decod.certserialnumber),
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
        window.scrollTo(0, 0);
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
            <ButtonAppBar />
            <div id="loginContainer" style={{ marginTop: '-80px' }}>
                <Box
                    sx={{
                        background: 'linear-gradient(135deg, #121212, #1e1e1e)',
                        padding: '32px',
                        margin: 'auto',
                        width: '80%',
                        maxWidth: '1000px',
                        borderRadius: '16px',
                        boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.7)',
                        color: '#fff',
                    }}
                >
                    <Typography
                        variant="h4"
                        fontWeight="bold"
                        textAlign="center"
                        sx={{ color: 'white' }}
                    >
                        TEST TIME
                    </Typography>

                    <Typography
                        variant="h5"
                        fontWeight="bold"
                        textAlign="center"
                        sx={{ color: '#ccc', opacity: 0.9, mt: 2 }}
                    >
                        {question?.text}
                    </Typography>

                    {question?.type === 'closed' && (
                        <Box mt={3}>
                            {answersClosed.map((answer, i) => (
                                <Box
                                    key={i}
                                    display="flex"
                                    alignItems="center"
                                    gap={2}
                                    sx={{
                                        background: 'rgba(255, 255, 255, 0.1)',
                                        padding: '12px',
                                        borderRadius: '8px',
                                        mb: 2,
                                        transition: '0.3s',
                                        '&:hover': { background: 'rgba(255, 255, 255, 0.2)' },
                                    }}
                                >
                                    <Checkbox
                                        onChange={(e) => handleCheckboxChange(i, e.target.checked)}
                                        sx={{
                                            color: '#fff',
                                            '&.Mui-checked': { color: '#00e6e6' },
                                        }}
                                    />
                                    <Typography variant="h6" sx={{ color: '#fff' }}>
                                        {answer}
                                    </Typography>
                                </Box>
                            ))}
                        </Box>
                    )}

                    {question?.type === 'open' && (
                        <TextField
                            label="Your answer"
                            fullWidth
                            margin="normal"
                            variant="outlined"
                            onChange={(e) => setAnswerText(e.target.value)}
                            value={answerText || ''}
                            sx={{
                                backgroundColor: '#222',
                                borderRadius: '8px',
                                input: { color: '#fff' },
                                label: { color: '#bbb' },
                                '& fieldset': { borderColor: '#00e6e6' },
                            }}
                        />
                    )}

                    <Box display="flex" justifyContent="center" mt={4}>
                        <Button
                            variant="contained"
                            onClick={advanceQuestion}
                            sx={{
                                background: 'linear-gradient(135deg, #00e6e6, #0072ff)',
                                padding: '12px 24px',
                                borderRadius: '10px',
                                fontSize: '1.1rem',
                                '&:hover': { background: 'linear-gradient(135deg, #0072ff, #00e6e6)' },
                            }}
                        >
                            Next question
                        </Button>
                    </Box>
                </Box>

            </div >
        </div >);
}

export default StartTest;