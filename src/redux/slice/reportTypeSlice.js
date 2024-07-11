import { createSlice } from "@reduxjs/toolkit";

const reportTypeSlice = createSlice({
    name: 'reportTypeSlice',
    initialState:{
        updateReportType:"ADP_Report",
        loadingStatus:false,
        selectedOption:"upper_primary_to_secondary"
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
    },
  })
  
  export const { setUpdateReportType,setUpdateStatus, setselectedOption } = reportTypeSlice.actions
  export default reportTypeSlice.reducer