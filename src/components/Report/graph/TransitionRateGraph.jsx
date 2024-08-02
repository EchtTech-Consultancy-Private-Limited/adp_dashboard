import React, { useState } from 'react'
import './graph.scss'
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useSelector } from 'react-redux';

export default function TransitionRateGraph() {
    const selectReportType = useSelector((state) => state.reportAdpAbpType.updateReportType);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const finalData = useSelector((state) => state.reportAdpAbpType.finalData);
    const selectedOption = useSelector(
        (state) => state.reportAdpAbpType.selectedOption
    );
    // Get Top 10 District bases on the boys and girls
    const TopDistricts = finalData?.map((districts) => ({
            ...districts,
            combinedScore: districts.upri_t + districts.sec_t,
        }))
        .sort((a, b) => b.combinedScore - a.combinedScore)
        .slice(0, 10);

    console.log("TopDistricts======>", TopDistricts);
    console.log(TopDistricts.lgd_district_name)
    let DistrictCategories, BlockCategories, SecBoysData, SecGirlsData, UppBoysData, UppGirlsData;
    if (TopDistricts) {
        DistrictCategories = TopDistricts.map(district => district.lgd_district_name);
        BlockCategories = TopDistricts.map(districts => districts.lgd_block_name)

        SecBoysData = TopDistricts.map(district => district.sec_b);
        SecGirlsData = TopDistricts.map(district => district.sec_g);

        UppBoysData = TopDistricts.map(district => district.upri_b
        );
        UppGirlsData = TopDistricts.map(district => district.upri_g
        );
    }


    // Determine which data to display based on upper to sec and sec to upp
    const boysData = selectedOption === "secondary_to_higher_secondary" ? SecBoysData : UppBoysData;
    const girlsData = selectedOption === "upper_primary_to_secondary" ? UppGirlsData : SecGirlsData;
    console.log(boysData, "boysData")
    console.log(girlsData, "boysData")
    console.log(girlsData, "boysDatas")
    const AllDistricts = finalData?.map((districts) => ({
            ...districts,
            combinedScore: districts.upri_t + districts.sec_t,
        }))
    const totalPages = Math.ceil(AllDistricts.length / itemsPerPage);

    const handleClick = (page) => {
        setCurrentPage(page);
    };

    const paginatedData = AllDistricts?.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    let DistrictCategoriess, BlockCategoriess, SecBoysDatas, SecGirlsDatas, UppBoysDatas, UppGirlsDatas;

    if (paginatedData.length > 0) {
        DistrictCategoriess = paginatedData.map((district) => district.lgd_district_name || 0);
        BlockCategoriess = paginatedData.map((district) => district.lgd_block_name || 0);
        SecBoysDatas = paginatedData.map((district) => district.sec_b || 0);
        SecGirlsDatas = paginatedData.map((district) => district.sec_g || 0);
        UppBoysDatas = paginatedData.map((district) => district.upri_b || 0);
        UppGirlsDatas = paginatedData.map((district) => district.upri_g || 0);
    }
    const boysDatas = selectedOption === "secondary_to_higher_secondary" ? SecBoysDatas : UppBoysDatas;
    const girlsDatas = selectedOption === "upper_primary_to_secondary" ? UppGirlsDatas : SecGirlsDatas;

    //   ***************end 10 District******************

    return (

        <div className="row">
            <div className="col-md-6">



                {selectReportType === "ADP_Report" ?

                    (<div className="graph-card">
                        <h4 className='heading-sm'> Top 10 Districts </h4>

                        <div className='graph'>
                            <HighchartsReact
                                highcharts={Highcharts}
                                options={{
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
                                        categories: DistrictCategories,
                                        title: {
                                            text: null,
                                        },
                                        gridLineWidth: 1,
                                        lineWidth: 0,
                                        marginTop: 10,
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

                                        data: boysData
                                    }, {
                                        name: 'Girls',
                                        color: "#6C6CB0",
                                        data: girlsData
                                    }],
                                }}
                                immutable={true}
                            />

                        </div>
                    </div>)
                    :
                    (
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
                                            data: boysData
                                        }, {
                                            name: 'Girls',
                                            color: "#6C6CB0",
                                            data: girlsData,
                                            pointWidth: 12,
                                        }],
                                    }}
                                    immutable={true}
                                />

                            </div>
                        </div>)

                }



            </div>

            <div className="col-md-6">


                <div className='graph'>
                    {selectReportType === "ADP_Report" ?

                        (<div className="graph-card">
                            <h4 className='heading-sm'>Year Wise District Transition Rate </h4>

                            <div className='graph'>
                                <HighchartsReact
                                    highcharts={Highcharts}
                                    options={{
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
                                            categories: DistrictCategoriess,
                                            title: {
                                                text: null,
                                            },
                                            gridLineWidth: 1,
                                            lineWidth: 0,
                                            marginTop: 10,
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
                                            color: "#FFB74BF0",

                                            data: boysDatas
                                        }, {
                                            name: 'Girls',
                                            color: "#2B9C9F",
                                            data: girlsDatas
                                        }],
                                    }}
                                    immutable={true}
                                />

                            </div>
                        </div>)
                        :
                        (
                            <div className="graph-card">
                                <h4 className='heading-sm'> Year Wise Block Transition Rate </h4>

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
                                                categories: BlockCategoriess,
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
                                                color: "#FFB74BF0",
                                                data: boysDatas
                                            }, {
                                                name: 'Girls',
                                                color: "#2B9C9F",
                                                data: girlsDatas,
                                                pointWidth: 12,
                                            }],
                                        }}
                                        immutable={true}
                                    />

                                </div>
                            </div>)

                    }
                    <button
                        disabled={currentPage === 1}
                        onClick={() => handleClick(currentPage - 1)}
                    >
                        Previous
                    </button>
                    <span>Page {currentPage} of {totalPages}</span>
                    <button
                        disabled={currentPage === totalPages}
                        onClick={() => handleClick(currentPage + 1)}
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>



    )
}
