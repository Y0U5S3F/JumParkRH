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
import { addConge, updateConge } from "../service/CongeService";
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
import { fetchTypeConges } from "../service/TypeCongeService";
import AddIcon from '@mui/icons-material/Add';
import { Payments } from "@mui/icons-material";

const useStyles = makeStyles((theme) => ({
  container: { padding: "20px", display: "flex", flexDirection: "column" },
  
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
  topBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "10px",
    padding: "5px",
  },
  titleContainer: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    fontWeight: "bold",
  },
}));

export default function DemandeCongePage() {
  const [employees, setEmployees] = useState([]);
  const [conges, setConges] = useState([]);
  const [editConge, setEditConge] = useState(new Conge());
  const [expand, setExpand] = useState(DEFAULT_GRID_AUTOSIZE_OPTIONS.expand);
  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchEditTerm, setSearchEditTerm] = useState("");
  const apiRef = useGridApiRef();
  const [typeConges, setTypeConges] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: "",
    message: "",
  });
  const [refresh, setRefresh] = useState(0); // State to trigger re-fetch
  const [loading, setLoading] = useState(true);
  const [newConge, setNewConge] = useState(new Conge());

  const classes = useStyles();
  const [pageTitle, setPageTitle] = useState("Demande congé");
  
    useEffect(() => {
      document.title = pageTitle; // Update the document title
    }, [pageTitle]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [congesData, employeesData, typeCongesData] = await Promise.all([
          fetchConges(),
          fetchMinimalEmployes(),
          fetchTypeConges(),
        ]);
  
        setConges(congesData);
        setEmployees(employeesData);
        setTypeConges(typeCongesData);
  
        console.log("Congés:", congesData);
        console.log("Employés:", employeesData);
        console.log("Types de Congé:", typeCongesData);
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

  const handleEdit = (conge) => {
    const typeConge = typeConges.find(type => type.nom === conge.typeConge_nom);
    setEditConge({
      ...conge,
      typeconge: typeConge ? typeConge.id : "",
    });
    setOpenEdit(true);
    console.log("Edit Conge:", conge);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewConge((prev) => ({ ...prev, [name]: value }));
    console.log(newConge);
  };

  const handleUpdateConge = async () => {
    try {
      if (
        !editConge.employe ||
        !editConge.startDate ||
        !editConge.endDate ||
        !editConge.status
      ) {
        setSnackbar({
          open: true,
          severity: "error",
          message: "All fields are required.",
        });
        return;
      }
  
      const congeToUpdate = {
        
        employe: editConge.employe,
        startDate: editConge.startDate,
        endDate: editConge.endDate,
        typeconge: editConge.typeconge,
        status: editConge.status,
        notes: editConge.notes,
      };
  
      await updateConge(editConge.id, congeToUpdate);
  
      setSnackbar({
        open: true,
        severity: "success",
        message: "Congé updated successfully!",
      });
  
      setOpenEdit(false);
      setRefresh((prev) => prev + 1); // Trigger re-fetch
    } catch (error) {
      setSnackbar({
        open: true,
        severity: "error",
        message: "Error updating congé.",
      });
    }
  };

  const handleInputModifyChange = (e) => {
    const { name, value } = e.target;
    setEditConge((prev) => ({ ...prev, [name]: value }));
    console.log(editConge);
  };
  const handleAddConge = async () => {
  console.log(newConge); // Debugging
  try {
    // Ensure all required fields are provided
    if (
      !newConge.employe ||
      !newConge.startDate ||
      !newConge.endDate ||
      !newConge.status
    ) {
      setSnackbar({
        open: true,
        severity: "error",
        message: "All fields are required.",
      });
      return;
    }
    console.log(newConge); // Debugging
    const congeToSend = {
      employe: newConge.employe,
      startDate: newConge.startDate,
      endDate: newConge.endDate,
      typeconge: newConge.typeconge,
      status: newConge.status, // Use "accepte" here when applicable
      notes: newConge.notes,
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
    // Reset newConge with consistent key names
    setNewConge({
      employe: "",
      startDate: "",
      endDate: "",
      typeconge: "",
      status: "en cours",
      notes: ""
    });
  } catch (error) {
    setSnackbar({
      open: true,
      severity: "error",
      message: "Error adding conge.",
    });
  }
};


  const columns = [
    { field: "id", headerName: "ID", flex: 1 },
    { field: "employe_name", headerName: "Employé", flex: 1 }, // ✅ Display full name
    { field: "typeConge_nom", headerName: "Type de Congé", flex: 1 }, // Display type_conge.nom
    { field: "startDate", headerName: "Date Début", flex: 1 },
    { field: "endDate", headerName: "Date Fin", flex: 1 },
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
        <Box className={classes.titleContainer}>
          <Payments />
          <Typography variant="h6" fontWeight="bold">
            Demandes de Congé
          </Typography>
        </Box>
        <Button
          size="medium"
          variant="outlined"
          startIcon={<AddIcon />}
          sx={{
            '&:hover': {
              backgroundColor: (theme) => theme.palette.primary.main,
              color: 'white',
              borderColor: (theme) => theme.palette.primary.main,
            },
          }}
          onClick={() => setOpen(true)}
        >
          Ajouter Congé
        </Button>
      </Box>

      {/* Add Conge */}
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
                        name: "employe",
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
                    value={newConge.typeconge}
                    onChange={handleInputChange}
                    name="typeconge"
                  >
                    {typeConges.map((type) => (
                      <MenuItem key={type.id} value={type.id}>
                        {type.nom}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={4}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    sx={{ width: "100%" }}
                    label="Date de début"
                    value={
                      newConge.startDate ? dayjs(newConge.startDate) : null
                    }
                    onChange={(date) =>
                      handleInputChange({
                        target: {
                          name: "startDate",
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
                    value={newConge.endDate ? dayjs(newConge.endDate) : null}
                    onChange={(date) =>
                      handleInputChange({
                        target: {
                          name: "endDate",
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
      {/* Update Conge */}
      <Modal
        open={openEdit}
        onClose={() => {
          setOpenEdit(false);
          setNewConge(new Conge());
          setSearchEditTerm("");
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
                  options={employees}
                  getOptionLabel={(option) =>
                    `${option.nom} ${option.prenom} (${option.matricule})`
                  }
                  value={
                    employees.find(
                      (emp) => emp.matricule === editConge.employe
                    ) || null
                  }
                  onChange={(event, newValue) => {
                    setEditConge((prev) => ({
                      ...prev,
                      employe: newValue ? newValue.matricule : "",
                    }));
                  }}
                  renderInput={(params) => (
                    <TextField {...params} label="Employé" />
                  )}
                  isOptionEqualToValue={(option, value) =>
                    option.matricule === value.matricule
                  }
                />
              </Grid>
              <Grid item xs={4}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Type de congé</InputLabel>
                  <Select
                    label="Type de congé"
                    value={editConge.typeconge}
                    onChange={handleInputChange}
                    name="typeconge"
                  >
                    {typeConges.map((type) => (
                      <MenuItem key={type.id} value={type.id}>
                        {type.nom}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={4}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    sx={{ width: "100%" }}
                    label="Date de début"
                    value={
                      editConge.startDate ? dayjs(editConge.startDate) : null
                    }
                    onChange={(date) =>
                      handleInputModifyChange({
                        target: {
                          name: "startDate",
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
                    value={
                      editConge.endDate ? dayjs(editConge.endDate) : null
                    }
                    onChange={(date) =>
                      handleInputModifyChange({
                        target: {
                          name: "endDate",
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
                    value={editConge.status}
                    onChange={handleInputModifyChange}
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
                  value={editConge.notes}
                  onChange={handleInputModifyChange}
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
              onClick={handleUpdateConge}
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
