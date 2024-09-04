import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import Transition from "../../assets/images/Transition_Rate.png";
import Teacher from "../../assets/images/Teacher_School.png";
import Student from "../../assets/images/Student_performance.png";
import Infrastructure from "../../assets/images/School_infrastructure.png";
import Enrollment from "../../assets/images/Enrollment_retention.png";
import devider from "../../assets/images/devider.svg";
import {
  setselectedReport,
  setUpdateReportType,
} from "../../redux/slice/reportTypeSlice";
import themesData from "../../aspirational-reports-data/themesData.json";
import { useTranslation } from "react-i18next";
import AOS from "aos";
import "aos/dist/aos.css";

export default function Themes() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const handleTransitionClick = (reportType) => {
    dispatch(setUpdateReportType(reportType));
    dispatch(setselectedReport("Transition Rate"));
  };
  const handleTeacherResourcesClick = (reportType) => {
    dispatch(setUpdateReportType(reportType));
    dispatch(setselectedReport("Teacher and School Resources"));
  };
  const handleStudentPerformanceClick = (reportType) => {
    dispatch(setUpdateReportType(reportType));
    dispatch(setselectedReport("Teachers Trained For Teaching CWSN"));
  };
  const handleSchoolInfraClick = (reportType) => {
    dispatch(setUpdateReportType(reportType));
    dispatch(setselectedReport("School Infrastructure"));
  };
  // const handleEnrollmenClick = (reportType) => {
  //     dispatch(setUpdateReportType(reportType));
  //     dispatch(setselectedReport("Enrollment and Retention"));
  // };

  useEffect(() => {
    AOS.init({
      disable: "phone",
      duration: 1000,
      easing: "ease-out-cubic",
    });
  }, []);

  let localhindi = localStorage.getItem('selectedLanguage');

  return (
    <section className={`themes ptb-70 position-relative ${localhindi === "hi" ? "hindilang" : ""}`} id="themes">
      <div className="container ptb-70 position-relative">
        <div className="theme-border"></div>
        <div className="row position-relative z-2 pt-5 mt-3">
          <div className="col-md-1"></div>
          <div className="col-md-4">
            <div className="themes-text">
              <h3 className="heading-blue mb-3">
                {t("socioEconomic")}
              </h3>

              <Link to="/transition-rate" className="btn-banner d-none-mobile">
                {t("exploreCompositeScore")}{" "}
                <span className="material-icons-round">arrow_forward</span>
              </Link>
            </div>
          </div>
          <div className="col-md-7">
            <div className="row">
              <div className="col-md-5">
                <div className="themes-box-img" data-aos="fade-up-right">
                  <div className="themes-box">
                    <div className="theme-text">
                      {t("transitionRateBoysGirls")}
                    </div>
                    <div className="theme-maintext">
                      79.01%
                    </div>
                    <div className="theme-subtext">{t("allStates")}</div>
                  </div>

                  <div className="theme-shadow-box">
                    <div className="content">
                      <p>{t("kpitransitionRateBoysGirls")}</p>
                      <ul>
                        <li>{t("percentageSchoolsHavingTotalBoysGirls")}</li>
                      </ul>
                    </div>

                    <div className="link-box">
                      <Link
                        to="/transition-rate"
                        className="link"
                        onClick={() => handleTransitionClick("ADP_Report")}
                      >
                        {t("seeADPReport")}{" "}
                        <span className="material-icons-round">
                          arrow_forward_ios
                        </span>
                      </Link>
                      <Link
                        to="/transition-rate"
                        className="link"
                        onClick={() => handleTransitionClick("ABP_Report")}
                      >
                        {t("seeABPReport")}{" "}
                        <span className="material-icons-round">
                          arrow_forward_ios
                        </span>
                      </Link>
                    </div>
                  </div>

                  <img src={Transition} alt="Transition" className="img-1" />
                </div>
              </div>

              <div className="col-md-5">
                <div className="themes-box-img" data-aos="fade-up-left">
                  <div className="themes-box">
                    <div className="theme-text">
                      {t("teacherSchoolResources")}
                    </div>
                    <div className="theme-maintext">{themesData[0]?.ele_sch_percent}%</div>
                    <div className="theme-subtext mb-2">{t("allStates")}</div>
                  </div>

                  <div className="theme-shadow-box">
                    <div className="content">
                      <p>{t("kpiteacherSchoolResources")}</p>
                      <ul>
                        <li>{t("percentageSChoolsTeacherSchoolResources")}</li>
                      </ul>
                    </div>

                    <div className="link-box">
                      <Link
                        to="/teacher-and-school-resources"
                        className="link"
                        onClick={() =>
                          handleTeacherResourcesClick("ADP_Report")
                        }
                      >
                        {t("seeADPReport")}{" "}
                        <span className="material-icons-round">
                          arrow_forward_ios
                        </span>
                      </Link>
                      <Link
                        to="/teacher-and-school-resources"
                        className="link"
                        onClick={() =>
                          handleTeacherResourcesClick("ABP_Report")
                        }
                      >
                        {t("seeABPReport")}
                        <span className="material-icons-round">
                          arrow_forward_ios
                        </span>
                      </Link>
                    </div>
                  </div>

                  <img src={Teacher} alt="Teacher" className="img-2" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row mt-4 position-relative z-2">
          <div className="col-md-9">
            <div className="row">
              <div className="col-md-4">
                <div className="themes-box-img" data-aos="fade-up-right">
                  <div className="themes-box">
                    <div className="theme-text">{t("studentPerformance")}</div>
                    <div className="theme-maintext">{themesData[0]?.swsn_teacher_percent}%</div>
                    <div className="theme-subtext mb-2">{t("allStates")}</div>
                  </div>

                  <div className="theme-shadow-box">
                    <div className="content">
                      <p>{t("kpistudentPerformance")}</p>
                      <ul>
                        <li>
                          {t("percentageSchoolshavingTrainedCWSNTeachers")}
                        </li>
                      </ul>
                    </div>

                    <div className="link-box">
                      <Link
                        to="/teachers-trained-for-teaching-CWSN"
                        className="link"
                        onClick={() =>
                          handleStudentPerformanceClick("ADP_Report")
                        }
                      >
                        {t("seeADPReport")}{" "}
                        <span className="material-icons-round">
                          arrow_forward_ios
                        </span>
                      </Link>
                      <Link
                        to="/teachers-trained-for-teaching-CWSN"
                        className="link"
                        onClick={() =>
                          handleStudentPerformanceClick("ABP_Report")
                        }
                      >
                        {t("seeABPReport")}
                        <span className="material-icons-round">
                          arrow_forward_ios
                        </span>
                      </Link>
                    </div>
                  </div>

                  <img src={Student} alt="Student" className="img-3" />
                </div>
              </div>

              <div className="col-md-4">
                <div className="themes-box-img" data-aos="fade-down-right">
                  <div className="themes-box">
                    <div className="theme-text">
                      {t("schoolInfrastructure")}
                    </div>
                    <div className="theme-maintext">{themesData[0]?.functional_toilet_girls_percent}%</div>
                    <div className="theme-subtext mb-2">{t("allStates")}</div>
                  </div>

                  <div className="theme-shadow-box">
                    <div className="content">
                      <p>{t("kpischoolInfrastructure")}</p>
                      <ul>
                        <li>{t("percentageSchoolsAdequateToilets")}</li>
                      </ul>
                    </div>

                    <div className="link-box">
                      <Link
                        to="/school-infrastructure"
                        className="link"
                        onClick={() => handleSchoolInfraClick("ADP_Report")}
                      >
                        {t("seeADPReport")}
                        <span className="material-icons-round">
                          arrow_forward_ios
                        </span>
                      </Link>
                      <Link
                        to="/school-infrastructure"
                        className="link"
                        onClick={() => handleSchoolInfraClick("ABP_Report")}
                      >
                        {t("seeABPReport")}
                        <span className="material-icons-round">
                          arrow_forward_ios
                        </span>
                      </Link>
                    </div>
                  </div>

                  <img
                    src={Infrastructure}
                    alt="Infrastructure"
                    className="img-4"
                  />
                </div>
              </div>

              <div className="col-md-4">
                <div className="themes-box-img" data-aos="fade-up-left">
                  <div className="themes-box">
                    <div className="theme-text">{t("enrollmentRetention")}</div>
                    <div className="theme-maintext">71.4%</div>
                    <div className="theme-subtext mb-2">{t("allStates")}</div>
                  </div>

                  <div className="theme-shadow-box">
                    <div className="content">
                      <p>{t("kpienrollmentRetention")}</p>
                      <ul>
                        <li>{t("percentageSchoolsEnrollmentRetention")}</li>
                      </ul>
                    </div>

                    <div className="link-box">
                      <Link className="link">
                        {t("seeADPReport")}
                        <span className="material-icons-round">
                          arrow_forward_ios
                        </span>
                      </Link>
                      <Link className="link">
                        {t("seeABPReport")}
                        <span className="material-icons-round">
                          arrow_forward_ios
                        </span>
                      </Link>
                    </div>
                  </div>

                  <img src={Enrollment} alt="Enrollment" className="img-5" />
                </div>
              </div>

              <div className="text-center">
                <Link
                  to="/transition-rate"
                  className="btn-banner d-none-desktop mt-4 ms-4"
                >
                  {t("exploreCompositeScore")}{" "}
                  <span className="material-icons-round">arrow_forward</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="devider-theme">
        <img src={devider} alt="devider" />
      </div>
    </section>
  );
}
