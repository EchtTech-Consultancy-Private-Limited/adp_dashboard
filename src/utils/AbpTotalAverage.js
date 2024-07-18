




  
  //  ****************Start  get the data All India National Wise**************




  
  const  AbpCountTotalAverage= (aspirationalAbpData,numberOfUniqueBlockes) => {
    const aspirationalAbpDataAllState = {};
  
    aspirationalAbpData.forEach((item) => {
      for (const key in item) {
        if (key !== "Location" && typeof item[key] === "number") {
          if (aspirationalAbpDataAllState[key]) {
            aspirationalAbpDataAllState[key] += item[key];
          } else {
            aspirationalAbpDataAllState[key] = item[key];
          }
        }
      }
    });
  
    aspirationalAbpDataAllState.Location = "All India";
    aspirationalAbpDataAllState.Sec_Upri_Total = 
    (aspirationalAbpDataAllState.sec_t + aspirationalAbpDataAllState.upri_t) / numberOfUniqueBlockes/2;    
    return [aspirationalAbpDataAllState];
  };
  
  








export default AbpCountTotalAverage;







