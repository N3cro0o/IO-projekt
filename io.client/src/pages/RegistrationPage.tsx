import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { Alert } from '@mui/material';
import { ButtonAppBar } from '../comps/AppBar.tsx';
import { Link} from 'react-router-dom';

export const Registration = () => {
    const [formData, setFormData] = useState({
        login: '',
        firstName: '',
        lastName: '',
        email: '',
        password: '',
    });

    const [error, setError] = useState('');
    const [errorFields, setErrorFields] = useState({
        login: '',
        firstName: '',
        lastName: '',
        email: '',
        password: '',
    });
    const navigate = useNavigate();

    // Sprawdzenie, czy u¿ytkownik jest ju¿ zalogowany
    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (token) {
            navigate('/'); // Przekierowanie na stronê g³ówn¹
        }
    }, [navigate]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        // Reset the error for the specific field when the user starts typing
        setErrorFields({ ...errorFields, [name]: '' });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        let hasError = false;

        // Validate form
        const newErrorFields = { ...errorFields };

        if (!formData.login) {
            newErrorFields.login = 'Login is required';
            hasError = true;
        }
        if (!formData.firstName) {
            newErrorFields.firstName = 'First name is required';
            hasError = true;
        }
        if (!formData.lastName) {
            newErrorFields.lastName = 'Last name is required';
            hasError = true;
        }
        if (!formData.email) {
            newErrorFields.email = 'Email is required';
            hasError = true;
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrorFields.email = 'Please enter a valid email (e.g. something@domain.com)';
            hasError = true;
        }
        if (!formData.password) {
            newErrorFields.password = 'Password is required';
            hasError = true;
        }

        setErrorFields(newErrorFields);

        if (hasError) return; // If there are errors, stop the submission

        try {
            const response = await fetch('https://localhost:7293/api/Registration/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    Login: formData.login,
                    FirstName: formData.firstName,
                    LastName: formData.lastName,
                    Email: formData.email,
                    PasswordHash: formData.password,
                }),
            });

            if (response.ok) {
                navigate('/loginPage');
            } else {
                const errorData = await response.json();
                if (errorData.errors.login) {
                    setErrorFields(prev => ({ ...prev, login: errorData.errors.login }));
                }
                if (errorData.errors.email) {
                    setErrorFields(prev => ({ ...prev, email: errorData.errors.email }));
                }
                if (errorData.errors.password) {
                    setErrorFields(prev => ({ ...prev, password: errorData.errors.password }));
                }
                console.log(errorData.errors.password);
                setError('Error during registration');
            }
        } catch (error) {
            console.log(error);
            setError('Error during registration');
        }
    };

    return (
        <div>
            <ButtonAppBar />
            <Box
                sx={{
                    maxWidth: '400px',
                    margin: '0 auto',
                    padding: '20px',
                    backgroundColor: '#444',
                    borderRadius: '8px',
                    boxShadow: 2,
                    marginTop: '80px', // Dodajemy margin-top, aby formularz znajdowa³ siê poni¿ej AppBar
                }}
            >

                <Typography variant="h6" color="white" sx={{ marginBottom: '20px' }}>
                    Register an account
                </Typography>

                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Login"
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
                    {errorFields.login && (
                        <Alert severity="error" sx={{ marginBottom: '16px' }}>
                            {errorFields.login}
                        </Alert>
                    )}

                    <TextField
                        label="First Name"
                        name="firstName"
                        type="text"
                        value={formData.firstName}
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
                    {errorFields.firstName && (
                        <Alert severity="error" sx={{ marginBottom: '16px' }}>
                            {errorFields.firstName}
                        </Alert>
                    )}

                    <TextField
                        label="Last Name"
                        name="lastName"
                        type="text"
                        value={formData.lastName}
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
                    {errorFields.lastName && (
                        <Alert severity="error" sx={{ marginBottom: '16px' }}>
                            {errorFields.lastName}
                        </Alert>
                    )}

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
                    {errorFields.email && (
                        <Alert severity="error" sx={{ marginBottom: '16px' }}>
                            {errorFields.email}
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
                    {errorFields.password && (
                        <Alert severity="error" sx={{ marginBottom: '16px' }}>
                            {errorFields.password}
                        </Alert>
                    )}

                    {error && <Alert severity="error" sx={{ marginBottom: '16px' }}>{error}</Alert>}

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
                        Register
                    </Button>
                </form>
                <Box sx={{ marginTop: '16px', textAlign: 'center' }}>
                    <Link to="/LoginPage" style={{ color: '#fff', textDecoration: 'none' }}>
                        Have an account? Login
                    </Link>
                </Box>
            </Box>
        </div>
    );
};
