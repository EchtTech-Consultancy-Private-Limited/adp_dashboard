import './App.css';
import { HashRouter } from 'react-router-dom';
import { routes } from "./routes/index";
import './styles/global.scss'
import Footer from './components/Footer/Footer';
import aspirationalAdpData2019 from "./aspirational-reports-data/aspirationalAdpData2019-20.json";
import aspirationalAdpData2020 from "./aspirational-reports-data/aspirationalAdpData2020-21.json";
import aspirationalAdpData2021 from "./aspirational-reports-data/aspirationalAdpData2021-22.json";
import aspirationalAdpData2022 from "./aspirational-reports-data/aspirationalAdpData2022-23.json";
import aspirationalAbpData2020 from "./aspirational-reports-data/aspirationalAbpData2020-21.json";
import aspirationalAbpData2021 from "./aspirational-reports-data/aspirationalAbpData2021-22.json";
import aspirationalAbpData2022 from "./aspirational-reports-data/aspirationalAbpData2022-23.json";
import aspirationalAbpData2019 from "./aspirational-reports-data/aspirationalAbpData2019-20.json";
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { setAllYearDataForGraph, setAspirationalAllData, setLoading, setselectedDataAllYear } from './redux/slice/reportTypeSlice';
import Header from './components/Header/Header';
import ErrorBoundary from './errorBoundry/ErrorBoundary';

function App() {
  const dispatch = useDispatch()
  const toggleDarkMode = useSelector((state) => state.toggle.toggleDarkLight);
  const selectedYear = useSelector((state) => state.reportAdpAbpType.selectedYear);
  const selectReportType = useSelector((state) => state.reportAdpAbpType.updateReportType);

  useEffect(() => {
    if (toggleDarkMode) {
      localStorage.setItem("dark-mode", "true");
      document.getElementById("root").classList.add(toggleDarkMode ? "dark-mode" : "text");
    } else {
      localStorage.setItem("dark-mode", "false");

      document.getElementById("root").classList.remove("dark-mode");
    }
  }, [toggleDarkMode]);
  {/*...............Take data report and Year wise For All Reports Start..............*/ }
  const combinedData = {
    "2019-20": {
      ADP_Report: aspirationalAdpData2019,
      ABP_Report: aspirationalAbpData2019,
    },
    "2020-21": {
      ADP_Report: aspirationalAdpData2020,
      ABP_Report: aspirationalAbpData2020,
    },
    "2021-22": {
      ADP_Report: aspirationalAdpData2021,
      ABP_Report: aspirationalAbpData2021,
    },
    "2022-23": {
      ADP_Report: aspirationalAdpData2022,
      ABP_Report: aspirationalAbpData2022,
    },
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        dispatch(setLoading(true));

        const selectedData = combinedData[selectedYear]?.[selectReportType];
        if (selectedData) {
          dispatch(setselectedDataAllYear(selectedData));
          dispatch(setAspirationalAllData(selectedData));
        }
        setTimeout(() => {
          dispatch(setLoading(false));
        }, 300);

      } catch (error) {
        console.error("Error loading selected data:", error);
        dispatch(setLoading(false));
      }
    };

    loadData();
  }, [selectReportType, selectedYear]);

  {/* Take all Year Data for show in Graph */ }
  useEffect(() => {
    const loadAllYearsData = async () => {
      try {
        const years = ["2019-20", "2020-21", "2021-22", "2022-23"];
        let allYearsData = [];

        years.forEach(year => {
          const selectedData = combinedData[year]?.[selectReportType];
          if (selectedData) {
            allYearsData.push({ year, data: selectedData });
          }
        });

        if (allYearsData.length > 0) {
          dispatch(setAllYearDataForGraph(allYearsData));
        }
      } catch (error) {
        console.error("Error loading all years data for graph:", error);
      }
    };

    loadAllYearsData();
  }, [selectReportType, selectedYear]);



  {/*...............Take data report and Year wise For All Reports End..............*/ }

  return (
    <div className="App">
      <HashRouter>
      <ErrorBoundary>
        <Header />
        {routes}
        <Footer />
        </ErrorBoundary>
      </HashRouter>
    </div>
  );
}

export default App;
