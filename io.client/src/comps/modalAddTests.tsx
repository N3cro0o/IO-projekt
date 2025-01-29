import React, { useState } from 'react';
import {
    Box,
    Typography,
    Modal,
    TextField,
    Button,
} from '@mui/material';

const modalStyle = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '90%',
    maxWidth: 500,
    bgcolor: '#444',
    color: 'white',
    borderRadius: '16px',
    boxShadow: 24,
    p: 4,
};

const inputStyle = {
    mb: 2,
    '& .MuiInputLabel-root': { color: 'white' },
    '& .MuiOutlinedInput-root': {
        '& fieldset': { borderColor: '#555' },
        '&:hover fieldset': { borderColor: '#777' },
        '&.Mui-focused fieldset': { borderColor: '#007bff' },
        backgroundColor: '#333',
        color: 'white',
    },
};

interface ModalAddTestProps {
    open: boolean;
    handleClose: () => void;
    courseId: number;
    onAddTest: (test: any) => void;
}

const ModalAddTest: React.FC<ModalAddTestProps> = ({ open, handleClose, courseId, onAddTest }) => {
    const [newTest, setNewTest] = useState({
        name: '',
        category: '',
        startTime: '',
        endTime: '',
        questionType: 'open',
    });

    const handleAddTest = async () => {
        try {
            const response = await fetch(`https://localhost:59127/api/TestManager/AddTest`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...newTest,
                    courseId,
                }),
            });

            if (response.ok) {
                const createdTest = await response.json();
                onAddTest(createdTest);
                handleClose();
                setNewTest({
                    name: '',
                    category: '',
                    startTime: '',
                    endTime: '',
                    questionType: 'open',
                });
            } else {
                console.error(`Failed to add test: ${response.status}`);
            }
        } catch (error) {
            console.error('Error adding test:', error);
        }
    };

    const getCurrentDateTime = (): string => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const date = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${date}T${hours}:${minutes}`;
    };

    const minDateTime = getCurrentDateTime();

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-add-test"
            aria-describedby="modal-add-test-description"
        >
            <Box sx={modalStyle}>
                <Typography variant="h6" mb={2}>
                    Add New Test
                </Typography>
                <TextField
                    fullWidth
                    label="Test Name"
                    variant="outlined"
                    value={newTest.name}
                    onChange={(e) => setNewTest({ ...newTest, name: e.target.value })}
                    sx={inputStyle}
                />
                <TextField
                    fullWidth
                    label="Start Date"
                    type="datetime-local"
                    InputLabelProps={{ shrink: true }}
                    value={newTest.startTime}
                    onChange={(e) => setNewTest({ ...newTest, startTime: e.target.value })}
                    sx={inputStyle}
                    inputProps={{ min: minDateTime }}
                />
                <TextField
                    fullWidth
                    label="End Date"
                    type="datetime-local"
                    InputLabelProps={{ shrink: true }}
                    value={newTest.endTime}
                    onChange={(e) => setNewTest({ ...newTest, endTime: e.target.value })}
                    sx={inputStyle}
                    inputProps={{ min: minDateTime }}
                />
                <TextField
                    fullWidth
                    label="Category"
                    variant="outlined"
                    value={newTest.category}
                    onChange={(e) => setNewTest({ ...newTest, category: e.target.value })}
                    sx={inputStyle}
                />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={handleClose}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        sx={{
                            backgroundColor: '#007bff',
                            '&:hover': { backgroundColor: '#0056b3' },
                        }}
                        onClick={handleAddTest}
                    >
                        Add Test
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default ModalAddTest;
