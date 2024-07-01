import { Routes, Route, Navigate } from 'react-router-dom';
import Home from '../pages/Home';
import AspirationalReport4001 from '../components/Report/AspirationalReport4001';
import AspirationalReport4002 from '../components/Report/AspirationalReport4002';
import AspirationalReport4003 from '../components/Report/AspirationalReport4003';
import AspirationalReport4004 from '../components/Report/AspirationalReport4004';

export const routes = (
   
    <Routes>

        <Route exact path="/" element={<Home />} />
        {/* <Route exact path="/aspirational-reports-4001" element={<AspirationalReport4001/>} />
        <Route exact path="/aspirational-reports-4002" element={<AspirationalReport4002/>} />
        <Route exact path="/aspirational-reports-4003" element={<AspirationalReport4003 />} />
        <Route exact path="/aspirational-reports-4004" element={<AspirationalReport4004 />} /> */}
        <Route path="/*" element={<Navigate to="/" />} />
    </Routes>
)  