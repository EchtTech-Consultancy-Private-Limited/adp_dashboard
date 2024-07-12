import AboutUs from '../components/Home/AboutUs'
import Banners from '../components/Home/Banners'
import '../components/Home/home.scss'
import Themes from '../components/Home/Themes'


export default function Home() {


    return (    

    <>
     <Banners/>
     <AboutUs/>
     <Themes/>
    </>

    )
}


// import AboutUs from '../components/Home/AboutUs'
// import Banners from '../components/Home/Banners'
// import '../components/Home/home.scss'
// import Themes from '../components/Home/Themes'


// export default function Home() {
//   const dispatch = useDispatch();
  
//   const handleClick = (reportType) => {
//     dispatch(setUpdateReportType(reportType));
//     dispatch(setselectedReport("Transition Rate"));
//   };

//   const selectReportType = useSelector((state) => state.reportAdpAbpType.updateReportType);

// <<<<<<< HEAD
//   return (
//     <section className="bg-home">
//       <div className="container">
//         <Header />
//         <div className="row mt-5">
//           <div className="col-md-12">
//             <h5></h5>
//             <span onClick={() => handleClick("ABP_Report")}>
//               <NavLink to="/transition-rate">ABP</NavLink>
//             </span>
//             <br />
//             <span onClick={() => handleClick("ADP_Report")}>
//               <NavLink to="/transition-rate">ADP</NavLink>
//             </span>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }
// =======
//     return (    

//     <>
//      <Banners/>
//      <AboutUs/>
//      <Themes/>
//     </>

//     )
// }
// >>>>>>> c97cd52e902c8886fd6d46c506961a0c597935b0

