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
    const [startedTest, setStartedTest] = useState<string | null>(null); // Nazwa rozpocz�tego testu
    const [deletedTest, setDeletedTest] = useState<string | null>(null); // Nazwa usuni�tego testu

    useEffect(() => {
        fetch(`https://localhost:59127/api/test/${courseId}/tests`)
            .then((response) => response.json())
            .then((data: Test[]) => {
                console.log("Pobrane testy:", data);
                setTests(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("B��d podczas pobierania test�w:", error);
                setTests([]);
                setLoading(false);
            });
    }, [courseId]);

    const handleStartTest = (testName: string) => {
        setStartedTest(testName); // Ustaw rozpocz�ty test
        setTimeout(() => setStartedTest(null), 5000); // Ukryj komunikat po 5 sekundach
    };

    const handleDeleteTest = (testId: number, testName: string) => {
        // Wy�wietlenie okna potwierdzenia
        const confirmDelete = window.confirm(`Czy na pewno chcesz usun�� test "${testName}"?`);
        if (!confirmDelete) {
            return; // U�ytkownik anulowa� usuni�cie
        }

        // Wy�lij ��danie DELETE do API
        fetch(`https://localhost:59127/api/test/${testId}`, {
            method: 'DELETE',
        })
            .then((response) => {
                if (response.ok) {
                    console.log("Test usuni�ty pomy�lnie.");
                    setTests((prevTests) => prevTests.filter((test) => test.testId !== testId));
                    setDeletedTest(testName);
                    setTimeout(() => setDeletedTest(null), 5000);
                } else {
                    console.error(`B��d podczas usuwania testu: ${response.status}`);
                    response.text().then((text) => console.error("Tre�� b��du:", text));
                }
            })
            .catch((error) => {
                console.error("B��d podczas ��dania usuni�cia testu:", error);
            });

    };

    if (loading) {
        return <p>�adowanie test�w...</p>;
    }

    return (
        <div className="course-tests">
            <h1>Testy dla kursu: {courseId}</h1>

            {/* Zielony komunikat dla rozpocz�cia testu */}
            {startedTest && (
                <div className="success-banner">
                    Test <strong>{startedTest}</strong> rozpocz�ty prawid�owo!
                </div>
            )}

            {/* Czerwony komunikat dla usuni�cia testu */}
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
                                Usu� test
                            </button>
                            <button className="button">Sprawd� wyniki</button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default CourseTests;
