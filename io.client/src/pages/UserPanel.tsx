import { Link } from 'react-router-dom';
import * as React from 'react';
import { ButtonAppBar } from '../comps/AppBar.tsx';

const UserPanel = (props) => {
    const { logginToken } = props;

  
    return (
        <div>
            <ButtonAppBar />
    
            <div id="mainContainer">
                {/* G��wna zawarto�� UserPanel */}
                <h1>Witaj w Panelu U�ytkownika</h1>
                <p>Tu mo�esz zarz�dza� swoimi ustawieniami.</p>
            </div>
        </div>
    );
};

export default UserPanel;