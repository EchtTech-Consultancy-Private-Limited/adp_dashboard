import React, { useState } from 'react'
import BannerReportFilter from './BannerReportFilter'
import download from '../../assets/images/download.svg'
import table from '../../assets/images/table.svg' 
import chart from '../../assets/images/bar-chart.svg'
import './report.scss'
import { AgGridReact } from "ag-grid-react";
import "ag-grid-enterprise";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-material.css";
import BlankPage from './BlankPage'

export default function TransitionRateReport() {

    const [rowData, setRowData] = useState([
        { Districts: 'Agra', Boys: '56.80%', Girls: "24.20%", Total: "89%" },
        { Districts: 'Aligarh', Boys: '24.20%', Girls: "56.58%", Total: "76%" },
        { Districts: 'Allahabad', Boys: '30%', Girls: "40%", Total: "70%" },       
    ]);

    // Column Definitions: Defines & controls grid columns.
    const [colDefs, setColDefs] = useState([
        { field: 'Districts' },
        { field: 'Boys' },
        { field: 'Girls' },
        { field: 'Total' },
    ]);

    const defaultColDef = {
        flex: 1,
    };


    return (
        <section>
            <BannerReportFilter />
            <div className="container">
                <div className="row mt-5">
                    <div className="col-md-12">
                        <BlankPage/>
                    </div>
                    <div className="col-md-12">
                        <div className="card-box">
                            <div className="row align-items-end">
                                <div className="col-md-5">
                                    <div className="d-flex align-items-end">
                                        <div className="title-box">
                                            <h5 className='sub-title'>Uttar Pradesh District's</h5>
                                            <h3 className='heading-sm'>Transition Rate</h3>
                                        </div>
                                        <div className="tab-box">
                                            <button className='tab-button active'><img src={table} alt="Table" /> Table View</button>
                                            <button className='tab-button'><img src={chart} alt="chart" /> Chart View</button>                                           
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-7">
                                    <div className="d-flex w-100">
                                        <div className="radio-button">
                                            <div className="box-radio">
                                                <input type="radio" name="view" id="radio4" value="" checked />
                                                <label htmlFor="radio4">Upper Primary to Secondary  </label>
                                            </div>

                                            <div className="box-radio">
                                                <input type="radio" name="view" id="radio5" value="" />
                                                <label htmlFor="radio5">Secondary to Higher Secondary</label>
                                            </div>
                                        </div>
                                        <div className="">
                                            {/* <img src={download} alt="download" /> */}
                                            <select id="export_data" className="form-select download-button" defaultValue={""}>
                                                <option className="option-hide"> Download Report 2023-24 </option>
                                                <option value="export_pdf">Download as PDF </option>
                                                <option value="export_excel">Download as Excel</option>
                                            </select>
                                        </div>
                                    </div>

                                </div>
                            </div>

                            <div className="row">   
                                <div className="col-md-12">
                                    <div className="table-box mt-4">
                                        <div className="multi-header-table ag-theme-material ag-theme-custom-height ag-theme-quartz h-300"
                                            style={{ width: "100%", height:200 }} >
                                            <AgGridReact rowData={rowData} columnDefs={colDefs} defaultColDef={defaultColDef} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
