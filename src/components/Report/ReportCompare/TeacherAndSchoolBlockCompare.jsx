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
import Highcharts, { color } from "highcharts";

import HighchartsReact from "highcharts-react-official";


export default function TeacherAndSchoolBlockCompare() {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const aspirationalData = useSelector((state) => state.reportAdpAbpType.aspirationalAllData)

  const selectedOption = useSelector(
    (state) => state.reportAdpAbpType.selectedCompareOption
  );
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

  const isActiveGraph = useSelector((state) => state.reportAdpAbpType.isActiveGraph)


  function resteData() {
    dispatch(selectState(SelectState));
    dispatch(setselectedCompareOption("upper_primary_to_secondary"));
  }
  useEffect(() => {
    resteData();
  }, [dispatch]);

  // useEffect(() => {
  //   // dispatch(setUpdateReportType('ADP_Report'));
  //   dispatch(setAspirationalAllData(aspirationalAdpData));
  // }, [dispatch]);
  // useEffect(() => {
  //   if (selectedAdpAbpOption === "ADP_Report") {
  //     dispatch(setAspirationalAllData(aspirationalAdpData));
  //   } else {
  //     dispatch(setAspirationalAllData(aspirationalAbpData));
  //   }
  // }, [selectedAdpAbpOption]);
  // Initialize states and districts from JSON data
  useEffect(() => {
    const structuredData = aspirationalData?.reduce((acc, curr) => {
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
              u_ptr: curr?.u_ptr,
              total_sch_ele: curr?.total_sch_ele,
              ele_sch_percent: curr?.ele_sch_percent,
            },
          ],
        });
      } else {
        const blockIndex = acc[stateIndex]?.blocks?.findIndex(
          (blk) => blk.lgd_block_id === curr?.lgd_block_id
        );
        if (blockIndex === -1) {
          acc[stateIndex]?.blocks.push({
            lgd_block_id: curr?.lgd_block_id,
            lgd_block_name: curr?.lgd_block_name,
            u_ptr: curr?.u_ptr,
            total_sch_ele: curr?.total_sch_ele,
            ele_sch_percent: curr?.ele_sch_percent,
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

  //   suggestion      [dispatch, aspirationalData]

  // Handle state change
  const handleStateChange = (value) => {
    dispatch(selectState(value));
    dispatch(setselectedCompareBlocks([]));
  };

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



            
  const totalU_ptr = selectedBlocks?.map(block => block?.u_ptr);

  const totalSchEle = selectedBlocks?.map(block => block?.total_sch_ele);

  const totalEleSchPercent = selectedBlocks?.map(block => block?.ele_sch_percent);




  // Handle option change
  const handleOptionChange = (event) => {
    dispatch(setselectedCompareOption(event.target.value));
  };









  return (
    <>
      <ScrollToTopOnMount />
      {!isActiveGraph ? (   <div className="card-box">
        <div className="row align-items-end">
          <div className="col-md-12">
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
                <h3 className="heading-sm mt-2">
                  {t("comparisonByTeacherAndSchoolResources")}
                </h3>
              </div>
            </div>  
          </div>
          
        </div>

        <div className="row">
          <div className="col-md-12">
            <div className="comparison-box">
              <div className="row align-items-center">
                <div className="col-md-3 order_1">
                  <h5 className="sub-title">{t("selectBlockToCompare")}</h5>
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
                          disabled={
                            !selectedState ||
                            (index > 0 && !selectedBlocks[index - 1])
                          }
                        >
                          {getFilteredBlocks(index).map((block) => (
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
                    className={`col-sm-12 col-20 ${selectedBlocks.length === 1 ? "m-auto" : ""
                      }`}
                  >
                    {selectedBlocks.length === 1 ? (
                      <Card
                        style={{
                          width: 300,
                        }}
                      >
                        <b>{t("selectOneMoreBlock")}</b>
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
                                    {block.lgd_block_name}
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
                              <p>{`PTR < 30`}</p>
                              <h6 className="sub-title">{block?.u_ptr}</h6>
                            </div>
                            <div className="text-card">
                              <p>Elementry School</p>
                              <h6 className="sub-title">
                                {block?.total_sch_ele}
                              </h6>
                            </div>
                            <div className="text-card">
                              <p>{`% PTR < 30`}</p>
                              <h6 className="sub-title">
                                {block?.ele_sch_percent?.toFixed(2)}
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
      </div>)
      :(



        <div className="col-md-12 graph-box">
        <div className="impact-box-content-education bg-light-blue tab-sdb-blue graph-card text-left">
          <div className="text-btn-d d-flex justify-content-between align-items-center">
            <h2 className="heading-sm">

            Comparison By  Elementary Schools with PTR ≤ 30%


            {/* {t("comparisonByTransitionRate")} */}
            </h2>

            {/* <div className="select-infra button-group-filter">
              <select
                id="export_data"
                className="form-select bg-grey2"
                defaultValue={"upper_primary_to_secondary"}
                value={selectedOption}
                onChange={handleOptionChange}
              >
                <option value="upper_primary_to_secondary">
                {t("upperPrimaryToSecondary")}
                </option>
                <option value="secondary_to_higher_secondary">
                {t("secondaryToHigherSecondary")}
                </option>
              </select>
            </div> */}
          </div>

          <div className="Comparison-box">
            <div className="row align-items-center">
              <div className="col-md-2 col-lg-2">
                <h4 className="sub-heading text-left">
                       {t('add_block_to_compare')}
                </h4>
              </div>
              <div className="col-md-10 col-lg-10 pe-2">
                <div className="select-infra Comparison-select-group">
                  {[...Array(MAX_BLOCKS)]?.map((_, index) => (
                    <div key={index} className="width-20">
                      <Select
                        className="form-select bg-grey2"
                        onChange={(value) => handleBlockChange(value, index)}
                        style={{ width: "100%" }}
                        placeholder={`${t("addBlock")} ${index + 1}`}
                        mode="single"
                        showSearch
                        value={
                          selectedBlocks[index]?.lgd_block_name ||
                          `${t("addBlock")}`
                        }
                        disabled={index > 0 && !selectedBlocks[index - 1]}
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
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {selectedBlocks.length === 1 ? (
            <Card
              style={{
                width: 300,
                margin: "20px auto 0",
              }}
            >
              <b>{t("selectOneMoreBlock")}</b>
            </Card>
          ) : (
            <div className="row align-items-center">
              <HighchartsReact
                highcharts={Highcharts}
                options={{
                  chart: {
                    type: "column",
                    marginTop: 80,
                    events: {
                      beforePrint: function () {
                        this.exportSVGElements[0].box.hide();
                        this.exportSVGElements[1].hide();
                      },
                      afterPrint: function () {
                        this.exportSVGElements[0].box.show();
                        this.exportSVGElements[1].show();
                      },
                    },
                  },
                  xAxis: {
                    categories: selectedBlocks.map(
                      (district) => district.lgd_block_name
                    ),
                  },
                  yAxis: {
                    allowDecimals: false,
                    min: 0,
                    title: {
                      text: "",
                    },
                  },
                  title: {
                    text: "",
                  },
                  tooltip: {
                    headerFormat: "<b>{point.x}</b><br/>",
                    pointFormat: "{series.name}: {point.y}",
                    pointFormatter: function () {
                      return `<span style="color:${this.color
                        }">\u25CF</span> ${this.series.name
                        }: <b>${this.y.toLocaleString("en-IN")}</b><br/>`;
                    },
                  },
                  plotOptions: {
                    column: {
                      stacking: "normal",
                      dataLabels: {
                        enabled: true,
                        crop: false,
                        overflow: "none",
                        rotation: 0,
                        align: "center",
                        x: -2,
                        y: -5,
                        style: {
                          font: "13px Arial, sans-serif",
                          fontWeight: "600",
                          stroke: "transparent",
                          align: "center",
                        },
                        position: "top",
                        formatter: function () {
                          // return parseFloat(
                          //   this.y
                          // ).toFixed(0);
                          return this.y.toLocaleString("en-IN");
                        },
                      },
                    },
                  },
                  legend: {
                    layout: "horizontal",
                    align: "center",
                    verticalAlign: "bottom",
                    itemMarginTop: 10,
                    itemMarginBottom: 10,
                  },
                  credits: {
                    enabled: false,
                  },
                  exports: {
                    enabled: false,
                  },
                  series: [
                    {
                      color: "#FFB74BF0",

                      name: t('PTR < 30'),
                      data: totalU_ptr,
                      maxPointWidth: 50,

                    },
                    {
                      color: "#6C6CB0",
                      name: t('Elementry School'),
                      data: totalSchEle,
                      maxPointWidth: 50,

                    },
                    {
                      color: "#17AFD2",
                      name: t('% PTR < 30'),
                      data: totalEleSchPercent,
                      maxPointWidth: 50,

                    },
                  ],
                }}
                immutable={true}
              />
            </div>
          )}
        </div>
      </div>



        
      )}
    </>
  );
}
