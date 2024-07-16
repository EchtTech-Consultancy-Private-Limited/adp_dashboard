




  
  //  ****************Start  get the data All India National Wise**************
  
  const Allindia = (aspirationalAdpData) => {
    const aspirationalAdpDataAllState = {};
  
    aspirationalAdpData.forEach((item) => {
      for (const key in item) {
        if (key !== "Location" && typeof item[key] === "number") {
          if (aspirationalAdpDataAllState[key]) {
            aspirationalAdpDataAllState[key] += item[key];
          } else {
            aspirationalAdpDataAllState[key] = item[key];
          }
        }
      }
    });
  
    aspirationalAdpDataAllState.Location = "All India";
  
    return [aspirationalAdpDataAllState];
  };
  
  








export default Allindia;







