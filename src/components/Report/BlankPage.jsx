import React from 'react'
import blank from '../../assets/images/no_found.svg'

export default function BlankPage() {
    return (
        <div className="card-box">
            <div className="row">
               <div className="col-md-12">
                   <div className="blank-card text-center pt-5 pb-5">
                       <img src={blank} alt="blank" />
                       <h6 className='mt-3 mb-1'>No Data Found</h6>
                       <p className='mb-0'>Please Select all Dropdowns Above to View the Report</p>
                   </div>
               </div>
            </div>           
        </div>
    )
}
