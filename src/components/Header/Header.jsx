import React from 'react'
import { useState, useEffect } from "react";
import "./header.scss";
import ministry from '../../assets/images/education_ministry.png';
import search from '../../assets/images/search.png';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { updateToggleDark } from '../../redux/slice/darkLightModeSlice';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from "react-i18next";
import { i18n } from '../i18next/i18n'  //Do not remove this line
import { Link as ScrollLink } from 'react-scroll';


const Header = () => {
  const dispatch = useDispatch()
  const toggleDarkMode = useSelector((state) => state.toggle.toggleDarkLight);
  const navigate = useNavigate();
  const handleAboutClick = () => {
    if (pathName !== "/") {
      navigate("/");
      setTimeout(() => {
        scrollToElement('aboutSection', -140);
      }, 500); // Adjust this duration if needed
    }
  };

  const scrollToElement = (id, offset) => {
    const element = document.getElementById(id);
    if (element) {
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset + offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };


  const goToPageOnClick = () => {
    // navigate("/");
    window.location.href = window.location.origin;
  }
  const location = useLocation()
  const pathName = location.pathname;
  const [showNavbar, setShowNavbar] = React.useState(false);
  const [isShow, setIsShow] = useState(false);

  const handleShowNavbar = () => {
    setShowNavbar(!showNavbar);
    setIsShow(!isShow);
  };

  const handleShowsearch = () => {
    setShowNavbar(!showNavbar);
    setIsShow(!isShow);
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
      const offset = -140;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY + offset;
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      });
    }
  };




  const toggleDarkTheme = () => {
    dispatch(updateToggleDark(!toggleDarkMode));
  };
  const handleChange = () => {

  }

  return (

    <>

      <div className="header-top header-bg">
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
                  <ul className="ps-0 mb-0">
                    <li>
                      <Link to="#">{t("sitemap")}</Link>
                    </li>
                    <li>
                      <Link to="#" onClick={handleClickScroll}>
                        {" "}
                        {t("skipToMainContent")}
                      </Link>
                    </li>
                    <li>
                      <Link to="/screen-reader-access">
                        {t("screenReaderAccess")}
                      </Link>
                    </li>
                  </ul>
                </div>

                <div className="header-top-skipwrap right-access-points">
                  <ul className="mb-0">
                    <li>
                      <div className="theme-toggle">
                        <label className="switch" title={toggleDarkMode? "Dark Mode":"Light Mode"}>
                          <input
                            className="switch-input"
                            type="checkbox"
                            id="mode"
                            onChange={handleChange}
                            checked={toggleDarkMode}
                            onClick={toggleDarkTheme}
                          />
                          <span
                            data-on="On"
                            data-off="Off"
                            className="switch-label"
                          ></span>
                          <span
                            className="switch-handle"
                            title="Change Contrast"
                          ></span>
                        </label>
                      </div>
                    </li>

                    <li>
                      <div className="select-right">
                        <div className="select-wrap">
                          <select
                            className="form-select Langchange"
                            value={i18n.language}
                            onChange={changeLanguage}
                          >
                            <option value="en">Eng</option>
                            <option value="hi">हिन्दी</option>
                          </select>
                        </div>
                      </div>
                    </li>

                    <li>
                      <div>
                        <div className="select-right">
                          <select
                            className="form-select Langchange"
                            onChange={changeSizeByBtn}
                          >
                            <option value="average">{t("gradeA")}</option>
                            <option value="max">{t("gradeAPlus")}</option>
                            <option value="normal">{t("gradeAMinus")}</option>
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

      <header className="site-header header-bg">
        <div className="container">
          <div className="header-bottom">
            <div className="row">
              <div className="col-md-12">
                <nav className="navbar navbar-expand-lg">
                  <div className="logo-wrap">
                    <Link
                      to=""
                      onClick={goToPageOnClick}
                      className="top-logo ordernav-sm-1"
                    >
                      {" "}
                      <img
                        src={ministry}
                        alt="logo"
                        className="img-fluid logo-main"
                      />
                    </Link>
                    <div className='header-logo-text'>
                      <Link
                        to=""
                        onClick={goToPageOnClick}
                        className="logo-text ordernav-sm-2">
                        {" "}
                        {t("aspirational")} <br />
                        {t("districtProgramme")}{" "}
                      </Link>

                      <Link
                        to=""
                        onClick={goToPageOnClick}
                        className="logo-text ordernav-sm-2">
                        {" "}
                        {t("aspirational")} <br />
                        {t("blockProgramme")}{" "}
                      </Link>
                    </div>
                  </div>

                  <div className="navbar-right d-flex align-items-center">
                    <div className={`nav-elements  ${showNavbar && "active"}`}>
                      <ul className="mb-0">
                        <li>
                          <NavLink to="/">{t("home")}</NavLink>
                        </li>
                        {pathName === "/" ? (
                          <li>
                            <ScrollLink
                              to="aboutSection"
                              smooth={true}
                              duration={500}
                              offset={-140}
                            //  className='active'
                            >
                              {t("about_us")}
                            </ScrollLink>
                          </li>
                        ) : (
                          <li>
                            <Link to="/" onClick={handleAboutClick}>
                              {t("about_us")}
                            </Link>
                          </li>
                        )}

                        <li>
                          {pathName === "/" ||
                            pathName === "/screen-reader-access" ? (
                            <NavLink to="/transition-rate">
                              {t("reports")}
                            </NavLink>
                          ) : pathName === "/transition-rate" ? (
                            <NavLink to="/transition-rate">
                              {t("reports")}
                            </NavLink>
                          ) : pathName === "/teacher-and-school-resources" ? (
                            <NavLink to="/teacher-and-school-resources">
                              {t("reports")}
                            </NavLink>
                          ) : pathName === "/student-performance" ? (
                            <NavLink to="/student-performance">
                              {t("reports")}
                            </NavLink>
                          ) : pathName === "/school-infrastructure" ? (
                            <NavLink to="/school-infrastructure">
                              {t("reports")}
                            </NavLink>
                          ) : pathName === "/enrollment-retention" ? (
                            <NavLink to="/enrollment-retention">
                              {t("reports")}
                            </NavLink>
                          ) : null}
                        </li>

                        {/* <li>
                        <NavLink to="/news">{t('newsAndArticles')}</NavLink>
                      </li>
                      <li>
                        <NavLink to="/insights">{t('insights')}</NavLink>
                      </li> */}
                        <li>
                          <NavLink to="/contact">{t("contactUs")}</NavLink>
                        </li>
                      </ul>
                    </div>
                    <div className="search-icon ms-3">

                      {/* <img src={search} alt="search"/> */}

                      <div class={`input-box ${isShow ? "open" : ""}`}>
                        <input type="text" placeholder="Search..." />
                        <span class="search" onClick={handleShowsearch}>
                          <span class="material-icons-round search-icon">search</span>
                        </span>
                        <span class="material-icons-round close-icon" onClick={handleShowsearch}>close</span>
                      </div>

                      {/* <img src={search} alt="search" onClick={handleShowsearch} /> */}
                      {/* <div className={`serch-box-show ${isShow ? "" : "d-none"}`}>
                        <form action="#" method="post">
                          <input type="hidden" name="_token" value="" />
                          <div className="d-flex">
                            <div className="d-flex">
                              <input type="search" className="form-control" placeholder="Search here..." />
                              <button type="submit" className="btn-info submit-btn-apply"> <span className="material-icons-round">search</span> </button>

                            </div>

                          </div></form>


                      </div> */}
                    </div>
                  </div>

                  <div
                    className={`menu-icon ${isShow ? "show" : ""}`}
                    onClick={handleShowNavbar}
                  >
                    <Hamburger />
                  </div>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </header>

    </>

  );
};

const Hamburger = () => (
  <>
    <svg xmlns="http://www.w3.org/2000/svg" width="52" height="24" viewBox="0 0 52 24" >
      <g id="Group_9" data-name="Group 9" transform="translate(-294 -47)">
        <rect
          id="Rectangle_3"
          data-name="Rectangle 3"
          width="42"
          height="4"
          rx="2"
          transform="translate(304 47)"
          fill="#574c4c" />
        <rect
          id="Rectangle_5"
          data-name="Rectangle 5"
          width="42"
          height="4"
          rx="2"
          transform="translate(304 67)"
          fill="#574c4c" />
        <rect
          id="Rectangle_4"
          data-name="Rectangle 4"
          width="52"
          height="4"
          rx="2"
          transform="translate(294 57)"
          fill="#574c4c" />
      </g>
    </svg>

    <svg
      width="40"
      height="40"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M18 6L6 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6 6L18 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </>
);


export default Header;