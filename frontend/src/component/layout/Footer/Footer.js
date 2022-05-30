import React from 'react';
import playStore from "../../../images/playstore.png";
import appStore from "../../../images/Appstore.png";
import './Footer.css'

const Footer = () => {
    return (
        <Footer id="footer">
            <div className="leftFooter">
                <h4>DOWNLOAD OUR APP</h4>
                <p>ownload App for Androad and IOS Mobile Phone</p>
                <img src={playStore} alt="" />
                <img src={appStore} alt="" />
            </div>
            <div className="midFooter">
                <h4>ECOMMERCE</h4>
                <p>High Quality is our first priority</p>

                <p>Copyright 2022 &copy; Hritu-Raz</p>
            </div>
            <div className="rightFooter">
                <h4>Follow Us</h4>
                <a href="###">Instagram</a>
                <a href="###">YouTube</a>
                <a href="###">FaceBook</a>
            </div>

        </Footer>
    );
};

export default Footer;