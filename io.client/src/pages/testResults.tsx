import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ButtonAppBar } from '../comps/AppBar.tsx';

interface TestResult {
    userId: number;
    name: string;
    surname: string;
    email: string;
    passed: boolean;
}

interface TestInfo {
    testName: string;
}

const TestResults: React.FC = () => {
    const { courseId, testId } = useParams<{ courseId: string; testId: string }>();
    const [testInfo, setTestInfo] = useState<TestInfo | null>(null);
    const [results, setResults] = useState<TestResult[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTestData = async () => {
            try {
                const testResponse = await fetch(`https://localhost:59127/api/GenerateResultsRaports/${testId}`);
                if (!testResponse.ok) {
                    throw new Error(`HTTP status ${testResponse.status} - ${testResponse.statusText}`);
                }
                const testData: TestInfo = await testResponse.json();
                setTestInfo(testData);

                const resultsResponse = await fetch(`https://localhost:59127/api/GenerateResultsRaports/${testId}/results`);
                if (!resultsResponse.ok) {
                    throw new Error(`HTTP status ${resultsResponse.status} - ${resultsResponse.statusText}`);
                }
                const resultsData: TestResult[] = await resultsResponse.json();
                setResults(resultsData);
            } catch (error) {
                console.error("B��d podczas pobierania danych:", error);
                setError(error instanceof Error ? error.message : 'Nieznany b��d');
            } finally {
                setLoading(false);
            }
        };

        fetchTestData();
    }, [courseId, testId]);

    if (loading) {
        return <p style={{ color: 'white' }}>�adowanie wynik�w...</p>;
    }

    if (error) {
        return <p style={{ color: 'white' }}>Wyst�pi� b��d: {error}</p>;
    }

    const passedCount = results.filter(result => result.passed).length;
    const failedCount = results.length - passedCount;
    const passRate = results.length > 0 ? ((passedCount / results.length) * 100).toFixed(2) : '0';

    return (
        <div style={{ color: 'white' }}>
            <ButtonAppBar />
            <div style={{ display: 'flex', justifyContent: 'center', padding: '50px' }}>
                <div>
                    <h1>Wyniki testu: {testInfo?.testName}</h1>
                    <p><strong>Kurs:</strong> {courseId}</p>
                    <p><strong>Liczba uczni�w:</strong> {results.length}</p>
                    <p><strong>Zda�o:</strong> {passedCount}</p>
                    <p><strong>Nie zda�o:</strong> {failedCount}</p>
                    <p><strong>Procent zdawalno�ci:</strong> {passRate}%</p>
                </div>
            </div>
        </div>
    );
};

export default TestResults;
