import React from 'react'
import './graph.scss'
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useSelector } from 'react-redux';

export default function TransitionRateGraph() {
    const selectReportType = useSelector((state) => state.reportAdpAbpType.updateReportType);

    const finalData = useSelector((state) => state.reportAdpAbpType.finalData);
         

    console.log("finalData  Graph======>",finalData)
console.log("selectReportType=======>",selectReportType)
         
// Get Top 10 District bases on the boys and girls
    const TopDistricts = finalData
    .map((districts) => ({
      ...districts,
      combinedScore: districts.upri_t + districts.sec_t,
    }))
    .sort((a, b) => b.combinedScore - a.combinedScore)
    .slice(0, 10);

  console.log("TopDistricts======>", TopDistricts);
  console.log(TopDistricts.lgd_district_name)


  const DistrictCategories = TopDistricts.map(district => district.lgd_district_name);
  const BlockCategories=TopDistricts.map(districts=>districts.lgd_block_name )



  const SecBoysData = TopDistricts.map(district => district.sec_b);
  const SecGirlsData = TopDistricts.map(district => district.sec_g);

  const UppBoysData = TopDistricts.map(district => district.upri_b
  );
  const UppGirlsData = TopDistricts.map(district => district.upri_g
      )    ;

//   ***************end 10 District******************





    return (

        <div className="row">
            <div className="col-md-6">



            {selectReportType ==="ADP_Report"?
               
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
                                    categories: DistrictCategories,
                                    title: {
                                        text: null,
                                    },
                                    gridLineWidth: 1,
                                    lineWidth: 0,
                                    marginTop:10,
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
                                    data: UppBoysData
                                }, {
                                    name: 'Girls',
                                    color: "#6C6CB0",
                                    data: UppGirlsData
                                }],
                            }}
                            immutable={true}
                        />

                    </div>
                </div>
                 :


                <div className="graph-card">
                    <h4 className='heading-sm'> Top 10 Blocks </h4>

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
                                    categories: BlockCategories,
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
                                    data: SecBoysData
                                }, {
                                    name: 'Girls',
                                    color: "#6C6CB0",
                                    data: SecGirlsData
                                }],
                            }}
                            immutable={true}
                        />

                    </div>
                </div>
}



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
