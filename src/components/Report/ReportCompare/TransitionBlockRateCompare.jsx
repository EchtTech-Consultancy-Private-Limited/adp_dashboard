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
  setAspirationalAllData,
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
import { ArrowRenderer } from "../ArrowRenderer/ArrowRenderer.jsx"
import Highcharts, { color } from "highcharts";
import HighchartsReact from "highcharts-react-official";
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import '../graph/graph.scss';
export default function TransitionBlockRateCompare() {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();

  const aspirationalData = useSelector((state) => state.reportAdpAbpType.aspirationalAllData)
  const selectedOption = useSelector(
    (state) => state.reportAdpAbpType.selectedCompareOption
  );
  const selectedAdpAbpOption = useSelector(
    (state) => state.reportAdpAbpType.updateReportType
  );
  const isActiveGraph = useSelector((state) => state.reportAdpAbpType.isActiveGraph)
  console.log(isActiveGraph, "isActiveGraph")
  const MAX_BLOCKS = 5;
  const states = useSelector((state) => state.locationAdp.states);
  const districts = useSelector((state) => state.locationAdp.districts);
  const blocks = useSelector((state) => state.locationAdp.blocks);
  const selectedYear = useSelector(
    (state) => state.reportAdpAbpType?.selectedYear
  );
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
        const blockIndex = acc[stateIndex]?.blocks?.findIndex(
          (blk) => blk.lgd_block_id === curr?.lgd_block_id
        );
        if (blockIndex === -1) {
          acc[stateIndex]?.blocks.push({
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

  console.log("selectBlock=====>",selectedBlocks)


  const boysData = selectedBlocks.map(block =>
    selectedOption === 'upper_primary_to_secondary' ? block.upri_b : block.sec_b
  );

  const girlsData = selectedBlocks.map(block =>
    selectedOption === 'secondary_to_higher_secondary' ? block.sec_g: block.upri_g 
  );

const Total_boys_girls=selectedBlocks.map(block =>
  selectedOption === 'upper_primary_to_secondary' ? block.upri_t : block.sec_t);



  return (
    <>
      <ScrollToTopOnMount />
      {!isActiveGraph ? (<div className="card-box">
        <div className="row align-items-end">
          <div className="col-md-5">
            <div className="d-flex align-items-center">
              <div className="title-box">
  
                <h3 className="heading-sm">
                  {t('comparisonByTransitionRate')}
                </h3>
              </div>
            </div>
          </div>
          <div className="col-md-7">
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
      </div>) : (<div className="col-md-12 graph-box">
                <div className="impact-box-content-education bg-light-blue tab-sdb-blue graph-card text-left">
                    <div className="text-btn-d d-flex justify-content-between align-items-center">
                        <h2 className="heading-sm">
                            Comparison of States By Transition Rate
                        </h2>

                        <div className="select-infra button-group-filter">
                            <select id="export_data" className="form-select bg-grey2" defaultValue={"upper_primary_to_secondary"}
                               value={selectedOption}
                               onChange={handleOptionChange}
                            >
                                <option value="upper_primary_to_secondary">Upper Primary to Secondary </option>
                                <option value="secondary_to_higher_secondary">Secondary to Higher Secondary</option>
                            </select>
                        </div>

                    </div>

                    <div className="Comparison-box">
                        <div className="row align-items-center">
                            <div className="col-md-2 col-lg-2">
                                <h4 className="sub-heading text-left">Add Blocks to Compare</h4>
                            </div>
                            <div className="col-md-10 col-lg-10 pe-2">
                                <div className="select-infra Comparison-select-group">


                                {[...Array(MAX_BLOCKS)]?.map((_, index) => (
                      <div key={index}>
                        <Select
                          className="form-select bg-grey2"
                          onChange={(value) => handleBlockChange(value, index)}
                          style={{ width: "100%" }}
                          placeholder={`${t('addBlock')} ${index + 1}`}
                          mode="single"
                          showSearch
                          value={selectedBlocks[index]?.lgd_block_name || `${t('addBlock')}`}
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

                    <Tabs defaultActiveKey="State" id="top-tabs-st-dis-block">
                        <Tab eventKey="State" title="State">
                            <div className="piechart-box row align-items-center">
                               
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
                                          categories: selectedBlocks.map(district => district.lgd_block_name),
                                        },
                                        yAxis: {
                                            allowDecimals: false,
                                            min: 0,
                                            title: {
                                                text: "",
                                            },
                                        },
                                        title: {
                                            text: ""
                                        },
                                        tooltip: {
                                            headerFormat: "<b>{point.x}</b><br/>",
                                            pointFormat: "{series.name}: {point.y}",
                                            pointFormatter: function () {
                                                return `<span style="color:${this.color
                                                    }">\u25CF</span> ${this.series.name
                                                    }: <b>${this.y.toLocaleString(
                                                        "en-IN"
                                                    )}</b><br/>`;
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
                                        exports:{
                                            enabled: false,
                                        },
                                        series: [{
                                            color:"#17AFD2",
                                            name: 'Boys',
                                            // data: selectedDistricts.map(district => selectedOption === 'upper_primary_to_secondary' ? district.upri_b : district.sec_b),


                                            // data: selectedDistricts.map(district => district.upri_g),
                                            data:boysData
                                        }, {
                                            color:"#6C6CB0",
                                            name: 'Girls',

                                            // data: selectedDistricts.map(district => selectedOption === 'upper_primary_to_secondary' ? district.upri_b : district.sec_b),

                                            // data: selectedDistricts.map(district => district.upri_b),
                                            data:girlsData

                                        }, 
                                        {
                                            color:"#FFB74BF0",
                                            name: 'Total',
                                            data: Total_boys_girls,
                                        }
                                      
                                      
                                      ]
                                    }}
                                    immutable={true}
                                />
                            </div>
                        </Tab>
                        <Tab eventKey="District" title="District">
                            <div className="piechart-box row mt-4 align-items-center">

                            </div>
                        </Tab>
                        <Tab eventKey="Block" title="Block">
                            <div className="piechart-box row mt-4 align-items-center">

                            </div>
                        </Tab>
                    </Tabs>
                </div>

            </div>)}
      
    </>
  );
}
