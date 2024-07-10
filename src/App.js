import './App.css';
import { HashRouter } from 'react-router-dom';
import { routes } from "./routes/index";
import './styles/global.scss'
import Footer from './components/Footer/Footer';
function App() {
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
