import React, { useState } from 'react';
import {
    Box,
    Button,
    Modal,
    TextField,
    Typography,
    CircularProgress,
    Switch,
    FormControlLabel,
    Checkbox,
    FormGroup,
    MenuItem
} from '@mui/material';

interface NewQuestion {
    name: string;
    category: string;
    questionType: string; // "open" or "closed"
    answer?: string; // Dla pytania otwartego
    options: { [key: string]: string }; // Treœæ odpowiedzi A, B, C, D
    correctAnswers: { [key: string]: boolean }; // Odpowiedzi poprawne
    shared: boolean;
    maxPoints?: number;
}

const AddQuestionModal: React.FC<{ testId: string; onClose: () => void; onQuestionAdded: () => void; }> = ({ testId, onClose, onQuestionAdded }) => {
    const [formData, setFormData] = useState<NewQuestion>({
        name: '',
        category: '',
        questionType: 'open',
        question: '',
        answer: '',
        options: { a: '', b: '', c: '', d: '' },
        correctAnswers: { a: false, b: false, c: false, d: false },
        shared: false,
        maxPoints: undefined,
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (field: keyof NewQuestion, value: any) => {
        setFormData({ ...formData, [field]: value });
    };

    const handleOptionChange = (option: 'a' | 'b' | 'c' | 'd', value: string) => {
        setFormData((prev) => ({
            ...prev,
            options: { ...prev.options, [option]: value }
        }));
    };

    const handleCorrectAnswerChange = (option: 'a' | 'b' | 'c' | 'd', checked: boolean) => {
        setFormData((prev) => ({
            ...prev,
            correctAnswers: { ...prev.correctAnswers, [option]: checked }
        }));
    };

    const handleSubmit = async () => {
        if (!formData.name || !formData.category || !formData.questionType) {
            setError("Please fill in all required fields.");
            return;
        }

        const payload = {
            ...formData,
            question: formData.question,
            a: formData.correctAnswers.a,
            b: formData.correctAnswers.b,
            c: formData.correctAnswers.c,
            d: formData.correctAnswers.d,
        };

        setLoading(true);
        setError('');

        try {
            const response = await fetch(`/api/question/${testId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorMessage = await response.text();
                throw new Error(errorMessage);
            }

            onQuestionAdded();
            onClose();
        } catch (err: any) {
            console.error(err);
            setError(err.message || "Failed to add question. Please try again.");
        } finally {
            setLoading(false);
        }
    };


    return (
        <Modal open onClose={onClose}>
            <Box
                sx={{
                    backgroundColor: '#2c2c2c',
                    padding: '32px',
                    margin: 'auto',
                    width: '500px',
                    borderRadius: '16px',
                    maxHeight: '90vh',
                    overflowY: 'auto',
                    boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.5)',
                    color: '#fff',
                }}
            >
                <Typography variant="h5" fontWeight="bold" mb={2} textAlign="center">
                    Add New Question
                </Typography>
                <TextField
                    label="Question Name"
                    fullWidth
                    margin="normal"
                    variant="filled"
                    onChange={(e) => handleChange('name', e.target.value)}
                    value={formData.name}
                    sx={{ mb: 2 }}
                />
                <TextField
                    label="Category"
                    fullWidth
                    margin="normal"
                    variant="filled"
                    onChange={(e) => handleChange('category', e.target.value)}
                    value={formData.category}
                    sx={{ mb: 2 }}
                />
                <TextField
                    select
                    fullWidth
                    label="Question Type"
                    variant="outlined"
                    value={formData.questionType}
                    onChange={(e) => handleChange('questionType', e.target.value)}
                    sx={{ mb: 2 }}
                >
                    <MenuItem value="open">Open</MenuItem>
                    <MenuItem value="closed">Closed</MenuItem>
                </TextField>

                {formData.questionType === 'open' ? (
                    <TextField
                        label="Answer"
                        fullWidth
                        margin="normal"
                        variant="filled"
                        onChange={(e) => handleChange('answer', e.target.value)}
                        value={formData.answer || ''}
                        sx={{ mb: 2 }}
                    />
                ) : (
                    <FormGroup sx={{ mb: 2 }}>
                        <Typography variant="subtitle1" mb={1}>Possible Answers</Typography>
                        {(['a', 'b', 'c', 'd'] as const).map(option => (
                            <Box key={option} display="flex" alignItems="center">
                                <Checkbox
                                    checked={formData.correctAnswers[option]}
                                    onChange={(e) => handleCorrectAnswerChange(option, e.target.checked)}
                                />
                                <TextField
                                    label={`Option ${option.toUpperCase()}`}
                                    fullWidth
                                    variant="filled"
                                    onChange={(e) => handleOptionChange(option, e.target.value)}
                                    value={formData.options[option]}
                                    sx={{ mb: 2 }}
                                />
                            </Box>
                        ))}
                    </FormGroup>
                )}

                <TextField
                    label="Max Points"
                    type="number"
                    fullWidth
                    margin="normal"
                    variant="filled"
                    onChange={(e) => handleChange('maxPoints', Number(e.target.value))}
                    value={formData.maxPoints || ''}
                    sx={{ mb: 2 }}
                />

                <FormControlLabel
                    control={
                        <Switch
                            checked={formData.shared}
                            onChange={(e) => handleChange('shared', e.target.checked)}
                        />
                    }
                    label="Shared"
                    sx={{ mb: 2 }}
                />

                {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}

                <TextField
                    label="Question Text"
                    fullWidth
                    margin="normal"
                    variant="filled"
                    onChange={(e) => handleChange('question', e.target.value)}
                    value={formData.question}
                    sx={{ mb: 2 }}
                />


                <Box display="flex" justifyContent="space-between">
                    <Button variant="contained" color="error" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} /> : 'Add'}
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default AddQuestionModal;
