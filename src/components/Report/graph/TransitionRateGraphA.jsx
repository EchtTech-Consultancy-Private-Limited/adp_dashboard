import React, { useState } from 'react';
import './graph.scss';
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useSelector } from 'react-redux';

export default function TransitionRateGraphA() {
    const selectReportType = useSelector((state) => state.reportAdpAbpType.updateReportType);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const finalData = useSelector((state) => state.reportAdpAbpType.finalData);
    const selectedOption = useSelector((state) => state.reportAdpAbpType.selectedOption);

    const combinedData = (data) => data?.map((district) => ({
        ...district,
        combinedScore: district.upri_t + district.sec_t,
    })).sort((a, b) => b.combinedScore - a.combinedScore);

    const TopDistricts = combinedData(finalData)?.slice(0, 10);
    const AllDistricts = combinedData(finalData);

    const getChartData = (data) => {
        const categories = data.map((district) => selectReportType === "ADP_Report" ? district.lgd_district_name : district.lgd_block_name);
        const boysData = data.map((district) => selectedOption === "secondary_to_higher_secondary" ? district.sec_b : district.upri_b);
        const girlsData = data.map((district) => selectedOption === "upper_primary_to_secondary" ? district.upri_g : district.sec_g);
        return { categories, boysData, girlsData };
    };

    const { categories: topCategories, boysData: topBoysData, girlsData: topGirlsData } = getChartData(TopDistricts || []);
    const { categories, boysData, girlsData } = getChartData(AllDistricts?.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage) || []);

    const totalPages = Math.ceil((AllDistricts?.length || 0) / itemsPerPage);

    const handleClick = (page) => {
        setCurrentPage(page);
    };

    const chartOptions = (categories, boysData, girlsData, title) => ({
        chart: {
            type: "bar",
            marginTop: 50,
            height: 500,
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
            categories,
            title: {
                text: null,
            },
            gridLineWidth: 1,
            lineWidth: 0,
        },
        yAxis: {
            min: 0,
            title: {
                enabled: false,
            },
            labels: {
                overflow: "justify",
            },
            gridLineWidth: 0,
        },
        title: {
            text: title,
        },
        tooltip: {
            valueSuffix: "%",
        },
        plotOptions: {
            bar: {
                borderRadius: "50%",
                dataLabels: {
                    enabled: true,
                    formatter: function () {
                        return "<b>" + this.point.y + "%";
                    },
                },
                groupPadding: 0.1,
                pointPadding: 0.1,
            },
        },
        legend: {
            layout: "horizontal",
            align: "left",
            verticalAlign: "top",
            itemMarginTop: 0,
            itemMarginBottom: 50,
        },
        credits: {
            enabled: false,
        },
        series: [{
            name: 'Boys',
            color: "#FFB74BF0",
            data: boysData,
            pointWidth: 12,
        }, {
            name: 'Girls',
            color: "#2B9C9F",
            data: girlsData,
            pointWidth: 12,
        }],
    });

    return (


        <div className="col-md-12">
            <div className='graph-card'>
                <h4 className='heading-sm'>Year Wise {selectReportType === "ADP_Report" ? "District" : "Block"} Transition Rate</h4>
                <div className='graph'>
                    <HighchartsReact
                        highcharts={Highcharts}
                        options={chartOptions(categories, boysData, girlsData, "Year Wise District Transition Rate")}
                        immutable={true}
                    />
                </div>
                <div className="chart-button">
                    <button className='btn btn-d me-3' disabled={currentPage === 1} onClick={() => handleClick(currentPage - 1)}>
                        Previous
                    </button>
                    <span>Page {currentPage} of {totalPages}</span>
                    <button className='btn btn-next ms-3' disabled={currentPage === totalPages} onClick={() => handleClick(currentPage + 1)}>
                        Next
                    </button>
                </div>
            </div>
        </div>

    );
}