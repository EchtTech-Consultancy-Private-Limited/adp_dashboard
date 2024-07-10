
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import './footer.scss'


const Footer = () => {
  return (
    <>
      <footer className="footer">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="footer-link">
                <Link to="/">Web Information Manger </Link>
                <Link to="/">Terms & Conditions </Link>
                <Link to="/">Copyright Policy </Link>
                <Link to="/">Hyperlink Policy </Link>
                <Link to="/">Privacy Policy </Link>
                <Link to="/">Help </Link>
                <Link to="/">Sitemap </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="container">
            <div className="row">
              <div className="col-md-6">
                <p className="copyright">© Copyright 2024. All Rights Reserved.</p>
              </div>
              <div className="col-md-6">
                <p className="visitor-counter">
                Visitor Counter : <span>2</span> <span>6</span> <span>4</span> <span>6</span> <span>8</span> <span>2</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer
