import { Link } from 'react-router-dom';
import * as React from 'react';
import { ButtonAppBar } from '../comps/AppBar';
import  CardExample  from '../comps/Placeholder';

const UserPanel = (props) => {
    const { logginToken } = props;

  
    return (
        <div>
            <ButtonAppBar />
    
            <div id="mainContainer">
                <div id="Placeholders">
                    <CardExample />
                </div>
            </div>
        </div>
    );
};

export default UserPanel;