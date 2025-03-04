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
import { makeStyles } from "@mui/styles";
import { PieChart } from "@mui/x-charts/PieChart";
import { BarChart } from "@mui/x-charts/BarChart";
import {
  DataGrid,
  useGridApiRef,
  DEFAULT_GRID_AUTOSIZE_OPTIONS,
} from "@mui/x-data-grid";

const useStyles = makeStyles((theme) => ({
  container: { padding: "20px", display: "flex", flexDirection: "column" },
  topBar: {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: "10px",
  },
  modalStyle: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 1000,
    height: 350,
    backgroundColor: "black",
    boxShadow: 24,
    padding: "20px",
    border: `1px solid ${theme.palette.primary.main}`,
    borderRadius: "8px",
    display: "flex",
    flexDirection: "column",
  },
  contentContainer: {
    flex: 1,
    overflowY: "auto",
    paddingRight: "10px", // Prevents content from touching the scrollbar
    scrollbarWidth: "none", // Hides scrollbar in Firefox
    "&::-webkit-scrollbar": {
      display: "none", // Hides scrollbar in Chrome/Safari
    },
  },
  formContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    marginTop: "10px",
  },
  alertContainer: {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    zIndex: 1000,
  },
  card: {
    backgroundColor: "#1E1E2D",
    color: "white",
    boxShadow: 3,
    borderRadius: 2,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "80%", // Ensures all cards are the same height
    padding: "16px",
  },
  title: {
    fontSize: "0.9rem",
    color: "gray",
    lineHeight: 1.2, // Reduces line spacing
  },
  value: {
    fontWeight: "bold",
    marginTop: "8px",
  },
}));

const absenceData = [
  { name: "John Doe", absences: 15 },
  { name: "Jane Smith", absences: 12 },
  { name: "Alice Brown", absences: 10 },
  { name: "Bob Johnson", absences: 8 },
  { name: "Charlie White", absences: 7 },
];

// Reusable Summary Card Component
const SummaryCard = ({ title, value, icon }) => {
  const classes = useStyles();
  return (
    <Card className={classes.card}>
      <CardContent sx={{ textAlign: "center" }}>
        <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
          {icon}
          <Typography className={classes.title}>{title}</Typography>
        </Box>
        <Typography variant="h5" className={classes.value}>
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
};

const PieChartCard = () => {
  const classes = useStyles();
  return (
    <Card className={classes.card}>
      <CardContent sx={{ textAlign: "center" }}>
        <Typography className={classes.title}>
          Employee Distribution by Department
        </Typography>
        <PieChart
          series={[
            {
              data: [
                { id: 0, value: 10, label: "HR" },
                { id: 1, value: 15, label: "Engineering" },
                { id: 2, value: 20, label: "Sales" },
                { id: 3, value: 5, label: "Marketing" },
                { id: 4, value: 10, label: "Support" },
              ],
            },
          ]}
          width={400}
          height={200}
        />
      </CardContent>
    </Card>
  );
};

const BarChartCard = () => {
  const classes = useStyles();
  return (
    <Card className={classes.card}>
      <CardContent sx={{ textAlign: "center" }}>
        <Typography className={classes.title}>Most Absent Employees</Typography>
        <BarChart
          dataset={absenceData}
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
  const classes = useStyles();
  const [employeesOnLeave, setEmployeesOnLeave] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: "",
    message: "",
  });
  const apiRef = useGridApiRef();

  useEffect(() => {
    const fetchEmployeesOnLeave = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/leave/today/"
        );
        setEmployeesOnLeave(response.data);
      } catch (error) {
        console.error("Error fetching employees on leave:", error);
        setSnackbar({
          open: true,
          severity: "error",
          message: "Error fetching employees on leave.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchEmployeesOnLeave();
  }, []);

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const columns = [
    { field: "name", headerName: "Name", flex: 1 },
    { field: "department", headerName: "Department", flex: 1 },
    { field: "returnDate", headerName: "Return Date", flex: 1 },
  ];

  return (
    <Container className={classes.container}>
      <h1>Dashboard</h1>
      <Box className="mainContent">
        <Grid container spacing={3}>
          <Grid item xs={3}>
            <SummaryCard
              title="Total Employees"
              value="120"
              icon={<PeopleIcon sx={{ color: "gray" }} />}
            />
          </Grid>
          <Grid item xs={3}>
            <SummaryCard
              title="Total Departments"
              value="5"
              icon={<BusinessIcon sx={{ color: "gray" }} />}
            />
          </Grid>
          <Grid item xs={3}>
            <SummaryCard
              title="Pending Vacation Requests"
              value="5"
              icon={<EventNoteIcon sx={{ color: "gray" }} />}
            />
          </Grid>
          <Grid item xs={3}>
            <SummaryCard
              title="Next Public Holiday"
              value="March 15, 2025"
              icon={<CelebrationIcon sx={{ color: "gray" }} />}
            />
          </Grid>
        </Grid>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <PieChartCard />
          </Grid>
          <Grid item xs={6}>
            <BarChartCard />
          </Grid>
        </Grid>
          <Grid item xs={12}>
            <Card >
              <CardContent >
                <Typography className={classes.title}>
                  Employees on Leave Today
                </Typography>
                <div style={{ height: 300, width: "100%" }}>
                  <DataGrid
                    apiRef={apiRef}
                    rows={employeesOnLeave}
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