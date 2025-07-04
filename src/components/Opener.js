import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../components/styles/Opener.css';
import NavigationBar from './NavigationBar';

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
            <NavigationBar></NavigationBar>
            <div className='Logo-Circle'>
            </div>
        </div>
    );
}

export default Opener;
