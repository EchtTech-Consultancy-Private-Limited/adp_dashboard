import { Routes, Route, Navigate } from 'react-router-dom';
import Home from '../pages/Home';
import TransitionRateReport from '../components/Report/TransitionRateReport';
import TeacherAndSchResourcesReport from '../components/Report/TeacherAndSchResourcesReport';

import SchoolInfraStructureReport from '../components/Report/SchoolInfraStructureReport';
import EnrollmentAndRetentionReport from '../components/Report/EnrollmentAndRetentionReport';
import ScreenReader from '../pages/ScreenReader';
import TeacherTrainedCwsnReport from '../components/Report/TeacherTrainedCwsnReport';

export const routes = (
   
    <Routes>

        <Route exact path="/" element={<Home />} />
        <Route exact path="/transition-rate" element={<TransitionRateReport/>} />
        <Route exact path="/teacher-and-school-resources" element={<TeacherAndSchResourcesReport/>} />
        <Route exact path="/teachers-trained-for-teaching-CWSN" element={<TeacherTrainedCwsnReport />} />
        <Route exact path="/school-infrastructure" element={<SchoolInfraStructureReport />} />
        <Route exact path="/enrollment-retention" element={<EnrollmentAndRetentionReport />} />
        <Route exact path="/screen-reader-access" element={<ScreenReader/>} />

        <Route path="/*" element={<Navigate to="/" />} />
        {/* <Route path="/report" element={<TransitionRateReport/>} /> */}
    </Routes>
)  