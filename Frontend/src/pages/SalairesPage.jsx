import { useEffect, useState } from "react";
import { DataGrid, useGridApiRef, DEFAULT_GRID_AUTOSIZE_OPTIONS } from "@mui/x-data-grid";
import dayjs from "dayjs";
import {
  Container,
  IconButton,
  Snackbar,
  Alert,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import { fetchMinimalEmployes } from "../service/EmployeService";
import { fetchSalaires, deleteSalaire } from "../service/SalaireService";

const useStyles = makeStyles((theme) => ({
  container: {
    padding: "20px",
    display: "flex",
    flexDirection: "column",
  },
  alertContainer: {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    zIndex: 1000,
  },
}));

export default function SalairesPage() {
  const [employees, setEmployees] = useState([]);
  const [salaires, setSalaires] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: "",
    message: "",
  });
  const [refresh, setRefresh] = useState(0);
  const apiRef = useGridApiRef();
  const classes = useStyles();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch both salaires and minimal employees in parallel
        const [salairesData, employeesData] = await Promise.all([
          fetchSalaires(),
          fetchMinimalEmployes(),
        ]);

        setSalaires(salairesData);
        setEmployees(employeesData);
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
        setSnackbar({
          open: true,
          severity: "error",
          message: "Erreur lors du chargement des données.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [refresh]);

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Dummy handler for view action; you can expand this to show more details
  const handleView = (params) => {
    console.log("View salaire:", params.row);
  };

  // Delete handler that calls the delete service and refreshes the list
  const handleDelete = async (params) => {
    try {
      await deleteSalaire(params.row.id);
      setSnackbar({
        open: true,
        severity: "success",
        message: "Salaire deleted successfully",
      });
      setRefresh((prev) => prev + 1);
    } catch (error) {
      console.error("Erreur deleting salaire:", error);
      setSnackbar({
        open: true,
        severity: "error",
        message: "Erreur deleting salaire",
      });
    }
  };

  // Define DataGrid columns with proper value getters and action handlers.
  const columns = [
    { field: "employe", headerName: "Matricule", flex: 1 },
    {
      field: "employe_name",
      headerName: "Employé",
      flex: 1,
      // In this example, we're using the same value as matricule.
      // If you need to display a full name, consider mapping the employee info.
      valueGetter: (params) => params.row.employe,
    },
    { field: "mode_paiement", headerName: "Mode de Paiement", flex: 1 },
    {
      field: "date_mois_annee",
      headerName: "Date (Mois:Année)",
      flex: 1,
      valueGetter: (params) => {
        const date = dayjs(params.row.created_at);
        return date.format("MM:YYYY");
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 0.6,
      renderCell: (params) => (
        <div style={{ display: "flex" }}>
          <IconButton onClick={() => handleView(params)}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleDelete(params)}>
            <DeleteIcon />
          </IconButton>
        </div>
      ),
    },
  ];

  return (
    <Container className={classes.container}>
      <DataGrid
        apiRef={apiRef}
        rows={salaires}
        columns={columns}
        pageSize={5}
        checkboxSelection={false}
        disableRowSelectionOnClick
        pagination
        loading={loading}
        autoHeight
        pageSizeOptions={[10, 25, 100]}
        initialState={{
          pagination: {
            paginationModel: { pageSize: 10, page: 0 },
          },
        }}
      />

      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}
