import React, { useState, useEffect, useCallback, useMemo } from 'react'
import BannerReportFilter from './BannerReportFilter'
import table from '../../assets/images/table.svg'
import chart from '../../assets/images/bar-chart.svg'
import './report.scss'
import { AgGridReact } from "ag-grid-react";
import "ag-grid-enterprise";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-balham.css";
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from "react-i18next";
import { jsPDF } from "jspdf";
import 'jspdf-autotable';
import { GlobalLoading } from '../GlobalLoading/GlobalLoading'
import { SetFinalData, setIsActiveGraph, setLoading, setselectedOption, setselectedOptionTop50, SetSheetName } from '../../redux/slice/reportTypeSlice'
import { AllBlock, AllDistrict, SelectBlock, SelectDistrict, selectedOptionConst, SelectState } from '../../constant/Constant'
import { ScrollToTopOnMount } from '../../Scroll/ScrollToTopOnMount'
import StudentsPerformanceCompare from './ReportCompare/TeacherTrainedCwsnCompare'
import StudentsPerformanceBlockCompare from './ReportCompare/TeacherTrainedCwsnBlockCompare'
import teacherTrainedCwsnAdp2019 from "../../aspirational-reports-data/teacherTrainedCwsnAdp2019-2020.json";
import teacherTrainedCwsnAdp2020 from "../../aspirational-reports-data/teacherTrainedCwsnAdp2020-2021.json";
import teacherTrainedCwsnAdp2021 from "../../aspirational-reports-data/teacherTrainedCwsnAdp2021-2022.json";
import teacherTrainedCwsnAdp2022 from "../../aspirational-reports-data/teacherTrainedCwsnAdp2022-2023.json";
import { ArrowRenderer } from "./ArrowRenderer/ArrowRenderer";
import TeacherTrainedCwsnBarGraph from './graph/TeacherTrainedCwsnBarGraph'
import useReportFilterData from '../../CustomHook/useReportFilterData'
import satyamevaimg from "../../assets/images/satyameva-jayate-img.png";
import udise from "../../assets/images/udiseplu.jpg";


export default function TeacherTrainedCwsnReport() {
    const dispatch = useDispatch()
    const { t } = useTranslation();
    // const [loading, setLoading] = useState(true);
    const { selectedState, selectedDistrict, selectedBlock } = useSelector((state) => state.locationAdp);
    const [locationHeader, SetLocationHeader] = useState();
    const aspirationalData = useSelector((state) => state.reportAdpAbpType.aspirationalAllData);
    const selectedDataAllYear = useSelector((state) => state.reportAdpAbpType.selectedDataAllYear);
    const selectReportType = useSelector((state) => state.reportAdpAbpType.updateReportType);
    const selectedOption = useSelector((state) => state.reportAdpAbpType.selectedOptionTop50);
    const selectedYear = useSelector((state) => state.reportAdpAbpType.selectedYear);
    const sheetName = useSelector((state) => state.reportAdpAbpType.sheetName);
    const [gridApi, setGridApi] = useState()
    const savedReportName = localStorage.getItem('selectedReport');
    const report_name = savedReportName
    // const [data, setData] = useState([]);
    const isActiveGraph = useSelector((state) => state.reportAdpAbpType.isActiveGraph)
    const finalData = useSelector((state) => state.reportAdpAbpType.finalData)
    const loading = useSelector(
        (state) => state.reportAdpAbpType.loading
    );
    // const [finalData, SetFinalData] = useState([])
    const [topPtrData, setTopPtrData] = useState([])
    const [top50Data, setTop50Data] = useState([])

    {/* Set Report Title Start*/ }
    localStorage.setItem("selectedReportValue", "Percentage Schools with Teachers Trained for Teaching CWSN");
    const reportTitle = selectedOption === "Top_50_Schools"
        ? t('top_50_schools_with_teachers_trained_for_cwsn')
        : selectedOption === "Upcoming_50"
            ? t('upcoming_50_schools_with_teachers_trained_for_cwsn')
            : t("studentPerformanceReport")
    localStorage.setItem("selectedReport", reportTitle);

    {/* Set Report Title End*/ }

    {/* Show top 100 Data start*/ }
    const combinedTopData = {
        "2019-20": {
            ADP_Report: teacherTrainedCwsnAdp2019,
        },
        "2020-21": {
            ADP_Report: teacherTrainedCwsnAdp2020,
        },
        "2021-22": {
            ADP_Report: teacherTrainedCwsnAdp2021,
        },
        "2022-23": {
            ADP_Report: teacherTrainedCwsnAdp2022,
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
                    ? finalData.some(finalItem => finalItem.lgd_district_id === topeItem.lgd_district_id)
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
    {/* Show top 100 Data End*/ }
    function resteData() {
        // dispatch(selectState(SelectState));
        // dispatch(selectDistrict(SelectDistrict));
        // dispatch(selectBlock(SelectBlock));
        dispatch(setselectedOption(selectedOptionConst));
        // dispatch(setSelectedYear(intialYear))
    }
    useEffect(() => {
        resteData()
    }, [dispatch]);


    {/*...............update Location Header..............*/ }
    useEffect(() => {
        if (selectReportType === "ADP_Report") {
            if (selectedState !== SelectState && selectedDistrict === SelectDistrict) {
                SetLocationHeader("District")

            }
            dispatch(SetSheetName("Aspirational District Programme"));
        }
        else if ((selectReportType === "ABP_Report")) {
            if (selectedState !== SelectState && (selectedDistrict === SelectDistrict || selectedDistrict === AllDistrict)) {
                SetLocationHeader("District")
            }
            else if (selectedState !== SelectState && selectedDistrict !== SelectDistrict) {
                SetLocationHeader("Block")
            }
            dispatch(SetSheetName("Aspirational Block Programme"));
        }

    }, [selectedState, SelectState, selectedDistrict, SelectDistrict, selectedBlock, selectReportType])


    useEffect(() => {
        if (selectedDistrict === SelectDistrict) {
            dispatch(setselectedOptionTop50(""));
        }
    }, [selectedDistrict])
    // useEffect(() => {
    //     let filteredData = aspirationalData;

    //     if (selectedState && selectedState !== SelectState) {
    //         filteredData = filteredData.filter(
    //             (item) => item.lgd_state_name === selectedState
    //         );
    //     }

    //     if (selectedDistrict && selectedDistrict !== AllDistrict && selectedDistrict !== SelectDistrict) {
    //         filteredData = filteredData.filter(
    //             (item) => item.lgd_district_name === selectedDistrict
    //         );
    //     }

    //     if (selectedBlock && selectedBlock !== AllBlock && selectedBlock !== SelectBlock) {
    //         filteredData = filteredData.filter(
    //             (item) => item.lgd_block_name === selectedBlock
    //         );
    //     }
    //     filteredData = filteredData.map((item) => ({
    //         ...item,
    //         Location: getLocationName(item),
    //     }));
    //     setData(filteredData);
    //     setLoading(false)

    //     // dispatch(setUpdateStatus(false))
    // }, [selectedState, selectedDistrict, selectedBlock, aspirationalData, selectReportType]);
    // const getLocationName = (item) => {
    //     if (selectReportType === "ABP_Report") {
    //         if (selectedBlock && selectedBlock !== AllBlock && selectedBlock !== SelectBlock) {

    //             return `${item.lgd_block_name}`;
    //         } else if (selectedDistrict && selectedDistrict !== AllDistrict && selectedDistrict !== SelectDistrict) {

    //             return `${item.lgd_block_name}`;
    //         } else if (selectedState && selectedState !== SelectState) {

    //             return `${item.lgd_district_name}`;
    //         } else if (selectedState === SelectState) {
    //             return `${item.lgd_state_name}`;
    //         }
    //     } else if (selectReportType === "ADP_Report") {
    //         if (selectedState && selectedState !== SelectState) {

    //             return `${item.lgd_district_name}`;
    //         }
    //         else if (selectedState !== SelectState && selectedState !== AllDistrict) {

    //             return `${item.lgd_district_name}`;
    //         }
    //         else if (selectedState === SelectState) {
    //             return `${item.lgd_state_name}`;
    //         }
    //     }
    //     return '';
    // };


    const data = useReportFilterData(aspirationalData)

    const percentageRenderer = (params) => {
        const value = params.value;
        if (typeof value === 'number') {
            return parseFloat(value).toFixed(2) + " %";
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
            headerName: "Percentange Schools with Teachers trained for teaching CWSN",
            field: "swsn_teacher_percent",
            cellRenderer: percentageRenderer,
            hide: false,
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
                ...(selectReportType === "ABP_Report" ? [{
                    headerName: "Block",
                    field: "lgd_block_name",
                    cellRenderer: ArrowRenderer,
                }] : []),


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
                    headerName: "Percentange Schools with Teachers trained for teaching CWSN",
                    field: "swsn_teacher_percent",
                    cellRenderer: percentageRenderer,
                    hide: false,
                },
            ]


            setColumn(columns);
        }
    }, [selectedState, selectReportType])

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
                            cellRenderer: selectReportType === "ADP_Report" ? ArrowRenderer : undefined,
                            field: "lgd_district_name",
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
                            cellRenderer: selectReportType === "ADP_Report" ? ArrowRenderer : undefined,
                            field: "lgd_district_name",
                        },
                    ]
                    : []),

                ...(selectReportType === "ABP_Report"
                    ? [
                        {
                            headerName: "Block",
                            cellRenderer: ArrowRenderer,
                            field: "lgd_block_name",
                        },
                    ]
                    : []),



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
                    headerName: "Percentage Schools with Teachers trained for teaching CWSN",
                    field: "swsn_teacher_percent",
                    cellRenderer: percentageRenderer,
                    hide: false,
                },
            ]);

        }

    }, [locationHeader, selectedState, selectedOption,
        selectedDistrict,
        selectReportType,]);

    useEffect(() => {
        if (selectedState !== "All State") {
            const baseColumns = [
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
                    headerName: "No. of Teachers",
                    field: "Teacher trained to teach CWSN",
                    hide: false,
                },
            ];

            if (selectedOption === "Top_50_Schools" || selectedOption === "Upcoming_50") {
                setColumn(baseColumns);
            }
        }
    }, [locationHeader, selectedState, selectedOption, selectedDistrict, selectReportType]);

    const compressData = useCallback((data, groupBy) => {
        return data.reduce((acc, curr) => {
            let groupKey = curr[groupBy];
            let group = acc.find((item) => item[groupBy] === groupKey);
            if (group) {
                group.total_school_cwsn += curr?.total_school_cwsn;
                group.tot_school += curr?.tot_school;

                group.swsn_teacher_percent = parseFloat(
                    ((group.total_school_cwsn * 100) / group.tot_school)?.toFixed(2)
                );
            } else {
                acc.push({
                    ...curr,
                    lgd_state_name: curr.lgd_state_name,
                    total_school_cwsn: curr.total_school_cwsn,
                    tot_school: curr.tot_school,
                    swsn_teacher_percent: parseFloat(
                        ((curr.total_school_cwsn * 100) / curr.tot_school)?.toFixed(2)
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

    useEffect(() => {
        if (selectedState !== "All State" && selectReportType === "ADP_Report") {
            dispatch(SetFinalData(compressedData))
        }

        else if (
            selectedState !== "All State" &&
            selectReportType === "ABP_Report"
        ) {
            dispatch(SetFinalData(data));
        }

        else {
            dispatch(SetFinalData(selectedDataAllYear))
        }
    }, [selectedState, data, selectedDataAllYear, selectReportType])

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
        setGridApi(params)
    }, []);
    /*------------Export data to Excel and PDF-------------*/
    const getHeaderToExport = (gridApi) => {
        const columns = gridApi.api.getAllDisplayedColumns();
        const headerCellSerialNumber = {
            text: "Serial Number",
            headerName: "S.NO.",
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
            if (typeof value === 'number') {
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
        const formattedDate = `${date.toLocaleDateString("en-GB", {
            weekday: "long", // Full day name (e.g., Friday)
          })}, ${date.toLocaleDateString("en-GB", {
            day: "2-digit", // Day of the month (e.g., 13)
            month: "long", // Full month name (e.g., September)
            year: "numeric", // Full year (e.g., 2024)
          })}, ${date.toLocaleTimeString("en-US", {
            hour: "2-digit", // Hour (e.g., 10)
            minute: "2-digit", // Minutes (e.g., 25)
            hour12: true, // 12-hour format with AM/PM
          })}`;
        const doc = new jsPDF({
            orientation: "portrait",
            unit: "in",
            format: [20, 20],
        });
        // Function to add header
        const addHeader = () => {
            doc.setFontSize(22);
            doc.setTextColor("black");
            doc.setFont("Helvetica", "bold");
            // doc.text("UDISE+", 0.6, 1);
      
            // Add the header text
            doc.text(
                selectReportType === "ADP_Report" ? " Aspirational District Programme  " :
                "Aspirational Block Programme",
  
              doc.internal.pageSize.width / 2,
              0.7,
              {
                fontStyle: "bold",
      
                color: "black",
                align: "center",
              }
            );
            doc.setFont("Helvetica", "normal");
      
            doc.setFontSize(18);
      
            doc.text(
              "Department of School Education & Literacy, Ministry of Education, Government of India",
              doc.internal.pageSize.width / 2,
              1.1,
              {
                // fontStyle: '',
                color: "black",
                align: "center",
              }
            );
      
            doc.setFont("Helvetica", "bold");
      
            doc.setTextColor("black");
            doc.setFontSize(20);
      
            doc.text(`${report_name}`, doc.internal.pageSize.width / 2, 1.5, {
              fontSize: 12,
              fontStyle: "bold",
      
              color: "black",
              align: "center",
            });
      
            doc.setFont("Helvetica", "bold");
      
        
      
            doc.setFont("bold");
      
            doc.setTextColor("black");
            doc.setFontSize(20);
      
            doc.text(
              `Academic Year:${selectedYear}`,
              doc.internal.pageSize.width / 2,
              1.9,
              {
                fontSize: 12,
                color: "black",
                align: "center",
              }
            );
      
            let textContent = "";

            if (
              selectedDistrict === "Select District" &&
              selectedState === "All State"
            ) {
              textContent = `National ${selectedState}`;
            } else if (
              selectedDistrict === "Select District" &&
              selectedState !== "All State"
            ) {
              textContent = `State -(${selectedState})`;
            }
      
            if (
              selectedState !== "All State" &&
              selectedDistrict === "All District"
            ) {
              textContent = `${selectedState}-${selectedDistrict}`;
            } else if (
              selectedState !== "All State" &&
              selectedDistrict !== "Select District" &&
              selectedDistrict !== "All District"
            ) {
              textContent = `District -${selectedDistrict}-(${selectedState})`;
            }
      
            if (
              selectedState !== "All State" &&
              selectedDistrict !== "All District" &&
              selectedBlock === "All Block"
            ) {
              textContent = `${selectedDistrict}-${selectedBlock}`;
            } else if (
              selectedState !== "All State" &&
              selectedDistrict !== "All District" &&
              selectedDistrict !== "Select District" &&
              selectedBlock !== "Select Block" &&
              selectedBlock !== "All Block"
            ) {
              textContent = `Block -${selectedBlock}-(${selectedDistrict} (${selectedState}))`;
            }
      
            if (textContent) {
              doc.text(textContent, doc.internal.pageSize.width / 2, 2.3, {
                fontSize: 12,
                color: "black",
                align: "center",
              });
            }
      
      
      
            // Set the margin for the image from the left
            const leftMargin = 0.1; // Margin from the left (in inches)
            const topLeftX = leftMargin; // X position from the left including margin
            const topLeftY = 0; // Y position from the top (in inches)
            const imgWidth = 2; // Image width (in inches)
            const imgHeight = 2; // Image height (in inches)
      
            doc.setFontSize(20);
            doc.setTextColor("blue");
      
            // Add the satyameva image with the specified left margin
            doc.addImage(
              satyamevaimg,
              "PNG",
              topLeftX,
              topLeftY,
              imgWidth,
              imgHeight
            );
      
            doc.setTextColor("blue");
            doc.setFont("bold");
      
            // Get page dimensions
            const pageWidthE = doc.internal.pageSize.getWidth();
            const pageHeightE = doc.internal.pageSize.getHeight();
      
            const imgWidthE = 2.8; // Image width (in inches)
            const imgHeightE = 1.4; // Image height (in inches)
            const marginRight = 0.7; // Right margin (in inches)
      
            // Calculate x position for top-right corner
            const topRightX = pageWidthE - imgWidthE - marginRight;
            const topRightY = 0.3; // Y position from the top (in inches)
      
            // Add the education image at the top-right corner
            doc.addImage(
              udise,
              "JPG",
              topRightX, // X position for top-right
              topRightY, // Y position for top-right
              imgWidthE,
              imgHeightE
            );
      
            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();
      
            // Example: Draw a rectangle around the whole page
            // doc.setLineWidth(0.02); // Thicker border for the page
            // doc.rect(0.1, 0.1, pageWidth - 0.2, pageHeight - 0.2); // x, y, width, height
          };
        // Function to add footer
        const addFooter = () => {
            const pageCount = doc.internal.getNumberOfPages();
            doc.setFontSize(20);
            doc.setTextColor("black");
      
            for (let i = 1; i <= pageCount; i++) {
              doc.setPage(i);
      
              doc.text(
                `Page ${i} of ${pageCount}`,
                doc.internal.pageSize.width / 2,
                // doc.internal.pageSize.width - 1,
                doc.internal.pageSize.height - 0.2,
                { align: "center", color: "black" }
              );
      
              doc.text(
                `Report generated on : ${formattedDate}`,
                doc.internal.pageSize.width - 1,
                doc.internal.pageSize.height - 0.2,
                { fontSize: 12, align: "right", color: "black" }
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
            theme: "grid",
            startY: 2.7,
            styles: {
              cellPadding: 0.15, // Adjust cell padding if needed
              lineColor: [0, 0, 0], // Set border color (black in this case)
              lineWidth: 0.001, // Set border width
              fillColor: [255, 255, 255], // Default background color (white)
              textColor: [0, 0, 0],
            },
            headStyles: {
              fontSize: 14, // Set the font size for the header row
              fontStyle: "bold", // Make the header text bold (optional)
              textColor: [0, 0, 0],
              cellPadding: 0.2, // Set text color for the header row
            },
      
            didParseCell: function (data) {
              const headerRow = getHeaderToExport(gridApi); // Get the header row
      
              // Get the header text for this column
              const columnHeaderText = headerRow[data.column.index]?.text;
              console.log(columnHeaderText, "columnHeaderText");
              // Check if the current column header is "Serial Number"
              if (columnHeaderText === "Serial Number") {
                data.cell.styles.halign = "center"; // Center-align the content for "Serial Number"
              } else if (columnHeaderText === "RegionName") {
                console.log(columnHeaderText, "columnHeaderText");
                data.cell.styles.halign = "left"; // Center-align the content for "Serial Number"
              } else {
                console.log("columnHeaderText");
                data.cell.styles.halign = "right";
              }
            },
      
            afterPageContent: addFooter,
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
                headerName: "S.NO.",
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
    // const toggleClass = (e) => {
    //     dispatch(setIsActiveGraph(!isActiveGraph));
    //     dispatch(setselectedOptionTop50(""));
    // };


    const toggleClass = (isGraph) => {
        dispatch(setLoading(true));
        if (isGraph !== false) {
            dispatch(setIsActiveGraph(true));
            setTimeout(() => {
                dispatch(setLoading(false));
            }, [150])
        }
        else {
            dispatch(setIsActiveGraph(false));
            dispatch(setselectedOptionTop50(""));
            setTimeout(() => {
                dispatch(setLoading(false));
            }, [150])
        }
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
                                                            : selectedDistrict !== SelectDistrict && selectedDistrict !== AllDistrict
                                                                ? `${selectedDistrict}`
                                                                : selectedDistrict === AllDistrict
                                                                    ? `${selectedState} District's`
                                                                    : `${selectedState} District's`
                                                        : selectReportType === "ABP_Report"
                                                            ? selectedState === "All State"
                                                                ? "All State"
                                                                : selectedState !== SelectState
                                                                    ? selectedDistrict === SelectDistrict || selectedDistrict === AllDistrict
                                                                        ? `${selectedState} District's`
                                                                        : selectedBlock !== SelectBlock && selectedBlock !== AllBlock
                                                                            ? `${selectedBlock}`
                                                                            : `${selectedDistrict} Block's`
                                                                    : selectedBlock
                                                            : selectedBlock}
                                                </h5>
                                                <h3 className="heading-sm">
                                                    {reportTitle}
                                                </h3>

                                            </div>
                                            <div className="tab-box">
                                                <button className={`tab-button  ${isActiveGraph ? '' : 'active'}`} onClick={() => { toggleClass(false) }}><img src={table} alt="Table" /> <span>{t('tableView')}</span></button>
                                                <button className={`tab-button  ${isActiveGraph ? 'active' : ''}`} onClick={() => { toggleClass(true) }}><img src={chart} alt="chart" /> <span>{t('chartView')}</span></button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="d-flex justify-content-end w-m-100">
                                            {selectedState !== SelectState && (selectedDistrict !== SelectDistrict && selectReportType !== "ABP_Report" && selectedDistrict !== AllDistrict) && isActiveGraph === false ? (
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
                                                            {t('top_50_schools')}
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
                                                            {t('upcoming_50_schools')}
                                                        </label>
                                                    </div>
                                                </div>
                                            ) : ("")}
                                            {isActiveGraph === false ? (
                                                <div className="">
                                                    {/* <img src={download} alt="download" /> */}
                                                    <select id="export_data" className="form-select download-button" defaultValue={""} onChange={handleExportData}>
                                                        <option className="option-hide">  {t('downloadReport')} {selectedYear}</option>
                                                        <option value="export_pdf">{t('downloadAsPdf')}</option>
                                                        <option value="export_excel">   {t('downloadAsExcel')}</option>
                                                    </select>
                                                </div>
                                            ) : ("")}

                                        </div>

                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-md-12">
                                        <div className={`table-box mt-4  ${isActiveGraph ? 'd-none' : ''}`}>
                                            <div id="content" className="multi-header-table ag-theme-balham ag-theme-custom-height fixed-header-height"
                                                style={{ width: "100%", height: 400 }} >
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
                                        <div className={`graph-box  ${isActiveGraph ? '' : 'd-none'}`}>
                                            <TeacherTrainedCwsnBarGraph />
                                        </div>
                                    </div>
                                </div>
                            </div>


                        </div>

                        {
                            selectedState !== "All State" && selectReportType === "ADP_Report" && (selectedOption !== "Top_50_Schools" && selectedOption !== "Upcoming_50") ? (
                                <StudentsPerformanceCompare />
                            ) : (selectedState !== "All State" && selectedDistrict !== SelectDistrict && selectedDistrict !== AllDistrict) && selectReportType === "ABP_Report" ? (
                                <StudentsPerformanceBlockCompare />
                            ) : (
                                ""
                            )
                        }
                    </div>
                </div>
            </section>
        </>
    )
}