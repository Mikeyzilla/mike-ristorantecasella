import React from 'react';
import '../components/styles/MenuItem.css';
import { useLocation } from 'react-router-dom';

function MenuItem({ title, description, image, price, calories, allergens, addToCart, removeFromCart }) {
    const currentRoute = useLocation();
    const OnlineOrderRoute = '/OrderOnline';

    const handleAdd = () => {
        const item = {
            title,
            description,
            image, 
            price,
            calories, 
            allergens
        };
        addToCart(item);
    };

    const handleRemove = () => {
        const item = {
            title,
            description,
            image, 
            price,
            calories, 
            allergens
        };
        removeFromCart(item);
    };

    return (
        <div className='MenuItem-Area'>
            <h2 className='MenuItem-Title'>{title}</h2>
    
            <div className='MenuItem-Content'>
                <img src={image} alt={title} className='MenuItem-Image' />
                <div className='MenuItem-Description'>
                    <h4 className='MenuItem-ItemDescription'>{description}</h4>
                    <div className='MenuItem-AdditionalInformation'>
                        <h2 className='MenuItem-Allergens'>Allergens: {allergens}</h2>
                    </div>
                </div>
                <div className='MenuItem-PriceArea'>
                    <h2 className='MenuItem-Price'>${price}</h2>
                    <h2 className='MenuItem-Calories'>{calories} calories</h2>
                    {currentRoute.pathname === OnlineOrderRoute && (
                        <div className='MenuItem-ButtonArea'>
                            <button onClick={handleAdd} className='MenuItem-AddButton'>+</button>
                            <button onClick={handleRemove} className='MenuItem-RemoveButton'>-</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );    
}

export default MenuItem;


