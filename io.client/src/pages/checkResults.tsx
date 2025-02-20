import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Typography, Paper, Container, List, ListItem, ListItemText } from '@mui/material';
import { ButtonAppBar } from '../comps/AppBar.tsx';
interface TestResult {
    testName: string;
    category: string;
    points: number;
}

const CheckResults: React.FC = () => {
    const [results, setResults] = useState<TestResult[]>([]);
    const navigate = useNavigate();

    const userId = localStorage.getItem('userId'); // (na sztywno) Ustawienie ID użytkownika - DO POPRAWY

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
        <div>
            <ButtonAppBar />
            <div style={{ display: 'flex', justifyContent: 'center', padding: '50px' }}>
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
            </div>
        </div>
    );
};

export default CheckResults;
