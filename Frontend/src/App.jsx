import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider, CssBaseline } from "@mui/material"; // Import MUI ThemeProvider
import darkTheme from "./theme/Theme"; // Import the dark theme
import Login from "./pages/Login";
import EmployePage from "./pages/EmployePage";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import Layout from "./components/Layout";
import Department from "./pages/Department";
import Service from "./pages/Service";
import Dashboard from "./pages/Dashboard";

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
            <Route path="/employe" element={< EmployePage/>} />
            <Route path="/departement" element={<Department />} />
            <Route path="/service" element={<Service />} />
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/register" element={<RegisterAndLogout />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
