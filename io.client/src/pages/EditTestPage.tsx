import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    Button,
    CircularProgress,
} from '@mui/material';
import AddQuestionModal from '../comps/ModalAddQuestion';
import EditQuestionModal from '../comps/ModalEditQuestion';
import ShareQuestionModal from '../comps/ModalShareQuestion';
import DeleteQuestionModal from '../comps/ModalDeleteQuestion';
import { ButtonAppBar } from '../comps/AppBar';
// dodanie modala od sharowanych pytan 
import SharedQuestionModal from '../comps/SharedQuestionModal'; 

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
        const token = localStorage.getItem('authToken');
        if (!token) {
            navigate('/'); // Przekierowanie na stronê g³ówn¹
        }

        fetchQuestions();
    }, [testId]);

    const handleAddQuestion = () => setAddModalOpen(true);
    const handleCloseAddModal = () => setAddModalOpen(false);
    const handleEditQuestion = (question: Question) => setEditModalOpen({ open: true, question });
    const handleShareQuestion = () => setShareModalOpen(true);
    // przycisk sharowanych pytan dodanie 
    const [sharedModalOpen, setSharedModalOpen] = useState<boolean>(false);

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
            <Box sx={{ padding: '20px', minHeight: '100vh', color: '#fff', marginTop: '40px' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button variant="contained" color="primary" onClick={handleAddQuestion}>
                            Add New Question
                        </Button>
                        <Button variant="contained" color="success" onClick={() => handleShareQuestion()}>
                            Shared Questions
                        </Button>
                               
                        <Button //Przycisk Add Shared Question 
                            variant="contained" color="success" onClick={() => setSharedModalOpen(true)}>
                            Add Shared Question
                        </Button>

                    </Box>
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => navigate(`/course/${courseId}/tests`)}
                    >
                        Go Back
                    </Button>
                </Box>

                <Typography variant="h4" mb={2} textAlign="center" sx={{ color: '#fff' }}>
                    Edit Test: {testId}
                </Typography>

                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                        <CircularProgress />
                    </Box>
                ) : error ? (
                    <Typography color="error">Error: {error}</Typography>
                ) : (
                    <table
                        style={{
                            borderCollapse: 'collapse',
                            width: '100%',
                            backgroundColor: '#333',
                            color: '#fff',
                            borderRadius: '8px',
                            overflow: 'hidden',
                            tableLayout: 'fixed',
                        }}
                    >
                        <thead>
                            <tr style={{ borderBottom: '2px solid #555' }}>
                                <th style={{ padding: '10px' }}>Question Content</th>
                                <th style={{ padding: '10px' }}>Category</th>
                                <th style={{ padding: '10px' }}>Type</th>
                                <th style={{ padding: '10px' }}>Shared</th>
                                <th style={{ padding: '10px' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {questions.map((question) => (
                                <tr key={question.id} style={{ borderBottom: '1px solid #555' }}>
                                    <td style={{ padding: '10px' }}>{question.name}</td>
                                    <td style={{ padding: '10px' }}>{question.category}</td>
                                    <td style={{ padding: '10px' }}>{question.questionType}</td>
                                    <td style={{ padding: '10px' }}>{question.shared ? 'Yes' : 'No'}</td>
                                    <td style={{ padding: '10px', display: 'flex', gap: '8px' }}>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={() => handleEditQuestion(question)}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            variant="contained"
                                            color="error"
                                            onClick={() => handleOpenDeleteModal(question)}
                                        >
                                            Delete
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                {addModalOpen && (
                    <AddQuestionModal testId={testId!} onClose={handleCloseAddModal} onQuestionAdded={fetchQuestions} />
                )}

                {editModalOpen.open && editModalOpen.question && (
                    <EditQuestionModal
                        open={editModalOpen.open}
                        question={editModalOpen.question}
                        onClose={() => setEditModalOpen({ open: false, question: null })}
                        onQuestionUpdated={fetchQuestions}
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
                
                {sharedModalOpen && ( //£¥CZENIE Z MODALEM SHARED QUESTION
                    <SharedQuestionModal open={sharedModalOpen} onClose={() => setSharedModalOpen(false)} testId={testId} />
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
