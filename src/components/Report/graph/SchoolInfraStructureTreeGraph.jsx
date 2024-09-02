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

export default function SchoolInfraStructureTreeGraph() {
  const selectReportType = useSelector(
    (state) => state.reportAdpAbpType.updateReportType
  );

  const finalData = useSelector((state) => state.reportAdpAbpType.finalData);


  const [chartHeight, setChartHeight] = useState(450);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [limit] = useState(5);

  const { t } = useTranslation();

 

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

      let tot_school_girl_co_ed = {
        id: ++count,
        parent: item.lgd_district_name,
        name: `Total Coed and Girls Schools  : ${item.tot_school_girl_co_ed.toFixed(2)}`,
        value: item.tot_school_girl_co_ed,
        color: getColorCode(item.tot_school_girl_co_ed),
      };
      let total_no_of_fun_girls_toilet = {
        id: ++count,
        parent: item.lgd_district_name,
        name: `Schools with functional girls' toilets : ${item.total_no_of_fun_girls_toilet.toFixed(2)}`,
        value: item.total_no_of_fun_girls_toilet,
        color: getColorCode(item.total_no_of_fun_girls_toilet),
      };


      let functional_toilet_girls_percent = {
        id: ++count,
        parent: item.lgd_district_name,
        name: `% schools with functional girls' toilets : ${item.functional_toilet_girls_percent.toFixed(2)}`,
        value: item.functional_toilet_girls_percent,
        color: getColorCode(item.functional_toilet_girls_percent),
      };
      let toilet_40 = {
        id: ++count,
        parent: item.lgd_district_name,
        name: `Schools with girls' toilets at 40:1   : ${item.toilet_40.toFixed(2)}`,
        value: item.toilet_40,
        color: getColorCode(item.toilet_40),
      };
      let sch_having_toilet_40_percent = {
        id: ++count,
        parent: item.lgd_district_name,
        name: `% of schools with girls' toilets at 40:1  :  ${item.sch_having_toilet_40_percent.toFixed(2)}`,
        value: item.sch_having_toilet_40_percent,
        color: getColorCode(item.sch_having_toilet_40_percent),
      };


      return [lgd_district_name,total_no_of_fun_girls_toilet, tot_school_girl_co_ed, functional_toilet_girls_percent,toilet_40,sch_having_toilet_40_percent];
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

      let tot_school_girl_co_ed = {
        id: ++count,
        parent: item.lgd_block_name,
        name: `Total Coed and Girls Schools   : ${item.tot_school_girl_co_ed.toFixed(2)}`,
        value: item.tot_school_girl_co_ed,
        color: getColorCode(item.tot_school_girl_co_ed),
      };
      let total_no_of_fun_girls_toilet = {
        id: ++count,
        parent: item.lgd_block_name,
        name: `Schools with functional girls' toilets : ${item.total_no_of_fun_girls_toilet.toFixed(2)}`,
        value: item.total_no_of_fun_girls_toilet,
        color: getColorCode(item.total_no_of_fun_girls_toilet),
      };


      let functional_toilet_girls_percent = {
        id: ++count,
        parent: item.lgd_block_name,
        name: `% schools with functional girls' toilets : ${item.functional_toilet_girls_percent.toFixed(2)}`,
        value: item.functional_toilet_girls_percent,
        color: getColorCode(item.functional_toilet_girls_percent),
      };
      let toilet_40 = {
        id: ++count,
        parent: item.lgd_block_name,
        name: `Schools with girls' toilets at 40:1  : ${item.toilet_40.toFixed(2)}`,
        value: item.toilet_40,
        color: getColorCode(item.toilet_40),
      };
      let sch_having_toilet_40_percent = {
        id: ++count,
        parent: item.lgd_block_name,
        name: `% of schools with girls' toilets at 40:1  : ${item.sch_having_toilet_40_percent.toFixed(2)}`,
        value: item.sch_having_toilet_40_percent,
        color: getColorCode(item.sch_having_toilet_40_percent),
      };

      return [lgd_block_name,total_no_of_fun_girls_toilet, tot_school_girl_co_ed, functional_toilet_girls_percent,toilet_40,sch_having_toilet_40_percent];
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


 

  return (
    <section className="infrastructure-main-card p-0" id="content">
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
                        {selectReportType === "ADP_Report" ? " Performance of Districts By Percentage of schools with girls' toilets at a 40:1"  : "Performance of Blocks By Percentage of schools with girls' toilets at a 40:1"}
                      </h2>                      
                      </div>
                      <div
                        className={`scroll-btn-graph ${
                          currentIndex === 0 ? "disabled" : ""
                        }`}
                        onClick={handlePrevious}
                      >
                        <span class="material-icons-round">expand_less</span>
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
                            height: 650,
                            marginTop: 50,
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
                                height: "25",
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

                      <div
                        className={`scroll-btn-graph ${
                          currentIndex >= 38 - limit ? "disabled" : ""
                        }`}
                        onClick={handleNext}
                      >
                        <span class="material-icons-round">expand_more</span>
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
  );
}
