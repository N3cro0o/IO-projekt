import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import nawigacji
import './UserPanel.css'; // Plik stylów CSS

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
        return <p>£adowanie kursów...</p>;
    }

    return (
        <div className="user-panel">
            <h1>Twoje kursy:</h1>
            {courses.length === 0 ? (
                <p>Brak kursów do wyœwietlenia.</p>
            ) : (
                <div className="courses-container">
                    {courses.map((course) => (
                        <div key={course.id} className="course-card">
                            <h3>{course.name}</h3>
                            <p>Kategoria: {course.category}</p>
                            <button
                                onClick={() => navigate(`/course/${course.id}/tests`)}
                                className="details-button"
                            >
                                Zobacz testy
                            </button>

                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default UserPanel;
