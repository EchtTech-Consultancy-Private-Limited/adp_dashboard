import React from 'react'
import Header from "../Header/Header";
import { Link } from 'react-router-dom';
import { useTranslation } from "react-i18next";

export default function Banners() {

  const { t, i18n } = useTranslation();
  
  return (
    <section className="bg-home">
      <div className="container">
        <Header />
        <div className="row mt-5 align-items-center">
          <div className="col-md-7">
           
          </div>
          <div className="col-md-5">
            <div className="banner-text">
             <div>
             <h1>{t('onePlatform')} <br /> {t('poweringBetter')} <br /> {t('information')}</h1>
             <Link to="/transition-rate" className='btn-banner'>{t('seeReport')}  <span className="material-icons-round">arrow_forward</span></Link>
            
             </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
