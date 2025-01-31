import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import nawigacji
import './TestManager.css'; // Plik stylów CSS
import { ButtonAppBar } from '../comps/AppBar.tsx';
import { Card, CardContent, Typography, Button, Grid, CircularProgress } from '@mui/material';

interface Course {
    id: number;
    name: string;
    category: string;
}

const UserPanel: React.FC = () => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate(); // Hook do nawigacji

    useEffect(() => {
        window.scrollTo(0, 0);
        const token = localStorage.getItem('authToken');
        if (!token) {
            navigate('/'); // Przekierowanie na stronê g³ówn¹
        }
        const userId = localStorage.getItem('userId');
        console.log('User ID from localStorage:', userId);

        fetch('https://localhost:59127/api/CoursesManager/ListCourse/' + userId)
            .then((response) => response.json())
            .then((data: Course[]) => {
                setCourses(data);
                setLoading(false);
            })
            .catch(() => {
                setCourses([]);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <div className="loading-container">
                <CircularProgress />
                <p>Loading courses...</p>
            </div>
        );
    }

    return (
        <div className="user-panel">
            <ButtonAppBar />
            <div className="content-container">
                <Typography color="white" variant="h4" gutterBottom>
                    Select course to manage tests:
                </Typography>
                {courses.length === 0 ? (
                    <Typography variant="h6" color="red">Lack of courses added</Typography>
                ) : (
                    <Grid container spacing={3}>
                        {courses.map((course) => (
                            <Grid item xs={12} sm={6} md={4} key={course.id}>
                                <Card sx={{ display: 'flex', flexDirection: 'column' }}>
                                    <CardContent>
                                        <Typography variant="h6" component="div">
                                            {course.name}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Category: {course.category}
                                        </Typography>
                                    </CardContent>
                                    <Button
                                        onClick={() => navigate(`/course/${course.id}/tests`)}
                                        variant="contained"
                                        sx={{ margin: '1rem', backgroundColor: '#007bff', '&:hover': { backgroundColor: '#0056b3' } }}
                                    >

                                        View tests
                                    </Button>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                )}
            </div>
        </div>
    );
};

export default UserPanel;
