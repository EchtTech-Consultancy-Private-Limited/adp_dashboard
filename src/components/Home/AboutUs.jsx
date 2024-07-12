import React from 'react'
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { Link } from 'react-router-dom';

export default function AboutUs() {
    return (
        <section className='about-us ptb-70 bg-white'>
            <div className="container">
                <div className="row">
                    <h2 className="heading-blue">About</h2>
                    <div className="col-md-10 m-auto">
                        <div className="home-tab">
                            <Tabs defaultActiveKey="Aspirational District Programme">
                                <Tab eventKey="Aspirational District Programme" title="Aspirational District Programme">
                                    <div className="tab-text text-center">
                                        <p>
                                            At Putney, our expert teachers inspire an inquisitive, original mindset. They will share their passion for their subjects, ensuring you are challenged and supported to play to your strengths.
                                        </p>
                                        <p>
                                            We offer a wide selection of GCSE and A Level subjects, grounded in scholarship and tailored to help you achieve outstanding results. Our cross-curricular approach and co-curricular programs motivate you beyond exams, empowering you to be curious, take risks, problem-solve, and think differently.
                                        </p>
                                        <p>
                                            We aim to educate you broadly: high-achieving, future-ready, and equipped with the skills and confidence to succeed in your ambitions.
                                        </p>
                                    </div>
                                    <div className="d-flex justify-content-center">
                                        <Link to="/transition-rate" className='btn-banner'>See Report  <span className="material-icons-round">arrow_forward</span></Link>
                                    </div>
                                </Tab>
                                <Tab eventKey="Aspirational Block Programme" title="Aspirational Block Programme">
                                    <div className="tab-text text-center">
                                        <p>
                                            At Putney, our expert teachers inspire an inquisitive, original mindset. They will share their passion for their subjects, ensuring you are challenged and supported to play to your strengths.
                                        </p>
                                        <p>
                                            We offer a wide selection of GCSE and A Level subjects, grounded in scholarship and tailored to help you achieve outstanding results. Our cross-curricular approach and co-curricular programs motivate you beyond exams, empowering you to be curious, take risks, problem-solve, and think differently.
                                        </p>
                                        <p>
                                            We aim to educate you broadly: high-achieving, future-ready, and equipped with the skills and confidence to succeed in your ambitions.
                                        </p>
                                    </div>
                                    <div className="d-flex justify-content-center">
                                        <Link to="/transition-rate" className='btn-banner'>See Report  <span className="material-icons-round">arrow_forward</span></Link>
                                    </div>
                                </Tab>
                            </Tabs>


                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
