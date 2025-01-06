import Button from '@mui/material/Button';
import { useEffect, useState } from 'react';
import BasicModal from '../comps/modal.tsx';
import ModalChangeUsers from '../comps/modalChangeUsers.tsx';
import ModalAddCourse from '../comps/modalAddCourse.tsx';
import { ButtonAppBar } from '../comps/AppBar.tsx';

export const Course = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const [courses, setCourses] = useState<Course[]>([]);
    const [deletedCourse, setDeletedCourse] = useState<string | null>(null);
    const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
    const [selectedCourseName, setSelectedCourseName] = useState<string | null>(null);
    const [selectedCourseName2, setSelectedCourseName2] = useState<string | null>(null)
    const [selectedCourseId2, setSelectedCourseId2] = useState<number | null>(null);
    const [selectedOwnerId, setSelectedOwnerId] = useState<number | null>(null);
    const [openModalAddCourse, setOpenModalAddCourse] = useState<boolean>(false); // Stan otwarcia modala

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

    // Funkcja od�wie�ania kurs�w
    const refreshCourses = async () => {
        try {
            const response = await fetch('https://localhost:7293/api/CoursesManager/listCourses');
            const apiData = await response.json();
            const transformedData = transformCourseData(apiData);
            setCourses(transformedData);
        } catch (error) {
            console.error('Error fetching courses:', error);
        }
    };

    useEffect(() => {
        refreshCourses(); // Za�aduj kursy na pocz�tku
    }, []);

    const handleDeleteCourse = async (courseid: number, name: string) => {
        const confirmDelete = window.confirm(`Czy na pewno chcesz usun�� kurs "${name}"?`);
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

    const handleAddUsers = (courseId: number, coursename: string) => {
        setSelectedCourseId(courseId);
        setSelectedCourseName(coursename);
    };

    const handleChangeUsers = (courseId: number, coursename: string) => {
        setSelectedCourseId2(courseId);
        setSelectedCourseName2(coursename);
    };

    const handleAddCourse = () => {
        setOpenModalAddCourse(true); // Otw�rz modal
    };

    const handleCloseAddCourseModal = () => {
        setOpenModalAddCourse(false); // Zamknij modal
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <ButtonAppBar />
            <div style={{ display: 'flex', justifyContent: 'center', padding: '50px' }}>
                <div style={{ width: '100%', maxWidth: '1200px' }}>
                    <h1 style={{ color: 'white', textAlign: 'center' }}>Course Panel</h1>
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
                                        <Button onClick={() => handleAddUsers(course.id, course.name)} variant="contained">
                                            Add Users
                                        </Button>
                                        <Button onClick={() => handleChangeUsers(course.id, course.name)} variant="contained" color="warning">
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
                        <Button onClick={handleAddCourse} variant="contained" color="success">
                            Add Course
                        </Button>
                    </div>

                    {/* Modal b�dzie si� otwiera�, gdy selectedCourseId nie b�dzie null */}
                    {selectedCourseId !== null && selectedCourseName !== null && (
                        <BasicModal courseId={selectedCourseId} coursename={selectedCourseName} handleClose={() => {
                            setSelectedCourseId(null);
                            setSelectedCourseName(null);
                        }} />
                    )}

                    {selectedCourseId2 !== null && selectedCourseName2 !== null && (
                        <ModalChangeUsers courseId={selectedCourseId2} coursename={selectedCourseName2} handleClose={() => {
                            setSelectedCourseId2(null);
                            setSelectedCourseName2(null);
                        }} />
                    )}

                    {/* Modal dla dodawania kursu */}
                    {openModalAddCourse && (
                        <ModalAddCourse
                            ownerId={1}  // Mo�esz tu doda� dynamiczne `ownerId` z tokenu
                            open={openModalAddCourse}
                            handleClose={handleCloseAddCourseModal}
                            refreshCourses={refreshCourses} // Przekazujemy refreshCourses
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default Course;
