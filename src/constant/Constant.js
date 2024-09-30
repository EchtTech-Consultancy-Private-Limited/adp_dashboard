export const SelectState = "All State";
export const AllDistrict = "All District";
export const SelectDistrict = "Select District";
export const AllBlock = "All Block";
export const SelectBlock = "Select Block";
export const SelectKpi = "Select KPI";
export const selectedOptionConst = "upper_primary_to_secondary";
export const intialYear = "2022-23";
export const PercentageEleSchPTR = "Percentage-of-elementary-schools-having-PTR-less-than-equal-to-30"
export const Transition_Rate = "Transition Rate";
export const Teacher_and_School_Resources = "Teacher and School Resources";
export const School_Infrastructure = "School Infrastructure";
export const Student_Performance = "Teachers Trained For Teaching CWSN"
export const top50Data = "Top_50_Schools";
export const upcomingTop50Data = "Upcoming_50"


export const generateTextContent = (selectedState, selectedDistrict, selectedBlock) => {
    let textContent = `${selectedState}`;

    if (selectedDistrict === "Select District" && selectedState === "All State") {
        textContent = `${selectedState}`;
    } else if (selectedDistrict === "Select District" && selectedState !== "All State") {
        textContent = `State -(${selectedState})`;
    } if (selectedState !== "All State" && selectedDistrict === "All District"
    ) {
        textContent = `${selectedState}-${selectedDistrict}`;
    } else if (selectedState !== "All State" && selectedDistrict !== "Select District" && selectedDistrict !== "All District"
    ) {
        textContent = `District -${selectedDistrict}-(${selectedState})`;
    }

    if (selectedState !== "All State" && selectedDistrict !== "All District" && selectedBlock === "All Block"
    ) {
        textContent = `${selectedDistrict}-${selectedBlock}`;
    } else if (selectedState !== "All State" && selectedDistrict !== "All District" && selectedDistrict !== "Select District" && selectedBlock !== "Select Block" && selectedBlock !== "All Block"
    ) {
        textContent = `Block -${selectedBlock}-(${selectedDistrict} (${selectedState}))`;
    }
    return textContent;
};