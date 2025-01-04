import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './TestList.css';

interface Test {
    id: number;
    questions: number[];
    startDate: string;
    endDate: string;
    category: number;
}

const TestList: React.FC = () => {
    const { courseId } = useParams<{ courseId: string }>();
    const [tests, setTests] = useState<Test[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`https://localhost:59127/api/test/course/${courseId}`)
            .then((response) => response.json())
            .then((data: Test[]) => {
                setTests(data);
                setLoading(false);
            })
            .catch(() => {
                setTests([]);
                setLoading(false);
            });
    }, [courseId]);

    if (loading) {
        return <p>£adowanie testów...</p>;
    }

    return (
        <div className="test-list">
            <h1>Testy dla kursu</h1>
            {tests.length === 0 ? (
                <p>Brak testów do wyœwietlenia.</p>
            ) : (
                <ul>
                    {tests.map((test) => (
                        <li key={test.id}>
                            <h3>Test ID: {test.id}</h3>
                            <p>Kategoria: {test.category}</p>
                            <p>Data rozpoczêcia: {new Date(test.startDate).toLocaleString()}</p>
                            <p>Data zakoñczenia: {new Date(test.endDate).toLocaleString()}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default TestList;
