import { useState } from 'react';
import { HashRouter as HRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import RandomUsers from './pages/RandUsers';
import MainPage from './pages/MainPage';
import {Login} from './pages/LoginPage';

function App() {
    const [token, setToken] = useState(-1);

    return (
        <div>
            Mamy tutaj fajen stronke, polecam z rodzinka
            <br />
            <HRouter>
                <Routes>
                    <Route path="/" element={<MainPage logginToken = { token } />}/>
                    <Route path="/randTest" element={<RandomUsers />}/>
                    <Route path="/loginPage" element={<Login token={token} setToken={ setToken } />} />
                </Routes>
            </HRouter>
        </div>
    );
}

export default App;