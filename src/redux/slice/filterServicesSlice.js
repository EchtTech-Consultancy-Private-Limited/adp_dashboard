import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  name: "district/report-4001",
  states: [],
  districts: [],
  blocks: [],
  selectedState: "All State",
  selectedDistrict: "All District",
  selectedBlock: "All Block",
};

const filterServicesSlice = createSlice({
  name: 'locationAdp',
  initialState,
  reducers: {
    setStates: (state, action) => {
      state.states = action.payload;
    },
    setDistricts: (state, action) => {
      state.districts = action.payload;
    },
    setBlocks: (state, action) => {
      state.blocks = action.payload;
    },
    selectState: (state, action) => {
      state.selectedState = action.payload;
      state.selectedDistrict = "Select District"; 
      state.selectedBlock = "Select Block"; 
      state.districts = state.states.find(st => st.lgd_state_name === action.payload)?.districts || []; 
      state.blocks = []; 
    },
    selectDistrict: (state, action) => {
      state.selectedDistrict = action.payload;
      state.selectedBlock = "Select Block"; 
      state.blocks = state.districts.find(dist => dist.lgd_district_name === action.payload)?.blocks || []; 
    },
    selectBlock: (state, action) => {

      state.selectedBlock = action.payload;

    }
  }
});

export const { setStates, setDistricts, setBlocks, selectState, selectDistrict, selectBlock,selectedAllIndia } = filterServicesSlice.actions;

export default filterServicesSlice.reducer;
