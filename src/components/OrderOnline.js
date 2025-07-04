import React, { useState } from 'react';
import MenuItem from './MenuItem';
import { listOfAppetizers, listOfDesserts, listOfPasta } from './MenuItemInformation';
import '../components/styles/OrderOnline.css';
import NavigationBar from './NavigationBar';
import { useNavigate } from 'react-router-dom';

function OrderOnline() {
    const [desserts, setDesserts] = useState(listOfDesserts);
    const [appetizers, setAppetizers] = useState(listOfAppetizers);
    const [pasta, setPasta] = useState(listOfPasta);
    const [cartItems, setCartItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const redirect = useNavigate();

    const addToCart = (item) => {
        const price = parseFloat(item.price);
        const existingItem = cartItems.find(cartItem => cartItem.title === item.title);
        
        if (existingItem) {
            const updatedCartItems = cartItems.map(cartItem => 
                cartItem.title === item.title 
                    ? { ...cartItem, quantity: cartItem.quantity + 1 } 
                    : cartItem
            );
            setCartItems(updatedCartItems);
        } else {
            const newItem = { ...item, quantity: 1 };
            setCartItems([...cartItems, newItem]);
        }
        setTotalPrice(prevTotal => prevTotal + price);
    };
    
    const removeFromCart = (item) => {
        const price = parseFloat(item.price);
        const existingItem = cartItems.find(cartItem => cartItem.title === item.title);
        
        if (existingItem) {
            if (existingItem.quantity > 1) {
                const updatedCartItems = cartItems.map(cartItem => 
                    cartItem.title === item.title 
                        ? { ...cartItem, quantity: cartItem.quantity - 1 } 
                        : cartItem
                );
                setCartItems(updatedCartItems);
            } else {
                const updatedCartItems = cartItems.filter(cartItem => cartItem.title !== item.title);
                setCartItems(updatedCartItems);
            }
            setTotalPrice(prevTotal => prevTotal - price);
        }
    };
    
    const payNow = () => {
        if (localStorage.getItem('token') != null) {
            localStorage.setItem('totalPrice', totalPrice);
            redirect('/Payment');
        }
    };

    return (
        <div className='OrderOnline-Page'>
            <NavigationBar />
            <div className='OrderOnline-Menu'>
                <div className='OrderOnline-TitleArea'>
                    <h1 className='OrderOnline-Title'>Mike's Ristorante Menu</h1>
                </div>
                <div className='OrderOnline-Grid'>
                    <div>
                        <h2 className='OrderOnline-AppetizerTitle'>Appetizers</h2>
                        {appetizers.map((item, index) => (
                            <MenuItem 
                                key={index} 
                                title={item.title} 
                                description={item.description} 
                                image={item.image} 
                                price={item.price} 
                                calories={item.calories} 
                                allergens={item.allergens}
                                addToCart={addToCart} 
                                removeFromCart={removeFromCart}
                            />
                        ))}

                        <h2 className='OrderOnline-PastaTitle'>Pasta</h2>
                        {pasta.map((item, index) => (
                            <MenuItem 
                                key={index} 
                                title={item.title} 
                                description={item.description} 
                                image={item.image} 
                                price={item.price} 
                                calories={item.calories} 
                                allergens={item.allergens}
                                addToCart={addToCart} 
                                removeFromCart={removeFromCart}
                            />
                        ))}

                        <h2 className='OrderOnline-DessertsTitle'>Desserts</h2>
                        {desserts.map((item, index) => (
                            <MenuItem 
                                key={index} 
                                title={item.title} 
                                description={item.description} 
                                image={item.image} 
                                price={item.price} 
                                calories={item.calories} 
                                allergens={item.allergens}
                                addToCart={addToCart} 
                                removeFromCart={removeFromCart}
                            />
                        ))}
                    </div>

                    <div className='Ticket-Cart'>
                        <h2 className='TicketCart-Title'>
                            {localStorage.getItem('username') ? localStorage.getItem('username') : 'Guest'}
                        </h2>
                        <ul className='TicketCart-List'>
                            {cartItems.map((cartItem, index) => (
                                <li key={index} className='TicketCart-Item'>
                                    {cartItem.title} 
                                    <h4 className='TicketCart-Quantity'>Quantity: {cartItem.quantity}</h4>
                                </li>
                            ))}
                            <h2 className='TicketCart-Total'>Your Amount is: ${totalPrice.toFixed(2)}</h2>
                            <button className='TicketCart-MoveToPayment' onClick={payNow}>PAY NOW</button>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default OrderOnline;
