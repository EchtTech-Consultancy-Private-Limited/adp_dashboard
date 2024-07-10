import React, { useState, useEffect } from 'react'
import Header from '../Header/Header'
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { selectBlock, selectDistrict, selectState, setStates } from '../../redux/slice/filterServicesSlice';
import { setUpdateReportType } from '../../redux/slice/reportTypeSlice';
import aspirationalAbpData from "../../aspirational-reports-data/aspirational.json";
import aspirationalAdpData from "../../aspirational-reports-data/aspirationalDistrict.json";
import { Select } from 'antd';

export default function BannerReportFilter() {

  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate()

  const stateMap = useSelector((state) => state.locationAdp.districts);
  const states = useSelector((state) => state.locationAdp.states);
  const districts = useSelector((state) => state.locationAdp.districts);
  const blocks = useSelector((state) => state.locationAdp.blocks);
  const selectedState = useSelector((state) => state.locationAdp.selectedState);
  const [aspirationalData, setAspirationalData] = useState([])
  const selectedDistrict = useSelector(
    (state) => state.locationAdp.selectedDistrict
  );

  const selectedBlock = useSelector((state) => state.locationAdp.selectedBlock);
  const headerData = useSelector((state) => state.header);
  const disableSelectedState =
    selectedState === "Select State" ||
    selectedState === "All India/National";
  const disableSelectedDistrict =
    selectedDistrict === "District" || selectedDistrict === "All District";
  const [is3016btnDisabled, setIs3016btnDisabled] = useState(true);

  const selectedOption = useSelector((state) => state.reportAdpAbpType.updateReportType)
  const [selectedReport, setSelectedReport] = useState(null);


  const handleReportChange = (value) => {
    setSelectedReport(value);
    localStorage.setItem('selectedReport', value);
    switch (value) {
      case 'Transition Rate':
        navigate('/aspirational-reports-4001');
        break;
      case 'Teacher and School Resources':
        navigate('/aspirational-reports-4002');
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
    dispatch(setUpdateReportType('ADP_Report'));
  }, [dispatch]);
  useEffect(() => {
    if (selectedOption === "ADP_Report") {
      setAspirationalData(aspirationalAdpData)
    }
    else {
      setAspirationalData(aspirationalAbpData)
    }
  }, [selectedOption])
  console.log(aspirationalData, "aspirationalData")
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

  const handleStateChange = (value) => {
    dispatch(selectState(value));
  };

  const handleDistrictChange = (value) => {
    dispatch(selectDistrict(value));
  };

  const handleBlockChange = (value) => {
    dispatch(selectBlock(value));
  };





  const handleOptionChange = (event) => {
    dispatch(setUpdateReportType(event.target.value));
  };
  return (
    <section className='internal-banner-bg'>      
        <div className="container">
          <Header />
          <div className="content-box">
            <div className="row align-items-center">
              <div className="col-md-3">
                <div className='main-title'>Reports </div>
                <div className="brudcrumb-text">Home / <span>Report</span></div>
              </div>
              <div className="col-md-9">
                <div className="row select-infra Comparison-select-group">
                  <div className="col-md-4">
                    <div className="radio-button">
                      <div className="box-radio">
                        <input type="radio"
                          value="ADP_Report"
                          checked={selectedOption === "ADP_Report"}
                          onChange={handleOptionChange} />
                        <label htmlFor="radio1">ADP Report</label>
                      </div>

                      <div className="box-radio">
                        <input type="radio"
                          value="ABP_Report"
                          checked={selectedOption === "ABP_Report"}
                          onChange={handleOptionChange} />
                        <label htmlFor="radio2">ABP Report</label>
                      </div>

                    </div>

                  </div>

                  <div className="col-md-8">
                    <div className="d-flex justify-content-between text-aligns-center antd-select">

                      <Select onChange={handleStateChange} style={{ width: "100%" }} placeholder="Select State" mode="single" showSearch
                        value={selectedState || "Select State"} className="form-select">
                        <Select.Option key="Select State" value={"Select State"}>
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

                      <Select onChange={handleStateChange} style={{ width: "100%" }} placeholder="Select State" mode="single" showSearch
                        value={selectedState || "Select State"} className="form-select">
                        <Select.Option key="Select State" value={"Select State"}>
                          Select District
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

                      <Select onChange={handleStateChange} style={{ width: "100%" }} placeholder="Select State" mode="single" showSearch
                        value={selectedState || "Select State"} className="form-select">
                        <Select.Option key="Select State" value={"Select State"}>
                          Select KPI
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
