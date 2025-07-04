import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom'; 
import axios from 'axios'; 
import '../components/styles/LoginPage.css';
import NavigationBar from './NavigationBar';

function LoginPage() {

    const redirect = useNavigate(); 
    const loginUsernameRef = useRef();
    const loginPasswordRef = useRef();

    const Login = async (event) => {
        event.preventDefault();
        const attempted_loginName = loginUsernameRef.current.value;
        const attempted_loginPassword = loginPasswordRef.current.value;

        try {
            const response = await axios.post('http://localhost:5000/login', {
                username: attempted_loginName,
                password: attempted_loginPassword,
            });

            const token = response.data.token; 
            localStorage.setItem('token', token);
            localStorage.setItem('username', response.data.username);
            localStorage.setItem('card_amount', response.data.cardAmount);
            
            redirect('/');

        } catch (error) {
            if (error.response) {
                console.error(error.response.data.message); 
            } else {
                console.error("Error logging in:", error.message);
            }
        }
    }

    const handleSignUpRedirect = () => {
        redirect('/Registration');
    };

    return (
        <div>
            <NavigationBar />
            <div className='Login-Area'>
                <h2 className='Login-Title'> Log In Now!</h2>
                <form onSubmit={Login} className='Login-Form'>
                    <input
                        type='text'
                        ref={loginUsernameRef}
                        placeholder='Username'
                        className='Login-Field'
                    />
                    <input
                        type='password'
                        ref={loginPasswordRef}
                        placeholder='Password'
                        className='Login-Field'
                    />
                    <div className='LoginButton-Area'>
                        <input type='submit' value='Log In' className='Login-Button' />
                    </div>
                </form>
                <div className="Login-RedirectArea">
                    <span className='Login-NoAccountLabel'>No Account? </span>
                    <button onClick={handleSignUpRedirect} className='Login-RedirectButton'>Sign Up Now!</button>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;

