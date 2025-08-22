import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../components/styles/NavigationBar.css';

function NavigationBar() {
    const navigate = useNavigate();
    const currentRoute = useLocation();

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

    const goToReservation = () => {
        navigate('/Reservation');
    }

    return( 
        <div className='NavigationBar-Area'>
            {currentRoute.pathname !== '/' && (
                <h2 className='HomePage' onClick={goHome}>Home Page</h2>
            )}
            {currentRoute.pathname !== '/RistoranteMenu' && (
                <h2 className='View-Menu' onClick={goToViewMenu}>View Menu</h2>
            )}
            {currentRoute.pathname !== '/OrderOnline' && (
                <h2 className='Order-Ahead' onClick={goToOrderOnline}>Order Online</h2>
            )}
            {currentRoute.pathname !== '/AboutUs' && (
                <h2 className='About-Us' onClick={goToAboutUs}>About Us</h2>
            )}
            {currentRoute.pathname !== '/ProfileSection' && (
                <h2 className='Profile' onClick={goToYourProfile}>My Account</h2>
            )}
            {currentRoute.pathname !== '/Reservation' && (
                <h2 className='ReservationTitle' onClick={goToReservation}>Reservations</h2>
            )}
        </div>
    );
}

export default NavigationBar;
