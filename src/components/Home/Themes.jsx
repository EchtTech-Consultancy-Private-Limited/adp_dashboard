import React from 'react'
import { Link } from 'react-router-dom'
import Transition from '../../assets/images/Transition_Rate.png'
import Teacher from '../../assets/images/Teacher_School.png'
import Student from '../../assets/images/Student_performance.png'
import Infrastructure from '../../assets/images/School_infrastructure.png'
import Enrollment from '../../assets/images/Enrollment_retention.png'
import { useDispatch } from 'react-redux'
import { setselectedReport, setUpdateReportType } from '../../redux/slice/reportTypeSlice'

export default function Themes() {
    const dispatch = useDispatch()
    const handleTransitionClick = (reportType) => {
        dispatch(setUpdateReportType(reportType));
        dispatch(setselectedReport("Transition Rate"));
    };
    return (
        <section className='themes ptb-70'>
            <div className="container ptb-70 position-relative">
                <div className="theme-border"></div>
                <div className="row position-relative z-2 pt-5 mt-3">
                    <div className="col-md-1"></div>
                    <div className="col-md-4">
                        <div className="themes-text">
                            <h3 className='heading-blue mb-3'>Socio-Economic <br /> Themes </h3>
                            <h6 className='sub-title'>
                                49 Key Performance Indicators with 81 <br /> data points for the tracking and display <br /> of data on a real-time basis.
                            </h6>
                            <Link to="/transition-rate" className='btn-banner'>Explore Composite Score  <span className="material-icons-round">arrow_forward</span></Link>
                        </div>

                    </div>
                    <div className="col-md-7">
                        <div className="row">
                            <div className="col-md-5">
                                <div className="themes-box-img">
                                    <div className="themes-box">
                                        <div className="theme-text">
                                            Transition Rate (Boys/Girls)
                                        </div>
                                        <div className="theme-maintext">
                                            67.5%
                                        </div>
                                        <div className="theme-subtext">
                                            All States
                                        </div>
                                    </div>

                                    <div className="theme-shadow-box">
                                        <div className="content">

                                            <p>KPI's of Basic Infrastructure</p>
                                            <ul>
                                                <li>Percentage of Schools having Adequate Functional Girls' Toilets</li>
                                            </ul>
                                        </div>

                                        <div className="link-box">
                                            <Link to="/transition-rate" className="link" onClick={() => handleTransitionClick("ADP_Report")}>See ADP Report <span className="material-icons-round">arrow_forward_ios</span></Link>
                                            <Link to="/transition-rate" className="link" onClick={() => handleTransitionClick("ABP_Report")}>See ABP Report <span className="material-icons-round">arrow_forward_ios</span></Link>
                                        </div>
                                    </div>

                                    <img src={Transition} alt="Transition" className='img-1' />
                                </div>
                            </div>

                            <div className="col-md-5">
                                <div className="themes-box-img">
                                    <div className="themes-box">
                                        <div className="theme-text">
                                            Teacher and School Resources
                                        </div>
                                        <div className="theme-maintext">
                                            34%
                                        </div>
                                        <div className="theme-subtext mb-2">
                                            All States
                                        </div>
                                    </div>

                                    <div className="theme-shadow-box">
                                        <div className="content">

                                            <p>KPI's of Basic Infrastructure</p>
                                            <ul>
                                                <li>Percentage of Schools having Adequate Functional Girls' Toilets</li>
                                            </ul>
                                        </div>

                                        <div className="link-box">
                                            <Link to="/" className="link">See ADP Report <span className="material-icons-round">arrow_forward_ios</span></Link>
                                            <Link to="/" className="link">See ABP Report <span className="material-icons-round">arrow_forward_ios</span></Link>
                                        </div>
                                    </div>

                                    <img src={Teacher} alt="Teacher" className='img-2' />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row mt-4 position-relative z-2">
                    <div className="col-md-9">
                        <div className="row">
                            <div className="col-md-4">
                                <div className="themes-box-img">
                                    <div className="themes-box">
                                        <div className="theme-text">
                                            Student Performance
                                        </div>
                                        <div className="theme-maintext">
                                            62%
                                        </div>
                                        <div className="theme-subtext mb-2">
                                            All States
                                        </div>
                                    </div>

                                    <div className="theme-shadow-box">
                                        <div className="content">

                                            <p>KPI's of Basic Infrastructure</p>
                                            <ul>
                                                <li>Percentage of Schools having Adequate Functional Girls' Toilets</li>
                                            </ul>
                                        </div>

                                        <div className="link-box">
                                            <Link to="/" className="link">See ADP Report <span className="material-icons-round">arrow_forward_ios</span></Link>
                                            <Link to="/" className="link">See ABP Report <span className="material-icons-round">arrow_forward_ios</span></Link>
                                        </div>
                                    </div>

                                    <img src={Student} alt="Student" className='img-3' />
                                </div>
                            </div>

                            <div className="col-md-4">
                                <div className="themes-box-img">
                                    <div className="themes-box">
                                        <div className="theme-text">
                                            School Infrastructure
                                        </div>
                                        <div className="theme-maintext">
                                            73%
                                        </div>
                                        <div className="theme-subtext mb-2">
                                            All States
                                        </div>
                                    </div>

                                    <div className="theme-shadow-box">
                                        <div className="content">

                                            <p>KPI's of Basic Infrastructure</p>
                                            <ul>
                                                <li>Percentage of Schools having Adequate Functional Girls' Toilets</li>
                                            </ul>
                                        </div>

                                        <div className="link-box">
                                            <Link to="/" className="link">See ADP Report <span className="material-icons-round">arrow_forward_ios</span></Link>
                                            <Link to="/" className="link">See ABP Report <span className="material-icons-round">arrow_forward_ios</span></Link>
                                        </div>
                                    </div>

                                    <img src={Infrastructure} alt="Infrastructure" className='img-4' />
                                </div>
                            </div>

                            <div className="col-md-4">
                                <div className="themes-box-img">
                                    <div className="themes-box">
                                        <div className="theme-text">
                                            Enrollment and Retention
                                        </div>
                                        <div className="theme-maintext">
                                            71.4%
                                        </div>
                                        <div className="theme-subtext mb-2">
                                            All States
                                        </div>
                                    </div>

                                    <div className="theme-shadow-box">
                                        <div className="content">

                                            <p>KPI's of Basic Infrastructure</p>
                                            <ul>
                                                <li>Percentage of Schools having Adequate Functional Girls' Toilets</li>
                                            </ul>
                                        </div>

                                        <div className="link-box">
                                            <Link to="/" className="link">See ADP Report <span className="material-icons-round">arrow_forward_ios</span></Link>
                                            <Link to="/" className="link">See ABP Report <span className="material-icons-round">arrow_forward_ios</span></Link>
                                        </div>
                                    </div>

                                    <img src={Enrollment} alt="Enrollment" className='img-5' />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            {/* <div className="devider-theme"></div> */}
        </section>
    )
}
