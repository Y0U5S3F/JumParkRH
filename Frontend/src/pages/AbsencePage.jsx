import React, { useEffect, useState } from "react";
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
  Checkbox,
  FormControlLabel,
  Autocomplete,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from '@mui/icons-material/Add';
import EventBusyOutlinedIcon from '@mui/icons-material/EventBusyOutlined';import { fetchAbsences, addAbsence, updateAbsence, deleteAbsence } from "../service/AbsenceService";
import { fetchMinimalEmployes } from "../service/EmployeService";
import Absence from "../models/absence";

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
  statusCertified: {
    color: "green",
    fontWeight: "bold",
  },
  statusNotCertified: {
    color: "red",
    fontWeight: "bold",
  },
  titleContainer: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    fontWeight: "bold",
  },
}));

export default function AbsencePage() {
  const [absences, setAbsences] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [editAbsence, setEditAbsence] = useState(new Absence("", "", "", "", false, ""));
  const [openEditModal, setOpenEditModal] = useState(false);
  const [open, setOpen] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [absenceToDelete, setAbsenceToDelete] = useState(null);
  const [expand, setExpand] = useState(DEFAULT_GRID_AUTOSIZE_OPTIONS.expand);
  const apiRef = useGridApiRef();
  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: "",
    message: "",
  });
  const [refresh, setRefresh] = useState(0); // State to trigger re-fetch
  const [loading, setLoading] = useState(true);
  const [newAbsence, setNewAbsence] = useState(new Absence("", "", "", "", false, ""));
  const [searchTerm, setSearchTerm] = useState("");

  const classes = useStyles();
  const [pageTitle, setPageTitle] = useState("Absence");
  
    useEffect(() => {
      document.title = pageTitle; // Update the document title
    }, [pageTitle]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const absencesData = await fetchAbsences();
        const employeesData = await fetchMinimalEmployes();
        
        // Format data for DataGrid
        const formattedAbsences = absencesData.map((absence) => ({
          id: absence.id, // Ensure each row has a unique id
          nom: absence.nom,
          date: absence.date,
          raison: absence.raison,
          certifie: absence.certifie ? "Certifié" : "Non Certifié",
          employe_name: employeesData.find(emp => emp.matricule === absence.employe)?.nom + " " + employeesData.find(emp => emp.matricule === absence.employe)?.prenom || "N/A",
          employe: absence.employe,
        }));

        setAbsences(formattedAbsences);
        setEmployees(employeesData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [refresh]);

  const handleEdit = (absence) => {
    setEditAbsence({
      ...absence,
      certifie: absence.certifie === "Certifié",
    });
    setOpenEditModal(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteAbsence(id);
      console.log("Deleted absence with id:", id);
      setAbsences((prev) => prev.filter((absence) => absence.id !== id));
      setSnackbar({
        open: true,
        severity: "success",
        message: "Absence supprimée avec succès!",
      });
    } catch (error) {
      console.error("Error deleting absence:", error);
      setSnackbar({
        open: true,
        severity: "error",
        message: "Erreur lors de la suppression de l'absence.",
      });
    }
    setOpenDeleteDialog(false);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleAddAbsence = async () => {
    try {
      const absenceToSend = {
        nom: newAbsence.nom,
        date: newAbsence.date,
        raison: newAbsence.raison,
        certifie: newAbsence.certifie,
        employe: newAbsence.employe,
      };
      console.log("Sending data:", absenceToSend);
      const response = await addAbsence(absenceToSend);
      console.log("Response:", response);
      setSnackbar({
        open: true,
        severity: "success",
        message: "Absence ajoutée avec succès!",
      });
      setOpen(false);
      setRefresh((prev) => prev + 1); // Trigger re-fetch
    } catch (error) {
      setSnackbar({
        open: true,
        severity: "error",
        message: `Erreur lors de l'ajout de l'absence.${error}`,
      });
      console.error("Error adding absence:", error);
    }
  };

  const handleUpdateAbsence = async (e) => {
    e.preventDefault();
    try {
      const absenceToSend = {
        id: editAbsence.id,
        nom: editAbsence.nom,
        date: editAbsence.date,
        raison: editAbsence.raison,
        certifie: editAbsence.certifie,
        employe: editAbsence.employe,
      }
      console.log(absenceToSend)
      await updateAbsence(absenceToSend.id, absenceToSend);
      setSnackbar({
        open: true,
        severity: "success",
        message: "Absence mise à jour avec succès!",
      });

      setAbsences((prev) =>
        prev.map((abs) => (abs.id === editAbsence.id ? editAbsence : abs))
      );

      setOpenEditModal(false);
      setRefresh((prev) => !prev);
    } catch (error) {
      setSnackbar({
        open: true,
        severity: "error",
        message: `Échec de la mise à jour de l'absence.${error}`,
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewAbsence((prev) => ({ ...prev, [name]: value }));
    console.log(newAbsence);
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setNewAbsence((prev) => ({ ...prev, [name]: checked }));
    console.log(newAbsence);
  };

  const handleInputModifyChange = (e) => {
    const { name, value } = e.target;
    setEditAbsence((prev) => ({ ...prev, [name]: value }));
    console.log(editAbsence);
  };

  const handleCheckboxModifyChange = (e) => {
    const { name, checked } = e.target;
    setEditAbsence((prev) => ({ ...prev, [name]: checked }));
    console.log(editAbsence);
  };

  const columns = [
    { field: "id", headerName: "ID", flex: 0.5 },
    { field: "nom", headerName: "Nom", flex: 1 },
    { field: "date", headerName: "Date", flex: 1 },
    { field: "raison", headerName: "Raison", flex: 1 },
    {
      field: "certifie",
      headerName: "Certifié",
      flex: 1,
      renderCell: (params) => (
        <span
          className={params.value === "Certifié" ? classes.statusCertified : classes.statusNotCertified}
        >
          {params.value}
        </span>
      ),
    },
    { field: "employe_name", headerName: "Employé", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      flex: 0.5,
      renderCell: (params) => (
        <div style={{ display: "flex" }}>
          <IconButton onClick={() => handleEdit(params.row)}>
            <EditIcon /> {/* Add Edit icon */}
          </IconButton>
          <IconButton onClick={() => {
            setAbsenceToDelete(params.row.id);
            setOpenDeleteDialog(true);
          }}>
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
        <EventBusyOutlinedIcon/>
          <Typography variant="h6" fontWeight="bold">
            Absences
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
          Ajouter Absence
        </Button>
      </Box>

      {/* Add Modal */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box className={classes.modalStyle}>
          <Typography variant="h6" gutterBottom>
            Veuillez saisir les coordonnées de l'absence
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Box className={classes.contentContainer}>
            <Typography variant="body1" gutterBottom>
              Informations de l'absence
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <TextField
                  id="outlined-search"
                  label="Nom"
                  type="search"
                  variant="outlined"
                  name="nom"
                  value={newAbsence.nom}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  id="outlined-search"
                  label="Date"
                  type="date"
                  variant="outlined"
                  name="date"
                  value={newAbsence.date}
                  onChange={handleChange}
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  id="outlined-search"
                  label="Raison"
                  type="search"
                  variant="outlined"
                  name="raison"
                  value={newAbsence.raison}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={4}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={newAbsence.certifie}
                      onChange={handleCheckboxChange}
                      name="certifie"
                      color="primary"
                    />
                  }
                  label="Certifié"
                />
              </Grid>
              <Grid item xs={4}>
                <Autocomplete
                  options={employees}
                  getOptionLabel={(option) => `${option.nom} ${option.prenom} (${option.matricule})`}
                  onInputChange={(event, value) => setSearchTerm(value)}
                  onChange={(event, newValue) => {
                    handleChange({
                      target: {
                        name: "employe",
                        value: newValue?.matricule || "",
                      },
                    });
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Employé"
                      variant="outlined"
                    />
                  )}
                />
              </Grid>
            </Grid>
          </Box>
          <Box mt={3} display="flex" justifyContent="space-between">
            <Button
              variant="outlined"
              onClick={() => setNewAbsence(new Absence("", "", "", "", false, ""))}
            >
              Réinitialiser
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddAbsence}
            >
              Enregistrer
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Edit Modal */}
      <Modal open={openEditModal} onClose={() => setOpenEditModal(false)}>
        <Box className={classes.modalStyle}>
          <Typography variant="h6" gutterBottom>
            Veuillez modifier les coordonnées de l'absence
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Box className={classes.contentContainer}>
            <Typography variant="body1" gutterBottom>
              Informations de l'absence
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <TextField
                  id="outlined-search"
                  label="Nom"
                  type="search"
                  variant="outlined"
                  name="nom"
                  value={editAbsence.nom}
                  onChange={handleInputModifyChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  id="outlined-search"
                  label="Date"
                  type="date"
                  variant="outlined"
                  name="date"
                  value={editAbsence.date}
                  onChange={handleInputModifyChange}
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  id="outlined-search"
                  label="Raison"
                  type="search"
                  variant="outlined"
                  name="raison"
                  value={editAbsence.raison}
                  onChange={handleInputModifyChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={4}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={editAbsence.certifie}
                      onChange={handleCheckboxModifyChange}
                      name="certifie"
                      color="primary"
                    />
                  }
                  label="Certifié"
                />
              </Grid>
              <Grid item xs={4}>
                <Autocomplete
                  options={employees}
                  getOptionLabel={(option) => `${option.nom} ${option.prenom} (${option.matricule})`}
                  value={employees.find((emp) => emp.matricule === editAbsence.employe) || null}
                  onChange={(event, newValue) => {
                    handleInputModifyChange({
                      target: {
                        name: "employe",
                        value: newValue?.matricule || "",
                      },
                    });
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Employé"
                      variant="outlined"
                    />
                  )}
                />
              </Grid>
            </Grid>
          </Box>
          <Box mt={3} display="flex" justifyContent="space-between">
            <Button
              variant="outlined"
              onClick={() => setEditAbsence(new Absence("", "", "", "", false, ""))}
            >
              Réinitialiser
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleUpdateAbsence}
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
            Êtes-vous sûr de vouloir supprimer cette absence ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)} color="primary">
            Annuler
          </Button>
          <Button
            onClick={() => handleDelete(absenceToDelete)}
            color="primary"
            autoFocus
          >
            Oui
          </Button>
        </DialogActions>
      </Dialog>

      <DataGrid
        apiRef={apiRef}
        rows={absences}
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