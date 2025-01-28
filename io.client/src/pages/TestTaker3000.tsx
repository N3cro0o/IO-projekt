import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box,
    Button,
    CircularProgress,
    TextField,
    Typography,
    Paper,
} from '@mui/material';
import { ButtonAppBar } from '../comps/AppBar.tsx';

const StartTest: React.FC = () => {
    const { testID } = useParams<{ testID: string }>();

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const response = await fetch(`/api/question/${testID}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

            }
            catch (err) {
                console.error(err);
            }
        }
        fetchQuestions();
    }, []);

    console.log(testID);

    return <div/>
}

export default StartTest;