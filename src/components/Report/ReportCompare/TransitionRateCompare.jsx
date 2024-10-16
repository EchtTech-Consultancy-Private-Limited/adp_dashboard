import React, {  useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectDistrict,
  selectState,
  setStates,
} from "../../../redux/slice/filterServicesComprisionSlice";
import {
  setLoading,
  setselectedCompareDistricts,
  setselectedCompareOption,
} from "../../../redux/slice/reportTypeSlice";
import table from "../../../assets/images/table.svg";
import card from "../../../assets/images/card-list.svg";
import { Card, Select } from "antd";
import { SelectState } from "../../../constant/Constant";
import BlankPage from "../BlankPage";
import { useTranslation } from "react-i18next";
import { ArrowRenderer } from "../ArrowRenderer/ArrowRenderer"
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import '../graph/graph.scss';
export default function TransitionRateCompare() {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const aspirationalData = useSelector((state) => state.reportAdpAbpType.aspirationalAllData)
  const selectedOption = useSelector(
    (state) => state.reportAdpAbpType.selectedCompareOption
  );
  const isActiveGraph = useSelector((state) => state.reportAdpAbpType.isActiveGraph)
  const MAX_DISTRICTS = 5;
  const districts = useSelector((state) => state.locationAdp?.districts);
  const selectedState = useSelector((state) => state.locationAdp?.selectedState);

  const selectedDistricts = useSelector(
    (state) => state.reportAdpAbpType.selectedCompareDistricts
  );

  const selectedYear = useSelector(
    (state) => state.reportAdpAbpType?.selectedYear
  );

  function resteData() {
    dispatch(selectState(SelectState));
    dispatch(setselectedCompareOption("upper_primary_to_secondary"));
  }
  useEffect(() => {
    resteData();
  }, [dispatch]);

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
    const updatedSelectedDistricts = selectedDistricts.map((selectedDistrict) => {
      return aspirationalData.find(
        (district) => district.lgd_district_id === selectedDistrict.lgd_district_id
      ) || selectedDistrict;
    });

    dispatch(setselectedCompareDistricts(updatedSelectedDistricts));
  }, [dispatch, aspirationalData, selectedYear])

  // // Handle state change
  // const handleStateChange = (value) => {
  //   dispatch(selectState(value));
  //   dispatch(setselectedCompareDistricts([]));
  // };

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
      dispatch(setLoading(true));
    dispatch(setselectedCompareOption(event.target.value));
    setTimeout(()=>{
      dispatch(setLoading(false));
     },[150])
  };




  const boysData = selectedDistricts?.map(district =>
    selectedOption === 'upper_primary_to_secondary' ? district?.upri_b : district?.sec_b
  );

  const girlsData = selectedDistricts?.map(district =>
    selectedOption === 'secondary_to_higher_secondary' ? district?.sec_g : district?.upri_g
  );

  const Total_boys_girls = selectedDistricts?.map(district =>
    selectedOption === 'upper_primary_to_secondary' ? district?.upri_t : district?.sec_t
  );

  return (
    <>
      {!isActiveGraph ?  
      (<div className="card-box">
        <div className="row align-items-end">
          <div className="col-md-5">
            <div className="d-flex align-items-end">
              <div className="title-box">

                <h3 className="heading-sm">
                  {t("comparisonByTransitionRate")}
                </h3>
              </div>
            </div>
          </div>
          <div className="col-md-7">
            <div className="d-flex w-m-100">

           {  selectedDistricts.length >= 2 ? <div className="radio-button">
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
              </div> : <></>
}

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
                  <div key={index}
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
                        {!isActiveGraph   ? (<div className="comp-card" key={index}>
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
                                  <p>{t('district')}</p>
                                  <h6 className="sub-title">
                                    {district.lgd_district_name}
                                  </h6>
                                </div>
                              </div>
                              <div className="arrow-d">
                                {" "}
                                {/* <ArrowRenderer data={district} /> */}
                              </div>
                            </div>
                          </div>

                          <div className="lower-card">
                            <div className="text-card">
                              <p>{t('boys')}</p>
                              <h6 className="sub-title">
                                {selectedOption === "upper_primary_to_secondary"
                                  ? district?.upri_b
                                  : district?.sec_b}
                              </h6>
                            </div>
                            <div className="text-card">
                              <p>{t('girls')}</p>
                              <h6 className="sub-title">
                                {selectedOption === "upper_primary_to_secondary"
                                  ? district?.upri_g
                                  : district?.sec_g}
                              </h6>
                            </div>
                            <div className="text-card">
                              <p>{t('total')}</p>
                              <h6 className="sub-title">
                                {selectedOption === "upper_primary_to_secondary"
                                  ? district?.upri_t
                                  : district?.sec_t}
                              </h6>
                            </div>
                          </div>
                          
                        </div>) : (<div> Data is empty</div>)}

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
        {selectedDistricts.length >=2 ?  <div className="text-btn-d d-flex justify-content-between align-items-center">
            <h2 className="heading-sm">
            {t("comparisonByTransitionRate")}
            </h2>

            <div className="select-infra button-group-filter">
              <select id="export_data" className="form-select bg-grey2" defaultValue={"upper_primary_to_secondary"}
                value={selectedOption}
                onChange={handleOptionChange}
              >
                <option value="upper_primary_to_secondary"> {t("upperPrimaryToSecondary")}</option>
                <option value="secondary_to_higher_secondary">  {t("secondaryToHigherSecondary")}</option>
              </select>
            </div>

          </div> : <></>
}



          <div className="Comparison-box">
            <div className="row align-items-center">
              <div className="col-md-2 col-lg-2">
                <h4 className="sub-heading text-left">{t('add_district_to_compare')}</h4>
              </div>
              <div className="col-md-10 col-lg-10 pe-2">
                <div className="select-infra Comparison-select-group">


                  {[...Array(MAX_DISTRICTS)]?.map((_, index) => (
                    <div key={index} className="width-20">
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
              margin:"20px auto 0",
            }}
          >
            <b>{t("selectOneMoreDistrict")}</b>
          </Card>) : (<div className="row align-items-center">

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
                  text: t("comparisonByTransitionRate")
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
                series: [{
                  color: "#17AFD2",
                  name: t('boys'),
              
                  data: boysData,
                  maxPointWidth: 50,
                }, {
                  color: "#6C6CB0",
                  name: t('girls'),

         
                  data: girlsData,
                  maxPointWidth: 50,

                },
                {
                  color: "#FFB74BF0",
                  name: t('total'),
                  data: Total_boys_girls,
                  maxPointWidth: 50,
                }


                ],
                exporting: {
                  filename:t("comparisonByTransitionRate"),
                  csv: {
                    columnHeaderFormatter: function (item) {
                      if (!item || item instanceof Highcharts.Axis) {
                        return t("category");
                      }
                      return item.name;
                    },
                  },
                },
              }}
              immutable={true}
            />
          </div>)}

        </div>

      </div>)}

    </>
  );
}