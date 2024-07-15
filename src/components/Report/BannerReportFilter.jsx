import React, { useState, useEffect } from 'react'
import Header from '../Header/Header'
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { selectBlock, selectDistrict, selectState, setStates } from '../../redux/slice/filterServicesSlice';
import { setselectedReport, setUpdateReportType, setUpdateStatus } from '../../redux/slice/reportTypeSlice';
import aspirationalAbpData from "../../aspirational-reports-data/aspirational.json";
import aspirationalAdpData from "../../aspirational-reports-data/aspirationalDistrict.json";
import { Select } from 'antd';
import { AllDistrict, SelectBlock, SelectDistrict, SelectKpi, SelectState } from '../../constant/Constant';

export default function BannerReportFilter() {

  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate()
  const savedReportName = localStorage.getItem('selectedReport');
  const states = useSelector((state) => state.locationAdp.states);
  const districts = useSelector((state) => state.locationAdp.districts);
  const blocks = useSelector((state) => state.locationAdp.blocks);
  const selectedState = useSelector((state) => state.locationAdp.selectedState);
  const [aspirationalData, setAspirationalData] = useState([])
  const selectedDistrict = useSelector((state) => state.locationAdp.selectedDistrict);
  const selectedBlock = useSelector((state) => state.locationAdp.selectedBlock);
  const disableSelectedState = selectedState === "Select State"
  const disableSelectedDistrict =selectedDistrict === SelectDistrict || selectedDistrict === AllDistrict;
  const selectedOption = useSelector((state) => state.reportAdpAbpType.updateReportType)
  const selectedReport=useSelector((state)=>state.reportAdpAbpType.selectedReport)
  const [showBreadcomeAdpAbp, setShowBreadcomeAdpAbp]=useState()

  useEffect(() => {
    const savedReportName = localStorage.getItem('selectedReport');
    if (savedReportName) {
      setselectedReport(savedReportName);
    }
  }, []);
  const handleReportChange = (value) => {
    console.log()
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
   // dispatch(setUpdateReportType('ADP_Report'));
    setAspirationalData(aspirationalAdpData)
  }, [dispatch]);
  useEffect(() => {
    if (selectedOption === "ADP_Report") {
      setAspirationalData(aspirationalAdpData)
      setShowBreadcomeAdpAbp("ADP Report")
    }
    else {
      setAspirationalData(aspirationalAbpData)
      setShowBreadcomeAdpAbp("ABP Report")
    }
  }, [selectedOption])
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
    dispatch(setUpdateReportType(event.target.value));
  };
  const handleStateChange = (value) => {
    dispatch(selectState(value));
  };

  const handleDistrictChange = (value) => {
    dispatch(selectDistrict(value));
  };

  const handleBlockChange = (value) => {
    dispatch(selectBlock(value));
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
                    {/* State select option */}

                    <Select onChange={handleStateChange} style={{ width: "100%" }} placeholder="Select State" mode="single" showSearch
                      value={selectedState || "Select State"} className="form-select">
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
                    {/* District select option */}
                    <Select
                      onChange={handleDistrictChange}
                      style={{ width: "100%" }}
                      placeholder="All District"
                      mode="single"
                      showSearch
                      value={selectedDistrict || SelectDistrict}
                      className="form-select"

                    >
                      <Select.Option
                        key="All District"
                        value={AllDistrict}
                        disabled={disableSelectedState}
                      >
                        All District
                      </Select.Option>
                      {districts.map((district) => (
                        <Select.Option
                          key={district.lgd_district_id}
                          value={district.lgd_district_name}
                        >
                          {district.lgd_district_name}
                        </Select.Option>
                      ))}
                    </Select>

                    {/* Block select option */}
                    {selectedOption === "ADP_Report" ? "" :

                      <Select
                        onChange={handleBlockChange}
                        style={{ width: "100%" }}
                        placeholder="All Block"
                        mode="single"
                        showSearch
                        value={selectedBlock || SelectBlock}
                        className="form-select"

                      >
                        <Select.Option
                          key="All Block"
                          value="All Block"
                          disabled={disableSelectedDistrict || disableSelectedState}
                        >
                          All Block
                        </Select.Option>
                        {blocks.map((block) => (
                          <Select.Option
                            key={block.lgd_block_id}
                            value={block.lgd_block_name}
                          >
                            {block.lgd_block_name}
                          </Select.Option>
                        ))}
                      </Select>

                    }


                      <Select
                        style={{ width: '100%' }}
                        placeholder="Select KPI"
                        mode="single"
                        showSearch
                        className="form-select"
                        value={selectedReport || SelectKpi }
                        onChange={handleReportChange}
                      >
                        <Select.Option key="Transition Rate" value="Transition Rate">
                          Transition Rate
                        </Select.Option>
                        <Select.Option key="Teacher and School Resources" value="Teacher and School Resources">
                          Teacher and School Resources
                        </Select.Option>
                        <Select.Option key="Student Performance" value="Student Performance">
                          Student Performance
                        </Select.Option>
                        <Select.Option key="School Infrastructure" value="School Infrastructure">
                          School Infrastructure
                        </Select.Option>
                        <Select.Option key="Enrollment and Retention" value="Enrollment and Retention">
                          Enrollment and Retention
                        </Select.Option>
                      </Select>
                  </div>
                </div>



              </div>
            </div>
          </div>
        </div>
      </div>

    </section >
  )
}