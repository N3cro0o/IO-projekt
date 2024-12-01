//import { useEffect, useState } from 'react';
import { HashRouter as HRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import {Login} from './pages/LoginPage';

function App() {
   

    return (
        <div>
            Mamy tutj fajen stronke, polecam z rodzinka
            <br />
            <HRouter>
                <Routes>
                    <Route path="/" element={<Home/>}/>
                    <Route path="/loginPage" element={<Login />} />
                </Routes>
            </HRouter>
        </div>
    );
}

export default App;