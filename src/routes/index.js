import { Routes, Route, Navigate } from 'react-router-dom';
import Home from '../pages/Home';
import TransitionRateReport from '../components/Report/TransitionRateReport';

export const routes = (
   
    <Routes>

        <Route exact path="/" element={<Home />} />
        {/* <Route exact path="/aspirational-reports-4001" element={<AspirationalReport4001/>} />
        <Route exact path="/aspirational-reports-4002" element={<AspirationalReport4002/>} />
        <Route exact path="/aspirational-reports-4003" element={<AspirationalReport4003 />} />
        <Route exact path="/aspirational-reports-4004" element={<AspirationalReport4004 />} /> */}
        <Route path="/*" element={<Navigate to="/" />} />
        <Route path="/report" element={<TransitionRateReport/>} />
    </Routes>
)  