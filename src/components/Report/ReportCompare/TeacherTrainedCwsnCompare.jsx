
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectDistrict, selectState, setStates } from "../../../redux/slice/filterServicesComprisionSlice.js";
import { setAspirationalAllData, setselectedCompareDistricts, setselectedCompareOption, setUpdateReportType } from "../../../redux/slice/reportTypeSlice.js";
import aspirationalAdpData from "../../../aspirational-reports-data/aspirationalDistrict.json";
import table from '../../../assets/images/table.svg'
import card from '../../../assets/images/card-list.svg'
import { Card, Select } from 'antd';
import { SelectState } from "../../../constant/Constant.js";
import BlankPage from "../BlankPage.jsx";
import { useTranslation } from "react-i18next";
import { ArrowRenderer } from "../ArrowRenderer/ArrowRenderer.jsx"
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

export default function StudentsPerformanceCompare() {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const aspirationalData = useSelector((state) => state.reportAdpAbpType.aspirationalAllData)
  const selectedOption = useSelector((state) => state.reportAdpAbpType.selectedCompareOption);
  const selectedAdpAbpOption = useSelector((state) => state.reportAdpAbpType.updateReportType);
  const MAX_DISTRICTS = 5;
  const states = useSelector((state) => state.locationAdp.states);
  const districts = useSelector((state) => state.locationAdp.districts);
  const selectedState = useSelector((state) => state.locationAdp.selectedState);
  const selectedDistricts = useSelector((state) => state.reportAdpAbpType.selectedCompareDistricts)
  const selectedYear = useSelector((state) => state.reportAdpAbpType.selectedYear);
  const isActiveGraph = useSelector((state) => state.reportAdpAbpType.isActiveGraph)
  function resteData() {
    dispatch(selectState(SelectState));
    dispatch(setselectedCompareOption("upper_primary_to_secondary"));
  }
  useEffect(() => {
    resteData()
  }, [dispatch]);

  useEffect(() => {
    const structuredData = aspirationalData.reduce((acc, curr) => {
      const stateIndex = acc?.findIndex(
        (st) => st.lgd_state_id === curr.lgd_state_id
      );
      if (stateIndex === -1) {
        acc.push({
          lgd_state_id: curr?.lgd_state_id,
          lgd_state_name: curr?.lgd_state_name,
          districts: [
            {
              lgd_district_id: curr?.lgd_district_id,
              lgd_district_name: curr?.lgd_district_name,
              total_school_cwsn: curr?.total_school_cwsn,
              tot_school: curr?.tot_school,
              swsn_teacher_percent: parseFloat(curr?.swsn_teacher_percent?.toFixed(2)),

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
            total_school_cwsn: curr?.total_school_cwsn,
            tot_school: curr?.tot_school,
            swsn_teacher_percent: parseFloat(curr?.swsn_teacher_percent?.toFixed(2)),

          });
        }
      }
      return acc;
    }, []);

    dispatch(setStates(structuredData));
    const updatedSelectedDistricts = selectedDistricts.map((selectedDistrict) => {
      return aspirationalData.find(
        (district) => district.lgd_district_id === selectedDistrict.lgd_district_id
      ) || selectedDistrict;
    });

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
        district.lgd_district_name === value &&
        district.lgd_state_name === selectedState
    );
    if (districtData) {
      newSelectedDistricts[position] = districtData;
      dispatch(setselectedCompareDistricts(newSelectedDistricts.slice(0, MAX_DISTRICTS)));
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
  const totalSch = selectedDistricts?.map(district => district?.tot_school);

  const cwsnTrainedTeacher = selectedDistricts?.map(district => district?.total_school_cwsn);


  // const percentageCwsnTrainedTeach = selectedDistricts?.map(district => Number(parseFloat(district?.swsn_teacher_percent).toFixed(2)));

const [data,setData]=useState([]);

  const percentageCwsnTrainedTeach = selectedDistricts?.map(district => {
    const percentage = parseFloat(district?.swsn_teacher_percent).toFixed(2);
    return `${percentage}%`;
});

useEffect(()=>{
percentageCwsnTrainedTeach.map((percentage, index) => (
      setData(percentage)
))

},[percentageCwsnTrainedTeach])

  return (
    <>
      {!isActiveGraph ? (<div className="card-box">
        <div className="row align-items-end">
          <div className="col-md-12">
            <div className="d-flex align-items-center">
              <div className="title-box">
                <h3 className="heading-sm">
                  {t("comparisonByStudentPerformance")}
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
                  <h5 className="sub-title">
                    {t("selectDistrictToCompare")}
                  </h5>
                </div>
                <div className="col-md-6 Comparison-select-group order_3">
                  <div className="d-flex justify-content-between text-aligns-center antd-select">
                    {[...Array(MAX_DISTRICTS)].map((_, index) => (
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
                          disabled={
                            index > 0 && !selectedDistricts[index - 1]
                          }
                        >
                          {getFilteredDistricts().map((district) => (
                            <Select.Option
                              key={district.lgd_district_id}
                              value={district.lgd_district_name}
                            >
                              {district.lgd_district_name}
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
                {selectedDistricts && selectedDistricts?.map((district, index) => (
                  <div
                    className={`col-sm-12 col-20 ${selectedDistricts.length === 1 ? "m-auto" : ""
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
                              <p>CWSN</p>
                              <h6 className="sub-title">
                                {district?.total_school_cwsn}
                              </h6>
                            </div>
                            <div className="text-card">
                              <p>Total School</p>
                              <h6 className="sub-title">
                                {district?.tot_school}
                              </h6>
                            </div>
                            <div className="text-card">
                              <p>{`% CWSN`}</p>
                              <h6 className="sub-title">
                                {district?.swsn_teacher_percent?.toFixed(2)}
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
      </div>) : (
        <div className="col-md-12 graph-box">
        <div className="impact-box-content-education bg-light-blue tab-sdb-blue graph-card text-left">
          <div className="text-btn-d d-flex justify-content-between align-items-center">
            <h2 className="heading-sm">
            {t('comparison_by_percentage_schools_cwsn_trained_teachers')}
            </h2>

          </div>

          <div className="Comparison-box">
            <div className="row align-items-center">
              <div className="col-md-2 col-lg-2">
                <h4 className="sub-heading text-left">{t('add_district_to_compare')}</h4>
              </div>
              <div className="col-md-10 col-lg-10 pe-2">
                <div className="select-infra Comparison-select-group">


                  {[...Array(MAX_DISTRICTS)]?.map((_, index) => (
                    <div key={index} class="width-20">
                      <Select
                        className="form-select bg-grey2"
                        onChange={(value) => handleDistrictChange(value, index)}
                        style={{ width: "100%" }}
                        placeholder={`${t('addDistrict')} ${index + 1}`}
                        mode="single"
                        showSearch
                        value={selectedDistricts[index]?.lgd_district_name || `${t('addDistrict')}`}
                        disabled={index > 0 && !selectedDistricts[index - 1]}
                      >
                        {getFilteredDistricts().map((district) => (
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
            </div>
          </div>
          {selectedDistricts.length === 1 ? (<Card
            style={{
              width: 300,
              margin: "20px auto 0",
            }}
          >
            <b>{t("selectOneMoreDistrict")}</b>
          </Card>) : (<div className="piechart-box row align-items-center">

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
                  categories: selectedDistricts.map(district => district.lgd_district_name),
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
                  pointFormat: "{series.name}: {point.y} ",
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
                        return this.y.toLocaleString("en-IN");
                      },
                    },
                    minPointLength:15
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
                    name: t('percentage_Schools_with_CWSN-Trained'),
                    data: percentageCwsnTrainedTeach,
                    maxPointWidth: 50,
                  },
                  {
                    color: "#6C6CB0",
                    name: t('schools_with_CWSN_trained_teachers_of'),
                    data: cwsnTrainedTeacher,
                    maxPointWidth: 50,

                  },

                  {
                    color: "#17AFD2",
                    name: t('total_schools_data'),
                    data: totalSch,
                    maxPointWidth: 50,
                  },


                ]
              }}
              immutable={true}
            />
          </div>)}

        </div>

      </div>)}

    </>
  );
}