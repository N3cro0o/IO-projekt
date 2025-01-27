import React, { useState } from 'react';
import { Modal, Box, Typography, Button, Checkbox, Divider } from '@mui/material';

interface Question {
    id: number;
    name: string;
    shared: boolean;
}

interface ShareQuestionModalProps {
    questions: Question[];
    onClose: () => void;
    onShareUpdate: () => void;
}

const ShareQuestionModal: React.FC<ShareQuestionModalProps> = ({ questions, onClose, onShareUpdate }) => {
    // Tworzymy stan dla wszystkich pytañ i ich wartoœci 'shared'
    const [selectedQuestions, setSelectedQuestions] = useState<Record<number, boolean>>(
        questions.reduce((acc, question) => {
            acc[question.id] = question.shared;
            return acc;
        }, {})
    );

    // Funkcja prze³¹czaj¹ca stan zaznaczenia pytania
    const handleToggle = (id: number) => {
        setSelectedQuestions((prev) => ({
            ...prev,
            [id]: !prev[id], // Odwracamy wartoœæ tylko dla wybranego ID
        }));
    };

    // Funkcja do wys³ania zmian do API
    const handleSubmit = async () => {
        const updates = Object.entries(selectedQuestions).map(([id, shared]) => ({
            id: Number(id),
            shared,
        }));

        try {
            const response = await fetch('/api/ShareQuestion/UpdateSharedStatus', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updates),
            });

            if (response.ok) {
                console.log('Shared status updated successfully.');
                onShareUpdate(); // Aktualizujemy dane w aplikacji
                onClose(); // Zamykamy modal
            } else {
                console.error('Failed to update shared status:', await response.text());
                throw new Error('API response was not OK');
            }
        } catch (error) {
            console.error('Error while updating shared status:', error);
        }
    };

    return (
        <Modal open onClose={onClose}>
            <Box
                sx={{
                    width: 500,
                    bgcolor: 'background.paper',
                    p: 4,
                    borderRadius: 2,
                    margin: 'auto',
                    mt: 5,
                    boxShadow: 24,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <Typography variant="h5" mb={2} sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                    Share Questions
                </Typography>
                <Divider sx={{ width: '100%', mb: 2 }} />
                <Box sx={{ maxHeight: 300, overflowY: 'auto', width: '100%' }}>
                    {questions.map((q) => (
                        <Box
                            key={q.id}
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                mb: 2,
                                borderBottom: '1px solid #ddd',
                                padding: '8px 0',
                            }}
                        >
                            <Box sx={{ flex: 1 }}>
                                <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                                    {q.name}
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Typography variant="body2" sx={{ mr: 2 }}>
                                    {selectedQuestions[q.id] ? 'Shared' : 'Not Shared'}
                                </Typography>
                                <Checkbox
                                    checked={selectedQuestions[q.id]} // Stan tylko dla tego pytania
                                    onChange={() => handleToggle(q.id)} // Zmieniamy tylko to pytanie
                                />
                            </Box>
                        </Box>
                    ))}
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3, width: '100%' }}>
                    <Button variant="outlined" color="secondary" onClick={onClose} sx={{ flex: 1 }}>
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSubmit}
                        sx={{ flex: 1, ml: 2 }}
                    >
                        Save
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default ShareQuestionModal;
