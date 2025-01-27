import { useState, useEffect } from 'react';
import { ButtonAppBar } from '../comps/AppBar.tsx';
import Button from '@mui/material/Button';

interface Question {
    id: number;
    questionText: string;
    options: string[];
    correctAnswer: string;
}

export const TestSolver = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

    // Funkcja do transformacji danych
    const transformQuestionData = (apiData: any[]): Question[] => {
        return apiData.map((question) => ({
            id: question.questionId,
            questionText: question.questionText,
            options: [question.optionA, question.optionB, question.optionC, question.optionD],
            correctAnswer: question.correctAnswer,
        }));
    };

    // £adowanie pytañ z API
    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const testId = localStorage.getItem('selectedTestId');
                console.log('Selected Test ID from localStorage:', testId);

                const response = await fetch(`https://localhost:7293/api/TestsViev/GetQuestions/${testId}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const apiData = await response.json();
                const transformedData = transformQuestionData(apiData);
                setQuestions(transformedData);
            } catch (error) {
                console.error('Error fetching questions:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchQuestions();
    }, []);

    const handleAnswerSelect = (answer: string) => {
        setSelectedAnswer(answer);
    };

    const handleNextQuestion = () => {
        if (selectedAnswer) {
            // Przechodzimy do nastêpnego pytania
            setSelectedAnswer(null);
            setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
        } else {
            alert('Please select an answer before proceeding.');
        }
    };

    // Sprawdzamy, czy pytania s¹ ju¿ za³adowane
    if (loading) return <div>Loading...</div>;

    // Sprawdzamy, czy mamy pytania do wyœwietlenia
    if (questions.length === 0) return <div>No questions available.</div>;

    // Pobieramy bie¿¹ce pytanie
    const currentQuestion = questions[currentQuestionIndex];

    return (
        <div>
            <ButtonAppBar />
            <div style={{ display: 'flex', justifyContent: 'center', padding: '50px' }}>
                <div style={{ width: '100%', maxWidth: '800px' }}>
                    <h1 style={{ color: 'white', textAlign: 'center' }}> Test Solver </h1>
                    <div style={{ backgroundColor: '#333', padding: '20px', borderRadius: '8px', color: '#fff' }}>
                        <h2>{currentQuestion.questionText}</h2>
                        <div>
                            {currentQuestion.options.map((option, index) => (
                                <div key={index} style={{ marginBottom: '10px' }}>
                                    <Button
                                        variant="contained"
                                        color={selectedAnswer === option ? 'secondary' : 'primary'}
                                        onClick={() => handleAnswerSelect(option)}
                                        style={{ width: '100%' }}
                                    >
                                        {option}
                                    </Button>
                                </div>
                            ))}
                        </div>
                        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between' }}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleNextQuestion}
                                disabled={currentQuestionIndex === questions.length - 1}
                            >
                                Next Question
                            </Button>
                            <Button variant="contained" color="secondary" onClick={() => alert('Test submitted!')}>
                                Submit Test
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TestSolver;
