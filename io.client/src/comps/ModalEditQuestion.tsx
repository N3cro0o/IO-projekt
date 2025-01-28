import React, { useState } from 'react';
import {
    Modal,
    Box,
    Typography,
    TextField,
    Button,
    FormControlLabel,
    Checkbox,
    Grid,
    MenuItem,
    Select
} from '@mui/material';

interface Question {
    id: number;
    name: string;
    category: string;
    questionType: string;
    shared: boolean;
    maxPoints: number;
    answerId: number | null;
    answerA?: string;
    answerB?: string;
    answerC?: string;
    answerD?: string;
    correctAnswer?: string;
}

interface EditQuestionModalProps {
    open: boolean;
    question: Question;
    onClose: () => void;
    onQuestionUpdated: () => void;
}

const EditQuestionModal: React.FC<EditQuestionModalProps> = ({
    open,
    question,
    onClose,
    onQuestionUpdated,
}) => {
    const [name, setName] = useState(question.name);
    const [category, setCategory] = useState(question.category);
    const [questionType, setQuestionType] = useState(question.questionType);
    const [shared, setShared] = useState(question.shared);
    const [maxPoints, setMaxPoints] = useState(question.maxPoints);

    const [answerA, setAnswerA] = useState(question.answerA || "");
    const [answerB, setAnswerB] = useState(question.answerB || "");
    const [answerC, setAnswerC] = useState(question.answerC || "");
    const [answerD, setAnswerD] = useState(question.answerD || "");
    const [correctAnswer, setCorrectAnswer] = useState(question.correctAnswer || "");

    const handleSubmit = async () => {
        const updatedQuestion = {
            name,
            category,
            questionType,
            shared,
            maxPoints,
            ...(questionType === 'closed' && { answerA, answerB, answerC, answerD, correctAnswer }),
        };

        try {
            const response = await fetch(`/api/EditQuestion/EditQuestionByName/${encodeURIComponent(name)}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedQuestion),
            });

            if (!response.ok) {
                const errorMessage = await response.text();
                throw new Error(errorMessage);
            }

            onQuestionUpdated();
            onClose();
        } catch (err) {
            console.error('Error updating question:', err);
            alert(`Error updating question: ${err.message}`);
        }
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '90%',
                    maxWidth: 500,
                    bgcolor: '#333',
                    borderRadius: '16px',
                    boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.5)',
                    p: 4,
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
                    Edit Question
                </Typography>
                <TextField
                    label="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    fullWidth
                    margin="normal"
                    sx={{
                        mb: 2,
                        backgroundColor: '#444',
                        borderRadius: 1,
                        input: { color: '#fff' },
                        label: { color: '#aaa' },
                    }}
                />
                <TextField
                    label="Category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    fullWidth
                    margin="normal"
                    sx={{
                        mb: 2,
                        backgroundColor: '#444',
                        borderRadius: 1,
                        input: { color: '#fff' },
                        label: { color: '#aaa' },
                    }}
                />
                <TextField
                    select
                    fullWidth
                    label="Question Type"
                    value={questionType}
                    onChange={(e) => setQuestionType(e.target.value)}
                    sx={{
                        mb: 2,
                        backgroundColor: '#444',
                        borderRadius: 1,
                        input: { color: '#fff' },
                        label: { color: '#aaa' },
                        '.MuiSelect-select': {
                            color: '#fff',
                        },
                        '.MuiPaper-root': {
                            backgroundColor: '#444',
                            color: '#fff',
                        },
                    }}
                    SelectProps={{
                        MenuProps: {
                            PaperProps: {
                                sx: {
                                    bgcolor: '#444',
                                    color: '#fff',
                                },
                            },
                        },
                    }}
                >
                    <MenuItem value="open">Open</MenuItem>
                    <MenuItem value="closed">Close</MenuItem>
                </TextField>

                <TextField
                    label="Max Points"
                    type="number"
                    value={maxPoints}
                    onChange={(e) => setMaxPoints(Number(e.target.value))}
                    fullWidth
                    margin="normal"
                    sx={{
                        mb: 2,
                        backgroundColor: '#444',
                        borderRadius: 1,
                        input: { color: '#fff' },
                        label: { color: '#aaa' },
                    }}
                    InputProps={{
                        inputProps: {
                            min: 0,
                            pattern: '\\d*',
                        },
                    }}
                />

                <FormControlLabel
                    control={
                        <Checkbox
                            checked={shared}
                            onChange={(e) => setShared(e.target.checked)}
                            sx={{ color: '#fff', '&.Mui-checked': { color: '#007bff' } }}
                        />
                    }
                    label="Shared"
                    sx={{ color: '#fff', mb: 2 }}
                />

                {questionType === 'closed' && (
                    <Box mt={2}>
                        <Typography variant="subtitle1" mb={1}>
                            Answers
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <TextField
                                    label="Answer A"
                                    value={answerA}
                                    onChange={(e) => setAnswerA(e.target.value)}
                                    fullWidth
                                    sx={{
                                        mb: 2,
                                        backgroundColor: '#444',
                                        borderRadius: 1,
                                        input: { color: '#fff' },
                                        label: { color: '#aaa' },
                                    }}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    label="Answer B"
                                    value={answerB}
                                    onChange={(e) => setAnswerB(e.target.value)}
                                    fullWidth
                                    sx={{
                                        mb: 2,
                                        backgroundColor: '#444',
                                        borderRadius: 1,
                                        input: { color: '#fff' },
                                        label: { color: '#aaa' },
                                    }}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    label="Answer C"
                                    value={answerC}
                                    onChange={(e) => setAnswerC(e.target.value)}
                                    fullWidth
                                    sx={{
                                        mb: 2,
                                        backgroundColor: '#444',
                                        borderRadius: 1,
                                        input: { color: '#fff' },
                                        label: { color: '#aaa' },
                                    }}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    label="Answer D"
                                    value={answerD}
                                    onChange={(e) => setAnswerD(e.target.value)}
                                    fullWidth
                                    sx={{
                                        mb: 2,
                                        backgroundColor: '#444',
                                        borderRadius: 1,
                                        input: { color: '#fff' },
                                        label: { color: '#aaa' },
                                    }}
                                />
                            </Grid>
                        </Grid>
                        <TextField
                            label="Correct Answer (A, B, C, D)"
                            value={correctAnswer}
                            onChange={(e) => setCorrectAnswer(e.target.value.toUpperCase())}
                            fullWidth
                            margin="normal"
                            sx={{
                                mb: 2,
                                backgroundColor: '#444',
                                borderRadius: 1,
                                input: { color: '#fff' },
                                label: { color: '#aaa' },
                            }}
                        />
                    </Box>
                )}

                <Box mt={4} display="flex" justifyContent="space-between">
                    <Button
                        variant="contained"
                        color="error"
                        onClick={onClose}
                        sx={{ backgroundColor: '#d32f2f', '&:hover': { backgroundColor: '#9a0007' } }}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSubmit}
                        sx={{ backgroundColor: '#007bff', '&:hover': { backgroundColor: '#0056b3' } }}
                    >
                        Save
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default EditQuestionModal;
