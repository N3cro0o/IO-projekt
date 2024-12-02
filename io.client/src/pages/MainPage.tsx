import { Link } from 'react-router-dom';
import * as React from 'react';
import { ButtonAppBar } from '../comps/AppBar.tsx';
import { IndividualIntervalsExample } from '../comps/Carousel.tsx'


const MainPage = (props) => {
    const { logginToken } = props;
  
    return (
        <div>
        <div id="mainContainer">
                <ButtonAppBar />

                <div id="carousel">
                    <IndividualIntervalsExample/>
                </div>
        </div>

            <div id="DescriptionContainer">
                <h1>Tesaty Wiezy</h1>
                Naszym celem jest stworzenie prostej w obs�udze, przejrzystej oraz
                kompaktowej aplikacji, kt�ra b�dzie u�atwia� przeprowadzanie test�w,
                egzamin�w oraz sprawdza� wiedz� u�ytkownik�w aplikacji. Du�� zalet� naszego programu
                b�dzie zapisywanie pyta� w pulach pyta� podzielonych na kategorie oraz mo�liwe wykorzystywanie pyta�
                w przysz�o�ci przy tworzeniu nowych test�w
        </div>
        </div>
    );
}

export default MainPage