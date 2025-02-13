import React, { useEffect, useState } from "react";
import axios from "axios";
import Employe from "../models/employe";
import { DataGrid } from "@mui/x-data-grid";
import {
  Container,
  TextField,
  Button,
  Box,
  Modal,
  Typography,
  Alert,
  Snackbar,
  MenuItem,
  Divider,
  Grid,
  Select,
  FormControl,
  InputLabel,
  IconButton,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';

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
    height: 450,
    backgroundColor: "black",
    boxShadow: 24,
    padding: "20px",
    border: `1px solid ${theme.palette.primary.main}`,
    borderRadius: '8px',
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

export default function Home() {
  const [employees, setEmployees] = useState([]);
  const [open, setOpen] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [services, setServices] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, severity: "", message: "" });

  const classes = useStyles();
  const [newEmployee, setNewEmployee] = useState(new Employe("", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""));
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEmployee((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    // Fetch employees data
    const fetchEmployees = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/employe/employes/"
        );
        const formattedEmployees = response.data.map((emp) => ({
          id: emp.matricule,
          ...emp,
          departement: emp.departement ? emp.departement.nom : "N/A",
          service: emp.service ? emp.service.nom : "N/A",
        }));
        setEmployees(formattedEmployees);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };

    // Fetch departments data
    const fetchDepartments = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/departement/departements/"
        );
        setDepartments(response.data);
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    };

    // Fetch services data
    const fetchServices = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/service/services/"
        );
        setServices(response.data);
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };

    fetchEmployees();
    fetchDepartments();
    fetchServices();
  }, []);

  const handleDelete = async (matricule) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/employe/employes/${matricule}/`);
      console.log("Deleted employé with matricule:", matricule);
      setEmployees((prev) => prev.filter((employee) => employee.matricule !== matricule));
    } catch (error) {
      console.error("Error deleting employé:", error);
    }
  };

  const handleAddEmployee = async () => {
    try {
      if (!newEmployee.departement_id || !newEmployee.service_id) {
        console.error("Departement and Service fields are required.");
        return;
      }

      const employeeToSend = new Employe(
        newEmployee.matricule,
        newEmployee.nom,
        newEmployee.prenom,
        newEmployee.email,
        newEmployee.date_naissance,
        newEmployee.lieu_naissance,
        newEmployee.nationalite,
        newEmployee.genre,
        newEmployee.situation_familiale,
        newEmployee.cin,
        newEmployee.telephone,
        newEmployee.adresse,
        newEmployee.ville,
        newEmployee.code_postal,
        newEmployee.contact_urgence_nom,
        newEmployee.contact_urgence_telephone,
        newEmployee.role,
        newEmployee.departement_id,
        newEmployee.service_id,
        newEmployee.compte_bancaire,
        newEmployee.rib_bancaire
      );

      console.log("Sending employee data:", employeeToSend);

      const response = await axios.post(
        "http://127.0.0.1:8000/api/employe/employes/",
        employeeToSend
      );

      console.log("Response from server:", response);

      if (response.status === 201) {
        setSnackbar({ open: true, severity: "success", message: "Employee added successfully!" });
      } else {
        setSnackbar({ open: true, severity: "error", message: "Failed to add employee." });
      }

      setOpen(false);
      setNewEmployee(new Employe("", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""));
    } catch (error) {
      console.error("Error adding employee:", error);
      setSnackbar({ open: true, severity: "error", message: "Error adding employee." });

      if (error.response) {
        console.error("Server response:", error.response.data);
      }
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleView = (id) => {
    console.log("View employé with matricule:", id);
  };

  const columns = [
    { field: "matricule", headerName: "Matricule", width: 150 },
    { field: "nom", headerName: "Nom", width: 150 },
    { field: "prenom", headerName: "Prénom", width: 150 },
    { field: "email", headerName: "Email", width: 180 },
    { field: "role", headerName: "Role", width: 150 },
    { field: "departement", headerName: "Département", width: 150 },
    { field: "service", headerName: "Service", width: 150 },
    {
      field: "actions",
      headerName: "Actions",
      width: 100,
      renderCell: (params) => (
        <>
          <IconButton onClick={() => handleView(params.row.id)}>
            <VisibilityIcon />
          </IconButton>
          <IconButton onClick={() => handleDelete(params.row.id)}>
            <DeleteIcon />
          </IconButton>
        </>
      ),
    },
  ];

  return (
    <Container className={classes.container}>
      <Box className={classes.topBar}>
        <Button variant="contained" onClick={() => setOpen(true)}>
          Ajouter Employé
        </Button>
      </Box>

      <Modal open={open} onClose={() => setOpen(false)}>
        <Box className={classes.modalStyle}>
          <Typography variant="h6" gutterBottom>
            Veuillez saisir les coordonnées de vos personnels
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Box className={classes.contentContainer}>
            <Typography variant="body1" color="white" gutterBottom>
              Informations personnelles
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <TextField
                  id="outlined-search"
                  label="Matricule"
                  type="search"
                  variant="outlined"
                  name="matricule"
                  value={newEmployee.matricule}
                  onChange={handleInputChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  id="outlined-search"
                  label="Nom"
                  type="search"
                  variant="outlined"
                  name="nom"
                  value={newEmployee.nom}
                  onChange={handleInputChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  id="outlined-search"
                  label="Prenom"
                  type="search"
                  name="prenom"
                  value={newEmployee.prenom}
                  onChange={handleInputChange}
                  variant="outlined"
                  fullWidth
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  id="outlined-search"
                  label="Email"
                  type="search"
                  variant="outlined"
                  name="email"
                  value={newEmployee.email}
                  onChange={handleInputChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={4}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    sx={{ width: "100%" }}
                    label="Date de naissance"
                    value={newEmployee.date_naissance ? dayjs(newEmployee.date_naissance) : null}
                    onChange={(date) => handleInputChange({ target: { name: 'date_naissance', value: date?.format('YYYY-MM-DD') } })}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={4}>
                <TextField
                  id="outlined-search"
                  label="Lieu de naissance"
                  type="search"
                  name="lieu_naissance"
                  value={newEmployee.lieu_naissance}
                  onChange={handleInputChange}
                  variant="outlined"
                  fullWidth
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  id="outlined-search"
                  label="Nationalité"
                  type="search"
                  name="nationalite"
                  value={newEmployee.nationalite}
                  onChange={handleInputChange}
                  variant="outlined"
                  fullWidth
                />
              </Grid>
              <Grid item xs={4}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Genre légal</InputLabel>
                  <Select label="Genre légal" value={newEmployee.genre} onChange={handleInputChange} name="genre">
                    <MenuItem value="Homme">Homme</MenuItem>
                    <MenuItem value="Femme">Femme</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={4}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Situation familiale</InputLabel>
                  <Select label="Situation familiale" value={newEmployee.situation_familiale} onChange={handleInputChange} name="situation_familiale">
                    <MenuItem value="Celibataire">Célibataire</MenuItem>
                    <MenuItem value="Marie">Marié(e)</MenuItem>
                    <MenuItem value="Divorce">Divorcé(e)</MenuItem>
                    <MenuItem value="Veuf">Veuf(ve)</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={4}>
                <TextField
                  fullWidth
                  variant="outlined"
                  label="CIN"
                  name="cin"
                  value={newEmployee.cin}
                  onChange={handleInputChange}
                  inputProps={{ maxLength: 8 }}
                />
              </Grid>
            </Grid>
            <Typography variant="body1" color="white" sx={{ pt: 2 }} gutterBottom>
              Informations personnelles
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <TextField
                  id="outlined-search"
                  label="Numero de telephone"
                  type="search"
                  name="telephone"
                  value={newEmployee.telephone}
                  onChange={handleInputChange}
                  variant="outlined"
                  fullWidth
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  id="outlined-search"
                  label="Adresse"
                  type="search"
                  name="adresse"
                  value={newEmployee.adresse}
                  onChange={handleInputChange}
                  variant="outlined"
                  fullWidth
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  id="outlined-search"
                  label="Ville"
                  type="search"
                  name="ville"
                  value={newEmployee.ville}
                  onChange={handleInputChange}
                  variant="outlined"
                  fullWidth
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  id="outlined-search"
                  label="Code postal"
                  type="search"
                  name="code_postal"
                  value={newEmployee.code_postal}
                  onChange={handleInputChange}
                  variant="outlined"
                  fullWidth
                />
              </Grid>
            </Grid>
            <Typography sx={{ mt: 2 }} variant="body1" color="white" gutterBottom>
              Contact d&apos;urgence
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <TextField
                  id="outlined-search"
                  label="Nom du Contact d'Urgence"
                  name="contact_urgence_nom"
                  value={newEmployee.contact_urgence_nom}
                  onChange={handleInputChange}
                  type="search"
                  variant="outlined"
                  fullWidth
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  id="outlined-search"
                  label="Numéro de Téléphone d'Urgence"
                  name="contact_urgence_telephone"
                  value={newEmployee.contact_urgence_telephone}
                  onChange={handleInputChange}
                  type="search"
                  variant="outlined"
                  fullWidth
                />
              </Grid>
            </Grid>
            <Typography sx={{ mt: 2 }} variant="body1" color="white" gutterBottom>
              Position
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Role</InputLabel>
                  <Select
                    label="Role"
                    value={newEmployee.role}
                    onChange={handleInputChange}
                    name="role"
                  >
                    <MenuItem value="Admin">Admin</MenuItem>
                    <MenuItem value="Manager">Manager</MenuItem>
                    <MenuItem value="Employe">Employé</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={4}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Département</InputLabel>
                  <Select
                    label="Département"
                    name="departement_id"
                    value={newEmployee.departement_id}
                    onChange={handleInputChange}
                  >
                    {departments.map((dept) => (
                      <MenuItem key={dept.id} value={dept.id}>
                        {dept.nom}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={4}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Service</InputLabel>
                  <Select
                    label="Service"
                    name="service_id"
                    value={newEmployee.service_id}
                    onChange={handleInputChange}
                  >
                    {services
                      .filter((service) => service.departement === newEmployee.departement_id)
                      .map((service) => (
                        <MenuItem key={service.id} value={service.id}>
                          {service.nom}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <Typography sx={{ mt: 2 }} variant="body1" color="white" gutterBottom>
              Information Banquaire
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <TextField
                  id="outlined-search"
                  label="Compte bancaire"
                  name="compte_bancaire"
                  value={newEmployee.compte_bancaire}
                  onChange={handleInputChange}
                  type="search"
                  variant="outlined"
                  fullWidth
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  id="outlined-search"
                  label="RIB bancaire"
                  name="rib_bancaire"
                  type="search"
                  variant="outlined"
                  value={newEmployee.rib_bancaire}
                  onChange={handleInputChange}
                  fullWidth
                />
              </Grid>
            </Grid>
          </Box>
          <Box mt={3} display="flex" justifyContent="space-between">
            <Button variant="outlined" onClick={() => setNewEmployee(new Employe("", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""))}>
              Réinitialiser
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddEmployee}
            >
              Enregistrer
            </Button>
          </Box>
        </Box>
      </Modal>

      <DataGrid
        rows={employees}
        columns={columns}
        pageSize={6}
        checkboxSelection
      />

      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
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