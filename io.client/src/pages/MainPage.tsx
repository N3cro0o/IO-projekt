import { Link } from 'react-router-dom';

const MainPage = (props) => {
    const { logginToken } = props;

    return (
        <>
            <Link to="/loginPage">Login</Link>
            <br/>
            { logginToken }
        </>
    );
}

export default MainPage