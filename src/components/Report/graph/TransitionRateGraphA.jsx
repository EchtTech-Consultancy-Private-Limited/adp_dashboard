import React, { useState } from 'react';
import './graph.scss';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { useSelector } from 'react-redux';

export default function TransitionRateGraphA() {
    const finalData = useSelector((state) => state.reportAdpAbpType.finalData);
    const selectedOption = useSelector((state) => state.reportAdpAbpType.selectedOption);
    const selectReportType = useSelector((state) => state.reportAdpAbpType.updateReportType);
    const [selectedValue, setSelectedValue] = useState('Boys');

    const getChartData = (data) => {
        const DistrictName = data.map((district) => district.lgd_district_name);
        const blockName = data.map((block) => block.lgd_block_name);
        const totalData = data.map((district) =>
            selectedOption === 'upper_primary_to_secondary' ? district.upri_t : district.sec_t
        );
        const boysData = data.map((district) =>
            selectedOption === 'secondary_to_higher_secondary' ? district.sec_b : district.upri_b
        );
        const girlsData = data.map((district) =>
            selectedOption === 'upper_primary_to_secondary' ? district.upri_g : district.sec_g
        );
        const boysDataPoints = totalData.map((total, index) => ({
            x: total,
            y: boysData[index],
            name:selectReportType==="ADP_Report"? DistrictName[index]:blockName[index]
        }));
        const girlsDataPoints = totalData.map((total, index) => ({
            x: total,
            y: girlsData[index],
            name:selectReportType==="ADP_Report"? DistrictName[index]:blockName[index]
        }));
        return { boysDataPoints, girlsDataPoints };
    };

    const { boysDataPoints, girlsDataPoints } = getChartData(finalData);

    const handleChange = (event) => {
        setSelectedValue(event.target.value);
    };

    return (
        <div className="col-md-12">
            <div className="graph-card">
                <div className="d-flex align-items-center justify-content-between">
                    <h4 className='heading-sm'>Label Wise Transition Rate of {selectReportType === "ADP_Report" ? "District" : "Block"} </h4>
                </div>
                <div className="graph mt-2">
                    <div className="radio-button">
                        <div className="box-radio">
                            <input
                                type="radio"
                                id="boys"
                                value="Boys"
                                checked={selectedValue === 'Boys'}
                                onChange={handleChange}
                            />
                            <label htmlFor="boys">Boys</label>
                        </div>
                        <div className="box-radio ms-4">
                            <input
                                type="radio"
                                id="girls"
                                value="Girls"
                                checked={selectedValue === 'Girls'}
                                onChange={handleChange}
                            />
                            <label htmlFor="girls">Girls</label>
                        </div>
                    </div>
                    <HighchartsReact
                        highcharts={Highcharts}
                        options={{
                            chart: {
                                type: 'scatter',
                                marginTop: 20,
                                height: 450,
                                zooming: {
                                    type: 'xy'
                                }
                            },
                            title: {
                                text: '',
                                align: 'left'
                            },
                            xAxis: {
                                title: {
                                    text: 'Total Transition Rate',
                                    margin: 20,
                                    style: {
                                        color: '#000',
                                        fontWeight: 'bold'
                                    }
                                },
                                labels: {
                                    format: '{value} %'
                                },
                                startOnTick: true,
                                endOnTick: true,
                                showLastLabel: true,
                                lineWidth: 1,
                                lineColor: '#ddd'
                            },
                            yAxis: {
                                title: {
                                    text: selectedValue,
                                    style: {
                                        color: '#000',
                                        fontWeight: 'bold'
                                    }
                                },
                                labels: {
                                    format: '{value} %'
                                },
                                gridLineWidth: 0,
                                lineWidth: 1,
                                lineColor: '#ddd'
                            },
                            legend: {
                                enabled: false
                            },
                            plotOptions: {
                                scatter: {
                                    marker: {
                                        radius: 2.5,
                                        symbol: 'circle',
                                        lineWidth: 0,
                                        lineColor: null,
                                        states: {
                                            hover: {
                                                enabled: true,
                                                lineColor: 'rgb(100,100,100)'
                                            }
                                        }
                                    },
                                    states: {
                                        hover: {
                                            marker: {
                                                enabled: false
                                            }
                                        }
                                    },
                                    jitter: {
                                        x: 0.005
                                    },
                                    dataLabels: {
                                        enabled: false,
                                        formatter: function () {
                                            return `${this.point.y}`;
                                        }
                                    }
                                }
                            },
                            tooltip: {
                                formatter: function () {
                                    return `<b>${this.point.name}</b><br/>Total: ${this.point.x} % <br/> ${this.series.name}: ${this.point.y}`;
                                }
                            },
                            credits: {
                                enabled: false
                            },
                            series: [
                                {
                                    name: selectedValue === 'Boys' ? 'Boys' : 'Girls',
                                    data: selectedValue === 'Boys' ? boysDataPoints : girlsDataPoints,
                                    color: selectedValue === 'Boys' ? '#FFB74BF0' : '#2B9C9F',
                                    pointWidth: 20
                                }
                            ]
                        }}
                        immutable={true}
                    />
                </div>
            </div>
        </div>
    );
}
