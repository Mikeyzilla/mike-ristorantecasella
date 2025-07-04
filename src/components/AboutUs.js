import React from 'react';
import '../components/styles/AboutUs.css';
import NavigationBar from './NavigationBar';

function AboutUs() {

    return (
        <div>
            <NavigationBar></NavigationBar>
            <div className='AboutUs-TextArea'>
                <div className='AboutUs-StartArea'>
                    <h2 className='AboutUs-StartText'>Open Doors, Open Hearts</h2>
                </div>
    
                <div className='AboutUs-StartContent'>
                    <h3 className='AboutUs-CreationYear'>2005: The year that started it all</h3>
                    <h4 className='AboutUs-CompanyMindSet'>Here at Mike's Ristorante, we pride ourselves on flavor. Our team has been working relentlessly since we started in 1978, to capture the moment when Uncle Zeke hit his toe on a lego.</h4>
                    <img src='restaurantstaff.jpg' alt="Our Staff" className='AboutUs-StaffImage' />
                </div>

                <div className='AboutUs-BigDecisionsContent'>
                    <h3 className='AboutUs-BigTitle'>2008: Big Decisions</h3>
                    <h4 className='AboutUs-BigDescription'>In 2008, the stock market crashed. We took a big blow as a team because of this. Many of our members quit, and we weren't sure what to do. Franco wanted to quit as well. However, Johnny </h4>
                    <img src='construction.jpg' alt="A new site" className='AboutUs-DecisionsImage'></img>
                </div>

                <div className='AboutUs-StardomContent'> 
                    <h3 className='AboutUs-StardomYear'>2016: Rise to Stardom</h3>
                    <h4 className='AboutUs-StardomMindSet'>In 2016, we finally had our big break.</h4>
                    <img src='star.jpg' alt="Our contract with a superstar" className='AboutUs-StardomImage'></img>
                </div>

                <div className='AboutUs-GlobalContent'>
                    <h3>2024: Global Presence, Next Steps</h3>
                    <h4 className='AboutUs-GlobalDescription'>Nowadays, we're as popular as Google.</h4>
                    <img src='global.jpg' alt="Worldwide Fame" className='AboutUs-GlobalImage'></img>
                </div>

            </div>
        </div>
    );
}

export default AboutUs;