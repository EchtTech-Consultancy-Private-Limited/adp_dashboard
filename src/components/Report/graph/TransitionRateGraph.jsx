import React from 'react';
import './graph.scss';
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useSelector } from 'react-redux';
import TransitionRateGraphA from './TransitionRateGraphA';
import { useTranslation } from "react-i18next";

export default function TransitionRateGraph() {
    const selectReportType = useSelector((state) => state.reportAdpAbpType.updateReportType);
    const { t } = useTranslation();
    const finalData = useSelector((state) => state.reportAdpAbpType.finalData);
    const selectedOption = useSelector((state) => state.reportAdpAbpType.selectedOption);

    const combinedData = (data) => data?.map((district) => ({
        ...district,
        combinedScore: district.upri_t + district.sec_t,
    })).sort((a, b) => b.combinedScore - a.combinedScore);

    const TopDistricts = combinedData(finalData)?.slice(0, 10);

    const getChartData = (data) => {
        const categories = data.map((district) => selectReportType === "ADP_Report" ? district.lgd_district_name : district.lgd_block_name);
        const boysData = data.map((district) => selectedOption === "secondary_to_higher_secondary" ? district.sec_b : district.upri_b);
        const girlsData = data.map((district) => selectedOption === "upper_primary_to_secondary" ? district.upri_g : district.sec_g);
        return { categories, boysData, girlsData };
    };

    const { categories: topCategories, boysData: topBoysData, girlsData: topGirlsData } = getChartData(TopDistricts || []);

    const headingText = TopDistricts.length < 10
    ? `${t('performance_of')} ${selectReportType === "ADP_Report" ? t('district') : t('block')} ${t('by_transition_rate')}`
    : `${t('top_ten')} ${selectReportType === "ADP_Report" ? t('district') : t('block')}  ${t('transition_rate')}`;

    const chartOptions = (categories, boysData, girlsData, title) => ({
        chart: {
            type: "bar",
            marginTop: 50,
            height: 500,
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
            text: headingText,
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
            name: t('boys'),
            color: "#17AFD2",
            data: boysData,
            pointWidth: 12,
        }, {
            name: t('girls'),
            color: "#6C6CB0",
            data: girlsData,
            pointWidth: 12,
        }],
        exporting: {
            filename: headingText,
            chartOptions: {
                chart: {
                    marginTop: 80, 
                },
                legend: {
                    layout: "horizontal",
                    align: "left",
                    verticalAlign: "top",
                },
            },
            csv: {
              columnHeaderFormatter: function (item) {
                if (!item || item instanceof Highcharts.Axis) {
                  return t("category");
                }
                return item.name;
              },
            },
          },
    });


    return (
        <div className="row">
            <div className="col-md-6">
                <div className="graph-card">
                    <h4 className='heading-sm'>{headingText}</h4>
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
        </div>
    );
}