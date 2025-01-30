import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Typography, Paper, Container, List, ListItem, ListItemText } from '@mui/material';

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

    const ownerId = 1;//(jest na sztywno)Ustawienie id uzytkownika DO POPRAWY

    useEffect(() => {
        const fetchTests = async () => {
            try {
                const response = await fetch(`https://localhost:59127/api/EditQuestion/TestsList/${ownerId}/tests`);
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data: Test[] = await response.json();
                setTests(data);
                console.log('Fetched Tests:', data);
            } catch (err) {
                console.error("Error fetching tests:", err);
            }
        };

        fetchTests();
    }, [ownerId]);

    const handleTestClick = (testId: number) => {
        navigate(`/CheckTest/${testId}`);
    };

    const handleSumTestClick = (testId: number, testName: string) => {
        
        navigate(`/SumTest/${testId}/${testName}`);
    };

    console.log("Current state of tests:", tests);
    if (tests.length === 0) return <div>Loading...</div>;

    return (
        <Container maxWidth="sm" sx={{ mt: 4 }}>
            <Paper sx={{ p: 3, backgroundColor: '#333', color: '#fff', borderRadius: 2 }}>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                    Available Tests
                </Typography>
                <List>
                    {tests.map((test) => (
                        <ListItem component="div" key={test.testId} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'start', mb: 2 }}>
                            <ListItemText
                                primary={test.name}
                                secondary={`Category: ${test.category} | Start: ${test.startTime} | End: ${test.endTime}`}
                            />
                            
                            <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                                <Button variant="contained" color="primary" onClick={() => handleTestClick(test.testId)}>
                                    Check Test
                                </Button>
                                <Button variant="contained" color="secondary" onClick={() => handleSumTestClick(test.testId,test.name)}>
                                    SumTest
                                </Button>
                            </Box>
                        </ListItem>
                    ))}
                </List>
            </Paper>
        </Container>
    );
};

export default TestsToCheck;
