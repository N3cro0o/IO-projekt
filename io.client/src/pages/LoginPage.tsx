import { Link, useNavigate } from 'react-router-dom';
import { ButtonAppBar } from '../comps/AppBar.tsx';
import { useState } from 'react';
import '../App.css';
import Button from '@mui/material/Button';

export const Login = () => {
    const [login, setLogin] = useState('');
    const [pass, setPass] = useState('');
    const [loginError, setLoginError] = useState('');
    const [passError, setPassError] = useState('');
    const navigate = useNavigate(); // hook do nawigacji w React Router v6

    // Zmienne do zarz¹dzania stanem
    const handleLogin = (event: React.ChangeEvent<HTMLInputElement>) => {
        setLogin(event.target.value);
    };

    const handlePass = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPass(event.target.value);
    };

    // Funkcja do wysy³ania danych logowania na backend
    const checkLogin = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault(); // Zapobiega prze³adowaniu strony

        // Resetowanie b³êdów
        setLoginError('');
        setPassError('');

        // Walidacja
        if (!login || !pass) {
            if (!login) setLoginError('WprowadŸ nazwê u¿ytkownika');
            if (!pass) setPassError('WprowadŸ has³o');
            return;
        }

        const data_to_send = {
            username: login,
            password: pass,
        };

        const data = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data_to_send),
        };

        try {
            const resp = await fetch('/api/login/loginRequest', data);
            if (resp.ok) {
                const json_data = await resp.json();
                console.log('Token:', json_data.Token);

                // Zapisujemy token w localStorage
                localStorage.setItem('authToken', json_data.Token);

                // Przekierowanie na stronê po zalogowaniu za pomoc¹ React Router
                navigate('/UserPanel'); // U¿ycie hooka navigate do przekierowania
            } else {
                console.error('B³¹d logowania');
                setLoginError('Niepoprawne dane logowania'); // Wyœwietlenie b³êdu
            }
        } catch (error) {
            console.error('B³¹d podczas logowania:', error);
            setLoginError('Wyst¹pi³ b³¹d podczas logowania'); // Komunikat o b³êdzie w przypadku problemu z serwerem
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
                            <input type="text" value={login} onChange={handleLogin} />
                        </label>
                        {loginError && <p className="error">{loginError}</p>} {/* Wyœwietlenie b³êdu dla loginu */}

                        <br />
                        <br />
                        <label>
                            <p>Password</p>
                            <input type="password" value={pass} onChange={handlePass} />
                        </label>
                        {passError && <p className="error">{passError}</p>} {/* Wyœwietlenie b³êdu dla has³a */}
                        <br />
                        <br />
                        <Button
                            type="submit"
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
                    </form>
                    <br />
                    <br />
                    <Link to="/">Go back</Link> {/* Link do powrotu na stronê g³ówn¹ */}
                </div>
            </div>
        </div>
    );
};
