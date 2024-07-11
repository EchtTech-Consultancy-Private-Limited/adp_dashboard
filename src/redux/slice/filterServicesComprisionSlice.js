import { createSlice } from '@reduxjs/toolkit';

const initialState = {
name: "district/comprision",
  states: [],
  districts: [],
  selectedState: "Select State",
  selectedDistrict: "All District",
  
};

const filterServicesComprisionSlice = createSlice({
  name: 'comprisionAdp',
  initialState,
  reducers: {
    setStates: (state, action) => {
      state.states = action.payload;
    },
    setDistricts: (state, action) => {
      state.districts = action.payload;
    },
   
    selectState: (state, action) => {
      state.selectedState = action.payload;
      state.selectedDistrict = "Select District"; 
      state.districts = state.states.find(st => st.lgd_state_name === action.payload)?.districts || []; 
     
    },
    selectDistrict: (state, action) => {
      state.selectedDistrict = action.payload;
    
    },
   
  }
});

export const { setStates, setDistricts, selectState, selectDistrict,selectedAllIndia } = filterServicesComprisionSlice.actions;

export default filterServicesComprisionSlice.reducer;
