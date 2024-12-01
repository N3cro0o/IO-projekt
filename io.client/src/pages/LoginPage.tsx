import { Link } from 'react-router-dom';

export const Login = (params) => {
    const { token, setToken } = params;
    return (
        <div className = "mainContainer">
            <Link to="/">Go back</Link>
            <div className="loginContainer">
                <form>
                    <label>
                        <p>Username</p>
                        <input type="text"/>
                    </label>
                    <label>
                        <p>Password</p>
                        <input type="password" />
                    </label>

                </form>
            </div>
        </div>
    )
}
