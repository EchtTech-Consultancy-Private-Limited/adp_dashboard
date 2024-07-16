import { useEffect } from 'react'
import AboutUs from '../components/Home/AboutUs'
import Banners from '../components/Home/Banners'
import '../components/Home/home.scss'
import Themes from '../components/Home/Themes'
import AOS from "aos";
import "aos/dist/aos.css";

export default function Home() {

    useEffect(() => {
        AOS.init({
          disable: "phone",
          duration: 1000,
          easing: "ease-out-cubic",
        });
      }, []);

    return (    

    <>
     <Banners/>
     <AboutUs/>
     <Themes/>
    </>

    )
}


  
//   const handleClick = (reportType) => {
//     dispatch(setUpdateReportType(reportType));
//     dispatch(setselectedReport("Transition Rate"));
//   };

//   const selectReportType = useSelector((state) => state.reportAdpAbpType.updateReportType);

{/* <span onClick={() => handleClick("ABP_Report")}>
              <NavLink to="/transition-rate">ABP</NavLink>
           </span> */}

