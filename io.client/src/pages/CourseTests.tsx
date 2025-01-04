import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
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
    const [tests, setTests] = useState<Test[]>([]);
    const [loading, setLoading] = useState(true);
    const [startedTest, setStartedTest] = useState<string | null>(null); // Nazwa rozpoczêtego testu
    const [deletedTest, setDeletedTest] = useState<string | null>(null); // Nazwa usuniêtego testu

    useEffect(() => {
        fetch(`https://localhost:59127/api/test/${courseId}/tests`)
            .then((response) => response.json())
            .then((data: Test[]) => {
                console.log("Pobrane testy:", data);
                setTests(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("B³¹d podczas pobierania testów:", error);
                setTests([]);
                setLoading(false);
            });
    }, [courseId]);

    const handleStartTest = (testName: string) => {
        setStartedTest(testName); // Ustaw rozpoczêty test
        setTimeout(() => setStartedTest(null), 5000); // Ukryj komunikat po 5 sekundach
    };

    const handleDeleteTest = (testId: number, testName: string) => {
        // Wyœwietlenie okna potwierdzenia
        const confirmDelete = window.confirm(`Czy na pewno chcesz usun¹æ test "${testName}"?`);
        if (!confirmDelete) {
            return; // U¿ytkownik anulowa³ usuniêcie
        }

        // Wyœlij ¿¹danie DELETE do API
        fetch(`https://localhost:59127/api/test/${testId}`, {
            method: 'DELETE',
        })
            .then((response) => {
                if (response.ok) {
                    console.log("Test usuniêty pomyœlnie.");
                    setTests((prevTests) => prevTests.filter((test) => test.testId !== testId));
                    setDeletedTest(testName);
                    setTimeout(() => setDeletedTest(null), 5000);
                } else {
                    console.error(`B³¹d podczas usuwania testu: ${response.status}`);
                    response.text().then((text) => console.error("Treœæ b³êdu:", text));
                }
            })
            .catch((error) => {
                console.error("B³¹d podczas ¿¹dania usuniêcia testu:", error);
            });

    };

    if (loading) {
        return <p>£adowanie testów...</p>;
    }

    return (
        <div className="course-tests">
            <h1>Testy dla kursu: {courseId}</h1>

            {/* Zielony komunikat dla rozpoczêcia testu */}
            {startedTest && (
                <div className="success-banner">
                    Test <strong>{startedTest}</strong> rozpoczêty prawid³owo!
                </div>
            )}

            {/* Czerwony komunikat dla usuniêcia testu */}
            {deletedTest && (
                <div className="error-banner">
                    Test <strong>{deletedTest}</strong> zosta³ usuniêty!
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
                            <p>Data rozpoczêcia: {test.startTime}</p>
                            <p>Data zakoñczenia: {test.endTime}</p>
                            <button
                                className="button"
                                onClick={() => handleStartTest(test.name)}
                            >
                                Rozpocznij test
                            </button>
                            <button
                                className="button"
                                onClick={() => handleDeleteTest(test.testId, test.name)}
                            >
                                Usuñ test
                            </button>
                            <button className="button">SprawdŸ wyniki</button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default CourseTests;
