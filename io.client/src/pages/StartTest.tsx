import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

interface Question {
    id: number;
    text: string;
    answers: string[]; // Mo¿liwe odpowiedzi (jeœli zamkniête)
    type: 'open' | 'multiple-choice'; // Rodzaj pytania
}

export const StartTest = () => {
    const { testId } = useParams<{ testId: string }>(); // Pobiera ID testu z adresu URL
    const [loading, setLoading] = useState<boolean>(true);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);

    const fetchTestQuestions = async () => {
        try {
            const response = await fetch(`https://localhost:7293/api/TestsManager/getQuestions/${testId}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const apiData = await response.json();
            const transformedQuestions = apiData.map((question: any) => ({
                id: question.questionId,
                text: question.questionText,
                answers: question.answers || [],
                type: question.type,
            }));
            setQuestions(transformedQuestions);
        } catch (error) {
            console.error('Error fetching test questions:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTestQuestions();
    }, [testId]);

    const handleNextQuestion = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
        }
    };

    const handlePreviousQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex((prevIndex) => prevIndex - 1);
        }
    };

    if (loading) return <div>Loading...</div>;

    const currentQuestion = questions[currentQuestionIndex];

    return (
        <div style={{ padding: '20px' }}>
            <h1 style={{ color: 'white', textAlign: 'center' }}>Start Test</h1>
            <div style={{ backgroundColor: '#333', color: 'white', padding: '20px', borderRadius: '8px' }}>
                <h2>{currentQuestion.text}</h2>
                {currentQuestion.type === 'multiple-choice' && (
                    <ul>
                        {currentQuestion.answers.map((answer, index) => (
                            <li key={index}>
                                <label>
                                    <input type="radio" name="answer" value={answer} /> {answer}
                                </label>
                            </li>
                        ))}
                    </ul>
                )}
                {currentQuestion.type === 'open' && <textarea placeholder="Type your answer here" rows={5} style={{ width: '100%' }} />}
            </div>
            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between' }}>
                <Button onClick={handlePreviousQuestion} disabled={currentQuestionIndex === 0} variant="contained" color="secondary">
                    Previous
                </Button>
                <Button onClick={handleNextQuestion} disabled={currentQuestionIndex === questions.length - 1} variant="contained" color="primary">
                    Next
                </Button>
            </div>
        </div>
    );
};

export default StartTest;
