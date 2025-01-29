import { Link, useNavigate } from 'react-router-dom';
import { ButtonAppBar } from '../comps/AppBar.tsx';
import { useState } from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { Alert } from '@mui/material';
import { jwtDecode } from "jwt-decode";

export const Login = () => {
    const [formData, setFormData] = useState({
        login: '',
        password: '',
    });

    const [loginError, setLoginError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const navigate = useNavigate(); // hook do nawigacji w React Router v6

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value }); // Aktualizacja formData na podstawie nazwy pola
    };

    const checkLogin = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault(); // Zapobiega przeładowaniu strony

        setLoginError('');
        setPasswordError('');

        if (!formData.login || !formData.password) {
            if (!formData.login) setLoginError('Enter login');
            if (!formData.password) setPasswordError('Enter password');
            return;
        }

        try {
            const response = await fetch('https://localhost:7293/api/Login/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    Login: formData.login,
                    Password: formData.password,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('userId', String(data.userId)); // Zapisz ID użytkownika
                localStorage.setItem('authToken', data.token); // Zapisz token
                navigate('/UserPanel');
            } else {
                setLoginError('Incorrect login details');
            }
        } catch (error) {
            setLoginError('An error occurred while logging in ');
        }
    };

    return (
        <div id="mainContainer" style={{ padding: '20px' }}>
            <ButtonAppBar />
            <div id="loginContainer" style={{ marginTop: '20px' }}>
                <Box
                    sx={{
                        maxWidth: '400px',
                        margin: '0 auto',
                        padding: '20px',
                        backgroundColor: '#444',
                        borderRadius: '8px',
                        boxShadow: 2,
                    }}
                >
                    <Typography variant="h6" color="white" sx={{ marginBottom: '20px' }}>
                        Login to your account
                    </Typography>

                    <form onSubmit={checkLogin}>
                        <TextField
                            label="Username"
                            name="login"
                            type="text"
                            value={formData.login}
                            onChange={handleChange}
                            fullWidth
                            sx={{
                                marginBottom: '16px',
                                '& .MuiInputLabel-root': { color: 'white' },
                                '& .MuiInputBase-root': {
                                    backgroundColor: '#333',
                                    color: 'white',
                                },
                            }}
                        />
                        {loginError && (
                            <Alert severity="error" sx={{ marginBottom: '16px' }}>
                                {loginError}
                            </Alert>
                        )}
                        <TextField
                            label="Password"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            fullWidth
                            sx={{
                                marginBottom: '16px',
                                '& .MuiInputLabel-root': { color: 'white' },
                                '& .MuiInputBase-root': {
                                    backgroundColor: '#333',
                                    color: 'white',
                                },
                            }}
                        />
                        {passwordError && (
                            <Alert severity="error" sx={{ marginBottom: '16px' }}>
                                {passwordError}
                            </Alert>
                        )}
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{
                                color: '#fff',
                                backgroundColor: '#007bff',
                                '&:hover': { backgroundColor: '#0056b3' },
                                marginTop: '20px',
                            }}
                        >
                            Login
                        </Button>
                    </form>

                    <Box sx={{ marginTop: '16px', textAlign: 'center' }}>
                        <Link to="/" style={{ color: '#fff', textDecoration: 'none' }}>
                            Go back
                        </Link>
                    </Box>
                </Box>
            </div>
        </div>
    );
};
