import React, { useEffect, useState } from 'react';
import { Button, Checkbox, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

interface User {
    id: number;
    login: string;
    email: string;
}

interface UserListProps {
    courseId: number;
}

const ChangeUserList: React.FC<UserListProps & { onUsersRemoved: () => void }> = ({ courseId, onUsersRemoved }) => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedUserIds, setSelectedUserIds] = useState<Set<number>>(new Set());

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch('https://localhost:7293/api/CoursesManager/KickUsersList/' + courseId);
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

    const handleKickUsers = async () => {
        try {
            const payload = {
                courseId,
                userIds: Array.from(selectedUserIds),
            };

            const response = await fetch('https://localhost:7293/api/CoursesManager/KickUsers', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            alert('Users successfully kicked from the course!');
            onUsersRemoved(); // Close the modal
        } catch (error) {
            console.error('Error kicking users from the course:', error);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div style={{ backgroundColor: '#333', padding: '20px', borderRadius: '8px', color: '#fff' }}>
            <h2>Kick Users from Course</h2>
            <TableContainer component={Paper} sx={{ backgroundColor: '#444', borderRadius: '8px' }}>
                <Table sx={{ minWidth: 650 }} aria-label="user table">
                    <TableHead>
                        <TableRow>
                            <TableCell style={{ color: '#fff' }}>Select</TableCell>
                            <TableCell style={{ color: '#fff' }}>Login</TableCell>
                            <TableCell style={{ color: '#fff' }}>Email</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                <TableCell component="th" scope="row">
                                    <Checkbox
                                        checked={selectedUserIds.has(user.id)}
                                        onChange={() => handleCheckboxChange(user.id)}
                                        sx={{ color: '#fff' }}
                                    />
                                </TableCell>
                                <TableCell style={{ color: '#fff' }}>{user.login}</TableCell>
                                <TableCell style={{ color: '#fff' }}>{user.email}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <div style={{ marginTop: '20px' }}>
                <Button variant="contained" color="warning" onClick={handleKickUsers}>
                    Kick Users
                </Button>
            </div>
        </div>
    );
};

export default ChangeUserList;
