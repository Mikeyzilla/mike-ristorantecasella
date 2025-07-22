import React, { useRef } from 'react';
import '../components/styles/Registration.css';
import NavigationBar from './NavigationBar';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const USER_REQUIREMENTS = /^[a-zA-Z][a-zA-Z0-9-_]{3,23}$/;
const PASSWORD_REQUIREMENTS = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

function Registration() {
    const redirect = useNavigate();
    const usernameRef = useRef();
    const passwordRef = useRef();
    const addressRef = useRef();
    const creditCardRef = useRef();
    const cardAmountRef = useRef();

    const createUser = async (event) => {
        event.preventDefault();
        const attempted_username = usernameRef.current.value;
        const attempted_password = passwordRef.current.value;
        
        try {   
            await axios.post('http://localhost:5000/register', {
                username: attempted_username,
                password: attempted_password,
                address: addressRef.current.value,
                creditCardNo: creditCardRef.current.value,
                cardAmount: cardAmountRef.current.value
            });

            redirect('/Login');
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div>
            <NavigationBar />
            <div className='Registration-ContentArea'>
                <div className='Registration-Header'>
                    <h2 className='Registration-Title'>Join our Family!</h2>
                    <h2 className='Promo-Message'>Sign up now & receive a kids action hero for free!</h2>
                </div>
                <div className='Registration-Grid'>
                <form onSubmit={createUser} className='Registration-Form'>
                    <input type='text' ref={usernameRef} placeholder='Username' className='Registration-Field'/>
                    <input type='password' ref={passwordRef} placeholder='Password' className='Registration-Field'/>
                    <input type='text' ref={addressRef} placeholder='Address' className='Registration-Field'/>
                    <input type='text' ref={creditCardRef} placeholder='Credit Card Number' className='Registration-Field'/>
                    <input type='text' ref={cardAmountRef} placeholder='Amount on Credit Card' className='Registration-Field'/>
                    <div className='Button-Container'>
                        <input type='submit' value='Sign Up!' />
                        <button type='button' onClick={() => redirect('/Login')} className='Login-Redirect'>
                            Already Have an Account? Login!
                        </button>
                    </div>
                </form>
                    
                    <div className='Promo-ImageArea'>
                        <img src='superheroupdate.png' alt='Superhero' className='Promo-Image'/>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Registration;


