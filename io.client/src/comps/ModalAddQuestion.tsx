import React, { useState } from 'react';
import {
    Box,
    Typography,
    Modal,
    TextField,
    MenuItem,
    Button,
    Radio,
    RadioGroup,
    FormControlLabel,
} from '@mui/material';

const modalStyle = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '90%',
    maxWidth: 500,
    bgcolor: '#333', // Ciemne t³o
    color: 'white', // Bia³y tekst
    borderRadius: '16px',
    boxShadow: 24,
    p: 4,
    overflowY: 'auto', // Dodanie przewijania zawartoœci
};

const inputStyle = {
    mb: 2,
    '& .MuiInputLabel-root': { color: 'white' }, // Kolor etykiety
    '& .MuiOutlinedInput-root': {
        backgroundColor: '#444', // Ciemne pole wejœciowe
        color: 'white', // Bia³y tekst
        '& fieldset': { borderColor: '#555' }, // Kolor obramowania
        '&:hover fieldset': { borderColor: '#777' }, // Kolor obramowania w hover
        '&.Mui-focused fieldset': { borderColor: '#007bff' }, // Kolor obramowania w focus
    },
};

interface ModalAddQuestionProps {
    open: boolean;
    handleClose: () => void;
    testId: number;
    onAddQuestion: (question: any) => void;
}

const ModalAddQuestion: React.FC<ModalAddQuestionProps> = ({ open, handleClose, testId, onAddQuestion }) => {
    const [newQuestion, setNewQuestion] = useState({
        name: '',
        category: '',
        questionContent: '',
        questionType: 'open',
        shared: false,
        maxPoints: 1,
        openAnswer: '',
        answers: ['', '', '', ''],
        correctAnswer: 'A',
    });

    const handleAddQuestion = async () => {
        try {
            const response = await fetch(`https://localhost:59127/api/question`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...newQuestion,
                    testId,
                }),
            });

            if (response.ok) {
                const createdQuestion = await response.json();
                onAddQuestion(createdQuestion);
                handleClose();
                setNewQuestion({
                    name: '',
                    category: '',
                    questionContent: '',
                    questionType: 'open',
                    shared: false,
                    maxPoints: 1,
                    openAnswer: '',
                    answers: ['', '', '', ''],
                    correctAnswer: 'A',
                });
            } else {
                console.error(`Failed to add question: ${response.status}`);
            }
        } catch (error) {
            console.error('Error adding question:', error);
        }
    };

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-add-question"
            aria-describedby="modal-add-question-description"
        >
            <Box sx={modalStyle}>
                <Typography variant="h6" mb={2}>
                    Add New Question
                </Typography>
                <TextField
                    fullWidth
                    label="Question Name"
                    variant="outlined"
                    value={newQuestion.name}
                    onChange={(e) => setNewQuestion({ ...newQuestion, name: e.target.value })}
                    sx={inputStyle}
                />
                <TextField
                    fullWidth
                    label="Category"
                    variant="outlined"
                    value={newQuestion.category}
                    onChange={(e) => setNewQuestion({ ...newQuestion, category: e.target.value })}
                    sx={inputStyle}
                />
                <TextField
                    fullWidth
                    label="Question Content"
                    variant="outlined"
                    value={newQuestion.questionContent}
                    onChange={(e) => setNewQuestion({ ...newQuestion, questionContent: e.target.value })}
                    sx={inputStyle}
                />
                <TextField
                    select
                    fullWidth
                    label="Question Type"
                    value={newQuestion.questionType}
                    onChange={(e) =>
                        setNewQuestion({
                            ...newQuestion,
                            questionType: e.target.value,
                            openAnswer: '',
                            answers: ['', '', '', ''],
                        })
                    }
                    sx={inputStyle}
                >
                    <MenuItem value="open">Open</MenuItem>
                    <MenuItem value="closed">Closed</MenuItem>
                </TextField>

                {newQuestion.questionType === 'open' && (
                    <TextField
                        fullWidth
                        label="Open Answer"
                        variant="outlined"
                        multiline
                        rows={3}
                        value={newQuestion.openAnswer}
                        onChange={(e) => setNewQuestion({ ...newQuestion, openAnswer: e.target.value })}
                        sx={inputStyle}
                    />
                )}

                {newQuestion.questionType === 'closed' && (
                    <>
                        {['A', 'B', 'C', 'D'].map((label, index) => (
                            <TextField
                                key={label}
                                fullWidth
                                label={`Answer ${label}`}
                                variant="outlined"
                                value={newQuestion.answers[index]}
                                onChange={(e) => {
                                    const updatedAnswers = [...newQuestion.answers];
                                    updatedAnswers[index] = e.target.value;
                                    setNewQuestion({ ...newQuestion, answers: updatedAnswers });
                                }}
                                sx={inputStyle}
                            />
                        ))}
                        <Typography variant="body1" mb={1}>
                            Select Correct Answer:
                        </Typography>
                        <RadioGroup
                            row
                            value={newQuestion.correctAnswer}
                            onChange={(e) => setNewQuestion({ ...newQuestion, correctAnswer: e.target.value })}
                        >
                            {['A', 'B', 'C', 'D'].map((label) => (
                                <FormControlLabel
                                    key={label}
                                    value={label}
                                    control={<Radio sx={{ color: 'white' }} />}
                                    label={label}
                                    sx={{ color: 'white' }}
                                />
                            ))}
                        </RadioGroup>
                    </>
                )}

                <TextField
                    fullWidth
                    label="Max Points"
                    type="number"
                    variant="outlined"
                    value={newQuestion.maxPoints}
                    onChange={(e) => setNewQuestion({ ...newQuestion, maxPoints: Number(e.target.value) })}
                    sx={inputStyle}
                />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={handleClose}
                        sx={{ borderRadius: '8px', borderColor: '#d32f2f', color: 'white' }}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleAddQuestion}
                        sx={{
                            borderRadius: '8px',
                            backgroundColor: '#007bff',
                            '&:hover': { backgroundColor: '#0056b3' },
                        }}
                    >
                        Add Question
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default ModalAddQuestion;
