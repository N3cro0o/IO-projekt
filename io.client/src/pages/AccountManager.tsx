import React, { useState, useEffect } from 'react';
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
import DeleteAccountModal from '../comps/ModalDeleteUser.tsx'
import { useNavigate } from 'react-router-dom';

export const UserProfilePage: React.FC = () => {
    const [userData, setUserData] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [updateError, setUpdateError] = useState<string>('');
    const [updateSuccess, setUpdateSuccess] = useState<string>('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);
    const [fieldToUpdate, setFieldToUpdate] = useState({
        login: '',
        email: '',
        name: '',
        surname: '',
        Password: '',
    });
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [activeSection, setActiveSection] = useState<string>('login'); // Active section state

    const userId = localStorage.getItem('userId');

    const navigate = useNavigate();
    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            navigate('/'); // Przekierowanie na stronê g³ówn¹
        }
    }, [navigate]);

    const fetchUserData = async () => {
        try {
            setLoading(true);
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
                Password: '',
            });
        } catch (error) {
            setUpdateError('An error occurred while fetching user data.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
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
                    Password: fieldToUpdate.Password
                }),
            });

            if (response.ok) {
                setUpdateSuccess(`${fieldName} updated successfully!`);
                setFieldToUpdate({ ...fieldToUpdate, [fieldName]: '' });
                await fetchUserData();
            }
            else {
                const errorData = await response.json();
                if (errorData.message) {
                    setUpdateError(errorData.message);
                }
                else {
                    setUpdateError(`An error occurred while updating ${fieldName}.`);
                    throw new Error(`Failed to update ${fieldName}`);
                }
            }
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
                    OldPassword: passwordData.currentPassword,
                    NewPassword: passwordData.newPassword,
                }),
            });

            if (response.ok) {
                setUpdateSuccess('Password updated successfully!');
                setPasswordData({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: '',
                });
                await fetchUserData();
            }
            else {
                const errorData = await response.json();
                if (errorData.message) {
                    setUpdateError(errorData.message);
                }
                else {
                    setUpdateError('An error occurred while updating the password.');
                    throw new Error(`Failed to update password`);
                }
            }
        } catch (error) {
            setUpdateError('An error occurred while updating the password.');
        }
    };

    const handleDeleteAccount = () => {
        setIsModalOpen(true);
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    const renderActiveSection = () => {
        if (activeSection === 'password') {
            return (
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
            );
        } else {
            return (
                <Box sx={{ marginBottom: '20px' }}>
                    <Typography variant="subtitle1" color="white">
                        {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}:
                    </Typography>
                    <TextField
                        value={userData[activeSection]}
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
                        label={`Change ${activeSection}`}
                        name={activeSection}
                        value={fieldToUpdate[activeSection]}
                        onChange={handleChange}
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
                        label="Password"
                        name="Password"
                        value={fieldToUpdate.Password}
                        onChange={handleChange}
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
                    <Button
                        variant="contained"
                        sx={{ marginTop: '8px', backgroundColor: '#007bff', color: '#fff' }}
                        onClick={() => handleUpdate(activeSection)}
                    >
                        Update {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}
                    </Button>
                </Box>
            );
        }
    };

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
                            {renderActiveSection()}
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                                {['login', 'email', 'name', 'surname', 'password'].map((section) => (
                                    <Button
                                        key={section}
                                        variant="outlined"
                                        sx={{
                                            color: '#fff',
                                            borderColor: '#007bff',
                                            '&:hover': { borderColor: '#0056b3' },
                                        }}
                                        onClick={() => setActiveSection(section)}
                                    >
                                        {section.charAt(0).toUpperCase() + section.slice(1)}
                                    </Button>
                                ))}
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
                        onClick={handleDeleteAccount}

                    >
                        Delete Account
                    </Button>
                </Paper>
            </Box>
            <DeleteAccountModal open={isModalOpen} onClose={handleCloseModal} />
        </div>

    );
};
