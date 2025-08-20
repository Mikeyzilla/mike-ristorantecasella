import React, { useRef } from 'react';
import '../components/styles/Registration.css';
import NavigationBar from './NavigationBar';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useEffect } from 'react';

const addressTypePart = '(Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd|Lane|Ln|Drive|Dr|Court|Ct|Way|Terrace|Ter)\\.?';
const addressRegex = new RegExp(`^\\d+\\s+[A-Za-z0-9 .'-]+\\s+${addressTypePart}$`, 'i');

function Registration() {
    const redirect = useNavigate();
    const usernameRef = useRef();
    const passwordRef = useRef();
    const addressRef = useRef();
    const cardAmountRef = useRef();
    const [userNameStrength, setUserNameStrength] = useState("bad");
    const [passwordStrength, setPasswordStrength] = useState("bad");
    const [addressStrength, setAddressStrength] = useState("bad");
    const [balanceStrength, setBalanceStrength] = useState("bad");
    const [allStrong, setAllStrong] = useState(false);

    const checkForStrongUserName = (userName) => {
        setUserNameStrength(userName && userName.length >= 8 ? "good" : "bad");
    };

    const checkForStrongPassword = (password) => {
        if (password.length > 8 && password.test(/[!@#$%^&*:;?~]/) && password.test(/[A-Z]/)) {
            setPasswordStrength("good");
        }
    }

    const checkForStrongAddress = (address) => {
        const trimmed = address.trim();
        setAddressStrength(addressRegex.test(trimmed) ? 'good' : 'bad');
    };

    const checkForStrongBalance = (balance) => {
        if (balance > 0 && balance.test(/[A-Z, a-z]/) === false) {
            setBalanceStrength("good");
        }
    }

    useEffect(() => {
        setAllStrong(
            userNameStrength === 'good' &&
            passwordStrength === 'good' &&
            addressStrength === 'good' &&
            balanceStrength === 'good'
        );
    }, [userNameStrength, passwordStrength, addressStrength, balanceStrength]);

    const createUser = async (event) => {
        event.preventDefault();
        const attempted_username = usernameRef.current.value;
        const attempted_password = passwordRef.current.value;
        try {
            await axios.post('http://localhost:5000/register', {
                username: attempted_username,
                password: attempted_password,
                address: addressRef.current.value,
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
                        <input
                            type="text"
                            ref={usernameRef}
                            placeholder="Username"
                            className="Registration-Field"
                            onChange={(e) => checkForStrongUserName(e.target.value)}
                        />

                        <input
                            type="password"
                            ref={passwordRef}
                            placeholder="Password"
                            className="Registration-Field"
                            onChange={(e) => checkForStrongPassword(e.target.value)}
                        />

                        <input
                            type="text"
                            ref={addressRef}
                            placeholder="Address"
                            className="Registration-Field"
                            onChange={(e) => checkForStrongAddress(e.target.value)}
                        />

                        <input
                            type="text"
                            ref={cardAmountRef}
                            placeholder="Amount on Credit Card"
                            className="Registration-Field"
                            onChange={(e) => checkForStrongBalance(e.target.value)}
                        />

                        <div className='Button-Container'>
                            <input type='submit' value='Sign Up!' disabled={!allStrong} />
                            <button type='button' onClick={() => redirect('/Login')} className='Login-Redirect'>
                                Already Have an Account? Login!
                            </button>
                        </div>
                    </form>

                    <div className='Promo-ImageArea'>
                        <img src='superheroupdate.png' alt='Superhero' className='Promo-Image' />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Registration;


