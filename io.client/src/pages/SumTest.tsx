import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Container, Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

interface UserScore {
    userId: number;  // Identyfikator u¿ytkownika
    userName: string;  // Nazwa u¿ytkownika
    totalPoints: number;  // Suma punktów zdobytych przez u¿ytkownika
}

const SumTest: React.FC = () => {
    const [testTitle, setTestTitle] = useState<string>('');
    const [userScores, setUserScores] = useState<UserScore[]>([]);
    const { testId } = useParams<{ testId: string }>();

    useEffect(() => {
        const fetchTestData = async () => {
            if (!testId) {
                console.error('No testId provided!');
                return;
            }

            try {
                // Pobieramy dane o teœcie
                const testResponse = await fetch(`https://localhost:59127/api/GenerateResultsRaports/TestTitle/${testId}`);
                if (!testResponse.ok) {
                    throw new Error(`HTTP error! status: ${testResponse.status}`);
                }
                const testData = await testResponse.json();
                setTestTitle(testData.title); // Zak³adamy, ¿e odpowiedŸ zawiera tytu³ testu

                // Pobieramy dane o u¿ytkownikach i punktach
                const scoreResponse = await fetch(`https://localhost:59127/api/GenerateResultsRaports/GetUserScores/${testId}`);
                if (!scoreResponse.ok) {
                    throw new Error(`HTTP error! status: ${scoreResponse.status}`);
                }
                const scoresData: UserScore[] = await scoreResponse.json();
                setUserScores(scoresData); // Ustawiamy dane o punktach u¿ytkowników
            } catch (err) {
                console.error('Error fetching test data:', err);
            }
        };

        fetchTestData();
    }, [testId]);

    if (!testTitle || userScores.length === 0) {
        return <div>Loading...</div>;
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Paper sx={{ p: 3, backgroundColor: '#333', color: '#fff', borderRadius: 2 }}>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                    {testTitle}
                </Typography>

                <TableContainer component={Paper} sx={{ mt: 2, backgroundColor: '#444' }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 'bold', color: '#fff' }}>Username</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', color: '#fff' }}>Points</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {userScores.map((userScore, index) => (
                                <TableRow key={index}>
                                    <TableCell sx={{ color: '#fff' }}>{userScore.userName}</TableCell>
                                    <TableCell sx={{ color: '#fff' }}>{userScore.totalPoints}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </Container>
    );
};

export default SumTest;
