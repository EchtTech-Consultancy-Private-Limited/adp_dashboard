import React from 'react'
import blank from '../../assets/images/no_found.svg'
import { useTranslation } from "react-i18next";

export default function BlankPage() {
    const { t } = useTranslation();
    return (
        <div className="card-box">
            <div className="row">
               <div className="col-md-12">
                   <div className="blank-card text-center pt-5 pb-5">
                       <img src={blank} alt="blank" className='blank-img'/>
                       <h6 className='mt-3 mb-1'>{t('noDataFound')}</h6>
                       <p className='mb-0'>{t('pleaseSelectAllDropdowns')}</p>
                   </div>
               </div>
            </div>           
        </div>
    )
}
