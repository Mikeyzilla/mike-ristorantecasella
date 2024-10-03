import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MenuItem from './MenuItem';
import '../components/styles/MenuViewer.css';

function MenuViewer() {
    const navigate = useNavigate();
    const [listOfAppetizers, setListOfAppetizers] = useState([]);
    const [listOfPasta, setListOfPasta] = useState([]);


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

    return (
        <div className='Menu-Page'>
            <div className='NavigationBar-Area'>
                <h2 className='HomePage' onClick={goHome}>Home Page</h2>
                <h2 className='Order-Ahead'onClick={goToOrderOnline}>Order Online</h2>
                <h2 className='About-Us'onClick={goToAboutUs}>About Us</h2>
                <h2 className='Profile'onClick={goToYourProfile}>My Account</h2>
            </div>

            <div className='Menu-Section'>
                <div className='Menu-Title-Area'>
                    <h1 className='Menu-Title'>Mike's Ristorante Menu</h1>
                </div>
                <h2 className='Appetizer-Section'>Appetizers</h2>
                <MenuItem 
                    title='Calamari' 
                    description='Hey'
                    image='calamari.jpg'
                    price='4.99'
                    calories='500'
                    allergens='Soy, Wheat'
                ></MenuItem>
                <MenuItem
                    title='Bruschetta'
                    description='This handcrafted'
                    image='bruschetta.jpg'
                    price='6.99'
                    calories='450'
                    allergens='None'
                    className='Bruschetta'
                >
                </MenuItem>
                <MenuItem 
                    title='Chips and Queso'
                ></MenuItem>
                <h2 className='Pasta-Section'>Pasta</h2>
                <MenuItem
                    title='Shrimp Parmigiana'
                    description='This delecacy is'
                    image='shrimp_parm.jpg'
                    price='17.99'
                    calories='1300'
                    allergens='Wheat'
                ></MenuItem>
                <MenuItem
                    title='Lobster Ravioli'
                ></MenuItem>
            </div>
        </div>
    );
}

export default MenuViewer;