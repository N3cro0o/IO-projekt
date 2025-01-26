import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box,
    Button,
    CircularProgress,
    TextField,
    Typography,
    Paper,
} from '@mui/material';
import { ButtonAppBar } from '../comps/AppBar.tsx';

const SetTestTimePage: React.FC = () => {
    const { testId } = useParams<{ testId: string }>();
    const navigate = useNavigate();

    const [startTime, setStartTime] = useState<string>('');
    const [endTime, setEndTime] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchTestTime = async () => {
            try {
                const response = await fetch(``);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setStartTime(data.startTime);
                setEndTime(data.endTime);
            } catch (error) {
                console.error('Error fetching test details:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTestTime();
    }, [testId]);

    const handleSaveTime = async () => {
        const now = new Date().toISOString();

        if (new Date(startTime) < new Date(now)) {
            alert('Start time cannot be in the past.');
            return;
        }

        if (new Date(endTime) <= new Date(startTime)) {
            alert('End time must be later than start time.');
            return;
        }

        try {
            const response = await fetch(`https://localhost:59127/api/TestManager/SetTestTime/${testId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    startTime,
                    endTime,
                }),
            });

            if (response.ok) {
                alert('Test time saved successfully.');
                navigate(-1);
            } else {
                const errorMessage = await response.text();
                alert(`Error saving test time: ${errorMessage}`);
            }
        } catch (error) {
            console.error('Error saving test time:', error);
        }
    };


    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <div>
            <ButtonAppBar />
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingTop: '60px',
                }}
            >
                <Paper
                    elevation={3}
                    sx={{
                        padding: '32px',
                        width: '100%',
                        maxWidth: '400px',
                        backgroundColor: '#444', // Ciemnoszare t³o kontenera
                        borderRadius: '8px',
                        boxShadow: 2,
                    }}
                >
                    <Typography
                        variant="h6"
                        color="white"
                        align="center"
                        sx={{ marginBottom: '20px' }}
                    >
                        Set Test Time
                    </Typography>
                    <Box component="form" sx={{ mt: 2 }}>
                        <TextField
                            label="Start Time"
                            type="datetime-local"
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                            sx={{
                                marginBottom: '16px',
                                '& .MuiInputLabel-root': { color: 'white' },
                                '& .MuiInputBase-root': {
                                    backgroundColor: '#333',
                                    color: 'white',
                                },
                            }}
                        />
                        <TextField
                            label="End Time"
                            type="datetime-local"
                            value={endTime}
                            onChange={(e) => setEndTime(e.target.value)}
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                            sx={{
                                marginBottom: '16px',
                                '& .MuiInputLabel-root': { color: 'white' },
                                '& .MuiInputBase-root': {
                                    backgroundColor: '#333',
                                    color: 'white',
                                },
                            }}
                        />
                        <Button
                            fullWidth
                            variant="contained"
                            sx={{
                                color: '#fff',
                                backgroundColor: '#007bff',
                                '&:hover': { backgroundColor: '#0056b3' },
                                marginTop: '20px',
                            }}
                            onClick={handleSaveTime}
                        >
                            Save
                        </Button>
                        <Button
                            fullWidth
                            color="error"
                            variant="contained"
                            sx={{
                                color: '#fff',
                                borderColor: '#007bff',
                                '&:hover': { borderColor: '#0056b3' },
                                marginTop: '10px',
                            }}
                            onClick={() => navigate(-1)}
                        >
                            Cancel
                        </Button>
                    </Box>
                </Paper>
            </Box>
        </div>
    );
};

export default SetTestTimePage;
