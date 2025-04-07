import React, { useEffect, useState } from "react";
import {
  fetchDepartements,
  addDepartment,
  updateDepartement,
  deleteDepartment,
} from "../service/DepartementService"; // Import services
import CloseIcon from "@mui/icons-material/Close";

import Departement from "../models/departement";
import {
  DataGrid,
  useGridApiRef,
  DEFAULT_GRID_AUTOSIZE_OPTIONS,
} from "@mui/x-data-grid";
import {
  Container,
  Button,
  TextField,
  Box,
  IconButton,
  Modal,
  Snackbar,
  Alert,
  Typography,
  Divider,
  Grid,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import Apartment from "@mui/icons-material/Apartment";
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
    maxHeight: "70%", // Limit the height to 90% of the viewpo
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

export default function Department() {
  const [departements, setDepartements] = useState([]);
  const [editDepartement, setEditDepartement] = useState(
    new Departement("", "")
  );
  const [open, setOpen] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [departmentToDelete, setDepartmentToDelete] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [loading, setLoading] = useState(true);
  const [expand, setExpand] = useState(DEFAULT_GRID_AUTOSIZE_OPTIONS.expand);
  const apiRef = useGridApiRef();
  const [newDepartment, setNewDepartment] = useState(new Departement("", ""));
  const [openViewModal, setOpenViewModal] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: "",
    message: "",
  });
  const [selectedDepartement, setSelectedDepartement] = useState(null);
  const classes = useStyles();
  const [pageTitle, setPageTitle] = useState("Département");

  useEffect(() => {
    document.title = pageTitle; // Update the document title
  }, [pageTitle]);

  useEffect(() => {
    // Fetch departments data using the service
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetchDepartements();
        const formattedDepartments = response.map(
          (dept) => new Departement(dept.id, dept.nom)
        );
        setDepartements(formattedDepartments);
      } catch (error) {
        console.error("Error fetching departments:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [refresh]);

  const handleView = (departement) => {
    setSelectedDepartement(departement);
    setOpenViewModal(true);
  };

  const handleEdit = (departement) => {
    setEditDepartement(departement);
    setOpenEditModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewDepartment((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateDepartement = async (e) => {
    e.preventDefault();
    try {
      await updateDepartement(editDepartement.id, editDepartement);
      setSnackbar({
        open: true,
        severity: "success",
        message: "Département mis à jour avec succès!",
      });
      setDepartements((prev) =>
        prev.map((dept) =>
          dept.id === editDepartement.id ? editDepartement : dept
        )
      );
      setOpenEditModal(false);
      setRefresh((prev) => !prev);
    } catch (error) {
      setSnackbar({
        open: true,
        severity: "error",
        message: "Échec de la mise à jour du département.",
      });
    }
  };

  const handleAddDepartment = async () => {
    try {
      if (!newDepartment.nom.trim()) {
        setSnackbar({
          open: true,
          severity: "error",
          message: "Le nom du département est requis.",
        });
        return;
      }
      // Send POST request using the service
      await addDepartment(newDepartment);
      setSnackbar({
        open: true,
        severity: "success",
        message: "Département ajouté avec succès!",
      });
      setOpen(false); // Close modal
      setNewDepartment(new Departement("", "")); // Reset form
      setRefresh((prev) => !prev); // Refresh department list
    } catch (error) {
      console.error("Erreur lors de l'ajout du département:", error);
      setSnackbar({
        open: true,
        severity: "error",
        message: "Erreur serveur. Veuillez réessayer.",
      });
    }
  };

  const handleInputModifyChange = (e) => {
    const { name, value } = e.target;
    setEditDepartement((prev) => ({ ...prev, [name]: value }));
  };

  const handleDelete = async (id) => {
    try {
      await deleteDepartment(id); // Use the service
      setSnackbar({
        open: true,
        severity: "success",
        message: "Département supprimé avec succès!",
      });
      setRefresh((prev) => !prev); // Trigger re-fetch
    } catch (error) {
      console.error("Error deleting department:", error);
      setSnackbar({
        open: true,
        severity: "error",
        message: "Échec de la suppression du département.",
      });
    }
    setOpenDeleteDialog(false);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const columns = [
    { field: "id", headerName: "ID", flex: 1, minWidth: 50 },
    { field: "nom", headerName: "Nom", flex: 6, minWidth: 150 },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1, // Ensure it takes enough space to remain visible
      minWidth: 100, // Set a minimum width to ensure it is always fully visible
      renderCell: (params) => (
        <div style={{ display: "flex", width: "100%" }}>
          <IconButton
            onClick={() => {
              setDepartmentToDelete(params.row.id);
              setOpenDeleteDialog(true);
            }}
          >
            <DeleteIcon />
          </IconButton>
          <IconButton onClick={() => handleEdit(params.row)}>
            <EditIcon />
          </IconButton>
        </div>
      ),
    },
  ];

  return (
    <Container className={classes.container}>
      <Box className={classes.topBar}>
        <Box className={classes.titleContainer}>
          <Apartment />
          <Typography variant="h6" fontWeight="bold">
            Départements
          </Typography>
        </Box>
        <Box sx={{display:"flex",flexDirection:"row",alignItems:"center",gap:"10px"}}>
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
          Ajouter Département
        </Button>
        <ThemeToggle></ThemeToggle>
        </Box>
      </Box>

      {/* Add Modal */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box className={classes.modalStyle}>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }} gutterBottom>
              Ajouter département
            </Typography>
            <CloseIcon
              onClick={() => setOpen(false)}
              sx={{
                "&:hover": {
                  backgroundColor: "rgba(0, 0, 0, 0.9)", // Transparent background
                  borderRadius: "50%", // Circular shape
                },
              }}
            />
          </Box>
          <Box className={classes.contentContainer}>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={12} >
                <TextField
                  id="outlined-search"
                  label="Nom"
                  type="search"
                  variant="outlined"
                  name="nom"
                  value={newDepartment.nom}
                  onChange={handleInputChange}
                  fullWidth
                />
              </Grid>
            </Grid>
          </Box>
          <Box mt={3} display="flex" justifyContent="space-between">
            <Button
              variant="outlined"
              onClick={() => setNewDepartment(new Departement("", ""))}
            >
              Réinitialiser
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddDepartment}
            >
              Enregistrer
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Update Modal */}
      <Modal open={openEditModal} onClose={() => setOpenEditModal(false)}>
        <Box className={classes.modalStyle}>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }} gutterBottom>
              Modifier département
            </Typography>
          </Box>
          <Divider sx={{ mb: 2 }} />
          <Box className={classes.contentContainer}>
            <Grid container spacing={2}>
              <Grid item xs={12} >
                <TextField
                  id="outlined-search"
                  label="Nom"
                  type="search"
                  variant="outlined"
                  name="nom"
                  value={editDepartement.nom}
                  onChange={handleInputModifyChange}
                  fullWidth
                  margin="dense"
                />
              </Grid>
            </Grid>
          </Box>
          <Box mt={3} display="flex" justifyContent="space-between">
            <Button
              variant="outlined"
              onClick={() => setEditDepartement(new Departement("", ""))}
            >
              Réinitialiser
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleUpdateDepartement}
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
            Êtes-vous sûr de vouloir supprimer ce département ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)} color="primary">
            Annuler
          </Button>
          <Button
            onClick={() => handleDelete(departmentToDelete)}
            color="primary"
            autoFocus
          >
            Oui
          </Button>
        </DialogActions>
      </Dialog>

      <DataGrid
        apiRef={apiRef}
        rows={departements}
        columns={columns}
        pageSize={5}
        disableRowSelectionOnClick={true}
        loading={loading}
        disableMultipleRowSelection={true}
        checkboxSelection={false}
        getRowId={(row) => row.id}
        autosizeOptions={expand}
        pagination
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