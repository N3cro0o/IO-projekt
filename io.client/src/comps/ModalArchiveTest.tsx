import React, { useState } from 'react';
import { Modal, Box, Typography, Button, CircularProgress } from '@mui/material';

interface ArchiveTestModalProps {
    open: boolean;
    onClose: () => void;
    onConfirm: (archived: boolean) => void;
    testName: string;
    isArchived: boolean;
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
    color: 'white',
    '&:hover': { backgroundColor: '#777' },
};

const ArchiveTestModal: React.FC<ArchiveTestModalProps> = ({ open, onClose, onConfirm, testName, isArchived }) => {
    const [loading, setLoading] = useState(false);

    const handleArchive = async (archived: boolean) => {
        setLoading(true);
        try {
            // Symulacja API calla
            setTimeout(() => {
                onConfirm(archived);
            }, 1000);
        } catch (error) {
            console.error('Error while archiving test:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={modalStyle}>
                <Typography variant="h6" mb={2}>
                    {isArchived ? 'Unarchive' : 'Archive'} Test
                </Typography>
                <Typography mb={3}>
                    Are you sure you want to {isArchived ? 'unarchive' : 'archive'} the test "{testName}"?
                </Typography>
                <Box display="flex" justifyContent="space-between">
                    <Button variant="contained" color="error" sx={buttonStyle} onClick={onClose}>
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        sx={{
                            backgroundColor: isArchived ? '#ff9800' : '#007bff',
                            color: 'white',
                            '&:hover': { backgroundColor: isArchived ? '#e68900' : '#0056b3' },
                        }}
                        onClick={() => handleArchive(!isArchived)}
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : isArchived ? 'Unarchive' : 'Archive'}
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default ArchiveTestModal;
