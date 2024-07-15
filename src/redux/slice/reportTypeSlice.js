import { createSlice } from "@reduxjs/toolkit";

const reportTypeSlice = createSlice({
    name: 'reportTypeSlice',
    initialState:{
        updateReportType:"ADP_Report",
        loadingStatus:false,
        selectedOption:"upper_primary_to_secondary",
        selectedCompareOption:"upper_primary_to_secondary",
        selectedStateShow:"Select State",
        selectedReport:"Transition Rate",
        selectedCompareDistricts:[]
    },
    reducers: {
      setUpdateReportType(state,action) {
        state.updateReportType=action.payload;
      },
      setUpdateStatus(state,action) {
        state.loadingStatus=action.payload;
      },
      setselectedOption(state,action) {
        state.selectedOption=action.payload;
      },
      setselectedCompareOption(state,action) {
        state.selectedCompareOption=action.payload;
      },
      setselectedStateShow(state,action) {
        state.selectedStateShow=action.payload;
      },
      setselectedReport(state,action) {
        state.selectedReport=action.payload;
      },
      setselectedCompareDistricts(state,action) {
        state.selectedCompareDistricts=action.payload;
      },
    },
  })
  
  export const { setUpdateReportType,setUpdateStatus, setselectedOption,setselectedCompareOption,setselectedStateShow,setselectedReport,setselectedCompareDistricts } = reportTypeSlice.actions
  export default reportTypeSlice.reducer