import { useState } from 'react';
import './App.css';
import MainPage from './pages/MainPage';
import { Login } from './pages/LoginPage';
import { HashRouter as HRouter, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import UserPanel from './pages/UserPanel';

import CourseTests from './pages/CourseTests';
import Course from './pages/CourseManagment';

import { Registration } from './pages/Registration';
import SetTestTimePage from './pages/SetTestTimePage';
import { UserProfilePage } from './pages/AccountManager';
import EditTestPage from './pages/EditTestPage';

function App() {
    const [token, setToken] = useState(-1);

    return (
        <div>
            <HRouter>
                <Routes>
                    <Route path="/" element={<MainPage logginToken={token} />} />
                    <Route path="/loginPage" element={<Login token={token} setToken={setToken} />} />
                    <Route path="/UserPanel" element={<UserPanel logginToken={token} />} />
                    <Route path="/course/:courseId/tests" element={<CourseTests />} />
                    <Route path="/Registration" element={<Registration />} />
                    <Route path="/CourseManagment" element={<Course />} />
                    <Route path="/course/:courseId/test/:testId/set-time" element={<SetTestTimePage />} />
                    <Route path="/AccountManager" element={<UserProfilePage />} />
                    <Route path="/course/:courseId/test/:testId/edit" element={<EditTestPage />} />

                </Routes>
            </HRouter>
        </div>
    );
}

export default App;
