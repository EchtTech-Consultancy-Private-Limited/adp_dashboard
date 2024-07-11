import React from 'react'
import { useState, useEffect } from "react";
import "./Header.scss";
import ministry from '../../assets/images/education_ministry.png';
import search from '../../assets/images/search.png';
import { Link, NavLink } from 'react-router-dom';


const Header = () => {
  const goToPageOnClick = () => {
    // navigate("/");
    window.location.href = window.location.origin;
  }

  const [showNavbar, setShowNavbar] = React.useState(false);

  const handleShowNavbar = () => {
    setShowNavbar(!showNavbar);
  };

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
                    <li><Link to='#'>Sitemap</Link></li>
                    <li><Link to='#' onClick={handleClickScroll}>Skip to Main Content</Link></li>
                    <li><Link to='#'>Screen Reader Access</Link></li>
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
                        <label className="switch">
                          <input type="checkbox" className="switch-input" id="mode"/>
                            <span data-on="On" data-off="Off" className="switch-label"></span>
                            <span className="switch-handle" title="Change Contrast"></span>
                        </label>
                      </div>
                    </li>

                    <li>
                      <div className='select-right'>                      
                          <div className="select-wrap">
                            <select className="form-select Langchange">
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
                              <option value="">A+</option>
                              <option value="">A</option>
                              <option value="">A-</option>
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
                  <Link to="" onClick={goToPageOnClick} className="logo-text ordernav-sm-2"> Asprirational <br /> District Programme   </Link>

                </div>

                <div className="navbar-right">
                  <div className={`nav-elements  ${showNavbar && "active"}`}>
                    <ul className='mb-0'>
                      <li>
                        <NavLink to="/">HOME</NavLink>
                      </li>
                      <li>
                        <NavLink to="/about">ABOUT US</NavLink>
                      </li>
                      <li>
                        <NavLink to="/transition-rate">REPORTS</NavLink>
                      </li>
                      <li>
                        <NavLink to="/news">NEWS & ARTICLES</NavLink>
                      </li>
                      <li>
                        <NavLink to="/insights">INSIGHTS</NavLink>
                      </li>
                      <li>
                        <NavLink to="/contact">CONTACT US</NavLink>
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
