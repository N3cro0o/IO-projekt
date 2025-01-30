import React, { useState } from 'react';
import { Modal, Box, Typography, Button, CircularProgress } from '@mui/material';

interface ArchiveTestModalProps {
    open: boolean;
    onClose: () => void;
    onConfirm: (archived: boolean) => void;
    testName: string;
    isArchived: boolean;
}

const ArchiveTestModal: React.FC<ArchiveTestModalProps> = ({ open, onClose, onConfirm, testName, isArchived }) => {
    const [loading, setLoading] = useState(false);

    const handleArchive = async (archived: boolean) => {
        setLoading(true);
        try {
            // Simulate API call to update archive status (Here, you would connect with your API)
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
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    backgroundColor: 'white',
                    padding: 4,
                    borderRadius: 2,
                    maxWidth: 400,
                    width: '100%',
                }}
            >
                <Typography variant="h6" gutterBottom>
                    {isArchived ? 'Unarchive' : 'Archive'} Test
                </Typography>
                <Typography variant="body1" gutterBottom>
                    Are you sure you want to {isArchived ? 'unarchive' : 'archive'} the test "{testName}"?
                </Typography>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
                    <Button onClick={onClose} variant="outlined" color="secondary">
                        Cancel
                    </Button>
                    <Button
                        onClick={() => handleArchive(!isArchived)}
                        variant="contained"
                        color={isArchived ? 'warning' : 'primary'}
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} color="inherit" /> : isArchived ? 'Unarchive' : 'Archive'}
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default ArchiveTestModal;
