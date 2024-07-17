
import React, { useState, useEffect, useMemo, useCallback} from "react"

import { AgGridReact } from "ag-grid-react";
import "ag-grid-enterprise";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-material.css";
import aspirationalAbpData from "../../../aspirational-reports-data/aspirational.json"
import aspirationalAdpData from "../../../aspirational-reports-data/aspirationalDistrict.json";
import aspirationalAdpData2020 from "../../../aspirational-reports-data/aspirationalAdpData2020-21.json";
// import aspirationalAbpData2021 from "../../../aspirational-reports-data/aspirationalAbpData.json";
import aspirationalAdpData2021 from "../../../aspirational-reports-data/aspirationalAdpData2021-22.json";
// import aspirationalAbpData2022 from "../../../aspirational-reports-data/aspirationalAbpData.json";
import aspirationalAdpData2022 from "../../../aspirational-reports-data/aspirationalAdpData2022-23.json";
import { useDispatch, useSelector } from "react-redux";
import { setgirdAPIForCommonData, SetSheetName } from "../../../redux/slice/reportTypeSlice";
export function CommonData() {
const dispatch=useDispatch()
    const [aspirationalAllData, setAspirationalAllData] = useState([]);
    const { selectedState } = useSelector((state) => state.locationAdp);
    const selectedYear = useSelector((state) => state.reportAdpAbpType.selectedYear);
    const selectReportType = useSelector((state) => state.reportAdpAbpType.updateReportType);
    const combinedData = {
        "2020-21": {
            ADP_Report: aspirationalAdpData2020,
            ABP_Report: aspirationalAbpData,
        },
        "2021-22": {
            ADP_Report: aspirationalAdpData2021,
            ABP_Report: aspirationalAbpData,
        },
        "2022-23": {
            ADP_Report: aspirationalAdpData2022,
            ABP_Report: aspirationalAbpData,
        },
    };

    useEffect(() => {
        const selectedData = combinedData[selectedYear][selectReportType];
        if (selectedData) {

            setAspirationalAllData(selectedData)
        }
    }, [selectReportType, selectedYear]);

    useEffect(() => {
        if (selectReportType === "ADP_Report") {
            dispatch(SetSheetName("Aspirational District Programme"));
        } else if (selectReportType === "ABP_Report") {
          
           dispatch( SetSheetName("Aspirational Block Programme"));
        }
    }, [ selectReportType]);
    
    const percentageRenderer = (params) => {
        return `${params.value} %`;
    };

    const [columns, setColumn] = useState([
        {
            headerName: "Serial Number",
            field: "Serial Number",
            hide: true,
            suppressColumnsToolPanel: true,
            suppressFiltersToolPanel: true,
        },
        {
            headerName: "State",
            field: "lgd_state_name",
        },
        {
            headerName: "District",
            field: "lgd_district_name",
        },
        {
            headerName: "Block",
            field: "lgd_block_name",
        },
    ]);

    useEffect(() => {
        if (selectedState === "All State") {
            const columns = [
                {
                    headerName: "Serial Number",
                    field: "Serial Number",
                    hide: true,
                    suppressColumnsToolPanel: true,
                    suppressFiltersToolPanel: true,
                },
                {
                    headerName: "",
                    children: [
                        {
                            headerName: "State",
                            field: "lgd_state_name",
                        },
                        {
                            headerName: "District",
                            field: "lgd_district_name",
                        },

                        ...(selectReportType === "ABP_Report" ? [{
                            headerName: "Block",
                            field: "lgd_block_name",
                        }] : [])
                    ]
                },
                {
                    headerName: "Primary to Upper Primary",
                    children: [
                        {
                            headerName: "Boys",
                            field: "upri_b",
                            cellRenderer: percentageRenderer,
                            hide: false,
                        },
                        {
                            headerName: "Girls",
                            field: "upri_g",
                            cellRenderer: percentageRenderer,
                            hide: false,
                        },
                        {
                            headerName: "Total",
                            field: "upri_t",
                            cellRenderer: percentageRenderer,
                            hide: false,
                        }
                    ]
                },
                {
                    headerName: "Secondary to Heigher Secondary",
                    children: [
                        {
                            headerName: "Boys",
                            field: "upri_b",
                            cellRenderer: percentageRenderer,
                            hide: false,
                        },
                        {
                            headerName: "Girls",
                            field: "upri_g",
                            cellRenderer: percentageRenderer,
                            hide: false,
                        },
                        {
                            headerName: "Total",
                            field: "upri_t",
                            cellRenderer: percentageRenderer,
                            hide: false,
                        }
                    ]
                },
                {
                    headerName: "",
                    children: [
                        {
                            headerName: "Number of Elementary Schools having PTR less than equal to 30",
                            field: "u_ptr",
                            hide: false,
                        },
                        {
                            headerName: "Number of Elementary Schools ",
                            field: "total_sch_ele",
                            hide: false,
                        },
                        {
                            headerName: "Percentage of elementary schools having PTR less than equal to 30",
                            field: "ele_sch_percent",
                            cellRenderer: percentageRenderer,
                            hide: false,
                        },
                        {
                            headerName: "Number of Schools having teacher trained to teach CWSN",
                            field: "total_school_cwsn",
                            hide: false,
                        },
                        {
                            headerName: "Total Number of Schools",
                            field: "tot_school",
                            hide: false,
                        },
                        {
                            headerName: "% Schools with Teachers trained for teaching CWSN",
                            field: "swsn_teacher_percent",
                            cellRenderer: percentageRenderer,
                            hide: false,
                        },
                        {
                            headerName: "Total number of Coed and Girls Schools",
                            field: "tot_school_girl_co_ed",
                            hide: false,
                        },
                        {
                            headerName: "Number of Schools having Functional girls toilets",
                            field: "total_no_of_fun_girls_toilet",
                            hide: false,
                        },
                        {
                            headerName: "Percentange of Schools having Functional Girls Toilets",
                            field: "functional_toilet_girls_percent",
                            cellRenderer: percentageRenderer,
                            hide: false,
                        },
                        {
                            headerName: "Number of Schools having girls toilets in the ratio of 40:1",
                            field: "toilet_40",
                            hide: false,
                        },
                        {
                            headerName: "Percent",
                            field: "sch_having_toilet_40_percent",
                            cellRenderer: percentageRenderer,
                            hide: false,
                        },
                    ]
                }
            ];

            setColumn(columns);
        }
    }, [selectedState, selectReportType]);

    const onGridReady = useCallback((params) => {
    dispatch(setgirdAPIForCommonData(params))
    }, []);
    const defColumnDefs = useMemo(
        () => ({
            flex: 1,
            minWidth: 150,
            enableValue: true,
            enableRowGroup: true,
            enablePivot: true,
            sortable: true,
            filter: true,
            resizable: true,
        }),
        []
    );
    return (
        <>
            <div
                className="multi-header-table ag-theme-material ag-theme-custom-height ag-theme-quartz h-300"
                style={{ width: "100%", height: 300 }}
            >
                <AgGridReact
                    columnDefs={columns}
                    rowData={aspirationalAllData}
                    defaultColDef={defColumnDefs}
                    onGridReady={onGridReady}
                />
            </div>
        </>
    )
}