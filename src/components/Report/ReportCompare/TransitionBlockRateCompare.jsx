import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectDistrict,
  selectState,
  setStates,
  selectBlock,
} from "../../../redux/slice/filterServicesComprisionSlice";
import {
  setselectedCompareDistricts,
  setselectedCompareOption,
  setUpdateReportType,
  setselectedCompareBlocks,
} from "../../../redux/slice/reportTypeSlice";
import aspirationalAbpData from "../../../aspirational-reports-data/aspirational.json";
import aspirationalAdpData from "../../../aspirational-reports-data/aspirationalDistrict.json";
import table from "../../../assets/images/table.svg";
import card from "../../../assets/images/card-list.svg";
import { Card, Select } from "antd";
import { SelectState } from "../../../constant/Constant";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import BlankPage from "../BlankPage";
import { ScrollToTopOnMount } from "../../../Scroll/ScrollToTopOnMount";
import { useTranslation } from "react-i18next";

const ArrowRenderer = ({ data }) => {
  const selectedOption = useSelector(
    (state) => state.reportAdpAbpType.selectedOption
  );
  const [arrowData, setArrowData] = useState(null);

  useEffect(() => {
    if (selectedOption === "upper_primary_to_secondary") {
      setArrowData(data?.upri_t);
    } else {
      setArrowData(data?.sec_t);
    }
  }, [selectedOption, data]);

  const renderArrow = () => {
    if (
      selectedOption === "upper_primary_to_secondary" &&
      arrowData >= 70 &&
      arrowData <= 100
    ) {
      return (
        <ArrowUpwardIcon
          style={{ color: "green", marginLeft: "5px", fontSize: "14px" }}
        />
      );
    } else if (
      selectedOption !== "upper_primary_to_secondary" &&
      arrowData >= 40 &&
      arrowData < 100
    ) {
      return (
        <ArrowUpwardIcon
          style={{ color: "green", marginLeft: "5px", fontSize: "14px" }}
        />
      );
    } else {
      return (
        <ArrowDownwardIcon
          style={{ color: "red", marginLeft: "5px", fontSize: "14px" }}
        />
      );
    }
  };

  return <span>{renderArrow()}</span>;
};
export default function TransitionBlockRateCompare() {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const [aspirationalData, setAspirationalData] = useState([]);
  const selectedOption = useSelector(
    (state) => state.reportAdpAbpType.selectedCompareOption
  );
  const selectedAdpAbpOption = useSelector(
    (state) => state.reportAdpAbpType.updateReportType
  );
  const MAX_BLOCKS = 5;
  const states = useSelector((state) => state.locationAdp.states);
  const districts = useSelector((state) => state.locationAdp.districts);
  const blocks = useSelector((state) => state.locationAdp.blocks);

  const selectedState = useSelector((state) => state.locationAdp.selectedState);
  const selectedDistricts = useSelector(
    (state) => state.reportAdpAbpType.selectedCompareDistricts
  );
  const selectedBlocks = useSelector(
    (state) => state.reportAdpAbpType.selectedCompareBlock
  );

  function resteData() {
    dispatch(selectState(SelectState));
    dispatch(setselectedCompareOption("upper_primary_to_secondary"));
  }
  useEffect(() => {
    resteData();
  }, [dispatch]);

  useEffect(() => {
    // dispatch(setUpdateReportType('ADP_Report'));
    setAspirationalData(aspirationalAdpData);
  }, [dispatch]);
  useEffect(() => {
    if (selectedAdpAbpOption === "ADP_Report") {
      setAspirationalData(aspirationalAdpData);
    } else {
      setAspirationalData(aspirationalAbpData);
    }
  }, [selectedAdpAbpOption]);
  // Initialize states and districts from JSON data
  useEffect(() => {
    const structuredData = aspirationalData.reduce((acc, curr) => {
      const stateIndex = acc.findIndex(
        (st) => st.lgd_state_id === curr?.lgd_state_id
      );
      if (stateIndex === -1) {
        acc.push({
          lgd_state_id: curr?.lgd_state_id,
          lgd_state_name: curr?.lgd_state_name,
          block: [
            {
              lgd_block_id: curr?.lgd_block_id,
              lgd_block_name: curr?.lgd_block_name,
              upri_b: curr?.upri_b,
              upri_g: curr?.upri_g,
              upri_t: curr?.upri_t,
              sec_b: curr?.sec_b,
              sec_g: curr?.sec_g,
              sec_t: curr?.sec_t,
            },
          ],
        });
      } else {
        const blockIndex = acc[stateIndex]?.blocks.findIndex(
          (blk) => blk.lgd_block_id === curr?.lgd_block_id
        );
        if (blockIndex === -1) {
          acc[stateIndex].blocks.push({
            lgd_block_id: curr?.lgd_block_id,
            lgd_block_name: curr?.lgd_block_name,
            upri_b: curr?.upri_b,
            upri_g: curr?.upri_g,
            upri_t: curr?.upri_t,
            sec_b: curr?.sec_b,
            sec_g: curr?.sec_g,
            sec_t: curr?.sec_t,
          });
        }
      }
      return acc;
    }, []);

    dispatch(setStates(structuredData));
  }, [dispatch]);

  //   suggestion      [dispatch, aspirationalData]

  // Handle state change
  const handleStateChange = (value) => {
    dispatch(selectState(value));
    dispatch(([]));
  };

  // Handle district change
  const handleBlockChange = (value, position) => {
    const newSelectedBlocks = [...selectedBlocks];
    const blockData = aspirationalData.find(
      (block) =>
        block?.lgd_block_name === value && block.lgd_state_name === selectedState
    );
    if (blockData) {
      newSelectedBlocks[position] = blockData;
      dispatch(
        setselectedCompareBlocks(newSelectedBlocks.slice(0, MAX_BLOCKS))
      );
      dispatch(selectBlock(value));
    }
  };

  // Get filtered districts based on selected state and existing selections
  const getFilteredBlocks = (position) => {
    const selected = selectedBlocks.filter(
      (block) =>
        block &&
        block?.lgd_block_name !== selectedBlocks[position]?.lgd_block_name
    );
    return blocks.filter(
      (block) =>
        !selected.map((d) => d?.lgd_block_name).includes(block?.lgd_block_name)
    );
  };

  // Handle option change
  const handleOptionChange = (event) => {
    dispatch(setselectedCompareOption(event.target.value));
  };
  return (
    <>
      <ScrollToTopOnMount />
      <div className="card-box">
        <div className="row align-items-end">
          <div className="col-md-7">
            <div className="d-flex align-items-end">
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
                <h3 className="heading-sm mt-2">
                  Comparison by Transition Rate
                </h3>
              </div>
            </div>
          </div>
          <div className="col-md-5">
            <div className="d-flex w-m-100">
              <div className="radio-button">
                <div className="box-radio">
                  <input
                    type="radio"
                    id="radio11"
                    value="upper_primary_to_secondary"
                    checked={selectedOption === "upper_primary_to_secondary"}
                    onChange={handleOptionChange}
                  />
                  <label htmlFor="radio11">{t('upperPrimaryToSecondary')}</label>
                </div>

                <div className="box-radio">
                  <input
                    type="radio"
                    id="radio22"
                    value="secondary_to_higher_secondary"
                    checked={selectedOption === "secondary_to_higher_secondary"}
                    onChange={handleOptionChange}
                  />
                  <label htmlFor="radio22">{t('secondaryToHigherSecondary')}</label>
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
                  <h5 className="sub-title">Select Block to Compare</h5>
                </div>
                <div className="col-md-6 Comparison-select-group">
                  <div className="d-flex justify-content-between text-aligns-center antd-select">
                    {[0, 1, 2, 3, 4].map((index) => (
                      <Select
                        className="form-select"
                        key={index+1}
                        onChange={(value) => handleBlockChange(value, index)}
                        style={{ width: "100%" }}
                        placeholder={`${t('addBlock')} ${index + 1}`}
                        mode="single"
                        showSearch
                        value={selectedBlocks[index]?.lgd_block_name || `${t('addBlock')}`}
                        disabled={!selectedState}
                      >
                        {getFilteredBlocks(index).map((block) => (
                          <Select.Option
                            key={block?.lgd_block_id}
                            value={block?.lgd_block_name}
                          >
                            {block?.lgd_block_name}
                          </Select.Option>
                        ))}
                      </Select>
                    ))}
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="tab-box float-end">
                    <button className="tab-button active">
                      <img src={card} alt="card" /> {t('cardView')}
                    </button>
                    <button className="tab-button">
                      <img src={table} alt="Table" /> {t('tableView')}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {selectedState !== SelectState ? (
            <div className="col-md-12 mt-4">
              <div className="row">
                {selectedBlocks.map((block, index) => (
                  <div
                    className={`col-sm-12 col-20 ${selectedBlocks.length === 1 ? "m-auto" : ""
                      }`}
                  >
                    {selectedBlocks.length === 1 ? (
                      <Card
                        style={{
                          width: 300,
                        }}
                      >
                        <b>
                         {t('selectOneMoreBlock')}
                        </b>
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
                                    className={`number-card card-color-${index + 1
                                      }`}
                                  >
                                    {index + 1}
                                  </div>
                                </div>
                                <div className="text-card">
                                  <p>Block</p>
                                  <h6 className="sub-title">
                                    {block?.lgd_block_name}
                                  </h6>
                                </div>
                              </div>
                              <div className="arrow-d">
                                {" "}
                                <ArrowRenderer data={block} />
                              </div>
                            </div>
                          </div>

                          <div className="lower-card">
                            <div className="text-card">
                              <p>Boys</p>
                              <h6 className="sub-title">
                                {selectedOption === "upper_primary_to_secondary"
                                  ? block?.upri_b
                                  : block?.sec_b}
                              </h6>
                            </div>
                            <div className="text-card">
                              <p>Girls</p>
                              <h6 className="sub-title">
                                {selectedOption === "upper_primary_to_secondary"
                                  ? block?.upri_g
                                  : block?.sec_g}
                              </h6>
                            </div>
                            <div className="text-card">
                              <p>Total</p>
                              <h6 className="sub-title">
                                {selectedOption === "upper_primary_to_secondary"
                                  ? block?.upri_t
                                  : block?.sec_t}
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
