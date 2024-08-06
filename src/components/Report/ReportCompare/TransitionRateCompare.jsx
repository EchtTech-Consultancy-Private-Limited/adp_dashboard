import React, { useState, useEffect } from "react";
import "../graph/graph.scss";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

import { useDispatch, useSelector } from "react-redux";
import {
  selectDistrict,
  selectState,
  setStates,
} from "../../../redux/slice/filterServicesComprisionSlice";
import {
  setAspirationalAllData,
  setselectedCompareDistricts,
  setselectedCompareOption,
  setUpdateReportType,
} from "../../../redux/slice/reportTypeSlice";
import table from "../../../assets/images/table.svg";
import card from "../../../assets/images/card-list.svg";
import { Card, Select } from "antd";
import { SelectState } from "../../../constant/Constant";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import BlankPage from "../BlankPage";
import { useTranslation } from "react-i18next";
import { ArrowRenderer } from "../ArrowRenderer/ArrowRenderer";

export default function TransitionRateCompare() {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();

  const aspirationalData = useSelector(
    (state) => state.reportAdpAbpType.aspirationalAllData
  );
  const selectedOption = useSelector(
    (state) => state.reportAdpAbpType.selectedCompareOption
  );
  const selectedAdpAbpOption = useSelector(
    (state) => state.reportAdpAbpType.updateReportType
  );
  const isActiveGraph = useSelector(
    (state) => state.reportAdpAbpType.isActiveGraph
  );
  const MAX_DISTRICTS = 5;
  const states = useSelector((state) => state.locationAdp?.states);
  const districts = useSelector((state) => state.locationAdp?.districts);
  const selectedState = useSelector(
    (state) => state.locationAdp?.selectedState
  );

  const selectedDistricts = useSelector(
    (state) => state.reportAdpAbpType.selectedCompareDistricts
  );

  const selectedYear = useSelector(
    (state) => state.reportAdpAbpType?.selectedYear
  );

  const selectReportType = useSelector(
    (state) => state.reportAdpAbpType.updateReportType
  );

  const [errorMessages, setErrorMessages] = useState(
    new Array(MAX_DISTRICTS).fill("")
  );
  function resteData() {
    dispatch(selectState(SelectState));
    dispatch(setselectedCompareOption("upper_primary_to_secondary"));
  }
  useEffect(() => {
    resteData();
  }, [dispatch]);

  // useEffect(() => {
  //   dispatch(setAspirationalAllData(yearWiseData));
  // }, [dispatch,selectedYear,aspirationalData]);

  useEffect(() => {
    const structuredData = aspirationalData.reduce((acc, curr) => {
      const stateIndex = acc?.findIndex(
        (st) => st.lgd_state_id === curr?.lgd_state_id
      );
      if (stateIndex === -1) {
        acc.push({
          lgd_state_id: curr?.lgd_state_id,
          lgd_state_name: curr?.lgd_state_name,
          districts: [
            {
              lgd_district_id: curr?.lgd_district_id,
              lgd_district_name: curr?.lgd_district_name,
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
        const districtIndex = acc[stateIndex].districts?.findIndex(
          (dist) => dist.lgd_district_id === curr?.lgd_district_id
        );
        if (districtIndex === -1) {
          acc[stateIndex].districts.push({
            lgd_district_id: curr?.lgd_district_id,
            lgd_district_name: curr?.lgd_district_name,
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
    const updatedSelectedDistricts = selectedDistricts.map(
      (selectedDistrict) => {
        return (
          aspirationalData.find(
            (district) =>
              district.lgd_district_id === selectedDistrict.lgd_district_id
          ) || selectedDistrict
        );
      }
    );

    dispatch(setselectedCompareDistricts(updatedSelectedDistricts));
  }, [dispatch, aspirationalData, selectedYear]);

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
        district?.lgd_district_name === value &&
        district?.lgd_state_name === selectedState
    );
    if (districtData) {
      newSelectedDistricts[position] = districtData;
      dispatch(
        setselectedCompareDistricts(
          newSelectedDistricts.slice(0, MAX_DISTRICTS)
        )
      );
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
        !selected
          .map((d) => d.lgd_district_name)
          .includes(district.lgd_district_name)
    );
  };

  // Handle option change
  const handleOptionChange = (event) => {
    dispatch(setselectedCompareOption(event.target.value));
  };


  // const male_female = [{
  //   name: 'Female',
  //   data: [1, 1, 1, 1],
  //   color: "#751539"
  // }, {

  //   name: 'Male',
  //   data: [1, 1, 1, 1],
  //   color: "#57C1BB"
  // }];

  const [totalMaleFemale, setTotalMaleFemale] = useState([]);


  // ********Start Baar Graph******
  // Update totalMaleFemale data based on selectedDistricts
  useEffect(() => {
    const male_female_data = selectedDistricts.map((district) => ({
      name: district.lgd_district_name,
      data: [
        selectedOption === "upper_primary_to_secondary"
          ? district?.upri_b
          : district?.sec_b,
        selectedOption === "secondary_to_higher_secondary"
          ? district?.upri_g
          : district?.sec_g,
      ],
      // color:  % 2 === 0 ? "#57C1BB" : "#751539",
    }));

    setTotalMaleFemale(male_female_data);
  }, [selectedDistricts, selectedOption]);








  console.log("totalMaleFemale=========>",totalMaleFemale)

  return (
    <>
      <div className="card-box">
        <div className="row align-items-end">
          <div className="col-md-5">
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
                <h3 className="heading-sm">
                  {t("comparisonByTransitionRate")}
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
                  <label htmlFor="radio11">
                    {t("upperPrimaryToSecondary")}
                  </label>
                </div>

                <div className="box-radio">
                  <input
                    type="radio"
                    id="radio22"
                    value="secondary_to_higher_secondary"
                    checked={selectedOption === "secondary_to_higher_secondary"}
                    onChange={handleOptionChange}
                  />
                  <label htmlFor="radio22">
                    {t("secondaryToHigherSecondary")}
                  </label>
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
                  <h5 className="sub-title">{t("selectDistrictToCompare")}</h5>
                </div>
                <div className="col-md-6 Comparison-select-group order_3">
                  <div className="d-flex justify-content-between text-aligns-center antd-select">
                    {[...Array(MAX_DISTRICTS)]?.map((_, index) => (
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
                          disabled={index > 0 && !selectedDistricts[index - 1]}
                        >
                          {getFilteredDistricts(index)?.map((district) => (
                            <Select.Option
                              key={district?.lgd_district_id}
                              value={district?.lgd_district_name}
                            >
                              {district?.lgd_district_name}
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
                      <img src={card} alt="card" /> <span>{t("cardView")}</span>
                    </button>
                    <button className="tab-button">
                      <img src={table} alt="Table" />{" "}
                      <span>{t("tableView")}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {selectedState !== SelectState ? (
            <div className="col-md-12 mt-4">
              <div className="row">
                {selectedDistricts &&
                  selectedDistricts?.map((district, index) => (
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
                          {!isActiveGraph ? (
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
                                  <p>Boys</p>
                                  <h6 className="sub-title">
                                    {selectedOption ===
                                    "upper_primary_to_secondary"
                                      ? district?.upri_b
                                      : district?.sec_b}
                                  </h6>
                                </div>
                                <div className="text-card">
                                  <p>Girls</p>
                                  <h6 className="sub-title">
                                    {selectedOption ===
                                    "upper_primary_to_secondary"
                                      ? district?.upri_g
                                      : district?.sec_g}
                                  </h6>
                                </div>
                                <div className="text-card">
                                  <p>Total</p>
                                  <h6 className="sub-title">
                                    {selectedOption ===
                                    "upper_primary_to_secondary"
                                      ? district?.upri_t
                                      : district?.sec_t}
                                  </h6>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <></>
                          )}{" "}
                          :
                        </>
                      )}
                    </div>
                  ))}

                {isActiveGraph ? (
                  <div>
                    <div className="card-box-impact tab-for-graph number_of_male_female_teacher mt-4">
                      <div className="row">
                        <div className="col-md-12 col-lg-12">
                          <div className="impact-box-content-education">
                            <div className="text-btn-d">
                              <h2 className="heading-sm">
                                {t("number_of_male_female_teacher")}
                              </h2>
                              {/* <div className='d-flex w-20'>
                                                        <button className='view-table-btn'> <span className="material-icons-round">table_view</span> View Table </button>
                                                        <button className='view-table-btn view-more-btn ms-1'> <span className="material-icons-round me-0">more_horiz</span></button>
                                                    </div> */}
                            </div>

                            <div className="piechart-box row mt-4">
                              <div className="col-md-12">
                                <HighchartsReact
                                  highcharts={Highcharts}
                                  options={{
                                    chart: {
                                      type: "column",
                                      marginTop: 50,
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
                                      // categories:district.lgd_district_name,
                                      title: {
                                        text: null,
                                      },
                                      gridLineWidth: 1,
                                      lineWidth: 0,
                                    },
                                    yAxis: {
                                      min: 0,
                                      title: {
                                        // text: 'Population (millions)',
                                        // align: 'high'
                                        enabled: false,
                                      },
                                      labels: {
                                        overflow: "justify",
                                      },
                                      gridLineWidth: 0,
                                    },

                                    tooltip: {
                                      valueSuffix: "",
                                      valueFormatter: function () {
                                        return this.y.toFixed(2);
                                      },
                                      pointFormatter: function () {
                                        return `<span style="color:${
                                          this.color
                                        }">\u25CF</span> ${
                                          this.series.name
                                        }: <b>${this.y.toLocaleString(
                                          "en-IN"
                                        )}</b><br/>`;
                                      },
                                    },
                                    title: {
                                      text: t("number_of_male_female_teacher"),
                                    },
                                    plotOptions: {
                                      column: {
                                        // Use 'column' instead of 'bar' for column charts

                                        dataLabels: {
                                          enabled: true,
                                          formatter: function () {
                                            return this.y.toLocaleString(
                                              "en-IN"
                                            );
                                          },
                                        },
                                        groupPadding: 0,
                                      },
                                    },
                                    legend: {
                                      layout: "horizontal",
                                      align: "center",
                                      verticalAlign: "bottom",
                                      itemMarginTop: 10,
                                      itemMarginBottom: 10,
                                    },
                                    events: {
                                      load: function () {
                                        const chart = this;
                                        // When the chart is loaded and the table is rendered, format the table cells
                                        const table = document.querySelector(
                                          ".highcharts-data-table table"
                                        );
                                        if (table) {
                                          const cells =
                                            table.querySelectorAll("tbody td");
                                          cells.forEach((cell) => {
                                            const cellValue = parseFloat(
                                              cell.innerText.replace(/,/g, "")
                                            );
                                            if (!isNaN(cellValue)) {
                                              cell.innerText =
                                                cellValue.toLocaleString(
                                                  "en-IN"
                                                );
                                            }
                                          });
                                        }
                                      },
                                    },
                                    credits: {
                                      enabled: false,
                                    },
                                    series: totalMaleFemale,
                                    exporting: {
                                      filename: t(
                                        "number_of_male_female_teacher"
                                      ),
                                      csv: {
                                        columnHeaderFormatter: function (item) {
                                          if (
                                            !item ||
                                            item instanceof Highcharts.Axis
                                          ) {
                                            return t("category");
                                          }
                                          return item.name;
                                        },
                                      },
                                    },
                                  }}
                                  // allowChartUpdate={true}
                                  immutable={true}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <></>
                )}
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
