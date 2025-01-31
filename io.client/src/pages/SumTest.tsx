import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { ButtonAppBar } from '../comps/AppBar.tsx';
interface UserScore {
    userId: number;  // Identyfikator u¿ytkownika
    userName: string;  // Nazwa u¿ytkownika
    totalPoints: number;  // Suma punktów zdobytych przez u¿ytkownika
}

const SumTest: React.FC = () => {
    console.log('odpala sumTest');
    const [userScores, setUserScores] = useState<UserScore[]>([]);
    const { testId, testName } = useParams<{ testId: string, testName: string }>();

    useEffect(() => {
        const fetchTestData = async () => {
            if (!testId) {
                console.error('No testId provided!');
                return;
            }

            try {
                // Pobieramy dane o u¿ytkownikach i punktach
                const scoreResponse = await fetch(`https://localhost:59127/api/GenerateResultsRaports/GetUserScores/${testId}`);
                const scoreResponseText = await scoreResponse.text(); // Odczytujemy odpowiedŸ jako tekst
                console.log("Score Response:", scoreResponseText); // Logowanie odpowiedzi

                if (!scoreResponse.ok) {
                    throw new Error(`HTTP error! status: ${scoreResponse.status}`);
                }

                const scoresData: UserScore[] = JSON.parse(scoreResponseText); // Rêczne parsowanie odpowiedzi
                setUserScores(scoresData); // Ustawiamy dane o punktach u¿ytkowników
            } catch (err) {
                console.error('Error fetching test data:', err);
            }
        };


        fetchTestData();
    }, [testId]);

    if (userScores.length === 0) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <ButtonAppBar />
            <div style={{ display: 'flex', justifyContent: 'center', padding: '50px' }}>
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Paper sx={{ p: 3, backgroundColor: '#333', color: '#fff', borderRadius: 2 }}>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                    {testName}
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
            </div>
        </div>
    );
};

export default SumTest;
