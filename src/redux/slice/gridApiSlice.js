import { createSlice } from "@reduxjs/toolkit";

const gridApiSlice = createSlice({
  name: 'gridApiSlice',
  initialState: {
    girdAPIForCommonData: null,
  },
  reducers: {
    setgirdAPIForCommonData(state, action) {
      state.girdAPIForCommonData = serializeGridApi(action.payload);
    },
  },
});

function serializeGridApi(gridApi) {
  return {
    detailGridInfoMap: gridApi.detailGridInfoMap,
    destroyCalled: gridApi.destroyCalled,
  };
}

export const { setgirdAPIForCommonData } = gridApiSlice.actions;
export default gridApiSlice.reducer;
