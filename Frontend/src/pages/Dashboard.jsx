import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Box,
  Grid,
  Card,
  Typography,
  CardContent,
  Snackbar,
  Alert,
} from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import BusinessIcon from "@mui/icons-material/Business";
import EventNoteIcon from "@mui/icons-material/EventNote";
import CelebrationIcon from "@mui/icons-material/Celebration";
import { PieChart } from "@mui/x-charts/PieChart";
import { BarChart } from "@mui/x-charts/BarChart";
import {
  DataGrid,
  useGridApiRef,
  DEFAULT_GRID_AUTOSIZE_OPTIONS,
} from "@mui/x-data-grid";
import { fetchDashboardData } from "../service/DashboardService"; // Import the fetchDashboardData function

const absenceData = [
  { name: "John Doe", absences: 15 },
  { name: "Jane Smith", absences: 12 },
  { name: "Alice Brown", absences: 10 },
  { name: "Bob Johnson", absences: 8 },
  { name: "Charlie White", absences: 7 },
];

// Reusable Summary Card Component
const SummaryCard = ({ title, value, icon }) => {
  return (
    <Card
      sx={{
        color: "white",
        boxShadow: 3,
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
              fontSize: "0.9rem",
              color: "gray",
              lineHeight: 1.2,
            }}
          >
            {title}
          </Typography>
          <Typography
            variant="h5"
            sx={{
              fontWeight: "bold",
            }}
          >
            {value}
          </Typography>
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


const PieChartCard = ({ data }) => {
  return (
    <Card
      sx={{
        color: "white",
        boxShadow: 3,
        borderRadius: 2,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "80%", // Ensures all cards are the same height
        padding: "16px",
      }}
    >
      <CardContent sx={{ textAlign: "center" }}>
        <Typography
          sx={{
            fontSize: "0.9rem",
            color: "gray",
            lineHeight: 1.2, // Reduces line spacing
          }}
        >
          Employee Distribution by Department
        </Typography>
        <PieChart
          series={[
            {
              data: data.map((item, index) => ({
                id: index,
                value: item.total,
                label: item.departementnom,
              })),
            },
          ]}
          width={400}
          height={200}
        />
      </CardContent>
    </Card>
  );
};

const BarChartCard = ({ data }) => {
  return (
    <Card
      sx={{
        color: "white",
        boxShadow: 3,
        borderRadius: 2,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "80%", // Ensures all cards are the same height
        padding: "16px",
      }}
    >
      <CardContent sx={{ textAlign: "center" }}>
        <Typography
          sx={{
            fontSize: "0.9rem",
            color: "gray",
            lineHeight: 1.2, // Reduces line spacing
          }}
        >
          Most Absent Employees
        </Typography>
        <BarChart
          dataset={data}
          xAxis={[{ scaleType: "band", dataKey: "name" }]}
          series={[
            { dataKey: "absences", label: "Absences", color: "#FF6B6B" },
          ]}
          height={200}
          width={400}
        />
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

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await fetchDashboardData();
        // Add unique id to each employee on leave
        const employesOnLeave = data.employes_on_leave.map((employee, index) => ({
          ...employee,
          id: index,
        }));
        setDashboardData({ ...data, employes_on_leave: employesOnLeave });
        console.log("Dashboard Data:", data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setSnackbar({
          open: true,
          severity: "error",
          message: "Error fetching dashboard data.",
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
    { field: "nom", headerName: "Name", flex: 1 },
    { field: "departement", headerName: "Department", flex: 1 },
    { field: "return_date", headerName: "Return Date", flex: 1 },
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
      <h1>Dashboard</h1>
      <Box className="mainContent">
        <Grid container spacing={3}>
          <Grid item xs={3}>
            <SummaryCard
              title="Total Employees"
              value={dashboardData.statistiques?.totalemployes || "Loading..."}
              icon={<PeopleIcon sx={{ color: (theme) => theme.palette.primary.main, fontSize:32 }} />}
            />
          </Grid>
          <Grid item xs={3}>
            <SummaryCard
              title="Total Departments"
              value={dashboardData.statistiques?.totaldepartements || "Loading..."}
              icon={<BusinessIcon sx={{ color: (theme) => theme.palette.primary.main, fontSize:32 }} />}
            />
          </Grid>
          <Grid item xs={3}>
            <SummaryCard
              title="Pending Vacation "
              value={dashboardData.statistiques?.pendingvacation || "Loading..."}
              icon={<EventNoteIcon sx={{ color: (theme) => theme.palette.primary.main, fontSize:32 }} />}
            />
          </Grid>
          <Grid item xs={3}>
            <SummaryCard
              title="Next Public Holiday"
              value={dashboardData.statistiques?.nextpublicholiday || "Loading..."}
              icon={<CelebrationIcon sx={{ color: (theme) => theme.palette.primary.main, fontSize:32 }} />}
            />
          </Grid>
        </Grid>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <PieChartCard data={dashboardData.employedistribution || []} />
          </Grid>
          <Grid item xs={6}>
            <BarChartCard data={absenceData} />
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography
                sx={{
                  fontSize: "0.9rem",
                  color: "gray",
                  lineHeight: 1.2, // Reduces line spacing
                }}
              >
                Employees on Leave Today
              </Typography>
              <div style={{ height: 300, width: "100%" }}>
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
            </CardContent>
          </Card>
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