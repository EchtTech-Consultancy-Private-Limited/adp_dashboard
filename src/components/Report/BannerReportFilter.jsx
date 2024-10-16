import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { selectBlock, selectDistrict, selectState, setBlocks, setDistricts, setStates } from '../../redux/slice/filterServicesSlice';
import { setLoading, setselectedCompareBlocks, setselectedCompareDistricts, setselectedReport, setSelectedYear, setUpdateReportType } from '../../redux/slice/reportTypeSlice';
import { Select } from 'antd';
import { AllDistrict, SelectBlock, SelectDistrict, SelectKpi, SelectState } from '../../constant/Constant';
import { useTranslation } from "react-i18next";

export default function BannerReportFilter() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const savedReportName = localStorage.getItem('selectedReportValue');
  const states = useSelector((state) => state.locationAdp.states);
  const districts = useSelector((state) => state.locationAdp.districts);
  const blocks = useSelector((state) => state.locationAdp.blocks);
  const selectedState = useSelector((state) => state.locationAdp.selectedState);
  const selectedDistrict = useSelector((state) => state.locationAdp.selectedDistrict);
  const selectedBlock = useSelector((state) => state.locationAdp.selectedBlock);
  const selectReportType = useSelector((state) => state.reportAdpAbpType.updateReportType);
  const selectedReport = useSelector((state) => state.reportAdpAbpType.selectedReport);
  const selectedYear = useSelector((state) => state.reportAdpAbpType.selectedYear);
  const [showBreadcomeAdpAbp, setShowBreadcomeAdpAbp] = useState();
  const aspirationalData = useSelector((state) => state.reportAdpAbpType.aspirationalAllData)
  const disableSelectedState = selectedState === "All State";
  const disableSelectedDistrict = selectedDistrict === SelectDistrict || selectedDistrict === AllDistrict;


  useEffect(() => {
    if (selectReportType === "ADP_Report") {
      setShowBreadcomeAdpAbp("ADP Report")
      //  resteData()

    }
    else {
      setShowBreadcomeAdpAbp("ABP Report")
      //  resteData()
    }
  }, [selectReportType, selectedYear]);



  useEffect(() => {
    const savedReportName = localStorage.getItem('selectedReportValue');
    if (savedReportName) {
      dispatch(setselectedReport(savedReportName));
    }
  }, [dispatch]);

  const handleReportChange = (value) => {
    // dispatch(setUpdateReportType('ADP_Report'));
    dispatch(setLoading(true));
    localStorage.setItem('selectedReport', value);
    dispatch(setselectedReport(value));
    switch (value) {
      case 'Transition Rate':
        navigate('/transition-rate');
        break;
      case 'Percentage of Elementary Schools Having PTR Less Than Equal to 30':
        navigate('/teacher-and-school-resources');
      //  navigate('/Percentage-of-elementary-schools-having-PTR-less-than-tqual-to-30');
        break;
      case 'Percentage Schools with Teachers Trained for Teaching CWSN':
        navigate('/teachers-trained-for-teaching-CWSN');
        break;
      case 'Percentage of Schools Having Adequate Functional Girls Toilets':
        navigate('/school-infrastructure');
        break;
      case 'Enrollment and Retention':
        navigate('/enrollment-retention');
        break;
      default:
        navigate('/');
    }
    setTimeout(()=>{
      dispatch(setLoading(false));
     },[150])
  };

  useEffect(() => {
    dispatch(setLoading(true));
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

      const updatedDistricts = structuredData.find(st => st.lgd_state_name === selectedState)?.districts || [];

      if (selectReportType === "ADP_Report") {
        dispatch(setDistricts(updatedDistricts));
        dispatch(selectBlock(SelectBlock));
      } else {
        const updatedBlocks = updatedDistricts.find(dist => dist.lgd_district_name === selectedDistrict)?.blocks || [];
        dispatch(setDistricts(updatedDistricts));
        dispatch(setBlocks(updatedBlocks));
      }
    }
    setTimeout(()=>{
      dispatch(setLoading(false));
     },[50])
  }, [aspirationalData, selectReportType, selectedState, selectedDistrict,selectedBlock, dispatch]);


  const handleOptionChange = (event) => {
    dispatch(selectDistrict(SelectDistrict));
    dispatch(selectBlock(SelectBlock));
    dispatch(setUpdateReportType(event.target.value));
    dispatch(setselectedCompareDistricts([]));
    dispatch(setselectedCompareBlocks([]))
  };

  const handleStateChange = (value) => {
    dispatch(selectState(value));
    dispatch(setselectedCompareDistricts([]));
    dispatch(setselectedCompareBlocks([]))
  };


  const handleDistrictChange = (value) => {
    dispatch(selectDistrict(value));
    dispatch(setselectedCompareBlocks([]));
  };

  const handleBlockChange = (value) => {
    dispatch(selectBlock(value));
  };

  const handleYearChange = (value) => {
    dispatch(setSelectedYear(value));
    // dispatch(selectState("All State"));
    // dispatch(setselectedCompareDistricts([]));
    // dispatch(setselectedCompareBlocks([]))
  };

  return (
    <section className='internal-banner-bg'>
      <div className="container">
        <div className="content-box">
          <div className="row align-items-center">
            <div className="col-md-3">
              <div className='main-title'>{t('reports')} </div>
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
                        checked={selectReportType === "ADP_Report"}
                        onChange={handleOptionChange} />
                      <label htmlFor="radio1">ADP Report</label>
                    </div>
                    <div className="box-radio">
                      <input type="radio"
                        value="ABP_Report"
                        id="radio2"
                        checked={selectReportType === "ABP_Report"}
                        onChange={handleOptionChange} />
                      <label htmlFor="radio2">ABP Report</label>
                    </div>
                  </div>
                </div>
                <div className="col-md-9">
                  <div className="d-flex justify-content-between text-aligns-center antd-select">
                    {selectReportType === "ADP_Report" ?
                      (<Select
                        onChange={handleYearChange}
                        style={{ width: "100%" }}
                        placeholder="Academic Year"
                        mode="single"
                        showSearch
                        className="form-select"
                        value={selectedYear}
                      >
                        {["2022-23", "2021-22", "2020-21"].map((year, index) => (
                          <Select.Option key={index} value={year}>
                            {year.replace("-", " - ")}
                          </Select.Option>
                        ))}
                      </Select>) : (<Select
                        onChange={handleYearChange}
                        style={{ width: "100%" }}
                        placeholder="Academic Year"
                        mode="single"
                        showSearch
                        className="form-select"
                        value={selectedYear}
                      >
                        {["2022-23", "2021-22", "2020-21", "2019-20"].map((year, index) => (
                          <Select.Option key={index} value={year}>
                            {year.replace("-", " - ")}
                          </Select.Option>
                        ))}
                      </Select>)
                    }



                    {/* State select option */}
                    <Select onChange={handleStateChange} style={{ width: "100%" }} placeholder="All State" mode="single" showSearch value={selectedState || "All State"} className="form-select">
                      <Select.Option key="All State" value={SelectState}>All State</Select.Option>
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
                    {selectReportType === "ADP_Report" ? "" :
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
                      <Select.Option key="Teacher and School Resources" value="Percentage of Elementary Schools Having PTR Less Than Equal to 30">Percentage of Elementary Schools Having PTR Less Than Equal to 30</Select.Option>
                      <Select.Option key="Teachers Trained For Teaching CWSN" value="Percentage Schools with Teachers Trained for Teaching CWSN">Percentage Schools with Teachers Trained for Teaching CWSN</Select.Option>
                      <Select.Option key="School Infrastructure" value="Percentage of Schools Having Adequate Functional Girls Toilets">Percentage of Schools Having Adequate Functional Girls Toilets</Select.Option>
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
