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

interface ShareQuestionModalProps {
    open: boolean;
    onClose: () => void;
    questions:Question[];
    onShareUpdate: () => Promise<void>;
}

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
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 600,
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                    borderRadius: 2,
                }}
            >
                <Typography variant="h6" mb={2}>
                    Manage Shared Questions
                </Typography>
                <Table>
                    <TableBody>
                        {updates.map((question) => (
                            <TableRow key={question.name}>
                                <TableCell>{question.name}</TableCell>
                                <TableCell align="right">
                                    <Checkbox
                                        checked={question.shared}
                                        onChange={() => handleCheckboxChange(question.name)}
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <Box mt={2} display="flex" justifyContent="flex-end" gap={1}>
                    <Button variant="outlined" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button variant="contained" color="primary" onClick={handleSave}>
                        Save Changes
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default ShareQuestionModal;
