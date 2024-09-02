import React from "react";
import "./graph.scss";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

export default function SchoolInfraColumnGraph() {
  const selectReportType = useSelector(
    (state) => state.reportAdpAbpType.updateReportType
  );
  const { t } = useTranslation();
  const finalData = useSelector((state) => state.reportAdpAbpType.finalData);

  const combinedDataForColumnGraph = (finalData) =>
    finalData
      ?.map((district) => ({
        ...district,
        combinedScore:
          district.sch_having_toilet_40_percent +
          district.sch_having_toilet_40_percent,
      }))
      .sort((a, b) => b.combinedScore - a.combinedScore);

  const TopDistrictsAndBlocksColumnGraph = combinedDataForColumnGraph(
    finalData
  )?.slice(0, 10);

  const getColumnGraphData = (data) => {
    const categories = data.map((district) =>
      selectReportType === "ADP_Report"
        ? district.lgd_district_name
        : district.lgd_block_name
    );
    const sch_having_toilet_40_percent = data.map((district) =>
      selectReportType === "ADP_Report"
        ? district.sch_having_toilet_40_percent
        : district.sch_having_toilet_40_percent
    );
    return { categories, sch_having_toilet_40_percent };
  };

  const {
    categories: topCategories,
    sch_having_toilet_40_percent: topSchToiPer,
  } = getColumnGraphData(TopDistrictsAndBlocksColumnGraph || []);

  const formatedTopSchToiPer = topSchToiPer.map((num) => {
    const number = Number(num);
    return isNaN(number) ? 0 : parseFloat(number.toFixed(2));
  });
  const headingText =
    TopDistrictsAndBlocksColumnGraph.length < 10
      ? `${t("performance_of")} ${
          selectReportType === "ADP_Report" ? t("district") : t("block")
        } ${t("percentage_schools_girls_toilets_40_1")}`
      : `${t("top_ten")} ${
          selectReportType === "ADP_Report" ? t("district") : t("block")
        }  ${t("percentage_schools_girls_toilets_40_1")}`;

  return (
    <div className="col-md-12">
      <div className="graph-card">
        <div className="text-btn-d">
          <h2 className="heading-sm">{headingText}</h2>
        </div>
        <div className="graph mt-4">
          <div className="row mt-0">
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
                    categories: topCategories,
                  },

                  yAxis: {
                    allowDecimals: false,
                    min: 0,
                    title: {
                      text: "",
                    },
                  },
                  title: {
                    text: t(""),
                  },
                  tooltip: {
                    headerFormat: "<b>{point.x}</b><br/>",
                    valueSuffix: "%",
                    pointFormat: "{series.name}  : {point.y}",
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
                        // rotation:-90,
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
                          return parseFloat(this.y).toFixed(2) + "%";
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
                      name: t("percentage_schools_girls_toilets_40_1"),
                      data: formatedTopSchToiPer,
                      color: "#BCE263",
                      maxPointWidth: 50,
                    },
                  ],
                  exporting: {
                    filename: headingText,
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
                // allowChartUpdate={true}
                immutable={true}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
