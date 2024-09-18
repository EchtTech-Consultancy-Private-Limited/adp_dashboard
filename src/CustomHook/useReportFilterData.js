import React, {  useEffect, useState } from "react";
import { useSelector ,useDispatch} from "react-redux";

import {
  AllBlock,
  AllDistrict,
  SelectBlock,
  SelectDistrict,
  SelectState,
} from "../constant/Constant";

import { setLoading } from '../redux/slice/reportTypeSlice';

const useReportFilterData = (combinedData) => {
  const [data, setData] = useState([])
  const dispatch = useDispatch();

  const { selectedState, selectedDistrict, selectedBlock } = useSelector(
    (state) => state.locationAdp
  );
  const selectReportType = useSelector(
    (state) => state.reportAdpAbpType.updateReportType
  );
  

  useEffect(() => {
    let filteredData = combinedData;
    if (selectedState && selectedState !== SelectState) {
      filteredData = filteredData?.filter(
        (item) => item.lgd_state_name === selectedState
      );
    }

    if (
      selectedDistrict &&
      selectedDistrict !== AllDistrict &&
      selectedDistrict !== SelectDistrict
    ) {
      filteredData = filteredData.filter(
        (item) => item.lgd_district_name === selectedDistrict
      );
    }

    if (
      selectedBlock &&
      selectedBlock !== AllBlock &&
      selectedBlock !== SelectBlock
    ) {
      filteredData = filteredData?.filter(
        (item) => item.lgd_block_name === selectedBlock
      );
    }
    filteredData = filteredData?.map((item) => ({
      ...item,
      Location: getLocationName(item),
    }));
    setData(filteredData);
    // setTimeout(()=>{
    //   dispatch(setLoading(false));
    // },[1000])
    
    // dispatch(setLoading(false));
  

    // dispatch(setUpdateStatus(false))
  }, [
    selectedState,
    selectedDistrict,
    selectedBlock,
    combinedData,
    selectReportType,
  ]);
  const getLocationName = (item) => {
    if (selectReportType === "ABP_Report") {
      if (
        selectedBlock &&
        selectedBlock !== AllBlock &&
        selectedBlock !== SelectBlock
      ) {
        return `${item.lgd_block_name}`;
      } else if (
        selectedDistrict &&
        selectedDistrict !== AllDistrict &&
        selectedDistrict !== SelectDistrict
      ) {
        return `${item.lgd_block_name}`;
      } else if (selectedState && selectedState !== SelectState) {
        return `${item.lgd_district_name}`;
      } else if (selectedState === SelectState) {
        return `${item.lgd_state_name}`;
      }
    } else if (selectReportType === "ADP_Report") {
      if (selectedState && selectedState !== SelectState) {
        return `${item.lgd_district_name}`;
      } else if (
        selectedState !== SelectState &&
        selectedState !== AllDistrict
      ) {
        return `${item.lgd_district_name}`;
      } else if (selectedState === SelectState) {
        return `${item.lgd_state_name}`;
      }
    }
    return "";

  };
  return  data ;

};

export default useReportFilterData;
