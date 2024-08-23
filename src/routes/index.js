import { Routes, Route, Navigate } from 'react-router-dom';
import Home from '../pages/Home';
import TransitionRateReport from '../components/Report/TransitionRateReport';
import TeacherAndSchResourcesReport from '../components/Report/TeacherAndSchResourcesReport';
import StudentsPerformanceReport from '../components/Report/StudentsPerformanceReport';
import SchoolInfraStructureReport from '../components/Report/SchoolInfraStructureReport';
import EnrollmentAndRetentionReport from '../components/Report/EnrollmentAndRetentionReport';
import ScreenReader from '../pages/ScreenReader';

export const routes = (
   
    <Routes>

        <Route exact path="/" element={<Home />} />
        <Route exact path="/transition-rate" element={<TransitionRateReport/>} />
        <Route exact path="/Percentage-of-elementary-schools-having-PTR-less-than-equal-to-30" element={<TeacherAndSchResourcesReport/>} />
        <Route exact path="/Percentage-Schools-with-Teachers-trained-for-teaching-CWSN" element={<StudentsPerformanceReport />} />
        <Route exact path="/Percentange-of-Schools-having-adequate-Functional-Girls-Toilets" element={<SchoolInfraStructureReport />} />
        <Route exact path="/enrollment-retention" element={<EnrollmentAndRetentionReport />} />
        <Route exact path="/screen-reader-access" element={<ScreenReader/>} />

        <Route path="/*" element={<Navigate to="/" />} />
        {/* <Route path="/report" element={<TransitionRateReport/>} /> */}
    </Routes>
)  