import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Opener from './components/Opener';
import MenuViewer from './components/MenuViewer';
import AboutUs from './components/AboutUs';
import OrderOnline from './components/OrderOnline';
import ProfileSection from './components/ProfileSection';
import './App.css';
import LoginPage from './components/LoginPage';
import Registration from './components/Registration';
import PayNow from './components/PayNow';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route exact path='/' element={<Opener />} />
          <Route path='/AboutUs' element={<AboutUs/>} />
          <Route path='/RistoranteMenu' element={<MenuViewer />} />
          <Route path='/OrderOnline' element={<OrderOnline/>} />
          <Route path='/ProfileSection' element={<ProfileSection/>} />
          <Route path='/Login' element={<LoginPage/>} />
          <Route path='/Registration' element={<Registration/>} />
          <Route path='/Payment' element={<PayNow />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App
