import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import AddCourse from '../pages/addCourse'; // Twoja logika dodawania kursu

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '80%',
    maxWidth: 400,
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

export default function ModalAddCourse({
    ownerId,
    handleClose,
    open,
    refreshCourses,
}: {
    ownerId: number;
    handleClose: () => void;
    open: boolean;
    refreshCourses: () => void;
}) {
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
                        Create new Course
                    </Typography>
                    <IconButton onClick={handleClose} style={{ color: 'red' }}>
                        <CloseIcon />
                    </IconButton>
                </div>
                <AddCourse ownerId={ownerId} handleClose={handleClose} refreshCourses={refreshCourses} />
            </Box>
        </Modal>
    );
}
