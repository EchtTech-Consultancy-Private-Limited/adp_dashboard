import { createSlice } from "@reduxjs/toolkit";

const reportTypeSlice = createSlice({
    name: 'reportTypeSlice',
    initialState:{
        updateReportType:"ADP_Report",
        loadingStatus:false,
        selectedOption:"upper_primary_to_secondary",
        selectedCompareOption:"upper_primary_to_secondary"
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
    },
  })
  
  export const { setUpdateReportType,setUpdateStatus, setselectedOption,setselectedCompareOption } = reportTypeSlice.actions
  export default reportTypeSlice.reducer