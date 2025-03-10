import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider, CssBaseline } from "@mui/material"; // Import MUI ThemeProvider
import darkTheme from "./theme/Theme"; // Import the dark theme
import LoginPage from "./pages/LoginPage";
import EmployePage from "./pages/EmployePage";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import Layout from "./components/Layout";
import Department from "./pages/Department";
import ServicePage from "./pages/ServicePage";
import AbsencePage from "./pages/AbsencePage";
import DemandeCongePage from "./pages/DemandeCongePage";
import Dashboard from "./pages/Dashboard";
import AppareilPage from "./pages/AppareilPage";
import Planning from "./pages/Planning";
import TypeCongePage from "./pages/TypeCongePage";
import JourFeriePage from "./pages/JourFeriePage";
import FicheDePaie from "./pages/FicheDePaie";
import SalairesPage from "./pages/SalairesPage";

function Logout() {
  localStorage.clear();
  return <Navigate to="/login" />;
}

function RegisterAndLogout() {
  return <Register />;
}

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline /> {/* Applies global dark theme styles */}
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={< Dashboard/>} />
            <Route path="/planning" element={< Planning/>} />
            <Route path="/employe" element={< EmployePage/>} />
            <Route path="/departement" element={<Department />} />
            <Route path="/service" element={<ServicePage />} />
            <Route path="/planning" element={< Planning/>} />
            <Route path="/demande-conge" element={< DemandeCongePage/>} />
            <Route path="/appareil" element={< AppareilPage/>} />
            <Route path="/absence" element={< AbsencePage/>} />
            <Route path="/type-conge" element={< TypeCongePage/>} />
            <Route path="/jour-ferie" element={< JourFeriePage/>} />
            <Route path="/fiche-de-paie" element={<FicheDePaie />} />
            <Route path="/salaires" element={<SalairesPage />} />
          </Route>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/register" element={<RegisterAndLogout />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
