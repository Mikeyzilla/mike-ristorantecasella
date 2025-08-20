import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../components/styles/PayNow.css';
import axios from 'axios';
import NavigationBar from './NavigationBar';

function PayNow() {
    const [totalPrice, setTotalPrice] = useState(0);
    const [username, setUsername] = useState('');
    const [address, setAddress] = useState('');
    const [creditCardNo, setCreditCardNo] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const redirect = useNavigate();

    useEffect(() => {
        const price = localStorage.getItem('totalPrice');
        const user = localStorage.getItem('username');

        if (price) {
            setTotalPrice(parseFloat(price)); 
        } else {
            redirect('/OrderOnline');
        }
        if (user) {
            setUsername(user);
        }
    }, [redirect]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!creditCardNo || !address) {
            setErrorMessage("Please fill in all fields.");
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/paynow', {
                username, 
                address, 
                creditCardNo,
                totalAmount: totalPrice 
            });

            

            alert('Payment successful!'); 
            localStorage.removeItem('totalPrice'); 
            redirect('/OrderOnline'); 
        } catch (error) {
            setErrorMessage(error.response?.data?.message || 'Payment failed. Please check your information.'); 
        }
    };

    return (
        <div className='PayNow-Page'>
            <NavigationBar />
            <div className='PayNow-TitleArea'> 
                <h2 className='PayNow-Title'>Pay Now</h2>
                <h3 className='PayNow-TotalTitle'>Your total amount is: ${totalPrice.toFixed(2)}</h3>
            </div>

            {errorMessage && <p className='error-message'>{errorMessage}</p>}
            <form className='PayNow-Form' onSubmit={handleSubmit}>
                <div className='PayNow-IndividualArea'>
                    <h2>Username</h2>
                    <input type='text' value={username} readOnly className='PayNow-Input' />
                </div>
                <div className='PayNow-IndividualArea'>
                    <h2>Address</h2>
                    <input 
                        type='text' 
                        placeholder='Street Address' 
                        value={address} 
                        onChange={(e) => setAddress(e.target.value)} 
                        required 
                        className='PayNow-Input'
                    />
                </div>
                <div className='PayNow-CardArea'>
                    <h2 className='PayNow-CardTitle'>Credit Card Number</h2>
                    <input 
                        type='text' 
                        placeholder='Credit Card Number' 
                        value={creditCardNo} 
                        onChange={(e) => setCreditCardNo(e.target.value)} 
                        required 
                        className='PayNow-CardInput'
                    />
                </div>
                <button type='submit' className='SubmitOrderButton'>Confirm Payment</button>
            </form>
        </div>
    );
}

export default PayNow;

