import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../components/styles/ProfileSection.css';
import NavigationBar from './NavigationBar';
import axios from 'axios';
import ProfileHeader from './ProfileHeader';
import MenuItem from './MenuItem';

const allergenList = ['Peanuts & Treenuts', 'Dairy', 'Shellfish', 'Wheat / Soy / Sesame', 'Gluten'];
type Allergen = (typeof allergenList)[number];

function ProfileSection() {
    const navigate = useNavigate();
    const [userData, setUserData] = useState({});
    const [activeTab, setActiveTab] = useState('settings');
    const [currentPass, setCurrentPass] = useState("");
    const [futurePass, setFuturePass] = useState("");
    const [balance, setBalance] = useState("");
    const [dietaryPreferences, setDietaryPreferences] = useState<Allergen[]>([]);
    const nameOfUser = localStorage.getItem('username');


    const determineFavoriteFood = () => {
        let myFavoriteFood = null;
        try {
            const usersFavoriteFood = localStorage.getItem('favoriteFood');
            myFavoriteFood = usersFavoriteFood ? JSON.parse(usersFavoriteFood) : null;
        } catch {
            myFavoriteFood = null;
        }
        if (!myFavoriteFood) {
            return <p>No favorite movie yet.</p>;
        }
        return (
            <div>
                <MenuItem
                    title={myFavoriteFood.title}
                    description={myFavoriteFood.description}
                    image={myFavoriteFood.image}
                    price={myFavoriteFood.price}
                    calories={myFavoriteFood.calories}
                    allergens={myFavoriteFood.allergens}
                    addToCart={() => { }}
                    removeFromCart={() => { }}
                />
            </div>
        );
    }

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/Registration');
        } else {
            retrieveData();
            viewCurrentBalance();
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

    const changePassword = async () => {
        try {
            const response = await axios.put(
                'http://localhost:5000/changePass',
                {
                    username: nameOfUser,
                    password: currentPass,
                    newPassword: futurePass
                },
                { headers: { 'Content-Type': 'application/json' } }
            );
        } catch (err) {
            console.error("Error with changing password: ", err);
        }
    };

    const viewCurrentBalance = async () => {
        try {
            const response = await axios.get('http://localhost:5000/getUserBalance', {
                params: { username: nameOfUser }
            });
            setBalance(response.data.cardAmount);
        } catch (err) {
            console.error("Error grabbing balance: ", err);
        }
    }

    const deleteData = async () => {
        try {
            const response = await axios.delete('http://localhost:5000/deleteAccount', {
                data: { username: nameOfUser },
                headers: { 'Content-Type': 'application/json' }
            });
        } catch (err) {
            console.error("Error grabbing balance: ", err);
        }
    }

    useEffect(() => {
        localStorage.setItem('dietaryPreferences', JSON.stringify(dietaryPreferences));
    }, [dietaryPreferences]);

    const togglePreference = (pref) => {
        setDietaryPreferences((prev) =>
            prev.includes(pref)
                ? prev.filter((item) => item !== pref)
                : [...prev, pref]
        );
    };

    return (
        <div className="App Page--scrollable">
            <NavigationBar />
            <div className='Profile-Section'>
                <div className='TabSwitcher'>
                    <div onClick={() => setActiveTab("settings")}>Settings</div>
                    <div onClick={() => setActiveTab("orders")}>Orders</div>
                    <div onClick={() => setActiveTab("favorites")}>Favorites</div>
                </div>
                <ProfileHeader></ProfileHeader>
                {activeTab === "settings" && (
                    <div>
                        <form onSubmit={(e) => { e.preventDefault(); changePassword(); }}>
                            <input type='password' value={currentPass} onChange={(e) => setCurrentPass(e.target.value)} placeholder='Current Password'></input>
                            <input type='password' value={futurePass} onChange={(e) => setFuturePass(e.target.value)} placeholder='New Password'></input>
                            <button type='submit'>Change Password</button>
                        </form>
                        <h1>Your current balance is: {balance}</h1>
                        <h1>Any Dietary Preferences? Click on the ones from the available list below and we'll highlight the menu items inside view menu that contain those, so you can avoid them!</h1>
                        <form>
                            <ol>
                                <li onClick={() => togglePreference("Peanuts & Treenuts")}>Peanuts & Treenuts</li>
                                <li onClick={() => togglePreference("Dairy")}>Dairy</li>
                                <li onClick={() => togglePreference("Shellfish")}>Shellfish</li>
                                <li onClick={() => togglePreference("Wheat / Soy / Sesame")}>Wheat / Soy / Sesame</li>
                                <li onClick={() => togglePreference("Gluten")}>Gluten</li>
                            </ol>
                        </form>
                        <button onClick={deleteData}>DELETE ACCOUNT</button>
                    </div>
                )}
                {activeTab === "favorites" && (
                    determineFavoriteFood()
                )}
            </div>
        </div>
    );
}

export default ProfileSection;