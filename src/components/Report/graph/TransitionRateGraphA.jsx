import React, { useState } from 'react';
import './graph.scss';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import Exporting from 'highcharts/modules/exporting';
import { useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";
Exporting(Highcharts);
export default function TransitionRateGraphA() {
    const { t } = useTranslation();
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
            name: selectReportType === "ADP_Report" ? DistrictName[index] : blockName[index]
        }));
        const girlsDataPoints = totalData.map((total, index) => ({
            x: total,
            y: girlsData[index],
            name: selectReportType === "ADP_Report" ? DistrictName[index] : blockName[index]
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
                    <h4 className='heading-sm'>{t('label_wise_transition_rate')}  </h4>
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
                            <label htmlFor="boys">{t('boys')}</label>
                        </div>
                        <div className="box-radio ms-4">
                            <input
                                type="radio"
                                id="girls"
                                value="Girls"
                                checked={selectedValue === 'Girls'}
                                onChange={handleChange}
                            />
                            <label htmlFor="girls">{t('girls')}</label>
                        </div>
                    </div>
                    <HighchartsReact
                        highcharts={Highcharts}
                        options={{
                            chart: {
                                type: 'scatter',
                                marginTop: 50,
                                height: 450,
                                zooming: {
                                    type: 'xy'
                                },

                                events: {
                                    beforePrint: function () {
                                        this.update({
                                            legend: {
                                                layout: "horizontal",
                                                align: "left",
                                                verticalAlign: "top",
                                                itemMarginTop: 20,
                                            },
                                            chart: {
                                                marginTop: 200,  // Increase marginTop for print
                                            }
                                        });
                                        this.exportSVGElements[0].box.hide();
                                        this.exportSVGElements[1].hide();
                                    },
                                    afterPrint: function () {
                                        this.update({
                                            legend: {
                                                layout: "horizontal",
                                                align: "left",
                                                verticalAlign: "top",
                                                itemMarginTop: 0,
                                            },
                                            chart: {
                                                marginTop: 50,
                                            }
                                        });
                                        this.exportSVGElements[0].box.show();
                                        this.exportSVGElements[1].show();
                                    },               
                                },










                            },
                            title: {
                                text: t('label_wise_transition_rate'),
                                align: 'middle'
                            },
                            xAxis: {
                                title: {
                                    text: t('total_transition_rate'),
                                    margin: 10,
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
                                    text:  selectedValue === 'Boys' ? t('boys'):t('girls'),
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
                                        radius: Math.max(2.1, 3.5 - (selectedValue === 'Boys' ? boysDataPoints : girlsDataPoints).length / 100),
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
                                        x: 0.02, 
                                        y: 0.02
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
                                    return `<b>${selectReportType === "ADP_Report" ? "District's" : "Block's"}</b> :- <br/><b>${this.point.name} </b><br/>Total: ${this.point.x} % <br/> ${this.series.name}: ${this.point.y}%`;
                                }
                            },
                            credits: {
                                enabled: false
                            },
                            series: [
                                {
                                    name: selectedValue === 'Boys' ? t('boys'):t('girls'),
                                    data: selectedValue === 'Boys' ? boysDataPoints : girlsDataPoints,
                                    color: selectedValue === 'Boys' ? '#FFB74BF0' : '#2B9C9F',
                                    pointWidth: 20
                                }
                            ],
                            exporting: {
                                filename:t('label_wise_transition_rate'),
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
    );
}
