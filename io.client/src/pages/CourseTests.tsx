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
                console.error("B��d podczas pobierania test�w:", error);
                setTests([]);
            } finally {
                setLoading(false);
            }
        };

        fetchTests();
    }, [courseId]);

    const handleStartTest = (testName: string) => {
        setStartedTest(testName);
        setTimeout(() => setStartedTest(null), 5000);
    };

    const handleDeleteTest = async (testId: number, testName: string) => {
        const confirmDelete = window.confirm(`Czy na pewno chcesz usun�� test "${testName}"?`);
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
                console.error(`B��d podczas usuwania testu: ${response.status}`);
            }
        } catch (error) {
            console.error("B��d podczas usuwania testu:", error);
        }
    };

    const handleSetTime = (testId: number) => {
        navigate(`/course/${courseId}/test/${testId}/set-time`);
    };

    const handleCheckResults = (testId: number) => {
        navigate(`/course/${courseId}/test/${testId}/results`);
    };

    if (loading) {
        return <p>�adowanie test�w...</p>;
    }

    return (
        <div className="course-tests">
            <h1>Testy dla kursu: {courseId}</h1>
            {startedTest && (
                <div className="success-banner">
                    Test <strong>{startedTest}</strong> rozpocz�ty prawid�owo!
                </div>
            )}
            {deletedTest && (
                <div className="error-banner">
                    Test <strong>{deletedTest}</strong> zosta� usuni�ty!
                </div>
            )}
            {tests.length === 0 ? (
                <p>Brak test�w do wy�wietlenia.</p>
            ) : (
                <ul>
                    {tests.map((test) => (
                        <li key={test.testId} className="test-card">
                            <h3>{test.name}</h3>
                            <p>Kategoria: {test.category}</p>
                            <p>Data rozpocz�cia: {test.startTime}</p>
                            <p>Data zako�czenia: {test.endTime}</p>
                            <button className="button" onClick={() => handleSetTime(test.testId)}>
                                Ustaw czas rozpocz�cia i zako�czenia testu
                            </button>
                            <button className="button" onClick={() => handleStartTest(test.name)}>
                                Rozpocznij test
                            </button>
                            <button
                                className="button"
                                onClick={() => handleDeleteTest(test.testId, test.name)}
                            >
                                Usu� test
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
