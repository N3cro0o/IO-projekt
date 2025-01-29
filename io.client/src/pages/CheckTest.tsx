import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Button, TextField, Typography, Paper, Container } from '@mui/material';

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

const ReviewQuestions: React.FC = () => {
    const { testID } = useParams<{ testID: string }>();
    const [questions, setQuestions] = useState<Question[]>([]);
    const [index, setIndex] = useState<number>(0);
    const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
    const [assignedPoints, setAssignedPoints] = useState<number>(0);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const response = await fetch(`https://localhost:59127/api/question/open/from/${testID}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data: Question[] = await response.json();
                setQuestions(data);
                if (data.length > 0) setCurrentQuestion(data[0]);
            } catch (err) {
                console.error(err);
            }
        };
        fetchQuestions();
    }, [testID]);

    const submitPoints = async () => {
        if (!currentQuestion) return;
        try {
            await fetch('https://localhost:7293/api/TestManager/answer/review', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    questionId: currentQuestion.id,
                    points: assignedPoints,
                }),
            });
            console.log('Points submitted');
        } catch (err) {
            console.error(err);
        }
        advanceQuestion();
    };

    const advanceQuestion = () => {
        if (index + 1 < questions.length) {
            setIndex(index + 1);
            setCurrentQuestion(questions[index + 1]);
            setAssignedPoints(0);
        } else {
            navigate("/teacher/review-complete");
        }
    };

    if (!currentQuestion) return <div>Loading...</div>;

    return (
        <Container maxWidth= "sm" sx = {{ mt: 4 }
}>
    <Paper sx={ { p: 3, backgroundColor: '#333', color: '#fff', borderRadius: 2 } }>
        <Typography variant="h5" fontWeight = "bold" gutterBottom >
            Review Open Question
                </Typography>
                < Typography variant = "h6" gutterBottom >
                    { currentQuestion.text }
                    </Typography>
                    < Paper sx = {{ p: 2, backgroundColor: '#444', borderRadius: 1 }}>
                        <Typography variant="body1" > { currentQuestion.userAnswer } </Typography>
                            </Paper>
                            < TextField
label = "Assign Points"
type = "number"
fullWidth
margin = "normal"
variant = "outlined"
inputProps = {{ min: 0, max: currentQuestion.points }}
onChange = {(e) => setAssignedPoints(parseInt(e.target.value) || 0)}
value = { assignedPoints }
sx = {{ backgroundColor: '#444', borderRadius: 1, input: { color: '#fff' }, label: { color: '#aaa' } }}
                />
    < Box mt = { 2} display = "flex" justifyContent = "space-between" >
        <Button variant="contained" color = "primary" onClick = { submitPoints } >
            Submit & Next
            </Button>
            </Box>
            </Paper>
            </Container>
    );
};

export default ReviewQuestions;
