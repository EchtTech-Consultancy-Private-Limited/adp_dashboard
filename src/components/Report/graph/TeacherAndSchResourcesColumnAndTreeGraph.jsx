import React, { useState } from "react";

import "./graph.scss";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";


import "ag-grid-enterprise";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-material.css";
import "jspdf-autotable";
import HC_more from "highcharts/highcharts-more";

require("highcharts/modules/exporting")(Highcharts);
require("highcharts/modules/accessibility")(Highcharts);
require("highcharts/modules/export-data.js")(Highcharts);
require("highcharts/highcharts-more")(Highcharts);
require("highcharts/modules/treemap")(Highcharts);
require("highcharts/modules/treegraph")(Highcharts);
HC_more(Highcharts);

export default function TeacherAndSchResourcesColumnAndTreeGraph() {
  const selectReportType = useSelector(
    (state) => state.reportAdpAbpType.updateReportType
  );

  const finalData = useSelector((state) => state.reportAdpAbpType.finalData);

  const [chartHeight, setChartHeight] = useState(450);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [limit] = useState(5);

  const { t } = useTranslation();

  // *******Start Column graph******

  const combinedDataForColumnGraph = (finalData) =>
    finalData
      ?.map((district) => ({
        ...district,
        combinedScore: district.ele_sch_percent + district.ele_sch_percent,
      }))
      .sort((a, b) => a.combinedScore - b.combinedScore);

  const TopDistrictsAndBlocksColumnGraph = combinedDataForColumnGraph(
    finalData
  )?.slice(0, 10);

  const getColumnGraphData = (data) => {
    const categories = data?.map((district) =>
      selectReportType === "ADP_Report"
        ? district.lgd_district_name
        : district.lgd_block_name
    );
    const elementry_sch_per = data?.map((district) =>
      selectReportType === "ADP_Report"
        ? district.ele_sch_percent
        : district.ele_sch_percent
    );

    return { categories, elementry_sch_per };
  };

  const { categories: topCategories, elementry_sch_per: topElementrySchPer } =
    getColumnGraphData(TopDistrictsAndBlocksColumnGraph || []);

    const formatedTopElementrySchPer=topElementrySchPer?.map(num=>parseFloat(num?.toFixed(2)))


  // *******end Column graph********

  // *******Start Tree graph******

  function getColorCode(percentage) {
    const colorRanges = [
      { min: 18, color: "#BCE263" },
      { min: 7, max: 12.99, color: "#F5BF55" },
      { min: 0, max: 3.99, color: "#E6694A" },
    ];
    for (let range of colorRanges) {
      if (
        percentage >= range.min &&
        (range.max === undefined || percentage <= range.max)
      ) {
        return range.color;
      }
    }
    return "#E6694A";
  }

  let count = 1;

  const combinedDataForTreeGraph = (finalData) =>
    finalData
      ?.map((district) => ({
        ...district,
        combinedScore: district.ele_sch_percent + district.ele_sch_percent,
      }))
      .sort((a, b) => a.combinedScore - b.combinedScore);

  const TopDistrictsBlocksTreeGraph = combinedDataForTreeGraph(
    finalData
  )?.slice(currentIndex, currentIndex + limit);

  // const limitedData = finalData.slice(currentIndex, currentIndex + limit);

  const formattedDataTreeGraphForDistricts = TopDistrictsBlocksTreeGraph?.map(
    (item) => {
      let lgd_district_name = {
        id: item.lgd_district_name,
        parent: "INDIA",
        name: `${item.lgd_district_name} `,
        value: item.lgd_district_name,
        color: getColorCode(item.ele_sch_percent),
      };

      let total_sch_ele = {
        id: ++count,
        parent: item.lgd_district_name,
        name: `Number of Elementary Schools : ${typeof item.total_sch_ele === 'number' ? item.total_sch_ele.toFixed(2) : 'N/A'}`,
        value: item.total_sch_ele,
        color: getColorCode(item.total_sch_ele),
      };
      let u_ptr = {
        id: ++count,
        parent: item.lgd_district_name,
        name: `Elementary Schools with PTR ≤ 30 : ${typeof item.u_ptr === 'number' ? item.u_ptr.toFixed(2) : 'N/A'}`,
        value: item.u_ptr,
        color: getColorCode(item.u_ptr),
      };


      let ele_sch_percent = {
        id: ++count,
        parent: item.lgd_district_name,
        name: `Percentage of Elementary Schools with PTR ≤ 30% :  ${typeof item.ele_sch_percent === 'number' ? item.ele_sch_percent.toFixed(2) : 'N/A'}`,
        value: item.ele_sch_percent,
        color: getColorCode(item.ele_sch_percent),
      };

      return [lgd_district_name,u_ptr, total_sch_ele, ele_sch_percent];
    }
  );

  const formattedDataTreeGraphForBlocks = TopDistrictsBlocksTreeGraph?.map(
    (item) => {
      let lgd_block_name = {
        id: item.lgd_block_name,
        parent: "INDIA",
        name: `${item.lgd_block_name} `,
        value: item.lgd_block_name,
        color: getColorCode(item.ele_sch_percent),
      };

      let total_sch_ele = {
        id: ++count,
        parent: item.lgd_block_name,
        name: `Number of Elementary Schools :  ${typeof item.total_sch_ele === 'number' ? item.total_sch_ele.toFixed(2) : 'N/A'}`,
        value: item.total_sch_ele,
        color: getColorCode(item.total_sch_ele),
      };

      let u_ptr = {
        id: ++count,
        parent: item.lgd_block_name,
        name: `Elementary Schools with PTR ≤ 30 :   ${typeof item.u_ptr === 'number' ? item.u_ptr.toFixed(2) : 'N/A'}`,
        value: item.u_ptr,
        color: getColorCode(item.u_ptr),
      };


      let ele_sch_percent = {
        id: ++count,
        parent: item.lgd_block_name,
        name: `Percentage of Elementary Schools with PTR ≤ 30% : ${typeof item.ele_sch_percent === 'number' ? item.ele_sch_percent.toFixed(2) : 'N/A'}`,
        value: item.ele_sch_percent,
        color: getColorCode(item.ele_sch_percent),
      };

      return [lgd_block_name,total_sch_ele, u_ptr,ele_sch_percent];
    }
  );

  const FinalDataTreeGraphForDistrict =
    formattedDataTreeGraphForDistricts.flat();
  const FinalDataTreeGraphForBlocks = formattedDataTreeGraphForBlocks.flat();

  FinalDataTreeGraphForDistrict.unshift({
    id: "INDIA",
    parent: "",
    name: "INDIA",
    color: "#EBEBEB",
  });

  FinalDataTreeGraphForBlocks.unshift({
    id: "INDIA",
    parent: "",
    name: "INDIA",
    color: "#EBEBEB",
  });

  const handleNext = () => {
    // Ensure you do not go beyond the available data length
    if (currentIndex + limit < finalData.length) {
      setCurrentIndex(currentIndex + limit);
    }
  };

  const handlePrevious = () => {
    // Ensure you do not go below 0
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - limit);
    }
  };

  const countAllChildNodes = (node) => {
    let counts = 0;
    const countChildren = (n) => {
      if (n?.children) {
        counts += n.children.length;
        n.children.forEach(countChildren);
      }
    };
    countChildren(node);
    return counts;
  };

  const handleNodeClick = (e) => {
    const node = e.point;
    const childNodesCount = countAllChildNodes(node);
    const pixelValue = 40;
    let newHeight = chartHeight;

    if (node.collapsed) {
      newHeight += childNodesCount * pixelValue;
    } else {
      newHeight -= childNodesCount * pixelValue;
    }
    setChartHeight(newHeight);
  };

  // *******end Tree graph********


 

  const headingText = TopDistrictsAndBlocksColumnGraph.length < 10
  ? `${t('performance_of')} ${selectReportType === "ADP_Report" ? t('district') : t('block')} ${t('byElementarySchoolsWithPTR30')}`  
  : `${t('top_ten')} ${selectReportType === "ADP_Report" ? t('district') : t('block')}  ${t('byElementarySchoolsWithPTR30')}`;
  return (
    <>
   <div className="col-md-7">
     <section className="infrastructure-main-card p-0">
      <div className="">
        <div className="container tab-for-graph">
          <div className="row align-items-center report-inner-tab">
            <div className="col-md-12 col-lg-12 p-0">
              <div className="graph-box">
                <div className="row">
                  <div className="col-md-12">
                    <div className="graph-card">
                      <div className="text-btn-d">
                        <h2 className="heading-sm"> 
                        {headingText}
                        </h2>
                      </div>
                      <div className="graph mt-4">
                        <div className="row mt-0">
                          <div className="col-md-12 text-dark-mode-black">
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
                                  categories: topCategories,
                                  labels: {
                                    rotation: -30,
                                   
                                }
                                },

                                yAxis: {
                                  allowDecimals: false,
                                  min: 0,
                                  title: {
                                    text: "",
                                  },
                                },
                                title: {
                                  text: headingText,
                                },
                                tooltip: {
                                  headerFormat: "<b>{point.x}</b><br/>",
                                  valueSuffix: " ",
                                  pointFormat:
                                    "{series.name}  : {point.y}",
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
                                        return parseFloat(this.y)?.toFixed(2);
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
                                  enabled: false,
                                },
                                credits: {
                                  enabled: false,
                                },
                                series: [
                                  // {
                                  //   name: "Not Available",
                                  //   data: notAvailableData,
                                  //   color: "#E6694A",
                                  // },
                                  {
                                    name: t("elementary_schools_with_ptr"),
                                    data: formatedTopElementrySchPer,
                                    color: "#BCE263",
                                    maxPointWidth: 50,
                                  },
                                ],
                                exporting: {
                                  filename: headingText,
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
            </div>
          </div>
        </div>
      </div>
    </section>
   </div>

   <div className="col-md-12">
   <section className="infrastructure-main-card p-0">
      <div className="">
        <div className="container tab-for-graph">
          <div className="row align-items-center report-inner-tab">
            <div className="col-md-12 col-lg-12 p-0">
              <div className="graph-box">
                <div className="row">                
                  <div className="col-md-12">
                    <div className="graph-card text-dark-mode-black">
                      <div className="text-btn-d">
                      <h2 className="heading-sm">  
                        {selectReportType === "ADP_Report" ? t('performanceOfDistrictsByPTR30') : t('performanceOfBlocksByPTR30')}
                      </h2>                      
                      </div>
                      <div
                        className={`scroll-btn-graph ${
                          currentIndex === 0 ? "disabled" : ""
                        }`}
                        onClick={handlePrevious}
                      >
                        <span className="material-icons-round">expand_less</span>
                      </div>

                      <HighchartsReact
                        highcharts={Highcharts}
                        options={{
                          title: {
                            text: selectReportType === "ADP_Report" ? t('performanceOfDistrictsByPTR30') : t('performanceOfBlocksByPTR30')
                          },
                          credits: {
                            enabled: false,
                          },
                          chart: {
                            height: 500,
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
                          navigation: {
                            buttonOptions: {
                              align: "right",
                              verticalAlign: "top",
                              y: -10,
                            },
                          },

                          series: [
                            {
                              reversed: true,
                              type: "treegraph",
                              data:
                                selectReportType === "ADP_Report"
                                  ? FinalDataTreeGraphForDistrict
                                  : FinalDataTreeGraphForBlocks,
                              tooltip: {
                                pointFormat: "{point.name}",
                              },
                              marker: {
                                symbol: "rect",
                                width: "25%",
                                height: "30",
                              },
                              borderRadius: 10,
                              dataLabels: {
                                pointFormat: "{point.name}",
                                style: {
                                  whiteSpace: "nowrap",
                                },
                              },
                              levels: [
                                {
                                  level: 1,
                                  levelIsConstant: false,
                                },
                                {
                                  level: 2,
                                  colorByPoint: false,
                                  collapsed: true,
                                },
                                {
                                  level: 3,
                                  collapsed: true,
                                  colorVariation: {
                                    key: "brightness",
                                    to: -0.5,
                                  },
                                },
                                {
                                  level: 4,
                                  collapsed: true,
                                  colorVariation: {
                                    key: "brightness",
                                    to: 0.5,
                                  },
                                },
                              ],
                              events: {
                                // Add event handler for node click
                                click: handleNodeClick,
                              },
                            },
                          ],
                          exporting: {
                            filename: selectReportType === "ADP_Report" ? t('performanceOfDistrictsByPTR30') : t('performanceOfBlocksByPTR30'),
                            csv: {
                              columnHeaderFormatter: function (item) {
                                if (!item || item instanceof Highcharts.Axis) {
                                  return t("category");
                                }
                                return item.name;
                              },
                            },
                            buttons: {
                              contextButton: {
                                menuItems: [
                                  "viewFullscreen",
                                  "printChart",
                                  "separator",
                                  "downloadPNG",
                                  "downloadJPEG",
                                  "downloadPDF",
                                  "downloadSVG",
                                  "downloadCSV",
                                  "downloadXLS",
                                ],
                              },
                            },
                          },
                          yAxis: {
                            reversed: true,
                          },
                        }}
                        // allowChartUpdate={true}
                        immutable={true}
                      />

                      <div className={`scroll-btn-graph ${
                          currentIndex >= 38 - limit ? "disabled" : ""
                        }`}
                        onClick={handleNext}
                      >
                        <span className="material-icons-round">expand_more</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
   </div>
   </>
  );
}
