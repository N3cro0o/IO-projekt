import React, { useState } from 'react';
import { Modal, Box, Typography, Button, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface DeleteAccountModalProps {
    open: boolean;
    onClose: () => void;
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

const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({ open, onClose }) => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const userId = localStorage.getItem('userId');

    const handleDelete = async () => {
        try {
            const response = await fetch(`https://localhost:7293/api/Account/DeleteAccount/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    Password: password,
                }),
            });

            if (response.ok) {
                alert("Account deleted successfully!");
                localStorage.removeItem('authToken');
                localStorage.removeItem('userId');
                navigate('/');
            } else {
                const errorData = await response.json();
                setError(errorData.message || "Error deleting account.");
            }
        } catch (err: any) {
            setError(err.message || "Error deleting account.");
        }
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={modalStyle}>
                <Typography variant="h6" mb={2}>Confirm Account Deletion</Typography>
                <Typography mb={2} color="error">
                    This action is irreversible! Enter your password to confirm.
                </Typography>

                <TextField
                    fullWidth
                    type="password"
                    variant="outlined"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    sx={{ bgcolor: 'white', borderRadius: 1, mb: 2 }}
                />
                {error && <Typography color="error">{error}</Typography>}

                <Box display="flex" justifyContent="space-between" mt={2}>
                    <Button variant="contained" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        sx={{
                            backgroundColor: '#ff4d4f',
                            color: 'white',
                            '&:hover': { backgroundColor: '#d9363e' },
                        }}
                        onClick={handleDelete}
                    >
                        Delete
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default DeleteAccountModal;
