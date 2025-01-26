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
    const [fieldToUpdate, setFieldToUpdate] = useState({
        login: '',
        email: '',
        name: '',
        surname: '',
    });
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const navigate = useNavigate();
    const userId = localStorage.getItem('userId');

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch(`https://localhost:7293/api/Account/showData/${userId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch user data');
                }

                const data = await response.json();
                setUserData(data);
                setFieldToUpdate({
                    login: '',
                    email: '',
                    name: '',
                    surname: '',
                });
            } catch (error) {
                setUpdateError('An error occurred while fetching user data.');
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [userId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFieldToUpdate({ ...fieldToUpdate, [name]: value });
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPasswordData({ ...passwordData, [name]: value });
    };

    const handleUpdate = async (fieldName: string) => {
        try {
            setUpdateError('');
            setUpdateSuccess('');
            const response = await fetch(`https://localhost:7293/api/Account/updateField/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    fieldName,
                    value: fieldToUpdate[fieldName],
                }),
            });

            if (!response.ok) {
                throw new Error(`Failed to update ${fieldName}`);
            }

            const updatedData = await response.json();
            setUserData(updatedData);
            setUpdateSuccess(`${fieldName} updated successfully!`);
            setFieldToUpdate({ ...fieldToUpdate, [fieldName]: '' });
        } catch (error) {
            setUpdateError(`An error occurred while updating ${fieldName}.`);
        }
    };

    const handlePasswordUpdate = async () => {
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setUpdateError('New password and confirmation do not match.');
            return;
        }

        try {
            setUpdateError('');
            setUpdateSuccess('');
            const response = await fetch(`https://localhost:7293/api/Account/changePassword/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    currentPassword: passwordData.currentPassword,
                    newPassword: passwordData.newPassword,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to update password');
            }

            setUpdateSuccess('Password updated successfully!');
            setPasswordData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: '',
            });
        } catch (error) {
            setUpdateError('An error occurred while updating the password.');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userId');
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

                    {userData && (
                        <>
                            {['login', 'email', 'name', 'surname'].map((field) => (
                                <Box key={field} sx={{ marginBottom: '20px' }}>
                                    <Typography variant="subtitle1" color="white">
                                        {field.charAt(0).toUpperCase() + field.slice(1)}:
                                    </Typography>
                                    <TextField
                                        value={userData[field]}
                                        InputProps={{ readOnly: true }}
                                        fullWidth
                                        sx={{
                                            marginBottom: '8px',
                                            '& .MuiInputBase-root': {
                                                backgroundColor: '#333',
                                                color: 'white',
                                            },
                                        }}
                                    />
                                    <TextField
                                        label={`Change ${field}`}
                                        name={field}
                                        value={fieldToUpdate[field]}
                                        onChange={handleChange}
                                        fullWidth
                                        sx={{
                                            '& .MuiInputLabel-root': { color: 'white' },
                                            '& .MuiInputBase-root': {
                                                backgroundColor: '#333',
                                                color: 'white',
                                            },
                                        }}
                                    />
                                    <Button
                                        variant="contained"
                                        sx={{ marginTop: '8px', backgroundColor: '#007bff', color: '#fff' }}
                                        onClick={() => handleUpdate(field)}
                                    >
                                        Update {field.charAt(0).toUpperCase() + field.slice(1)}
                                    </Button>
                                </Box>
                            ))}

                            <Box sx={{ marginBottom: '20px' }}>
                                <Typography variant="subtitle1" color="white">Change Password:</Typography>
                                <TextField
                                    label="Current Password"
                                    name="currentPassword"
                                    value={passwordData.currentPassword}
                                    onChange={handlePasswordChange}
                                    type="password"
                                    fullWidth
                                    sx={{
                                        marginBottom: '8px',
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
                                    value={passwordData.newPassword}
                                    onChange={handlePasswordChange}
                                    type="password"
                                    fullWidth
                                    sx={{
                                        marginBottom: '8px',
                                        '& .MuiInputLabel-root': { color: 'white' },
                                        '& .MuiInputBase-root': {
                                            backgroundColor: '#333',
                                            color: 'white',
                                        },
                                    }}
                                />
                                <TextField
                                    label="Confirm Password"
                                    name="confirmPassword"
                                    value={passwordData.confirmPassword}
                                    onChange={handlePasswordChange}
                                    type="password"
                                    fullWidth
                                    sx={{
                                        '& .MuiInputLabel-root': { color: 'white' },
                                        '& .MuiInputBase-root': {
                                            backgroundColor: '#333',
                                            color: 'white',
                                        },
                                    }}
                                />
                                <Button
                                    variant="contained"
                                    sx={{ marginTop: '8px', backgroundColor: '#007bff', color: '#fff' }}
                                    onClick={handlePasswordUpdate}
                                >
                                    Update Password
                                </Button>
                            </Box>
                        </>
                    )}

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
