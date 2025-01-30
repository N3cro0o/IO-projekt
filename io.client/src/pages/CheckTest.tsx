import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, TextField, Typography, Paper, Container } from '@mui/material';
import { debug } from 'console';

interface Question {
    aID: number;
    qName: string;
    qBody: string;
    aAnswer: string;
    aPoints: number;
    qMaxPoints: number;
}

const ReviewQuestions: React.FC = () => {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [index, setIndex] = useState<number>(0);
    const [assignedPoints, setAssignedPoints] = useState<number>(0);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const response = await fetch(`https://localhost:59127/api/EditQuestion/QuestionList`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                console.log("No zarycz no");
                const data: Question[] = await response.json();
                setQuestions(data);
            } catch (err) {
                console.error("Error fetching questions:", err);
            }
        };
        fetchQuestions();
    }, []);

    const submitPoints = async () => {
        if (questions.length === 0 || !questions[index]) return;

        const answerData = {
            answerId: questions[index].aID,
            points: assignedPoints,
        };

        try {
            const response = await fetch('https://localhost:7293/api/EditQuestion/answer/review', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(answerData),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            console.log('Points submitted successfully');
            advanceQuestion();
        } catch (error) {
            console.error("Error submitting points:", error);
        }
    };

    const advanceQuestion = () => {
        if (index + 1 < questions.length) {
            setIndex(index + 1);
            setAssignedPoints(0);
        } else {
            navigate("/teacher/review-complete");
        }
    };


    if (questions.length === 0) return <div>Loading...</div>;

    const currentQuestion = questions[index];

    return (
        <Container maxWidth="sm" sx={{ mt: 4 }}>
            <Paper sx={{ p: 3, backgroundColor: '#333', color: '#fff', borderRadius: 2 }}>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                    Review Open Question
                </Typography>
                <Typography variant="h6" gutterBottom>
                    {currentQuestion.qName}
                </Typography>
                <Paper sx={{ p: 2, backgroundColor: '#444', borderRadius: 1 }}>
                    <Typography variant="body1">{currentQuestion.qBody}</Typography>
                </Paper>
                <Typography variant="h6" mt={2}>
                    Student Answer:
                </Typography>
                <Paper sx={{ p: 2, backgroundColor: '#555', borderRadius: 1 }}>
                    <Typography variant="body1">{currentQuestion.aAnswer}</Typography>
                </Paper>
                <TextField
                    label="Assign Points"
                    type="number"
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    inputProps={{ min: 0, max: currentQuestion.qMaxPoints }}
                    onChange={(e) => setAssignedPoints(parseFloat(e.target.value) || 0)}
                    value={assignedPoints}
                    sx={{ backgroundColor: '#444', borderRadius: 1, input: { color: '#fff' }, label: { color: '#aaa' } }}
                />
                <Box mt={2} display="flex" justifyContent="space-between">
                    <Button variant="contained" color="primary" onClick={submitPoints}>
                        Submit & Next
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
};

export default ReviewQuestions;
