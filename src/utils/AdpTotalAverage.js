//  ****************Start  get the data All India National Wise**************

const AdpCountTotalAverage = (aspirationalAdpData, numberOfUniqueDistricts) => {
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
  aspirationalAdpDataAllState.Sec_Upri_Total =
    (aspirationalAdpDataAllState.sec_t + aspirationalAdpDataAllState.upri_t) /
    numberOfUniqueDistricts /
    2;

    aspirationalAdpDataAllState.TeachAndSchResourses = aspirationalAdpDataAllState.ele_sch_percent / numberOfUniqueDistricts;

    aspirationalAdpDataAllState.StudentPerformance = aspirationalAdpDataAllState.swsn_teacher_percent
    / numberOfUniqueDistricts;


  return [aspirationalAdpDataAllState];
};

export default AdpCountTotalAverage;
