import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Typography, Paper, Container, List, ListItem, ListItemText, Divider } from '@mui/material';
import { ButtonAppBar } from '../comps/AppBar.tsx';

interface Test {
    testId: number;
    name: string;
    startTime: string;
    endTime: string;
    category: string;
    courseId: number;
}

const TestsToCheck: React.FC = () => {
    const [tests, setTests] = useState<Test[]>([]);
    const navigate = useNavigate();
    const ownerId = localStorage.getItem('userId'); // TODO: Pobieranie prawdziwego ID u¿ytkownika

    useEffect(() => {
        const fetchTests = async () => {
            try {
                const response = await fetch(`https://localhost:59127/api/GenerateResultsRaports/TestsList/${ownerId}/tests`);
                if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

                const data: Test[] = await response.json();
                setTests(data);
                console.log('Fetched Tests:', data);
            } catch (err) {
                console.error("Error fetching tests:", err);
            }
        };

        fetchTests();
    }, [ownerId]);

    const handleTestClick = (testId: number) => navigate(`/CheckTest/${testId}`);
    const handleSumTestClick = (testId: number, testName: string) => navigate(`/SumTest/${testId}/${testName}`);

    if (tests.length === 0) return <div>Loading...</div>;

    return (
        <div>
            <ButtonAppBar />
            <Container maxWidth="md" sx={{ mt: 4, display: 'flex', justifyContent: 'center', marginTop: "60px" }}>
                <Paper sx={{ p: 4, backgroundColor: '#222', color: '#fff', borderRadius: 2, width: '100%' }}>
                    <Typography variant="h5" fontWeight="bold" gutterBottom>
                        Tests List
                    </Typography>

                    <List>
                        {tests.map((test, index) => (
                            <React.Fragment key={test.testId}>
                                <ListItem sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                                    <ListItemText
                                        primary={
                                            <Typography variant="h6" sx={{ color: '#ddd', fontWeight: 'bold' }}>
                                                {test.name}
                                            </Typography>
                                        }
                                        secondary={
                                            <Typography variant="body2" sx={{ color: '#aaa' }}>
                                                {test.category} | Start: {test.startTime} | End: {test.endTime}
                                            </Typography>
                                        }
                                    />
                                    <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                                        <Button
                                            variant="contained"
                                            onClick={() => handleTestClick(test.testId)}
                                            sx={{
                                                backgroundColor: '#0072ff',
                                                '&:hover': { backgroundColor: '#005ecb' },
                                            }}
                                        >
                                            Check Test
                                        </Button>
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            onClick={() => handleSumTestClick(test.testId, test.name)}
                                        >
                                            SUM UP
                                        </Button>
                                    </Box>
                                </ListItem>
                                {index < tests.length - 1 && <Divider sx={{ bgcolor: '#444' }} />}
                            </React.Fragment>
                        ))}
                    </List>
                </Paper>
            </Container>
        </div>
    );
};

export default TestsToCheck;
