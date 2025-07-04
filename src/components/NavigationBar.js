import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../components/styles/NavigationBar.css';

function NavigationBar() {
    const navigate = useNavigate();
    const goHome = () => {
        navigate('/');
    };

    const goToOrderOnline = () => {
        navigate('/OrderOnline');
    };

    const goToAboutUs = () => {
        navigate('/AboutUs');
    };

    const goToYourProfile = () => {
        navigate('/ProfileSection');
    };

    const goToViewMenu = () => {
        navigate('/RistoranteMenu');
    };

    return( 
        <div className='NavigationBar-Area'>
            <h2 className='HomePage' onClick={goHome}>Home Page</h2>
            <h2 className='View-Menu' onClick={goToViewMenu}>View Menu</h2>
            <h2 className='Order-Ahead'onClick={goToOrderOnline}>Order Online</h2>
            <h2 className='About-Us'onClick={goToAboutUs}>About Us</h2>
            <h2 className='Profile'onClick={goToYourProfile}>My Account</h2>
        </div>
    );
}

export default NavigationBar;