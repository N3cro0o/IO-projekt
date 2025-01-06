import Button from '@mui/material/Button';
import React, { useEffect, useState } from 'react';
import BasicModal from '../comps/modal.tsx';
import { ButtonAppBar } from '../comps/AppBar.tsx';
import UserList from '../pages/UserList';

export const Course = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const [courses, setCourses] = useState<Course[]>([]);
    const [deletedCourse, setDeletedCourse] = useState<string | null>(null);
    const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);  // Przechowuj tylko ID kursu

    const [formData, setFormData] = useState({
        courseid: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    interface Course {
        id: number;
        name: string;
        owner: number;
    }

    const transformCourseData = (apiData: any[]): Course[] => {
        return apiData.map((course) => ({
            id: course.courseid,
            name: course.courseName,
            owner: course.ownerid,
        }));
    };

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await fetch('https://localhost:7293/api/CoursesManager/listCourses');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const apiData = await response.json();
                const transformedData = transformCourseData(apiData);
                setCourses(transformedData);
            } catch (error) {
                console.error('Error fetching courses:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchCourses();
    }, []);

    const handleDeleteCourse = async (courseid: number, name: string) => {
        const confirmDelete = window.confirm(`Czy na pewno chcesz usun¹æ kurs "${name}"?`);
        if (!confirmDelete) return;

        try {
            const response = await fetch('https://localhost:7293/api/DeleteCourse/deleteCourse', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ courseid: courseid }),
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            setCourses((prevCourses) => prevCourses.filter((course) => course.id !== courseid));
            setDeletedCourse(name);
            setTimeout(() => setDeletedCourse(null), 5000);
        } catch (error) {
            console.error('Error deleting course:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddUsers = (courseId: number) => {
        setSelectedCourseId(courseId);  // Ustawiamy tylko raz, nie bêdziemy zmieniaæ wielokrotnie
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <ButtonAppBar />
            <div style={{ display: 'flex', justifyContent: 'center', padding: '50px' }}>
                <div style={{ width: '100%', maxWidth: '1200px' }}>
                    <h1 style={{ color: 'white', textAlign: 'center' }}>Course List</h1>
                    {deletedCourse && <div style={{ color: 'red' }}>Deleted course: {deletedCourse}</div>}
                    <table
                        style={{
                            borderCollapse: 'collapse',
                            width: '100%',
                            backgroundColor: '#333',
                            color: '#fff',
                            borderRadius: '8px',
                            overflow: 'hidden',
                            tableLayout: 'fixed',
                        }}
                    >
                        <thead>
                            <tr style={{ borderBottom: '2px solid #555' }}>
                                <th style={{ padding: '10px' }}>Course Name</th>
                                <th style={{ padding: '10px' }}>Owner</th>
                                <th style={{ padding: '10px' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {courses.map((course) => (
                                <tr key={course.id} style={{ borderBottom: '1px solid #555' }}>
                                    <td style={{ padding: '10px' }}>{course.name}</td>
                                    <td style={{ padding: '10px' }}>{course.owner}</td>
                                    <td style={{ padding: '10px', display: 'flex', gap: '8px' }}>
                                        <Button onClick={() => handleAddUsers(course.id)} variant="contained">
                                            Add Users
                                        </Button>
                                        <Button variant="contained" color="warning">
                                            Change Users
                                        </Button>
                                        <Button
                                            onClick={() => handleDeleteCourse(course.id, course.name)}
                                            variant="contained"
                                            color="error"
                                        >
                                            Delete
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div style={{ textAlign: 'left', marginTop: '20px' }}>
                        <Button variant="contained" color="success">
                            Add Course
                        </Button>
                    </div>

                    {/* Modal bêdzie siê otwiera³, gdy selectedCourseId nie bêdzie null */}
                    {selectedCourseId !== null && (
                        <BasicModal courseId={selectedCourseId} handleClose={() => setSelectedCourseId(null)} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default Course;
