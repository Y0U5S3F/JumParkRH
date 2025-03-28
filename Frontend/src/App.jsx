import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { ThemeProvider as MuiThemeProvider, CssBaseline } from "@mui/material";
import { whiteTheme, darkTheme } from "./theme/Theme";
import { useState, useEffect, useTransition, Suspense, lazy, createContext, useContext } from "react";
import Loading from "./components/Loading";

// Create Theme Context
export const ThemeContext = createContext({
  isDarkMode: false,
  toggleTheme: () => {},
});

// Theme Context Hook
export const useThemeToggle = () => {
  return useContext(ThemeContext);
};

// Lazy load components
const LoginPage = lazy(() => import("./pages/LoginPage"));
const ProtectedRoute = lazy(() => import("./components/ProtectedRoute"));
const EmployePage = lazy(() => import("./pages/EmployePage"));
const Register = lazy(() => import("./pages/Register"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Layout = lazy(() => import("./components/Layout"));
const Department = lazy(() => import("./pages/Department"));
const ServicePage = lazy(() => import("./pages/ServicePage"));
const AbsencePage = lazy(() => import("./pages/AbsencePage"));
const DemandeCongePage = lazy(() => import("./pages/DemandeCongePage"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const AppareilPage = lazy(() => import("./pages/AppareilPage"));
const Planning = lazy(() => import("./pages/Planning"));
const TypeCongePage = lazy(() => import("./pages/TypeCongePage"));
const JourFeriePage = lazy(() => import("./pages/JourFeriePage"));
const FicheDePaie = lazy(() => import("./pages/FicheDePaie"));

function App() {
  // Loading state for route changes
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const [isPending, startTransition] = useTransition();
  
  // Theme state
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Use localStorage to persist theme preference
    const savedTheme = localStorage.getItem('darkMode');
    return savedTheme ? JSON.parse(savedTheme) : false;
  });

  // Toggle theme function
  const toggleTheme = () => {
    setIsDarkMode(prevMode => {
      const newMode = !prevMode;
      localStorage.setItem('darkMode', JSON.stringify(newMode));
      return newMode;
    });
  };

  // Handle route change loading state
  useEffect(() => {
    const handleStart = () => setLoading(true);
    const handleComplete = () => setLoading(false);

    handleStart();

    startTransition(() => {
      handleComplete();
    });
  }, [location]);

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      <MuiThemeProvider theme={isDarkMode ? darkTheme : whiteTheme}>
        <CssBaseline />
        {loading && <Loading />}
        <Suspense fallback={<Loading />}>
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
        </Suspense>
      </MuiThemeProvider>
    </ThemeContext.Provider>
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