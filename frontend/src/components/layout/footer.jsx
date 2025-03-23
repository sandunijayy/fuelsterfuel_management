import React from "react";
import { Link } from "react-router-dom";
import './footer.css'

const Footer = () => {
    return (
        <>
            <div>
                <div className="ltn__call-to-action-area call-to-action-6 before-bg-bottom" data-bs-bg="img/1.jpg--">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="call-to-action-inner call-to-action-inner-6 ltn__secondary-bg position-relative text-center---">
                                    <div className="coll-to-info text-color-white">
                                        <h1>Buy The best computer parts <br /> to enhance your digital experiance</h1>
                                    </div>
                                    <div className="btn-wrapper">
                                        <Link to="/productlist" className="btn btn-effect-3 btn-white" href="shop.html">Explore Products <i className="icon-next" /></Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* CALL TO ACTION END */}
                {/* FOOTER AREA START */}
                <footer className="ltn__footer-area  ">
                    <div className="footer-top-area  section-bg-2 plr--5">
                        <div className="container-fluid">
                            <div className="row">
                                <div className="col-xl-3 col-md-6 col-sm-6 col-12">
                                    <div className="footer-widget footer-about-widget">
                                        <div className="footer-logo">
                                            <div className="site-logo">

                                            </div>
                                        </div>
                                        <p>Lorem Ipsum is simply dummy text of the and typesetting industry. Lorem Ipsum is dummy text of the printing.</p>
                                        <div className="footer-address">
                                            <ul>
                                                <li>
                                                    <div className="footer-address-icon">
                                                        <i class="bi bi-geo-alt-fill"></i>
                                                    </div>
                                                    <div className="footer-address-info">
                                                        <p>15/A, clock Tower, kandy</p>
                                                    </div>
                                                </li>
                                                <li>
                                                    <div className="footer-address-icon">
                                                        <i class="bi bi-telephone-forward-fill"></i>
                                                    </div>
                                                    <div className="footer-address-info">
                                                        <p><a href="tel:+0123-456789" style={{ color: 'white' }}>
                                                            +0123-456789</a></p>

                                                    </div>
                                                </li>
                                                <li>
                                                    <div className="footer-address-icon">
                                                        <i class="bi bi-envelope-check"></i>
                                                    </div>
                                                    <div className="footer-address-info">
                                                        <p><a href="mailto:example@example.com" style={{ color: 'white' }}>example@example.com</a></p>
                                                    </div>
                                                </li>
                                            </ul>
                                        </div>
                                        <div className="ltn__social-media mt-20">
                                            <ul>
                                                <li><a href="#" title="Facebook"><i className="fab fa-facebook-f" /></a></li>
                                                <li><a href="#" title="Twitter"><i className="fab fa-twitter" /></a></li>
                                                <li><a href="#" title="Linkedin"><i className="fab fa-linkedin" /></a></li>
                                                <li><a href="#" title="Youtube"><i className="fab fa-youtube" /></a></li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-xl-2 col-md-6 col-sm-6 col-12">
                                    <div className="footer-widget footer-menu-widget clearfix">
                                        <h4 className="footer-title">Company</h4>
                                        <div className="footer-menu">
                                            <ul>
                                                <li><a href="/about" style={{ color: 'white' }}>About</a></li>
                                                <li><a href="/productlist" style={{ color: 'white' }}>All Products</a></li>
                                                <li><a href="/dashboard/user/feedbackdashboard" style={{ color: 'white' }}>Feedback</a></li>
                                                <li><a href="/dashboard/user/feedback" style={{ color: 'white' }}>Give a Feedback</a></li>
                                                <li>
                                                    <Link to="/contact">Contact Us</Link>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-xl-2 col-md-6 col-sm-6 col-12">
                                    <div className="footer-widget footer-menu-widget clearfix">
                                        <h4 className="footer-title">Services</h4>
                                        <div className="footer-menu">
                                            <ul>
                                                <li><a href="/dashboard/user/appointment" >Book Appointment</a></li>
                                                <li><a href="/dashboard/user/currentappointments" >Appointment</a></li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-xl-2 col-md-6 col-sm-6 col-12">
                                    <div className="footer-widget footer-menu-widget clearfix">
                                        <h4 className="footer-title">Customer Care</h4>
                                        <div className="footer-menu">
                                            <ul>
                                                <li><a href="/about" >About us</a></li>
                                                <li><a href="/contact" >Contact us</a></li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-xl-3 col-md-6 col-sm-12 col-12">
                                    <div className="footer-widget footer-newsletter-widget">
                                        <h4 className="footer-title">Newsletter</h4>
                                        <p>Subscribe to our weekly Newsletter and receive updates via email.</p>
                                        <div className="footer-newsletter">
                                            <form action="#">
                                                <input type="email" name="email" placeholder="Email*" />
                                                <div className="btn-wrapper">
                                                    <button className="theme-btn-1 btn" type="submit"><i className="fas fa-location-arrow" /></button>
                                                </div>
                                            </form>
                                        </div>


                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="ltn__copyright-area ltn__copyright-2 section-bg-7  plr--5">
                        <div className="container-fluid ltn__border-top-2">
                            <div className="row">
                                <div className="col-md-6 col-12">
                                    <div className="ltn__copyright-design clearfix">
                                        <p>All Rights Reserved @ Company <span className="current-year" /></p>
                                    </div>
                                </div>
                                <div className="col-md-6 col-12 align-self-center">
                                    <div className="ltn__copyright-menu text-end">
                                        <ul>
                                            <li><a href="#">Terms &amp; Conditions</a></li>
                                            <li><a href="#">Claim</a></li>
                                            <li><a href="#">Privacy &amp; Policy</a></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>

        </>
    );
};

export default Footer;