import React, { useEffect, useState } from "react";
import dayjs from "dayjs";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
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
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import CloseIcon from "@mui/icons-material/Close";
import {
  fetchJourFeries,
  addJourFerie,
  updateJourFerie,
  deleteJourFerie,
} from "../service/JourFerieService";
import JourFerie from "../models/jourferie";
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

export default function JourFeriePage() {
  const [jourFeries, setJourFeries] = useState([]);
  const [editJourFerie, setEditJourFerie] = useState(new JourFerie("", "", ""));
  const [newJourFerie, setNewJourFerie] = useState(new JourFerie("", "", ""));
  const [open, setOpen] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [jourFerieToDelete, setJourFerieToDelete] = useState(null);
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
        const jourFeriesData = await fetchJourFeries();
        setJourFeries(jourFeriesData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [refresh]);

  const handleAddJourFerie = async () => {
    if (!newJourFerie.nom || !newJourFerie.date) {
      setSnackbar({
        open: true,
        severity: "error",
        message: "Veuillez remplir les champs obligatoires.",
      });
      return;
    }
    try {
      await addJourFerie(newJourFerie);
      setSnackbar({
        open: true,
        severity: "success",
        message: "Jour férié ajouté avec succès!",
      });
      setOpen(false);
      setNewJourFerie(new JourFerie("", "", ""));
      setRefresh((prev) => prev + 1);
    } catch (error) {
      setSnackbar({
        open: true,
        severity: "error",
        message: "Erreur lors de l'ajout du jour férié.",
      });
    }
  };

  const handleUpdateJourFerie = async () => {
    try {
      await updateJourFerie(editJourFerie.id, editJourFerie);
      setSnackbar({
        open: true,
        severity: "success",
        message: "Jour férié mis à jour avec succès!",
      });
      setOpenEditModal(false);
      setRefresh((prev) => prev + 1);
    } catch (error) {
      setSnackbar({
        open: true,
        severity: "error",
        message: "Erreur lors de la mise à jour du jour férié.",
      });
    }
  };

  const handleDeleteJourFerie = async () => {
    try {
      await deleteJourFerie(jourFerieToDelete);
      setSnackbar({
        open: true,
        severity: "success",
        message: "Jour férié supprimé avec succès!",
      });
      setOpenDeleteDialog(false);
      setRefresh((prev) => prev + 1);
    } catch (error) {
      setSnackbar({
        open: true,
        severity: "error",
        message: "Erreur lors de la suppression du jour férié.",
      });
    }
  };

  const columns = [
    { field: "id", headerName: "ID", flex: 0.5, minWidth: 50 },
    { field: "nom", headerName: "Nom", flex: 1, minWidth: 150 },
    { field: "date", headerName: "Date", flex: 2, minWidth: 150 },
    {
      field: "actions",
      headerName: "Actions",
      flex: 0.6,
      minWidth: 150, // Ensure the Actions column is always fully visible
      renderCell: (params) => (
        <div style={{ display: "flex" }}>
          <IconButton onClick={() => setEditJourFerie(params.row) || setOpenEditModal(true)}>
            <EditIcon />
          </IconButton>
          <IconButton
            onClick={() => {
              setJourFerieToDelete(params.row.id);
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
          <EventAvailableIcon />
          <Typography variant="h6" fontWeight="bold">
            Jours Fériés
          </Typography>
        </Box>
                <Box sx={{display:"flex",flexDirection:"row",alignItems:"center",gap:"10px"}}>
        
        <Button
          size="medium"
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={() => setOpen(true)}
        >
          Ajouter Jour Férié
        </Button>
<ThemeToggle/>        </Box>
      </Box>

      {/* Add Jour Férié Modal */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box className={classes.modalStyle}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Ajouter Jour Férié
            </Typography>
            <CloseIcon
              onClick={() => setOpen(false)}
              
            />
          </Box>
          <Box className={classes.contentContainer}>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <Grid item md={6}xs={12}>
                <TextField
                  label="Nom"
                  required
                  name="nom"
                  value={newJourFerie.nom}
                  onChange={(e) =>
                    setNewJourFerie((prev) => ({ ...prev, nom: e.target.value }))
                  }
                  fullWidth
                />
              </Grid>
              <Grid item md={6}xs={12}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
  <DatePicker
    sx={{ width: "100%" }}
    label="Date"
    value={newJourFerie.date ? dayjs(newJourFerie.date) : null}
    onChange={(date) =>
      setNewJourFerie((prev) => ({
        ...prev,
        date: date?.format("YYYY-MM-DD"), // Ensure the date is stored in the correct format
      }))
    }
    slotProps={{
      textField: {
        required: true,
      },
    }}
  />
</LocalizationProvider>
              </Grid>
            </Grid>
          </Box>
          <Box mt={3} display="flex" justifyContent="space-between">
            <Button
              variant="outlined"
              onClick={() => setNewJourFerie(new JourFerie("", "", ""))}
            >
              Réinitialiser
            </Button>
            <Button variant="contained" color="primary" onClick={handleAddJourFerie}>
              Enregistrer
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Edit Jour Férié Modal */}
      <Modal open={openEditModal} onClose={() => setOpenEditModal(false)}>
        <Box className={classes.modalStyle}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Modifier Jour Férié
            </Typography>
            <CloseIcon
              onClick={() => setOpenEditModal(false)}
              
            />
          </Box>
          <Box className={classes.contentContainer}>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <Grid item md={6}xs={12}>
                <TextField
                  label="Nom"
                  required
                  name="nom"
                  value={editJourFerie.nom}
                  onChange={(e) =>
                    setEditJourFerie((prev) => ({ ...prev, nom: e.target.value }))
                  }
                  fullWidth
                />
              </Grid>
              <Grid item md={6}xs={12}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
  <DatePicker
    sx={{ width: "100%" }}
    label="Date"
    required
    value={editJourFerie.date ? dayjs(editJourFerie.date) : null}
    onChange={(date) =>
      setEditJourFerie((prev) => ({
        ...prev,
        date: date?.format("YYYY-MM-DD"), // Ensure the date is stored in the correct format
      }))
    }
    slotProps={{
      textField: {
        required: true,
      },
    }}
  />
</LocalizationProvider>
              </Grid>
            </Grid>
          </Box>
          <Box mt={3} display="flex" justifyContent="space-between">
            <Button
              variant="outlined"
              onClick={() => setEditJourFerie(new JourFerie("", "", ""))}
            >
              Réinitialiser
            </Button>
            <Button variant="contained" color="primary" onClick={handleUpdateJourFerie}>
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
            Êtes-vous sûr de vouloir supprimer ce jour férié ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)} color="primary">
            Annuler
          </Button>
          <Button onClick={handleDeleteJourFerie} color="primary" autoFocus>
            Oui
          </Button>
        </DialogActions>
      </Dialog>

      <DataGrid
        apiRef={apiRef}
        rows={jourFeries}
        columns={columns}
        pageSize={5}
        hideScrollbar={true}
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