import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import UserList from '../pages/UserList';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '90%',
    maxWidth: 600,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    borderRadius: '16px', // Zaokr¹glone rogi
    overflow: 'hidden',
};

const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
};

const contentStyle = {
    overflowY: 'auto',
    maxHeight: '60vh',
    scrollbarWidth: 'thin', // Dodano stylizacjê scrollbarów
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

export default function BasicModal() {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <div>
            <Button onClick={handleOpen}>Open modal</Button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <div style={headerStyle}>
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                            User List
                        </Typography>
                        <IconButton onClick={handleClose} style={{ color: 'red' }}>
                            <CloseIcon />
                        </IconButton>
                    </div>
                    <Box sx={{ ...contentStyle }}> {/* Dodano scrollbar i przewijanie */}
                        <UserList />
                    </Box>
                </Box>
            </Modal>
        </div>
    );
}
