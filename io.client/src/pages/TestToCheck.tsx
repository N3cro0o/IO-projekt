import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Typography, Paper, Container, List, ListItem, ListItemText } from '@mui/material';

interface Test {
    TestId: number;
    Name: string;
    StartTime: string;
    EndTime: string;
    Category: string;
    CourseId: number;
}

const TestsToCheck: React.FC = () => {
    const [tests, setTests] = useState<Test[]>([]);
    const navigate = useNavigate();

    
    const ownerId = 1; // Zast¹p odpowiednim identyfikatorem zalogowanego u¿ytkownika

    useEffect(() => {
        const fetchTests = async () => {
            try {
                const response = await fetch(`https://localhost:59127/api/EditQuestion/TestsList/${ownerId}/tests`);
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data: Test[] = await response.json();
                setTests(data);
            } catch (err) {
                console.error("Error fetching tests:", err);
            }
        };

        fetchTests();
    }, [ownerId]);

    const handleTestClick = (testId: number) => {
        navigate(`/CheckTest/${testId}`);
    };

    if (tests.length === 0) return <div>Loading...</div>;

    return (
        <Container maxWidth="sm" sx={{ mt: 4 }}>
            <Paper sx={{ p: 3, backgroundColor: '#333', color: '#fff', borderRadius: 2 }}>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                    Available Tests
                </Typography>
                <List>
                    {tests.map((test) => (
                        <ListItem button key={test.TestId} onClick={() => handleTestClick(test.TestId)}>
                            <ListItemText
                                primary={test.Name}
                                secondary={`Category: ${test.Category} | Start: ${test.StartTime} | End: ${test.EndTime}`}
                            />
                        </ListItem>
                    ))}
                </List>
            </Paper>
        </Container>
    );
};

export default TestsToCheck;
