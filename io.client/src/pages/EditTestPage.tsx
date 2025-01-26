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
import AddQuestionModal from '../comps/ModalAddQuestion';
import EditQuestionModal from '../comps/ModalEditQuestion';
import DeleteQuestionModal from '../comps/ModalDeleteQuestion';
import ShareQuestionModal from '../comps/ModalShareQuestion';
import { ButtonAppBar } from '../comps/AppBar';

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

        <Box sx={{ backgroundColor: '#121212', color: '#fff', minHeight: '100vh', padding: '80px'  }}>
            <ButtonAppBar />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    Edit Test: {testId} (Course: {courseId})
                </Typography>
                <Button
                    variant="contained"
                    onClick={() => navigate(`/course/${courseId}/tests`)}
                    sx={{
                        color: '#fff',
                        borderColor: '#f44336',
                        '&:hover': { borderColor: '#d32f2f', backgroundColor: '#d32f2f' },
                    }}
                >
                    Go Back
                </Button>
            </Box>

            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                <Button
                    variant="contained"
                    sx={{
                        backgroundColor: '#007bff',
                        '&:hover': { backgroundColor: '#0056b3' },
                    }}
                    onClick={handleAddQuestion}
                >
                    Add New Question
                </Button>
                <Button
                    variant="contained"
                    sx={{
                        backgroundColor: '#28a745',
                        '&:hover': { backgroundColor: '#218838' },
                    }}
                    onClick={() => handleShareQuestion(null)}
                >
                    Shared Questions
                </Button>
            </Box>

            {loading ? (
                <CircularProgress sx={{ color: '#007bff' }} />
            ) : error ? (
                <Typography sx={{ color: '#f44336' }}>Error: {error}</Typography>
            ) : (
                <Table sx={{ backgroundColor: '#1e1e1e', borderRadius: '8px', overflow: 'hidden' }}>
                    <TableHead>
                        <TableRow sx={{ backgroundColor: '#333' }}>
                            <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Question ID</TableCell>
                            <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Question Content</TableCell>
                            <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Category</TableCell>
                            <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Type</TableCell>
                            <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Shared</TableCell>
                            <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {questions.map((question) => (
                            <TableRow key={question.id} sx={{ '&:hover': { backgroundColor: '#292929' } }}>
                                <TableCell sx={{ color: '#fff' }}>{question.id}</TableCell>
                                <TableCell sx={{ color: '#fff' }}>{question.name}</TableCell>
                                <TableCell sx={{ color: '#fff' }}>{question.category}</TableCell>
                                <TableCell sx={{ color: '#fff' }}>{question.questionType}</TableCell>
                                <TableCell sx={{ color: '#fff' }}>{question.shared ? 'Yes' : 'No'}</TableCell>
                                <TableCell>
                                    <Button
                                        variant="outlined"
                                        sx={{
                                            color: '#007bff',
                                            borderColor: '#007bff',
                                            '&:hover': { backgroundColor: '#0056b3', color: '#fff', borderColor: '#0056b3' },
                                            mr: 1,
                                        }}
                                        onClick={() => handleEditQuestion(question)}
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        sx={{
                                            color: '#f44336',
                                            borderColor: '#f44336',
                                            '&:hover': { backgroundColor: '#d32f2f', color: '#fff', borderColor: '#d32f2f' },
                                        }}
                                        onClick={() => handleDeleteQuestion(question.id)}
                                    >
                                        Delete
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}

            {/* Modals */}
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
                    testId={parseInt(testId!)}
                    questionId={deleteModalOpen.questionId}
                    onClose={() => setDeleteModalOpen({ open: false, questionId: null })}
                    onQuestionDeleted={handleQuestionDeleted}
                />
            )}

            {shareModalOpen.open && (
                <ShareQuestionModal
                    onClose={() => setShareModalOpen({ open: false, questionId: null })}
                    questions={questions}
                />
            )}
        </Box>
    );
};

export default EditTestPage;
