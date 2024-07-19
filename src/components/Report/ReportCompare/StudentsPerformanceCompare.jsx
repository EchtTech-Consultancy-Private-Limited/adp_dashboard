
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectDistrict, selectState, setStates } from "../../../redux/slice/filterServicesComprisionSlice";
import { setAspirationalAllData, setselectedCompareDistricts, setselectedCompareOption, setUpdateReportType } from "../../../redux/slice/reportTypeSlice";
import aspirationalAbpData from "../../../aspirational-reports-data/aspirational.json";
import aspirationalAdpData from "../../../aspirational-reports-data/aspirationalDistrict.json";
import aspirationalAdpData2020 from "../../../aspirational-reports-data/aspirationalAdpData2020-21.json"
// import aspirationalAbpData2021 from "../../aspirational-reports-data/aspirationalAbpData.json";
import aspirationalAdpData2021 from "../../../aspirational-reports-data/aspirationalAdpData2021-22.json";
// import aspirationalAbpData2022 from "../../aspirational-reports-data/aspirationalAbpData.json";
import aspirationalAdpData2022 from "../../../aspirational-reports-data/aspirationalAdpData2022-23.json";
import table from '../../../assets/images/table.svg'
import card from '../../../assets/images/card-list.svg'
import { Card, Select } from 'antd';
import { SelectState } from "../../../constant/Constant";
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import BlankPage from "../BlankPage";
import { useTranslation } from "react-i18next";

const ArrowRenderer = ({ data }) => {
    const selectedOption = useSelector((state) => state.reportAdpAbpType.selectedOption);
    const [arrowData, setArrowData] = useState(null);

    useEffect(() => {
        if (selectedOption === "upper_primary_to_secondary") {
            setArrowData(data.upri_t);
        } else {
            setArrowData(data.sec_t);
        }
    }, [selectedOption, data]);

    const renderArrow = () => {
        if (selectedOption === "upper_primary_to_secondary" && arrowData >= 70 && arrowData <= 100) {
            return <ArrowUpwardIcon style={{ color: 'green', marginLeft: '5px', fontSize: "14px" }} />;
        } else if (selectedOption !== "upper_primary_to_secondary" && arrowData >= 40 && arrowData < 100) {
            return <ArrowUpwardIcon style={{ color: 'green', marginLeft: '5px', fontSize: "14px" }} />;
        } else {
            return <ArrowDownwardIcon style={{ color: 'red', marginLeft: '5px', fontSize: "14px" }} />;
        }
    };

    return (
        <span>
            {renderArrow()}
        </span>
    );
};



export default function StudentsPerformanceCompare() {
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();
    const aspirationalData=useSelector((state)=>state.reportAdpAbpType.aspirationalAllData)
    const selectedOption = useSelector((state) => state.reportAdpAbpType.selectedCompareOption);
    const selectedAdpAbpOption = useSelector((state) => state.reportAdpAbpType.updateReportType);
    const MAX_DISTRICTS = 5;
    const states = useSelector((state) => state.locationAdp.states);
    const districts = useSelector((state) => state.locationAdp.districts);
    const selectedState = useSelector((state) => state.locationAdp.selectedState);
    const selectedDistricts = useSelector((state) => state.reportAdpAbpType.selectedCompareDistricts)
    const selectedYear = useSelector((state) => state.reportAdpAbpType.selectedYear);
    function resteData() {
        dispatch(selectState(SelectState));
        dispatch(setselectedCompareOption("upper_primary_to_secondary"));
    }
    useEffect(() => {
        resteData()
    }, [dispatch]);


    useEffect(() => {
        dispatch(setAspirationalAllData(aspirationalAdpData))
    }, [dispatch]);
    


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
        const selectedData = combinedData[selectedYear][selectedAdpAbpOption];
        if (selectedData) {

            setAspirationalAllData(selectedData);
        }
    }, [selectedAdpAbpOption, selectedYear]);

    // Initialize states and districts from JSON data
    useEffect(() => {
        const structuredData = aspirationalData.reduce((acc, curr) => {
            const stateIndex = acc?.findIndex(
                (st) => st.lgd_state_id === curr.lgd_state_id
            );
            if (stateIndex === -1) {
                acc.push({
                    lgd_state_id: curr?.lgd_state_id,
                    lgd_state_name: curr?.lgd_state_name,
                    districts: [
                        {
                            lgd_district_id: curr?.lgd_district_id,
                            lgd_district_name: curr?.lgd_district_name,
                            total_school_cwsn: curr?.total_school_cwsn,
                            tot_school: curr?.tot_school,
                            swsn_teacher_percent: parseFloat(curr?.swsn_teacher_percent?.toFixed(2)),
                          
                        },
                    ],
                });
            } else {
                const districtIndex = acc[stateIndex].districts?.findIndex(
                    (dist) => dist.lgd_district_id === curr?.lgd_district_id
                );
                if (districtIndex === -1) {
                    acc[stateIndex].districts.push({
                        lgd_district_id: curr?.lgd_district_id,
                        lgd_district_name: curr?.lgd_district_name,
                        total_school_cwsn: curr?.total_school_cwsn,
                        tot_school: curr?.tot_school,
                        swsn_teacher_percent: parseFloat(curr?.swsn_teacher_percent?.toFixed(2)),
                       
                    });
                }
            }
            return acc;
        }, []);

        dispatch(setStates(structuredData));
    }, [dispatch]);

    // Handle state change
    const handleStateChange = (value) => {
        dispatch(selectState(value));
        dispatch(setselectedCompareDistricts([]));
    };

    // Handle district change
    const handleDistrictChange = (value, position) => {
        const newSelectedDistricts = [...selectedDistricts];
        const districtData = aspirationalData.find(
            (district) =>
                district.lgd_district_name === value &&
                district.lgd_state_name === selectedState
        );
        if (districtData) {
            newSelectedDistricts[position] = districtData;
            dispatch(setselectedCompareDistricts(newSelectedDistricts.slice(0, MAX_DISTRICTS)));
            dispatch(selectDistrict(value));
        }
    };

    // Get filtered districts based on selected state and existing selections
    const getFilteredDistricts = (position) => {
        const selected = selectedDistricts.filter(
            (district) =>
                district &&
                district.lgd_district_name !==
                selectedDistricts[position]?.lgd_district_name
        );
        return districts.filter(
            (district) =>
                !selected.map((d) => d.lgd_district_name).includes(district.lgd_district_name)
        );
    };


    return (
      <>
        <div className="card-box">
          <div className="row align-items-end">
            <div className="col-md-7">
              <div className="d-flex align-items-center">
                <div className="title-box">
                  {/* <h5 className='sub-title'>State :
                                    <Select
                                        className='state-select'
                                        onChange={handleStateChange}
                                        style={{ width: "50%" }}
                                        placeholder="Select State"
                                        mode="single"
                                        showSearch
                                        value={selectedState || SelectState}
                                    >
                                        <Select.Option key="Select State" value={SelectState}>
                                            Select State
                                        </Select.Option>
                                        {states.map((state) => (
                                            <Select.Option
                                                key={state.lgd_state_id}
                                                value={state.lgd_state_name}
                                            >
                                                {state.lgd_state_name}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                </h5> */}
                  <h3 className="heading-sm">
                    {t("comparisonByStudentPerformance")}
                  </h3>
                </div>
              </div>
            </div>
            <div className="col-md-5">
              <div className="d-flex w-m-100"></div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-12">
              <div className="comparison-box">
                <div className="row align-items-center">
                  <div className="col-md-3 order_1">
                    <h5 className="sub-title">
                      {t("selectDistrictToCompare")}
                    </h5>
                  </div>
                  <div className="col-md-6 Comparison-select-group order_3">
                    <div className="d-flex justify-content-between text-aligns-center antd-select">
                      {[...Array(MAX_DISTRICTS)].map((_, index) => (
                        <div key={index}>
                          <Select
                            className="form-select"
                            onChange={(value) =>
                              handleDistrictChange(value, index)
                            }
                            style={{ width: "100%" }}
                            placeholder={`${t("addDistrict")} ${index + 1}`}
                            mode="single"
                            showSearch
                            value={
                              selectedDistricts[index]?.lgd_district_name ||
                              `${t("addDistrict")}`
                            }
                            disabled={
                              index > 0 && !selectedDistricts[index - 1]
                            }
                          >
                            {getFilteredDistricts().map((district) => (
                              <Select.Option
                                key={district.lgd_district_id}
                                value={district.lgd_district_name}
                              >
                                {district.lgd_district_name}
                              </Select.Option>
                            ))}
                          </Select>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="col-md-3 order_2">
                    <div className="tab-box float-end">
                    <button className="tab-button active">
                      <img src={card} alt="card" /> <span>{t('cardView')}</span>
                    </button>
                    <button className="tab-button">
                      <img src={table} alt="Table" /> <span>{t('tableView')}</span>
                    </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {selectedState !== SelectState ? (
              <div className="col-md-12 mt-4">
                <div className="row">
                  {selectedDistricts.map((district, index) => (
                    <div
                      className={`col-sm-12 col-20 ${
                        selectedDistricts.length === 1 ? "m-auto" : ""
                      }`}
                    >
                      {selectedDistricts.length === 1 ? (
                        <Card
                          style={{
                            width: 300,
                          }}
                        >
                          <b>{t("selectOneMoreDistrict")}</b>
                        </Card>
                      ) : (
                        <>
                          {" "}
                          <div className="comp-card" key={index}>
                            <div className="upper-card">
                              <div className="d-flex align-items-center justify-content-between w-100">
                                <div className="d-flex">
                                  <div>
                                    <div
                                      className={`number-card card-color-${
                                        index + 1
                                      }`}
                                    >
                                      {index + 1}
                                    </div>
                                  </div>
                                  <div className="text-card">
                                    <p>District</p>
                                    <h6 className="sub-title">
                                      {district.lgd_district_name}
                                    </h6>
                                  </div>
                                </div>
                                <div className="arrow-d">
                                  {" "}
                                  <ArrowRenderer data={district} />
                                </div>
                              </div>
                            </div>

                            <div className="lower-card">
                              <div className="text-card">
                                <p>CWSN</p>
                                <h6 className="sub-title">
                                  {district?.total_school_cwsn}
                                </h6>
                              </div>
                              <div className="text-card">
                                <p>Total School</p>
                                <h6 className="sub-title">
                                  {district?.tot_school}
                                </h6>
                              </div>
                              <div className="text-card">
                                <p>{`% CWSN`}</p>
                                <h6 className="sub-title">
                                  {district?.swsn_teacher_percent?.toFixed(2)}
                                </h6>
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <BlankPage />
            )}
          </div>
        </div>
      </>
    );
}