import React, { useEffect, useState } from "react";
import {
    Box,
    Button,
    Modal,
    Typography,
    CircularProgress,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Checkbox,
} from "@mui/material";

interface Question {
    id: number;
    name: string;
    category: string;
    shared: boolean;
}

interface SharedQuestionModalProps {
    open: boolean;
    onClose: () => void;
    testId: string;
}

const modalStyle = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "90%",
    maxWidth: 600,
    bgcolor: "#3a3a3a",
    color: "white",
    borderRadius: "16px",
    boxShadow: 24,
    p: 4,
};

const tableCellStyle = {
    color: "white",
    borderBottom: "1px solid #555",
};

const SharedQuestionModal: React.FC<SharedQuestionModalProps> = ({ open, onClose, testId }) => {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [saving, setSaving] = useState<boolean>(false);
    const [selectedQuestions, setSelectedQuestions] = useState<number[]>([]);

    // Fetch all shared questions
    const fetchQuestions = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`/api/SharedQuestion?testId=${testId}`);
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

    // Fetch test-specific questions (which are already added to the test)
    const fetchTestQuestions = async () => {
        try {
            const response = await fetch(`/api/SharedQuestion/test/${testId}`);
            if (!response.ok) {
                throw new Error(`Failed to fetch test questions: ${response.statusText}`);
            }
            const data: number[] = await response.json();  // List of question IDs assigned to the test
            setSelectedQuestions(data);
        } catch (err) {
            console.error("Failed to fetch test questions:", err);
        }
    };

    // Handle checkbox state changes
    const handleCheckboxChange = (id: number) => {
        if (selectedQuestions.includes(id)) {
            // Remove from test
            setSelectedQuestions((prev) => prev.filter((questionId) => questionId !== id));
            updateQuestionStatus(id, false);  // Remove from test
        } else {
            // Add to test
            setSelectedQuestions((prev) => [...prev, id]);
            updateQuestionStatus(id, true);   // Add to test
        }
    };

    // Update question's shared status and whether it's added to the test
    const updateQuestionStatus = async (questionId: number, addToTest: boolean) => {
        try {
            const response = await fetch(`/api/SharedQuestion/${questionId}/${testId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    shared: true,
                    addToTest: addToTest,  // Add or remove question from test
                    testId: testId,
                }),
            });
            if (!response.ok) {
                throw new Error('Failed to update question status');
            }
        } catch (err) {
            console.error("Error updating question status:", err);
        }
    };

    // Save changes (add or remove selected questions to/from the test)
    const saveChanges = async () => {
        setSaving(true);
        try {
            // Add selected questions to the test
            await Promise.all(
                selectedQuestions.map(async (questionId) => {
                    const response = await fetch(`/api/SharedQuestion/${questionId}/${testId}`, {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ shared: true, addToTest: true, testId }),
                    });
                    if (!response.ok) throw new Error();
                })
            );

            // Remove questions not selected from the test
            const questionsToRemove = questions
                .filter((question) => !selectedQuestions.includes(question.id))
                .map((question) => question.id);

            await Promise.all(
                questionsToRemove.map(async (questionId) => {
                    const response = await fetch(`/api/SharedQuestion/${questionId}/${testId}`, {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ shared: true, addToTest: false, testId }),
                    });
                    if (!response.ok) throw new Error();
                })
            );

            onClose();
        } catch (err) {
            console.error("Some updates failed!");
        } finally {
            setSaving(false);
        }
    };

    useEffect(() => {
        if (open) {
            fetchQuestions();
            fetchTestQuestions();  // Fetch the questions already added to the test
        }
    }, [open, testId]);

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={modalStyle}>
                <Typography variant="h6" mb={3} align="center" fontWeight="bold">
                    Manage Questions
                </Typography>
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
                                    <TableCell sx={tableCellStyle}>Name</TableCell>
                                    <TableCell sx={tableCellStyle}>Category</TableCell>
                                    <TableCell sx={tableCellStyle}>Shared</TableCell>
                                    <TableCell sx={tableCellStyle} align="right">
                                        Select
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {questions.map((question) => (
                                    <TableRow key={question.id}>
                                        <TableCell sx={tableCellStyle}>{question.name}</TableCell>
                                        <TableCell sx={tableCellStyle}>{question.category}</TableCell>
                                        <TableCell sx={tableCellStyle}>
                                            {question.shared ? "Yes" : "No"}
                                        </TableCell>
                                        <TableCell align="right" sx={tableCellStyle}>
                                            <Checkbox
                                                checked={selectedQuestions.includes(question.id)}
                                                onChange={() => handleCheckboxChange(question.id)}
                                                sx={{
                                                    color: "white",
                                                    "&.Mui-checked": { color: "#007bff" },
                                                }}
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Box>
                )}
                <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
                    <Button variant="contained" color="error" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        sx={{
                            backgroundColor: "#007bff",
                            color: "white",
                            "&:hover": { backgroundColor: "#0056b3" },
                        }}
                        onClick={saveChanges}
                        disabled={saving}
                    >
                        {saving ? "Saving..." : "Save Changes"}
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default SharedQuestionModal;
