import React, { useEffect, useState } from "react";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import {
  Container,
  TextField,
  Button,
  Box,
  Modal,
  Typography,
  MenuItem,
  Divider,
  Grid2,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

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
}));

export default function Home() {
  const [employees, setEmployees] = useState([]);
  const [open, setOpen] = useState(false);
  const [newEmployee, setNewEmployee] = useState({});
  const [departments, setDepartments] = useState([]);
  const [services, setServices] = useState([]);
  const classes = useStyles();

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

  const handleInputChange = (e) => {
    setNewEmployee({ ...newEmployee, [e.target.name]: e.target.value });
  };

  const handleAddEmployee = async () => {
    try {
      await axios.post(
        "http://127.0.0.1:8000/api/employe/create/",
        newEmployee
      );
      setOpen(false);
      setNewEmployee({});
    } catch (error) {
      console.error("Error adding employee:", error);
    }
  };

  const columns = [
    { field: "matricule", headerName: "Matricule", width: 150 },
    { field: "nom", headerName: "Nom", width: 150 },
    { field: "prenom", headerName: "Prénom", width: 150 },
    { field: "email", headerName: "Email", width: 180 },
    { field: "role", headerName: "Role", width: 150 },
    { field: "departement", headerName: "Département", width: 150 },
    { field: "service", headerName: "Service", width: 150 },
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
          <Grid2 container spacing={2}>
            <Grid2 size={4}>
              <TextField
                id="outlined-search"
                label="Matricule"
                type="search"
                variant="outlined"
                fullWidth
              />
            </Grid2>
            <Grid2 size={4}>
              <TextField
                id="outlined-search"
                label="Nom"
                type="search"
                variant="outlined"
                expanded
                fullWidth
              />
            </Grid2>
            <Grid2 size={4}>
              <TextField
                id="outlined-search"
                label="Prenom"
                type="search"
                variant="outlined"
                expanded
                fullWidth
              />
            </Grid2>
            <Grid2 size={4}>
              <TextField
                id="outlined-search"
                label="Email"
                type="search"
                variant="outlined"
                expanded
                fullWidth
              />
            </Grid2>
            <Grid2 size={4}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker sx={{ width: "100%" }} label="Date de naissance" />
              </LocalizationProvider>
            </Grid2>
            <Grid2 size={4}>
              <TextField
                id="outlined-search"
                label="Lieu de naissance"
                type="search"
                variant="outlined"
                fullWidth
              />
          </Grid2>
          <Grid2 size={4}>
              <TextField
                id="outlined-search"
                label="Nationalité"
                type="search"
                variant="outlined"
                fullWidth
              />
          </Grid2>
          <Grid2 size={4}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Genre légal</InputLabel>
                <Select label="Genre légal" defaultValue="" name="role">
                  <MenuItem value="Homme">Homme</MenuItem>
                  <MenuItem value="Femme">Femme</MenuItem>
                  <MenuItem value="Miboun">Miboun</MenuItem>
                </Select>
              </FormControl>
          </Grid2>
          <Grid2 size={4}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Situation familiale</InputLabel>
              <Select label="Situation familiale" defaultValue="Celibataire" name="situation_familiale">
                <MenuItem value="Celibataire">Célibataire</MenuItem>
                <MenuItem value="Marie">Marié(e)</MenuItem>
                <MenuItem value="Divorce">Divorcé(e)</MenuItem>
                <MenuItem value="Veuf">Veuf(ve)</MenuItem>
              </Select>
            </FormControl>
          </Grid2>
          <Grid2 size={4}>
            <TextField 
              fullWidth 
              variant="outlined" 
              label="CIN" 
              name="cin" 
              inputProps={{ maxLength: 8 }} 
            />
          </Grid2>
          </Grid2>
          <Typography variant="body1" color="white" sx={{pt:2}}gutterBottom>
            {" "}
            Informations personnelles
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Grid2 container spacing={2}>
            <Grid2 size={4}>
              <TextField
                id="outlined-search"
                label="Numero de telephone"
                type="search"
                variant="outlined"
                fullWidth
              />
          </Grid2>
          <Grid2 size={4}>
              <TextField
                id="outlined-search"
                label="Adresse"
                type="search"
                variant="outlined"
                fullWidth
              />
          </Grid2>
          <Grid2 size={4}>
              <TextField
                id="outlined-search"
                label="Ville"
                type="search"
                variant="outlined"
                fullWidth
              />
          </Grid2>
          <Grid2 size={4}>
              <TextField
                id="outlined-search"
                label="Code postal"
                type="search"
                variant="outlined"
                fullWidth
              />
          </Grid2>
          </Grid2>
          <Typography sx={{mt:2}}variant="body1" color="white" gutterBottom>
          Contact d&apos;urgence
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Grid2 container spacing={2}>
          <Grid2 size={4}>
              <TextField
                id="outlined-search"
                label="Nom du Contact d'Urgence"
                type="search"
                variant="outlined"
                fullWidth
              />
          </Grid2>
          <Grid2 size={4}>
              <TextField
                id="outlined-search"
                label="Numéro de Téléphone d'Urgence"
                type="search"
                variant="outlined"
                fullWidth
              />
          </Grid2>
        </Grid2>
          <Typography sx={{mt:2}}variant="body1" color="white" gutterBottom>
          Position
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Grid2 container spacing={2}>
          <Grid2 size={4}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Role</InputLabel>
                <Select label="Role" defaultValue="" name="role">
                  <MenuItem value="Admin">Admin</MenuItem>
                  <MenuItem value="Manager">Manager</MenuItem>
                  <MenuItem value="Manager">Employé</MenuItem>
                </Select>
              </FormControl>
          </Grid2>
          <Grid2 size={4}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Département</InputLabel>
                  <Select
                    label="Département"
                    defaultValue=""
                    name="departement"
                    onChange={handleInputChange}
                  >
                    {departments.map((dept) => (
                      <MenuItem key={dept.id} value={dept.id}>
                        {dept.nom}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid2>
              <Grid2 size={4}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Service</InputLabel>
                  <Select
                    label="Service"
                    defaultValue=""
                    name="service"
                    onChange={handleInputChange}
                  >
                    {services
                      .filter((service) => service.departement === newEmployee.departement)
                      .map((service) => (
                        <MenuItem key={service.id} value={service.id}>
                          {service.nom}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </Grid2>
          </Grid2>
          <Typography sx={{mt:2}}variant="body1" color="white" gutterBottom>
          Information Banquaire
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Grid2 container spacing={2}>
          <Grid2 size={4}>
              <TextField
                id="outlined-search"
                label="Compte bancaire"
                type="search"
                variant="outlined"
                fullWidth
              />
          </Grid2>
          <Grid2 size={4}>
              <TextField
                id="outlined-search"
                label="RIB bancaire"
                type="search"
                variant="outlined"
                fullWidth
              />
          </Grid2>
          </Grid2>
          </Box>


          <Box mt={3} display="flex" justifyContent="space-between">
            <Button variant="outlined" onClick={() => setNewEmployee({})}>
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
        pageSize={5}
        checkboxSelection
      />
    </Container>
  );
}