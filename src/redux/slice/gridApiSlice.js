import { createSlice } from "@reduxjs/toolkit";

const gridApiSlice = createSlice({
  name: 'gridApiSlice',
  initialState: {
    girdAPIForCommonData: null,
  },
  reducers: {
    setgirdAPIForCommonData(state, action) {
      // Serialize GridApi before storing
      state.girdAPIForCommonData = serializeGridApi(action.payload);
    },
  },
});

// Serialize GridApi function
function serializeGridApi(gridApi) {
  // Extract necessary properties or serialize as needed
  return {
    detailGridInfoMap: gridApi.detailGridInfoMap,
    destroyCalled: gridApi.destroyCalled,
    // Add more properties if needed
  };
}

export const { setgirdAPIForCommonData } = gridApiSlice.actions;
export default gridApiSlice.reducer;
