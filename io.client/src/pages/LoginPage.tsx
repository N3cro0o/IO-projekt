import { Link } from 'react-router-dom';
import { ButtonAppBar } from '../comps/AppBar.tsx';
import { useEffect } from 'react';
import '../App.css';
import Button from '@mui/material/Button';

export const Login = (params) => {
    const { token, setToken } = params;

    useEffect(() => {
        testLogin();
    }, []);

    return (
        <div>
        <div id="mainContainer">
            <ButtonAppBar />

            <div id="loginContainer">
                <form>
                    <label>
                        <p>Username</p>
                        <input type="text" />
                    </label>
                    <br></br><br></br>
                    <label>
                        <p>Password</p>
                        <input type="password" />
                    </label>
                </form>

                <br></br>

                <Button
                    component={Link}
                    to="/UserPanel"
                    sx={{
                        color: '#ffffff',
                        backgroundColor: '#007bff',
                        '&:hover': {
                        backgroundColor: '#0056b3',
                        },
                    }}
                >
                    Login
                </Button>

                <br></br>
                <br></br>
                <Link to="/">Go back</Link>
            </div>
        </div>
        </div>
    );

    async function testLogin() {
        const data_to_send = {
            username: 'testLogin',
            password: '1234'
        };
        const data = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data_to_send)
        };
        const resp = await fetch('/api/login/loginRequest', data);
        if (resp.ok) {
            console.log("Test logowanie dziala");
            const json_data = resp.json();
            console.log(json_data);
        }
    }
}
