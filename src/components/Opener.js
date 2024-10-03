import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../components/styles/Opener.css';

function Opener() {
    const navigate = useNavigate();

    const goToViewMenu = () => {
        navigate('/RistoranteMenu');
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

    return (
        <div className='Opening-Visuals-Area'>
            <div className='NavigationBar-Area'>
                <h2 className='View-Menu' onClick={goToViewMenu}>View Menu</h2>
                <h2 className='Order-Ahead'onClick={goToOrderOnline}>Order Online</h2>
                <h2 className='About-Us'onClick={goToAboutUs}>About Us</h2>
                <h2 className='Profile'onClick={goToYourProfile}>My Account</h2>
            </div>
            <div className='Logo-Circle'>
            </div>
        </div>
    );
}

export default Opener;
