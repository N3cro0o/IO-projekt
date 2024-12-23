import React, { useEffect, useState } from 'react';

import { User } from '../User';

const UserList: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                //adres moze sie zmieniac przesc na port 7000
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

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <h1>User List</h1>
            <ul>
                {users.map((user) => (
                    <li key={user.id}>
                        <h3>{user.firstName} {user.lastName}</h3>
                        <p>Email: {user.email}</p>
                        <p>Login: {user.login}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default UserList;
