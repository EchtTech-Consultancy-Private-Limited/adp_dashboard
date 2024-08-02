import React from 'react'
import './graph.scss'
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

export default function TransitionRateGraph() {
    return (

        <div className="row">
            <div className="col-md-6">
                <div className="graph-card">
                    <h4 className='heading-sm'> Top 10 Districts </h4>

                    <div className='graph'>
                        <HighchartsReact
                            highcharts={Highcharts}
                            options={{
                                chart: {
                                    type: "bar",
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
                                    categories: ['Agra', 'Aligarh', 'Allahabad', 'Ambedkar Nagar', 'Amethi-CSM Nagar', 'Auraiya', 'Azamgarh', 'Baghpat', 'Bahraich', 'Ballia'],
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
                                    text: "Top 10 Districts",
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
                                        groupPadding: 0.1,  // Adjust group padding to increase space between bar groups
                                        pointPadding: 0.1,  // Adjust point padding to increase space between bars in the same group
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
                                    data: [23, 42, 81, 98, 98, 79, 98, 59, 18, 26]
                                }, {
                                    name: 'Girls',
                                    color: "#6C6CB0",
                                    data: [59, 78, 59, 81, 59, 81, 74, 79, 71, 39]
                                }],
                            }}
                            immutable={true}
                        />

                    </div>
                </div>
            </div>

            <div className="col-md-6">
                <div className="graph-card">
                    <h4 className='heading-sm'> Year Wise Data </h4>

                    <div className='graph'>
                        <HighchartsReact
                            highcharts={Highcharts}
                            options={{
                                chart: {
                                    type: "bar",
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
                                    categories: ['Agra', 'Aligarh', 'Allahabad', 'Ambedkar Nagar', 'Amethi-CSM Nagar', 'Auraiya', 'Azamgarh', 'Baghpat', 'Bahraich', 'Ballia'],
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
                                    text: "Top 10 Districts",
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
                                        groupPadding: 0.1,  // Adjust group padding to increase space between bar groups
                                        pointPadding: 0.1,  // Adjust point padding to increase space between bars in the same group
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
                                    name: '2022-23',
                                    color: "#FFB74BF0",
                                    data: [23, 42, 81, 98, 98, 79, 98, 59, 18, 26]
                                }, {
                                    name: '2023-24',
                                    color: "#2B9C9F",
                                    data: [59, 78, 59, 81, 59, 81, 74, 79, 71, 39]
                                }],
                            }}
                            immutable={true}
                        />

                    </div>
                </div>
            </div>

        </div>

    )
}
