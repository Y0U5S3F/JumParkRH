import { useEffect, useState } from "react";
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
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { fetchJourFeries, addJourFerie, updateJourFerie, deleteJourFerie } from "../service/JourFerieService";
import JourFerie from "../models/jourferie";

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
}));

export default function JourFeriePage() {
  const [jourFeries, setJourFeries] = useState([]);
  const [editJourFerie, setEditJourFerie] = useState(new JourFerie("", "", "", ""));
  const [openEditModal, setOpenEditModal] = useState(false);
  const [open, setOpen] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [jourFerieToDelete, setJourFerieToDelete] = useState(null);
  const [expand, setExpand] = useState(DEFAULT_GRID_AUTOSIZE_OPTIONS.expand);
  const apiRef = useGridApiRef();
  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: "",
    message: "",
  });
  const [refresh, setRefresh] = useState(0); // State to trigger re-fetch
  const [loading, setLoading] = useState(true);
  const [newJourFerie, setNewJourFerie] = useState(new JourFerie("", "", "", ""));

  const classes = useStyles();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const jourFeriesData = await fetchJourFeries();
        
        // Format data for DataGrid
        const formattedJourFeries = jourFeriesData.map((jourFerie) => ({
          id: jourFerie.id, // Ensure each row has a unique id
          nom: jourFerie.nom,
          date: jourFerie.date,
          description: jourFerie.description,
        }));

        setJourFeries(formattedJourFeries);
      } catch (error) {
        console.error("Error fetching jour feries:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [refresh]);

  const handleEdit = (jourFerie) => {
    setEditJourFerie(jourFerie);
    setOpenEditModal(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteJourFerie(id);
      console.log("Deleted jour ferie with id:", id);
      setJourFeries((prev) => prev.filter((jourFerie) => jourFerie.id !== id));
      setSnackbar({
        open: true,
        severity: "success",
        message: "Jour férié supprimé avec succès!",
      });
    } catch (error) {
      console.error("Error deleting jour ferie:", error);
      setSnackbar({
        open: true,
        severity: "error",
        message: "Erreur lors de la suppression du jour férié.",
      });
    }
    setOpenDeleteDialog(false);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleAddJourFerie = async () => {
    try {
      const jourFerieToSend = {
        nom: newJourFerie.nom,
        date: newJourFerie.date,
        description: newJourFerie.description,
      };
      console.log("Sending data:", jourFerieToSend);
      const response = await addJourFerie(jourFerieToSend);
      console.log("Response:", response);
      setSnackbar({
        open: true,
        severity: "success",
        message: "Jour férié ajouté avec succès!",
      });
      setOpen(false);
      setRefresh((prev) => prev + 1); // Trigger re-fetch
    } catch (error) {
      setSnackbar({
        open: true,
        severity: "error",
        message: `Erreur lors de l'ajout du jour férié.${error}`,
      });
      console.error("Error adding jour ferie:", error);
    }
  };

  const handleUpdateJourFerie = async (e) => {
    e.preventDefault();
    try {
      await updateJourFerie(editJourFerie.id, editJourFerie);
      setSnackbar({
        open: true,
        severity: "success",
        message: "Jour férié mis à jour avec succès!",
      });

      setJourFeries((prev) =>
        prev.map((jour) => (jour.id === editJourFerie.id ? editJourFerie : jour))
      );

      setOpenEditModal(false);
      setRefresh((prev) => !prev);
    } catch (error) {
      setSnackbar({
        open: true,
        severity: "error",
        message: `Échec de la mise à jour du jour férié.${error}`,
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewJourFerie((prev) => ({ ...prev, [name]: value }));
    console.log(newJourFerie);
  };

  const handleInputModifyChange = (e) => {
    const { name, value } = e.target;
    setEditJourFerie((prev) => ({ ...prev, [name]: value }));
  };

  const columns = [
    { field: "id", headerName: "ID", flex: 0.5 },
    { field: "nom", headerName: "Nom", flex: 1 },
    { field: "date", headerName: "Date", flex: 1 },
    { field: "description", headerName: "Description", flex: 1.5 },
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
            setJourFerieToDelete(params.row.id);
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
        <Button variant="contained" onClick={() => setOpen(true)}>
          Ajouter Jour Férié
        </Button>
      </Box>

      {/* Add Modal */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box className={classes.modalStyle}>
          <Typography variant="h6" gutterBottom>
            Veuillez saisir les informations du jour férié
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Box className={classes.contentContainer}>
            <Typography variant="body1" gutterBottom>
              Informations du jour férié
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
                  value={newJourFerie.nom}
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
                  value={newJourFerie.date}
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
                  label="Description"
                  type="search"
                  variant="outlined"
                  name="description"
                  value={newJourFerie.description}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
            </Grid>
          </Box>
          <Box mt={3} display="flex" justifyContent="space-between">
            <Button
              variant="outlined"
              onClick={() => setNewJourFerie(new JourFerie("", "", "", ""))}
            >
              Réinitialiser
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddJourFerie}
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
            Veuillez modifier les informations du jour férié
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Box className={classes.contentContainer}>
            <Typography variant="body1" gutterBottom>
              Informations du jour férié
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
                  value={editJourFerie.nom}
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
                  value={editJourFerie.date}
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
                  label="Description"
                  type="search"
                  variant="outlined"
                  name="description"
                  value={editJourFerie.description}
                  onChange={handleInputModifyChange}
                  fullWidth
                />
              </Grid>
            </Grid>
          </Box>
          <Box mt={3} display="flex" justifyContent="space-between">
            <Button
              variant="outlined"
              onClick={() => setEditJourFerie(new JourFerie("", "", "", ""))}
            >
              Réinitialiser
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleUpdateJourFerie}
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
            Êtes-vous sûr de vouloir supprimer ce jour férié ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)} color="primary">
            Annuler
          </Button>
          <Button
            onClick={() => handleDelete(jourFerieToDelete)}
            color="primary"
            autoFocus
          >
            Oui
          </Button>
        </DialogActions>
      </Dialog>

      <DataGrid
        apiRef={apiRef}
        rows={jourFeries}
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