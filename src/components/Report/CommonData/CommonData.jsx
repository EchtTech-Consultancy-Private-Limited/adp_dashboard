
import React, { useState, useEffect } from "react"

import "ag-grid-enterprise";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-material.css";
import aspirationalAbpData from "../../../aspirational-reports-data/aspirational.json"
import aspirationalAdpData2020 from "../../../aspirational-reports-data/aspirationalAdpData2020-21.json";
import aspirationalAdpData2021 from "../../../aspirational-reports-data/aspirationalAdpData2021-22.json";
import aspirationalAdpData2022 from "../../../aspirational-reports-data/aspirationalAdpData2022-23.json";
import { useDispatch, useSelector } from "react-redux";
import "jspdf-autotable";
import { setAspirationalAllData, SetSheetName } from "../../../redux/slice/reportTypeSlice";
export function CommonData() {
    const dispatch = useDispatch()
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

            dispatch(setAspirationalAllData(selectedData));
        }
    }, [selectReportType, selectedYear]);

   

    return (
        <>
           
        </>
    )
}