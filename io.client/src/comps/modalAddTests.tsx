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
    width: 400,
    bgcolor: '#333',
    color: 'white',
    borderRadius: '16px',
    boxShadow: 24,
    p: 4,
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
        startTime: '',
        endTime: '',
        category: '',
    });

    const [error, setError] = useState('');

    const validateInputs = () => {
        if (!newTest.name || !newTest.startTime || !newTest.endTime || !newTest.category) {
            setError('All fields are required.');
            return false;
        }
        if (new Date(newTest.startTime) >= new Date(newTest.endTime)) {
            setError('Start time must be earlier than end time.');
            return false;
        }
        setError('');
        return true;
    };

    const handleAddTest = async () => {
        if (!validateInputs()) return;

        try {
            const response = await fetch('https://localhost:59127/api/test', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: newTest.name,
                    startTime: new Date(newTest.startTime).toISOString(), // Konwersja na ISO
                    endTime: new Date(newTest.endTime).toISOString(),     // Konwersja na ISO
                    category: newTest.category,
                    courseId, // courseId przekazany z props
                }),
            });

            if (response.ok) {
                const createdTest = await response.json();
                onAddTest(createdTest); // Dodanie testu do stanu w CourseTests
                handleClose(); // Zamkniêcie modala
                setNewTest({
                    name: '',
                    startTime: '',
                    endTime: '',
                    category: '',
                });
            } else {
                const errorMessage = await response.text();
                console.error(`Failed to add test: ${response.status} - ${errorMessage}`);
                setError('Failed to add test. Please try again.');
            }
        } catch (error) {
            console.error('Error adding test:', error);
            setError('An error occurred while adding the test.');
        }
    };

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
                {error && (
                    <Typography color="error" variant="body2" mb={2}>
                        {error}
                    </Typography>
                )}
                <TextField
                    fullWidth
                    label="Test Name"
                    variant="outlined"
                    value={newTest.name}
                    onChange={(e) => setNewTest({ ...newTest, name: e.target.value })}
                    sx={{ mb: 2 }}
                />
                <TextField
                    fullWidth
                    label="Start Date"
                    type="datetime-local"
                    InputLabelProps={{ shrink: true }}
                    inputProps={{ min: new Date().toISOString().slice(0, 16) }}
                    value={newTest.startTime}
                    onChange={(e) => setNewTest({ ...newTest, startTime: e.target.value })}
                    sx={{ mb: 2 }}
                />
                <TextField
                    fullWidth
                    label="End Date"
                    type="datetime-local"
                    InputLabelProps={{ shrink: true }}
                    inputProps={{ min: new Date().toISOString().slice(0, 16) }}
                    value={newTest.endTime}
                    onChange={(e) => setNewTest({ ...newTest, endTime: e.target.value })}
                    sx={{ mb: 2 }}
                />
                <TextField
                    fullWidth
                    label="Category"
                    variant="outlined"
                    value={newTest.category}
                    onChange={(e) => setNewTest({ ...newTest, category: e.target.value })}
                    sx={{ mb: 2 }}
                />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                    <Button variant="outlined" color="error" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button variant="contained" color="primary" onClick={handleAddTest}>
                        Add Test
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default ModalAddTest;
