import { useNavigate } from "react-router-dom";
import MembershipBadge from "./MembershipBadge";
import "./styles/ProfileHeader.css"

function ProfileHeader() {
    const nameOfUser = localStorage.getItem('username');

    const navigate = useNavigate();

    const goHome = () => {
        navigate("/");
    }

    const signOut = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        navigate("/");
    }

    return (
        <div className="Profile-Header">
            <div className="MainFunctionalityArea">
                <button onClick={goHome}>Home</button>
                <h1>{nameOfUser}'s Profile</h1>
                <button onClick={signOut}>Sign Out</button>
            </div>
            <div className="UserProfile">
                <div>Ciao, {nameOfUser}!</div>
                <div className="ProfileAvatar"></div>
                <MembershipBadge></MembershipBadge>
            </div>
        </div>
    )
} export default ProfileHeader