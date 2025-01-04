import React, { useEffect, useState } from 'react';

import { User } from '../User';

const UserList: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedUserIds, setSelectedUserIds] = useState<Set<number>>(new Set());

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch('https://localhost:7293/api/User/list');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data: User[] = await response.json();
                setUsers(data);
            } catch (error) {
                console.error('Error fetching users:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const handleCheckboxChange = (id: number) => {
        setSelectedUserIds((prev) => {
            const updatedSet = new Set(prev);
            if (updatedSet.has(id)) {
                updatedSet.delete(id);
            } else {
                updatedSet.add(id);
            }
            return updatedSet;
        });
    };

    const handleAddToCourse = async () => {
        try {
            const response = await fetch('https://localhost:7293/api/CourseUsers/addUsers', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(Array.from(selectedUserIds)),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            alert('Users successfully added to the course!');
        } catch (error) {
            console.error('Error adding users to the course:', error);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <h1>User List</h1>
            <table border="1" style={{ borderCollapse: 'collapse', width: '100%' }}>
                <thead>
                    <tr>
                        <th>Select</th>
                        <th>Login</th>
                        <th>Email</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.id}>
                            <td>
                                <input
                                    type="checkbox"
                                    checked={selectedUserIds.has(user.id)}
                                    onChange={() => handleCheckboxChange(user.id)}
                                />
                            </td>
                            <td>{user.login}</td>
                            <td>{user.email}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button onClick={handleAddToCourse}>Add to Course</button>
        </div>
    );
};

export default UserList;
