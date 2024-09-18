import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { useLocation } from "react-router-dom";

export function ArrowRenderer({ data, value }) {
    const location = useLocation();
    const selectedOption = useSelector(
        (state) => state.reportAdpAbpType.selectedOption
    );
    const selectReportType = useSelector(
        (state) => state.reportAdpAbpType.updateReportType
    );
    const [arrowData, setArrowData] = useState(null);
    const previousYearDatas = useSelector(
        (state) => state.reportAdpAbpType?.previousYearData
    );
    const [previousYearsValue, setPreviousYearsValue] = useState()
    useEffect(() => {
        if (location.pathname === "/transition-rate") {
            if (selectedOption === "upper_primary_to_secondary") {
                setArrowData(data?.upri_t);
            } else {
                setArrowData(data?.sec_t);
            }
        }
        if (location.pathname === "/teacher-and-school-resources") {
            setArrowData(data?.ele_sch_percent);
        }
        if (location.pathname === "/teachers-trained-for-teaching-CWSN") {
            setArrowData(data?.swsn_teacher_percent);
        }
        if (location.pathname === "/school-infrastructure") {
            setArrowData(data?.sch_having_toilet_40_percent);
        }
    }, [selectedOption, data, location]);

    const renderArrow = () => {
        if (arrowData !== null && previousYearDatas?.length > 0) {
            let previousYearValueObj;
            // Find the corresponding object for the previous year based on the report type
            if (selectReportType === "ADP_Report") {
                previousYearValueObj = previousYearDatas?.find(
                    (item) => item?.lgd_district_id === data?.lgd_district_id
                );
            } else {
                previousYearValueObj = previousYearDatas?.find(
                    (item) => item?.lgd_block_id === data?.lgd_block_id
                );
            }
            if (!previousYearValueObj) {
                return null; 
            }

            let previousYearValue;
            // Set the previous year value based on the pathname and selected option
            if (location.pathname === "/transition-rate") {
                previousYearValue =
                    selectedOption === "upper_primary_to_secondary"
                        ? previousYearValueObj?.upri_t
                        : previousYearValueObj?.sec_t;
            } else if (location.pathname === "/teacher-and-school-resources") {
                previousYearValue = previousYearValueObj?.ele_sch_percent;
            } else if (location.pathname === "/teachers-trained-for-teaching-CWSN") {
                previousYearValue = previousYearValueObj?.swsn_teacher_percent;
            } else if (location.pathname === "/school-infrastructure") {
                previousYearValue = previousYearValueObj?.sch_having_toilet_40_percent;
            }

            // Handle the case where the previous year value is 0
            if (previousYearValue === 0) {
                if (arrowData > 0) {
                    return (
                        <>
                            {`${value} (+∞%)`}
                            <ArrowUpwardIcon style={{ color: "green", marginLeft: "5px", fontSize: "14px" }} />
                        </>
                    );
                } else if (arrowData === 0) {
                    return (
                        <>
                            {`${value} (0%)`}
                        </>
                    );
                }
            }
            if (arrowData > previousYearValue) {
                const percIncrement = ((arrowData - previousYearValue) * 100) / previousYearValue;
                const valueWithPercIncrement = `${value} (+${percIncrement.toFixed(2)}%)`;
                return (
                    <>
                        {valueWithPercIncrement}
                        <ArrowUpwardIcon style={{ color: "green", marginLeft: "5px", fontSize: "14px" }} />
                    </>
                );
            } else if (arrowData < previousYearValue) {
                const percDecrement = ((previousYearValue - arrowData) * 100) / previousYearValue;
                const valueWithPercDecrement = `${value} (-${percDecrement.toFixed(2)}%)`;
                return (
                    <>
                        {valueWithPercDecrement}
                        <ArrowDownwardIcon style={{ color: "red", marginLeft: "5px", fontSize: "14px" }} />
                    </>
                );
            }
        }

        return <>{value}</>;
    };



    return (
        <span>
            {renderArrow()}
        </span>
    );

}

export default ArrowRenderer;

