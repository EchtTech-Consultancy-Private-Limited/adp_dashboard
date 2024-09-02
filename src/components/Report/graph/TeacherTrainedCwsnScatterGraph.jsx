import React from 'react';
import './graph.scss';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";

export default function TeacherTrainedCwsnScatterGraph() {
    const { t } = useTranslation();
    const finalData = useSelector((state) => state.reportAdpAbpType.finalData);
    const selectReportType = useSelector((state) => state.reportAdpAbpType.updateReportType);

    const getChartData = (data) => {
        const DistrictName = data.map((district) => district.lgd_district_name);
        const blockName = data.map((block) => block.lgd_block_name);
        const totalCwsnPercentData = data.map((district) =>
            Number(parseFloat(district.total_school_cwsn).toFixed(2))
        );
        const totalCwsnTotalData = data.map((district) => district?.tot_school);

        const dataPoints = totalCwsnPercentData.map((total, index) => ({
            x: totalCwsnTotalData[index],
            y: total,
            name: selectReportType === "ADP_Report" ? DistrictName[index] : blockName[index]
        }));
        return { dataPoints };
    };

    const { dataPoints } = getChartData(finalData);

    return (
        <div className="col-md-12">
            <div className="graph-card">
                <div className="d-flex align-items-center justify-content-between">
                    <h4 className='heading-sm'>{t('label_wise_teacher_trained_cwsn')}</h4>
                </div>
                <div className="graph mt-2">
                    <HighchartsReact
                        highcharts={Highcharts}
                        options={{
                            chart: {
                                type: 'scatter',
                                marginTop: 50,
                                height: 490,
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
                                    text: t('total_schools_data'),
                                    margin: 10,
                                    style: {
                                        color: '#000',
                                        fontWeight: 'bold'
                                    }
                                },
                                labels: {
                                    format: '{value}'
                                },
                                startOnTick: true,
                                endOnTick: true,
                                showLastLabel: true,
                                lineWidth: 1,
                                lineColor: '#ddd',
                                min: 0 
                            },
                            yAxis: {
                                title: {
                                    text: t('swsn_teacher_percent_data'),
                                    style: {
                                        color: '#000',
                                        fontWeight: 'bold'
                                    }
                                },
                                labels: {
                                    format: '{value}'
                                },
                                gridLineWidth: 0,
                                lineWidth: 1,
                                lineColor: '#ddd',
                                min: 0 
                            },
                            legend: {
                                enabled: false
                            },
                            plotOptions: {
                                scatter: {
                                    marker: {
                                        radius: Math.max(2.1, 3.5 - dataPoints.length / 100),
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
                                        enabled: false
                                    }
                                }
                            },
                            tooltip: {
                                formatter: function () {
                                    return `<b>${selectReportType === "ADP_Report" ? "District's" : "Block's"}</b> :- <br/><b>${this.point.name}</b><br/>Total Schools: ${this.point.y}<br/>Number of Schools with Teachers Trained for CWSN: ${this.point.x}`;
                                }
                            },
                            credits: {
                                enabled: false
                            },
                            series: [
                                {
                                    name: t('swsn_teacher_number'),
                                    data: dataPoints,
                                    color: '#FFB74BF0',
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
