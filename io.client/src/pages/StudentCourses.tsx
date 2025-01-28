import Button from '@mui/material/Button';
import { useEffect, useState } from 'react';
import BasicModal from '../comps/ModalAddUsersToCourse.tsx';
import ModalChangeUsers from '../comps/ModalKickUsersFromCourse.tsx';
import ModalAddCourse from '../comps/ModalAddCourse.tsx';
import { ButtonAppBar } from '../comps/AppBar.tsx';
import { jwtDecode } from "jwt-decode";

export const CourseUser = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const [courses, setCourses] = useState<Course[]>([]);
    const [deletedCourse, setDeletedCourse] = useState<string | null>(null);
    const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
    const [selectedCourseName, setSelectedCourseName] = useState<string | null>(null);
    const [selectedCourseName2, setSelectedCourseName2] = useState<string | null>(null)
    const [selectedCourseId2, setSelectedCourseId2] = useState<number | null>(null);
    const [openModalAddCourse, setOpenModalAddCourse] = useState<boolean>(false); // Stan otwarcia modala

    interface Course {
        id: number;
        name: string;
        owner: string;
        car: string;
    }

    const transformCourseData = (apiData: any[]): Course[] => {
        return apiData.map((course) => ({
            id: course.id,
            name: course.name,
            owner: course.headTeacherName,
            cat: course.category
        }));
    };

    useEffect(() => {

        const fetchCourses = async () => {
            try {
                const token = localStorage.getItem('authToken');
                const decoded = jwtDecode(token);
                const userID = decoded.certserialnumber;
                console.log('User ID from localStorage:', userID);
                
                const response = await fetch('https://localhost:7293/api/CoursesManager/Student/' + userID + '/courses');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const apiData = await response.json();
                console.log(apiData);
                const transformedData = transformCourseData(apiData);
                console.log(transformedData)
                setCourses(transformedData);
            } catch (error) {
                console.error('Error fetching courses:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchCourses();
    }, []);

    // Funkcja odœwie¿ania kursów
    const refreshCourses = async () => {
        const token = localStorage.getItem('authToken');
        const decoded = jwtDecode(token);
        const userID = decoded.certserialnumber;
        console.log('User ID from localStorage1:', userID);

        try {
            const response = await fetch('https://localhost:7293/api/CoursesManager/Student/' + userID + '/courses');
            const apiData = await response.json();
            const transformedData = transformCourseData(apiData);
            setCourses(transformedData);
        } catch (error) {
            console.error('Error fetching courses:', error);
        }
    };

    useEffect(() => {
        refreshCourses(); // Za³aduj kursy na pocz¹tku
    }, []);
    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <ButtonAppBar />
            <div style={{ display: 'flex', justifyContent: 'center', padding: '50px' }}>
                <div style={{ width: '100%', maxWidth: '1200px' }}>
                    <h1 style={{ color: 'white', textAlign: 'center' }}>Available Courses Panel</h1>
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
                                    <td style={{ padding: '10px' }}>{course.cat}</td>
                                    <td style={{ padding: '10px', display: 'flex', gap: '8px' }}>
                                        
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    

                    {/* Modal bêdzie siê otwiera³, gdy selectedCourseId nie bêdzie null */}
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

                    
                </div>
            </div>
        </div>
    );
};

export default CourseUser;
