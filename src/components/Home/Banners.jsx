import React, { useEffect } from 'react'
import Header from "../Header/Header";
import { Link } from 'react-router-dom';
import { useTranslation } from "react-i18next";
import AOS from "aos";
import "aos/dist/aos.css";

export default function Banners() {

  const { t, i18n } = useTranslation();
  
  useEffect(() => {
    AOS.init({
      disable: "phone",
      duration: 1000,
      easing: "ease-out-cubic",
    });
  }, []);
  return (
    <section className="bg-home">
      <div className="overlay">
      <div className="container">
        <Header />
        <div className="row mt-5 align-items-center">
          <div className="col-md-7">
           
          </div>
          <div className="col-md-5">
            <div className="banner-text">
             <div>
             <h1 data-aos="fade-left" data-aos-delay="500">{t('onePlatform')} <br /> {t('poweringBetter')} <br /> {t('information')}</h1>
             <Link to="/transition-rate" className='btn-banner' data-aos="zoom-in" data-aos-delay="1000">{t('seeReport')}  <span className="material-icons-round">arrow_forward</span></Link>
            
             </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </section>
  )
}
