import Button from '@mui/material/Button';
import { useEffect, useState } from 'react';
import { ButtonAppBar } from '../comps/AppBar.tsx';
import React from 'react';
import { useNavigate } from 'react-router-dom';

export const TestView = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const [tests, setTests] = useState<Test[]>([]);
    const navigate = useNavigate(); // u¿ywamy useNavigate do nawigacji

    interface Test {
        id: number;
        name: string;
        category: string;
    }

    const transformTestData = (apiData: any[]): Test[] => {
        return apiData.map((test) => ({
            id: test.testid,
            name: test.testName,
            category: test.testCategory,
        }));
    };

    useEffect(() => {
        const fetchTests = async () => {
            try {
                const userId = localStorage.getItem('userId');
                console.log('User ID from localStorage:', userId);

                const response = await fetch('https://localhost:7293/api/TestViev/ListTest/' + userId);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const apiData = await response.json();
                const transformedData = transformTestData(apiData);
                setTests(transformedData);
            } catch (error) {
                console.error('Error fetching tests:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchTests();
    }, []);

    const handleStartTest = (testId: number) => {
        navigate(`/test-solver/${testId}`); // Nawigacja do TestSolver z parametrem testId
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <ButtonAppBar />
            <div style={{ display: 'flex', justifyContent: 'center', padding: '50px' }}>
                <div style={{ width: '100%', maxWidth: '1200px' }}>
                    <h1 style={{ color: 'white', textAlign: 'center' }}>Test Panel</h1>
                    <table
                        style={{
                            borderCollapse: 'collapse',
                            width: '100%',
                            backgroundColor: '#333',
                            color: '#fff',
                            borderRadius: '8px',
                            overflow: 'hidden',
                            tableLayout: 'fixed',
                        }}
                    >
                        <thead>
                            <tr style={{ borderBottom: '2px solid #555' }}>
                                <th style={{ padding: '10px' }}>Test Name</th>
                                <th style={{ padding: '10px' }}>Category</th>
                                <th style={{ padding: '10px' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tests.map((test) => (
                                <tr key={test.id} style={{ borderBottom: '1px solid #555' }}>
                                    <td style={{ padding: '10px' }}>{test.name}</td>
                                    <td style={{ padding: '10px' }}>{test.category}</td>
                                    <td style={{ padding: '10px', display: 'flex', justifyContent: 'center' }}>
                                        <Button
                                            onClick={() => handleStartTest(test.id)}
                                            variant="contained"
                                            color="primary"
                                        >
                                            Start Test
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default TestView;
