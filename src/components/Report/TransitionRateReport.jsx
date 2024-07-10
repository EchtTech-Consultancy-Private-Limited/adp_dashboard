import React, { useState, useEffect, useCallback, useMemo } from 'react'
import BannerReportFilter from './BannerReportFilter'
import download from '../../assets/images/download.svg'
import table from '../../assets/images/table.svg' 
import chart from '../../assets/images/bar-chart.svg'
import './report.scss'
import { AgGridReact } from "ag-grid-react";
import "ag-grid-enterprise";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-material.css";
import { useSearchParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { selectBlock, selectDistrict, selectState } from '../../redux/slice/filterServicesSlice'
import aspirationalAbpData from "../../aspirational-reports-data/aspirational.json";
import aspirationalAdpData from "../../aspirational-reports-data/aspirationalDistrict.json";
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { useTranslation } from "react-i18next";
import { jsPDF } from "jspdf";
import 'jspdf-autotable';
import { GlobalLoading } from '../GlobalLoading/GlobalLoading'
import { setUpdateStatus } from '../../redux/slice/reportTypeSlice'
import BlankPage from './BlankPage'
export default function TransitionRateReport() {
    const dispatch = useDispatch()
    const { t, i18n } = useTranslation();
    const [queryParameters] = useSearchParams();
    const id = queryParameters.get('id');
    const type = queryParameters.get('type');
    const [report, setReport] = useState(null);
    // const [activeTab, setActiveTab] = useState(type);
    const [gridApi, setGridApi] = useState();
    const [loading, setLoading] = useState(true);
    // const headerData = useSelector((state) => state.header);
    const { selectedState, selectedDistrict, selectedBlock } = useSelector(
        (state) => state.locationAdp
    );
    const [selectedOption, setSelectedOption] = useState(
        "upper_primary_to_secondary"
    );
    const [aspirationalData, setAspirationalData] = useState([])
    const [arrowData, setArrowData] = useState([])
    const selectedOptions = useSelector((state) => state.reportAdpAbpType.updateReportType)
    const updateLoading = useSelector((state) => state.reportAdpAbpType.loadingStatus)
    console.log(updateLoading, "updateLoading")
    const [data, setData] = useState([]);
    console.log(data, "selectedState")
    function dispatchingData() {
        dispatch(selectState("Select State"));
        dispatch(selectDistrict("Select District"));
        dispatch(selectBlock("Select Block"));
    }
    useEffect(() => {
        dispatchingData()
    }, [dispatch]);

    // dispatch(handleActiveTabs(activeTab))

    useEffect(() => {
        if (selectedOptions === "ADP_Report") {
            dispatchingData()
            setAspirationalData(aspirationalAdpData)
        }
        else {
            dispatchingData()
            setAspirationalData(aspirationalAbpData)
        }
    }, [selectedOptions])
    useEffect(() => {
        let filteredData = aspirationalData;

        if (selectedState && selectedState !== "Select State") {
            filteredData = filteredData.filter(
                (item) => item.lgd_state_name === selectedState
            );
        }

        if (selectedDistrict && selectedDistrict !== "All District" && selectedDistrict !== "Select District") {
            filteredData = filteredData.filter(
                (item) => item.lgd_district_name === selectedDistrict
            );
        }

        if (selectedBlock && selectedBlock !== "All Block" && selectedBlock !== "Select Block") {
            filteredData = filteredData.filter(
                (item) => item.lgd_block_name === selectedBlock
            );
        }
        filteredData = filteredData.map((item) => ({
            ...item,
            Location: getLocationName(item),
        }));
        console.log(filteredData, "filteredData")
        setData(filteredData);
        // setLoading(false)
        
    dispatch(setUpdateStatus(false))
    }, [selectedState, selectedDistrict, selectedBlock]);
    const getLocationName = (item) => {
        if (selectedOptions === "ABP_Report") {
            if (selectedBlock && selectedBlock !== "All Block" && selectedBlock !== "Select Block") {

                return `${item.lgd_block_name}`;
            } else if (selectedDistrict && selectedDistrict !== "All District" && selectedDistrict !== "Select District") {

                return `${item.lgd_block_name}`;
            } else if (selectedState && selectedState !== "Select State") {

                return `${item.lgd_district_name}`;
            } else if (selectedState === "Select State") {
                return `${item.lgd_state_name}`;
            }
        } else if (selectedOptions === "ADP_Report") {
            if (selectedState && selectedState !== "Select State") {

                return `${item.lgd_district_name}`;
            }
            else if (selectedState !== "Select State" && selectedState !== "All District") {

                return `${item.lgd_district_name}`;
            }
            else if (selectedState === "Select State") {
                return `${item.lgd_state_name}`;
            }
        }
        return '';
    };


    // useEffect(() => {
    //     for (const category in allreportsdata) {
    //         const foundReport = allreportsdata[category].find(
    //             (report) => report.id === parseInt(id)
    //         );
    //         if (foundReport) {
    //             setReport(foundReport);
    //             break;
    //         }
    //     }
    // }, [id]);


    const percentageRenderer = (params) => {
        return `${params.value} %`;
    };
    const ArrowRenderer = (props) => {
        const upri_t = props.data.upri_t;

        if (selectedOption === "upper_primary_to_secondary") {
            setArrowData(props.data.upri_t)
        }
        else {
            setArrowData(props.data.sec_t)
        }
        return (
            <span>
                {props.value}
                {arrowData > 70 ? (
                    <ArrowUpwardIcon style={{ color: 'green', marginLeft: '5px', fontSize: "14px" }} />
                ) : (
                    <ArrowDownwardIcon style={{ color: 'red', marginLeft: '5px', fontSize: "14px" }} />
                )}
            </span>
        );
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
            headerName: "Location",
            cellRenderer: ArrowRenderer,
            field: "Location",
        },

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
        },

    ]);
    console.log(columns, "columns")
    const handleOptionChange = (event) => {
        setSelectedOption(event.target.value);
    };

    useEffect(() => {
        if (selectedOption === "upper_primary_to_secondary") {
            setColumn([
                {
                    headerName: "Serial Number",
                    field: "Serial Number",
                    hide: true,
                    suppressColumnsToolPanel: true,
                    suppressFiltersToolPanel: true,
                },
                {
                    headerName: "Location",
                    cellRenderer: ArrowRenderer,
                    field: "Location",
                },
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
                },
            ]);
        } else if (selectedOption === "secondary_to_higher_secondary") {
            setColumn([
                {
                    headerName: "Serial Number",
                    field: "Serial Number",
                    hide: true,
                    suppressColumnsToolPanel: true,
                    suppressFiltersToolPanel: true,
                },
                {
                    headerName: "Location",
                    cellRenderer: 'ArrowRenderer',
                    field: "Location",
                },
                {
                    headerName: "Boys",
                    field: "sec_b",
                    cellRenderer: percentageRenderer,
                    hide: false,
                },
                {
                    headerName: "Girls",
                    field: "sec_g",
                    cellRenderer: percentageRenderer,
                    hide: false,
                },
                {
                    headerName: "Total",
                    field: "sec_t",
                    cellRenderer: percentageRenderer,
                    hide: false,
                },
            ]);
        }
    }, [selectedOption]);
    const compressData = useCallback((data, groupBy) => {
        return data.reduce((acc, curr) => {
            let groupKey = curr[groupBy];
            let group = acc.find((item) => item[groupBy] === groupKey);
            if (group) {
                group.upri_b = parseFloat(
                    ((group.upri_b * group.blocks + curr.upri_b) / (group.blocks + 1)).toFixed(2)
                );
                group.upri_g = parseFloat(
                    ((group.upri_g * group.blocks + curr.upri_g) / (group.blocks + 1)).toFixed(2)
                );
                group.upri_t = parseFloat(
                    ((group.upri_t * group.blocks + curr.upri_t) / (group.blocks + 1)).toFixed(2)
                );
                group.sec_b = parseFloat(
                    ((group.sec_b * group.blocks + curr.sec_b) / (group.blocks + 1)).toFixed(2)
                );
                group.sec_g = parseFloat(
                    ((group.sec_g * group.blocks + curr.sec_g) / (group.blocks + 1)).toFixed(2)
                );
                group.sec_t = parseFloat(
                    ((group.sec_t * group.blocks + curr.sec_t) / (group.blocks + 1)).toFixed(2)
                );
                group.blocks += 1;
            } else {
                acc.push({
                    ...curr,
                    [groupBy]: groupKey,
                    upri_b: parseFloat(curr.upri_b.toFixed(2)),
                    upri_g: parseFloat(curr.upri_g.toFixed(2)),
                    upri_t: parseFloat(curr.upri_t.toFixed(2)),
                    sec_b: parseFloat(curr.sec_b.toFixed(2)),
                    sec_g: parseFloat(curr.sec_g.toFixed(2)),
                    sec_t: parseFloat(curr.sec_t.toFixed(2)),
                    blocks: 1,
                });
            }
            return acc;
        }, []);
    }, []);

    const compressedData = useMemo(() => {
        if (selectedState && selectedState !== "Select State") {
            if (selectedDistrict && selectedDistrict !== "All District" && selectedDistrict !== "District") {
                return compressData(data, "lgd_block_name");
            }
            return compressData(data, "lgd_district_name");
        }
        return compressData(data, "lgd_state_name");
    }, [data, selectedState, selectedDistrict, selectedBlock]);

    const defColumnDefs = useMemo(() => ({
        flex: 1,
        minWidth: 150,
        enableValue: true,
        enableRowGroup: true,
        enablePivot: true,
        sortable: true,
        filter: true,
        resizable: true,
    }), []);


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
            doc.text("UDISE+", 0.6, 0.5);
            doc.setFontSize(20);
            doc.setTextColor("blue");
            doc.text(`Report Name: ${report.report_name}`, 0.6, 1.0);
            doc.setFontSize(20);
            doc.setTextColor("blue");
            doc.text(`Report type : ${selectedState}`, 0.6, 1.5);
            doc.setTextColor("blue");
            doc.setFont("bold");
            doc.text(`Report Id : ${id}`, doc.internal.pageSize.width - 2, 0.5, {
                align: "right",
            });

            doc.setFontSize(20);
            doc.text(`Report generated on: ${formattedDate}`, doc.internal.pageSize.width - 2, 1.5, { align: "right" });
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
        doc.save(`${report.report_name}.pdf`);
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
                fileName: report.report_name,
                sheetName: "Udise+",
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
        <section>
            <BannerReportFilter />
            {updateLoading && <GlobalLoading />}
            <div className="container">
                <div className="row mt-5">
                    <div className="col-md-12">
                        <BlankPage/>
                    </div>
                    <div className="col-md-12">
                        <div className="card-box">
                            <div className="row align-items-end">
                                <div className="col-md-5">
                                    <div className="d-flex align-items-end">
                                        <div className="title-box">
                                            <h5 className='sub-title'>Uttar Pradesh District's</h5>
                                            <h3 className='heading-sm'>Transition Rate</h3>
                                        </div>
                                        <div className="tab-box">
                                            <button className='tab-button active'><img src={table} alt="Table" /> Table View</button>
                                            <button className='tab-button'><img src={chart} alt="chart" /> Chart View</button>                                           
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-7">
                                    <div className="d-flex w-100">
                                        <div className="radio-button">
                                            <div className="box-radio">
                                                <input type="radio"
                                                    value="upper_primary_to_secondary"
                                                    checked={selectedOption === "upper_primary_to_secondary"}
                                                    onChange={handleOptionChange} />
                                                <label htmlFor="radio4">Upper Primary to Secondary  </label>
                                            </div>

                                            <div className="box-radio">
                                                <input type="radio"
                                                    value="secondary_to_higher_secondary"
                                                    checked={selectedOption === "secondary_to_higher_secondary"}
                                                    onChange={handleOptionChange} />
                                                <label htmlFor="radio5">Secondary to Higher Secondary</label>
                                            </div>
                                        </div>
                                        <div className="">
                                            {/* <img src={download} alt="download" /> */}
                                            <select id="export_data" className="form-select download-button" defaultValue={""}>
                                                <option className="option-hide"> Download Report 2023-24 </option>
                                                <option value="export_pdf">Download as PDF </option>
                                                <option value="export_excel">Download as Excel</option>
                                            </select>
                                        </div>
                                    </div>

                                </div>
                            </div>

                            <div className="row">
                                <div className="col-md-12">
                                    <div className="table-box mt-4">
                                        <div className="multi-header-table ag-theme-material ag-theme-custom-height ag-theme-quartz h-300"
                                            style={{ width: "100%", height: 200 }} >
                                            <AgGridReact columnDefs={columns} rowData={compressedData} defaultColDef={defColumnDefs} onGridReady={onGridReady} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
