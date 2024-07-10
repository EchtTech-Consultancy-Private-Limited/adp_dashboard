import React from 'react'
import Header from '../Header/Header'

export default function BannerReport() {
  return (
    <section className='internal-banner-bg'>
      <div className="devider-image">
        <div className="container">
          <Header />
          <div className="content-box">
            <div className="row align-items-center">
              <div className="col-md-3">
                <div className='main-title'>Reports </div>
                <div className="brudcrumb-text">Home / <span>Report</span></div>
              </div>
              <div className="col-md-9">
                <div className="row select-infra Comparison-select-group">
                  <div className="col-md-4">
                    <div className="radio-button">
                      <div className="box-radio">
                        <input type="radio" name="radio" id="radio1" value="option1" checked/>
                        <label htmlFor="radio1">ADP Report</label>
                      </div>

                      <div className="box-radio">
                        <input type="radio" name="radio" id="radio2" value="option2" />
                        <label htmlFor="radio2">ABP Report</label>
                      </div>

                    </div>

                  </div>

                  <div className="col-md-8">
                    <div className="d-flex justify-content-between text-aligns-center">
                      <select className="form-select bg-grey2" defaultValue={""}>
                        <option value="">Select State </option>
                        <option value="">State</option>
                      </select>

                      <select className="form-select bg-grey2" defaultValue={""}>
                        <option value="">Select District </option>
                        <option value="">District </option>
                      </select>

                      <select className="form-select bg-grey2" defaultValue={""}>
                        <option value="">Select KPI </option>
                        <option value="">KPI</option>
                      </select>


                    </div>
                  </div>



                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section >
  )
}
