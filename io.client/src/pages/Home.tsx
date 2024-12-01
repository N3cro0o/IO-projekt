import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

interface UserInterface {
    login: string;
    password: string;
    lastName: string;
    firstName: string;
    email: string;
    id: number;
    userType: number;
    courses: Array<number>;
}

function Home() {
    const [users, setUsers] = useState<UserInterface[]>();

    useEffect(() => {
        populateUserData();
    }, []);

    const contents_user = users === undefined
        ? <p><em>Loading... Please refresh once the ASP.NET backend has started. See <a href="https://aka.ms/jspsintegrationreact">https://aka.ms/jspsintegrationreact</a> for more details.</em></p>
        : <table className="table table-striped" aria-labelledby="tableLabel">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Login</th>
                    <th>First name</th>
                    <th>Last name</th>
                    <th>Email</th>
                    <th>Type</th>
                    <th>Course IDs</th>
                </tr>
            </thead>
            <tbody>
                {users.map(users =>
                    <tr key={users.id}>
                        <td>{users.id}</td>
                        <td>{users.login}</td>
                        <td>{users.firstName}</td>
                        <td>{users.lastName}</td>
                        <td>{users.email}</td>
                        <td>{users.userType}</td>
                        <td>{users.courses[0]}, {users.courses[1]}, {users.courses[2]}, {users.courses[3]}, </td>
                    </tr>
                )}
            </tbody>
        </table>;

    return (
        <div>
            <Link to="/loginPage">Losowi uzytkownicy</Link>
            <h1 id="tableLabel">Random users</h1>
            <p>This component demonstrates fetching data from the server.</p>
            {contents_user}
            <br />
        </div>
    );

    async function populateUserData() {//main/GetRandUsers
        const response = await fetch('/api/main', {
            headers: {
                'Accept': 'application/json'
            }
        });
        if (response.ok) {
            const data = await response.json();
            setUsers(data);
        }
    }
}

export default Home;