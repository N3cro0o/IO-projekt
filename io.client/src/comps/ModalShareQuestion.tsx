import React, { useState } from 'react';
import { Box, Button, Modal, Typography, List, ListItem, ListItemText, Checkbox, ListItemIcon } from '@mui/material';

interface ShareQuestionModalProps {
    onClose: () => void;
    questions: { id: number; name: string; shared: boolean }[];
    onQuestionsShared?: (updatedQuestions: { id: number; name: string; shared: boolean }[]) => void;
}

const ShareQuestionModal: React.FC<ShareQuestionModalProps> = ({ onClose, questions, onQuestionsShared }) => {
    const unsharedQuestions = questions.filter((q) => !q.shared);
    const [selectedQuestions, setSelectedQuestions] = useState<number[]>([]);
    const [loading, setLoading] = useState(false);

    const handleToggle = (questionId: number) => {
        setSelectedQuestions((prev) =>
            prev.includes(questionId) ? prev.filter((id) => id !== questionId) : [...prev, questionId]
        );
    };

    const handleShare = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/ShareQuestion', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ QuestionIds: selectedQuestions }),
            });

            if (!response.ok) {
                throw new Error('Failed to share questions');
            }

            const updatedQuestions = questions.map((q) =>
                selectedQuestions.includes(q.id) ? { ...q, shared: true } : q
            );

            if (onQuestionsShared) {
                onQuestionsShared(updatedQuestions);
            }
            onClose();
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal open onClose={onClose}>
            <Box sx={{ backgroundColor: '#fff', padding: '20px', margin: 'auto', width: '400px', borderRadius: '8px' }}>
                <Typography variant="h6" mb={2}>Share Question</Typography>

                {unsharedQuestions.length > 0 ? (
                    <List>
                        {unsharedQuestions.map((question) => (
                            <ListItem key={question.id} button onClick={() => handleToggle(question.id)}>
                                <ListItemIcon>
                                    <Checkbox
                                        edge="start"
                                        checked={selectedQuestions.includes(question.id)}
                                        tabIndex={-1}
                                        disableRipple
                                    />
                                </ListItemIcon>
                                <ListItemText primary={question.name} secondary={`ID: ${question.id}`} />
                            </ListItem>
                        ))}
                    </List>
                ) : (
                    <Typography>No more Question to Share.</Typography>
                )}

                <Box mt={2} display="flex" justifyContent="space-between">
                    <Button onClick={onClose} variant="outlined" disabled={loading}>
                        Exit
                    </Button>
                    <Button onClick={handleShare} variant="contained" color="primary" disabled={selectedQuestions.length === 0 || loading}>
                        {loading ? 'Sharing' : 'Share Check Question'}
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default ShareQuestionModal;