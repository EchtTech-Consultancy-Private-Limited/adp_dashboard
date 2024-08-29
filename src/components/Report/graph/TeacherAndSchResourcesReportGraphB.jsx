import React, { useEffect, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { selectState } from "../../../redux/slice/filterServicesSlice";
import aspirationalAdpData2019 from "../../../aspirational-reports-data/aspirationalAdpData2019-20.json";
import aspirationalAdpData2020 from "../../../aspirational-reports-data/aspirationalAdpData2020-21.json";
import aspirationalAdpData2021 from "../../../aspirational-reports-data/aspirationalAdpData2021-22.json";
import aspirationalAdpData2022 from "../../../aspirational-reports-data/aspirationalAdpData2022-23.json";
import aspirationalAbpData2020 from "../../../aspirational-reports-data/aspirationalAbpData2020-21.json";
import aspirationalAbpData2021 from "../../../aspirational-reports-data/aspirationalAbpData2021-22.json";
import aspirationalAbpData2022 from "../../../aspirational-reports-data/aspirationalAbpData2022-23.json";
import aspirationalAbpData2019 from "../../../aspirational-reports-data/aspirationalAbpData2019-20.json";
import { selectDistrict } from "../../../redux/slice/filterServicesComprisionSlice";
import {
  AllBlock,
  AllDistrict,
  SelectBlock,
  SelectDistrict,
  SelectState,
} from "../../../constant/Constant";

export default function TeacherAndSchoolgraphB() {
  const { t } = useTranslation();
  const selectReportType = useSelector(
    (state) => state.reportAdpAbpType.updateReportType
  );
  const selectedOption = useSelector(
    (state) => state.reportAdpAbpType.selectedOption
  );
  const { selectedState, selectedDistrict, selectedBlock } = useSelector((state) => state.locationAdp);

  const finalData = useSelector((state) => state.reportAdpAbpType.finalData);
  const allYearsData = useSelector((state) => state.reportAdpAbpType.allYearDataForGraph)
  const [combinedData, setCompinedData] = useState([])
  const [data, setData] = useState([])
  let combinedDatas
  if (Array.isArray(allYearsData)) {
    combinedDatas = allYearsData.reduce((acc, yearData) => {
      if (Array.isArray(yearData.data)) {
        return acc.concat(yearData.data.map(item => ({
          ...item,
          year: yearData.year
        })));
      }
      return acc;
    }, []);


  } else {
    console.log('allYearsData is not an array');
  }
  console.log(data, "combinedData");
  useEffect(() => {
    setCompinedData(combinedDatas)
  }, [finalData])
  useEffect(() => {
    let filteredData = combinedData;
    if (selectedState && selectedState !== SelectState) {
      filteredData = filteredData?.filter(
        (item) => item.lgd_state_name === selectedState
      );
    }

    if (
      selectedDistrict &&
      selectedDistrict !== AllDistrict &&
      selectedDistrict !== SelectDistrict
    ) {
      filteredData = filteredData.filter(
        (item) => item.lgd_district_name === selectedDistrict
      );
    }

    if (
      selectedBlock &&
      selectedBlock !== AllBlock &&
      selectedBlock !== SelectBlock
    ) {
      filteredData = filteredData?.filter(
        (item) => item.lgd_block_name === selectedBlock
      );
    }
    filteredData = filteredData?.map((item) => ({
      ...item,
      Location: getLocationName(item),
    }));
    setData(filteredData);


    // dispatch(setUpdateStatus(false))
  }, [
    selectedState,
    selectedDistrict,
    selectedBlock,
    combinedData,
    selectReportType,
  ]);
  const getLocationName = (item) => {
    if (selectReportType === "ABP_Report") {
      if (
        selectedBlock &&
        selectedBlock !== AllBlock &&
        selectedBlock !== SelectBlock
      ) {
        return `${item.lgd_block_name}`;
      } else if (
        selectedDistrict &&
        selectedDistrict !== AllDistrict &&
        selectedDistrict !== SelectDistrict
      ) {
        return `${item.lgd_block_name}`;
      } else if (selectedState && selectedState !== SelectState) {
        return `${item.lgd_district_name}`;
      } else if (selectedState === SelectState) {
        return `${item.lgd_state_name}`;
      }

    } else if (selectReportType === "ADP_Report") {
      if (selectedState && selectedState !== SelectState) {
        return `${item.lgd_district_name}`;
      } else if (
        selectedState !== SelectState &&
        selectedState !== AllDistrict
      ) {
        return `${item.lgd_district_name}`;
      } else if (selectedState === SelectState) {
        return `${item.lgd_state_name}`;
      }
    }
    return "";
  };

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
      // categories: categoriesYear,
      gridLineWidth: 0, // Remove horizontal grid lines
      lineWidth: 0,
    },
    yAxis: {
      title: {
        text: "",
      },
      gridLineWidth: 0, // Remove horizontal grid lines
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
        name: "Years",
        data: [],
        color: "#E6694A",
        marker: {
          symbol: "circle",
        },
      },
    ],
    exporting: {
      filename: t("ptr_last_five_years_school_category"),
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
              <h2 className="heading-sm">Year Wise Data</h2>
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
