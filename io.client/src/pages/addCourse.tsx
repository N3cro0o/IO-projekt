import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { Alert } from '@mui/material';

interface AddCourseProps {
    ownerId: number;
    handleClose: () => void;
    refreshCourses: () => void;
}

export const AddCourse: React.FC<AddCourseProps> = ({ ownerId, handleClose, refreshCourses }) => {
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        description: '',
        ownerid: ownerId,
    });

    const [error, setError] = useState('');
    const [errorFields, setErrorFields] = useState({
        name: '',
        category: '',
        description: '',
        ownerid: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        setErrorFields({ ...errorFields, [name]: '' });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        let hasError = false;

        const newErrorFields = { ...errorFields };

        if (!formData.name) {
            newErrorFields.name = 'Name is required';
            hasError = true;
        }
        if (!formData.category) {
            newErrorFields.category = 'Category is required';
            hasError = true;
        }
        if (!formData.description) {
            newErrorFields.description = 'Description is required';
            hasError = true;
        }

        setErrorFields(newErrorFields);



        if (hasError) return;

        try {
            const userId = localStorage.getItem('userId');
            console.log('User ID from localStorage:', userId);

            const response = await fetch('https://localhost:7293/api/AddCourse/addCourse', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    Name: formData.name,
                    Category: formData.category,
                    Description: formData.description,
                    OwnerId: userId,
                }),
            });

            if (response.ok) {
                console.log('Course added successfully');
                refreshCourses(); // Odœwie¿enie listy kursów
                handleClose(); // Zamykanie modala po pomyœlnym dodaniu kursu
            } else {
                setError('Failed to create the course');
            }
        } catch (error) {
            setError('Error while creating the course');
        }
    };

    return (
        <div>
            <Box
                sx={{
                    maxWidth: '400px',
                    margin: '0 auto',
                    padding: '60px',
                    backgroundColor: '#444',
                    borderRadius: '8px',
                    boxShadow: 2,
                    marginTop: '20px',
                }}
            >
                <Typography variant="h6" color="white" sx={{ marginBottom: '20px' }}>
                    Create a Course
                </Typography>

                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Name"
                        name="name"
                        type="text"
                        value={formData.name}
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
                    {errorFields.name && <Alert severity="error">{errorFields.name}</Alert>}

                    <TextField
                        label="Category"
                        name="category"
                        type="text"
                        value={formData.category}
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
                    {errorFields.category && <Alert severity="error">{errorFields.category}</Alert>}

                    <TextField
                        label="Description"
                        name="description"
                        type="text"
                        value={formData.description}
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
                    {errorFields.description && <Alert severity="error">{errorFields.description}</Alert>}

                    {error && <Alert severity="error">{error}</Alert>}

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
                        Create Course
                    </Button>
                </form>
            </Box>
        </div>
    );
};

export default AddCourse;