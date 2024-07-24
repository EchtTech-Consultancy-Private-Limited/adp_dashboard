import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
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
import aspirationalAdpData2020 from "../../aspirational-reports-data/aspirationalAdpData2020-21.json";
import aspirationalAbpData from "../../aspirational-reports-data/aspirational.json";
import aspirationalAdpData2021 from "../../aspirational-reports-data/aspirationalAdpData2021-22.json";
import aspirationalAdpData2022 from "../../aspirational-reports-data/aspirationalAdpData2022-23.json";
import { useTranslation } from "react-i18next";
import AOS from "aos";
import "aos/dist/aos.css";
import AdpCountTotalAverage from "../../utils/AdpTotalAverage";
import AbpCountTotalAverage from "../../utils/AbpTotalAverage";

export default function Themes() {
  const selectedYear = useSelector(
    (state) => state.reportAdpAbpType.selectedYear
  );
  const selectedAdpAbpOption = useSelector(
    (state) => state.reportAdpAbpType.updateReportType
  );

  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const [aspirationalData, setAspirationalData] = useState({
    ADP_Report: [],
    ABP_Report: [],
  });

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
    dispatch(setselectedReport("Student Performance"));
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

  //  get the districts Count start

  let DistrictSet = new Set();
  aspirationalData.ADP_Report.forEach((item) => {
    DistrictSet.add(item.lgd_district_name);
  });
  let numberOfUniqueDistricts = DistrictSet.size;
  //  get the district Count end

  //  get the blocks Count start

  let blockSet = new Set();
  aspirationalData.ABP_Report.forEach((item) => {
    blockSet.add(item.lgd_block_name);
  });
  let numberOfUniqueBlockes = blockSet.size;

  //  get the blocks Count end

  // combinedData the data Year 20,21,22 start

  const combinedData = {
    "2020-21": {
      ADP_Report: aspirationalAdpData2020,
      ABP_Report: aspirationalAbpData,
    },
    "2021-22": {
      ADP_Report: aspirationalAdpData2021,
      ABP_Report: aspirationalAbpData,
    },
    "2022-23": {
      ADP_Report: aspirationalAdpData2022,
      ABP_Report: aspirationalAbpData,
    },
  };

  useEffect(() => {
    const yearData = combinedData[selectedYear];
    if (yearData) {
      const adpData = yearData.ADP_Report;
      const abpData = yearData.ABP_Report;

      // Combine or handle both reports as needed
      if (adpData && abpData) {
        setAspirationalData({
          ADP_Report: adpData,
          ABP_Report: abpData,
        });
      } else {
        console.warn("Data for the selected year or reports is missing");
      }
    }
  }, [selectedAdpAbpOption, selectedYear]);


  // combinedData the data Year 20,21,22 end

  // useEffect(() => {
  //     const selectedData = combinedData[selectedYear][selectedAdpAbpOption];
  //     if (selectedData) {

  //         setAspirationalData(selectedData);
  //     }
  // }, [selectedAdpAbpOption, selectedYear]);

  //    Transition  rate  Adp Data

  let AdpAllStateAverage = AdpCountTotalAverage(
    aspirationalData.ADP_Report,
    numberOfUniqueDistricts
  );

  //    Transition  rate  Abp Data

  let AbpAllStateAverage = AbpCountTotalAverage(
    aspirationalData.ABP_Report,
    numberOfUniqueBlockes
  );


  //    calculate   Transition rate Averge
  let TotalTransitionRateAdp_Abp = (
    (AdpAllStateAverage[0]?.Sec_Upri_Total +
      AbpAllStateAverage[0]?.Sec_Upri_Total) /
    2
  ).toFixed(2);

//   TeachAndSchResourses
  let TotalTeachAndSchResoursesAdp_Abp = (
    (AdpAllStateAverage[0]?.TeachAndSchResourses +
      AbpAllStateAverage[0]?.TeachAndSchResourses) /
    2
  ).toFixed(2);

// schoolPerformace

let TotalSchoolPerformanceAdp_Abp = (
    (AdpAllStateAverage[0]?.StudentPerformance +
      AbpAllStateAverage[0]?.StudentPerformance) /
    2
  ).toFixed(2);

//   let TotalTeacherAndschoolAdp_Abp   =AdpAllStateAverage



  return (
    <section className="themes ptb-70 position-relative">
      <div className="container ptb-70 position-relative">
        <div className="theme-border"></div>
        <div className="row position-relative z-2 pt-5 mt-3">
          <div className="col-md-1"></div>
          <div className="col-md-4">
            <div className="themes-text">
              <h3 className="heading-blue mb-3">
                {t("socioEconomic")} <br /> {t("themes")}
              </h3>
              <h6 className="sub-title">
                {t("kpiSentence1")}
                 {/* <br /> {t("kpiSentence2")}
                <br /> {t("kpiSentence3")} */}
              </h6>
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
                      {TotalTransitionRateAdp_Abp}%
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
                    <div className="theme-maintext">{TotalTeachAndSchResoursesAdp_Abp}%</div>
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
                    <div className="theme-maintext">{TotalSchoolPerformanceAdp_Abp}%</div>
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
                        to="/student-performance"
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
                        to="/student-performance"
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
                    <div className="theme-maintext">73%</div>
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
                      <Link  className="link">
                        {t("seeADPReport")}
                        <span className="material-icons-round">
                          arrow_forward_ios
                        </span>
                      </Link>
                      <Link  className="link">
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
