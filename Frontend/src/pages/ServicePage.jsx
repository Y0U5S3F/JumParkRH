import React, { useEffect, useState } from "react";
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
import { updateService } from "../service/ServiceService";
import { fetchDepartements } from "../service/DepartementService";
import { fetchServices } from "../service/ServiceService";
import EditIcon from "@mui/icons-material/Edit";
import Departement from "../models/departement";
import Service from "../models/service";
import AddIcon from '@mui/icons-material/Add';
import { Business} from "@mui/icons-material";

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
  titleContainer: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    fontWeight: "bold",
  },
}));

export default function ServicePage() {
  const [departements, setDepartements] = useState([]);
  const [editService, setEditService] = useState(new Service("", ""));
  const [openEditModal, setOpenEditModal] = useState(false);
  const [services, setServices] = useState([]);
  const [open, setOpen] = useState(false);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [newDepartment, setNewDepartment] = useState(new Departement("", ""));
  const [newService, setNewService] = useState(new Service("", ""));
  const [selectedService, setSelectedService] = useState(null);
  const [expand, setExpand] = useState(DEFAULT_GRID_AUTOSIZE_OPTIONS.expand);
  const apiRef = useGridApiRef();
  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: "",
    message: "",
  });
  const [refresh, setRefresh] = useState(0); // State to trigger re-fetch
  const [loading, setLoading] = useState(true);

  const classes = useStyles();
  const [pageTitle, setPageTitle] = useState("Service");

  useEffect(() => {
    document.title = pageTitle; // Update the document title
  }, [pageTitle]);
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch all necessary data in parallel
        const [servicesData, departmentsData] = await Promise.all([
          fetchServices(),
          fetchDepartements(),
        ]);

        // Map departments to an object for quick lookup
        const departmentMap = departmentsData.reduce((acc, dept) => {
          acc[dept.id] = dept.nom; // Store department name by ID
          return acc;
        }, {});

        // Process services to replace department ID with name
        const formattedServices = servicesData.map((service) => ({
          ...service,
          departement: departmentMap[service.departement] || "N/A", // Get name from map
        }));

        setServices(formattedServices);
        setDepartements(departmentsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [refresh]);

  const handleView = (service) => {
    setSelectedService(service);
    setOpenViewModal(true);
  };

  const handleEdit = (service) => {
    // Find the department ID based on the department name
    const department = departements.find((dept) => dept.nom === service.departement);

    // Create a new service object with updated departement_id
    const updatedService = {
      ...service,
      departement: department ? department.id : "", // Set department ID
    };

    setEditService(updatedService);
    setOpenEditModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewService((prev) => ({ ...prev, [name]: value }));
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/service/services/${id}/`);
      console.log("Deleted service with id:", id);
      setServices((prev) => prev.filter((service) => service.id !== id));
    } catch (error) {
      console.error("Error deleting service:", error);
    }
  };

  const handleAddService = async () => {
    try {
      if (!newService.nom.trim() || !newService.departement) {
        setSnackbar({
          open: true,
          severity: "error",
          message: "Le nom du service et le département sont requis.",
        });
        return;
      }

      // Create service object
      const serviceToSend = {
        nom: newService.nom,
        departement: newService.departement, // Send department ID
      };

      // Send POST request
      const response = await axios.post(
        "http://127.0.0.1:8000/api/service/services/",
        serviceToSend
      );

      if (response.status === 201) {
        setSnackbar({
          open: true,
          severity: "success",
          message: "Service ajouté avec succès !",
        });
        setOpen(false); // Close modal
        setNewService({ nom: "", departement: "" }); // Reset form
        setRefresh((prev) => !prev); // Refresh service list
      } else {
        setSnackbar({
          open: true,
          severity: "error",
          message: "Échec de l'ajout du service.",
        });
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout du service:", error);
      setSnackbar({
        open: true,
        severity: "error",
        message: "Erreur serveur. Veuillez réessayer.",
      });
    }
  };

  const handleUpdateService = async (e) => {
    e.preventDefault();
    try {
      await updateService(editService.id, editService);
      setSnackbar({
        open: true,
        severity: "success",
        message: "Service mis à jour avec succès!",
      });

      setServices((prev) =>
        prev.map((srv) => (srv.id === editService.id ? editService : srv))
      );

      setOpenEditModal(false);
      setRefresh((prev) => !prev);
    } catch (error) {
      setSnackbar({
        open: true,
        severity: "error",
        message: `Échec de la mise à jour du service.${error}`,
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleInputModifyChange = (e) => {
    const { name, value } = e.target;

    setEditService((prev) => ({
      ...prev,
      [name]: name === "departement" ? parseInt(value) : value, // Ensure department is stored as an ID
    }));
  };

  const columns = [
    { field: "id", headerName: "id", flex: 1 },
    { field: "nom", headerName: "Nom", flex: 2 },
    { field: "departement", headerName: "Departement", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      flex: 0.4,
      renderCell: (params) => (
        <div style={{ display: "flex" }}>
          <IconButton onClick={() => handleEdit(params.row)}>
            <EditIcon /> {/* Add Edit icon */}
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
        <Box className={classes.titleContainer}>
          <Business />
          <Typography variant="h6" fontWeight="bold">
            Services
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
          Ajouter Service
        </Button>
      </Box>

      {/* Edit modal */}
      <Modal open={openEditModal} onClose={() => setOpenEditModal(false)}>
        <Box className={classes.modalStyle}>
          <Typography variant="h6" gutterBottom>
            Veuillez modifier les coordonnées de vos personnels
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
                  value={editService.nom}
                  onChange={handleInputModifyChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={4}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Département</InputLabel>
                  <Select
                    label="Département"
                    name="departement"
                    value={editService.departement}
                    onChange={handleInputModifyChange}
                  >
                    {departements.map((dept) => (
                      <MenuItem key={dept.id} value={dept.id}>
                        {dept.nom}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>
          <Box mt={3} display="flex" justifyContent="space-between">
            <Button
              variant="outlined"
              onClick={() => setEditService(new Service("", ""))}
            >
              Réinitialiser
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleUpdateService}
            >
              Enregistrer
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Add Modal */}
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
                  value={newService.nom}
                  onChange={handleInputChange}
                  fullWidth
                />
              </Grid>

              <Grid item xs={4}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Département</InputLabel>
                  <Select
                    label="Département"
                    name="departement"
                    value={newService.departement}
                    onChange={handleInputChange}
                  >
                    {departements.map((dept) => (
                      <MenuItem key={dept.id} value={dept.id}>
                        {dept.nom}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>
          <Box mt={3} display="flex" justifyContent="space-between">
            <Button
              variant="outlined"
              onClick={() => setNewService(new Service("", ""))}
            >
              Réinitialiser
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddService}
            >
              Enregistrer
            </Button>
          </Box>
        </Box>
      </Modal>

      <DataGrid
        apiRef={apiRef}
        rows={services}
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