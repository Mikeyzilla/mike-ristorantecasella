import { useState, useEffect } from "react";
import "./styles/MembershipBadge.css"

function MembershipBadge() {
    const [membershipTier, setMembershipTier] = useState("Amici");
    const [membershipBadge, setMembershipBadge] = useState("");
    const [membershipReward, setMembershipReward] = useState("The entire team cheers you on when you walk in!");
    const [followingTier, setFollowingTier] = useState("");
    const [followingReward, setFollowingReward] = useState("");
    const totalCharge = Number(localStorage.getItem('totalPrice')) || 0;

    console.log(totalCharge);

    const determineMembershipStatus = () => {
        if (totalCharge === 30) {
            setMembershipTier("Amici");
            setMembershipReward("The entire team cheers you on when you walk in!");
        } else if (totalCharge > 30 && totalCharge < 500) {
            setMembershipTier("Famiglia");
            setMembershipReward("You get a complimentary appetizer every visit!");
        } else if (totalCharge >= 500 && totalCharge < 1000) {
            setMembershipTier("Nonna's Table");
            setMembershipReward("Nonna herself brings out a special dish, made just for you!");
        } else if (totalCharge >= 1000 && totalCharge < 2000) {
            setMembershipTier("Villa di Lusso");
            setMembershipReward("You dine like royalty with exclusive VIP seating!");
        } else if (totalCharge >= 2000) {
            setMembershipTier("The Don");
            setMembershipReward("The Don himself toasts to your honor every time you arrive!");
        }
    };

    const determineMembershipBadgeImage = () => {
        if (membershipTier === "Amici") {
            setMembershipBadge("url('/badges/amici.png')");
        } else if (membershipTier === "Famiglia") {
            setMembershipBadge("url('/badges/famiglia.png')");
        } else if (membershipTier === "Nonna's Table") {
            setMembershipBadge("url('/badges/nonna.png')"); //replace with real ai images
        } else if (membershipTier === "Villa di Lusso") {
            setMembershipBadge("url('/badges/villa.png')");
        } else if (membershipTier === "The Don") {
            setMembershipBadge("url('/badges/don.png')");
        }
    };

    const determineNextTier = () =>  {
        if (membershipTier === "Amici") {
            setFollowingTier("Famiglia");
        } else if (membershipTier === "Famiglia") {
            setFollowingTier("Nonna's Table");
        } else if (membershipTier === "Nonna's Table") {
            setFollowingTier("Villa di Lusso");
        } else if (membershipTier === "Villa di Lusso") {
            setFollowingTier("The Don");
        } else if (membershipTier === "The Don") {
            setFollowingTier("Max Tier Reached!");
        }
    };
    
    const determineFollowingReward = () => {
        if (membershipTier === "Amici") {
            setFollowingReward("Complimentary appetizer every visit!");
        } else if (membershipTier === "Famiglia") {
            setFollowingReward("Nonna will make you a special dish!");
        } else if (membershipTier === "Nonna's Table") {
            setFollowingReward("Exclusive VIP seating awaits!");
        } else if (membershipTier === "Villa di Lusso") {
            setFollowingReward("The Don himself will toast to you!");
        } else if (membershipTier === "The Don") {
            setFollowingReward("You're already at the top — no higher reward!");
        }
    };

    useEffect(() => {
        determineMembershipStatus();
    }, [totalCharge]);

    useEffect(() => {
        determineMembershipBadgeImage();
        determineNextTier();
        determineFollowingReward();
    }, [membershipTier]);

    return (
        <div className="MembershipBadgeArea">
            <div className="MembershipTitle">Membership Tier: {membershipTier}</div>
            <div className="MembershipBadgeImage" style={{ backgroundImage: membershipBadge }}></div>
            <div className="RedeemableReward">{membershipReward}</div>
            <div className="FollowingTier">Next Tier: {followingTier}</div>
            <div className="UpcomingReward">Upcoming Reward: {followingReward}</div>
        </div>
    );
}

export default MembershipBadge;
