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

    
    const ownerId = 1; // Zast¹p odpowiednim identyfikatorem zalogowanego u¿ytkownika 
    //przyda³o by sie sprawdzenie czy to nauczyciel choæ jesli to nie nauczyciel to nie wyswietli zadnego testu do sprawdzenia

    useEffect(() => {
        const fetchTests = async () => {
            try {
                const response = await fetch(`https://localhost:59127/api/EditQuestion/TestsList/${ownerId}/tests`);
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data: Test[] = await response.json();
                setTests(data);
                console.log('Fetched Tests:', data);//wyswietl w konsoli co znajduje sie w tablicy data
            } catch (err) {
                console.error("Error fetching tests:", err);
            }
        };

        fetchTests();
    }, [ownerId]);

    const handleTestClick = (testId: number) => {
        navigate(`/CheckTest/${testId}`);
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

                        <ListItem component="div" key={test.testId} onClick={() => handleTestClick(test.testId)}>
                            <ListItemText
                                primary={test.name}
                                secondary={`Category: ${test.category} | Start: ${test.startTime} | End: ${test.endTime}`}
                            />
                        </ListItem>
                    ))}
                </List>
            </Paper>
        </Container>
    );
};

export default TestsToCheck;
