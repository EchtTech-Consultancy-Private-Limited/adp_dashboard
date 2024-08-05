import React, { useState } from 'react';
import './graph.scss';
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useSelector } from 'react-redux';

export default function TransitionRateGraphA() {
    const finalData = useSelector((state) => state.reportAdpAbpType.finalData);
    const selectReportType = useSelector((state) => state.reportAdpAbpType.updateReportType);
    const selectedOption = useSelector((state) => state.reportAdpAbpType.selectedOption);
    const [showBoysData, setShowBoysData] = useState(true);
    const { selectedState, selectedDistrict, selectedBlock } = useSelector(
        (state) => state.locationAdp
    );
    console.log("district=>,",selectedDistrict)

    const getChartData = (data) => {
        const totalData = data.map((district) => selectedOption === "upper_primary_to_secondary" ? district.upri_t : district.sec_t);
        const boysData = data.map((district) => selectedOption === "secondary_to_higher_secondary" ? district.sec_b : district.upri_b);
        const girlsData = data.map((district) => selectedOption === "upper_primary_to_secondary" ? district.upri_g : district.sec_g);
        const boysDataPoints = totalData.map((total, index) => [total, boysData[index]]);
        const girlsDataPoints = totalData.map((total, index) => [total, girlsData[index]]);
        return { boysDataPoints,girlsDataPoints};
    };
    const { boysDataPoints,girlsDataPoints} = getChartData(finalData);
  
    const [selectedValue, setSelectedValue] = useState('Boys');
    console.log(selectedValue, "selectedValue")
    const handleChange = (event) => {
        console.log(event.target.value, "kdjfdfjdjf")
        setSelectedValue(event.target.value);
    };

    return (


        <div className="col-md-12">
            <div className="graph-card">
                <div className='d-flex align-items-center justify-content-between'>
                    <h4 className='heading-sm'>Lable wise Transition Rate of District</h4>
                    {/* <div>
                        <select className="form-select download-button">
                            <option value="">Upper Primary to Secondary</option>
                            <option value="">Secondary to Higher Secondary</option>
                        </select>
                    </div> */}
                </div>
                <div className="graph mt-2">
                    <div className="radio-button">
                        <div className="box-radio">
                            <input type="radio" id="boys" value="Boys" checked={selectedValue === 'Boys'} onChange={handleChange} />
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
                                height: 430,
                                zooming: {
                                    type: 'xy'
                                },

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
                                        fontWeight: 'bold' // Make the X-axis title text bold
                                    }
                                },
                                labels: {
                                    format: '{value} %'
                                },
                                startOnTick: true,
                                endOnTick: true,
                                showLastLabel: true,
                                lineWidth: 1,
                                lineColor: '#ddd',
                            },
                            yAxis: {
                                title: {
                                    title: {
                                        text: selectedValue ? 'Boys' : 'Girls'
                                    },
                                    style: {
                                        color: '#000',
                                        fontWeight: 'bold' // Make the X-axis title text bold
                                    }
                                },
                                labels: {
                                    format: '{value} %'
                                },
                                gridLineWidth: 0,
                                lineWidth: 1,
                                lineColor: '#ddd',
                            },
                            legend: {
                                enabled: false,
                            },
                            plotOptions: {
                                scatter: {
                                    marker: {
                                        radius: 2.5,
                                        symbol: 'circle',
                                        lineWidth: 0, // Remove border around markers
                                        lineColor: null, // No color for marker borders
                                        states: {
                                            hover: {
                                                enabled: true,
                                                lineColor: 'rgb(100,100,100)',
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
                                        enabled: true,
                                        formatter: function() {
                                            return `${this.point.y}`;
                                        }
                                    }
                                }
                            },
                            tooltip: {
                                pointFormat: 'Boys: {point.y} %'
                            },
                            credits: {
                                enabled: false,
                            },
                            series: [
                                {
                                    name:'Total',
                                    data: selectedValue ? boysDataPoints : girlsDataPoints,
                                    color:selectedState? "#FFB74BF0":"#2B9C9F",
                                    pointWidth:selectedValue?20:20
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