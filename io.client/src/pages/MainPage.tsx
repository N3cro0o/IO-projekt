import * as React from 'react';
import { ButtonAppBar } from '../comps/AppBar.tsx';
import { IndividualIntervalsExample } from '../comps/Carousel.tsx';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const MainPage = (props) => {
    const { logginToken } = props;

    return (
        <Box
            sx={{
                minHeight: '85vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '20px',
            }}
        >
            {/* Navbar */}
            <ButtonAppBar />

            {/* Carousel */}
            <Box sx={{ width: '100%', maxWidth: '1200px', marginBottom: '40px' }}>
                <IndividualIntervalsExample />
            </Box>

            {/* Description Section */}
            <Box
                sx={{
                    width: '100%',
                    maxWidth: '1200px',
                    padding: '40px',
                    backgroundColor: '#1E1E1E', // ciemny kolor t�a dla sekcji opisu
                    borderRadius: '8px',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                    marginBottom: '40px',
                    color: '#fff', // jasny kolor tekstu
                    textAlign: 'center',
                }}
            >
                <Typography variant="h4" sx={{ fontWeight: 'bold', marginBottom: '20px' }}>
                    Tesaty Wiezy
                </Typography>
                <Typography variant="body1" sx={{ lineHeight: '1.6' }}>
                    Naszym celem jest stworzenie prostej w obs�udze, przejrzystej oraz
                    kompaktowej aplikacji, kt�ra b�dzie u�atwia� przeprowadzanie test�w,
                    egzamin�w oraz sprawdza� wiedz� u�ytkownik�w aplikacji. Du�� zalet�
                    naszego programu b�dzie zapisywanie pyta� w pulach pyta� podzielonych
                    na kategorie oraz mo�liwe wykorzystywanie pyta� w przysz�o�ci przy
                    tworzeniu nowych test�w.
                </Typography>
            </Box>

        </Box>
    );
};

export default MainPage;
