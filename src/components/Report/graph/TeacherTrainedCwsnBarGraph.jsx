import React from 'react';
import './graph.scss';
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";
import TeacherTrainedCwsnScatterGraph from './TeacherTrainedCwsnScatterGraph.jsx';

export default function TeacherTrainedCwsnBarGraph() {
    const selectReportType = useSelector((state) => state.reportAdpAbpType.updateReportType);
    const { t } = useTranslation();
    const finalData = useSelector((state) => state.reportAdpAbpType.finalData);
    const selectedOption = useSelector((state) => state.reportAdpAbpType.selectedOption);
    const combinedData = (data) => data?.map((district) => ({
        ...district,
        combinedScore: district.swsn_teacher_percent,
    })).sort((a, b) => b.combinedScore - a.combinedScore);

    const TopDistricts = combinedData(finalData?.slice(0, 10));

    const getChartData = (data) => {
        const categories = data?.map((district) => selectReportType === "ADP_Report" ? district.lgd_district_name : district.lgd_block_name);
        const cwsnData = data?.map((district) =>  Number(parseFloat(district.swsn_teacher_percent).toFixed(2)));

        return { categories, cwsnData };
    };

    const { categories: topCategories, cwsnData: topCwsnData } = getChartData(TopDistricts || []);

    const headingText = TopDistricts.length < 10
    ? `${t('performance_of')} ${selectReportType === "ADP_Report" ? t('district') : t('block')} ${t('by_teacher_trained_cwsn')}`
    : `${t('top_ten')} ${selectReportType === "ADP_Report" ? t('district') : t('block')}  ${t('teacher_trained_cwsn')}`;



    const chartOptions = (categories, cwsnData, title) => ({
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
        title: {
            text: headingText,
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
            name: t('cwsn'),
            color: "#17AFD2",
            data: cwsnData,
            pointWidth: 12,
        },],
        exporting: {
            filename: headingText,
            csv: {
              columnHeaderFormatter: function (item) {
                if (
                  !item ||
                  item instanceof Highcharts.Axis
                ) {
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
                            options={chartOptions(topCategories, topCwsnData, "Top 10 Districts")}
                            immutable={true}
                        />
                    </div>
                </div>
            </div>

            <div className="col-md-6">
                <TeacherTrainedCwsnScatterGraph />

            </div>
        </div>
    );
}