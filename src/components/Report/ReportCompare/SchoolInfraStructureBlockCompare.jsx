import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectState,
  setStates,
  selectBlock,
} from "../../../redux/slice/filterServicesComprisionSlice";
import {
  setselectedCompareOption,
  setselectedCompareBlocks,
  setAspirationalAllData,
} from "../../../redux/slice/reportTypeSlice";
import aspirationalAbpData from "../../../aspirational-reports-data/aspirational.json";
import aspirationalAdpData from "../../../aspirational-reports-data/aspirationalDistrict.json";
import table from "../../../assets/images/table.svg";
import card from "../../../assets/images/card-list.svg";
import { Card, Select } from "antd";
import { SelectState } from "../../../constant/Constant";
import BlankPage from "../BlankPage";
import { ScrollToTopOnMount } from "../../../Scroll/ScrollToTopOnMount";
import { useTranslation } from "react-i18next";
import { ArrowRenderer } from "../ArrowRenderer/ArrowRenderer.jsx"

export default function SchoolInfraStructureBlockCompare() {

  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const aspirationalData = useSelector((state) => state.reportAdpAbpType.aspirationalAllData)
  const selectedAdpAbpOption = useSelector(
    (state) => state.reportAdpAbpType.updateReportType
  );
  const MAX_BLOCKS = 5;
  const blocks = useSelector((state) => state.locationAdp.blocks);
  const selectedYear = useSelector(
    (state) => state.reportAdpAbpType?.selectedYear
  );
  const selectedState = useSelector((state) => state.locationAdp.selectedState);
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
    dispatch(setAspirationalAllData(aspirationalAdpData));
  }, [dispatch]);
  useEffect(() => {
    if (selectedAdpAbpOption === "ADP_Report") {
      dispatch(setAspirationalAllData(aspirationalAdpData));
    } else {
      dispatch(setAspirationalAllData(aspirationalAbpData));
    }
  }, [selectedAdpAbpOption]);
  // Initialize states and districts from JSON data
  useEffect(() => {
    const structuredData = aspirationalData.reduce((acc, curr) => {
      const stateIndex = acc?.findIndex(
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
              tot_school_girl_co_ed: curr?.tot_school_girl_co_ed,
              total_no_of_fun_girls_toilet: curr?.total_no_of_fun_girls_toilet,
              functional_toilet_girls_percent:
                curr?.functional_toilet_girls_percent,
              toilet_40: curr?.toilet_40,
              sch_having_toilet_40_percent: curr?.sch_having_toilet_40_percent,
            },
          ],
        });
      } else {
        const blockIndex = acc[stateIndex].blocks?.findIndex(
          (blk) => blk.lgd_block_id === curr?.lgd_block_id
        );
        if (blockIndex === -1) {
          acc[stateIndex].blocks.push({
            lgd_block_id: curr?.lgd_block_id,
            lgd_block_name: curr?.lgd_block_name,
            tot_school_girl_co_ed: curr?.tot_school_girl_co_ed,
            total_no_of_fun_girls_toilet: curr?.total_no_of_fun_girls_toilet,
            functional_toilet_girls_percent:
              curr?.functional_toilet_girls_percent,
            toilet_40: curr?.toilet_40,
            sch_having_toilet_40_percent: curr?.sch_having_toilet_40_percent,
          });
        }
      }
      return acc;
    }, []);

    dispatch(setStates(structuredData));
    const updatedSelectedBlocks = selectedBlocks.map((selectedBlock) => {
      return aspirationalData.find(
        (block) => block.lgd_block_id === selectedBlock.lgd_block_id
      ) || selectedBlock;
    });

    dispatch(setselectedCompareBlocks(updatedSelectedBlocks));
  }, [dispatch, aspirationalData, selectedYear]);
  // Handle district change
  const handleBlockChange = (value, position) => {
    const newSelectedBlocks = [...selectedBlocks];
    const blockData = aspirationalData.find(
      (block) =>
        block.lgd_block_name === value && block.lgd_state_name === selectedState
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
        block.lgd_block_name !== selectedBlocks[position]?.lgd_block_name
    );
    return blocks.filter(
      (block) =>
        !selected.map((d) => d.lgd_block_name).includes(block.lgd_block_name)
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
                  {t('comparison By Percentange of Schools having adequate Functional Girls Toilets')}
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
                  <h5 className="sub-title">{t('selectBlockToCompare')}</h5>
                </div>
                <div className="col-md-6 Comparison-select-group order_3">
                  <div className="d-flex justify-content-between text-aligns-center antd-select">
                    {[...Array(MAX_BLOCKS)].map((_, index) => (
                      <div key={index}>
                        <Select
                          className="form-select"
                          onChange={(value) =>
                            handleBlockChange(value, index)
                          }
                          style={{ width: "100%" }}
                          placeholder={`${t("addBlock")} ${index + 1}`}
                          mode="single"
                          showSearch
                          value={
                            selectedBlocks[index]?.lgd_block_name ||
                            `${t("addBlock")}`
                          }
                          disabled={!selectedState || (index > 0 && !selectedBlocks[index - 1])}
                        >
                          {getFilteredBlocks(index)?.map((block) => (
                            <Select.Option
                              key={block.lgd_block_id}
                              value={block.lgd_block_name}
                            >
                              {block.lgd_block_name}
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
                {selectedBlocks && selectedBlocks?.map((block, index) => (
                  <div
                    className={`col-sm-12 col-20 col-50-d ${selectedBlocks.length === 1 ? "m-auto" : ""
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
                              <p>Tot Coed & Girls Sch</p>
                              <h6 className="sub-title">
                                {block?.tot_school_girl_co_ed}
                              </h6>
                            </div>
                            <div className="text-card">
                              <p>Tot Sch Fun girls toilets</p>
                              <h6 className="sub-title">
                                {block?.total_no_of_fun_girls_toilet}
                              </h6>
                            </div>
                            <div className="text-card">
                              <p>Per Sch Fun girls toilets</p>
                              <h6 className="sub-title">
                                {block?.functional_toilet_girls_percent?.toFixed(
                                  2
                                )}
                              </h6>
                            </div>

                            <div className="text-card">
                              <p>Tot Sch Fun girls toilets 40:1</p>
                              <h6 className="sub-title">{block?.toilet_40}</h6>
                            </div>
                            <div className="text-card">
                              <p>percentage of Schools having girls toilets in the ratio of 40:1</p>
                              <h6 className="sub-title">
                                {block?.sch_having_toilet_40_percent?.toFixed(
                                  2
                                )}
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
