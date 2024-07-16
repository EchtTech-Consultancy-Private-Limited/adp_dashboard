import React, { useState, useEffect } from 'react';
import Header from '../Header/Header';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { selectBlock, selectDistrict, selectState, setStates } from '../../redux/slice/filterServicesSlice';
import { setselectedCompareDistricts, setselectedReport, setSelectedYear, setUpdateReportType, setUpdateStatus } from '../../redux/slice/reportTypeSlice';
// import aspirationalAbpData2020 from "../../aspirational-reports-data/2020-21/aspirationalAbpData.json";
import aspirationalAdpData2020 from "../../aspirational-reports-data/aspirationalAdpData2020-21.json"
// import aspirationalAbpData from "../../aspirational-reports-data/aspirationalAbpData.json";
import aspirationalAdpData2021 from "../../aspirational-reports-data/aspirationalAdpData2021-22.json";
// import aspirationalAbpData2022 from "../../aspirational-reports-data/aspirationalAbpData.json";
import aspirationalAdpData2022 from "../../aspirational-reports-data/aspirationalAdpData2022-23.json";
import aspirationalAbpData from "../../aspirational-reports-data/aspirational.json";
import { Select } from 'antd';
import { AllDistrict, SelectBlock, SelectDistrict, SelectKpi, SelectState } from '../../constant/Constant';
import { selectComparisionDistrict } from '../../redux/slice/filterServicesComprisionSlice';

export default function BannerReportFilter() {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const savedReportName = localStorage.getItem('selectedReport');
  const states = useSelector((state) => state.locationAdp.states);
  const districts = useSelector((state) => state.locationAdp.districts);
  const blocks = useSelector((state) => state.locationAdp.blocks);
  const selectedState = useSelector((state) => state.locationAdp.selectedState);
  const selectedDistrict = useSelector((state) => state.locationAdp.selectedDistrict);
  const selectedBlock = useSelector((state) => state.locationAdp.selectedBlock);
  const selectedOption = useSelector((state) => state.reportAdpAbpType.updateReportType);
  const selectedReport = useSelector((state) => state.reportAdpAbpType.selectedReport);
  const selectedYear= useSelector((state) => state.reportAdpAbpType.selectedYear);
  const [showBreadcomeAdpAbp, setShowBreadcomeAdpAbp] = useState();
  const [aspirationalData, setAspirationalData] = useState([]);
  const disableSelectedState = selectedState === "Select State";
  const disableSelectedDistrict = selectedDistrict === SelectDistrict || selectedDistrict === AllDistrict;

  // Combine the data from multiple JSON files
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
    // Update the state based on the selected options
    let selectedData;
    if(selectedOption){
      selectedData = combinedData[selectedYear][selectedOption];
    }
    
    if(selectedData){

      setAspirationalData(selectedData);
    }
    if(selectedOption === "ADP_Report"){
      setShowBreadcomeAdpAbp("ADP Report")
    }
    else{
      setShowBreadcomeAdpAbp("ABP Report")
    }
  }, [selectedOption, selectedYear]);

  useEffect(() => {
    const savedReportName = localStorage.getItem('selectedReport');
    if (savedReportName) {
      dispatch(setselectedReport(savedReportName));
    }
  }, [dispatch]);

  const handleReportChange = (value) => {
    dispatch(setUpdateReportType('ADP_Report'));
    localStorage.setItem('selectedReport', value);
    dispatch(setselectedReport(value));
    switch (value) {
      case 'Transition Rate':
        navigate('/transition-rate');
        break;
      case 'Teacher and School Resources':
        navigate('/teacher-and-school-resources');
        break;
      case 'Student Performance':
        navigate('/student-performance');
        break;
      case 'School Infrastructure':
        navigate('/school-infrastructure');
        break;
      case 'Enrollment and Retention':
        navigate('/enrollment-retention');
        break;
      default:
        navigate('/');
    }
  };

  useEffect(() => {
    if (aspirationalData.length > 0) {
      const structuredData = aspirationalData.reduce((acc, curr) => {
        const stateIndex = acc.findIndex((st) => st.lgd_state_id === curr.lgd_state_id);
        if (stateIndex === -1) {
          acc.push({
            lgd_state_id: curr.lgd_state_id,
            lgd_state_name: curr.lgd_state_name,
            districts: [
              {
                lgd_district_id: curr.lgd_district_id,
                lgd_district_name: curr.lgd_district_name,
                blocks: [
                  {
                    lgd_block_id: curr.lgd_block_id,
                    lgd_block_name: curr.lgd_block_name,
                  },
                ],
              },
            ],
          });
        } else {
          const districtIndex = acc[stateIndex].districts.findIndex(
            (dist) => dist.lgd_district_id === curr.lgd_district_id
          );
          if (districtIndex === -1) {
            acc[stateIndex].districts.push({
              lgd_district_id: curr.lgd_district_id,
              lgd_district_name: curr.lgd_district_name,
              blocks: [
                {
                  lgd_block_id: curr.lgd_block_id,
                  lgd_block_name: curr.lgd_block_name,
                },
              ],
            });
          } else {
            acc[stateIndex].districts[districtIndex].blocks.push({
              lgd_block_id: curr.lgd_block_id,
              lgd_block_name: curr.lgd_block_name,
            });
          }
        }
        return acc;
      }, []);

      dispatch(setStates(structuredData));
    }
  }, [aspirationalData, dispatch]);

  const handleOptionChange = (event) => {

    console.log("event value",event.target.value
    )
    dispatch(setUpdateReportType(event.target.value));
  };

  const handleStateChange = (value) => {
    dispatch(selectState(value));
    dispatch(setselectedCompareDistricts([]));
  };

  const handleDistrictChange = (value) => {
    dispatch(selectDistrict(value));
  };

  const handleBlockChange = (value) => {
    dispatch(selectBlock(value));
  };

  const handleYearChange = (value) => {
   dispatch(setSelectedYear(value));
    dispatch(selectState("Select State"));
    dispatch(setselectedCompareDistricts([]));
  };

  return (
    <section className='internal-banner-bg'>
      <div className="container">
        <Header />
        <div className="content-box">
          <div className="row align-items-center">
            <div className="col-md-3">
              <div className='main-title'>Reports </div>
              <div className="brudcrumb-text">Home / <span>{showBreadcomeAdpAbp}</span> / <span>{savedReportName}</span></div>
            </div>
            <div className="col-md-9">
              <div className="row select-infra Comparison-select-group">
                <div className="col-md-3 pe-0">
                  <div className="radio-button">
                    <div className="box-radio">
                      <input type="radio"
                        value="ADP_Report"
                        id="radio1"
                        checked={selectedOption === "ADP_Report"}
                        onChange={handleOptionChange} />
                      <label htmlFor="radio1">ADP Report</label>
                    </div>
                    <div className="box-radio">
                      <input type="radio"
                        value="ABP_Report"
                        id="radio2"
                        checked={selectedOption === "ABP_Report"}
                        onChange={handleOptionChange} />
                      <label htmlFor="radio2">ABP Report</label>
                    </div>
                  </div>
                </div>
                <div className="col-md-9">
                  <div className="d-flex justify-content-between text-aligns-center antd-select">
                    {/* Year select option */}
                    <Select onChange={handleYearChange} style={{ width: "100%" }} placeholder="Academic Year" mode="single" showSearch className="form-select" value={selectedYear }>
                      <Select.Option key="2020-21" value="2020-21">2020 - 21</Select.Option>
                      <Select.Option key="2021-22" value="2021-22">2021 - 22</Select.Option>
                      <Select.Option key="2022-23" value="2022-23">2022 - 23</Select.Option>
                    </Select>
                    {/* State select option */}
                    <Select onChange={handleStateChange} style={{ width: "100%" }} placeholder="Select State" mode="single" showSearch value={selectedState || "Select State"} className="form-select">
                      <Select.Option key="Select State" value={SelectState}>Select State</Select.Option>
                      {states.map((state) => (
                        <Select.Option key={state.lgd_state_id} value={state.lgd_state_name}>
                          {state.lgd_state_name}
                        </Select.Option>
                      ))}
                    </Select>
                    {/* District select option */}
                    <Select onChange={handleDistrictChange} style={{ width: "100%" }} placeholder="All District" mode="single" showSearch value={selectedDistrict || SelectDistrict} className="form-select">
                      <Select.Option key="All District" value={AllDistrict} disabled={disableSelectedState}>All District</Select.Option>
                      {districts.map((district) => (
                        <Select.Option key={district.lgd_district_id} value={district.lgd_district_name}>
                          {district.lgd_district_name}
                        </Select.Option>
                      ))}
                    </Select>
                    {/* Block select option */}
                    {selectedOption === "ADP_Report" ? "" :
                      <Select onChange={handleBlockChange} style={{ width: "100%" }} placeholder="All Block" mode="single" showSearch value={selectedBlock || SelectBlock} className="form-select">
                        <Select.Option key="All Block" value="All Block" disabled={disableSelectedDistrict || disableSelectedState}>All Block</Select.Option>
                        {blocks.map((block) => (
                          <Select.Option key={block.lgd_block_id} value={block.lgd_block_name}>
                            {block.lgd_block_name}
                          </Select.Option>
                        ))}
                      </Select>
                    }
                    <Select style={{ width: '100%' }} placeholder="Select KPI" mode="single" showSearch className="form-select" value={selectedReport || SelectKpi} onChange={handleReportChange}>
                      <Select.Option key="Transition Rate" value="Transition Rate">Transition Rate</Select.Option>
                      <Select.Option key="Teacher and School Resources" value="Teacher and School Resources">Teacher and School Resources</Select.Option>
                      <Select.Option key="Student Performance" value="Student Performance">Student Performance</Select.Option>
                      <Select.Option key="School Infrastructure" value="School Infrastructure">School Infrastructure</Select.Option>
                      {/* <Select.Option key="Enrollment and Retention" value="Enrollment and Retention">Enrollment and Retention</Select.Option> */}
                    </Select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
