import { useState } from 'react';
import './App.css';
import RandomUsers from './pages/RandUsers';
import MainPage from './pages/MainPage';
import { Login } from './pages/LoginPage';
import { HashRouter as HRouter, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import UserPanel from './pages/UserPanel';

import CourseTests from './pages/CourseTests';
import TestResults from './pages/TestResults';

import { Registration } from './pages/Registration';

function App() {
    const [token, setToken] = useState(-1);

    return (
        <div>
            <HRouter>
                <Routes>
                    <Route path="/" element={<MainPage logginToken={token} />} />
                    <Route path="/randTest" element={<RandomUsers />} />
                    <Route path="/loginPage" element={<Login token={token} setToken={setToken} />} />
                    <Route path="/UserPanel" element={<UserPanel logginToken={token} />} />

                    <Route path="/course/:courseId/tests" element={<CourseTests />} />
                    <Route path="/course/:courseId/test/:testId/results" element={<TestResults />} />

                    <Route path="/Registration" element={<Registration />} />

                </Routes>
            </HRouter>
        </div>
    );
}

export default App;
