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
import ShareQuestionModal from '../comps/ShareQuestionModal';
import DeleteQuestionModal from '../comps/DeleteQuestionModal';
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
    const [deleteModalOpen, setDeleteModalOpen] = useState<{ open: boolean; question: Question | null }>({ open: false, question: null });

    const [addModalOpen, setAddModalOpen] = useState<boolean>(false);
    const [editModalOpen, setEditModalOpen] = useState<{ open: boolean; question: Question | null }>({ open: false, question: null });
    const [shareModalOpen, setShareModalOpen] = useState<boolean>(false);

    const fetchQuestions = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch(`/api/question/${testId}`);
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
    const handleShareQuestion = () => setShareModalOpen(true);


    

        const handleOpenDeleteModal = (question: Question) => {
            setDeleteModalOpen({ open: true, question });
        };

        const handleCloseDeleteModal = () => {
            setDeleteModalOpen({ open: false, question: null });
        };

        const handleConfirmDelete = async () => {
            if (!deleteModalOpen.question) return;

            try {
                const response = await fetch(`/api/DeleteQuestion/DeleteQuestionByName/${encodeURIComponent(deleteModalOpen.question.name)}`, {
                    method: 'DELETE',
                });

                if (!response.ok) {
                    throw new Error('Failed to delete question');
                }

                // Aktualizacja stanu po usunięciu pytania
                setQuestions((prevQuestions) =>
                    prevQuestions.filter((q) => q.name !== deleteModalOpen.question?.name)
                );
                setDeleteModalOpen({ open: false, question: null });
            } catch (err) {
                console.error('Error deleting question:', err);
                setError(err instanceof Error ? err.message : 'Unknown error');
            }
        };
    

        return (
            <div>
                <ButtonAppBar />
                <Box sx={{ padding: '20px', minHeight: '100vh', color: '#fff', marginTop: '64px' }}>
                    <Box sx={{ padding: '10px', display: 'flex', justifyContent: 'flex-end' }}>
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={() => navigate(`/course/${courseId}/tests`)}
                        >
                            Go Back
                        </Button>
                    </Box>
                    <Typography variant="h4" mb={2}>
                        Edit Test: {testId} (Course: {courseId})
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 2, marginBottom: 2 }}>
                        <Button variant="contained" color="primary" onClick={handleAddQuestion}>
                            Add New Question
                        </Button>
                        <Button variant="contained" color="success" onClick={() => handleShareQuestion()}>
                            Shared Questions
                        </Button>
                    </Box>

                    {loading ? (
                        <CircularProgress />
                    ) : error ? (
                        <Typography color="error">Error: {error}</Typography>
                    ) : (
                        <Table sx={{ marginTop: 2 }}>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Question ID</TableCell>
                                    <TableCell>Question Content</TableCell>
                                    <TableCell>Category</TableCell>
                                    <TableCell>Type</TableCell>
                                    <TableCell>Shared</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {questions.map((question) => (
                                    <TableRow key={question.id}>
                                        <TableCell>{question.id}</TableCell>
                                        <TableCell>{question.name}</TableCell>
                                        <TableCell>{question.category}</TableCell>
                                        <TableCell>{question.questionType}</TableCell>
                                        <TableCell>{question.shared ? 'Yes' : 'No'}</TableCell>
                                        <TableCell>
                                            <Button
                                                variant="outlined"
                                                color="primary"
                                                onClick={() => handleEditQuestion(question)}
                                                sx={{ marginRight: '10px' }}
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                variant="outlined"
                                                color="secondary"
                                                onClick={() => handleOpenDeleteModal(question)}
                                            >
                                                Delete
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}

                    {addModalOpen && (
                        <AddQuestionModal testId={testId!} onClose={handleCloseAddModal} onQuestionAdded={fetchQuestions} />
                    )}

              


                    {editModalOpen.open && editModalOpen.question && (
                        <EditQuestionModal
                            open={editModalOpen.open}
                            question={editModalOpen.question}
                            onClose={() => setEditModalOpen({ open: false, question: null })}
                            onQuestionUpdated={fetchQuestions} // Po zapisaniu zmian odśwież pytania
                        />
                    )}

                    {shareModalOpen && (
                        <ShareQuestionModal
                            open={shareModalOpen}
                            onClose={() => setShareModalOpen(false)}
                            questions={questions}
                            onShareUpdate={fetchQuestions}
                        />
                    )}


                    {deleteModalOpen.open && deleteModalOpen.question && (
                        <DeleteQuestionModal
                            open={deleteModalOpen.open}
                            onClose={handleCloseDeleteModal}
                            onConfirm={handleConfirmDelete}
                            questionName={deleteModalOpen.question.name}
                        />
                    )}
                </Box>
            </div>
        );
    };

    export default EditTestPage;

