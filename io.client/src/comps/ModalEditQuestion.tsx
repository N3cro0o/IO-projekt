import React, { useState, useEffect } from 'react';
import {
    Modal,
    Box,
    Typography,
    TextField,
    Button,
    FormControlLabel,
    Checkbox,
    FormGroup,
    Switch,
    MenuItem,
    CircularProgress,
} from '@mui/material';

interface Question {
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
interface QuestToTake {
    QuestionId: number;
    Name: string;
    Category: string;
    QuestionType: string;
    Shared: boolean;
    MaxPoints: number
    Answer: string;
    A: boolean
    B: boolean;
    C: boolean;
    D: boolean;
    QuestionBody: string;
}

interface Question1 {
    answersClosed: string;
    category: string;
    key: number;
    id: number;
    name: string;
    points: number;
    type: string;
    text: string;
    shared: boolean;
}

interface EditQuestionModalProps {
    open: boolean;
    question: QuestToTake;
    onClose: () => void;
    onQuestionUpdated: () => void;
}

const mapQuestion = (apiData: any): Question1 => {
    return apiData.map((quest) => ({
        answersClosed: quest.answers,
        category: quest.category,
        key: quest.correctAnswers,
        id: quest.id,
        name: quest.name,
        points: quest.points,
        type: quest.questionType,
        text: quest.text,
        shared: quest.shared
    }));
}

const EditQuestionModal: React.FC<EditQuestionModalProps> = ({
    open,
    question,
    onClose,
    onQuestionUpdated,
}) => {
    const [formData, setFormData] = useState<Question>();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const handleChange = (field: keyof Question, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    useEffect(() => {
        const fetchQuestion = async () => {
            try {
                const qqidd = localStorage.getItem('questID');
                const response = await fetch(`https://localhost:59127/api/Question/FRANEKGPT/getID/${qqidd}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                const quest = mapQuestion(data);
                const str = quest.answersClosed.split('\n');

                const a = ((quest.key & 1 << 3) >> 3) == 1;
                const b = ((quest.key & 1 << 2) >> 2) == 1;
                const c = ((quest.key & 1 << 1) >> 1) == 1;
                const d = ((quest.key & 1 << 0) >> 0) == 1;

                const exitQuestion = {
                    name: quest.name,
                    category: quest.category,
                    questionType: quest.category,
                    shared: quest.shared,
                    answer: "",
                    b: b,
                    a: a,
                    c: c,
                    d: d,
                    bText: str[0],
                    aText: str[1],
                    cText: str[2],
                    dText: str[3],
                    questionBody: quest.text,
                    maxPoints: quest.points,
                }
                setFormData(exitQuestion);
                setLoading(false);
            }
            catch (err) {
                console.error(err);
                setError(err);
            }
        }

        fetchQuestion();
    },);

    const handleSubmit = async () => {

        try {
            const response = await fetch(`/api/EditQuestion/EditQuestionByName/${encodeURIComponent(name)}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },

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

    if (loading) return <div>loading...</div>

    return (
        <Modal open={open} onClose={onClose}>
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
                    Edit Question
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

export default EditQuestionModal;
