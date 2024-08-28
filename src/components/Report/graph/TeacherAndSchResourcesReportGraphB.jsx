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
  AllDistrict,
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
  const [combinedData, setCombinedData] = useState([]);

  const countDistrictsOrBlocks = (data) => {
    let totalCount = 0;

    if (selectReportType === "ADP_Report") {
    
      if (selectedState === SelectState) {
        totalCount = new Set(data.map((item) => item.lgd_district_name)).size;
      } else if (selectedState !== SelectState) {
        const filteredData = data.filter(
          (item) => item.lgd_state_name === selectedState
        );
        totalCount = new Set(filteredData.map((item) => item.lgd_district_name))
          .size;
      }   
      else if (selectedDistrict !== AllDistrict && selectedDistrict !== SelectDistrict) { 
        const filteredData = data.filter(
          (item) => item.lgd_district_name === selectedDistrict
        );
        
        totalCount = new Set(filteredData.map((item) => item.lgd_district_name))
          .size
      }
    } else {
      if (selectedState === SelectState) {
        totalCount = new Set(data.map((item) => item.lgd_block_id)).size;
      } else {
        const filteredData = data.filter(
          (item) => item.lgd_state_name === selectedState
        );
        totalCount = new Set(filteredData.map((item) => item.lgd_block_name))
          .size;
      }
    }

    return totalCount;
  };



  const processData = (data) => {
    const totalCount = countDistrictsOrBlocks(data);
    if (selectedState === SelectState) {
      const total = data.reduce(
        (acc, item) => acc + (item.ele_sch_percent || 0),
        0
      );
      return parseFloat((total / totalCount).toFixed(2));
    } else if(selectedState !== SelectState){
      const filteredData = data.filter(
        (item) => item.lgd_state_name === selectedState
      );
      const total = filteredData.reduce(
        (acc, item) => acc + (item.ele_sch_percent || 0),
        0
      );
      return parseFloat((total / totalCount).toFixed(2));
    }
    else if(selectedDistrict !== AllDistrict && selectedDistrict !== SelectDistrict){
      const filteredData = data.filter(
        (item) => item.lgd_district_name === selectedDistrict
      );
      const total = filteredData.reduce(
        (acc, item) => acc + (item.ele_sch_percent || 0),
        0
      );
      return parseFloat((total / totalCount).toFixed(2));
    }
  };


  useEffect(() => {
    const dataForChart = [];
  
    if (selectReportType === "ADP_Report") {
   
      dataForChart.push(
        {
          year: "2020-21",
          value: processData(aspirationalAdpData2020),
        },
        {
          year: "2021-22",
          value: processData(aspirationalAdpData2021),
        },
        {
          year: "2022-23",
          value: processData(aspirationalAdpData2022),
        }
      );
    } else {
      
      dataForChart.push(
        {
          year: "2019-20",
          value: processData(aspirationalAbpData2019),
        },
        {
          year: "2020-21",
          value: processData(aspirationalAbpData2020),
        },
        {
          year: "2021-22",
          value: processData(aspirationalAbpData2021),
        },
        {
          year: "2022-23",
          value: processData(aspirationalAbpData2022),
        }
      );
    }
  
    setCombinedData(dataForChart);
  }, [selectedState, selectReportType]);
  

  const categoriesYear = combinedData.map((data) => data.year);
  const eleSchPercentValues = combinedData.map((data) => data.value);

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
      categories: categoriesYear,
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
        data: eleSchPercentValues,
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
