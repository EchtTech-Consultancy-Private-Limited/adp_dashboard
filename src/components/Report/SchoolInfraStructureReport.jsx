import React, { useState, useEffect, useCallback, useMemo } from "react";
import BannerReportFilter from "./BannerReportFilter";
import table from "../../assets/images/table.svg";
import chart from "../../assets/images/bar-chart.svg";
import "./report.scss";
import Swal from "sweetalert2";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-enterprise";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-balham.css";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { GlobalLoading } from "../GlobalLoading/GlobalLoading";
import {
  SetFinalData,
  setselectedOption,
  setselectedOptionTop50,
  SetSheetName,
  setIsActiveGraph,
  setLoading,
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
import SchoolInfraStructureCompare from "./ReportCompare/SchoolInfraStructureCompare";
import SchoolInfraStructureBlockCompare from "./ReportCompare/SchoolInfraStructureBlockCompare";
import schWithToiletRatioAdp2019 from "../../aspirational-reports-data/schWithToiletRatioAdp2019-2020.json";
import schWithToiletRatioAdp2020 from "../../aspirational-reports-data/schWithToiletRatioAdp2020-2021.json";
import schWithToiletRatioAdp2021 from "../../aspirational-reports-data/schWithToiletRatioAdp2021-2022.json";
import schWithToiletRatioAdp2022 from "../../aspirational-reports-data/schWithToiletRatioAdp2022-2023.json";
import { ArrowRenderer } from "./ArrowRenderer/ArrowRenderer";
import useReportFilterData from "../../CustomHook/useReportFilterData";
import SchoolInfraStructureLineGraph from "./graph/SchoolInfraStructureLineGraph";
import SchoolInfraStructureTreeGraph from "./graph/SchoolInfraStructureTreeGraph";
import SchoolInfraColumnGraph from "./graph/SchoolInfraColumnGraph";
import satyamevaimg from "../../assets/images/satyameva-jayate-img.png";
import udise from "../../assets/images/udiseplu.jpg";
export default function SchoolInfraStructureReport() {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const loading = useSelector((state) => state.reportAdpAbpType.loading);

  const { selectedState, selectedDistrict, selectedBlock } = useSelector(
    (state) => state.locationAdp
  );
  const [locationHeader, SetLocationHeader] = useState();
  const aspirationalData = useSelector(
    (state) => state.reportAdpAbpType.aspirationalAllData
  );
  const selectedDataAllYear = useSelector(
    (state) => state.reportAdpAbpType.selectedDataAllYear
  );
  const selectReportType = useSelector(
    (state) => state.reportAdpAbpType.updateReportType
  );
  const selectedOption = useSelector(
    (state) => state.reportAdpAbpType.selectedOptionTop50
  );
  const selectedYear = useSelector(
    (state) => state.reportAdpAbpType.selectedYear
  );
  const sheetName = useSelector((state) => state.reportAdpAbpType.sheetName);
  const isActiveGraph = useSelector(
    (state) => state.reportAdpAbpType.isActiveGraph
  );

  const [gridApi, setGridApi] = useState();
  const savedReportName = localStorage.getItem("selectedReport");
  const selectedReport = useSelector(
    (state) => state.reportAdpAbpType.selectedReport
  );

  const report_name = selectedReport;

  // const [data, setData] = useState([]);
  const finalData = useSelector((state) => state.reportAdpAbpType.finalData);
  const [topPtrData, setTopPtrData] = useState([]);
  const [top50Data, setTop50Data] = useState([]);
  localStorage.setItem(
    "selectedReportValue",
    "Percentange of Schools Having Adequate Functional Girls Toilets"
  );
  {
    /* Set Report Title Start*/
  }
  const reportTitle =
    selectedOption === "Top_50_Schools"
      ? t("top_50_schools_with_40_1_girls_toilets")
      : selectedOption === "Upcoming_50"
      ? t("upcoming_50_schools_with_40_1_girls_toilets")
      : t("schoolInfrastructureReport");

  localStorage.setItem("selectedReport", reportTitle);
  {
    /* Set Report Title End*/
  }

  {
    /* Show top 100 Data start*/
  }
  const combinedTopData = {
    "2019-20": {
      ADP_Report: schWithToiletRatioAdp2019,
    },
    "2020-21": {
      ADP_Report: schWithToiletRatioAdp2020,
    },
    "2021-22": {
      ADP_Report: schWithToiletRatioAdp2021,
    },
    "2022-23": {
      ADP_Report: schWithToiletRatioAdp2022,
    },
  };

  useEffect(() => {
    const reportData =
      combinedTopData[selectedYear] &&
      combinedTopData[selectedYear][selectReportType];

    if (reportData && reportData.length > 0) {
      setTopPtrData(reportData);
    } else {
      setTopPtrData([]);
    }
  }, [selectReportType, selectedYear]);

  const filteredTopeData = useMemo(() => {
    return Array.isArray(topPtrData) && topPtrData.length > 0
      ? topPtrData.filter((topeItem) => {
          const districtMatch =
            selectedDistrict !== "SelectDistrict"
              ? finalData.some(
                  (finalItem) =>
                    finalItem.lgd_district_id === topeItem.lgd_district_id
                )
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

  {
    /* Show top 100 Data End*/
  }
  // const [finalData, SetFinalData] = useState([]
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
    selectedBlock,
    SelectDistrict,
    selectReportType,
  ]);

  const data = useReportFilterData(aspirationalData);
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
      headerName: locationHeader,
      cellRenderer: ArrowRenderer,
      field: "Location",
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
      headerName:
        "percentage of Schools having girls toilets in the ratio of 40:1",
      field: "sch_having_toilet_40_percent",
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
          cellRenderer:
            selectReportType === "ADP_Report" ? ArrowRenderer : undefined,
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
          headerName:
            "Number of Schools having girls toilets in the ratio of 40:1",
          field: "toilet_40",
          hide: false,
        },
        {
          headerName:
            "percentage of Schools having girls toilets in the ratio of 40:1",
          field: "sch_having_toilet_40_percent",
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
                cellRenderer:
                  selectReportType === "ADP_Report" ? ArrowRenderer : undefined,
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
                cellRenderer:
                  selectReportType === "ADP_Report" ? ArrowRenderer : undefined,
                field: "lgd_district_name",
              },
            ]
          : []),

        // {
        //   headerName: locationHeader,
        //   cellRenderer: ArrowRenderer,
        //   field: "Location",
        // },

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
          headerName:
            "Number of Schools having girls toilets in the ratio of 40:1",
          field: "toilet_40",
          hide: false,
        },
        {
          headerName:
            "percentage of Schools having girls toilets in the ratio of 40:1",
          field: "sch_having_toilet_40_percent",
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
            headerName: "Adequate Girls Toilet",
            field: "Enrolment Toilet ratio(40:1)",
            hide: false,
          },
        ]);
      } else if (selectedOption === "Upcoming_50") {
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
            headerName: "Adequate Girls Toilet",
            field: "Enrolment Toilet ratio(40:1)",
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
      const groupKey = curr[groupBy];
      let group = acc.find((item) => item[groupBy] === groupKey);

      if (group) {
        group.tot_school_girl_co_ed += curr?.tot_school_girl_co_ed || 0;
        group.total_no_of_fun_girls_toilet +=
          curr?.total_no_of_fun_girls_toilet || 0;
        group.toilet_40 += curr?.toilet_40 || 0;

        const totalSchools = group.tot_school_girl_co_ed;
        const totalToilet40 = group.toilet_40;

        group.functional_toilet_girls_percent = parseFloat(
          curr?.functional_toilet_girls_percent || 0
        ).toFixed(2);

        group.sch_having_toilet_40_percent = parseFloat(
          (totalToilet40 * 100) / totalSchools
        ).toFixed(2);
      } else {
        const totalSchools = curr?.tot_school_girl_co_ed || 0;
        const totalToilet40 = curr?.toilet_40 || 0;

        acc.push({
          ...curr,
          lgd_state_name: curr.lgd_state_name,
          tot_school_girl_co_ed: totalSchools,
          total_no_of_fun_girls_toilet: curr?.total_no_of_fun_girls_toilet || 0,
          toilet_40: totalToilet40,
          functional_toilet_girls_percent: parseFloat(
            curr.functional_toilet_girls_percent || 0
          ).toFixed(2),
          sch_having_toilet_40_percent: parseFloat(
            (totalToilet40 * 100) / totalSchools
          ).toFixed(2),
        });
      }
      dispatch(setLoading(false));
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
      dispatch(SetFinalData(selectedDataAllYear));
    }
  }, [selectedState, data, selectedDataAllYear, selectReportType]);

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
    const formattedDate = `${date.toLocaleDateString("en-GB", {
      weekday: "long",
    })}, ${date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    })}, ${date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
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
        selectReportType === "ADP_Report"
          ? " Aspirational District Programme  "
          : "Aspirational Block Programme",

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
      let textContent = `National ${selectedState}`;

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
    };
    // Function to add footer
    const addFooter = () => {
      const pageCount = doc.internal.getNumberOfPages();
      doc.page = 1;

      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(20);
        doc.setTextColor("black");

        doc.text(
          `Page ${i} of ${doc.page++}`,
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
      toast.success("Downloaded Successfully!", {
        position: "bottom-left",
        autoClose: 1000,
        hideProgressBar: true,
      });
    }
    if (value === "export_excel") {
      exportToExcel();
      toast.success("Downloaded Successfully!", {
        position: "bottom-left",
        autoClose: 1000,
        hideProgressBar: true,
      });
    }
    document.getElementById("export_data").selectedIndex = 0;
  };

  useEffect(() => {
    if (selectedDistrict === SelectDistrict) {
      dispatch(setselectedOptionTop50(""));
    }
  }, [selectedDistrict]);

  const handleOptionChange = (event) => {
    dispatch(setselectedOptionTop50(event.target.value));
  };
  // const toggleClass = (e) => {
  //   dispatch(setselectedOptionTop50(""));
  // };

  const toggleClass = (isGraph) => {
    dispatch(setLoading(true));
    if (isGraph !== false) {
      dispatch(setIsActiveGraph(true));
      setTimeout(() => {
        dispatch(setLoading(false));
      }, [150]);
    } else {
      dispatch(setIsActiveGraph(false));
      dispatch(setselectedOptionTop50(""));
      setTimeout(() => {
        dispatch(setLoading(false));
      }, [150]);
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
                        <h3 className="heading-sm">{reportTitle}</h3>
                      </div>
                      <div className="tab-box">
                        <button
                          className={`tab-button  ${
                            isActiveGraph ? "" : "active"
                          }`}
                          onClick={() => {
                            toggleClass(false);
                          }}
                        >
                          <img src={table} alt="Table" />{" "}
                          <span>{t("tableView")}</span>
                        </button>
                        <button
                          className={`tab-button  ${
                            isActiveGraph ? "active" : ""
                          }`}
                          onClick={() => {
                            toggleClass(true);
                          }}
                        >
                          <img src={chart} alt="chart" />{" "}
                          <span>{t("chartView")}</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="d-flex w-m-100 justify-content-end">
                      {selectedState !== SelectState &&
                      selectedDistrict !== SelectDistrict &&
                      selectedDistrict !== AllDistrict &&
                      selectReportType !== "ABP_Report" &&
                      selectedDistrict !== AllDistrict &&
                      isActiveGraph === false ? (
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
                              {" "}
                              {t("top_50_schools")}
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
                              {t("upcoming_50_schools")}
                            </label>
                          </div>
                        </div>
                      ) : (
                        ""
                      )}
                      {isActiveGraph === false ? (
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
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-12">
                    <div
                      className={`table-box mt-4  ${
                        isActiveGraph ? "d-none" : ""
                      }`}
                    >
                      <div
                        id="content"
                        className="multi-header-table ag-theme-balham ag-theme-custom-height fixed-header-height"
                        style={{ width: "100%", height: 400 }}
                      >
                        <AgGridReact
                          columnDefs={columns}
                          rowData={
                            selectedOption === "Top_50_Schools"
                              ? top50Data && top50Data.length > 0
                                ? top50Data
                                : []
                              : selectedOption === "Upcoming_50"
                              ? top50Data && top50Data.length > 0
                                ? top50Data
                                : []
                              : finalData && finalData.length > 0
                              ? finalData
                              : []
                          }
                          defaultColDef={defColumnDefs}
                          onGridReady={onGridReady}
                        />
                      </div>
                    </div>
                    <div
                      className={`graph-box  ${isActiveGraph ? "" : "d-none"}`}
                    >
                      <div className="row">
                        <div className="col-md-5">
                          <SchoolInfraStructureLineGraph />
                        </div>
                        <div className="col-md-7">
                          <SchoolInfraColumnGraph />
                        </div>
                        <div className="col-md-12">
                          <SchoolInfraStructureTreeGraph />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {selectedState !== "All State" &&
            selectReportType === "ADP_Report" &&
            selectedOption !== "Top_50_Schools" &&
            selectedOption !== "Upcoming_50" ? (
              <SchoolInfraStructureCompare />
            ) : selectedState !== "All State" &&
              selectedDistrict !== SelectDistrict &&
              selectedDistrict !== AllDistrict &&
              selectReportType === "ABP_Report" ? (
              <SchoolInfraStructureBlockCompare />
            ) : (
              ""
            )}
          </div>
        </div>
      </section>
    </>
  );
}
