import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./Context/AuthContext";
import Signup from "./Components/Signup";
import Home from "./Components/Home";
import Signin from "./Components/Signin"
import Unisignup from "./Components/Unisignup";
import Unipage from "./Components/Unipage";
import HighschoolSignup from "./Components/highschoolSignup";
import HodSignup from "./Components/Hodsignup";
import Studentportal from "./Components/Studentportal";
import ProtectedRoute from "./Components/ProtectedRoutes";
import Vacancy from "./Components/Vacancy";
import HighschoolSignin from "./Components/HighschoolSignin";
import HighschoolDash from "./Components/HighschoolDash";
import LoginChoice from "./Components/LoginChoice";
import VacancyDetail from "./Components/VacancyDetail";
import UniSignin from "./Components/UniSignin";
import SchemesofWork from "./Components/SchemesofWork";
import LessonPlan from "./Components/LessonPlan";
import RecordOfWork from "./Components/RecordOfWork";
import Submissions from "./Components/Submissions";
import LessonObservationReport from "./Components/LessonObservationReport";
import UniversityPortal from "./Components/UniversityPortal";
import HodPortal from "./Components/HodPortal";
import SupervisorPortal from "./Components/SupervisorPortal";
const App = () => {

  const isAuthenticated = () => {
    return !!localStorage.getItem('token');
  };
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/unipage" element={<Unipage />} />
          <Route path="/studentportal" element={<Studentportal />} />
          <Route path="/loginchoice" element={<LoginChoice />} />
          <Route path="/unisignup" element={<Unisignup />} />
          <Route path="/unisignin" element={<UniSignin />} />
          <Route path="/universityportal" element={<UniversityPortal />} />
          <Route path="/hodportal" element={<HodPortal />} />
          <Route path="/supervisorportal" element={<SupervisorPortal />} />
          <Route path="/hodsignup" element={<HodSignup />} />
          <Route path="/schemesofwork" element={<SchemesofWork />} />
          <Route path="/lessonplan" element={<LessonPlan />} />
          <Route path="/recordofwork" element={<RecordOfWork />} />
          <Route path="/submissions" element={<Submissions />} />
          <Route path="/lessonobservationreport" element={<LessonObservationReport />} />
          <Route path="/vacancy/:vancancy_id" element={<VacancyDetail />} />
           {/* <Route path="/studentportal/vacancy/:vancancy_id" element={<VacancyDetail />} /> */}
          <Route path="/highschoolsignup" element={<HighschoolSignup />} />
          <Route path="/highschoolsignin" element={<HighschoolSignin />} />
          <Route path="/highschooldash" element={ <ProtectedRoute isAllowed={isAuthenticated()}>
              <HighschoolDash />
            </ProtectedRoute>}/>
          <Route path="/signin" element={<Signin />} />
          <Route path="/vacancy" element={<ProtectedRoute> <Vacancy /></ProtectedRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
