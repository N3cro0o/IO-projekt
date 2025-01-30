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
    questionType: string;
    questionBody: string;
    answer?: string;
    options: { [key: string]: string };
    correctAnswers: { [key: string]: boolean };
    shared: boolean;
    maxPoints: string;
}

const AddQuestionModal: React.FC<{ testId: string; onClose: () => void; onQuestionAdded: () => void; }> = ({ testId, onClose, onQuestionAdded }) => {
    const [formData, setFormData] = useState<NewQuestion>({
        name: '',
        category: '',
        questionType: 'open',
        questionBody: '',
        answer: '',
        options: { a: '', b: '', c: '', d: '' },
        correctAnswers: { a: false, b: false, c: false, d: false },
        shared: false,
        maxPoints: '',
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

        setLoading(true);
        setError('');

        try {
            const response = await fetch(`/api/question/${testId}`, {
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
                    Add New Question
                </Typography>

                <TextField
                    label="Question Name"
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    onChange={(e) => handleChange('name', e.target.value)}
                    value={formData.name}
                    sx={{
                        mb: 2,
                        backgroundColor: '#444',
                        borderRadius: 1,
                        input: { color: '#fff' },
                        label: { color: '#aaa' }
                    }}
                />
                <TextField
                    label="Category"
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    onChange={(e) => handleChange('category', e.target.value)}
                    value={formData.category}
                    sx={{
                        mb: 2, // Powiêkszony odstêp
                        backgroundColor: '#444',
                        borderRadius: 1,
                        input: { color: '#fff' },
                        label: { color: '#aaa' }
                    }}
                />

                <TextField
                    label="Question"
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    onChange={(e) => handleChange('questionBody', e.target.value)}
                    value={formData.questionBody}
                    sx={{
                        mb: 4, // Powiêkszony odstêp
                        backgroundColor: '#444',
                        borderRadius: 1,
                        input: { color: '#fff' },
                        label: { color: '#aaa' }
                    }}
                />

                <TextField
                    select
                    fullWidth
                    label="Question Type"
                    variant="outlined"
                    value={formData.questionType}
                    onChange={(e) => handleChange('questionType', e.target.value)}
                    sx={{
                        mb: 2,
                        backgroundColor: '#444',
                        borderRadius: 1,
                        input: { color: '#fff' },
                        label: { color: '#aaa' },
                        '.MuiSelect-select': { color: '#fff' },
                        '.MuiPaper-root': { backgroundColor: '#444', color: '#fff' }
                    }}
                    SelectProps={{
                        MenuProps: {
                            PaperProps: {
                                sx: { bgcolor: '#444', color: '#fff' }
                            }
                        }
                    }}
                >
                    <MenuItem value="open">Open</MenuItem>
                    <MenuItem value="closed">Closed</MenuItem>
                </TextField>

                <TextField
                    label="maxPoints"
                    type="number"
                    value={formData.maxPoints}
                    onChange={(e) => handleChange('maxPoints', e.target.value)}
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

                {formData.questionType === 'closed' && (
                    <FormGroup sx={{ mb: 2 }}>
                        <Typography variant="subtitle1" mb={1}>Check Correct Answers</Typography>
                        {(['a', 'b', 'c', 'd'] as const).map(option => (
                            <Box key={option} display="flex" alignItems="center">
                                <Checkbox
                                    checked={formData.correctAnswers[option]}
                                    onChange={(e) => handleCorrectAnswerChange(option, e.target.checked)}
                                    sx={{ color: '#fff', '&.Mui-checked': { color: '#007bff' } }}
                                />
                                <TextField
                                    label={`Option ${option.toUpperCase()}`}
                                    fullWidth
                                    variant="outlined"
                                    onChange={(e) => handleOptionChange(option, e.target.value)}
                                    value={formData.options[option]}
                                    sx={{
                                        mb: 2,
                                        backgroundColor: '#444',
                                        borderRadius: 1,
                                        input: { color: '#fff' },
                                        label: { color: '#aaa' }
                                    }}
                                />
                            </Box>
                        ))}
                    </FormGroup>
                )}

                <FormControlLabel
                    control={<Switch checked={formData.shared} onChange={(e) => handleChange('shared', e.target.checked)} />}
                    label="Shared"
                    sx={{ mb: 2, color: '#fff' }}
                />

                {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}

                <Box display="flex" justifyContent="space-between">
                    <Button variant="contained" color="error" onClick={onClose} sx={{ backgroundColor: '#d32f2f', '&:hover': { backgroundColor: '#9a0007' } }}>
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSubmit}
                        disabled={loading}
                        sx={{ backgroundColor: '#007bff', '&:hover': { backgroundColor: '#0056b3' } }}
                    >
                        {loading ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : 'Add'}
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default AddQuestionModal;
