import Button from '@mui/material/Button';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Do nawigacji miêdzy stronami

interface Test {
    id: number;
    name: string;
    description: string;
}

export const UserTests = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const [tests, setTests] = useState<Test[]>([]);
    const navigate = useNavigate();

    const fetchUserTests = async () => {
        try {
            const userId = localStorage.getItem('userId'); // Pobierz ID u¿ytkownika
            const response = await fetch('https://localhost:7293/api/TestsManager/listTests/' + userId);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const apiData = await response.json();
            const transformedTests = apiData.map((test: any) => ({
                id: test.testId,
                name: test.testName,
                description: test.testDescription,
            }));
            setTests(transformedTests);
        } catch (error) {
            console.error('Error fetching user tests:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserTests();
    }, []);

    const handleStartTest = (testId: number) => {
        // Przekierowanie do komponentu, gdzie rozpoczyna siê test
        navigate(`/start-test/${testId}`);
    };

    if (loading) {
        return (<div>Loading...</div>);
    }

    return (
        <div style= {{ padding: '20px' }}>
    <h1 style={ { color: 'white', textAlign: 'center' } }> Your Tests </h1>
        < table
style = {{
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
    <tr style={ { borderBottom: '2px solid #555' } }>
        <th style={ { padding: '10px' } }> Test Name </th>
            < th style = {{ padding: '10px' }}> Description </th>
                < th style = {{ padding: '10px' }}> Actions </th>
                    </tr>
                    </thead>
                    <tbody>
{
    tests.map((test) => (
        <tr key= { test.id } style = {{ borderBottom: '1px solid #555' }}>
            <td style={ { padding: '10px' } }> { test.name } </td>
                < td style = {{ padding: '10px' }}> { test.description } </td>
                    < td style = {{ padding: '10px' }}>
                        <Button
                                    onClick={ () => handleStartTest(test.id) }
variant = "contained"
color = "primary"
    >
    Start Test
        </Button>
        </td>
        </tr>
                    ))}
</tbody>
    </table>
    </div>
    );
};

export default UserTests;
