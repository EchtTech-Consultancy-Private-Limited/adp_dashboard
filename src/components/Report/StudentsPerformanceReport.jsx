import React, { useState, useEffect, useCallback, useMemo } from 'react'
import BannerReportFilter from './BannerReportFilter'
import download from '../../assets/images/download.svg'
import table from '../../assets/images/table.svg'
import chart from '../../assets/images/bar-chart.svg'
import card from '../../assets/images/card-list.svg'
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
import { Select } from 'antd';
import 'jspdf-autotable';
import { GlobalLoading } from '../GlobalLoading/GlobalLoading'
import { setselectedOption, setUpdateStatus } from '../../redux/slice/reportTypeSlice'
import BlankPage from './BlankPage'
import { AllBlock, AllDistrict, SelectBlock, SelectDistrict, selectedOptionConst, SelectState } from '../../constant/Constant'
import TransitionRateCompare from './TransitionRateCompare'
import { ScrollToTopOnMount } from '../../Scroll/ScrollToTopOnMount'

const ArrowRenderer = ({ data, value }) => {
    const selectedOption = useSelector((state) => state.reportAdpAbpType.selectedOption);
    const [arrowData, setArrowData] = useState([]);

    useEffect(() => {
        if (selectedOption === "upper_primary_to_secondary") {
            setArrowData(data.upri_t);
        } else {
            setArrowData(data.sec_t);
        }
    }, [selectedOption, data]);

    const renderArrow = () => {
        if (selectedOption === "upper_primary_to_secondary" && arrowData >= 70 && arrowData <= 100) {
            return <ArrowUpwardIcon style={{ color: 'green', marginLeft: '5px', fontSize: "14px" }} />;
        } else if (selectedOption !== "upper_primary_to_secondary" && arrowData >= 40 && arrowData <= 100) {
            return <ArrowUpwardIcon style={{ color: 'green', marginLeft: '5px', fontSize: "14px" }} />;
        } else {
            return <ArrowDownwardIcon style={{ color: 'red', marginLeft: '5px', fontSize: "14px" }} />;
        }
    };

    return (
        <span>
            {value}
            {renderArrow()}
        </span>
    );
};
export default function StudentsPerformanceReport() {
    const dispatch = useDispatch()
    const { t, i18n } = useTranslation();
    const [queryParameters] = useSearchParams();
    const id = queryParameters.get('id');
    const type = queryParameters.get('type');
    const [gridApi, setGridApi] = useState();
    const [loading, setLoading] = useState(true);
    localStorage.setItem('selectedReport', "Transition Rate");
    const { selectedState, selectedDistrict, selectedBlock } = useSelector((state) => state.locationAdp);
    const [aspirationalData, setAspirationalData] = useState([])
    const [locationHeader, SetLocationHeader] = useState();
    const [sheetName, SetSheetName]=useState()
    const selectReportType = useSelector((state) => state.reportAdpAbpType.updateReportType)
    const selectedOption = useSelector((state) => state.reportAdpAbpType.selectedOption)
    const updateLoading = useSelector((state) => state.reportAdpAbpType.loadingStatus)
    const savedReportName = localStorage.getItem('selectedReport');
    const report_name = savedReportName
    const [data, setData] = useState([]);
    function resteData() {
        dispatch(selectState(SelectState));
        dispatch(selectDistrict(SelectDistrict));
        dispatch(selectBlock(SelectBlock));
        dispatch(setselectedOption(selectedOptionConst));
    }
    useEffect(() => {
        resteData()
    }, [dispatch]);
    {/*...............update Location Header..............*/ }
    useEffect(() => {
        if (selectReportType === "ADP_Report") {
            if (selectedState !== SelectState && selectedDistrict === SelectDistrict) {
                SetLocationHeader("District")
                SetSheetName("Aspirational District Programme")
            }
        }
        else if ((selectReportType === "ABP_Report")) {
            if (selectedState !== SelectState && (selectedDistrict === SelectDistrict || selectedDistrict === AllDistrict)) {
                SetLocationHeader("District")
            }
            else if (selectedState !== SelectState && selectedDistrict !== SelectDistrict) {
                SetLocationHeader("Block")
            }
            SetSheetName("Aspirational Block Programme")
        }

    }, [selectedState, SelectState, selectedDistrict, SelectDistrict, selectedOption])

    {/*...............Take data report wise..............*/ }
    useEffect(() => {
        if (selectReportType === "ADP_Report") {
            setAspirationalData(aspirationalAdpData)
            resteData()
        }
        else {
            setAspirationalData(aspirationalAbpData)
            resteData()
        }
    }, [selectReportType])
    useEffect(() => {
        let filteredData = aspirationalData;

        if (selectedState && selectedState !== SelectState) {
            filteredData = filteredData.filter(
                (item) => item.lgd_state_name === selectedState
            );
        }

        if (selectedDistrict && selectedDistrict !== AllDistrict && selectedDistrict !== SelectDistrict) {
            filteredData = filteredData.filter(
                (item) => item.lgd_district_name === selectedDistrict
            );
        }

        if (selectedBlock && selectedBlock !== AllBlock && selectedBlock !== SelectBlock) {
            filteredData = filteredData.filter(
                (item) => item.lgd_block_name === selectedBlock
            );
        }
        filteredData = filteredData.map((item) => ({
            ...item,
            Location: getLocationName(item),
        }));
        setData(filteredData);
        setLoading(false)

        // dispatch(setUpdateStatus(false))
    }, [selectedState, selectedDistrict, selectedBlock]);
    const getLocationName = (item) => {
        if (selectReportType === "ABP_Report") {
            if (selectedBlock && selectedBlock !== AllBlock && selectedBlock !== SelectBlock) {

                return `${item.lgd_block_name}`;
            } else if (selectedDistrict && selectedDistrict !== AllDistrict && selectedDistrict !== SelectDistrict) {

                return `${item.lgd_block_name}`;
            } else if (selectedState && selectedState !== SelectState) {

                return `${item.lgd_district_name}`;
            } else if (selectedState === SelectState) {
                return `${item.lgd_state_name}`;
            }
        } else if (selectReportType === "ADP_Report") {
            if (selectedState && selectedState !== SelectState) {

                return `${item.lgd_district_name}`;
            }
            else if (selectedState !== SelectState && selectedState !== AllDistrict) {

                return `${item.lgd_district_name}`;
            }
            else if (selectedState === SelectState) {
                return `${item.lgd_state_name}`;
            }
        }
        return '';
    };

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
            headerName: locationHeader,
            cellRenderer: ArrowRenderer,
            field: "Location",
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

    ]);
    const handleOptionChange = (event) => {
        dispatch(setselectedOption(event.target.value));
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
                    headerName: locationHeader,
                    cellRenderer: ArrowRenderer,
                    field: "Location",
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
                    headerName: locationHeader,
                    cellRenderer: ArrowRenderer,
                    field: "Location",
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
            ]);
        }
    }, [locationHeader, selectedOption]);

    const compressData = useCallback((data, groupBy) => {
        return data.reduce((acc, curr) => {
          let groupKey = curr[groupBy];
          let group = acc.find((item) => item[groupBy] === groupKey);
          if (group) {
            group.total_school_cwsn += curr.total_school_cwsn;
            group.tot_school += curr.tot_school;
    
            group.swsn_teacher_percent = parseFloat(
              ((group.total_school_cwsn * 100) / group.tot_school).toFixed(2)
            );
          } else {
            acc.push({
              ...curr,
              lgd_state_name: curr.lgd_state_name,
              total_school_cwsn: curr.total_school_cwsn,
              tot_school: curr.tot_school,
              swsn_teacher_percent: parseFloat(
                ((curr.total_school_cwsn * 100) / curr.tot_school).toFixed(2)
              ),
            });
          }
          return acc;
        }, []);
      }, []);
    const compressedData = useMemo(() => {
        if (selectedState && selectedState !== SelectState) {
            if (selectedDistrict && selectedDistrict !== AllDistrict && selectedDistrict !== SelectDistrict) {
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
            doc.text(sheetName, 0.6, 0.5);
            doc.setFontSize(20);
            doc.setTextColor("blue");
            doc.text(`Report Name: ${report_name}`, 0.6, 1.0);
            doc.setFontSize(20);
            doc.setTextColor("blue");
            doc.text(`Report type : ${selectedState}`, 0.6, 1.5);
            doc.setTextColor("blue");
            doc.setFont("bold");
            // doc.text(`Report Id : ${id}`, doc.internal.pageSize.width - 2, 0.5, {
            //     align: "right",
            // });

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
        <ScrollToTopOnMount />
        <section>
            <BannerReportFilter />

            <div className="container">
                <div className="row mt-4">

                    {selectedState !== SelectState ?

                        <div className="col-md-12">
                            {loading && <GlobalLoading />}
                            <div className="card-box">
                                <div className="row align-items-end">
                                    <div className="col-md-5">
                                        <div className="d-flex align-items-end">
                                            <div className="title-box">
                                                <h5 className='sub-title'>
                                                    {selectReportType === "ADP_Report" ? (
                                                        selectedDistrict !== SelectDistrict && selectedDistrict !== AllDistrict ?
                                                            `${selectedDistrict}` :
                                                            selectedDistrict === AllDistrict ?
                                                                `${selectedState} District's` : `${selectedState} District's`
                                                    ) : (
                                                        selectReportType === "ABP_Report" ? (
                                                            selectedState !== SelectState ? (
                                                                selectedDistrict === SelectDistrict || selectedDistrict === AllDistrict ?
                                                                    `${selectedState} District's` :
                                                                    selectedBlock !== SelectBlock && selectedBlock !== AllBlock ?
                                                                        `${selectedBlock}` :
                                                                        `${selectedDistrict} Block's`
                                                            ) : selectedBlock
                                                        ) : selectedBlock
                                                    )}
                                                </h5>
                                                <h3 className='heading-sm'>School Infrastructure</h3>
                                            </div>
                                            <div className="tab-box">
                                                <button className='tab-button active'><img src={table} alt="Table" /> Table View</button>
                                                <button className='tab-button'><img src={chart} alt="chart" /> Chart View</button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-7">
                                        <div className="d-flex w-m-100">
                                            <div className="radio-button">
                                                <div className="box-radio">
                                                    <input type="radio"
                                                        id="radio4"
                                                        value="upper_primary_to_secondary"
                                                        checked={selectedOption === "upper_primary_to_secondary"}
                                                        onChange={handleOptionChange} />
                                                    <label htmlFor="radio4">Upper Primary to Secondary  </label>
                                                </div>

                                                <div className="box-radio">
                                                    <input type="radio"
                                                        id="radio5"
                                                        value="secondary_to_higher_secondary"
                                                        checked={selectedOption === "secondary_to_higher_secondary"}
                                                        onChange={handleOptionChange} />
                                                    <label htmlFor="radio5">Secondary to Higher Secondary</label>
                                                </div>
                                            </div>
                                            <div className="">
                                                {/* <img src={download} alt="download" /> */}
                                                <select id="export_data" className="form-select download-button" defaultValue={""} onChange={handleExportData}>
                                                    <option className="option-hide"> Download Report 2023-24</option>
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




                        </div> : <div className="col-md-12">
                            <BlankPage />
                        </div>
                    }
                    {/* <TransitionRateCompare /> */}
                </div>
            </div>
        </section>
       </>
    )
}