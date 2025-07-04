import React, { useState } from 'react'; 
import MenuItem from './MenuItem';
import NavigationBar from './NavigationBar';
import { listOfAppetizers, listOfDesserts, listOfPasta } from './MenuItemInformation';
import '../components/styles/MenuViewer.css';

function MenuViewer() {
    
    const [desserts, setDesserts] = useState(listOfDesserts)
    const [appetizers, setAppetizers] = useState(listOfAppetizers)
    const [pasta, setPasta] = useState(listOfPasta)

    return (
        <div className='Menu-Page'>
            <NavigationBar />

            <div className='Menu-Section'>
                <div className='Menu-Title-Area'>
                    <h1 className='Menu-Title'>Mike's Ristorante Menu</h1>
                </div>

                <h2 className='Appetizer-Title'>Appetizers</h2>
                <div className='Appetizer-Section'>
                    {appetizers.map((item, index) => (
                        <MenuItem 
                            key={index} 
                            title={item.title} 
                            description={item.description} 
                            image={item.image} 
                            price={item.price} 
                            calories={item.calories} 
                            allergens={item.allergens} 
                        />
                    ))}
                </div>

                <h2 className='Pasta-Title'>Pasta</h2>
                <div className='Pasta-Section'>
                    {pasta.map((item, index) => (
                        <MenuItem 
                            key={index} 
                            title={item.title} 
                            description={item.description} 
                            image={item.image} 
                            price={item.price} 
                            calories={item.calories} 
                            allergens={item.allergens} 
                        />
                    ))}
                </div>

                <h2 className='Desserts-Title'>Desserts</h2>
                <div className='Desserts-Section'>
                    {desserts.map((item, index) => (
                        <MenuItem 
                            key={index} 
                            title={item.title} 
                            description={item.description} 
                            image={item.image} 
                            price={item.price} 
                            calories={item.calories} 
                            allergens={item.allergens} 
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default MenuViewer;
