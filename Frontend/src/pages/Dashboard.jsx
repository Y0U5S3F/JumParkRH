import { useEffect, useState } from "react";
import dayjs from "dayjs";
// Change this line at the top of your file
import ChatBot from "../components/ChatBot";
import { ThemeToggle } from "../components/ThemeToggle"; // Import as named export
import {
  Container,
  Box,
  Grid,
  Card,
  Typography,
  Paper,
  CardContent,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import BusinessIcon from "@mui/icons-material/Business";
import EventNoteIcon from "@mui/icons-material/EventNote";
import CelebrationIcon from "@mui/icons-material/Celebration";
import { PieChart } from "@mui/x-charts/PieChart";
import { BarChart } from "@mui/x-charts/BarChart";
import DashboardIcon from "@mui/icons-material/Dashboard";
import { DataGrid, useGridApiRef } from "@mui/x-data-grid";
import { fetchDashboardData } from "../service/DashboardService"; // Import the fetchDashboardData function

const absenceData = [
  { name: "John Doe", absences: 15 },
  { name: "Jane Smith", absences: 12 },
  { name: "Alice Brown", absences: 10 },
  { name: "Bob Johnson", absences: 8 },
  { name: "Charlie White", absences: 7 },
];

// Reusable Summary Card Component
const SummaryCard = ({ title, value, subValue, icon, loading }) => {
  return (
    <Card
      sx={{
        color: (theme) => theme.palette.text.primary,
        boxShadow: 1,
        borderRadius: 2,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        height: "80%", // Ensures all cards are the same height
        padding: "8px",
      }}
    >
      <CardContent
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1,
          }}
        >
          <Typography
            variant="body1"
            fontWeight="semi-bold"
            sx={{
              fontSize: "1rem",
              color: (theme) => theme.palette.primary.main,
              lineHeight: 1.2,
            }}
          >
            {title}
          </Typography>
          {loading ? (
            <CircularProgress color="primary" />
          ) : (
            <Box sx={{ display: "flex", alignItems: "baseline", gap: 0.5 }}>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: "bold",
                }}
              >
                {value}
              </Typography>
              {subValue && (
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: "0.7rem",
                    color: (theme) => theme.palette.text.tertiary, // Set color to primary main
                  }}
                >
                  {subValue}
                </Typography>
              )}
            </Box>
          )}
        </Box>

        {/* Icon Box */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {icon}
        </Box>
      </CardContent>
    </Card>
  );
};

const PieChartCard = ({ data, loading }) => {
  return (
    <Card
      sx={{
        color: (theme) => theme.palette.text.primary,
        boxShadow: 1,
        borderRadius: 2,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        height: "90%", // Set a fixed height
        
        padding: "8px",
      }}
    >
      <CardContent sx={{ textAlign: "center" }}>
        <Typography
          fontWeight="semi-bold"
          variant="body1"
          sx={{
            fontSize: "1rem",
            color: (theme) => theme.palette.primary.main,
            lineHeight: 1.2,
            mb: "10px", // Reduces line spacing
          }}
        >
          Répartition des employés par département
        </Typography>
        {loading ? (
          <CircularProgress color="primary" />
        ) : (
          <PieChart
            series={[
              {
                data: data.map((item, index) => ({
                  id: index,
                  value: item.total,
                  label: item.departement__nom,
                  color: [
                    "rgba(252, 184, 89, 0.8)", // Warm Yellow with 20% opacity
                    "rgba(169, 223, 216, 0.8)", // Soft Teal with 20% opacity
                    "rgba(40, 174, 243, 0.8)", // Bright Blue with 20% opacity
                    "rgba(242, 200, 237, 0.8)", // Pastel Pink with 20% opacity
                    "rgba(242, 109, 91, 0.8)", // Deep Coral with 20% opacity
                    "rgba(199, 162, 255, 0.8)", // Muted Lavender with 20% opacity
                  ][index % 6], // Cycle through colors
                })),
              },
            ]}
            width={360}
            height={200}
          />
        )}
      </CardContent>
    </Card>
  );
};

const BarChartCard = ({ data, loading }) => {
  return (
    <Card
      sx={{
        color: (theme) => theme.palette.text.primary,
        boxShadow: 1,
        borderRadius: 2,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "90%", // Set a fixed height
      }}
    >
      <CardContent sx={{ textAlign: "center" }}>
        <Typography
          fontWeight="semi-bold"
          variant="body1"
          sx={{
            fontSize: "1rem",
            color: (theme) => theme.palette.primary.main,
            lineHeight: 1.2,
            mb: "10px", // Reduces line spacing
          }}
        >
          Absences des 5 derniers mois
        </Typography>
        {loading ? (
          <CircularProgress color="primary" />
        ) : (
          <BarChart
            dataset={data}
            xAxis={[{ scaleType: "band", dataKey: "name" }]}
            series={[
              { dataKey: "absences", label: "Absences", color: "#FCB859" },
            ]}
            height={200}
            width={300}
          />
        )}
      </CardContent>
    </Card>
  );
};

const BirthdaysCard = ({ data, loading }) => {
  return (
    <Card
      sx={{
        color: (theme) => theme.palette.text.primary,
        boxShadow: 1,
        borderRadius: 2,
        display: "flex",
        flexDirection: "column",
        height: "90%", // Set a fixed height
        overflow: "hidden", // Hide overflow
      }}
    >
      <CardContent
        sx={{
          textAlign: "center",
          overflowY: "auto", // Enable vertical scrolling
          "&::-webkit-scrollbar": {
            display: "none", // Hide scrollbar
          },
        }}
      >
        <Typography
          fontWeight="semi-bold"
          variant="body1"
          sx={{
            fontSize: "1rem",
            color: (theme) => theme.palette.primary.main,
            lineHeight: 1.2,
            mb: "10px", // Reduces line spacing
          }}
        >
          Anniversaires ce mois-ci
        </Typography>
        {loading ? (
          <CircularProgress color="primary" />
        ) : data.length > 0 ? (
          data.map((birthday, index) => (
            <Box key={index} sx={{ mb: 1 }}>
              <Typography variant="h6" fontWeight="bold">
                {`${birthday.prenom} ${birthday.nom}`}
              </Typography>
              <Typography variant="body1" sx={{ color: "gray" }}>
                {dayjs(birthday.date_de_naissance).format("D MMM")}
              </Typography>
            </Box>
          ))
        ) : (
          <Typography sx={{ fontSize: "0.9rem", color: (theme) => theme.palette.text.tertiary, }}>
            Aucun anniversaire ce mois-ci
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState({});
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: "",
    message: "",
  });
  const apiRef = useGridApiRef();
  const [pageTitle, setPageTitle] = useState("Tableau de bord");

  useEffect(() => {
    document.title = pageTitle; // Update the document title
  }, [pageTitle]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await fetchDashboardData();
        // Add unique id to each employee on leave
        const employesOnLeave = data.employes_on_leave.map(
          (employee, index) => ({
            ...employee,
            id: index,
          })
        );
        setDashboardData({ ...data, employes_on_leave: employesOnLeave });
        console.log("Dashboard Data:", data);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des données du tableau de bord:",
          error
        );
        setSnackbar({
          open: true,
          severity: "error",
          message:
            "Erreur lors de la récupération des données du tableau de bord.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const columns = [
    { field: "nom", headerName: "Nom", flex: 1 },
    { field: "departement", headerName: "Département", flex: 1 },
    { field: "return_date", headerName: "Date de retour", flex: 1 },
    { field: "type", headerName: "Type", flex: 1 },
  ];

  return (
    <Container
      sx={{
        padding: "20px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "10px",
          padding: "5px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            fontWeight: "bold",
          }}
        >
          <DashboardIcon />
          <Typography variant="h6" fontWeight="bold">
            Fiche de Paie
          </Typography>
        </Box>
        <Box sx={{display:"flex",flexDirection:"row",alignItems:"center",gap:"10px"}}>
        {/* <Typography
          variant="h6"
          fontWeight="semi-bold"
          sx={{
            color: (theme) => theme.palette.text.secondary,
            fontSize: "1rem",
          }}
        >
          {dayjs().format("dddd, D MMMM YYYY")}
        </Typography> */}
        <ThemeToggle  />
        </Box>
        

      </Box>
      <Box className="mainContent">
      <Grid container spacing={3}>
  <Grid item xs={12} sm={6} md={3}>
    <SummaryCard
      title="Total employés"
      value={dashboardData.statistiques?.totalemployes || "Chargement..."}
      subValue="employés"
      icon={
        <PeopleIcon
          sx={{
            color: (theme) => theme.palette.primary.main,
            fontSize: 32,
          }}
        />
      }
      loading={loading}
    />
  </Grid>
  <Grid item xs={12} sm={6} md={3}>
    <SummaryCard
      title="Total départements"
      value={dashboardData.statistiques?.totaldepartements || "Chargement..."}
      subValue="départements"
      icon={
        <BusinessIcon
          sx={{
            color: (theme) => theme.palette.primary.main,
            fontSize: 32,
          }}
        />
      }
      loading={loading}
    />
  </Grid>
  <Grid item xs={12} sm={6} md={3}>
    <SummaryCard
      title="Congés en attente"
      value={
        dashboardData.statistiques?.pendingvacation !== undefined
          ? dashboardData.statistiques.pendingvacation
          : loading
          ? "Chargement..."
          : "0"
      }
      subValue="demandes"
      icon={
        <EventNoteIcon
          sx={{
            color: (theme) => theme.palette.primary.main,
            fontSize: 32,
          }}
        />
      }
      loading={loading}
    />
  </Grid>
  <Grid item xs={12} sm={6} md={3}>
    <SummaryCard
      title="Prochain jour férié"
      value={
        dashboardData.statistiques?.nextpublicholiday &&
        dashboardData.statistiques.nextpublicholiday !== "No upcoming holidays"
          ? dayjs(dashboardData.statistiques.nextpublicholiday).format("D MMM")
          : loading
          ? "Chargement..."
          : "Aucun"
      }
      icon={
        <CelebrationIcon
          sx={{
            color: (theme) => theme.palette.primary.main,
            fontSize: 32,
          }}
        />
      }
      loading={loading}
    />
  </Grid>
</Grid>
<Grid container spacing={3} >
  <Grid item xs={12} md={6} lg={5}>
    <PieChartCard data={dashboardData.employedistribution || []} loading={loading} />
  </Grid>
  <Grid item xs={12} md={6} lg={4}>
  <BarChartCard
    data={
      (dashboardData.absences_last_5_months || []).map((item) => ({
        name: dayjs(item.month).format("MMMM"), // Convert month number to name
        absences: item.total,
      }))
    }
    loading={loading}
  />
</Grid>
  <Grid item xs={12} lg={3}>
    <BirthdaysCard data={dashboardData.birthdays_this_month || []} loading={loading} />
  </Grid>
</Grid>
<Grid item xs={12} >
  <Typography
    fontWeight="semi-bold"
    variant="body1"
    sx={{
      fontSize: "1rem",
      color: (theme) => theme.palette.primary.main,
      lineHeight: 1.2,
      mb: "10px",
    }}
  >
    Employés en congé aujourd'hui
  </Typography>
  <Paper>
    <div style={{ height: "100%", width: "100%" }}>
      <DataGrid
        apiRef={apiRef}
        rows={dashboardData.employes_on_leave || []}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        autoHeight
        disableColumnMenu
        disableColumnSelector
        disableSelectionOnClick
        disableMultipleColumnsSorting
        loading={loading}
      />
    </div>
  </Paper>
</Grid>

      </Box>
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
            
      
    </Container>
  );
}