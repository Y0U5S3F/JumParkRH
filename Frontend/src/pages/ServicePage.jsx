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
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  updateService,
  addService,
  fetchServices,
  deleteService,
} from "../service/ServiceService";
import { fetchDepartements } from "../service/DepartementService";
import EditIcon from "@mui/icons-material/Edit";
import Departement from "../models/departement";
import Service from "../models/service";
import AddIcon from "@mui/icons-material/Add";
import { Business } from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";
import ThemeToggle from "../components/ThemeToggle";

const useStyles = makeStyles((theme) => ({
  container: {
    padding: "20px",
    display: "flex",
    flexDirection: "column",
  },
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
  contentContainer: {
    flex: 1,
    overflowY: "auto",
    paddingRight: "10px",
    scrollbarWidth: "none",
    "&::-webkit-scrollbar": {
      display: "none",
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
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState(null);
  const [newService, setNewService] = useState(new Service("", ""));
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
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [refresh]);

  const handleEdit = (service) => {
    // Find the department ID based on the department name
    const department = departements.find(
      (dept) => dept.nom === service.departement
    );

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
      // Use the deleteService function from ServiceService.js
      await deleteService(id);

      // Handle success
      setSnackbar({
        open: true,
        severity: "success",
        message: "Service supprimé avec succès!",
      });
      setRefresh((prev) => prev + 1);
    } catch (error) {
      // Handle error
      setSnackbar({
        open: true,
        severity: "error",
        message: "Erreur lors de la suppression du service.",
      });
    } finally {
      setOpenDeleteDialog(false); // Close the delete confirmation dialog
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

      // Use the addService function from ServiceService.js
      const response = await addService(serviceToSend);

      // Handle success
      setSnackbar({
        open: true,
        severity: "success",
        message: "Service ajouté avec succès !",
      });
      setOpen(false); // Close modal
      setNewService({ nom: "", departement: "" }); // Reset form
      setRefresh((prev) => !prev); // Refresh service list
    } catch (error) {
      // Handle error
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
    { field: "id", headerName: "id", flex: 1, minWidth: 50 },
    { field: "nom", headerName: "Nom", flex: 2, minWidth: 150 },
    { field: "departement", headerName: "Departement", flex: 1, minWidth: 100 },
    {
      field: "actions",
      headerName: "Actions",
      flex: 0.5,
      minWidth: 100, // Ensure the Actions column is always fully visible
      renderCell: (params) => (
        <div style={{ display: "flex" }}>
          <IconButton onClick={() => handleEdit(params.row)}>
            <EditIcon />
          </IconButton>
          <IconButton
            onClick={() => {
              setServiceToDelete(params.row.id);
              setOpenDeleteDialog(true);
            }}
          >
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
            Ajouter Service
          </Button>
          <ThemeToggle></ThemeToggle>
        </Box>
      </Box>

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
              Ajouter service
            </Typography>
            <CloseIcon
              onClick={() => setOpen(false)}
              
            />
          </Box>
          <Box className={classes.contentContainer}>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  id="outlined-search"
                  label="Nom"
                  required
                  type="search"
                  variant="outlined"
                  name="nom"
                  value={newService.nom}
                  onChange={handleInputChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl required fullWidth variant="outlined">
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
              Modifier service
            </Typography>
            <CloseIcon
              onClick={() => setOpenEditModal(false)}
              
            />
          </Box>
          <Box className={classes.contentContainer}>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  id="outlined-search"
                  label="Nom"
                  required
                  type="search"
                  variant="outlined"
                  name="nom"
                  value={editService.nom}
                  onChange={handleInputModifyChange}
                  fullWidth
                  margin="dense"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl
                  required
                  margin="dense"
                  fullWidth
                  variant="outlined"
                >
                  <InputLabel>Département</InputLabel>
                  <Select
                    label="Département"
                    name="departement"
                    value={editService.departement}
                    required
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

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Êtes-vous sûr de vouloir supprimer ce service ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)} color="primary">
            Annuler
          </Button>
          <Button
            onClick={() => handleDelete(serviceToDelete)}
            color="primary"
            autoFocus
          >
            Oui
          </Button>
        </DialogActions>
      </Dialog>

      <DataGrid
        apiRef={apiRef}
        rows={services}
        hideScrollbar={true}
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