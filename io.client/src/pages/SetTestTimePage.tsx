import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const SetTestTimePage: React.FC = () => {
    const { testId } = useParams<{ testId: string }>();
    const navigate = useNavigate();

    const [startTime, setStartTime] = useState<string>('');
    const [endTime, setEndTime] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchTestTime = async () => {
            try {
                const response = await fetch(`https://localhost:59127/api/test/${testId}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setStartTime(data.startTime);
                setEndTime(data.endTime);
            } catch (error) {
                console.error('B³¹d podczas pobierania szczegó³ów testu:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTestTime();
    }, [testId]);

    const handleSaveTime = async () => {
        try {
            const response = await fetch(`https://localhost:59127/api/SetTestTime/${testId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    startTime,
                    endTime,
                }),
            });

            if (response.ok) {
                alert('Czas testu zosta³ pomyœlnie zapisany.');
                navigate(-1); // Powrót na poprzedni¹ stronê
            } else {
                console.error(`B³¹d podczas zapisywania czasu testu: ${response.status}`);
            }
        } catch (error) {
            console.error('B³¹d podczas zapisywania czasu testu:', error);
        }
    };

    if (loading) {
        return <p>£adowanie danych testu...</p>;
    }

    return (
        <div className="set-test-time">
            <h1>Ustaw czas dla testu</h1>
            <label>
                Czas rozpoczecia:

                <input
                    type="datetime-local"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                />
            </label>


            <label>
                Czas zakonczenia:
                <input
                    type="datetime-local"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                />
            </label>
            <button onClick={handleSaveTime}>Zapisz</button>
            <button onClick={() => navigate(-1)}>Anuluj</button>
        </div>
    );
};

export default SetTestTimePage;
