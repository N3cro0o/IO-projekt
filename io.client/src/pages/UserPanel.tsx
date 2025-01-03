import React, { useEffect, useState } from 'react';
import './UserPanel.css'; // Plik styl�w CSS

interface Course {
    id: number;
    name: string;
    category: string;
}

const UserPanel: React.FC = () => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);

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
        return <p>�adowanie kurs�w...</p>;
    }

    return (
        <div className="user-panel">
            <h1>Twoje kursy:</h1>
            {courses.length === 0 ? (
                <p>Brak kurs�w do wy�wietlenia.</p>
            ) : (
                <div className="courses-container">
                    {courses.map((course) => (
                        <div key={course.id} className="course-card">
                            <h3>{course.name}</h3>
                            <p>Kategoria: {course.category}</p>
                            <button
                                onClick={() => (window.location.href = `/course/${course.id}`)}
                                className="details-button"
                            >
                                Zobacz szczegoly
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default UserPanel;
