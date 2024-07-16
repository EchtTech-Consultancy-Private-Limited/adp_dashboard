import './App.css';
import { HashRouter } from 'react-router-dom';
import { routes } from "./routes/index";
import './styles/global.scss'
import Footer from './components/Footer/Footer';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
function App() {

  const toggleDarkMode = useSelector((state) => state.toggle.toggleDarkLight);

  useEffect(() => {
    if (toggleDarkMode) {
      localStorage.setItem("dark-mode", "true");
      document.getElementById("root").classList.add(toggleDarkMode ? "dark-mode" : "text");
    } else {
      localStorage.setItem("dark-mode", "false");

        document.getElementById("root").classList.remove("dark-mode");
    }
  }, [toggleDarkMode]);
  return (
    <div className="App">
   <HashRouter>
      
      {routes}
      <Footer/>
    </HashRouter>
    </div>
  );
}

export default App;
