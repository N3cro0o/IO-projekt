import React, { useState } from 'react';
import {
    Box,
    Modal,
    Typography,
    Button,
    Checkbox,
    Table,
    TableBody,
    TableCell,
    TableRow,
} from '@mui/material';

interface Question {
    name: string;
    shared: boolean;
}

interface ShareQuestionModalProps {
    open: boolean;
    onClose: () => void;
    questions: Question[];
    onShareUpdate: () => Promise<void>;
}

const modalStyle = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '90%',
    maxWidth: 600,
    bgcolor: '#3a3a3a', // Ciemny odcieñ szarego (jak w modal "Add Question")
    color: 'white',
    borderRadius: '16px',
    boxShadow: 24,
    p: 4,
};

const tableCellStyle = {
    color: 'white',
    borderBottom: '1px solid #555',
    fontWeight: 'bold', // Pogrubienie dla nazw testów
};

const ShareQuestionModal: React.FC<ShareQuestionModalProps> = ({ open, onClose, questions, onShareUpdate }) => {
    const [updates, setUpdates] = useState<{ name: string; shared: boolean }[]>(
        questions.map((q) => ({ name: q.name, shared: q.shared }))
    );

    const handleCheckboxChange = (name: string) => {
        setUpdates((prev) =>
            prev.map((q) => (q.name === name ? { ...q, shared: !q.shared } : q))
        );
    };

    const handleSave = async () => {
        try {
            const response = await fetch('/api/ShareQuestion/UpdateSharedStatus', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updates),
            });

            if (!response.ok) {
                throw new Error('Failed to update shared status');
            }

            await onShareUpdate();
            onClose();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={modalStyle}>
                <Typography
                    variant="h6"
                    mb={3}
                    align="center"
                    fontWeight="bold" // Wyboldowany tekst nag³ówka
                >
                    Manage Shared Questions
                </Typography>
                <Table>
                    <TableBody>
                        {updates.map((question) => (
                            <TableRow key={question.name}>
                                <TableCell sx={tableCellStyle}>{question.name}</TableCell>
                                <TableCell align="right" sx={tableCellStyle}>
                                    <Checkbox
                                        checked={question.shared}
                                        onChange={() => handleCheckboxChange(question.name)}
                                        sx={{
                                            color: 'white',
                                            '&.Mui-checked': {
                                                color: '#007bff',
                                            },
                                        }}
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
                    <Button
                        variant="contained" // Zmieniono na contained
                        color="error" // Kolor ustawiony na error
                        onClick={onClose}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        sx={{
                            backgroundColor: '#007bff',
                            color: 'white',
                            '&:hover': { backgroundColor: '#0056b3' },
                        }}
                        onClick={handleSave}
                    >
                        Save Changes
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default ShareQuestionModal;
