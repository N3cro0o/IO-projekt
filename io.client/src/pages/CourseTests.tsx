import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box,
    Button,
    Card,
    CardContent,
    Typography,
    CircularProgress,
    Snackbar,
} from '@mui/material';
import { ButtonAppBar } from '../comps/AppBar.tsx';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ModalAddTest from '../comps/modalAddTests'; // Importujemy modal do dodawania testów
import ArchiveTestModal from '../comps/ModalArchiveTest';


interface Test {
    testId: number;
    name: string;
    startTime: string;
    endTime: string;
    category: string;
    courseId: number;
    archived: boolean;
}

const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${day}-${month}-${year} ${hours}:${minutes}`;
};

const CourseTests: React.FC = () => {
    const { courseId } = useParams<{ courseId: string }>();
    const navigate = useNavigate();
    const [tests, setTests] = useState<Test[]>([]);
    const [loading, setLoading] = useState(true);
    const [startedTest, setStartedTest] = useState<string | null>(null);
    const [deletedTest, setDeletedTest] = useState<string | null>(null);
    const [modalOpen, setModalOpen] = useState(false); // Zarz¹dzanie stanem modala do testów

    useEffect(() => {
        const fetchTests = async () => {
            try {
                const response = await fetch(`https://localhost:59127/api/TestManager/TestsList/${courseId}/tests`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data: Test[] = await response.json();
                setTests(data);
            } catch (error) {
                console.error('Error while fetching tests:', error);
                setTests([]);
            } finally {
                setLoading(false);
            }
        };

        fetchTests();
    }, [courseId]);

    const handleStartTest = async (testName: string, testId: number) => {
        try {
            const response = await fetch(`https://localhost:59127/api/TestManager/StartTest/${testId}`, {
                method: 'PUT',
            });

            if (response.ok) {
                setStartedTest(testName);
                setTests((prevTests) =>
                    prevTests.map((test) =>
                        test.testId === testId
                            ? {
                                ...test,
                                startTime: new Date().toISOString(),
                                endTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
                            }
                            : test
                    )
                );
            } else {
                console.error(`Failed to start test: ${response.status}`);
            }
        } catch (error) {
            console.error('Error starting test:', error);
        } finally {
            setTimeout(() => setStartedTest(null), 5000);
        }
    };

    const handleDeleteTest = async (testId: number, testName: string) => {
        const confirmDelete = window.confirm(`Are you sure you want to delete the test "${testName}"?`);
        if (!confirmDelete) return;

        try {
            const response = await fetch(`https://localhost:59127/api/TestManager/DeleteTest/${testId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setTests((prevTests) => prevTests.filter((test) => test.testId !== testId));
                setDeletedTest(testName);
                setTimeout(() => setDeletedTest(null), 5000);
            } else {
                console.error(`Error while deleting test: ${response.status}`);
            }
        } catch (error) {
            console.error('Error while deleting test:', error);
        }
    };

    const handleSetTime = (testId: number) => {
        navigate(`/course/${courseId}/test/${testId}/set-time`);
    };

    const handleCheckResults = (testId: number) => {
        navigate(`/course/${courseId}/test/${testId}/results`);
    };

    const handleAddTest = (newTest: Test) => {
        setTests((prevTests) => [...prevTests, newTest]);
    };

    const handleEditTest = (testId: number) => {
        navigate(`/course/${courseId}/test/${testId}/edit`);
    };


    const [archiveModalOpen, setArchiveModalOpen] = useState(false);
    const [currentTest, setCurrentTest] = useState<Test | null>(null);

    const openArchiveModal = (test: Test) => {
        setCurrentTest(test);
        setArchiveModalOpen(true);
    };

    const closeArchiveModal = () => {
        setArchiveModalOpen(false);
        setCurrentTest(null);
    };

    const confirmArchiveTest = async (archived: boolean) => {
        if (!currentTest) return;

        try {
            const response = await fetch(`https://localhost:59127/api/ArchiveTest/ArchiveTest/${currentTest.testId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ archived }), // Wysy³amy tylko status archiwizacji
            });

            if (response.ok) {
                setTests((prevTests) =>
                    prevTests.map((test) =>
                        test.testId === currentTest.testId ? { ...test, archived } : test
                    )
                );
            } else {
                console.error(`Failed to archive test: ${response.status}`);
            }
        } catch (error) {
            console.error('Error archiving test:', error);
        } finally {
            closeArchiveModal();
        }
    };




    return (
        <div>
            <ButtonAppBar />
            <Box sx={{ padding: '60px 20px 20px', maxWidth: '800px', margin: '0 auto' }}>
                <Typography variant="h4" color="white" align="center" gutterBottom>
                    Test Panel
                </Typography>
                <Box sx={{ textAlign: 'center', marginBottom: '20px' }}>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AddCircleIcon />}
                        onClick={() => setModalOpen(true)}
                        sx={{
                            borderRadius: '50px',
                            backgroundColor: '#0066CC',
                            '&:hover': { backgroundColor: '#004C99' },
                        }}
                    >
                        Add Test
                    </Button>
                </Box>
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                        <CircularProgress />
                    </Box>
                ) : tests.length === 0 ? (
                    <Typography variant="h6" align="center">No tests available.</Typography>
                ) : (
                    <Box sx={{ display: 'grid', gap: '16px' }}>
                        {tests.map((test) => (
                            <Card
                                key={test.testId}
                                sx={{
                                    backgroundColor: '#444',
                                    color: 'white',
                                    textAlign: 'center',
                                    maxWidth: '600px',
                                    margin: '0 auto',
                                }}
                            >
                                <CardContent>
                                    <Typography variant="h6">{test.name}</Typography>
                                    <Typography variant="body2">Category: {test.category}</Typography>
                                    <Typography variant="body2">
                                        Dates: {test.startTime ? formatDate(test.startTime) : 'Not set'}{' '}
                                        - {test.endTime ? formatDate(test.endTime) : 'Not set'}
                                    </Typography>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            flexWrap: 'wrap',
                                            gap: '8px',
                                            marginTop: '12px',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={() => handleSetTime(test.testId)}
                                        >
                                            Set time
                                        </Button>
                                        <Button
                                            variant="contained"
                                            color="success"
                                            onClick={() => handleStartTest(test.name, test.testId)}
                                        >
                                            Start test
                                        </Button>
                                        <Button
                                            variant="contained"
                                            color="error"
                                            onClick={() => handleDeleteTest(test.testId, test.name)}
                                        >
                                            Delete test
                                        </Button>
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            onClick={() => handleEditTest(test.testId)} // Przekierowanie do edycji testu
                                        >
                                            Edit Test
                                        </Button>
                                        <Button
                                            variant="contained"
                                            color="info"
                                            onClick={() => handleCheckResults(test.testId)}
                                        >
                                            View report
                                        </Button>

                                        <Button
                                            variant="contained"
                                            color={test.archived ? 'warning' : 'null'}
                                            onClick={() => openArchiveModal(test)}
                                        >
                                            {test.archived ? 'Unarchive the Test' : 'Archive the Test'}
                                        </Button>
                                        <ArchiveTestModal
                                            open={archiveModalOpen}
                                            onClose={closeArchiveModal}
                                            onConfirm={confirmArchiveTest}
                                            testName={currentTest?.name || ''}
                                            isArchived={currentTest?.archived || false}
                                        />




                                    </Box>
                                </CardContent>
                            </Card>
                        ))}
                    </Box>
                )}
                <Snackbar
                    open={!!startedTest}
                    autoHideDuration={5000}
                    onClose={() => setStartedTest(null)}
                    message={`Test "${startedTest}" started successfully!`}
                />
                <Snackbar
                    open={!!deletedTest}
                    autoHideDuration={5000}
                    onClose={() => setDeletedTest(null)}
                    message={`Test "${deletedTest}" deleted successfully!`}
                />
                <ModalAddTest
                    open={modalOpen}
                    handleClose={() => setModalOpen(false)}
                    courseId={Number(courseId)}
                    onAddTest={handleAddTest}
                />
            </Box>
        </div>
    );
};

export default CourseTests;
