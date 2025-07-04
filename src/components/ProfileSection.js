import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../components/styles/ProfileSection.css';
import NavigationBar from './NavigationBar';
import axios from 'axios';

function ProfileSection() {
    const navigate = useNavigate();
    const [userData, setUserData] = useState({});

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/Registration'); 
        } else {
            retrieveData();
        }
    }, [navigate]); 

    const retrieveData = async () => {
        const nameOfUser = localStorage.getItem('username');
        console.log("Username from localStorage:", nameOfUser);
        try {
            const response = await axios.get('http://localhost:5000/getUserData', {
                params: { username: nameOfUser }
            });
            console.log("Response data:", response.data);
            setUserData(response.data);
        } catch(err) {
            console.error("Error fetching user data:", err);
        }
    };

    const handleSignOut = () => {
       
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        
        navigate('/Login');

    };

    return (
        <div>
            <NavigationBar />
            <div className='Profile-Section'>
                <h2 className='Profile-Title'>Your Profile</h2>
                <ul>
                    <li>Username: {userData.username}</li>
                    <li>Address: {userData.address}</li>
                    <li>Credit Card Number: {userData.creditCardNumber}</li>
                </ul>
                <button onClick={handleSignOut} className='Profile-SignoutButton'>Sign Out</button>
            </div>
        </div>
    );
}

export default ProfileSection;