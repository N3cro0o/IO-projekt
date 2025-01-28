import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { Link } from 'react-router-dom'; // importujemy Link do nawigacji
import AssignmentIcon from '@mui/icons-material/Assignment';
import HomeIcon from '@mui/icons-material/Home'; // Ikona dla ekranu g��wnego
import DashboardIcon from '@mui/icons-material/Dashboard';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import { jwtDecode } from "jwt-decode";


const TemporaryDrawer = ({ open, toggleDrawer, token }) => {
    let user_check = false;
    let admin_check = false;

    if (token) {
        try {
            const decoded = jwtDecode(token);
            console.log(decoded.role.toLowerCase());
            if (decoded.role == 'student' || decoded.role == 'uczen') {
                user_check = true;
            }
            else if (decoded.role.toLowerCase() == 'admin') {
                admin_check = true;
            }
        } catch (error) {
            console.error('Piedolony lag muzgu:', error);
        }
    }

    const DrawerList = (
        <Box
            sx={{
                width: 250,
                backgroundColor: '#616161', // T�o drawer'a - szary
                color: 'white', // Kolor tekstu - bia�y
                height: '100vh', // Pe�na wysoko��
            }}
            role="presentation"
            onClick={toggleDrawer(false)}
            onKeyDown={toggleDrawer(false)}
        >
            {/* Link do strony g��wnej */}
            <ListItem button component={Link} to="/">
                <ListItemIcon sx={{ color: '#007bff' }}> {/* Kolor ikon - niebieski */}
                    <HomeIcon /> {/* Ikona strony g��wnej */}
                </ListItemIcon>
                <ListItemText primary="Home" sx={{ color: 'white' }} /> {/* Kolor tekstu - bia�y */}
            </ListItem>
            
            {/* Your Courses link */}
            {(user_check || admin_check) && (
                <List>
                    <ListItem button component={Link} to="/student/courses">
                        <ListItemIcon sx={{ color: '#007bff' }}> {/* Kolor ikon - niebieski */}
                            <DashboardIcon /> {/* Ikona dashboard */}
                        </ListItemIcon>
                        <ListItemText primary="Your courses" sx={{ color: 'white' }} /> {/* Kolor tekstu - bia�y */}
                    </ListItem>
                </List>
            )}

            {!user_check && (
                <List>
                    {/* Link do Course Management */}
                    <ListItem button component={Link} to="/CourseManagment">
                        <ListItemIcon sx={{ color: '#007bff' }}> {/* Kolor ikon - niebieski */}
                            <DashboardIcon /> {/* Ikona dashboard */}
                        </ListItemIcon>
                        <ListItemText primary="Courses Management" sx={{ color: 'white' }} /> {/* Kolor tekstu - bia�y */}
                    </ListItem>
                </List>
            )}
            <List>
                {/* Link do User Panel */}
                <ListItem button component={Link} to="/UserPanel">
                    <ListItemIcon sx={{ color: '#007bff' }}> {/* Kolor ikon - niebieski */}
                        <AssignmentIcon /> {/* Ikona panelu u�ytkownika */}
                    </ListItemIcon>
                    <ListItemText primary="Tests Managment" sx={{ color: 'white' }} /> {/* Kolor tekstu - bia�y */}
                </ListItem>
            </List>
            <List>
                {/* Link do User Panel */}
                <ListItem button component={Link} to="/AccountManager">
                    <ListItemIcon sx={{ color: '#007bff' }}> {/* Kolor ikon - niebieski */}
                        <AccountBoxIcon /> {/* Ikona panelu u�ytkownika */}
                    </ListItemIcon>
                    <ListItemText primary="Account Managment" sx={{ color: 'white' }} /> {/* Kolor tekstu - bia�y */}
                </ListItem>
            </List>
        </Box>
    );

    return (
        <Drawer anchor="left" open={open} onClose={toggleDrawer(false)}>
            {DrawerList}
        </Drawer>
    );
};

export default TemporaryDrawer;