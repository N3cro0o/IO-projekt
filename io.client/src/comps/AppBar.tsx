import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';

import { Link, useNavigate } from 'react-router-dom';
import TemporaryDrawer from './Drawer.tsx'; // Import poprawionego Drawer
import React, { useState, useEffect } from 'react';

export function ButtonAppBar() {
    // Stan do kontrolowania otwierania/zamykania Drawer
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const navigate = useNavigate(); // Hook do nawigacji
=======
import { Link } from 'react-router-dom';
import TemporaryDrawer from './Drawer.tsx'; // Import poprawionego Drawer
import React from 'react';

export function ButtonAppBar() {
    // Stan do kontrolowania otwierania/zamykania Drawer
    const [drawerOpen, setDrawerOpen] = React.useState(false);


    // Funkcja do sterowania Drawer
    const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
        if (!isLoggedIn) {
            // Je�li u�ytkownik nie jest zalogowany, Drawer nie otwiera si�
            return;
        }
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setDrawerOpen(open);
    };

    // Funkcja do wylogowania
    const handleLogout = () => {
        localStorage.removeItem('authToken'); // Usuwamy token z localStorage
        setIsLoggedIn(false); // Ustawiamy stan na niezalogowanego
        navigate('/'); // Przekierowanie na stronê g³ówn¹
    };

    // Sprawdzanie, czy u¿ytkownik jest zalogowany
    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (token) {
            setIsLoggedIn(true); // Je¿eli token istnieje, u¿ytkownik jest zalogowany
        } else {
            setIsLoggedIn(false); // Jeli token nie istnieje, u¿ytkownik nie jest zalogowany
        }
    }, []);

    return (
        <Box sx={{ flexGrow: 1 }}>
            {/* Górny AppBar */}
            <AppBar
                position="fixed"
                sx={{
                    backgroundColor: '#616161',
                    top: 0,
                    left: 0,
                    width: '100%',
                    zIndex: 1100,
                }}
            >
                <Toolbar>
                    {/* Przyciski na AppBar */}
                    <IconButton
                        onClick={toggleDrawer(true)} // Drawer otwiera si� tylko, gdy u�ytkownik jest zalogowany
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2 }}
                        disabled={!isLoggedIn} // Wy��czenie przycisku, je�li u�ytkownik nie jest zalogowany
                    >
                        <MenuIcon />
                    </IconButton>

                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        {/* Tutaj mo¿esz dodaæ logo lub nazwê aplikacji */}
                    </Typography>


                    {/* Sprawdzamy, czy u¿ytkownik jest zalogowany, i wywietlamy odpowiedni przycisk */}
                    {isLoggedIn ? (
                        <Button
                            onClick={handleLogout}
                            sx={{
                                color: '#ffffff',
                                backgroundColor: '#ff4d4d', // Czerwony kolor przycisku wylogowania
                                '&:hover': {
                                    backgroundColor: '#b30000',
                                },
                            }}
                        >
                            Logout
                        </Button>
                    ) : (
                        <Link to="/loginPage" style={{ textDecoration: 'none' }}>
                            <Button
                                sx={{
                                    color: '#ffffff',
                                    backgroundColor: '#007bff', // Niebieski kolor przycisku logowania
                                    '&:hover': {
                                        backgroundColor: '#0056b3',
                                    },
                                }}
                            >
                                Login
                            </Button>
                        </Link>
                    )}
                    <Link to="/loginPage" style={{ textDecoration: 'none' }}>
                        <Button
                            sx={{
                                color: '#ffffff',
                                backgroundColor: '#007bff',
                                '&:hover': {
                                    backgroundColor: '#0056b3',
                                },
                            }}
                        >
                            Login
                        </Button>
                    </Link>
                </Toolbar>
            </AppBar>

            {/* Drawer umieszczony poza Toolbar */}
            <TemporaryDrawer open={drawerOpen} toggleDrawer={toggleDrawer} />
        </Box>
    );
}
