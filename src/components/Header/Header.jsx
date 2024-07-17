import React from 'react'
import { useState, useEffect } from "react";
import "./header.scss";
import ministry from '../../assets/images/education_ministry.png';
import search from '../../assets/images/search.png';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { updateToggleDark } from '../../redux/slice/darkLightModeSlice';
import { useTranslation } from "react-i18next";
import  {i18n} from '../i18next/i18n'  //Do not remove this line


const Header = () => {
const dispatch=useDispatch()
  const toggleDarkMode = useSelector((state) => state.toggle.toggleDarkLight);
  const goToPageOnClick = () => {
    // navigate("/");
    window.location.href = window.location.origin;
  }
  const location = useLocation()
  const pathName = location.pathname;
  const [showNavbar, setShowNavbar] = React.useState(false);

  const handleShowNavbar = () => {
    setShowNavbar(!showNavbar);
  };


  const { t, i18n } = useTranslation();
  const changeLanguage = (e) => {
    const selectedLanguage = e.target.value;
    localStorage.setItem("selectedLanguage", selectedLanguage); 
    i18n.changeLanguage(selectedLanguage); 
  
  };
  useEffect(() => {
    const savedLanguage = localStorage.getItem("selectedLanguage");
    if (!savedLanguage) {
      localStorage.setItem("selectedLanguage", "en");
      i18n.changeLanguage("en");
    } else {
      i18n.changeLanguage(savedLanguage);
    }
  }, [i18n]);


  const changeSizeByBtn = (event) => {
    const size = event.target.value;
    if (size === "normal") {
      document.body.className = "DecreaseFont";
    } else if (size === "average") {
      document.body.className = "AverageFont";
    } else if (size === "max") {
      document.body.className = "MaxFont";
    }
  }

  const handleClickScroll = () => {
    const element = document.getElementById('content');
    if (element) {
      // 👇 Will scroll smoothly to the top of the next section
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };


  const toggleDarkTheme = () => {
    dispatch(updateToggleDark(!toggleDarkMode));
  };


  return (

    <>

      <div className="header-top">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="header-top-content">
                {/* <div className="header-top-skipwrap top-date-time">
                  <ul>
                    <li>{formatDateString(currentDateTime)}</li>
                    <li><a href="#">{currentDateTime.toLocaleTimeString()}</a></li>
                  </ul>
                </div> */}

                <div className="header-top-skipwrap">
                  <ul className='ps-0 mb-0'>
                    <li><Link to='#'>{t('sitemap')}</Link></li>
                    <li><Link to='#' onClick={handleClickScroll}> {t('skipToMainContent')}</Link></li>
                    <li><Link to='#'>{t('screenReaderAccess')}</Link></li>
                  </ul>
                </div>

                <div className="header-top-skipwrap right-access-points">
                  <ul className='mb-0'>
                   
                    <li>
                      <div className="theme-toggle">
                        <label className="switch" title="Dark Mode">
                          <input className="switch-input"   type="checkbox"
                            id="mode"
                            checked={toggleDarkMode}
                            onClick={toggleDarkTheme}/>
                          <span data-on="On" data-off="Off" className="switch-label"></span>
                          <span className="switch-handle" title="Change Contrast"></span>
                        </label>
                      </div>
                    </li>

                    <li>
                      <div className='select-right'>
                        <div className="select-wrap">
                          <select className="form-select Langchange"
                             value={i18n.language}
                             onChange={changeLanguage}>
                            <option value="en">Eng</option>
                            <option value="hi">हिन्दी</option>
                          </select>
                        </div>
                      </div>
                    </li>

                    <li>
                      <div>
                        <div className='select-right'>
                          <select className="form-select Langchange" onChange={changeSizeByBtn}>
                            <option value="average">{t('gradeA')}</option>
                            <option value="max">{t('gradeAPlus')}</option>
                            <option value="normal">{t('gradeAMinus')}</option>
                          </select>

                        </div>

                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <header className="site-header">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <nav className="navbar navbar-expand-lg">
                <div className="logo-wrap">
                  <Link to="" onClick={goToPageOnClick} className="top-logo ordernav-sm-1"> <img src={ministry} alt="logo" className="img-fluid logo-main" />
                  </Link>
                  <Link to="" onClick={goToPageOnClick} className="logo-text ordernav-sm-2"> {t('aspirational')} <br />{t('districtProgramme')}  </Link>

                </div>
               
                <div className="navbar-right">
                  <div className={`nav-elements  ${showNavbar && "active"}`}>
                    <ul className='mb-0'>
                      <li>
                        <NavLink to="/">{t('home')}</NavLink>
                      </li>
                      <li>
                        <NavLink to="/about">{t('about_us')}</NavLink>
                      </li>
                      <li>
                        {pathName === "/" ? (
                          <NavLink to="/transition-rate">{t('reports')}</NavLink>
                        ) : pathName === "/transition-rate" ? (
                          <NavLink to="/transition-rate">{t('reports')}</NavLink>
                        ) : pathName === "/teacher-and-school-resources" ? (
                          <NavLink to="/teacher-and-school-resources">{t('reports')}</NavLink>
                        ) : pathName === "/student-performance" ? (
                          <NavLink to="/student-performance">{t('reports')}</NavLink>
                        ) : pathName === "/school-infrastructure" ? (
                          <NavLink to="/school-infrastructure">{t('reports')}</NavLink>
                        ) : pathName === "/enrollment-retention" ? (
                          <NavLink to="/enrollment-retention">{t('reports')}</NavLink>
                        ) : null}
                      </li>

                      <li>
                        <NavLink to="/news">{t('newsAndArticles')}</NavLink>
                      </li>
                      <li>
                        <NavLink to="/insights">{t('insights')}</NavLink>
                      </li>
                      <li>
                        <NavLink to="/contact">{t('contactUs')}</NavLink>
                      </li>
                      <li>
                        <div className='search-icon'>
                          <img src={search} alt="search" />
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="menu-icon" onClick={handleShowNavbar}>
                  <Hamburger />
                </div>

              </nav>
            </div>
          </div>
        </div>
      </header>

    </>

  );
};



const Hamburger = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="52"
    height="24"
    viewBox="0 0 52 24"
  >
    <g id="Group_9" data-name="Group 9" transform="translate(-294 -47)">
      <rect
        id="Rectangle_3"
        data-name="Rectangle 3"
        width="42"
        height="4"
        rx="2"
        transform="translate(304 47)"
        fill="#574c4c"
      />
      <rect
        id="Rectangle_5"
        data-name="Rectangle 5"
        width="42"
        height="4"
        rx="2"
        transform="translate(304 67)"
        fill="#574c4c"
      />
      <rect
        id="Rectangle_4"
        data-name="Rectangle 4"
        width="52"
        height="4"
        rx="2"
        transform="translate(294 57)"
        fill="#574c4c"
      />
    </g>
  </svg>
);


export default Header;
