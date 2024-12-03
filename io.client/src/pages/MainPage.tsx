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
                Naszym celem jest stworzenie prostej w obs³udze, przejrzystej oraz
                kompaktowej aplikacji, która bêdzie u³atwiaæ przeprowadzanie testów,
                egzaminów oraz sprawdzaæ wiedzê u¿ytkowników aplikacji. Du¿¹ zalet¹ naszego programu
                bêdzie zapisywanie pytañ w pulach pytañ podzielonych na kategorie oraz mo¿liwe wykorzystywanie pytañ
                w przysz³oœci przy tworzeniu nowych testów
        </div>
        </div>
    );
}

export default MainPage