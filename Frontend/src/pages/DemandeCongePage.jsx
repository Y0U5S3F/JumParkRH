import { useEffect, useState } from "react";
import axios from "axios";
import {
  DataGrid,
  useGridApiRef,
  DEFAULT_GRID_AUTOSIZE_OPTIONS,
} from "@mui/x-data-grid";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { addConge } from "../service/CongeService";
import {
  Container,
  TextField,
  Button,
  Box,
  IconButton,
  Modal,
  FormControl,
  Autocomplete,
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
import { fetchMinimalEmployes } from "../service/EmployeService";
import Service from "../models/service";
import { fetchConges, deleteConge } from "../service/CongeService";
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
  const [employees, setEmployees] = useState([]);
  const [conges, setConges] = useState([]);
  const [expand, setExpand] = useState(DEFAULT_GRID_AUTOSIZE_OPTIONS.expand);
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
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
        const data = await fetchConges(); // ✅ Use the updated function
        console.log("Congés with employee names:", data);
        setConges(data);
      } catch (error) {
        setSnackbar({
          open: true,
          severity: `${error}`,
          message: "Erreur lors du chargement des congés.",
        });
      } finally {
        setLoading(false);
      }
    };
    const loadEmployees = async () => {
      try {
        const data = await fetchMinimalEmployes();
        setEmployees(data);
      } catch (error) {
        console.error("Erreur lors du chargement des employés:", error);
      }
    };
    loadEmployees();
    loadConges();
  }, [refresh]);

  const filteredEmployees = employees.filter((emp) =>
    [emp.nom, emp.prenom, emp.matricule].some((field) =>
      field.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleDeleteConge = async (congeId) => {
    try {
      await deleteConge(congeId); // Call the service
      setConges((prev) => prev.filter((conge) => conge.id !== congeId));
      setSnackbar({
        open: true,
        severity: "success",
        message: "Congé deleted successfully!",
      });
    } catch (error) {
      console.error("Error deleting congé:", error);
      setSnackbar({
        open: true,
        severity: "error",
        message: "Error deleting congé.",
      });
    }
  };
  

  const handleEdit = (service) => {
    console.log("Edit Service:", service);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setNewConge((prev) => ({ ...prev, [name]: value }));
    console.log(newConge);
  };
  const handleAddConge = async () => {
    try {
      if (
        !newConge.matricule ||
        !newConge.start_date ||
        !newConge.end_date ||
        !newConge.status
      ) {
        setSnackbar({
          open: true,
          severity: "error",
          message: "All fields are required.",
        });
        return;
      }

      const congeToSend = {
        employe: newConge.matricule,
        start_date: newConge.start_date,
        end_date: newConge.end_date,
        type_conge: newConge.type_conge,
        status: newConge.status,
        notes: newConge.notes, // Default status
      };

      const response = await addConge(congeToSend);
      console.log(congeToSend); // Debugging

      if (response) {
        setSnackbar({
          open: true,
          severity: "success",
          message: "Congé added successfully!",
        });
      } else {
        setSnackbar({
          open: true,
          severity: "error",
          message: "Failed to add congé.",
        });
      }

      setOpen(false);
      setNewConge({
        matricule: "",
        date_debut: "",
        date_fin: "",
        type: "",
        statut: "En attente",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        severity: "error",
        message: "Error adding congé.",
      });
    }
  };

  const columns = [
    { field: "id", headerName: "ID", flex: 1 },
    { field: "employe_name", headerName: "Employé", flex: 1 }, // ✅ Display full name
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
          <IconButton onClick={() => handleDeleteConge(params.row.id)}>
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

      <Modal
        open={open}
        onClose={() => {
          setOpen(false);
          setNewConge(new Conge());
          setSearchTerm("");
        }}
      >
        <Box className={classes.modalStyle}>
          <Typography variant="h6" gutterBottom>
            Veuillez saisir les informations du congé
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Box className={classes.contentContainer}>
            <Typography variant="body1" gutterBottom>
              Informations sur le congé
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <Autocomplete
                  options={filteredEmployees}
                  getOptionLabel={(option) =>
                    `${option.nom} ${option.prenom} (${option.matricule})`
                  }
                  onInputChange={(event, value) => setSearchTerm(value)}
                  onChange={(event, newValue) => {
                    handleInputChange({
                      target: {
                        name: "matricule",
                        value: newValue?.matricule || "",
                      },
                    });
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Search Employee"
                      variant="outlined"
                    />
                  )}
                />
              </Grid>
              <Grid item xs={4}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Type de congé</InputLabel>
                  <Select
                    label="Type de congé"
                    value={newConge.type_conge}
                    onChange={handleInputChange}
                    name="type_conge"
                  >
                    <MenuItem value="conge paye">Congé Payé</MenuItem>
                    <MenuItem value="conge sans solde">
                      Congé Sans Solde
                    </MenuItem>
                    <MenuItem value="conge maladie">Congé Maladie</MenuItem>
                    <MenuItem value="conge maternite">Congé Maternité</MenuItem>
                    <MenuItem value="conge paternite">Congé Paternité</MenuItem>
                    <MenuItem value="conge exceptionnel">
                      Congé Exceptionnel
                    </MenuItem>
                    <MenuItem value="conge annuel">Congé Annuel</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={4}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    sx={{ width: "100%" }}
                    label="Date de début"
                    value={
                      newConge.start_date ? dayjs(newConge.start_date) : null
                    }
                    onChange={(date) =>
                      handleInputChange({
                        target: {
                          name: "start_date",
                          value: date?.format("YYYY-MM-DD"),
                        },
                      })
                    }
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={4}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    sx={{ width: "100%" }}
                    label="Date de fin"
                    value={newConge.end_date ? dayjs(newConge.end_date) : null}
                    onChange={(date) =>
                      handleInputChange({
                        target: {
                          name: "end_date",
                          value: date?.format("YYYY-MM-DD"),
                        },
                      })
                    }
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={4}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Statut</InputLabel>
                  <Select
                    label="Statut"
                    value={newConge.status}
                    onChange={handleInputChange}
                    name="status"
                  >
                    <MenuItem value="en cours">En Cours</MenuItem>
                    <MenuItem value="accepte">Accepté</MenuItem>
                    <MenuItem value="refuse">Refusé</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Notes"
                  type="text"
                  variant="outlined"
                  name="notes"
                  value={newConge.notes}
                  onChange={handleInputChange}
                  fullWidth
                  multiline
                  rows={2}
                />
              </Grid>
            </Grid>
          </Box>
          <Box mt={3} display="flex" justifyContent="space-between">
            <Button variant="outlined" onClick={() => setNewConge(new Conge())}>
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
