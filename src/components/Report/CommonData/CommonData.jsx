
import React, { useState, useEffect, useMemo, useCallback } from "react"

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
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { SetSheetName } from "../../../redux/slice/reportTypeSlice";
export function CommonData() {
    const dispatch = useDispatch()
    const [aspirationalAllData, setAspirationalAllData] = useState([]);
    const { selectedState } = useSelector((state) => state.locationAdp);
    const selectedYear = useSelector((state) => state.reportAdpAbpType.selectedYear);
    const selectReportType = useSelector((state) => state.reportAdpAbpType.updateReportType);
    const [gridApi, setGridApi] = useState();
    const sheetName = useSelector((state) => state.reportAdpAbpType.sheetName);
    const savedReportName = localStorage.getItem("selectedReport");
    const report_name = savedReportName;
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

            dispatch(SetSheetName("Aspirational Block Programme"));
        }
    }, [selectReportType]);

    const percentageRenderer = (params) => {
        return `${params.value.toFixed(2)} %`;
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
                            valueFormatter: (params) => params.value.toFixed(2),
                            hide: false,
                        },
                        {
                            headerName: "Girls",
                            field: "upri_g",
                            cellRenderer: percentageRenderer,
                            valueFormatter: (params) => params.value.toFixed(2),
                            hide: false,
                        },
                        {
                            headerName: "Total",
                            field: "upri_t",
                            cellRenderer: percentageRenderer,
                            valueFormatter: (params) => params.value.toFixed(2),
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
                            valueFormatter: (params) => params.value.toFixed(2),
                            hide: false,
                        },
                        {
                            headerName: "Girls",
                            field: "upri_g",
                            cellRenderer: percentageRenderer,
                            valueFormatter: (params) => params.value.toFixed(2),
                            hide: false,
                        },
                        {
                            headerName: "Total",
                            field: "upri_t",
                            cellRenderer: percentageRenderer,
                            valueFormatter: (params) => params.value.toFixed(2),
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
                            valueFormatter: (params) => params.value.toFixed(2),
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
                            valueFormatter: (params) => params.value.toFixed(2),
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
                            valueFormatter: (params) => params.value.toFixed(2),
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
                            valueFormatter: (params) => params.value.toFixed(2),
                            hide: false,
                        },
                    ]
                }
            ];

            setColumn(columns);
        }
    }, [selectedState, selectReportType]);

 
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
            valueFormatter: (params) => {
                if (typeof params.value === 'number') {
                    return params.value.toFixed(2);
                }
                return params.value;
            },
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
        const headerRow = columns?.map((column) => {
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
        const getCellToExport = (column, node) => ({
            text: gridApi.api.getValue(column, node) ?? "",
        });
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


    return (
        <>
            {selectedState === "All State" ?<div className="">
                {/* <img src={download} alt="download" /> */}
                <select
                    id="export_data"
                    className="form-select download-button"
                    defaultValue={""}
                    onChange={handleExportData}
                >
                    <option className="option-hide">
                        {" "}
                        Download Report {selectedYear}
                    </option>
                    <option value="export_pdf">Download as PDF </option>
                    <option value="export_excel">
                        Download as Excel
                    </option>
                </select>
            </div>:""}
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