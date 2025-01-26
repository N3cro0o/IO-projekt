import React from 'react';
import { Box, Button, Modal, Typography, List, ListItem, ListItemText } from '@mui/material';

interface ShareQuestionModalProps {
    onClose: () => void;
    questions: { id: number; name: string; shared: boolean }[];
}

const ShareQuestionModal: React.FC<ShareQuestionModalProps> = ({ onClose, questions }) => {
    // Filtrujemy pytania, aby pokazaæ tylko te, które s¹ udostêpnione
    const sharedQuestions = questions.filter((q) => q.shared);

    return (
        <Modal open onClose={onClose}>
            <Box sx={{ backgroundColor: '#fff', padding: '20px', margin: 'auto', width: '400px', borderRadius: '8px' }}>
                <Typography variant="h6" mb={2}>Shared Questions</Typography>

                {sharedQuestions.length > 0 ? (
                    <List>
                        {sharedQuestions.map((question) => (
                            <ListItem key={question.id}>
                                <ListItemText primary={question.name} secondary={`ID: ${question.id}`} />
                            </ListItem>
                        ))}
                    </List>
                ) : (
                    <Typography>No shared questions available.</Typography>
                )}

                <Box mt={2} display="flex" justifyContent="flex-end">
                    <Button onClick={onClose} variant="contained" color="primary">
                        Close
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default ShareQuestionModal;