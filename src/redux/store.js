import { configureStore } from "@reduxjs/toolkit";


import reportTypeSlice from "./slice/reportTypeSlice";
import filterServicesSlice from "./slice/filterServicesSlice";
import filterServicesComprisionSlice from "./slice/filterServicesComprisionSlice";
import darkLightModeSlice from "./slice/darkLightModeSlice";


const store = configureStore({
    reducer:{
     
        locationAdp:filterServicesSlice,
        comprisionAdp:filterServicesComprisionSlice,
        reportAdpAbpType:reportTypeSlice,
        toggle:darkLightModeSlice,
        

    }
  });

export default store;