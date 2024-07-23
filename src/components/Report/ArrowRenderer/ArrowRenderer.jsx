
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
    const [arrowData, setArrowData] = useState([]);

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
        if (location.pathname === "/student-performance") {
            setArrowData(data?.swsn_teacher_percent);
        }
        if (location.pathname === "/school-infrastructure") {
            setArrowData(data?.sch_having_toilet_40_percent);
        }
    }, [selectedOption, data, location]);

    const renderArrow = () => {
        if (location.pathname === "/transition-rate") {
            if (selectedOption === "upper_primary_to_secondary") {
                if (arrowData >= 70 && arrowData <= 100) {
                    return (
                        <ArrowUpwardIcon
                            style={{ color: "green", marginLeft: "5px", fontSize: "14px" }}
                        />
                    );
                } else {
                    return (
                        <ArrowDownwardIcon
                            style={{ color: "red", marginLeft: "5px", fontSize: "14px" }}
                        />
                    );
                }
            } else {
                if (arrowData >= 40 && arrowData <= 100) {
                    return (
                        <ArrowUpwardIcon
                            style={{ color: "green", marginLeft: "5px", fontSize: "14px" }}
                        />
                    );
                } else {
                    return (
                        <ArrowDownwardIcon
                            style={{ color: "red", marginLeft: "5px", fontSize: "14px" }}
                        />
                    );
                }
            }
        }
        if (location.pathname === "/teacher-and-school-resources") {
            if (arrowData >= 40 && arrowData <= 100) {
                return (
                    <ArrowUpwardIcon
                        style={{ color: "green", marginLeft: "5px", fontSize: "14px" }}
                    />
                );
            } else {
                return (
                    <ArrowDownwardIcon
                        style={{ color: "red", marginLeft: "5px", fontSize: "14px" }}
                    />
                );
            }
        }
        if (location.pathname === "/student-performance") {
            if (arrowData >= 40 && arrowData <= 100) {
                return (
                    <ArrowUpwardIcon
                        style={{ color: "green", marginLeft: "5px", fontSize: "14px" }}
                    />
                );
            } else {
                return (
                    <ArrowDownwardIcon
                        style={{ color: "red", marginLeft: "5px", fontSize: "14px" }}
                    />
                );
            }
        }
        if (location.pathname === "/school-infrastructure") {
            if (arrowData >= 40 && arrowData <= 100) {
                return (
                    <ArrowUpwardIcon
                        style={{ color: "green", marginLeft: "5px", fontSize: "14px" }}
                    />
                );
            } else {
                return (
                    <ArrowDownwardIcon
                        style={{ color: "red", marginLeft: "5px", fontSize: "14px" }}
                    />
                );
            }
        }
    };

    return (
        <span>
            {value}
            {renderArrow()}
        </span>
    );
}

export default ArrowRenderer;
