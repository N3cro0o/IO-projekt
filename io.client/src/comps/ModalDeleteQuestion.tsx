import React from 'react';
import { Modal, Box, Typography, Button } from '@mui/material';

interface DeleteQuestionModalProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    questionName: string;
}

const DeleteQuestionModal: React.FC<DeleteQuestionModalProps> = ({ open, onClose, onConfirm, questionName }) => {
    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 400,
                bgcolor: 'background.paper',
                boxShadow: 24,
                p: 4,
                borderRadius: 2,
                textAlign: 'center'
            }}>
                <Typography variant="h6" mb={2}>Confirm Deletion</Typography>
                <Typography mb={2}>Are you sure you want to delete "{questionName}"?</Typography>
                <Box display="flex" justifyContent="space-between">
                    <Button variant="contained" color="secondary" onClick={onClose}>Cancel</Button>
                    <Button variant="contained" color="error" onClick={onConfirm}>Delete</Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default DeleteQuestionModal;
