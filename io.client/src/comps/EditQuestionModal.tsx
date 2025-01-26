import React, { useState, useEffect } from 'react';
import { Box, Typography, Modal, TextField, Button } from '@mui/material';

const modalStyle = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: '#333',
    color: 'white',
    borderRadius: '16px',
    boxShadow: 24,
    p: 4,
};

interface EditQuestionModalProps {
    open: boolean;
    handleClose: () => void;
    question: {
        id: number;
        name: string;
        category: string;
        questionType: string;
        shared: boolean;
    };
    onSave: (updatedQuestion: any) => void;
}

const EditQuestionModal: React.FC<EditQuestionModalProps> = ({
    open,
    handleClose,
    question,
    onSave,
}) => {
    const [editedQuestion, setEditedQuestion] = useState(question);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setEditedQuestion(question);
    }, [question]);

    const handleSave = async () => {
        setSaving(true);
        setError(null);

        try {
            const response = await fetch(`/api/EditQuestion/${question.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editedQuestion),
            });

            if (!response.ok) {
                throw new Error(`Failed to update question: ${response.statusText}`);
            }

            const updatedData = await response.json();
            onSave(updatedData); // Aktualizujemy dane w stanie g³ównej strony
            handleClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
        } finally {
            setSaving(false);
        }
    };

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-edit-question"
            aria-describedby="modal-edit-question-description"
        >
            <Box sx={modalStyle}>
                <Typography variant="h6" mb={2}>
                    Edit Question {question.id}
                </Typography>
                {error && <Typography color="error">{error}</Typography>}
                <TextField
                    fullWidth
                    label="Question Content"
                    variant="outlined"
                    value={editedQuestion.name}
                    onChange={(e) =>
                        setEditedQuestion({ ...editedQuestion, name: e.target.value })
                    }
                    sx={{ mb: 2 }}
                />
                <TextField
                    fullWidth
                    label="Category"
                    variant="outlined"
                    value={editedQuestion.category}
                    onChange={(e) =>
                        setEditedQuestion({ ...editedQuestion, category: e.target.value })
                    }
                    sx={{ mb: 2 }}
                />
                <TextField
                    fullWidth
                    label="Question Type"
                    variant="outlined"
                    value={editedQuestion.questionType}
                    onChange={(e) =>
                        setEditedQuestion({ ...editedQuestion, questionType: e.target.value })
                    }
                    sx={{ mb: 2 }}
                />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                    <Button variant="outlined" color="error" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSave}
                        disabled={saving}
                    >
                        {saving ? 'Saving...' : 'Save Changes'}
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default EditQuestionModal;
