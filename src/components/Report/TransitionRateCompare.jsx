
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectDistrict, selectState, setStates } from "../../redux/slice/filterServicesComprisionSlice";
import { setselectedCompareOption, setUpdateReportType } from "../../redux/slice/reportTypeSlice";
import aspirationalAbpData from "../../aspirational-reports-data/aspirational.json";
import aspirationalAdpData from "../../aspirational-reports-data/aspirationalDistrict.json";
import table from '../../assets/images/table.svg'
import card from '../../assets/images/card-list.svg'
import { Card, Select } from 'antd';
import { SelectState } from "../../constant/Constant";
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import BlankPage from "./BlankPage";
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
export default function TransitionRateCompare() {

    const dispatch = useDispatch();
    const [selectedDistricts, setSelectedDistricts] = useState([]);
    const selectedOption = useSelector((state) => state.reportAdpAbpType.selectedCompareOption)
    const MAX_DISTRICTS = 5;
    const states = useSelector((state) => state.comprisionAdp.states);
    const districts = useSelector((state) => state.comprisionAdp.districts);
    const selectedState = useSelector((state) => state.comprisionAdp.selectedState);
    function resteData() {
        dispatch(selectState(SelectState));
        dispatch(setselectedCompareOption("upper_primary_to_secondary"));
    }
    useEffect(() => {
        resteData()
    }, [dispatch]);
    // Initialize states and districts from JSON data
    useEffect(() => {
        const structuredData = aspirationalAdpData.reduce((acc, curr) => {
            const stateIndex = acc.findIndex(
                (st) => st.lgd_state_id === curr.lgd_state_id
            );
            if (stateIndex === -1) {
                acc.push({
                    lgd_state_id: curr.lgd_state_id,
                    lgd_state_name: curr.lgd_state_name,
                    districts: [
                        {
                            lgd_district_id: curr.lgd_district_id,
                            lgd_district_name: curr.lgd_district_name,
                            upri_b: curr.upri_b,
                            upri_g: curr.upri_g,
                            upri_t: curr.upri_t,
                            sec_b: curr.sec_b,
                            sec_g: curr.sec_g,
                            sec_t: curr.sec_t,
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
                        upri_b: curr.upri_b,
                        upri_g: curr.upri_g,
                        upri_t: curr.upri_t,
                        sec_b: curr.sec_b,
                        sec_g: curr.sec_g,
                        sec_t: curr.sec_t,
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
        setSelectedDistricts([]);
    };

    // Handle district change
    const handleDistrictChange = (value, position) => {
        const newSelectedDistricts = [...selectedDistricts];
        const districtData = aspirationalAdpData.find(
            (district) =>
                district.lgd_district_name === value &&
                district.lgd_state_name === selectedState
        );
        if (districtData) {
            newSelectedDistricts[position] = districtData;
            setSelectedDistricts(newSelectedDistricts.slice(0, MAX_DISTRICTS));
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

    // Handle option change
    const handleOptionChange = (event) => {
        dispatch(setselectedCompareOption(event.target.value));
    };
    return (
        <>
            <div className="card-box">
                <div className="row align-items-end">
                    <div className="col-md-7">
                        <div className="d-flex align-items-end">
                            <div className="title-box">
                                <h5 className='sub-title'>State :
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
                                </h5>
                                <h3 className='heading-sm mt-2'>Comparison by Transition Rate</h3>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-5">
                        <div className="d-flex w-m-100">
                            <div className="radio-button">
                                <div className="box-radio">
                                    <input type="radio"
                                        id="radio11"
                                        value="upper_primary_to_secondary"
                                        checked={selectedOption === "upper_primary_to_secondary"}
                                        onChange={handleOptionChange} />
                                    <label htmlFor="radio11">Upper Primary to Secondary  </label>
                                </div>

                                <div className="box-radio">
                                    <input type="radio"
                                        id="radio22"
                                        value="secondary_to_higher_secondary"
                                        checked={selectedOption === "secondary_to_higher_secondary"}
                                        onChange={handleOptionChange} />
                                    <label htmlFor="radio22">Secondary to Higher Secondary</label>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                <div className="row">
                    <div className="col-md-12">
                        <div className="comparison-box">
                            <div className="row align-items-center">
                                <div className="col-md-3">
                                    <h5 className='sub-title'>
                                        Select District to Compare
                                    </h5>
                                </div>
                                <div className="col-md-6 Comparison-select-group">
                                    <div className="d-flex justify-content-between text-aligns-center antd-select">

                                        {[0, 1, 2, 3, 4].map((index) => (
                                            <Select
                                                className="form-select"
                                                key={index}
                                                onChange={(value) =>
                                                    handleDistrictChange(value, index)
                                                }
                                                style={{ width: "100%" }}
                                                placeholder={`Add District ${index + 1}`}
                                                mode="single"
                                                showSearch
                                                value={
                                                    selectedDistricts[index]?.lgd_district_name ||
                                                    `Add District`
                                                }
                                                disabled={!selectedState}
                                            >
                                                {getFilteredDistricts(index).map((district) => (
                                                    <Select.Option
                                                        key={district.lgd_district_id}
                                                        value={district.lgd_district_name}
                                                    >
                                                        {district.lgd_district_name}
                                                    </Select.Option>
                                                ))}
                                            </Select>
                                        ))}

                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <div className="tab-box float-end">
                                        <button className='tab-button active'><img src={card} alt="card" /> Card View</button>
                                        <button className='tab-button'><img src={table} alt="Table" /> Table View</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {selectedState !== SelectState ? (<div className="col-md-12 mt-4">
                        <div className="row">
                            {selectedDistricts.map((district, index) => (
                                <div className={`col-sm-12 col-20 ${selectedDistricts.length === 1 ? "m-auto" : ""}`}>

                                    {selectedDistricts.length === 1 ? (<Card style={{
                                        width: 300,
                                    }}><b>Please select one more district for comparison to enhance the analysis.</b></Card>) : <> <div className="comp-card" key={index}>
                                        <div className="upper-card">
                                            <div className="d-flex align-items-center justify-content-between w-100">
                                                <div className="d-flex">
                                                    <div>
                                                        <div className={`number-card card-color-${index + 1}`} >
                                                            {index + 1}
                                                        </div>
                                                    </div>
                                                    <div className="text-card">
                                                        <p>District</p>
                                                        <h6 className='sub-title'>
                                                            {district.lgd_district_name}
                                                        </h6>

                                                    </div>
                                                </div>
                                                <div className="arrow-d"> <ArrowRenderer data={district} /></div>
                                            </div>
                                        </div>

                                        <div className="lower-card">
                                            <div className="text-card">
                                                <p>Boys</p>
                                                <h6 className='sub-title'>
                                                    {selectedOption === "upper_primary_to_secondary" ? district.upri_b : district.sec_b}
                                                </h6>
                                            </div>
                                            <div className="text-card">
                                                <p>Girls</p>
                                                <h6 className='sub-title'>
                                                    {selectedOption === "upper_primary_to_secondary" ? district.upri_g : district.sec_g}
                                                </h6>
                                            </div>
                                            <div className="text-card">
                                                <p>Total</p>
                                                <h6 className='sub-title'>
                                                    {selectedOption === "upper_primary_to_secondary" ? district.upri_t : district.sec_t}
                                                </h6>
                                            </div>
                                        </div>
                                    </div></>}


                                </div>
                            ))}

                        </div>
                    </div>) : <BlankPage />}
                </div>
            </div>
        </>
    )
}