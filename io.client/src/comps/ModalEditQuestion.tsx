import React, { useState } from 'react';
import {
    Modal,
    Box,
    Typography,
    TextField,
    Button,
    FormControlLabel,
    Checkbox,
    Grid
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

    // Jeœli pytanie zamkniête, edytujemy odpowiedzi
    const [answerA, setAnswerA] = useState(question.answerA || "");
    const [answerB, setAnswerB] = useState(question.answerB || "");
    const [answerC, setAnswerC] = useState(question.answerC || "");
    const [answerD, setAnswerD] = useState(question.answerD || "");
    const [correctAnswer, setCorrectAnswer] = useState(question.correctAnswer || "");

    const handleSubmit = async () => {
        const updatedQuestion = {
            id: question.id,
            name,
            category,
            questionType,
            shared,
            maxPoints,
            answerId: question.answerId,
            ...(questionType === "closed" && { answerA, answerB, answerC, answerD, correctAnswer }),
        };

        try {
            const response = await fetch(`/api/EditQuestion/EditQuestion/${question.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedQuestion),
            });

            if (!response.ok) {
                throw new Error('Failed to update question');
            }

            onQuestionUpdated();
            onClose();
        } catch (err) {
            console.error('Error updating question:', err);
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
                    width: 400,
                    bgcolor: 'background.paper',
                    borderRadius: 2,
                    boxShadow: 24,
                    p: 4,
                }}
            >
                <Typography variant="h6" mb={2}>
                    Edit Question
                </Typography>
                <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} fullWidth margin="normal" />
                <TextField label="Category" value={category} onChange={(e) => setCategory(e.target.value)} fullWidth margin="normal" />
                <TextField label="Question Type" value={questionType} onChange={(e) => setQuestionType(e.target.value)} fullWidth margin="normal" />
                <TextField label="Max Points" type="number" value={maxPoints} onChange={(e) => setMaxPoints(Number(e.target.value))} fullWidth margin="normal" />
                <FormControlLabel control={<Checkbox checked={shared} onChange={(e) => setShared(e.target.checked)} />} label="Shared" />

                {/* Sekcja odpowiedzi tylko dla pytañ zamkniêtych */}
                {questionType === "closed" && (
                    <Box mt={2}>
                        <Typography variant="subtitle1">Answers</Typography>
                        <Grid container spacing={1}>
                            <Grid item xs={6}><TextField label="Answer A" value={answerA} onChange={(e) => setAnswerA(e.target.value)} fullWidth /></Grid>
                            <Grid item xs={6}><TextField label="Answer B" value={answerB} onChange={(e) => setAnswerB(e.target.value)} fullWidth /></Grid>
                            <Grid item xs={6}><TextField label="Answer C" value={answerC} onChange={(e) => setAnswerC(e.target.value)} fullWidth /></Grid>
                            <Grid item xs={6}><TextField label="Answer D" value={answerD} onChange={(e) => setAnswerD(e.target.value)} fullWidth /></Grid>
                        </Grid>
                        <TextField label="Correct Answer (A, B, C, D)" value={correctAnswer} onChange={(e) => setCorrectAnswer(e.target.value.toUpperCase())} fullWidth margin="normal" />
                    </Box>
                )}

                <Box mt={2} display="flex" justifyContent="flex-end" gap={2}>
                    <Button variant="outlined" onClick={onClose}>Cancel</Button>
                    <Button variant="contained" color="primary" onClick={handleSubmit}>Save</Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default EditQuestionModal;
