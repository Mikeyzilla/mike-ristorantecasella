import React from 'react';
import '../components/styles/MenuItem.css';

function MenuItem({ title, description, image, price, calories, allergens}) {
    return (
        <div className='MenuItem-Area'>
            <h2 className='MenuItem-Title'>
                {title}
            </h2>

            <div className='MenuItem-Content'>
                <img src={image} alt={title} className='MenuItem-Image' />
                <div className='MenuItem-Description'>
                    <h4 className='MenuItem-ItemDescription'>
                        {description}
                    </h4>
                    <div className='MenuItem-AdditionalInformation'>
                        <h2 className='MenuItem-Allergens'> Allergens Include: {allergens} </h2>
                    </div>
                </div>
                <div className='MenuItem-PriceArea'>
                    <h2 className='MenuItem-Price'>${price}</h2>
                    <h2 className='MenuItem-Calories'>{calories} calories</h2>
                </div>
            </div>
        </div>
    );
}

export default MenuItem;

