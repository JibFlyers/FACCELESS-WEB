import React from 'react';
import {Link} from 'react-router-dom';

import './RegistrationStyle.css'


function RegistrationScreen() {


    return (
        <div className="firstPageContainer">
            <div className="registrationContainer">
                <img src={'./logo-faceless.png'} />
                <div className='buttonContainer'>
                    <Link to="/sign-up" className='buttonRegistration'>
                    S'inscrire
                    </Link>
                    <Link to="/sign-in" className='buttonRegistration'>
                    Connexion
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default RegistrationScreen