import { createSlice } from "@reduxjs/toolkit";

const reportTypeSlice = createSlice({
    name: 'reportTypeSlice',
    initialState:{
        updateReportType:"ADP_Report",
        loadingStatus:false
    },
    reducers: {
      setUpdateReportType(state,action) {
        state.updateReportType=action.payload;
      },
      setUpdateStatus(state,action) {
        state.loadingStatus=action.payload;
      },
      
    },
  })
  
  export const { setUpdateReportType,setUpdateStatus } = reportTypeSlice.actions
  export default reportTypeSlice.reducer