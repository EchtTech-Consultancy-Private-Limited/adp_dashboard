import './App.css';
import { HashRouter } from 'react-router-dom';
import { routes } from "./routes/index";
import './styles/global.scss'
function App() {
  return (
    <div className="App">
  <HashRouter>
      
      {routes}
    </HashRouter>
    </div>
  );
}

export default App;
