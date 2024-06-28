import logo from './logo.svg';
import './App.css';
import { HashRouter } from 'react-router-dom';
import Header from './components/Header/Header';
import { routes } from "./routes/index";
function App() {
  return (
    <div className="App">
  <HashRouter>
      <Header/>
      {routes}
    </HashRouter>
    </div>
  );
}

export default App;
