import React, { useState, useEffect, useCallback, useMemo } from "react";
import BannerReportFilter from "./BannerReportFilter";
import table from "../../assets/images/table.svg";
import chart from "../../assets/images/bar-chart.svg";
import "./report.scss";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-enterprise";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-material.css";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { GlobalLoading } from "../GlobalLoading/GlobalLoading";
import {
    setAspirationalAllData,
    SetFinalData,
    setselectedDataAllYear,
    setselectedOption,
    setselectedOptionTop50,
    SetSheetName,
} from "../../redux/slice/reportTypeSlice";
import {
    AllBlock,
    AllDistrict,
    SelectBlock,
    SelectDistrict,
    selectedOptionConst,
    SelectState,
} from "../../constant/Constant";
import { ScrollToTopOnMount } from "../../Scroll/ScrollToTopOnMount";
import TeacherAndSchoolCompare from "./ReportCompare/TeacherAndSchoolCompare";
import TeacherAndSchoolBlockCompare from "./ReportCompare/TeacherAndSchoolBlockCompare";
import ptrLessThanAdp2019 from "../../aspirational-reports-data/ptrLessThanAdp2019-2020.json";
import ptrLessThanAdp2020 from "../../aspirational-reports-data/ptrLessThanAdp2020-2021.json";
import ptrLessThanAdp2021 from "../../aspirational-reports-data/ptrLessThanAdp2021-2022.json";
import ptrLessThanAdp2022 from "../../aspirational-reports-data/ptrLessThanAdp2022-2023.json";
import { ArrowRenderer } from "./ArrowRenderer/ArrowRenderer";
export default function TeacherAndSchResourcesReport() {
    const dispatch = useDispatch();
    const { t, i18n } = useTranslation();
    const [queryParameters] = useSearchParams();
    const id = queryParameters.get("id");
    const type = queryParameters.get("type");
    const [loading, setLoading] = useState(true);
    localStorage.setItem("selectedReport", "Teacher and School Resources");
    const { selectedState, selectedDistrict, selectedBlock } = useSelector(
        (state) => state.locationAdp
    );
    const [locationHeader, SetLocationHeader] = useState();
    const aspirationalData = useSelector(
        (state) => state.reportAdpAbpType.aspirationalAllData
    );
    const selectReportType = useSelector(
        (state) => state.reportAdpAbpType.updateReportType
    );
    const selectedOption = useSelector(
        (state) => state.reportAdpAbpType.selectedOptionTop50
    );
    const updateLoading = useSelector(
        (state) => state.reportAdpAbpType.loadingStatus
    );
    const states = useSelector((state) => state.locationAdp.states);
    const selectedYear = useSelector(
        (state) => state.reportAdpAbpType.selectedYear
    );
    const sheetName = useSelector((state) => state.reportAdpAbpType.sheetName);
    const [gridApi, setGridApi] = useState();
    const savedReportName = localStorage.getItem("selectedReport");
    const report_name = savedReportName;
    const finalData = useSelector((state) => state.reportAdpAbpType.finalData);
    const [data, setData] = useState([]);
    const [topPtrData, setTopPtrData] = useState([])
    const [top50Data, setTop50Data] = useState([])

    const combinedTopData = {
        "2019-20": {
            ADP_Report: ptrLessThanAdp2019,
        },
        "2020-21": {
            ADP_Report: ptrLessThanAdp2020,
        },
        "2021-22": {
            ADP_Report: ptrLessThanAdp2021,
        },
        "2022-23": {
            ADP_Report: ptrLessThanAdp2022,
        },
    };

    useEffect(() => {
        const reportData = combinedTopData[selectedYear] && combinedTopData[selectedYear][selectReportType];

        if (reportData && reportData.length > 0) {
            setTopPtrData(reportData);
        } else {
            setTopPtrData([]);
        }
    }, [selectReportType, selectedYear]);

    const filteredTopeData = useMemo(() => {
        return Array.isArray(topPtrData) && topPtrData.length > 0
            ? topPtrData.filter(topeItem => {
                const districtMatch = selectedDistrict !== "SelectDistrict"
                    ? finalData.some(finalItem => finalItem.lgd_district_name === topeItem.lgd_district_name)
                    : true;

                return districtMatch;
            })
            : [];
    }, [topPtrData, selectedDistrict, finalData, selectedYear]);



    useEffect(() => {
        if (Array.isArray(filteredTopeData) && filteredTopeData.length > 0) {
            const sortedData = filteredTopeData.sort((a, b) => a.Rank - b.Rank);

            if (selectedOption === "Top_50_Schools") {
                setTop50Data(sortedData.slice(0, 50));
            } else if (selectedOption === "Upcoming_50") {
                setTop50Data(sortedData.slice(50, 100));
            }
        } else {
            setTop50Data([]);
        }
    }, [selectedOption, filteredTopeData, selectedYear]);


    function resteData() {
        // dispatch(selectState(SelectState));
        // dispatch(selectDistrict(SelectDistrict));
        // dispatch(selectBlock(SelectBlock));
        dispatch(setselectedOption(selectedOptionConst));
        // dispatch(setSelectedYear(intialYear))
    }
    useEffect(() => {
        resteData();
    }, [dispatch]);

    {
        /*...............update Location Header..............*/
    }
    useEffect(() => {
        if (selectReportType === "ADP_Report") {
            if (
                selectedState !== SelectState &&
                selectedDistrict === SelectDistrict
            ) {
                SetLocationHeader("District");
            }

            dispatch(SetSheetName("Aspirational District Programme"));
        } else if (selectReportType === "ABP_Report") {
            if (
                selectedState !== SelectState &&
                (selectedDistrict === SelectDistrict ||
                    selectedDistrict === AllDistrict)
            ) {
                SetLocationHeader("District");
            } else if (
                selectedState !== SelectState &&
                selectedDistrict !== SelectDistrict
            ) {
                SetLocationHeader("Block");
            }
            dispatch(SetSheetName("Aspirational Block Programme"));
        }
    }, [
        selectedState,
        SelectState,
        selectedDistrict,
        SelectDistrict,
        selectedBlock,
        selectReportType,
    ]);

    {
        /*...............Take data report wise..............*/
    }

    useEffect(() => {
        if (selectedDistrict === SelectDistrict) {
            dispatch(setselectedOptionTop50(""));
        }
    }, [selectedDistrict])
    useEffect(() => {
        let filteredData = aspirationalData;

        if (selectedState && selectedState !== SelectState) {
            filteredData = filteredData.filter(
                (item) => item.lgd_state_name === selectedState
            );
        }

        if (
            selectedDistrict &&
            selectedDistrict !== AllDistrict &&
            selectedDistrict !== SelectDistrict
        ) {
            filteredData = filteredData.filter(
                (item) => item.lgd_district_name === selectedDistrict
            );
        }

        if (
            selectedBlock &&
            selectedBlock !== AllBlock &&
            selectedBlock !== SelectBlock
        ) {
            filteredData = filteredData.filter(
                (item) => item.lgd_block_name === selectedBlock
            );
        }
        filteredData = filteredData.map((item) => ({
            ...item,
            Location: getLocationName(item),
        }));
        setData(filteredData);
        setLoading(false);

        // dispatch(setUpdateStatus(false))
    }, [selectedState, selectedDistrict, selectedBlock, aspirationalData, selectReportType]);
    const getLocationName = (item) => {
        if (selectReportType === "ABP_Report") {
            if (
                selectedBlock &&
                selectedBlock !== AllBlock &&
                selectedBlock !== SelectBlock
            ) {
                return `${item.lgd_block_name}`;
            } else if (
                selectedDistrict &&
                selectedDistrict !== AllDistrict &&
                selectedDistrict !== SelectDistrict
            ) {
                return `${item.lgd_block_name}`;
            } else if (selectedState && selectedState !== SelectState) {
                return `${item.lgd_district_name}`;
            } else if (selectedState === SelectState) {
                return `${item.lgd_state_name}`;
            }

        } else if (selectReportType === "ADP_Report") {
            if (selectedState && selectedState !== SelectState) {
                return `${item.lgd_district_name}`;
            } else if (
                selectedState !== SelectState &&
                selectedState !== AllDistrict
            ) {
                return `${item.lgd_district_name}`;
            } else if (selectedState === SelectState) {
                return `${item.lgd_state_name}`;
            }
        }
        return "";
    };

    const percentageRenderer = (params) => {
        const value = params.value;

        if (typeof value === "number") {
            return value.toFixed(2) + " " + "%";
        } else {
            return value;
        }
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
                    headerName: "State",
                    field: "lgd_state_name",
                },
                {
                    headerName: "District",
                    field: "lgd_district_name",
                    cellRenderer: selectReportType === "ADP_Report" ? ArrowRenderer : undefined,
                },
                ...(selectReportType === "ABP_Report"
                    ? [
                        {
                            headerName: "Block",
                            field: "lgd_block_name",
                            cellRenderer: ArrowRenderer,
                        },
                    ]
                    : []),
                {
                    headerName:
                        "Number of Elementary Schools having PTR less than equal to 30",
                    field: "u_ptr",
                    hide: false,
                },
                {
                    headerName: "Number of Elementary Schools ",
                    field: "total_sch_ele",
                    hide: false,
                },
                {
                    headerName:
                        "Percentage of elementary schools having PTR less than equal to 30",
                    field: "ele_sch_percent",
                    cellRenderer: percentageRenderer,
                    hide: false,
                },
            ];

            setColumn(columns);
        }
    }, [selectedState, selectReportType]);

    useEffect(() => {
        if (selectedState !== "All State") {
            setColumn([
                {
                    headerName: "Serial Number",
                    field: "Serial Number",
                    hide: true,
                    suppressColumnsToolPanel: true,
                    suppressFiltersToolPanel: true,
                },

                ...(selectReportType === "ADP_Report"
                    ? [
                        {
                            headerName: "District",
                            field: "lgd_district_name",
                            cellRenderer: selectReportType === "ADP_Report" ? ArrowRenderer : undefined,
                        },
                    ]
                    : []),

                ...(selectedState !== "All State" &&
                    selectReportType === "ABP_Report" &&
                    (selectedDistrict === SelectDistrict ||
                        selectedDistrict === AllDistrict)
                    ? [
                        {
                            headerName: "District",
                            field: "lgd_district_name",
                            cellRenderer: selectReportType === "ADP_Report" ? ArrowRenderer : undefined,
                        },
                    ]
                    : []),

                // {
                //     headerName: locationHeader,
                //     cellRenderer: ArrowRenderer,
                //     field: "Location",
                // },

                ...(selectReportType === "ABP_Report"
                    ? [
                        {
                            headerName: "Block",
                            field: "lgd_block_name",
                            cellRenderer: ArrowRenderer,
                        },
                    ]
                    : []),


                {
                    headerName:
                        "Number of Elementary Schools having PTR less than equal to 30",
                    field: "u_ptr",
                    hide: false,
                },
                {
                    headerName: "Number of Elementary Schools ",
                    field: "total_sch_ele",
                    hide: false,
                },
                {
                    headerName:
                        "Percentage of elementary schools having PTR less than equal to 30",
                    field: "ele_sch_percent",
                    cellRenderer: percentageRenderer,
                    hide: false,
                },
            ]);
        }
    }, [
        locationHeader,
        selectedState,
        selectedOption,
        selectedDistrict,
        selectReportType,
    ]);
    useEffect(() => {
        if (selectedState !== "All State") {
            if (selectedOption === "Top_50_Schools") {
                setColumn([
                    {
                        headerName: "Serial Number",
                        field: "Serial Number",
                        hide: true,
                        suppressColumnsToolPanel: true,
                        suppressFiltersToolPanel: true,
                    },
                    {
                        headerName: "UDISE School Code",
                        field: "Udise School Code",
                        hide: false,
                    },


                    {
                        headerName: "School Name",
                        field: "School Name",
                        hide: false,
                    },

                    {
                        headerName: "Percentage of elementary schools having PTR less than equal to 30",
                        field: "PTR<=30",
                        cellRenderer: percentageRenderer,
                        hide: false,
                    },
                ]);
            }
            else if (selectedOption === "Upcoming_50") {
                setColumn([
                    {
                        headerName: "Serial Number",
                        field: "Serial Number",
                        hide: true,
                        suppressColumnsToolPanel: true,
                        suppressFiltersToolPanel: true,
                    },
                    {
                        headerName: "Udise School Code",
                        field: "Udise School Code",
                        // cellRenderer: percentageRenderer,
                        hide: false,
                    },

                    {
                        headerName: "School Name",
                        field: "School Name",
                        // cellRenderer: percentageRenderer,
                        hide: false,
                    },

                    {
                        headerName: "Percentage of elementary schools having PTR less than equal to 30",
                        field: "PTR<=30",
                        cellRenderer: percentageRenderer,
                        hide: false,
                    },
                ]);
            }

        }
    }, [

        locationHeader,
        selectedState,
        selectedOption,
        selectedDistrict,
        selectReportType,
    ]);
    const compressData = useCallback((data, groupBy) => {
        return data.reduce((acc, curr) => {
            let groupKey = curr[groupBy];
            let group = acc.find((item) => item[groupBy] === groupKey);
            if (group) {
                group.u_ptr += curr.u_ptr;
                group.total_sch_ele += curr.total_sch_ele;
                group.ele_sch_percent = parseFloat(
                    ((group.u_ptr * 100) / group.total_sch_ele)?.toFixed(2)
                );
            } else {
                acc.push({
                    ...curr,
                    ele_sch_percent: parseFloat(
                        ((curr.u_ptr * 100) / curr.total_sch_ele)?.toFixed(2)
                    ),
                });
            }
            return acc;
        }, []);
    }, []);

    const compressedData = useMemo(() => {
        if (selectedState && selectedState !== SelectState) {
            if (
                selectedDistrict &&
                selectedDistrict !== AllDistrict &&
                selectedDistrict !== SelectDistrict
            ) {
                return compressData(data, "lgd_block_name");
            }
            return compressData(data, "lgd_district_name");
        }
        return compressData(data, "lgd_state_name");
    }, [data, selectedState, selectedDistrict, selectedBlock]);

    useEffect(() => {
        if (selectedState !== "All State" && selectReportType === "ADP_Report") {
            dispatch(SetFinalData(compressedData));
        } else if (
            selectedState !== "All State" &&
            selectReportType === "ABP_Report"
        ) {
            dispatch(SetFinalData(data));
        } else {
            dispatch(SetFinalData(aspirationalData));
        }
    }, [selectedState, data, aspirationalData, selectReportType]);

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

    const onGridReady = useCallback((params) => {
        setGridApi(params);
    }, []);
    /*------------Export data to Excel and PDF-------------*/
    const getHeaderToExport = (gridApi) => {
        const columns = gridApi.api.getAllDisplayedColumns();
        const headerCellSerialNumber = {
            text: "Serial Number",
            headerName: "Serial Number",
            bold: true,
            margin: [0, 12, 0, 0],
        };
        const headerRow = columns.map((column) => {
            const { field, headerName } = column.getColDef();
            const sort = column.getSort();
            const headerNameUppercase = field[0].toUpperCase() + field.slice(1);
            const headerCell = {
                text: headerNameUppercase + (sort ? ` (${sort})` : ""),
                headerName: headerName,
                bold: true,
                margin: [0, 12, 0, 0],
            };
            return headerCell;
        });
        headerRow.unshift(headerCellSerialNumber);
        return headerRow;
    };
    const getRowsToExport = (gridApi) => {
        const columns = gridApi.api.getAllDisplayedColumns();
        const getCellToExport = (column, node) => {
            const value = gridApi.api.getValue(column, node);
            if (typeof value === "number") {
                return { text: value.toFixed(2) };
            }
            return { text: value ?? "" };
        };
        const rowsToExport = [];
        gridApi.api.forEachNodeAfterFilterAndSort((node) => {
            const rowToExport = [];
            rowToExport.push({ text: rowsToExport.length + 1 });
            columns.forEach((column) => {
                rowToExport.push(getCellToExport(column, node));
            });
            rowsToExport.push(rowToExport);
        });
        return rowsToExport;
    };

    const getDocument = (gridApi) => {
        const headerRow = getHeaderToExport(gridApi);
        const rows = getRowsToExport(gridApi);
        const date = new Date();
        const formattedDate = new Intl.DateTimeFormat("en-US", {
            year: "numeric",
            month: "short",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        }).format(date);
        const doc = new jsPDF({
            orientation: "portrait",
            unit: "in",
            format: [20, 20],
        });
        // Function to add header
        const addHeader = () => {
            doc.setFontSize(25);
            doc.setTextColor("blue");
            doc.setFont("bold");
            doc.text(sheetName, 0.6, 0.5);
            doc.setFontSize(20);
            doc.setTextColor("blue");
            doc.text(`Report Name: ${report_name}`, 0.6, 1.0);
            doc.setFontSize(20);
            doc.setTextColor("blue");
            doc.text(`Report type : ${selectedState}`, 0.6, 1.5);
            doc.setTextColor("blue");
            doc.setFont("bold");
            doc.text(
                `Report Year : ${selectedYear}`,
                doc.internal.pageSize.width - 2,
                0.5,
                {
                    align: "right",
                }
            );

            doc.setFontSize(20);
            doc.text(
                `Report generated on: ${formattedDate}`,
                doc.internal.pageSize.width - 2,
                1.5,
                { align: "right" }
            );
        };

        // Function to add footer
        const addFooter = () => {
            const pageCount = doc.internal.getNumberOfPages();
            doc.setFontSize(10);
            for (let i = 1; i <= pageCount; i++) {
                doc.setPage(i);
                doc.text(
                    `Page ${i} of ${pageCount}`,
                    doc.internal.pageSize.width - 1,
                    doc.internal.pageSize.height - 0.5,
                    { align: "right" }
                );
            }
        };
        const table = [];
        table.push(headerRow.map((cell) => cell.headerName));
        rows.forEach((row) => {
            table.push(row.map((cell) => cell.text));
        });
        addHeader();
        doc.autoTable({
            head: [table[0]],
            body: table.slice(1),
            startY: 2.2,
            didDrawPage: addFooter,
        });

        const totalPages = doc.internal.getNumberOfPages();
        for (let i = 0; i < totalPages; i++) {
            doc.setPage(i + 1);
            doc.autoTable({
                startY: 3.5,
            });
        }
        return doc;
    };
    const exportToPDF = () => {
        const doc = getDocument(gridApi);
        doc.save(`${report_name}.pdf`);
    };
    const exportToExcel = () => {
        if (gridApi) {
            const allData = [];
            const visibleColumns = gridApi.api.getAllDisplayedColumns();
            const columnHeaders = visibleColumns.map((column) => ({
                headerName: column.getColDef().headerName,
                field: column.getColDef().field,
            }));
            columnHeaders.unshift({
                headerName: "Serial Number",
                field: "Serial Number",
            });
            gridApi.api.forEachNode((node, index) => {
                const data = node.data;
                const rowDataWithSerial = { ...data, "Serial Number": index + 1 };
                allData.push(rowDataWithSerial);
            });
            const columnKeys = columnHeaders.map((column) => column.field);
            const columnNames = columnHeaders.map((column) => column.headerName);
            gridApi.api.exportDataAsExcel({
                processCellCallback: (params) => {
                    return params.value;
                },
                rowData: allData,
                fileName: report_name,
                sheetName: sheetName,
                columnKeys: columnKeys,
                columnNames: columnNames,
            });
        }
    };
    const handleExportData = (e) => {
        const { value } = e.target;
        if (value === "export_pdf") {
            exportToPDF();
        }
        if (value === "export_excel") {
            exportToExcel();
        }
        document.getElementById("export_data").selectedIndex = 0;
    };

    const handleOptionChange = (event) => {
        dispatch(setselectedOptionTop50(event.target.value));
    };
    const toggleClass = (e) => {
        dispatch(setselectedOptionTop50(""));
    };
    return (
        <>
            <ScrollToTopOnMount />
            <section>
                <BannerReportFilter />

                <div className="container">
                    <div className="row mt-3">
                        <div className="col-md-12">
                            {loading && <GlobalLoading />}
                            <div className="card-box">
                                <div className="row align-items-end">
                                    <div className="col-md-6">
                                        <div className="d-flex align-items-end">
                                            <div className="title-box">
                                                <h5 className="sub-title">
                                                    {selectReportType === "ADP_Report"
                                                        ? selectedState === "All State"
                                                            ? "All State"
                                                            : selectedDistrict !== SelectDistrict &&
                                                                selectedDistrict !== AllDistrict
                                                                ? `${selectedDistrict}`
                                                                : selectedDistrict === AllDistrict
                                                                    ? `${selectedState} District's`
                                                                    : `${selectedState} District's`
                                                        : selectReportType === "ABP_Report"
                                                            ? selectedState === "All State"
                                                                ? "All State"
                                                                : selectedState !== SelectState
                                                                    ? selectedDistrict === SelectDistrict ||
                                                                        selectedDistrict === AllDistrict
                                                                        ? `${selectedState} District's`
                                                                        : selectedBlock !== SelectBlock &&
                                                                            selectedBlock !== AllBlock
                                                                            ? `${selectedBlock}`
                                                                            : `${selectedDistrict} Block's`
                                                                    : selectedBlock
                                                            : selectedBlock}
                                                </h5>
                                                <h3 className="heading-sm">
                                                    {selectedOption === "Top_50_Schools"
                                                        ? "Top 50 Elementary Schools with PTR ≤ 30%"
                                                        : selectedOption === "Upcoming_50"
                                                            ? "Upcoming 50 Elementary Schools with PTR ≤ 30%"
                                                            : t("teacherSchoolResources")}
                                                </h3>

                                            </div>
                                            <div className="tab-box">
                                                <button className="tab-button active" onClick={toggleClass}>
                                                    <img src={table} alt="Table" />{" "}
                                                    <span>{t("tableView")}</span>
                                                </button>
                                                <button className="tab-button" onClick={toggleClass}>
                                                    <img src={chart} alt="chart" />{" "}
                                                    <span>{t("chartView")}</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="d-flex w-m-100 justify-content-end">
                                            {selectedState !== SelectState && (selectedDistrict !== SelectDistrict && selectedDistrict !== AllDistrict && selectReportType !== "ABP_Report") ? (
                                                <div className="radio-button w-auto">
                                                    <div className="box-radio me-4">
                                                        <input
                                                            type="radio"
                                                            id="radio44"
                                                            value="Top_50_Schools"
                                                            checked={selectedOption === "Top_50_Schools"}
                                                            onChange={handleOptionChange}
                                                        />
                                                        <label htmlFor="radio44">
                                                            Top 50 Schools
                                                        </label>
                                                    </div>

                                                    <div className="box-radio">
                                                        <input
                                                            type="radio"
                                                            id="radio55"
                                                            value="Upcoming_50"
                                                            checked={selectedOption === "Upcoming_50"}
                                                            onChange={handleOptionChange}
                                                        />
                                                        <label htmlFor="radio55">
                                                            Upcoming 50 Schools
                                                        </label>
                                                    </div>
                                                </div>
                                            ) : ("")}


                                            <div className="">
                                                {/* <img src={download} alt="download" /> */}
                                                <select
                                                    id="export_data"
                                                    className="form-select download-button"
                                                    defaultValue={""}
                                                    onChange={handleExportData}
                                                >
                                                    <option className="option-hide">
                                                        {" "}
                                                        {t("downloadReport")} {selectedYear}
                                                    </option>
                                                    <option value="export_pdf">
                                                        {t("downloadAsPdf")}
                                                    </option>
                                                    <option value="export_excel">
                                                        {" "}
                                                        {t("downloadAsExcel")}
                                                    </option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-md-12">
                                        <div className="table-box mt-4">
                                            <div
                                                id="content"
                                                className="multi-header-table ag-theme-material ag-theme-custom-height ag-theme-quartz h-300"
                                                style={{ width: "100%", height: 400 }}
                                            >
                                                <AgGridReact
                                                    columnDefs={columns}
                                                    rowData={
                                                        selectedOption === "Top_50_Schools"
                                                            ? top50Data && top50Data.length > 0 ? top50Data : []
                                                            : selectedOption === "Upcoming_50"
                                                                ? top50Data && top50Data.length > 0 ? top50Data : []
                                                                : finalData && finalData.length > 0 ? finalData : []
                                                    }
                                                    defaultColDef={defColumnDefs}
                                                    onGridReady={onGridReady}
                                                />

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {
                            selectedState !== "All State" && selectReportType === "ADP_Report" ? (
                                <TeacherAndSchoolCompare />
                            ) : (selectedState !== "All State" && selectedDistrict !== SelectDistrict && selectedDistrict !== AllDistrict) && selectReportType === "ABP_Report" ? (
                                <TeacherAndSchoolBlockCompare />
                            ) : (
                                ""
                            )
                        }
                    </div>
                </div>
            </section>
        </>
    );
}