import React, { useState } from 'react';
import { Box, Button, Modal, Typography, CircularProgress } from '@mui/material';

interface DeleteQuestionModalProps {
    testId: number;  // 🔥 Dodano testId, ponieważ jest wymagane w kontrolerze
    questionId: number;
    onClose: () => void;
    onQuestionDeleted: () => void;
}

const DeleteQuestionModal: React.FC<DeleteQuestionModalProps> = ({
    testId,
    questionId,
    onClose,
    onQuestionDeleted
}) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleDelete = async () => {
        setLoading(true);
        setError('');

        try {
            const response = await fetch(`/api/DeleteQuestion/${testId}/${questionId}`, { // 🔥 Dostosowana ścieżka
                method: 'DELETE',
            });

            if (!response.ok) {
                const errorMessage = await response.text();
                throw new Error(errorMessage);
            }

            onQuestionDeleted();
            onClose();
        } catch (err) {
            console.error(err);
            setError('Failed to delete question. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal open onClose={onClose}>
            <Box sx={{ backgroundColor: '#fff', padding: '20px', margin: 'auto', width: '400px', borderRadius: '8px' }}>
                <Typography variant="h6" mb={2}>Confirm Deletion</Typography>
                <Typography mb={2}>Are you sure you want to delete this question?</Typography>
                {error && <Typography color="error">{error}</Typography>}
                <Box mt={2} display="flex" justifyContent="flex-end">
                    <Button onClick={onClose} sx={{ marginRight: '10px' }}>Cancel</Button>
                    <Button variant="contained" color="error" onClick={handleDelete} disabled={loading}>
                        {loading ? <CircularProgress size={24} /> : 'Delete'}
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default DeleteQuestionModal;
