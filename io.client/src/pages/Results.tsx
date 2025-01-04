import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

interface Result {
    userId: number;
    userName: string;
    score: number;
}

const Results: React.FC = () => {
    const { testName } = useParams<{ testName: string }>();
    const [results, setResults] = useState<Result[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Pobierz wyniki testu z API
        fetch(`https://localhost:59127/api/results/${testName}`)
            .then((response) => response.json())
            .then((data: Result[]) => {
                setResults(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("B��d podczas pobierania wynik�w:", error);
                setLoading(false);
            });
    }, [testName]);

    if (loading) {
        return <p>�adowanie wynik�w...</p>;
    }

    return (
        <div className="results">
            <h1>Wyniki testu: {testName}</h1>
            {results.length === 0 ? (
                <p>Brak wynik�w do wy�wietlenia.</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>ID u�ytkownika</th>
                            <th>Imi�</th>
                            <th>Wynik</th>
                        </tr>
                    </thead>
                    <tbody>
                        {results.map((result) => (
                            <tr key={result.userId}>
                                <td>{result.userId}</td>
                                <td>{result.userName}</td>
                                <td>{result.score}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default Results;
