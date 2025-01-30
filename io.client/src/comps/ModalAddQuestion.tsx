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
    shared: boolean;
    answer: string;
    b: boolean;
    a: boolean;
    c: boolean;
    d: boolean;
    bText: string;
    aText: string;
    cText: string;
    dText: string;
    questionBody: string;
    maxPoints: number;
}

const AddQuestionModal: React.FC<{ testId: string; onClose: () => void; onQuestionAdded: () => void; }> = ({ testId, onClose, onQuestionAdded }) => {
    const [formData, setFormData] = useState<NewQuestion>({
        name: '',
        category: '',
        questionType: '',
        shared: false,
        answer: "",
        a: false,
        b: false,
        c: false,
        d: false,
        bText: '',
        aText: '',
        cText: '',
        dText: '',
        maxPoints: 0,
        questionBody: '',
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (field: keyof NewQuestion, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async () => {
        if (!formData.name || !formData.category || !formData.questionType || !formData.questionBody || !formData.maxPoints) {
            setError("Please fill in all required fields.");
            return;
        }

        setLoading(true);
        setError('');

        try {
            const answ = formData.aText + '\n' + formData.bText + '\n' + formData.cText + '\n' + formData.dText;
            const key = (formData.a ? 8 : 0) + (formData.b ? 4 : 0) + (formData.c ? 2 : 0) + (formData.d ? 1 : 0); 
            const response = await fetch(`/api/QuestionFranek/FRANEKGPT/${testId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ID: 0,
                    Name: formData.name,
                    Text: formData.questionBody,
                    QuestionType: formData.questionType,
                    Answers: answ,
                    Category: formData.category,
                    Shared: formData.shared,
                    Points: formData.maxPoints,
                    CorrectAnswers: key
                }),
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
                <Typography variant="h5" fontWeight="bold" mb={3} textAlign="center">
                    Add New Question
                </Typography>

                <TextField
                    label="Question Name"
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    onChange={(e) => handleChange('name', e.target.value)}
                    value={formData.name}
                    sx={{ mb: 2, backgroundColor: '#444', borderRadius: 1, input: { color: '#fff' }, label: { color: '#aaa' } }}
                />
                <TextField
                    label="Category"
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    onChange={(e) => handleChange('category', e.target.value)}
                    value={formData.category}
                    sx={{ mb: 2, backgroundColor: '#444', borderRadius: 1, input: { color: '#fff' }, label: { color: '#aaa' } }}
                />

                <TextField
                    label="Question Body"
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    onChange={(e) => handleChange('questionBody', e.target.value)}
                    value={formData.questionBody}
                    sx={{ mb: 4, backgroundColor: '#444', borderRadius: 1, input: { color: '#fff' }, label: { color: '#aaa' } }}
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
                    <FormGroup>
                        <Box key={'a'} display="flex" alignItems="center">
                            <Checkbox
                                onChange={(e) => handleChange('a', e.target.checked)}
                                sx={{ color: '#fff', '&.Mui-checked': { color: '#007bff' } }}
                            />
                            <TextField
                                label={`Option ${'aText'}`}
                                fullWidth
                                variant="outlined"
                                onChange={(e) => handleChange('aText', e.target.value)}
                                value={formData['aText']}
                                sx={{ mb: 2, backgroundColor: '#444', borderRadius: 1, input: { color: '#fff' }, label: { color: '#aaa' } }}
                            />
                        </Box>

                        <Box key={'b'} display="flex" alignItems="center">
                            <Checkbox
                                onChange={(e) => handleChange('b', e.target.checked)}
                                sx={{ color: '#fff', '&.Mui-checked': { color: '#007bff' } }}
                            />
                            <TextField
                                label={`Option ${'bText'}`}
                                fullWidth
                                variant="outlined"
                                onChange={(e) => handleChange('bText', e.target.value)}
                                value={formData['bText']}
                                sx={{ mb: 2, backgroundColor: '#444', borderRadius: 1, input: { color: '#fff' }, label: { color: '#aaa' } }}
                            />
                        </Box>

                        <Box key={'c'} display="flex" alignItems="center">
                            <Checkbox
                                onChange={(e) => handleChange('c', e.target.checked)}
                                sx={{ color: '#fff', '&.Mui-checked': { color: '#007bff' } }}
                            />
                            <TextField
                                label={`Option ${'cText'}`}
                                fullWidth
                                variant="outlined"
                                onChange={(e) => handleChange('cText', e.target.value)}
                                value={formData['cText']}
                                sx={{ mb: 2, backgroundColor: '#444', borderRadius: 1, input: { color: '#fff' }, label: { color: '#aaa' } }}
                            />
                        </Box>

                        <Box key={'d'} display="flex" alignItems="center">
                            <Checkbox
                                onChange={(e) => handleChange('d', e.target.checked)}
                                sx={{ color: '#fff', '&.Mui-checked': { color: '#007bff' } }}
                            />
                            <TextField
                                label={`Option ${'dText'}`}
                                fullWidth
                                variant="outlined"
                                onChange={(e) => handleChange('dText', e.target.value)}
                                value={formData['dText']}
                                sx={{ mb: 2, backgroundColor: '#444', borderRadius: 1, input: { color: '#fff' }, label: { color: '#aaa' } }}
                            />
                        </Box>
                    </FormGroup>
                )}

                <FormControlLabel
                    control={<Switch checked={formData.shared} onChange={(e) => handleChange('shared', e.target.checked)} />}
                    label="Shared"
                    sx={{ mb: 2, color: '#fff' }}
                />

                {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}

                <Box display="flex" justifyContent="space-between">
                    <Button variant="contained" color="error" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button variant="contained" color="primary" onClick={handleSubmit} disabled={loading}>
                        {loading ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : 'Add'}
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default AddQuestionModal;
