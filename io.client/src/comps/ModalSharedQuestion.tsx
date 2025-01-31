import React, { useEffect, useState } from "react";
import { Box, Button, Modal, Typography, CircularProgress, Table, TableBody, TableCell, TableHead, TableRow, Checkbox } from "@mui/material";

interface Question {
    id: number;
    name: string;
    category: string;
    shared: boolean;
}

interface SharedQuestionModalProps {
    open: boolean;
    onClose: () => void;
    testId: string;  // Dodanie testId jako prop
}

const SharedQuestionModal: React.FC<SharedQuestionModalProps> = ({ open, onClose, testId }) => {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [saving, setSaving] = useState<boolean>(false);
    const [selectedQuestions, setSelectedQuestions] = useState<number[]>([]);

    // Pobierz pytania z serwera
    const fetchQuestions = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`/api/SharedQuestion?testId=${testId}`);  // Przekazanie testId w zapytaniu
            if (!response.ok) {
                throw new Error(`Failed to fetch questions: ${response.statusText}`);
            }
            const data: Question[] = await response.json();
            setQuestions(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Unknown error occurred.");
        } finally {
            setLoading(false);
        }
    };

    // Zmiana stanu zaznaczonych pytañ
    const handleCheckboxChange = (id: number) => {
        setSelectedQuestions(prev =>
            prev.includes(id) ? prev.filter(qId => qId !== id) : [...prev, id]
        );
    };

    // Zapisz zmiany dla zaznaczonych pytañ
    const saveChanges = async () => {
        setSaving(true);
        let failedUpdates: number[] = [];

        try {
            await Promise.all(
                selectedQuestions.map(async (questionId) => {
                    const question = questions.find(q => q.id === questionId);
                    if (question) {
                        const response = await fetch(`/api/SharedQuestion/${question.id}/${testId}`, {
                            method: "PATCH",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                shared: true,        // Zak³adaj¹c, ¿e chcesz, aby te pytania by³y udostêpnione
                                addToTest: true,     // Dodaj do testu (lub mo¿esz zmieniæ to w zale¿noœci od checkboxa)
                                testId: testId,      // Identyfikator testu
                            }),
                        });

                        if (!response.ok) {
                            failedUpdates.push(question.id);
                        }
                    }
                })
            );

            if (failedUpdates.length > 0) {
                throw new Error(`Failed to update questions: ${failedUpdates.join(", ")}`);
            }
        } catch (err) {
            console.error(err);
            alert("Some updates failed! Check console.");
        } finally {
            setSaving(false);
            if (failedUpdates.length === 0) onClose();
        }
    };


    useEffect(() => {
        if (open) {
            fetchQuestions();
        }
    }, [open, saving, testId]);

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "80%", bgcolor: "background.paper", border: "2px solid #000", boxShadow: 24, p: 4, borderRadius: "8px" }}>
                <Typography variant="h6" mb={2}>Manage Questions</Typography>
                {loading ? (
                    <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                        <CircularProgress />
                    </Box>
                ) : error ? (
                    <Typography color="error">{error}</Typography>
                ) : (
                    <Box sx={{ maxHeight: "400px", overflowY: "auto" }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Category</TableCell>
                                    <TableCell>Shared</TableCell>
                                    <TableCell>Select</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {questions.map((question) => (
                                    <TableRow key={question.id}>
                                        <TableCell>{question.name}</TableCell>
                                        <TableCell>{question.category}</TableCell>
                                        <TableCell>{question.shared ? "True" : "False"}</TableCell>
                                        <TableCell>
                                            <Checkbox
                                                checked={selectedQuestions.includes(question.id)}
                                                onChange={() => handleCheckboxChange(question.id)}
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Box>
                )}
                <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
                    <Button variant="contained" color="secondary" onClick={onClose}>
                        Close
                    </Button>
                    <Button variant="contained" color="primary" onClick={saveChanges} disabled={saving}>
                        {saving ? "Saving..." : "Save Changes"}
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default SharedQuestionModal;
