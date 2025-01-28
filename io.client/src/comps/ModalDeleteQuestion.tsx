import React from 'react';
import { Modal, Box, Typography, Button } from '@mui/material';

interface DeleteQuestionModalProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    questionName: string;
}

const modalStyle = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '90%',
    maxWidth: 400,
    bgcolor: '#444',
    color: 'white',
    borderRadius: '16px',
    boxShadow: 24,
    p: 4,
    textAlign: 'center',
};

const buttonStyle = {
    backgroundColor: '#555',
    color: 'white',
    '&:hover': { backgroundColor: '#777' },
};

const DeleteQuestionModal: React.FC<DeleteQuestionModalProps> = ({ open, onClose, onConfirm, questionName }) => {
    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={modalStyle}>
                <Typography variant="h6" mb={2}>Confirm Deletion</Typography>
                <Typography mb={3}>Are you sure you want to delete "{questionName}"?</Typography>
                <Box display="flex" justifyContent="space-between">
                    <Button
                        variant="contained"
                        
                        onClick={onClose}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        sx={{
                            backgroundColor: '#ff4d4f',
                            color: 'white',
                            '&:hover': { backgroundColor: '#d9363e' },
                        }}
                        onClick={onConfirm}
                    >
                        Delete
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default DeleteQuestionModal;
