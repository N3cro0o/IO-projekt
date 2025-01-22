import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UserPanel from '../pages/UserPanel';


const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<UserPanel />} /> {/* Strona g³ówna */}
            </Routes>
        </Router>
    );
};

export default App;
