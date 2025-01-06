import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    TextField,
    Button,
    Paper,
    Alert,
    CircularProgress,
} from '@mui/material';
import { ButtonAppBar } from '../comps/AppBar.tsx';

export const UserProfilePage: React.FC = () => {
    const [userData, setUserData] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [updateError, setUpdateError] = useState<string>('');
    const [updateSuccess, setUpdateSuccess] = useState<string>('');
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        newPassword: '',
    });

    const navigate = useNavigate();

    // Pobranie danych u¿ytkownika z API
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch('https://localhost:7293/api/Account/showData', {
                    method: 'GET',
                    headers: {
                        //'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch user data');
                }

                const data = await response.json();
                setUserData(data);
                setFormData({
                    username: data.username,
                    email: data.email,
                    password: '',
                    newPassword: '',
                });
            } catch (error) {
                setUpdateError('An error occurred while fetching user data.');
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        setUpdateError('');
        setUpdateSuccess('');

        try {
            const response = await fetch('https://localhost:7293/api/UserProfile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    //'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                },
                body: JSON.stringify({
                    username: formData.username,
                    email: formData.email,
                    password: formData.password,
                    newPassword: formData.newPassword,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to update user data');
            }

            setUpdateSuccess('User data updated successfully!');
        } catch (error) {
            setUpdateError('An error occurred while updating user data.');
            console.error(error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        navigate('/login');
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <div>
            <ButtonAppBar />
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingTop: '60px',
                }}
            >
                <Paper
                    elevation={3}
                    sx={{
                        padding: '32px',
                        width: '100%',
                        maxWidth: '500px',
                        backgroundColor: '#444',
                        borderRadius: '8px',
                    }}
                >
                    <Typography variant="h5" color="white" align="center" sx={{ marginBottom: '20px' }}>
                        User Profile
                    </Typography>

                    {updateError && (
                        <Alert severity="error" sx={{ marginBottom: '16px' }}>
                            {updateError}
                        </Alert>
                    )}

                    {updateSuccess && (
                        <Alert severity="success" sx={{ marginBottom: '16px' }}>
                            {updateSuccess}
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit}>
                        <TextField
                            label="Username"
                            name="username"
                            type="text"
                            value={formData.username}
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
                        <TextField
                            label="Email"
                            name="email"
                            type="email"
                            value={formData.email}
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
                        <TextField
                            label="Current Password"
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
                        <TextField
                            label="New Password"
                            name="newPassword"
                            type="password"
                            value={formData.newPassword}
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
                            Save Changes
                        </Button>
                    </form>

                    <Button
                        fullWidth
                        variant="contained"
                        color="error"
                        sx={{
                            borderColor: '#007bff',
                            '&:hover': { borderColor: '#0056b3' },
                            marginTop: '20px',
                        }}
                        onClick={handleLogout}
                    >
                        Logout
                    </Button>
                </Paper>
            </Box>
        </div>
    );
};

