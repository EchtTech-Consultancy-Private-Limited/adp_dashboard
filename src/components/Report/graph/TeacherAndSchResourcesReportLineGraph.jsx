import React, { useEffect, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

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
    combinedDatas = allYearsData.reduce((acc, yearData) => {
      if (Array.isArray(yearData.data)) {
        return acc.concat(
          yearData.data.map((item) => ({
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
  // useEffect(() => {
  //   let filteredData = combinedData;
  //   if (selectedState && selectedState !== SelectState) {
  //     filteredData = filteredData?.filter(
  //       (item) => item.lgd_state_name === selectedState
  //     );
  //   }

  //   if (
  //     selectedDistrict &&
  //     selectedDistrict !== AllDistrict &&
  //     selectedDistrict !== SelectDistrict
  //   ) {
  //     filteredData = filteredData.filter(
  //       (item) => item.lgd_district_name === selectedDistrict
  //     );
  //   }

  //   if (
  //     selectedBlock &&
  //     selectedBlock !== AllBlock &&
  //     selectedBlock !== SelectBlock
  //   ) {
  //     filteredData = filteredData?.filter(
  //       (item) => item.lgd_block_name === selectedBlock
  //     );
  //   }
  //   filteredData = filteredData?.map((item) => ({
  //     ...item,
  //     Location: getLocationName(item),
  //   }));
  //   setData(filteredData);

  //   // dispatch(setUpdateStatus(false))
  // }, [
  //   selectedState,
  //   selectedDistrict,
  //   selectedBlock,
  //   combinedData,
  //   selectReportType,
  // ]);
  // const getLocationName = (item) => {
  //   if (selectReportType === "ABP_Report") {
  //     if (
  //       selectedBlock &&
  //       selectedBlock !== AllBlock &&
  //       selectedBlock !== SelectBlock
  //     ) {
  //       return `${item.lgd_block_name}`;
  //     } else if (
  //       selectedDistrict &&
  //       selectedDistrict !== AllDistrict &&
  //       selectedDistrict !== SelectDistrict
  //     ) {
  //       return `${item.lgd_block_name}`;
  //     } else if (selectedState && selectedState !== SelectState) {
  //       return `${item.lgd_district_name}`;
  //     } else if (selectedState === SelectState) {
  //       return `${item.lgd_state_name}`;
  //     }

  //   } else if (selectReportType === "ADP_Report") {
  //     if (selectedState && selectedState !== SelectState) {
  //       return `${item.lgd_district_name}`;
  //     } else if (
  //       selectedState !== SelectState &&
  //       selectedState !== AllDistrict
  //     ) {
  //       return `${item.lgd_district_name}`;
  //     } else if (selectedState === SelectState) {
  //       return `${item.lgd_state_name}`;
  //     }
  //   }
  //   return "";
  // };

  const data = useReportFilterData(combinedData);

  {
    /*Bind Data for All years Data Start*/
  }
  const categoriesYear = Array.from(new Set(data.map((item) => item.year)));

  const seriesData = categoriesYear.map((year) => {
    const yearData = data.filter((item) => item.year === year);
    const ptrLessThan = yearData
      .map((countDis) => parseFloat(countDis.ele_sch_percent).toFixed(2))
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
  const formateSeriesData = seriesData.map((num) => parseFloat(num.toFixed(2)));

  {
    /*Bind Data for All years Data Start*/
  }

  const percentageRenderer = (value) => {
    if (typeof value === "number") {
      return value.toFixed(2);
    }
    return value;
  };

  const chartOptions = {
    chart: {
      type: "line",
      marginTop: 50,
    },
    title: {
      text: "",
    },
    xAxis: {
      title: {
        text:t('elementary_schools_with_ptr'),

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
    
    legend: {
      layout: "horizontal",
      align: "center",
      verticalAlign: "bottom",
      itemMarginTop: 10,
      itemMarginBottom: 10,
      symbolHeight: 12,
      symbolWidth: 8,
      symbolRadius: 10,
      squareSymbol: false,
      enabled: true,
    },
    credits: {
      enabled: false,
    },
    series: [
      {
        name: "",
        data: formateSeriesData,
        color: "#E6694A",
          // marker: {
          //   symbol: "circle",
          // },
      },
    ],
    exporting: {
      filename:t('year_wise_elementary_schools_data_with_ptr'),
      csv: {
        columnHeaderFormatter: function (item) {
          if (!item || item instanceof Highcharts.Axis) {
            return t("category");
          }
          return item.name;
        },
      },
    },
  };

  return (
    <div className="graph-box">
      <div className="row">
        <div className="col-md-12">
          <div className="graph-card">
            <div className="text-btn-d">
              <h2 className="heading-sm">
              {t('year_wise_elementary_schools_data_with_ptr')}
              </h2>
            </div>
            <div className="graph">
              <HighchartsReact
                highcharts={Highcharts}
                options={chartOptions}
                immutable={true}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
