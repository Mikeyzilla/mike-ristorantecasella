import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../components/styles/PayNow.css';
import axios from 'axios';
import NavigationBar from './NavigationBar';

function PayNow() {
    const [totalPrice, setTotalPrice] = useState(0);
    const [username, setUsername] = useState('');
    const [address, setAddress] = useState('');
    const [deliveryOption, setDeliveryOption] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [checked, setChecked] = useState(false);
    const [tip, setTip] = useState('0');
    const [gateCode, setGateCode] = useState('');
    const redirect = useNavigate();
    const food = JSON.parse(localStorage.getItem('cartItems') || "[]");
    const user = localStorage.getItem('username');
    const [userBalance, setUserBalance] = useState(null);
    const [balanceAfterExpenses, setBalanceAfterExpenses] = useState(null);
    const getThatBalance = async (user) => {

        if (!user) {
            setUserBalance(null);
            return;
        }

        try {
            const { data } = await axios.get('http://localhost:5000/getUserBalance', {
                params: { username: user }
            });
            const amt = Number(data?.cardAmount);
            setUserBalance(Number.isFinite(amt) ? amt : null);
        } catch (err) {
            console.error(err);
            setUserBalance(null);
        }
    };

    const computeBalanceAfterExpenses = (balance, subtotal, tipPercentStr) => {
        const tipPct = Number(tipPercentStr);
        const tipAmount = (Number.isFinite(tipPct) ? tipPct : 0) / 100 * (Number(subtotal) || 0);
        const totalWithTip = (Number(subtotal) || 0) + tipAmount;
        if (!Number.isFinite(Number(balance))) return null;
        return Math.round((Number(balance) - totalWithTip) * 100) / 100;
    };

    useEffect(() => {
        const price = localStorage.getItem('totalPrice');
        const token = localStorage.getItem('token');
        if (!token) {
            redirect('/Login');
            return;
        }

        if (price) {
            setTotalPrice(parseFloat(price));
        } else {
            redirect('/OrderOnline');
        }

        if (user) {
            setUsername(user);
            getThatBalance(user);
        }
    }, [redirect]);

    useEffect(() => {
        const next = computeBalanceAfterExpenses(userBalance, totalPrice, tip);
        setBalanceAfterExpenses(next);
    }, [userBalance, totalPrice, tip]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!address) {
            setErrorMessage("Please fill in all fields.");
            return;
        }
        if (checked && !deliveryOption) {
            setErrorMessage("Please choose a delivery preference (ring or leave at doorstep).");
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/submitOrder', {
                username,
                address,
                totalAmount: totalPrice,
                orderType: checked ? "Delivery" : "Pickup",
                itemsOrdered: food
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
            <div className='OrderInfoArea'>
                <div className='OrderFormHeader'>
                    <div className='HeaderLeft'></div>
                    <div className='OrderTitle'>Pickup / Delivery Information</div>
                    <label className='DeliveryToggle'>Check this box if you want Delivery!
                        <input className='PickupOrDeliveryButton'
                            type="checkbox"
                            checked={checked}
                            onChange={(e) => setChecked(e.target.checked)}
                        />
                    </label>
                </div>
                {!checked && (
                    <div className='Gap'></div>
                )}
                {checked && (
                    <div className='DeliverySection'>
                        <h3 className="DeliveryHeading">How should we reach you?</h3>

                        <div className='DeliveryMethod'>
                            <div className="FormRow">
                                <label htmlFor='gateCode'>Gate Code (optional)</label>
                                <input
                                    id='gateCode'
                                    type='text'
                                    placeholder='Gate Code'
                                    value={gateCode}
                                    onChange={(e) => setGateCode(e.target.value)}
                                />
                                <div></div>
                            </div>
                            
                            <fieldset className='Field' style={{ border: 'none', padding: 0, width: '100%' }}>
                                <legend className='ContactLegend'>Contact preference (required)</legend>

                                <label className='RadioRow'>
                                    <input
                                        type='radio'
                                        name='deliveryContact'
                                        value='ring'
                                        checked={deliveryOption === 'ring'}
                                        onChange={() => setDeliveryOption('ring')}
                                    />
                                    Ring my doorbell
                                </label>

                                <label className='RadioRow'>
                                    <input
                                        type='radio'
                                        name='deliveryContact'
                                        value='door'
                                        checked={deliveryOption === 'door'}
                                        onChange={() => setDeliveryOption('door')}
                                    />
                                    Leave at doorstep
                                </label>
                            </fieldset>

                            {!deliveryOption && (
                                <div className='Hint'>Please choose one contact preference.</div>
                            )}
                        </div>
                    </div>
                )}

                {!checked && (
                    <div className="PickupSection">
                        <div className="FormRow">
                            <label htmlFor="pickupAddress">Pickup Street Address</label>
                            <input id="pickupAddress" type="text" />
                            <div></div>
                        </div>

                        <div className="FormRow">
                            <label htmlFor="pickupName">What name should we have for the order?</label>
                            <input id="pickupName" type="text" />
                            <div></div>
                        </div>
                    </div>
                )}
            </div>
            <div className='TipSelectorArea'>
                <h3>Tip</h3>
                <div className='Field'>
                    <label htmlFor='tipSelect'>Choose a tip amount</label>
                    <select
                        id='tipSelect'
                        value={tip}
                        onChange={(e) => setTip(e.target.value)}
                    >
                        <option value='0'>0%</option>
                        <option value='10'>10%</option>
                        <option value='15'>15%</option>
                        <option value='20'>20%</option>
                        <option value='30'>30%</option>
                    </select>
                </div>
                <p>
                    Your Balance will be <strong>${(balanceAfterExpenses ?? 0).toFixed(2)}</strong> after paying
                </p>
            </div>

            {errorMessage && <p className='error-message'>{errorMessage}</p>}
            <div className='FinalSection'>
                <form className='PayNow-Form' onSubmit={handleSubmit}>
                    <div className='FinalSectionHeader'>
                        <h1>Final Order Details</h1>
                    </div>

                    <div className="FormRow">
                        <label htmlFor="username">Username</label>
                        <input id="username" type="text" value={username} readOnly className="PayNow-Input" />
                        <div></div>
                    </div>

                    <div className="FormRow">
                        <label htmlFor="address">Address</label>
                        <input
                            id="address"
                            type="text"
                            placeholder="Street Address"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            required
                            className="PayNow-Input"
                        />
                        <div></div>
                    </div>

                    <button type='submit' className='SubmitOrderButton' disabled={balanceAfterExpenses < 0}>
                        Place Order
                    </button>
                </form>
            </div>
        </div>
    );
}

export default PayNow;

