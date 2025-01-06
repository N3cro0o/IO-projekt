import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import nawigacji
import './UserPanel.css'; // Plik styl�w CSS
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
        fetch('https://localhost:59127/api/course/list')
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
                <p>�adowanie kurs�w...</p>
            </div>
        );
    }

    return (
        <div className="user-panel">
            <ButtonAppBar />
            <div className="content-container">
                <Typography color="white" variant="h4" gutterBottom>
                    Twoje kursy:
                </Typography>
                {courses.length === 0 ? (
                    <Typography variant="h6">Brak kurs�w do wy�wietlenia.</Typography>
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
                                            Kategoria: {course.category}
                                        </Typography>
                                    </CardContent>
                                    <Button
                                        onClick={() => navigate(`/course/${course.id}/tests`)}
                                        variant="contained"
                                        sx={{ margin: '1rem', backgroundColor: '#007bff', '&:hover': { backgroundColor: '#0056b3' } }}
                                    >
                                        Zobacz testy
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
