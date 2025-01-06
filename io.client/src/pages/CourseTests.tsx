import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './CourseTests.css';

interface Test {
    testId: number;
    name: string;
    startTime: string;
    endTime: string;
    category: string;
    courseId: number;
}

const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Miesi¹ce s¹ indeksowane od 0
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${day}-${month}-${year} ; ${hours}:${minutes}:${seconds}`;
};

const CourseTests: React.FC = () => {
    const { courseId } = useParams<{ courseId: string }>();
    const navigate = useNavigate();
    const [tests, setTests] = useState<Test[]>([]);
    const [loading, setLoading] = useState(true);
    const [startedTest, setStartedTest] = useState<string | null>(null);
    const [deletedTest, setDeletedTest] = useState<string | null>(null);

    useEffect(() => {
        const fetchTests = async () => {
            try {
                const response = await fetch(`https://localhost:59127/api/test/${courseId}/tests`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data: Test[] = await response.json();
                setTests(data);
            } catch (error) {
                console.error("B³¹d podczas pobierania testów:", error);
                setTests([]);
            } finally {
                setLoading(false);
            }
        };

        fetchTests();
    }, [courseId]);

    const handleStartTest = async (testName: string, testId: number) => {
        try {
            const response = await fetch(`https://localhost:59127/api/starttest/${testId}`, {
                method: 'PUT',
            });

            if (response.ok) {
                setStartedTest(testName);
                setTests((prevTests) =>
                    prevTests.map((test) =>
                        test.testId === testId
                            ? {
                                ...test,
                                startTime: new Date().toISOString(),
                                endTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString()
                            }
                            : test
                    )
                );
            } else {
                console.error(`Failed to start test: ${response.status}`);
            }
        } catch (error) {
            console.error("Error starting test:", error);
        } finally {
            setTimeout(() => setStartedTest(null), 5000);
        }
    };

    const handleDeleteTest = async (testId: number, testName: string) => {
        const confirmDelete = window.confirm(`Czy na pewno chcesz usun¹æ test "${testName}"?`);
        if (!confirmDelete) return;

        try {
            const response = await fetch(`https://localhost:59127/api/deletetest/${testId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setTests((prevTests) => prevTests.filter((test) => test.testId !== testId));
                setDeletedTest(testName);
                setTimeout(() => setDeletedTest(null), 5000);
            } else {
                console.error(`B³¹d podczas usuwania testu: ${response.status}`);
            }
        } catch (error) {
            console.error("B³¹d podczas usuwania testu:", error);
        }
    };

    const handleSetTime = (testId: number) => {
        navigate(`/course/${courseId}/test/${testId}/set-time`);
    };

    const handleCheckResults = (testId: number) => {
        navigate(`/course/${courseId}/test/${testId}/results`);
    };

    if (loading) {
        return <p>£adowanie testów...</p>;
    }

    return (
        <div className="course-tests">
            <h1>Testy dla kursu: {courseId}</h1>
            {startedTest && (
                <div className="success-banner">
                    Test <strong>{startedTest}</strong> rozpoczêty prawidlowo!
                </div>
            )}
            {deletedTest && (
                <div className="error-banner">
                    Test <strong>{deletedTest}</strong> zosta³ usuniety!
                </div>
            )}
            {tests.length === 0 ? (
                <p>Brak testów do wyœwietlenia.</p>
            ) : (
                <ul>
                    {tests.map((test) => (
                        <li key={test.testId} className="test-card">
                            <h3>{test.name}</h3>
                            <p>Kategoria: {test.category}</p>
                            <p>Data rozpoczecia: {test.startTime ? formatDate(test.startTime) : "Nie ustawiono"}</p>
                            <p>Data zakonczenia: {test.endTime ? formatDate(test.endTime) : "Nie ustawiono"}</p>
                            <button className="button" onClick={() => handleSetTime(test.testId)}>
                                Ustaw czas rozpoczecia i zakonczenia testu
                            </button>
                            <button className="button" onClick={() => handleStartTest(test.name, test.testId)}>
                                Rozpocznij test
                            </button>
                            <button
                                className="button"
                                onClick={() => handleDeleteTest(test.testId, test.name)}
                            >
                                Usun test
                            </button>
                            <button className="button" onClick={() => handleCheckResults(test.testId)}>
                                Pobierz raport
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default CourseTests;
