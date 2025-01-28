import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { Button, Checkbox, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '80%',
    maxWidth: 800,
    bgcolor: '#333',
    color: '#fff',
    borderRadius: '16px',
    boxShadow: 24,
    p: 4,
    overflow: 'hidden',
};

const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
    borderBottom: '2px solid #555',
    paddingBottom: '10px',
};

const contentStyle = {
    overflowY: 'auto',
    maxHeight: '60vh',
    scrollbarWidth: 'thin',
    '&::-webkit-scrollbar': {
        width: '8px',
    },
    '&::-webkit-scrollbar-thumb': {
        backgroundColor: '#888',
        borderRadius: '4px',
    },
    '&::-webkit-scrollbar-thumb:hover': {
        backgroundColor: '#555',
    },
};

interface Test {
    id: number;
    name: string;
    start: string;
    end: string;
    cat: string;
}

export default function ModalShowTestsStudent({ courseID, coursename, handleClose }: { courseID: number, coursename: string, handleClose: () => void }) {
    const [open, setOpen] = React.useState(true);  // Modal powinien otwieraæ siê tylko raz po klikniêciu przycisku
    const [tests, setTests] = useState<Test[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const navigate = useNavigate(); // hook do nawigacji w React Router v6


    const closeModal = () => {
        setOpen(false);
        handleClose();
    };

    const transformTestData = (apiData: any[]): Test[] => {
        return apiData.map((test) => ({
            id: test.testId,
            name: test.name,
            start: test.startTime,
            end: test.endTime,
            cat: test.category
        }));
    };

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch('https://localhost:59127/api/TestManager/TestsList/' + courseID + '/tests');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const apiData = await response.json();
                console.log(apiData);
                const transformedData = transformTestData(apiData);
                console.log(transformedData)
                setTests(transformedData);
            } catch (error) {
                console.error('Error fetching users:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [courseID]);

    if (loading) return <div>Loading...</div>;

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <div style={headerStyle}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Add Users to Course: {coursename} {/*przeslac nazwe kursu */}
                    </Typography>
                    <IconButton onClick={handleClose} style={{ color: 'red' }}>
                        <CloseIcon />
                    </IconButton>
                </div>
                <Box sx={contentStyle}>
                    <div style={{ backgroundColor: '#333', padding: '20px', borderRadius: '8px', color: '#fff' }}>
                        <h2>Select test</h2>
                        <TableContainer component={Paper} sx={{ backgroundColor: '#444', borderRadius: '8px' }}>
                            <Table sx={{ minWidth: 650 }} aria-label="test table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell style={{ color: '#fff' }}>Select</TableCell>
                                        <TableCell style={{ color: '#fff' }}>Name</TableCell>
                                        <TableCell style={{ color: '#fff' }}>Start</TableCell>
                                        <TableCell style={{ color: '#fff' }}>End</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {tests.map((test) => (
                                        <TableRow key={test.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                            <TableCell style={{ color: '#fff' }}>
                                                {/*Add button turning off when test is not ready*/}
                                                <Button variant="contained" color="success" onClick={() => navigate('/student/' + test.id + '/start')}>
                                                    Start test
                                                </Button>

                                            </TableCell>
                                            <TableCell style={{ color: '#fff' }}>{test.name}</TableCell>
                                            <TableCell style={{ color: '#fff' }}>{test.start}</TableCell>
                                            <TableCell style={{ color: '#fff' }}>{test.end}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </div>
                </Box>
            </Box>
        </Modal>
    );
}
