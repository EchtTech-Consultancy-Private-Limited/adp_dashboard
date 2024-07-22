import React, { useEffect } from "react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import { Link } from "react-router-dom";
import {
  setselectedReport,
  setUpdateReportType,
} from "../../redux/slice/reportTypeSlice";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import AOS from "aos";
import "aos/dist/aos.css";
import { Element } from "react-scroll";

export default function AboutUs() {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const handleClick = (reportType) => {
    dispatch(setUpdateReportType(reportType));
    dispatch(setselectedReport("Transition Rate"));
  };

  useEffect(() => {
    AOS.init({
      disable: "phone",
      duration: 1000,
      easing: "ease-out-cubic",
    });
  }, []);

  return (
    
    <>
      <div id="content"></div>
    <section className="about-us ptb-70 bg-white" id="about-us">
      <Element name="aboutSection">
      <div className="container"id="aboutSection">
        <div className="row">
          <h2 className="heading-blue" data-aos="fade-up-left">{t("aboutTitle")}</h2>
          <div className="col-md-10 m-auto">
            <div className="home-tab" data-aos="fade-up">
              <Tabs defaultActiveKey="Aspirational District Programme">
                <Tab
                  eventKey="Aspirational District Programme"
                  title={t('aspirationalDistrictProgramme')}
                >
                  <div className="tab-text text-center">
                    <p>{t("section1")}</p>
                    <p>{t("section2")}</p>
                    <p>{t("section3")}</p>
                  </div>
                  <div
                    className="d-flex justify-content-center"
                    onClick={() => handleClick("ADP_Report")}>
                    <Link to="/transition-rate" className="btn-banner">
                      {t("seeReport")}{" "}
                      <span className="material-icons-round">
                        arrow_forward
                      </span>
                    </Link>
                  </div>
                </Tab>
                <Tab
                  eventKey="Aspirational Block Programme"
                  title={t('aspirationalBlockProgramme')}>
                  <div className="tab-text text-center">
                    <p>{t("section4")}</p>
                    <p>{t("section5")}</p>
                    <p>{t("section6")}</p>
                    <p>{t("section7")}</p>
                  </div>
                  <div
                    className="d-flex justify-content-center"
                    onClick={() => handleClick("ABP_Report")}>
                    <Link to="/transition-rate" className="btn-banner">
                      {" "}
                      {t("seeReport")}
                      <span className="material-icons-round">
                        arrow_forward
                      </span>
                    </Link>
                  </div>
                </Tab>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
      </Element>
    </section>
    </>
  );
}
