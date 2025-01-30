import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { Link } from 'react-router-dom';
import AssignmentIcon from '@mui/icons-material/Assignment';
import HomeIcon from '@mui/icons-material/Home';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import { jwtDecode } from "jwt-decode";

const TemporaryDrawer = ({ open, toggleDrawer, token }) => {
    let user_check = false;
    let admin_check = false;
    let teacher_check = false;
    let student_check = false;

    if (token) {
        try {
            const decoded = jwtDecode(token);
            const role = decoded.role.toLowerCase();
            
            if (role === 'student' || role === 'uczen') {
                user_check = true;
                student_check = true;
            }
            else if (role === 'admin') {
                admin_check = true;
            }
            else if (role === 'nauczyciel') {
                teacher_check = true;
            }
        } catch (error) {
            console.error('B³¹d dekodowania tokena:', error);
        }
    }

    const DrawerList = (
        <Box
            sx={{
                width: 250,
                backgroundColor: '#616161',
                color: 'white',
                height: '100vh',
            }}
            role="presentation"
            onClick={toggleDrawer(false)}
            onKeyDown={toggleDrawer(false)}
        >
            <ListItem button component={Link} to="/">
                <ListItemIcon sx={{ color: '#007bff' }}>
                    <HomeIcon />
                </ListItemIcon>
                <ListItemText primary="Home" sx={{ color: 'white' }} />
            </ListItem>
            
            {(user_check || admin_check) && (
                <List>
                    <ListItem button component={Link} to="/student/courses">
                        <ListItemIcon sx={{ color: '#007bff' }}>
                            <DashboardIcon />
                        </ListItemIcon>
                        <ListItemText primary="Your courses" sx={{ color: 'white' }} />
                    </ListItem>
                </List>
            )}
            
            {!user_check && (
                <List>
                    <ListItem button component={Link} to="/CourseManagment">
                        <ListItemIcon sx={{ color: '#007bff' }}>
                            <DashboardIcon />
                        </ListItemIcon>
                        <ListItemText primary="Courses Management" sx={{ color: 'white' }} />
                    </ListItem>
                </List>
            )}
            
            <List>
                <ListItem button component={Link} to="/UserPanel">
                    <ListItemIcon sx={{ color: '#007bff' }}>
                        <AssignmentIcon />
                    </ListItemIcon>
                    <ListItemText primary="Tests Management" sx={{ color: 'white' }} />
                </ListItem>
            </List>
            
            <List>
                <ListItem button component={Link} to="/AccountManager">
                    <ListItemIcon sx={{ color: '#007bff' }}>
                        <AccountBoxIcon />
                    </ListItemIcon>
                    <ListItemText primary="Account Management" sx={{ color: 'white' }} />
                </ListItem>
            </List>
            
             (
                <List>
                    <ListItem button component={Link} to="/TestToCheck">
                        <ListItemIcon sx={{ color: '#007bff' }}>
                            <AssignmentIcon />
                        </ListItemIcon>
                        <ListItemText primary="Test To Check" sx={{ color: 'white' }} />
                    </ListItem>
                </List>
            )
            
             (
                <List>
                    <ListItem button component={Link} to="/CheckResults">
                        <ListItemIcon sx={{ color: '#007bff' }}>
                            <AssignmentIcon />
                        </ListItemIcon>
                        <ListItemText primary="Check Your Results" sx={{ color: 'white' }} />
                    </ListItem>
                </List>
            )
        </Box>
    );

    return (
        <Drawer anchor="left" open={open} onClose={toggleDrawer(false)}>
            {DrawerList}
        </Drawer>
    );
};

export default TemporaryDrawer;
