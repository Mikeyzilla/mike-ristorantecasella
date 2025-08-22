import { useNavigate } from "react-router-dom";
import MembershipBadge from "./MembershipBadge";
import "./styles/ProfileHeader.css"

function ProfileHeader() {
    const nameOfUser = localStorage.getItem('username');
const membershipBadge = localStorage.getItem("membershipBadge") || "";
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

                <div className="TitleBlock">
                    <h1>{nameOfUser}'s Profile</h1>
                    <p className="Greeting">Ciao, {nameOfUser}!</p>
                </div>

                <button onClick={signOut}>Sign Out</button>
            </div>

            <div className="UserProfile">
                <div className="MemberProfileImageArea">
                    <div className="WhiteCircle">
                        <div className="ProfileAvatar"></div>
                    </div>
                    <div className={`MembershipBadgeImage ${membershipBadge}`} />
                </div>
                <MembershipBadge />
            </div>
        </div>
    )
} export default ProfileHeader