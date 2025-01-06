import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UserPanel from '../pages/UserPanel';
import TestList from '../pages/TestList';


const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<UserPanel />} /> {/* Strona g³ówna */}
                <Route path="/course/:courseId/tests" element={<TestList />} /> {/* Testy */}
            </Routes>
        </Router>
    );
};

export default App;
