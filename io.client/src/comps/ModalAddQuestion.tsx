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
    questionId: number;
    name: string;
    category: string;
    question: string;
    questionType: string; // "open" or "close"
    a: { text: string, correct: boolean };
    b: { text: string, correct: boolean };
    c: { text: string, correct: boolean };
    d: { text: string, correct: boolean };
    shared: boolean;
}

const AddQuestionModal: React.FC<{ testId: string; onClose: () => void; onQuestionAdded: () => void; }> = ({ testId, onClose, onQuestionAdded }) => {
    const [formData, setFormData] = useState<NewQuestion>({
        questionId: 0,
        name: '',
        category: '',
        question: '',
        questionType: 'open',
        a: { text: '', correct: false },
        b: { text: '', correct: false },
        c: { text: '', correct: false },
        d: { text: '', correct: false },
        shared: false,
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (field: keyof NewQuestion, value: any) => {
        setFormData({ ...formData, [field]: value });
    };

    const handleAnswerChange = (option: 'a' | 'b' | 'c' | 'd', key: 'text' | 'correct', value: any) => {
        setFormData({
            ...formData,
            [option]: { ...formData[option], [key]: value }
        });
    };

    const handleSubmit = async () => {
        if (!formData.name || !formData.category || !formData.question || !formData.questionType) {
            setError("Please fill in all fields correctly.");
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await fetch(`/api/addquestion/${testId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
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
                    width: '450px',
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
                    InputLabelProps={{ style: { color: '#bbb' } }}
                    InputProps={{ style: { color: '#fff', backgroundColor: '#3c3c3c', borderRadius: '8px' } }}
                    onChange={(e) => handleChange('name', e.target.value)}
                    value={formData.name}
                    sx={{ mb: 2 }}
                />
                <TextField
                    label="Category"
                    fullWidth
                    margin="normal"
                    variant="filled"
                    InputLabelProps={{ style: { color: '#bbb' } }}
                    InputProps={{ style: { color: '#fff', backgroundColor: '#3c3c3c', borderRadius: '8px' } }}
                    onChange={(e) => handleChange('category', e.target.value)}
                    value={formData.category}
                    sx={{ mb: 2 }}
                />
                <TextField
                    label="Question Content"
                    fullWidth
                    margin="normal"
                    variant="filled"
                    multiline
                    rows={3}
                    InputLabelProps={{ style: { color: '#bbb' } }}
                    InputProps={{ style: { color: '#fff', backgroundColor: '#3c3c3c', borderRadius: '8px' } }}
                    onChange={(e) => handleChange('question', e.target.value)}
                    value={formData.question}
                    sx={{ mb: 2 }}
                />
                <TextField
                    select
                    fullWidth
                    label="Question Type"
                    variant="outlined"
                    value={formData.questionType}
                    InputLabelProps={{ style: { color: '#bbb' } }}
                    InputProps={{ style: { color: '#fff', backgroundColor: '#3c3c3c', borderRadius: '8px' } }}
                    onChange={(e) => handleChange('questionType', e.target.value)}
                    sx={{
                        '& .MuiSelect-select': { backgroundColor: '#333' }, // Styl samego pola rozwijanego
                    }}
                    SelectProps={{
                        MenuProps: {
                            PaperProps: {
                                sx: {
                                    bgcolor: '#333', // T³o menu
                                    color: 'white',  // Kolor tekstu w menu
                                    '& .MuiMenuItem-root': {
                                        '&:hover': {
                                            bgcolor: '#555', // Kolor t³a przy najechaniu
                                        },
                                    },
                                },
                            },
                        },
                    }}
                >
                    <MenuItem value="open">Open</MenuItem>
                    <MenuItem value="close">Close</MenuItem>
                </TextField>

                {formData.questionType === 'close' && (
                    <FormGroup sx={{ mb: 2 }}>
                        <Typography variant="subtitle1" mb={1}>Possible Answers</Typography>
                        {(['a', 'b', 'c', 'd'] as const).map(option => (
                            <Box key={option} display="flex" alignItems="center" sx={{ mb: 1 }}>
                                <TextField
                                    label={`Answer ${option.toUpperCase()}`}
                                    fullWidth
                                    margin="normal"
                                    variant="filled"
                                    InputLabelProps={{ style: { color: '#bbb' } }}
                                    InputProps={{ style: { color: '#fff', backgroundColor: '#3c3c3c', borderRadius: '8px' } }}
                                    value={formData[option].text}
                                    onChange={(e) => handleAnswerChange(option, 'text', e.target.value)}
                                    sx={{ mr: 2 }}
                                />
                                <Checkbox
                                    checked={formData[option].correct}
                                    onChange={(e) => handleAnswerChange(option, 'correct', e.target.checked)}
                                    sx={{
                                        color: '#00bcd4',
                                        '&.Mui-checked': { color: '#00bcd4' },
                                    }}
                                />
                            </Box>
                        ))}
                    </FormGroup>
                )}

                <FormControlLabel
                    control={
                        <Switch
                            checked={formData.shared}
                            onChange={(e) => handleChange('shared', e.target.checked)}
                            sx={{
                                '.MuiSwitch-track': { backgroundColor: '#555' },
                                '.MuiSwitch-thumb': { backgroundColor: '#00bcd4' },
                            }}
                        />
                    }
                    label="Shared"
                    sx={{ mb: 2, color: '#fff' }}
                />

                {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}

                <Box display="flex" justifyContent="space-between">
                    <Button onClick={onClose} sx={{ color: '#fff', textTransform: 'none' }}>
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSubmit}
                        disabled={loading}
                        sx={{ backgroundColor: '#1976d2', textTransform: 'none', minWidth: '120px' }}
                    >
                        {loading ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : 'Add'}
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default AddQuestionModal;
