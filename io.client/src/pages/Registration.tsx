import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const Registration = () => {
    const [formData, setFormData] = useState({
        login: '',
        firstName: '',
        lastName: '',
        email: '',
        password: '',
    });

    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        console.log(formData); // Sprawdzenie danych przed wys³aniem

        try {
            const response = await fetch('https://localhost:7293/api/Registration/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    Login: formData.login,
                    FirstName: formData.firstName,
                    LastName: formData.lastName,
                    Email: formData.email,
                    PasswordHash: formData.password,
                }),
            });

            if (response.ok) {
                navigate('/loginPage');
            } else {
                const errorData = await response.json();
                setError(errorData.Message || 'B³¹d podczas rejestracji');
            }
        } catch (error) {
            setError('Wyst¹pi³ b³¹d podczas rejestracji');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                name="login"
                placeholder="Login"
                value={formData.login}
                onChange={handleChange}
                required
            />
            <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
                required
            />
            <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleChange}
                required
            />
            <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
            />
            <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
            />
            <button type="submit">Register</button>
            {error && <p>{error}</p>}
        </form>
    );
};
