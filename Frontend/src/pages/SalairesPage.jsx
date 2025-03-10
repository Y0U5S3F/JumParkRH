import { useEffect, useState } from "react";
import {
  DataGrid,
  useGridApiRef,
  DEFAULT_GRID_AUTOSIZE_OPTIONS,
} from "@mui/x-data-grid";
import {
  Container,
  IconButton,
  Snackbar,
  Alert,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import dayjs from "dayjs";
import { fetchMinimalEmployes } from "../service/EmployeService";
import { fetchSalairesStream, deleteSalaire } from "../service/SalaireService";

export default function SalairesPage() {
  const [employees, setEmployees] = useState([]);
  const [salaires, setSalaires] = useState([]);
  const [loading, setLoading] = useState(true);
  const apiRef = useGridApiRef();
  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: "",
    message: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [salairesData, employeesData] = await Promise.all([
          fetchSalaires(),
          fetchMinimalEmployes(),
        ]);
  
        console.log("Fetched salaires:", salairesData); // Debugging log
  
        setSalaires(salairesData);
        setEmployees(employeesData);
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
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
    { field: "employe", headerName: "Matricule", flex: 1 },
    { field: "salaire_net", headerName: "Salaire Net", flex: 1 },
    { field: "mode_paiement", headerName: "Mode de Paiement", flex: 1 },
    {
      field: "date_mois_annee",
      headerName: "Date (Mois:Année)",
      flex: 1,
      valueGetter: (params) => {
        if (!params?.row?.created_at) return "N/A"; // Avoids crash when data is missing
        return dayjs(params.row.created_at).format("MM:YYYY");
      },
    },    
    {
      field: "actions",
      headerName: "Actions",
      flex: 0.6,
      renderCell: (params) => (
        <div style={{ display: "flex" }}>
          <IconButton onClick={() => console.log("edit", params.row.id)}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => console.log("delete", params.row.id)}>
            <DeleteIcon />
          </IconButton>
        </div>
      ),
    },
  ];

  return (
    <Container>
      <DataGrid
        apiRef={apiRef}
        rows={salaires}
        columns={columns}
        pageSize={5}
        disableRowSelectionOnClick
        disableMultipleRowSelection
        loading={loading}
        pagination
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
