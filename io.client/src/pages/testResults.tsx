import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

interface User {
    userId: number;
    name: string;
    surname: string;
    email: string;
}

const TestResults: React.FC = () => {
    const { courseId, testId } = useParams<{ courseId: string; testId: string }>();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetch(`https://localhost:59127/api/test/${courseId}/${testId}/results`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP status ${response.status} - ${response.statusText}`);
                }
                return response.json();
            })
            .then((data) => {
                setUsers(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("B³¹d podczas pobierania u¿ytkowników:", error);
                setError(error.message);
                setLoading(false);
            });
    }, [courseId, testId]);

    if (loading) {
        return <p>£adowanie wyników...</p>;
    }

    if (error) {
        return <p>Wyst¹pi³ b³¹d: {error}</p>;
    }

    return (
        <div>
            <h1>Wyniki testu {testId} w kursie {courseId}</h1>
            <ul>
                {users.map((user) => (
                    <li key={user.userId}>
                        {user.name} {user.surname} ({user.email})
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TestResults;
