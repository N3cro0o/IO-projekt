import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Typography, Paper, Container, List, ListItem, ListItemText } from '@mui/material';

interface TestResult {
    testName: string;
    category: string;
    points: number;
}

const CheckResults: React.FC = () => {
    const [results, setResults] = useState<TestResult[]>([]);
    const navigate = useNavigate();

    const userId = 44; // (na sztywno) Ustawienie ID u¿ytkownika - DO POPRAWY

    useEffect(() => {
        const fetchResults = async () => {
            try {
                console.log('Odpala passata');
                const response = await fetch(`https://localhost:59127/api/GenerateResultsRaports/Results/${userId}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data: TestResult[] = await response.json();
                setResults(data);
                console.log('Fetched Results:', data);
            } catch (err) {
                console.error("Error fetching results:", err);
            }
        };

        fetchResults();
    }, [userId]);

    if (results.length === 0) return <div>Loading...</div>;

    return (
        <Container maxWidth="sm" sx={{ mt: 4 }}>
            <Paper sx={{ p: 3, backgroundColor: '#333', color: '#fff', borderRadius: 2 }}>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                    Test Results
                </Typography>
                <List>
                    {results.map((result, index) => (
                        <ListItem component="div" key={index} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'start', mb: 2 }}>
                            <ListItemText
                                primary={result.testName}
                                secondary={`Category: ${result.category} | Points: ${result.points}`}
                            />
                        </ListItem>
                    ))}
                </List>
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                    <Button variant="contained" color="primary" onClick={() => navigate(-1)}>
                        Back
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
};

export default CheckResults;
