import { Link } from "react-router-dom";
import './Footer.scss'
import { useTranslation } from "react-i18next";
import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";

const Footer = () => {
  const { t, i18n } = useTranslation();

  useEffect(() => {
    AOS.init({
      disable: "phone",
      duration: 1000,
      easing: "ease-out-cubic",
    });
  }, []);

  return (
   
      <footer className="footer">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="footer-link" data-aos="fade-up">
                <Link to="/">{t('webInformationManager')}</Link>
                <Link to="/">{t('termsConditions')}</Link>
                <Link to="/">{t('copyrightPolicy')}</Link>
                <Link to="/">{t('hyperlinkPolicy')}</Link>
                <Link to="/">{t('privacyPolicy')}</Link>
                <Link to="/">{t('help')}</Link>
                <Link to="/">{t('sitemap')}</Link>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="container">
            <div className="row">
              <div className="col-md-6">
                <p className="copyright">{t('copyrightText')}</p>
              </div>
              <div className="col-md-6">
                <p className="visitor-counter">
                {t('visitorCounter')} <span>0</span> <span>0</span> <span>0</span> <span>0</span> <span>0</span> <span>0</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>
   
  );
};

export default Footer
