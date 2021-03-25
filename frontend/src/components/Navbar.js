import React from 'react';
import { Link } from 'react-router-dom';
import './NavbarStyle.css'


function Navbar() {


    return (
        <div className="navbarContainer">
            <div className='logoContainer'>
                <img src='./logo-mask.png' src='../logo-mask.png' style={{ width: '3.5rem', height: 'auto' }} />
                <h1 className='titleLogo'>FACELESS</h1>
            </div>
            <nav className='linkContainer'>
                <Link to='/home' className='linkNav'>Découverte</Link>
                <Link to='/conversations' className='linkNav'>Conversations</Link>
                <Link to='/profil' className='linkNav'>Profil</Link>
            </nav>
        </div>
    );
}

export default Navbar;