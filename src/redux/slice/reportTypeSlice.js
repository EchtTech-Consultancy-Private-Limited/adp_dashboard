import { createSlice } from "@reduxjs/toolkit";

const reportTypeSlice = createSlice({
    name: 'reportTypeSlice',
    initialState:{
        updateReportType:"ADP_Report"
    },
    reducers: {
      setUpdateReportType(state,action) {
        state.updateReportType=action.payload;
      },

      
    },
  })
  
  export const { setUpdateReportType } = reportTypeSlice.actions
  export default reportTypeSlice.reducer