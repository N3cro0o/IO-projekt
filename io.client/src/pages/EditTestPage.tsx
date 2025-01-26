import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Button,
    CircularProgress,
} from '@mui/material';
import AddQuestionModal from '../comps/AddQuestionModal';
import EditQuestionModal from '../comps/EditQuestionModal';
import DeleteQuestionModal from '../comps/DeleteQuestionModal';
import ShareQuestionModal from '../comps/ShareQuestionModal';

interface Question {
    id: number;
    name: string;
    category: string;
    questionType: string;
    shared: boolean;
    maxPoints: number;
    answerId: number | null;
}

const EditTestPage: React.FC = () => {
    const { courseId, testId } = useParams<{ courseId: string; testId: string }>();
    const navigate = useNavigate();
    const [questions, setQuestions] = useState<Question[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // States for modals
    const [addModalOpen, setAddModalOpen] = useState<boolean>(false);
    const [editModalOpen, setEditModalOpen] = useState<{ open: boolean; question: Question | null }>({ open: false, question: null });
    const [deleteModalOpen, setDeleteModalOpen] = useState<{ open: boolean; questionId: number | null }>({ open: false, questionId: null });
    const [shareModalOpen, setShareModalOpen] = useState<{ open: boolean; questionId: number | null }>({ open: false, questionId: null });

    const fetchQuestions = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch(`/api/testquestion/${testId}/questions`);
            if (!response.ok) {
                throw new Error(`Error fetching questions: ${response.statusText}`);
            }

            const data: Question[] = await response.json();
            setQuestions(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQuestions();
    }, [testId]);

    const handleAddQuestion = () => setAddModalOpen(true);
    const handleCloseAddModal = () => setAddModalOpen(false);
    const handleEditQuestion = (question: Question) => setEditModalOpen({ open: true, question });
    const handleDeleteQuestion = (questionId: number) => setDeleteModalOpen({ open: true, questionId });
    const handleShareQuestion = (questionId: number | null) => setShareModalOpen({ open: true, questionId });

    const handleQuestionAdded = () => {
        setAddModalOpen(false);
        fetchQuestions();
    };

    const handleQuestionDeleted = () => {
        setDeleteModalOpen({ open: false, questionId: null });
        fetchQuestions();
    };

    return (
        <Box sx={{ padding: '20px', backgroundColor: '#000', minHeight: '100vh', color: '#fff' }}>
            <Box sx={{ backgroundColor: '#000', padding: '10px', display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => navigate(`/course/${courseId}/tests`)}
                    sx={{ color: '#fff' }}
                >
                    Go Back
                </Button>
            </Box>
            <Typography variant="h4" mb={2} sx={{ color: '#fff' }}>
                Edit Test: {testId} (Course: {courseId})
            </Typography>

            {/* Przeniesione przyciski */}
            <Box sx={{ display: 'flex', gap: 2, marginBottom: 2 }}>
                <Button variant="contained" color="primary" onClick={handleAddQuestion}>
                    Add New Question
                </Button>
                <Button variant="contained" color="success" onClick={() => handleShareQuestion(null)}>
                    Shared Questions
                </Button>
            </Box>

            {loading ? (
                <CircularProgress sx={{ color: '#fff' }} />
            ) : error ? (
                <Typography color="error">Error: {error}</Typography>
            ) : (
                <Table sx={{ backgroundColor: '#333', marginTop: 2 }}>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ color: '#fff' }}>Question ID</TableCell>
                            <TableCell sx={{ color: '#fff' }}>Question Content</TableCell>
                            <TableCell sx={{ color: '#fff' }}>Category</TableCell>
                            <TableCell sx={{ color: '#fff' }}>Type</TableCell>
                            <TableCell sx={{ color: '#fff' }}>Shared</TableCell>
                            <TableCell sx={{ color: '#fff' }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {questions.map((question) => (
                            <TableRow key={question.id}>
                                <TableCell sx={{ color: '#fff' }}>{question.id}</TableCell>
                                <TableCell sx={{ color: '#fff' }}>{question.name}</TableCell>
                                <TableCell sx={{ color: '#fff' }}>{question.category}</TableCell>
                                <TableCell sx={{ color: '#fff' }}>{question.questionType}</TableCell>
                                <TableCell sx={{ color: '#fff' }}>{question.shared ? 'Yes' : 'No'}</TableCell>
                                <TableCell>
                                    <Button
                                        variant="outlined"
                                        color="primary"
                                        onClick={() => handleEditQuestion(question)}
                                        sx={{ marginRight: '10px', color: '#fff', borderColor: '#fff' }}
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        color="secondary"
                                        onClick={() => handleDeleteQuestion(question.id)}
                                        sx={{ marginRight: '10px', color: '#fff', borderColor: '#fff' }}
                                    >
                                        Delete
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}

            {/* Modale */}
            {addModalOpen && (
                <AddQuestionModal testId={testId!} onClose={handleCloseAddModal} onQuestionAdded={handleQuestionAdded} />
            )}

            {editModalOpen.open && editModalOpen.question && (
                <EditQuestionModal
                    open={editModalOpen.open}
                    question={editModalOpen.question}
                    handleClose={() => setEditModalOpen({ open: false, question: null })}
                    onSave={(updatedQuestion) => {
                        setQuestions((prevQuestions) =>
                            prevQuestions.map((q) => (q.id === updatedQuestion.id ? updatedQuestion : q))
                        );
                        setEditModalOpen({ open: false, question: null });
                    }}
                />
            )}

            {deleteModalOpen.open && deleteModalOpen.questionId && (
                <DeleteQuestionModal
                    testId={parseInt(testId!)} //  Dodano testId do modala, ponieważ API go wymaga
                    questionId={deleteModalOpen.questionId}
                    onClose={() => setDeleteModalOpen({ open: false, questionId: null })}
                    onQuestionDeleted={handleQuestionDeleted}
                />
            )}

            {shareModalOpen.open && (
                <ShareQuestionModal
                    onClose={() => setShareModalOpen({ open: false, questionId: null })}
                    questions={questions} // Przekazujemy wszystkie pytania
                />
            )}
        </Box>
    );
};

export default EditTestPage;
