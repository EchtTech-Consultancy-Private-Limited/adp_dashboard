import { Link } from "react-router-dom";
import './Footer.scss'


const Footer = () => {
  return (
   
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
                Visitor Counter : <span>0</span> <span>0</span> <span>0</span> <span>0</span> <span>0</span> <span>0</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>
   
  );
};

export default Footer
