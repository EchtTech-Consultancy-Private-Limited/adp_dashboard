import React from "react";
import '../components/Home/home.scss';
import Header from "../components/Header/Header";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setselectedReport, setUpdateReportType } from "../redux/slice/reportTypeSlice";

export default function Home() {
  const dispatch = useDispatch();
  
  const handleClick = (reportType) => {
    dispatch(setUpdateReportType(reportType));
    dispatch(setselectedReport("Transition Rate"));
  };

  const selectReportType = useSelector((state) => state.reportAdpAbpType.updateReportType);

  return (
    <section className="bg-home">
      <div className="container">
        <Header />
        <div className="row mt-5">
          <div className="col-md-12">
            <h5></h5>
            <span onClick={() => handleClick("ABP_Report")}>
              <NavLink to="/transition-rate">ABP</NavLink>
            </span>
            <br />
            <span onClick={() => handleClick("ADP_Report")}>
              <NavLink to="/transition-rate">ADP</NavLink>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
