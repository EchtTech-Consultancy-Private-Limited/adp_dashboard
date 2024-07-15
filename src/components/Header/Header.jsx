import React from 'react'
import { useState, useEffect } from "react";
import "./Header.scss";
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
    localStorage.setItem("selectedLanguage", selectedLanguage); // Save selected language to local storage
    i18n.changeLanguage(selectedLanguage); // Change the language in i18n
    console.log("i18n",i18n)
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


  const changeSizeByBtn = (size) => {
    if (size === "normal") {
      document.body.style.fontSize = "14px";
    } else if (size === "average") {
      document.body.style.fontSize = "16px";
    } else if (size === "max") {
      document.body.style.fontSize = "18px";
    }
  }

  const handleClickScroll = () => {
    const element = document.getElementById('content');
    if (element) {
      // 👇 Will scroll smoothly to the top of the next section
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };


  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Function to format the date in the desired format
  const formatDateString = (date) => {
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();
    const ordinalSuffix = getOrdinalSuffix(day);

    return (
      <a href="#" className="date-link">
        {day}<sup className="ordinal">{ordinalSuffix} </sup> &nbsp;{month} {year}
      </a>
    );
  };

  // Function to get the ordinal suffix for a given day
  const getOrdinalSuffix = (day) => {
    if (day === 1 || day === 21 || day === 31) {
      return "st";
    } else if (day === 2 || day === 22) {
      return "nd";
    } else if (day === 3 || day === 23) {
      return "rd";
    } else {
      return "th";
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
                    {/* <li>
                      <div id="form-wrapper">
                        <form action="" method="" className="font-item">
                          <span className="font-t">A</span>
                          <div id="debt-amount-slider">
                            <input type="radio" name="debt-amount" id="1" value="1" required="" title="Decrease Font Size" onClick={() => changeSizeByBtn("normal")} />
                            <label htmlFor="1" title="Decrease Font Size"></label>
                            <input type="radio" name="debt-amount" id="2" value="2" defaultChecked="checked" required="" title="Normal Font Size" onClick={() => changeSizeByBtn("average")} />
                            <label htmlFor="2" title="Normal Font Size"></label>
                            <input type="radio" name="debt-amount" id="3" value="3" required="" title="Increase Font Size" onClick={() => changeSizeByBtn("max")} />
                            <label htmlFor="3" title="Increase Font Size"></label>
                            <div id="debt-amount-pos"></div>
                          </div>
                          <span className="font-t size-16">A</span>
                        </form>
                      </div>
                    </li> */}

                    {/* <li>
                      <div className="d-flex align-items-center">
                        <span className="text me-2">Dark Mode </span>
                        <label className="switch mb-0" title="Dark Mode">
                          <input type="checkbox" id="mode" />
                          <span className="slider round"></span>
                        </label>
                        <Switch  onChange={toggleDarkTheme} />
                      </div>
                    </li> */}

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
                          <select className="form-select Langchange">
                            <option value="">{t('gradeAPlus')}</option>
                            <option value="">{t('gradeA')}</option>
                            <option value="">{t('gradeAMinus')}</option>
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

              </nav>
            </div>
          </div>
        </div>
      </header>

    </>

  );
};




export default Header;
