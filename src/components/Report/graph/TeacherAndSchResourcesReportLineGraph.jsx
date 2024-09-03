import React, { useEffect, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import useReportFilterData from "../../../CustomHook/useReportFilterData";

export default function TeacherAndSchResourcesReportLineGraph() {
  const { t } = useTranslation();

  const finalData = useSelector((state) => state.reportAdpAbpType.finalData);
  const allYearsData = useSelector(
    (state) => state.reportAdpAbpType.allYearDataForGraph
  );

  const [combinedData, setCompinedData] = useState([]);
  // const [data, setData] = useState([])
  let combinedDatas;
  if (Array.isArray(allYearsData)) {
    combinedDatas = allYearsData?.reduce((acc, yearData) => {
      if (Array.isArray(yearData.data)) {
        return acc.concat(
          yearData?.data?.map((item) => ({
            ...item,
            year: yearData.year,
          }))
        );
      }
      return acc;
    }, []);
  } else {
    console.log("allYearsData is not an array");
  }

  useEffect(() => {
    setCompinedData(combinedDatas);
  }, [finalData]);

  const data = useReportFilterData(combinedData);

  {
    /*Bind Data for All years Data Start*/
  }
  const categoriesYear = Array.from(new Set(data?.map((item) => item.year)));

  const seriesData = categoriesYear.map((year) => {
    const yearData = data?.filter((item) => item.year === year);
    const ptrLessThan = yearData
      .map((countDis) => parseFloat(countDis?.ele_sch_percent)?.toFixed(2))
      .filter((val) => !isNaN(val));

    if (ptrLessThan.length === 0) {
      return 0;
    }
    const totalPtrLessThan = ptrLessThan.reduce(
      (acc, curr) => acc + parseFloat(curr),
      0
    );
    const averagePtrLessThan = totalPtrLessThan / ptrLessThan.length;

    return averagePtrLessThan;
  });
  const formateSeriesData = seriesData.map((num) => parseFloat(num?.toFixed(2)));

  {
    /*Bind Data for All years Data Start*/
  }

  const percentageRenderer = (value) => {
    if (typeof value === "number") {
      return value?.toFixed(2);
    }
    return value;
  };

  // const chartOptions = {
  //   chart: {
  //     type: "line",
  //     marginTop: 70,
  //     height:430,
  //   },
  //   title: {
  //     text: "",
  //   },
  //   xAxis: {
  //     title: {
  //       // text:t('elementary_schools_with_ptr'),
  //       y: 50,
  //     },
  //     categories: categoriesYear,
  //     gridLineWidth: 0,
  //     lineWidth: 0,
  //   },
  //   yAxis: {
  //     title: {
  //       text: "",
  //     },
  //     gridLineWidth: 0,
  //     lineWidth: 0,
  //   },
  //   plotOptions: {
  //     line: {
  //       dataLabels: {
  //         enabled: true,
  //         formatter: function () {
  //           return percentageRenderer(this.y);
  //         },
  //       },
  //     },
  //   },
  //   legend: {
  //     layout: "vertical",
  //     align: "center",
  //     verticalAlign: "bottom",
  //     itemMarginTop: 10,
  //     itemMarginBottom: 10,
  //     symbolHeight: 12,
  //     symbolWidth: 8,
  //     symbolRadius: 10,
  //     squareSymbol: false,
  //     enabled: true,
  //   },
  //   credits: {
  //     enabled: false,
  //   },
  //   series: [
  //     {
  //       name: "Elementary Schools with PTR ≤ 30%",
  //       data: formateSeriesData,
  //       color: "#E6694A",
  //     },
  //   ],
  //   exporting: {
  //     filename: t("ptr_last_five_years_school_category"),
  //     csv: {
  //       columnHeaderFormatter: function (item) {
  //         if (!item || item instanceof Highcharts.Axis) {
  //           return t("category");
  //         }
  //         return item.name;
  //       },
  //     },
  //   },
  // };



  return (
    <div className="col-md-5">
      <div className="graph-box">
        <div className="row">
          <div className="col-md-12">
            <div className="graph-card-1">
              <div className="text-btn-d">
                <h2 className="heading-sm">
                  {t("year_wise_elementary_schools_data_with_ptr")}
                </h2>
              </div>
              <div className="graph">
                <HighchartsReact
                  highcharts={Highcharts}
                  options={{
                    chart: {
                      type: "line",
                      marginTop: 50,
                      height: 425,
                    },
                    title: {
                      text: "",
                    },
                    xAxis: {
                      title: {
                        // text:t('elementary_schools_with_ptr'),
                        y: 50,
                      },
                      categories: categoriesYear,
                      gridLineWidth: 0,
                      lineWidth: 0,
                    },
                    yAxis: {
                      title: {
                        text: "",
                      },
                      gridLineWidth: 0,
                      lineWidth: 0,
                    },
                    legend: {
                      layout: "vertical",
                      align: "center",
                      verticalAlign: "bottom",
                      itemMarginTop: 20,
                      itemMarginBottom: 0,
                      symbolHeight: 12,
                      symbolWidth: 8,
                      symbolRadius: 10,
                      squareSymbol: false,
                      enabled: true,
                    },
                    plotOptions: {
                      line: {
                        dataLabels: {
                          enabled: true,
                          formatter: function () {
                            return percentageRenderer(this.y);
                          },
                        },
                      },
                    },

                    credits: {
                      enabled: false,
                    },
                    series: [
                      {
                        name: t('elementary_schools_with_ptr'),
                        data: formateSeriesData,
                        color: "#E6694A",
                      },
                    ],
                    exporting: {
                      filename: t("year_wise_elementary_schools_data_with_ptr"),
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
