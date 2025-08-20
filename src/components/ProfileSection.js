import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../components/styles/ProfileSection.css';
import NavigationBar from './NavigationBar';
import axios from 'axios';
import ProfileHeader from './ProfileHeader';

function ProfileSection() {
    const navigate = useNavigate();
    const [userData, setUserData] = useState({});
    const [activeTab, setActiveTab] = useState('overview');
    // Will be either overview, orders, favorites, or settings.
    /*
    - Main Content (Tabbed or sectioned)
        - Overview (default)
        - Next reservation (date, time, party; “View / Modify / Cancel”)
        - Last order (items, “Reorder”)
        - Favorites (3–4 dishes)
        - Reservations
        - Upcoming reservations list (cards)
        - Past reservations (collapsible)
        - “Get restaurant address”
    - Orders
        - View Order Status of each order: Ordered -> Order Received -> Preparing -> Delivering -> Arrived
        - Points balance, progress bar to next perk
        - Tier benefits grid (perks with icons)
    Favorites
    - Dishes (cards with photo, tags like gluten-free, spicy)
    Settings
    - Profile: name, email, birthday (for birthday cannoli 🎉)
    - Change Password section
    - Dietary prefs: vegetarian, dairy-free, nut allergy (used for menu highlighting)
    - Payment: View Balance
    - delete account
    */

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
                //has address, credit card no, card amount so far.
                params: { username: nameOfUser }
            });
            console.log("Response data:", response.data);
            setUserData(response.data);
        } catch (err) {
            console.error("Error fetching user data:", err);
        }
    };

    return (
        <div>
            <NavigationBar />
            <div className='Profile-Section'>
                <ProfileHeader></ProfileHeader>
            </div>
        </div>
    );
}

export default ProfileSection;