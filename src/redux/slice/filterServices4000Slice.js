
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  states: [],
  districts: [],
  blocks: [],
  selectedState: null,
  selectedDistrict: null,
  selectedBlock: null
};

const filterServices4000Slice = createSlice({
  name: 'location',
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
      state.selectedDistrict = null;
      state.selectedBlock = null;
      state.districts = state.states.find(st => st.lgd_state_id === action.payload)?.districts || [];
    },
    selectDistrict: (state, action) => {
      state.selectedDistrict = action.payload;
      state.selectedBlock = null;
      state.blocks = state.districts.find(dist => dist.lgd_district_id === action.payload)?.blocks || [];
    },
    selectBlock: (state, action) => {
      state.selectedBlock = action.payload;
    }
  }
});

export const { setStates, setDistricts, setBlocks, selectState, selectDistrict, selectBlock } = filterServices4000Slice.actions;

export default filterServices4000Slice.reducer;