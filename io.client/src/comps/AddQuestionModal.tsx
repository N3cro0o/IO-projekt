import React, { useState } from 'react';
import { Box, Button, Modal, TextField, Typography, CircularProgress, Switch, FormControlLabel } from '@mui/material';

interface NewQuestion {
    questionId: number;
    name: string;
    category: string;
    questionType: string; // "open" lub "close"
    shared: boolean;
}

const AddQuestionModal: React.FC<{ testId: string; onClose: () => void; onQuestionAdded: () => void; }> = ({ testId, onClose, onQuestionAdded }) => {
    const [formData, setFormData] = useState<NewQuestion>({
        questionId: 0,
        name: '',
        category: '',
        questionType: 'open',
        shared: false,
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (field: keyof NewQuestion, value: any) => {
        setFormData({ ...formData, [field]: value });
    };

    const handleSubmit = async () => {
        if (!formData.name || !formData.category || !formData.questionType) {
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

            const addedQuestion = await response.json();
            console.log("New question added:", addedQuestion);

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
            <Box sx={{ backgroundColor: '#fff', padding: '20px', margin: 'auto', width: '400px', borderRadius: '8px' }}>
                <Typography variant="h6" mb={2}>Add New Question</Typography>

                <TextField
                    label="Name"
                    fullWidth
                    margin="normal"
                    onChange={(e) => handleChange('name', e.target.value)}
                    value={formData.name}
                />
                <TextField
                    label="Category"
                    fullWidth
                    margin="normal"
                    onChange={(e) => handleChange('category', e.target.value)}
                    value={formData.category}
                />
                <TextField
                    select
                    label="Type"
                    fullWidth
                    margin="normal"
                    value={formData.questionType}
                    onChange={(e) => handleChange('questionType', e.target.value)}
                    SelectProps={{
                        native: true,
                    }}
                >
                    <option value="open">Open</option>
                    <option value="close">Close</option>
                </TextField>

                <FormControlLabel
                    control={
                        <Switch
                            checked={formData.shared}
                            onChange={(e) => handleChange('shared', e.target.checked)}
                        />
                    }
                    label="Shared"
                />

                {error && <Typography color="error">{error}</Typography>}

                <Box mt={2} display="flex" justifyContent="flex-end">
                    <Button onClick={onClose} sx={{ marginRight: '10px' }}>Cancel</Button>
                    <Button variant="contained" color="primary" onClick={handleSubmit} disabled={loading}>
                        {loading ? <CircularProgress size={24} /> : 'Add Question'}
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default AddQuestionModal;
