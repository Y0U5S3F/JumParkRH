import  { useEffect, useState } from "react";
import axios from "axios";
import {
  DataGrid,
  useGridApiRef,
  DEFAULT_GRID_AUTOSIZE_OPTIONS,
} from "@mui/x-data-grid";
import {
  Container,
  TextField,
  Button,
  Box,
  IconButton,
  Modal,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  Snackbar,
  Alert,
  Divider,
  Grid,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Service from "../models/service";
import { fetchConges } from "../service/CongeService";
import Conge from "../models/conge";

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
}));

export default function DemandeCongePage() {
  const [conges, setConges] = useState([]);
  const [expand, setExpand] = useState(DEFAULT_GRID_AUTOSIZE_OPTIONS.expand);
  const [open, setOpen] = useState(false);
  const apiRef = useGridApiRef();
  const [snackbar, setSnackbar] = useState({
      open: false,
      severity: "",
      message: "",
    });
  const [refresh, setRefresh] = useState(0); // State to trigger re-fetch
  const [loading, setLoading] = useState(true);
  const [newConge, setNewConge] = useState(new Conge());

  const classes = useStyles();

  useEffect(() => {
    const loadConges = async () => {
        setLoading(true);
        try {
          const data = await fetchConges();
          console.log("Congés:", data);
          setConges(data);
          setLoading(false);
        } catch (error) {
          setSnackbar({ open: true, severity: "error", message: "Erreur lors du chargement des congés." });
        }
        finally{
            setLoading(false);
        }
      };
      loadConges();
  }, [refresh]);
  


  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleDelete = async (id) => {
    console.log("Delete Service with id:", id);
  };

  const handleEdit = (service) => {
    console.log("Edit Service:", service);
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewConge((prev) => ({ ...prev, [name]: value }));
  };
  const handleAddConge = async () => {
    console.log("Add Congé:", newConge);
  };

  

  const columns = [
    { field: "id", headerName: "ID", flex: 1 },
    { field: "employe", headerName: "Employé ID", flex: 1 },
    { field: "type_conge", headerName: "Type de Congé", flex: 1 },
    { field: "start_date", headerName: "Date Début", flex: 1 },
    { field: "end_date", headerName: "Date Fin", flex: 1 },
    { field: "status", headerName: "Statut", flex: 1 },
    { field: "notes", headerName: "Notes", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      flex: 0.6,
      renderCell: (params) => (
        <div style={{ display: "flex" }}>
          <IconButton onClick={() => handleEdit(params.row)}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleDelete(params.row.id)}>
            <DeleteIcon />
          </IconButton>
        </div>
      ),
    },
  ];

  return (
    <Container className={classes.container}>
      <Box className={classes.topBar}>
        <Button variant="contained" onClick={() => setOpen(true)}>
          Ajouter Service
        </Button>
      </Box>

      <Modal open={open} onClose={() => setOpen(false)}>
        <Box className={classes.modalStyle}>
          <Typography variant="h6" gutterBottom>
            Veuillez saisir les coordonnées de vos personnels
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Box className={classes.contentContainer}>
            <Typography variant="body1" gutterBottom>
              Informations personnelles
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
            <Grid item xs={4}>
                <TextField
                  id="outlined-search"
                  label="nom"
                  type="search"
                  variant="outlined"
                  name="nom"
                  value={newConge.nom}
                  onChange={handleInputChange}
                  fullWidth
                />
              </Grid>
            </Grid>
        
          </Box>
          <Box mt={3} display="flex" justifyContent="space-between">
            <Button
              variant="outlined"
              onClick={() => setNewConge(new Conge())}
            >
              Réinitialiser
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddConge}
            >
              Enregistrer
            </Button>
          </Box>
        </Box>
      </Modal>

      <DataGrid
        apiRef={apiRef}
        rows={conges}
        columns={columns}
        pageSize={5}
        checkboxSelection={false}
        disableRowSelectionOnClick={true}
        disableMultipleRowSelection={true}
        autosizeOptions={expand}
        pagination
        loading={loading}
        autosizeOnMount={true}
        pageSizeOptions={[10, 25, 100]}
        initialState={{
          pagination: {
            paginationModel: { pageSize: 10, page: 0 },
          },
        }}
        // checkboxSelection={false}
      />

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
