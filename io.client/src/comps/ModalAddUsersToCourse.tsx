import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import UserList from '../pages/AddUsersToCoursePage';

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

export default function BasicModal({ courseId, coursename, handleClose }: { courseId: number, coursename: string, handleClose: () => void }) {
    const [open, setOpen] = React.useState(true);  // Modal powinien otwieraæ siê tylko raz po klikniêciu przycisku

    const closeModal = () => {
        setOpen(false);
        handleClose();
    };

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
                        Add Users to Course: {coursename} {/*przeslac nazwe kursu */ }
                    </Typography>
                    <IconButton onClick={handleClose} style={{ color: 'red' }}>
                        <CloseIcon />
                    </IconButton>
                </div>
                <Box sx={contentStyle}>
                    <UserList courseId={courseId} onUsersAdded={closeModal}/>
                </Box>
            </Box>
        </Modal>
    );
}
