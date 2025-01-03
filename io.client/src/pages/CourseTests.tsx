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

    if (loading) {
        return <p>£adowanie testów...</p>;
    }

    return (
        <div className="course-tests">
            <h1>Testy dla kursu: {courseId}</h1>
            {tests.length === 0 ? (
                <p>Brak testów do wyœwietlenia.</p>
            ) : (
                <ul>
                    {tests.map((test) => (
                        <li key={test.testId} className="test-card">
                            <h3>{test.name}</h3>
                            <p>Kategoria: {test.category}</p>
                            <p>Data rozpoczecia: {test.startTime}</p>
                            <p>Data zakonczenia: {test.endTime}</p>
                            <button className="button">Rozpocznij test</button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default CourseTests;
