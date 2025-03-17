import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { ThemeProvider, CssBaseline } from "@mui/material";
import darkTheme from "./theme/Theme";
import { useState, useEffect } from "react";
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";
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
import Loading from "./components/Loading";

function App() {
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleStart = () => setLoading(true);
    const handleComplete = () => setLoading(false);

    handleStart(); // Show loading on route change start
    handleComplete(); // Hide loading on route change complete
  }, [location]);

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      {loading && <Loading />}
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/planning" element={<Planning />} />
            <Route path="/employe" element={<EmployePage />} />
            <Route path="/departement" element={<Department />} />
            <Route path="/service" element={<ServicePage />} />
            <Route path="/demande-conge" element={<DemandeCongePage />} />
            <Route path="/appareil" element={<AppareilPage />} />
            <Route path="/absence" element={<AbsencePage />} />
            <Route path="/type-conge" element={<TypeCongePage />} />
            <Route path="/jour-ferie" element={<JourFeriePage />} />
            <Route path="/fiche-de-paie" element={<FicheDePaie />} />
          </Route>
        </Route>

        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </ThemeProvider>
  );
}

function AppWrapper() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}

export default AppWrapper;
