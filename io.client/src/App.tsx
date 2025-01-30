import { useState } from 'react';
import './App.css';
import MainPage from './pages/MainPage';
import { Login } from './pages/LoginPage';
import { HashRouter as HRouter, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import UserPanel from './pages/TestManager';

import CourseTests from './pages/CourseTests';
import Course from './pages/CourseManager';

import { Registration } from './pages/RegistrationPage';
import SetTestTimePage from './pages/SetTestTimePage';
import { UserProfilePage } from './pages/AccountManager';
import EditTestPage from './pages/EditTestPage';
import CourseUser from './pages/StudentCourses';
import StartTest from './pages/TestTaker3000';

import CheckTest from './pages/CheckTest';
import TestToCheck from './pages/TestToCheck';
import SumTest from './pages/SumTest';

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
                    <Route path="/student/courses" element={<CourseUser />} />
                    <Route path="/student/:testID/start" element={<StartTest />} />
                    <Route path="/CheckTest/:testId" element={<CheckTest />} />
                    <Route path="/TestToCheck" element={<TestToCheck />} />
                    <Route path="/SumTest/:testId" element={<SumTest />} />
                </Routes>
            </HRouter>
        </div>
    );
}

export default App;
