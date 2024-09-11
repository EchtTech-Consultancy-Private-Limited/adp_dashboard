import { createSlice } from "@reduxjs/toolkit";

const reportTypeSlice = createSlice({
  name: 'reportTypeSlice',
  initialState: {
    updateReportType: "ADP_Report",
    loadingStatus: false,
    selectedOption: "upper_primary_to_secondary",
    selectedOptionTop50: "",
    selectedCompareOption: "upper_primary_to_secondary",
    selectedStateShow: "Select State",
    selectedReport: "Transition Rate",
    selectedCompareDistricts: [],
    selectedCompareBlock: [],
    selectedYear: "2022-23",
    girdAPIForCommonData: null,
    sheetName: "",
    handleExportData: null,
    aspirationalAllData: [],
    selectedDataAllYear: [],
    previousYearData:[],
    finalData: [],
    currentPage: 1,
    isActiveGraph: false,
    allYearDataForGraph:{},
    loading : true,   


  },
  reducers: {
    setUpdateReportType(state, action) {
      state.updateReportType = action.payload;
    },
    setUpdateStatus(state, action) {
      state.loadingStatus = action.payload;
    },
    setselectedOption(state, action) {
      state.selectedOption = action.payload;
    },
    setselectedOptionTop50(state, action) {
      state.selectedOptionTop50 = action.payload;
    },
    setselectedCompareOption(state, action) {
      state.selectedCompareOption = action.payload;
    },
    setselectedStateShow(state, action) {
      state.selectedStateShow = action.payload;
    },
    setselectedReport(state, action) {
      state.selectedReport = action.payload;
    },
    setselectedCompareDistricts(state, action) {
      state.selectedCompareDistricts = action.payload;
    },
    setselectedCompareBlocks(state, action) {
      state.selectedCompareBlock = action.payload;
    },
    setSelectedYear(state, action) {
      state.selectedYear = action.payload;
    },
    setgirdAPIForCommonData(state, action) {
      state.girdAPIForCommonData = action.payload;
    },
    SetSheetName(state, action) {
      state.sheetName = action.payload;
    },
    SethandleExportData(state, action) {
      state.handleExportData = action.payload;

    },
    setAspirationalAllData(state, action) {
      state.aspirationalAllData = action.payload;
    },
    setselectedDataAllYear(state, action) {
      state.selectedDataAllYear = action.payload;
    },
    setPreviousYearData(state, action) {
      state.previousYearData = action.payload;
    },
    SetFinalData(state, action) {
      state.finalData = action.payload;
    },
    setCurrentPage(state, action) {
      state.currentPage = action.payload;
    },
    setIsActiveGraph(state, action) {
      state.isActiveGraph = action.payload;
    },
    setAllYearDataForGraph(state, action) {
      state.allYearDataForGraph = action.payload;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },

    
  },
})

export const { setUpdateReportType, setUpdateStatus, setselectedOption, setselectedCompareOption, setselectedStateShow, setselectedReport, setselectedCompareDistricts, setselectedCompareBlocks, setSelectedYear, setgirdAPIForCommonData, SetSheetName, SethandleExportData, setAspirationalAllData, setselectedDataAllYear, SetFinalData, setCurrentPage, setIsActiveGraph, setselectedOptionTop50,setAllYearDataForGraph,setLoading,setPreviousYearData } = reportTypeSlice.actions
export default reportTypeSlice.reducer