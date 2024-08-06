import React, { useState } from 'react';
import './graph.scss';
import Highcharts, { color } from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useSelector } from 'react-redux';
import TransitionRateGraphA from './TransitionRateGraphA';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
export default function TransitionRateGraph() {
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
            color: "#17AFD2",
            data: boysData,
            pointWidth: 12,
        }, {
            name: 'Girls',
            color: "#6C6CB0",
            data: girlsData,
            pointWidth: 12,
        }],
    });




    return (
        <div className="row">
            <div className="col-md-6">
                <div className="graph-card">
                    <h4 className='heading-sm'>Top 10 {selectReportType === "ADP_Report" ? "Districts" : "Blocks"}</h4>
                    <div className='graph'>
                        <HighchartsReact
                            highcharts={Highcharts}
                            options={chartOptions(topCategories, topBoysData, topGirlsData, "Top 10 Districts")}
                            immutable={true}
                        />
                    </div>
                </div>
            </div>

            <div className="col-md-6">
                <TransitionRateGraphA />

            </div>

            <div className="col-md-12">
                <div className="impact-box-content-education bg-light-blue tab-sdb-blue">
                    <div className="text-btn-d d-flex justify-content-between align-items-center">
                        <h2 className="heading-sm">
                            Comparison of States By Transition Rate
                        </h2>

                        <div className="select-infra button-group-filter">
                            <select id="export_data" className="form-select bg-grey2" defaultValue={""}>
                                <option value="">Upper Primary to Secondary </option>
                                <option value="">Secondary to Higher Secondary</option>
                            </select>
                        </div>

                    </div>

                    <div className="Comparison-box">
                        <div className="row align-items-center">
                            <div className="col-md-2 col-lg-2">
                                <h4 className="sub-heading">Add Districts to Compare</h4>
                            </div>
                            <div className="col-md-10 col-lg-10">
                                <div className="select-infra Comparison-select-group">
                                    <select className="form-select bg-grey2" defaultValue={""}>
                                        <option value="">Add a District </option>
                                        <option value="">District 1</option>
                                    </select>
                                    <select className="form-select bg-grey2" defaultValue={""}>
                                        <option value="">Add a District </option>
                                        <option value="">District 1</option>
                                    </select>
                                    <select className="form-select bg-grey2" defaultValue={""}>
                                        <option value="">Add a District </option>
                                        <option value="">District 1</option>
                                    </select>
                                    <select className="form-select bg-grey2" defaultValue={""}>
                                        <option value="">Add a District </option>
                                        <option value="">District 1</option>
                                    </select>
                                    <select className="form-select bg-grey2" defaultValue={""}>
                                        <option value="">Add a District </option>
                                        <option value="">District 1</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    <Tabs defaultActiveKey="State" id="top-tabs-st-dis-block">
                        <Tab eventKey="State" title="State">
                            <div className="piechart-box row mt-4 align-items-center">
                                <HighchartsReact
                                    highcharts={Highcharts}
                                    options={{
                                        chart: {
                                            type: 'column',
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
                                            categories: [
                                                "Agra",
                                                "Aligarh",
                                                "Allahabad",
                                                "Rajasthan",
                                                "Bihar",
                                            ],
                                            crosshair: true,
                                            accessibility: {
                                                description: 'Categories',
                                            },
                                        },
                                        yAxis: {
                                            allowDecimals: false,
                                            min: 0,
                                            title: {
                                                text: '',
                                            },
                                            gridLineWidth: 0,
                                            lineWidth: 0,
                                        },
                                        title: {
                                            text: 'Top 10 States by Transition Rate',
                                        },
                                        tooltip: {
                                            headerFormat: '<b>{point.x}</b><br/>',
                                            pointFormatter: function () {
                                                return `<span style="color:${this.color}">\u25CF</span> ${this.series.name}: <b>${this.y.toLocaleString('en-IN')}</b><br/>`;
                                            },
                                        },
                                        plotOptions: {
                                            column: {
                                                pointPadding: 0.2,
                                                borderWidth: 0,
                                                pointWidth: 60,
                                            },
                                        },
                                        legend: {
                                            layout: 'horizontal',
                                            align: 'center',
                                            verticalAlign: 'bottom',
                                            itemMarginTop: 10,
                                            itemMarginBottom: 10,
                                            // enabled: false,
                                        },
                                        credits: {
                                            enabled: false,
                                        },
                                        export: {
                                            enabled: true,
                                        },
                                        series: [
                                            {
                                                name: "Primary to Upper Primary",
                                                data: [40, 85, 60, 100, 125],
                                                color: "#b4b7f1",
                                            }
                                        ],
                                    }}
                                    immutable={true}
                                />
                            </div>
                        </Tab>
                        <Tab eventKey="District" title="District">
                            <div className="piechart-box row mt-4 align-items-center">

                            </div>
                        </Tab>
                        <Tab eventKey="Block" title="Block">
                            <div className="piechart-box row mt-4 align-items-center">

                            </div>
                        </Tab>
                    </Tabs>
                </div>

            </div>
        </div>
    );
}