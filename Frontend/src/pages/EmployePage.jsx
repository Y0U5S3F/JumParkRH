import { useEffect, useState } from "react";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Employe from "../models/employe";
import {
  DataGrid,
  useGridApiRef,
  DEFAULT_GRID_AUTOSIZE_OPTIONS,
} from "@mui/x-data-grid";
import CloseIcon from "@mui/icons-material/Close";
import ChatBot from "../components/ChatBot"; // Import ChatBot component
import { People } from "@mui/icons-material";
import { ThemeToggle } from "../components/ThemeToggle"; // Import as named export

import {
  Dialog,
  DialogContent,
  DialogContentText,
  DialogActions,
  DialogTitle,
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
import AddIcon from "@mui/icons-material/Add";
import GetApp from "@mui/icons-material/GetApp";
import { makeStyles } from "@mui/styles";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
  fetchEmployes,
  deleteEmployee,
  addEmployee,
  updateEmployee,
  DownloadPresence,
} from "../service/EmployeService";
import { fetchDepartements } from "../service/DepartementService";
import { fetchServices } from "../service/ServiceService";
const useStyles = makeStyles((theme) => ({
  container: { padding: "20px", display: "flex", flexDirection: "column" },
  topBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "10px",
    padding: "5px",
  },
  modalStyle: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "70%", // Use percentage for dynamic width
    height: "auto", // Allow height to adjust dynamically
    maxHeight: "70%", // Limit the height to 90% of the viewport
    backgroundColor: `${theme.palette.background.default}`,
    boxShadow: 24,
    padding: "20px",
    border: `1px solid ${theme.palette.primary.main}`,
    borderRadius: "8px",
    display: "flex",
    flexDirection: "column",
  },
  PresenceModalStyle: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400, // Adjust the width
    maxWidth: "90%", // Ensure it doesn't exceed the viewport width
    height: "auto", // Let the height adjust based on content
    maxHeight: "90%", // Ensure it doesn't exceed the viewport height
    backgroundColor: `${theme.palette.background.default}`,
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
  titleContainer: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    fontWeight: "bold",
  },
}));

export default function EmployePage() {
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  const [employees, setEmployees] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [editEmployee, setEditEmployee] = useState(new Employe());
  const [departments, setDepartments] = useState([]);
  const [services, setServices] = useState([]);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);
  const [expand, setExpand] = useState(DEFAULT_GRID_AUTOSIZE_OPTIONS.expand);
  const apiRef = useGridApiRef();
  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: "",
    message: "",
  });
  const [refresh, setRefresh] = useState(0); // State to trigger re-fetch
  const classes = useStyles();
  const [showPassword, setShowPassword] = useState(false);
  const [newEmployee, setNewEmployee] = useState(new Employe());
  const [openPresenceModal, setOpenPresenceModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(dayjs()); // Default to current date

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEmployee((prev) => ({ ...prev, [name]: value }));
  };

  const handleInputModifyChange = (e) => {
    const { name, value } = e.target;
    setEditEmployee((prev) => ({ ...prev, [name]: value }));
  };

  const [pageTitle, setPageTitle] = useState("Personnel");

  useEffect(() => {
    document.title = pageTitle; // Update the document title
  }, [pageTitle]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [employeesData, departmentsData, servicesData] =
          await Promise.all([
            fetchEmployes(),
            fetchDepartements(),
            fetchServices(),
          ]);

        setEmployees(employeesData);
        setDepartments(departmentsData);
        setServices(servicesData);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [refresh]);

  const handleDelete = async (matricule) => {
    try {
      await deleteEmployee(matricule); // Call the service
      setEmployees((prev) =>
        prev.filter((employee) => employee.matricule !== matricule)
      );
    } catch (error) {
    }
  };

  const handleOpenDeleteDialog = (employee) => {
    setEmployeeToDelete(employee);
    setOpenDeleteDialog(true);
  };

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setEmployeeToDelete(null);
  };

  const handleAddEmployee = async () => {
    const requiredFields = [
      "matricule",
      "nom",
      "prenom",
      "email",
      "role",
      "genre",
      "situation_familiale",
      "cin",
      "telephone",
      "contact_urgence_nom",
      "contact_urgence_telephone",
      "salaire_base",
      "departement_id",
      "service_id",
    ];
  
    // Check for missing fields
    const missingFields = requiredFields.filter((field) => !newEmployee[field]);
  
    if (missingFields.length > 0) {
      // Show snackbar with a message in French
      setSnackbar({
        open: true,
        severity: "error",
        message: "Veuillez remplir tous les champs obligatoires.",
      });
      return;
    }
    try {
      
      const employeeToSend = new Employe(
        newEmployee.matricule,
        newEmployee.nom,
        newEmployee.prenom,
        newEmployee.email,
        newEmployee.password,
        newEmployee.date_naissance,
        newEmployee.lieu_naissance,
        newEmployee.nationalite,
        newEmployee.genre,
        newEmployee.situation_familiale,
        newEmployee.cin,
        newEmployee.uid,
        newEmployee.telephone,
        newEmployee.adresse,
        newEmployee.ville,
        newEmployee.code_postal,
        newEmployee.contact_urgence_nom,
        newEmployee.contact_urgence_telephone,
        newEmployee.role,
        newEmployee.departement_id,
        newEmployee.service_id,
        newEmployee.salaire_base,
        newEmployee.cnss,
        newEmployee.compte_bancaire,
        newEmployee.rib_bancaire
      );
      const response = await addEmployee(employeeToSend);

      if (response.status === 201) {
        setSnackbar({
          open: true,
          severity: "success",
          message: "Employee added successfully!",
        });
        setRefresh((prev) => prev + 1);
      } else {
        setSnackbar({
          open: true,
          severity: "error",
          message: "Failed to add employee.",
        });
      }

      setOpen(false);
      setNewEmployee(
        new Employe(
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          ""
        )
      );
    } catch (error) {
      setSnackbar({
        open: true,
        severity: "error",
        message: "Error adding employee.",
      });
    }
  };

  const handleUpdateEmployee = async (e) => {
    e.preventDefault();
    try {
      await updateEmployee(editEmployee.matricule, editEmployee);
      setSnackbar({
        open: true,
        severity: "success",
        message: "Employé mis à jour avec succès!",
      });
      setEmployees((prev) =>
        prev.map((emp) =>
          emp.matricule === editEmployee.matricule ? editEmployee : emp
        )
      );
      setOpenEditModal(false);
      setRefresh((prev) => prev + 1);
    } catch (error) {
      setSnackbar({
        open: true,
        severity: { error },
        message: "Échec de la mise à jour de l'employé.",
      });
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteEmployee(employeeToDelete.matricule); // Call the service
      setEmployees((prev) =>
        prev.filter(
          (employee) => employee.matricule !== employeeToDelete.matricule
        )
      );
      setSnackbar({
        open: true,
        severity: "success",
        message: "Employé supprimé avec succès!",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        severity: "error",
        message: "Erreur lors de la suppression de l'employé.",
      });
      setRefresh((prev) => prev + 1);
    } finally {
      handleCloseDeleteDialog();
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleView = (employee) => {
    setSelectedEmployee(employee);
    setOpenViewModal(true);
  };

  const handleDownloadPresence = async () => {
    try {
      const reportMonth = selectedDate.format("MM");
      const reportYear = selectedDate.format("YYYY");
      await DownloadPresence(reportYear, reportMonth);
      setOpenPresenceModal(false);
    } catch (error) {
    }
  };

  const handleEdit = (employee) => {
    // Find the department ID based on the department name
    const department = departments.find(
      (dept) => dept.nom === employee.departement
    );
    const service = services.find((srv) => srv.nom === employee.service);

    // Create a new employee object with updated departement_id and service_id
    const updatedEmployee = {
      ...employee,
      departement_id: department ? department.id : "", // Set department ID
      service_id: service ? service.id : "", // Set service ID
    };

    // Remove the departement and service fields
    delete updatedEmployee.departement;
    delete updatedEmployee.service;

    // Set the new employee data with the IDs
    setEditEmployee(updatedEmployee);

    setOpenEditModal(true); // Open the edit modal
  };

  const columns = [
    { field: "matricule", headerName: "Matricule", flex: 1, minWidth: 100 },
    { field: "nom", headerName: "Nom", flex: 1, minWidth: 100 },
    { field: "prenom", headerName: "Prénom", flex: 1, minWidth: 100 },
    { field: "email", headerName: "Email", flex: 2, minWidth: 150 }, // Email might be longer
    { field: "role", headerName: "Role", flex: 1, minWidth: 100 },
    { field: "departement", headerName: "Département", flex: 1, minWidth: 100 },
    { field: "service", headerName: "Service", flex: 1, minWidth: 100 },
    {
      field: "actions",
      headerName: "Actions",
      flex: 0.5, // Ensure it takes less space but remains visible
      minWidth: 150, // Set a minimum width to ensure it is always fully visible
      renderCell: (params) => (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <IconButton onClick={() => handleView(params.row)}>
            <VisibilityIcon />
          </IconButton>
          <IconButton onClick={() => handleEdit(params.row)}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleOpenDeleteDialog(params.row)}>
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
          <People />
          <Typography variant="h6" fontWeight="bold">
            Personnel
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <Button
            size="medium"
            variant="outlined"
            startIcon={<GetApp />}
            sx={{
              "&:hover": {
                backgroundColor: (theme) => theme.palette.primary.main,
                color: "white",
                borderColor: (theme) => theme.palette.primary.main,
              },
            }}
            onClick={() => setOpenPresenceModal(true)} // Open the modal
          >
            Télécharger Presence
          </Button>
          <Button
            size="medium"
            variant="outlined"
            startIcon={<AddIcon />}
            sx={{
              "&:hover": {
                backgroundColor: (theme) => theme.palette.primary.main,
                color: "white",
                borderColor: (theme) => theme.palette.primary.main,
              },
            }}
            onClick={() => setOpen(true)}
          >
            Ajouter Employé
          </Button>
          <ThemeToggle />
        </Box>
      </Box>
      {/* Modal for Month and Year Selection */}
      <Modal
        open={openPresenceModal}
        onClose={() => setOpenPresenceModal(false)}
      >
        <Box className={classes.modalStyle}>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography
              variant="h6"
              fontWeight="bold"
              sx={{ mb: 3 }}
              gutterBottom
            >
              Sélectionner le Mois et l'Année
            </Typography>
            <CloseIcon
              onClick={() => setOpenPresenceModal(false)}
              
            />
          </Box>
                    <Divider sx={{ mb: 2 }} />
          
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              views={["year", "month"]} // Restrict to year and month selection
              label="Mois et Année"
              value={selectedDate}
              onChange={(newValue) => setSelectedDate(newValue)}
              sx={{ width: "100%" }}
            />
          </LocalizationProvider>
          <Box display="flex" justifyContent="space-between" mt={2}>
            <Button variant="outlined" onClick={() => setSelectedDate(null)}>
              Réinitialiser
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleDownloadPresence}
            >
              Télécharger
            </Button>
          </Box>
        </Box>
      </Modal>
      {/* View Modal */}
      <Modal open={openViewModal} onClose={() => setOpenViewModal(false)}>
        <Box className={classes.modalStyle}>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography
              variant="h5"
              fontWeight="bold"
              sx={{ mb: 3 }}
              gutterBottom
            >
              Détails de l'employé
            </Typography>
            <CloseIcon
              onClick={() => setOpen(false)}
              
            />
          </Box>
          {selectedEmployee && (
            <Box className={classes.contentContainer}>
              <Typography
                variant="body1"
                sx={{ color: (theme) => theme.palette.primary.main }}
                fontWeight={600}
                gutterBottom
              >
                Informations personnelles
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={4}>
                  <Typography variant="subtitle1">
                    <strong>Matricule:</strong> {selectedEmployee.matricule}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Typography variant="subtitle1">
                    <strong>Nom:</strong> {selectedEmployee.nom}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Typography variant="subtitle1">
                    <strong>Prénom:</strong> {selectedEmployee.prenom}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Typography variant="subtitle1">
                    <strong>Email:</strong> {selectedEmployee.email}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Typography variant="subtitle1">
                    <strong>Date de naissaince:</strong>{" "}
                    {selectedEmployee.date_de_naissance}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Typography variant="subtitle1">
                    <strong>Lieu de naissaince:</strong>{" "}
                    {selectedEmployee.lieu_de_naissance}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Typography variant="subtitle1">
                    <strong>Nationalite:</strong> {selectedEmployee.nationalite}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Typography variant="subtitle1">
                    <strong>Genre légal:</strong> {selectedEmployee.genre_legal}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Typography variant="subtitle1">
                    <strong>Situation familiale:</strong>{" "}
                    {selectedEmployee.situation_familiale}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Typography variant="subtitle1">
                    <strong>CIN:</strong> {selectedEmployee.CIN}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Typography variant="subtitle1">
                    <strong>ID de Pointage:</strong> {selectedEmployee.uid}
                  </Typography>
                </Grid>
              </Grid>
              <Box sx={{ mt: 2 }}>
                <Typography
                  variant="body1"
                  sx={{ color: (theme) => theme.palette.primary.main }}
                  fontWeight={600}
                  color="white"
                  gutterBottom
                >
                  Informations personnelles
                </Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />

              <Grid container sx={{}} spacing={2}>
                <Grid item xs={12} sm={6} md={4}>
                  <Typography variant="subtitle1">
                    <strong>Numero de telephone:</strong>{" "}
                    {selectedEmployee.num_telephone}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Typography variant="subtitle1">
                    <strong>Adresse:</strong> {selectedEmployee.adresse}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Typography variant="subtitle1">
                    <strong>Ville:</strong> {selectedEmployee.ville}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Typography variant="subtitle1">
                    <strong>Code Postal:</strong> {selectedEmployee.code_postal}
                  </Typography>
                </Grid>
              </Grid>

              <Box sx={{ mt: 2 }}>
                <Typography
                  sx={{ color: (theme) => theme.palette.primary.main }}
                  variant="body1"
                  fontWeight={600}
                  color="white"
                  gutterBottom
                >
                  Contact D'urgence
                </Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />

              <Grid container sx={{}} spacing={2}>
                <Grid item xs={12} sm={6} md={4}>
                  <Typography variant="subtitle1">
                    <strong>Nom:</strong> {selectedEmployee.nom_urgence}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Typography variant="subtitle1">
                    <strong>Numero:</strong>{" "}
                    {selectedEmployee.num_telephone_urgence}
                  </Typography>
                </Grid>
              </Grid>
              <Box sx={{ mt: 2 }}>
                <Typography
                  variant="body1"
                  sx={{ color: (theme) => theme.palette.primary.main }}
                  fontWeight={600}
                  gutterBottom
                >
                  Position
                </Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              <Grid container sx={{}} spacing={2}>
                <Grid item xs={12} sm={6} md={4}>
                  <Typography variant="subtitle1">
                    <strong>Rôle:</strong> {selectedEmployee.role}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Typography variant="subtitle1">
                    <strong>Departement:</strong> {selectedEmployee.departement}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Typography variant="subtitle1">
                    <strong>Service:</strong> {selectedEmployee.service}
                  </Typography>
                </Grid>
              </Grid>
              <Box sx={{ mt: 2 }}>
                <Typography
                  sx={{ color: (theme) => theme.palette.primary.main }}
                  variant="body1"
                  fontWeight={600}
                  gutterBottom
                >
                  Informations Banquaire
                </Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />

              <Grid container sx={{}} spacing={2}>
                <Grid item xs={12} sm={6} md={4}>
                  <Typography variant="subtitle1">
                    <strong>Salaire de base:</strong>{" "}
                    {selectedEmployee.salaire_base}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Typography variant="subtitle1">
                    <strong>Numero CNSS:</strong> {selectedEmployee.cnss}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Typography variant="subtitle1">
                    <strong>Compte Bancaire:</strong>{" "}
                    {selectedEmployee.compte_bancaire}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Typography variant="subtitle1">
                    <strong>RIB Bancaire:</strong>{" "}
                    {selectedEmployee.rib_bancaire}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          )}
        </Box>
      </Modal>
      {/* Add Modal */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box className={classes.modalStyle}>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography
              variant="h5"
              fontWeight="bold"
              sx={{ mb: 3 }}
              gutterBottom
            >
              Ajouter en employé
            </Typography>
            <CloseIcon
              onClick={() => setOpen(false)}
              
            />
          </Box>
          <Box className={classes.contentContainer}>
            <Typography variant="body1" fontWeight={600} gutterBottom>
              Informations d'identité
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  id="outlined-search"
                  required
                  label="Matricule"
                  type="search"
                  variant="outlined"
                  name="matricule"
                  value={newEmployee.matricule}
                  onChange={handleInputChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  id="outlined-search"
                  label="Nom"
                  required
                  type="search"
                  variant="outlined"
                  name="nom"
                  value={newEmployee.nom}
                  onChange={handleInputChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  id="outlined-search"
                  label="Prenom"
                  type="search"
                  required
                  name="prenom"
                  value={newEmployee.prenom}
                  onChange={handleInputChange}
                  variant="outlined"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  id="outlined-search"
                  label="Email"
                  type="search"
                  required
                  variant="outlined"
                  name="email"
                  value={newEmployee.email}
                  onChange={handleInputChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  id="outlined-password"
                  label="Mot de passe"
                  type={showPassword ? "text" : "password"} // Toggle between text and password
                  variant="outlined"
                  name="password"
                  value={newEmployee.password}
                  onChange={handleInputChange}
                  fullWidth
                  InputProps={{
                    endAdornment: (
                      <IconButton
                        onClick={() => setShowPassword((prev) => !prev)} // Toggle visibility
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    sx={{ width: "100%" }}
                    label="Date de naissance"
                    value={
                      newEmployee.date_naissance
                        ? dayjs(newEmployee.date_naissance)
                        : null
                    }
                    onChange={(date) =>
                      handleInputChange({
                        target: {
                          name: "date_naissance",
                          value: date?.format("YYYY-MM-DD"),
                        },
                      })
                    }
                    format="DD/MM/YYYY" // Set the desired format

                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
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
              <Grid item xs={12} sm={6} md={4}>
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
              <Grid item xs={12} sm={6} md={4}>
                <FormControl fullWidth required variant="outlined">
                  <InputLabel>Genre légal</InputLabel>
                  <Select
                    label="Genre légal"
                    value={newEmployee.genre}
                    onChange={handleInputChange}
                    name="genre"
                  >
                    <MenuItem value="Homme">Homme</MenuItem>
                    <MenuItem value="Femme">Femme</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <FormControl fullWidth required variant="outlined">
                  <InputLabel>Situation familiale</InputLabel>
                  <Select
                    label="Situation familiale"
                    value={newEmployee.situation_familiale}
                    onChange={handleInputChange}
                    name="situation_familiale"
                  >
                    <MenuItem value="Celibataire">Célibataire</MenuItem>
                    <MenuItem value="Marie">Marié(e)</MenuItem>
                    <MenuItem value="Divorce">Divorcé(e)</MenuItem>
                    <MenuItem value="Veuf">Veuf(ve)</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  variant="outlined"
                  label="CIN"
                  name="cin"
                  required
                  value={newEmployee.cin}
                  onChange={handleInputChange}
                  inputProps={{ maxLength: 8 }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  variant="outlined"
                  label="ID de Pointage"
                  name="uid"
                  value={newEmployee.uid}
                  onChange={handleInputChange}
                  inputProps={{ maxLength: 8 }}
                />
              </Grid>
            </Grid>
            <Typography
              variant="body1"
              fontWeight={600}
              sx={{ pt: 2 }}
              gutterBottom
            >
              Coordonnées personnelles
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  id="outlined-search"
                  label="Numero de telephone"
                  required
                  type="search"
                  name="telephone"
                  value={newEmployee.telephone}
                  onChange={handleInputChange}
                  variant="outlined"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
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
              <Grid item xs={12} sm={6} md={4}>
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
              <Grid item xs={12} sm={6} md={4}>
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
            <Typography
              sx={{ mt: 2 }}
              variant="body1"
              fontWeight={600}
              gutterBottom
            >
              Contact d&apos;urgence
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  id="outlined-search"
                  label="Nom du Contact d'Urgence"
                  name="contact_urgence_nom"
                  required
                  value={newEmployee.contact_urgence_nom}
                  onChange={handleInputChange}
                  type="search"
                  variant="outlined"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  id="outlined-search"
                  required
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
            <Typography
              sx={{ mt: 2 }}
              variant="body1"
              fontWeight={600}
              gutterBottom
            >
              Informations professionnelles
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={4}>
                <FormControl required fullWidth variant="outlined">
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
              <Grid item xs={12} sm={6} md={4}>
                <FormControl required fullWidth variant="outlined">
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
              <Grid item xs={12} sm={6} md={4}>
                <FormControl required fullWidth variant="outlined">
                  <InputLabel>Service</InputLabel>
                  <Select
                    label="Service"
                    name="service_id"
                    value={newEmployee.service_id}
                    onChange={handleInputChange}
                  >
                    {services
                      .filter(
                        (service) =>
                          service.departement === newEmployee.departement_id
                      )
                      .map((service) => (
                        <MenuItem key={service.id} value={service.id}>
                          {service.nom}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <Typography
              sx={{ mt: 2 }}
              variant="body1"

                      
              fontWeight={600}
              gutterBottom
            >
              Informations bancaires
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  id="outlined-search"
                  label="Salaire de base"
                  name="salaire_base"
                  required
                  type="search"
                  variant="outlined"
                  value={newEmployee.salaire_base}
                  onChange={handleInputChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  id="outlined-search"
                  label="Numero CNSS"
                  name="cnss"
                  type="search"
                  variant="outlined"
                  value={newEmployee.cnss}
                  onChange={handleInputChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
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
              <Grid item xs={12} sm={6} md={4}>
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
            <Button
              variant="outlined"
              onClick={() => setNewEmployee(new Employe())}
            >
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
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Êtes-vous sûr de vouloir supprimer cet employé ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">
            Annuler
          </Button>
          <Button onClick={handleConfirmDelete} color="primary" autoFocus>
            Oui
          </Button>
        </DialogActions>
      </Dialog>
      {/* Edit Modal */}
      <Modal open={openEditModal} onClose={() => setOpenEditModal(false)}>
        <Box className={classes.modalStyle}>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography
              variant="h5"
              fontWeight="bold"
              sx={{ mb: 3 }}
              gutterBottom
            >
              Modifier Personnel
            </Typography>
            <CloseIcon
              onClick={() => setOpen(false)}
              
            />
          </Box>
          <Box className={classes.contentContainer}>
            <Typography variant="body1" fontWeight={600} gutterBottom>
            Informations d'identité
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  id="outlined-search"
                  label="Matricule"
                  type="search"
                  variant="outlined"
                  name="matricule"
                  value={editEmployee.matricule}
                  onChange={handleInputModifyChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  id="outlined-search"
                  label="Nom"
                  type="search"
                  variant="outlined"
                  name="nom"
                  value={editEmployee.nom}
                  onChange={handleInputModifyChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  id="outlined-search"
                  label="Prenom"
                  type="search"
                  name="prenom"
                  value={editEmployee.prenom}
                  onChange={handleInputModifyChange}
                  variant="outlined"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  id="outlined-search"
                  label="Email"
                  type="search"
                  variant="outlined"
                  name="email"
                  value={editEmployee.email}
                  onChange={handleInputModifyChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
  <TextField
    id="outlined-password-edit"
    label="Mot de Passe"
    type={showPassword ? "text" : "password"} // Toggle between text and password
    variant="outlined"
    name="password"
    value={editEmployee.password}
    onChange={handleInputModifyChange}
    fullWidth
    InputProps={{
      endAdornment: (
        <IconButton
          onClick={() => setShowPassword((prev) => !prev)} // Toggle visibility
          edge="end"
        >
          {showPassword ? <VisibilityOff /> : <Visibility />}
        </IconButton>
      ),
    }}
  />
</Grid>
              <Grid item xs={12} sm={6} md={4}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    sx={{ width: "100%" }}
                    label="Date de naissance"
                    value={
                      editEmployee.date_de_naissance
                        ? dayjs(editEmployee.date_de_naissance)
                        : null
                    }
                    onChange={(date) =>
                      handleInputModifyChange({
                        target: {
                          name: "date_de_naissance",
                          value: date?.format("YYYY-MM-DD"),
                        },
                      })
                    }
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  id="outlined-search"
                  label="Lieu de naissance"
                  type="search"
                  name="lieu_de_naissance"
                  value={editEmployee.lieu_de_naissance}
                  onChange={handleInputModifyChange}
                  variant="outlined"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  id="outlined-search"
                  label="Nationalité"
                  type="search"
                  name="nationalite"
                  value={editEmployee.nationalite}
                  onChange={handleInputModifyChange}
                  variant="outlined"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <FormControl fullWidth required variant="outlined">
                  <InputLabel>Genre légal</InputLabel>
                  <Select
                    label="Genre légal"
                    value={editEmployee.genre_legal}
                    onChange={handleInputModifyChange}
                    name="genre_legal"
                  >
                    <MenuItem value="Homme">Homme</MenuItem>
                    <MenuItem value="Femme">Femme</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <FormControl fullWidth required variant="outlined">
                  <InputLabel>Situation familiale</InputLabel>
                  <Select
                    label="Situation familiale"
                    value={editEmployee.situation_familiale}
                    onChange={handleInputModifyChange}
                    name="situation_familiale"
                  >
                    <MenuItem value="Celibataire">Célibataire</MenuItem>
                    <MenuItem value="Marie">Marié(e)</MenuItem>
                    <MenuItem value="Divorce">Divorcé(e)</MenuItem>
                    <MenuItem value="Veuf">Veuf(ve)</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  variant="outlined"
                  label="CIN"
                  name="CIN"
                  value={editEmployee.CIN}
                  onChange={handleInputModifyChange}
                  inputProps={{ maxLength: 8 }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  variant="outlined"
                  label="ID de Pointage"
                  name="uid"
                  value={editEmployee.uid}
                  onChange={handleInputModifyChange}
                  inputProps={{ maxLength: 8 }}
                />
              </Grid>
            </Grid>
            <Typography
              variant="body1"
              fontWeight={600}
              sx={{ pt: 2 }}
              gutterBottom
            >
              Coordonnées personnelles
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  id="outlined-search"
                  label="Numero de telephone"
                  type="search"
                  name="num_telephone"
                  value={editEmployee.num_telephone}
                  onChange={handleInputModifyChange}
                  variant="outlined"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  id="outlined-search"
                  label="Adresse"
                  type="search"
                  name="adresse"
                  value={editEmployee.adresse}
                  onChange={handleInputModifyChange}
                  variant="outlined"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  id="outlined-search"
                  label="Ville"
                  type="search"
                  name="ville"
                  value={editEmployee.ville}
                  onChange={handleInputModifyChange}
                  variant="outlined"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  id="outlined-search"
                  label="Code postal"
                  type="search"
                  name="code_postal"
                  value={editEmployee.code_postal}
                  onChange={handleInputModifyChange}
                  variant="outlined"
                  fullWidth
                />
              </Grid>
            </Grid>
            <Typography
              sx={{ mt: 2 }}
              variant="body1"
              gutterBottom
              fontWeight={600}
            >
              Contact d'urgence
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  id="outlined-search"
                  label="Nom du Contact d'Urgence"
                  name="nom_urgence"
                  value={editEmployee.nom_urgence}
                  onChange={handleInputModifyChange}
                  type="search"
                  variant="outlined"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  id="outlined-search"
                  label="Numéro de Téléphone d'Urgence"
                  name="num_telephone_urgence"
                  value={editEmployee.num_telephone_urgence}
                  onChange={handleInputModifyChange}
                  type="search"
                  variant="outlined"
                  fullWidth
                />
              </Grid>
            </Grid>
            <Typography
              sx={{ mt: 2 }}
              variant="body1"
              gutterBottom
              fontWeight={600}
            >
              Informations professionnelles
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={4}>
                <FormControl fullWidth required variant="outlined">
                  <InputLabel>Role</InputLabel>
                  <Select
                    label="Role"
                    value={editEmployee.role}
                    onChange={handleInputModifyChange}
                    name="role"
                  >
                    <MenuItem value="Admin">Admin</MenuItem>
                    <MenuItem value="Manager">Manager</MenuItem>
                    <MenuItem value="Employe">Employé</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <FormControl required fullWidth variant="outlined">
                  <InputLabel>Département</InputLabel>
                  <Select
                    label="Département"
                    name="departement_id"
                    value={editEmployee.departement_id}
                    onChange={handleInputModifyChange}
                  >
                    {departments.map((dept) => (
                      <MenuItem key={dept.id} value={dept.id}>
                        {dept.nom}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <FormControl required fullWidth variant="outlined">
                  <InputLabel>Service</InputLabel>
                  <Select
                    label="Service"
                    name="service_id"
                    value={editEmployee.service_id}
                    onChange={handleInputModifyChange}
                  >
                    {services
                      .filter(
                        (service) =>
                          service.departement === editEmployee.departement_id
                      )
                      .map((service) => (
                        <MenuItem key={service.id} value={service.id}>
                          {service.nom}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <Typography
              sx={{ mt: 2 }}
              variant="body1"
              fontWeight={600}
              gutterBottom
            >
Informations bancaires            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  id="outlined-search"
                  label="Salaire de base"
                  name="salaire_base"
                  type="search"
                  variant="outlined"
                  value={editEmployee.salaire_base}
                  onChange={handleInputModifyChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  id="outlined-search"
                  label="Numero CNSS"
                  name="cnss"
                  type="search"
                  variant="outlined"
                  value={editEmployee.cnss}
                  onChange={handleInputModifyChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  id="outlined-search"
                  label="Compte bancaire"
                  name="compte_bancaire"
                  value={editEmployee.compte_bancaire}
                  onChange={handleInputModifyChange}
                  type="search"
                  variant="outlined"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  id="outlined-search"
                  label="RIB bancaire"
                  name="rib_bancaire"
                  type="search"
                  variant="outlined"
                  value={editEmployee.rib_bancaire}
                  onChange={handleInputModifyChange}
                  fullWidth
                />
              </Grid>
            </Grid>
          </Box>
          <Box mt={3} display="flex" justifyContent="space-between">
            <Button
              variant="outlined"
              onClick={() => setEditEmployee(new Employe())}
            >
              Réinitialiser
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleUpdateEmployee}
            >
              Enregistrer
            </Button>
          </Box>
        </Box>
      </Modal>
      <DataGrid
        sx={{
          mt: "4px",
          
        }}
        apiRef={apiRef}
        rows={employees}
        columns={columns}
        checkboxSelection={false}
        disableRowSelectionOnClick={true}
        loading={loading}
        disableMultipleRowSelection={true}
        autosizeOptions={expand}
        pagination
        hideScrollbar={true}
        // autosizeOnMount

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
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
      <ChatBot /> {/* Add ChatBot */}
    </Container>
  );
}
