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
import AddIcon from "@mui/icons-material/Add";
import EventBusyOutlinedIcon from "@mui/icons-material/EventBusyOutlined";
import CloseIcon from "@mui/icons-material/Close";
import {
  fetchAbsences,
  addAbsence,
  updateAbsence,
  deleteAbsence,
} from "../service/AbsenceService";
import { fetchMinimalEmployes } from "../service/EmployeService";
import Absence from "../models/absence";
import ThemeToggle from "../components/ThemeToggle";

const useStyles = makeStyles((theme) => ({
  container: {
    padding: "20px",
    display: "flex",
    flexDirection: "column",
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
  titleContainer: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    fontWeight: "bold",
  },
  topBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "10px",
    padding: "5px",
  },
}));

export default function AbsencePage() {
  const [absences, setAbsences] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [editAbsence, setEditAbsence] = useState(new Absence("", "", "", "", false, ""));
  const [newAbsence, setNewAbsence] = useState(new Absence("", "", "", "", false, ""));
  const [open, setOpen] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [absenceToDelete, setAbsenceToDelete] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: "",
    message: "",
  });
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(0);
  const apiRef = useGridApiRef();
  const classes = useStyles();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const absencesData = await fetchAbsences();
        const employeesData = await fetchMinimalEmployes();

        const formattedAbsences = absencesData.map((absence) => ({
          id: absence.id,
          nom: absence.nom,
          date: absence.date,
          raison: absence.raison,
          certifie: absence.certifie ? "Certifié" : "Non Certifié",
          employe_name:
            employeesData.find((emp) => emp.matricule === absence.employe)?.nom +
              " " +
              employeesData.find((emp) => emp.matricule === absence.employe)?.prenom ||
            "N/A",
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

  const handleAddAbsence = async () => {
    try {
      await addAbsence(newAbsence);
      setSnackbar({
        open: true,
        severity: "success",
        message: "Absence ajoutée avec succès!",
      });
      setOpen(false);
      setNewAbsence(new Absence("", "", "", "", false, ""));
      setRefresh((prev) => prev + 1);
    } catch (error) {
      setSnackbar({
        open: true,
        severity: "error",
        message: "Erreur lors de l'ajout de l'absence.",
      });
    }
  };

  const handleUpdateAbsence = async () => {
    try {
      await updateAbsence(editAbsence.id, editAbsence);
      setSnackbar({
        open: true,
        severity: "success",
        message: "Absence mise à jour avec succès!",
      });
      setOpenEditModal(false);
      setRefresh((prev) => prev + 1);
    } catch (error) {
      setSnackbar({
        open: true,
        severity: "error",
        message: "Erreur lors de la mise à jour de l'absence.",
      });
    }
  };

  const handleDeleteAbsence = async () => {
    try {
      await deleteAbsence(absenceToDelete);
      setSnackbar({
        open: true,
        severity: "success",
        message: "Absence supprimée avec succès!",
      });
      setOpenDeleteDialog(false);
      setRefresh((prev) => prev + 1);
    } catch (error) {
      setSnackbar({
        open: true,
        severity: "error",
        message: "Erreur lors de la suppression de l'absence.",
      });
    }
  };

  const columns = [
    { field: "id", headerName: "ID", flex: 0.5, minWidth: 50 },
    { field: "nom", headerName: "Nom", flex: 1, minWidth: 150 },
    { field: "date", headerName: "Date", flex: 1, minWidth: 150 },
    { field: "raison", headerName: "Raison", flex: 1, minWidth: 150 },
    { field: "certifie", headerName: "Certifié", flex: 1, minWidth: 100 },
    { field: "employe_name", headerName: "Employé", flex: 1, minWidth: 150 },
    {
      field: "actions",
      headerName: "Actions",
      flex: 0.6,
      minWidth: 100, // Ensure the Actions column is always fully visible
      renderCell: (params) => (
        <div style={{ display: "flex" }}>
          <IconButton onClick={() => setEditAbsence(params.row) || setOpenEditModal(true)}>
            <EditIcon />
          </IconButton>
          <IconButton
            onClick={() => {
              setAbsenceToDelete(params.row.id);
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
          <EventBusyOutlinedIcon />
          <Typography variant="h6" fontWeight="bold">
            Absences
          </Typography>
        </Box>
                <Box sx={{display:"flex",flexDirection:"row",alignItems:"center",gap:"10px"}}>
        
        <Button
          size="medium"
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={() => setOpen(true)}
        >
          Ajouter Absence
        </Button>
        <ThemeToggle ></ThemeToggle>
        </Box>
      </Box>

      {/* Add Absence Modal */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box className={classes.modalStyle}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb:2 }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Ajouter Absence
            </Typography>
            <CloseIcon
              onClick={() => setOpen(false)}
              sx={{
                "&:hover": {
                  backgroundColor: "rgba(0, 0, 0, 0.9)",
                  borderRadius: "50%",
                },
              }}
            />
          </Box>
          <Box className={classes.contentContainer}>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <Grid item md={6}xs={12}>
                <TextField
                  label="Nom"
                  name="nom"
                  value={newAbsence.nom}
                  onChange={(e) =>
                    setNewAbsence((prev) => ({ ...prev, nom: e.target.value }))
                  }
                  fullWidth
                />
              </Grid>
              <Grid item md={6}xs={12}>
                <TextField
                  label="Date"
                  type="date"
                  name="date"
                  value={newAbsence.date}
                  onChange={(e) =>
                    setNewAbsence((prev) => ({ ...prev, date: e.target.value }))
                  }
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  format="DD/MM/YYYY" // Set the desired format

                />
              </Grid>
              <Grid item md={6}xs={12}>
                <TextField
                  label="Raison"
                  name="raison"
                  value={newAbsence.raison}
                  onChange={(e) =>
                    setNewAbsence((prev) => ({ ...prev, raison: e.target.value }))
                  }
                  fullWidth
                />
              </Grid>
              
              <Grid item md={6}xs={12}>
                <Autocomplete
                  options={employees}
                  getOptionLabel={(option) =>
                    `${option.nom} ${option.prenom} (${option.matricule})`
                  }
                  onChange={(event, newValue) =>
                    setNewAbsence((prev) => ({
                      ...prev,
                      employe: newValue?.matricule || "",
                    }))
                  }
                  renderInput={(params) => (
                    <TextField {...params} label="Employé" variant="outlined" />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                    sx={{ '& .MuiSvgIcon-root': { fontSize: 28 } }}
                      checked={newAbsence.certifie}
                      onChange={(e) =>
                        setNewAbsence((prev) => ({
                          ...prev,
                          certifie: e.target.checked,
                        }))
                      }
                    />
                  }
                  label="Certifié"
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
            <Button variant="contained" color="primary" onClick={handleAddAbsence}>
              Enregistrer
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Edit Absence Modal */}
      <Modal open={openEditModal} onClose={() => setOpenEditModal(false)}>
        <Box className={classes.modalStyle}>
          <Box sx={{ display: "flex", justifyContent: "space-between",mb:2 }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Modifier Absence
            </Typography>
            <CloseIcon
              onClick={() => setOpenEditModal(false)}
              sx={{
                "&:hover": {
                  backgroundColor: "rgba(0, 0, 0, 0.9)",
                  borderRadius: "50%",
                },
              }}
            />
          </Box>
          <Box className={classes.contentContainer}>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <Grid item md={6}xs={12}>
                <TextField
                  label="Nom"
                  name="nom"
                  value={editAbsence.nom}
                  onChange={(e) =>
                    setEditAbsence((prev) => ({ ...prev, nom: e.target.value }))
                  }
                  fullWidth
                />
              </Grid>
              <Grid item md={6}xs={12}>
                <TextField
                  label="Date"
                  type="date"
                  name="date"
                  value={editAbsence.date}
                  onChange={(e) =>
                    setEditAbsence((prev) => ({ ...prev, date: e.target.value }))
                  }
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item md={6}xs={12}>
                <TextField
                  label="Raison"
                  name="raison"
                  value={editAbsence.raison}
                  onChange={(e) =>
                    setEditAbsence((prev) => ({ ...prev, raison: e.target.value }))
                  }
                  fullWidth
                />
              </Grid>
              
              <Grid item md={6}xs={12}>
                <Autocomplete
                  options={employees}
                  getOptionLabel={(option) =>
                    `${option.nom} ${option.prenom} (${option.matricule})`
                  }
                  value={
                    employees.find((emp) => emp.matricule === editAbsence.employe) ||
                    null
                  }
                  onChange={(event, newValue) =>
                    setEditAbsence((prev) => ({
                      ...prev,
                      employe: newValue?.matricule || "",
                    }))
                  }
                  renderInput={(params) => (
                    <TextField {...params} label="Employé" variant="outlined" />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                    sx={{ '& .MuiSvgIcon-root': { fontSize: 28 } }}

                      checked={editAbsence.certifie}
                      onChange={(e) =>
                        setEditAbsence((prev) => ({
                          ...prev,
                          certifie: e.target.checked,
                        }))
                      }
                    />
                  }
                  label="Certifié"
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
            <Button variant="contained" color="primary" onClick={handleUpdateAbsence}>
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
          <Button onClick={handleDeleteAbsence} color="primary" autoFocus>
            Oui
          </Button>
        </DialogActions>
      </Dialog>

      <DataGrid
        apiRef={apiRef}
        rows={absences}
        hideScrollbar={true}

        columns={columns}
        pageSize={5}
        checkboxSelection={false}
        disableRowSelectionOnClick={true}
        disableMultipleRowSelection={true}
        autosizeOptions={DEFAULT_GRID_AUTOSIZE_OPTIONS.expand}
        pagination
        loading={loading}
        pageSizeOptions={[10, 25, 100]}
        
      />

      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}