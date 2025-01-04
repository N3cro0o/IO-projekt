import { Link, useNavigate } from 'react-router-dom';
import { ButtonAppBar } from '../comps/AppBar.tsx';
import { useState } from 'react';
import '../App.css';
import Button from '@mui/material/Button';

export const Login = () => {
    const [formData, setFormData] = useState({
        login: '',
        password: '',
    });

    const [loginError, setLoginError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const navigate = useNavigate(); // hook do nawigacji w React Router v6

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value }); // Aktualizacja formData na podstawie nazwy pola
    };

    const checkLogin = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault(); // Zapobiega przeładowaniu strony

        setLoginError('');
        setPasswordError('');

        if (!formData.login || !formData.password) {
            if (!formData.login) setLoginError('Wprowadź nazwę użytkownika');
            if (!formData.password) setPasswordError('Wprowadź hasło');
            return;
        }

        try {
            const response = await fetch('https://localhost:7293/api/Login/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    Login: formData.login,
                    Password: formData.password,
                }),
            });

            if (response.ok) {
                const json_data = await response.json();
                localStorage.setItem('authToken', json_data.Token);
                navigate('/UserPanel');
            } else {
                setLoginError('Niepoprawne dane logowania');
            }
        } catch (error) {
            setLoginError('Wystąpił błąd podczas logowania');
        }
    };

    return (
        <div>
            <div id="mainContainer">
                <ButtonAppBar />
                <div id="loginContainer">
                    <form onSubmit={checkLogin}>
                        <label>
                            <p>Username</p>
                            <input
                                type="text"
                                name="login"
                                value={formData.login}
                                onChange={handleChange}
                            />
                        </label>
                        {loginError && <p className="error">{loginError}</p>}
                        <br />
                        <label>
                            <p>Password</p>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </label>
                        {passwordError && <p className="error">{passwordError}</p>}
                        <br />
                        <Button
                            type="submit"
                            sx={{
                                color: '#ffffff',
                                backgroundColor: '#007bff',
                                '&:hover': { backgroundColor: '#0056b3' },
                            }}
                        >
                            Login
                        </Button>
                    </form>
                    <br />
                    <Link to="/">Go back</Link>
                </div>
            </div>
        </div>
    );
};
