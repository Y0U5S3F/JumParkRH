import { useEffect, useState } from "react";
import {
  DataGrid,
  useGridApiRef,
  DEFAULT_GRID_AUTOSIZE_OPTIONS,
} from "@mui/x-data-grid";
import CloseIcon from '@mui/icons-material/Close';

import PhonelinkSetupIcon from '@mui/icons-material/PhonelinkSetup';

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
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from '@mui/icons-material/Add';
import { Business } from "@mui/icons-material";
import { fetchAppareils, addAppareil, updateAppareil, toggleAppareilStatus, deleteAppareil } from "../service/AppareilService";
import Appareil from "../models/appareil";
import ThemeToggle from "../components/ThemeToggle";

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
  statusConnected: {
    color: `${theme.palette.success.main}`,
    fontWeight: "bold",
  },
  statusDisconnected: {
    color: `${theme.palette.warning.main}`,
    fontWeight: "bold",
  },
  titleContainer: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    fontWeight: "bold",
  },
}));

export default function AppareilPage() {
  const [appareils, setAppareils] = useState([]);
  const [editAppareil, setEditAppareil] = useState(new Appareil("", "", "", ""));
  const [openEditModal, setOpenEditModal] = useState(false);
  const [open, setOpen] = useState(false);
 
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [appareilToDelete, setAppareilToDelete] = useState(null);
  const [expand, setExpand] = useState(DEFAULT_GRID_AUTOSIZE_OPTIONS.expand);
  const apiRef = useGridApiRef();
  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: "",
    message: "",
  });
  const [refresh, setRefresh] = useState(0); // State to trigger re-fetch
  const [loading, setLoading] = useState(true);
  const [newAppareil, setNewAppareil] = useState(new Appareil("", "", "", ""));

  const classes = useStyles();
  const [pageTitle, setPageTitle] = useState("Appareil");
      
        useEffect(() => {
          document.title = pageTitle; // Update the document title
        }, [pageTitle]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const appareilsData = await fetchAppareils();
        
        // Format data for DataGrid
        const formattedAppareils = appareilsData.map((appareil) => ({
          id: appareil.id, // Ensure each row has a unique id
          nom: appareil.nom,
          ip: appareil.ip,
          port: appareil.port,
          status: appareil.status,
          created_at: new Date(appareil.created_at).toLocaleString(),
        }));

        setAppareils(formattedAppareils);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [refresh]);

  const handleEdit = (appareil) => {
    setEditAppareil(appareil);
    setOpenEditModal(true);
  };

  const handleDelete = (id) => {
    setAppareilToDelete(id);
    setOpenDeleteDialog(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };
  const confirmDeleteAppareil = async () => {
    try {
      await deleteAppareil(appareilToDelete);
      setSnackbar({
        open: true,
        severity: "success",
        message: "Appareil supprimé avec succès!",
      });
      setAppareils((prev) => prev.filter((appareil) => appareil.id !== appareilToDelete));
      setRefresh((prev) => prev + 1);
    } catch (error) {
      setSnackbar({
        open: true,
        severity: "error",
        message: "Erreur lors de la suppression de l'appareil.",
      });
    } finally {
      setOpenDeleteDialog(false);
      setAppareilToDelete(null);
    }
  };

  const handleAddAppareil = async () => {
    try {
      const appareilToSend = {
        nom: newAppareil.nom,
        ip: newAppareil.ip,
        port: parseInt(newAppareil.port, 10), // Ensure port is an integer
        status: newAppareil.status,
      };
      const response = await addAppareil(appareilToSend);
      setSnackbar({
        open: true,
        severity: "success",
        message: "Appareil ajouté avec succès!",
      });
      setOpen(false);
      setRefresh((prev) => prev + 1); // Trigger re-fetch
    } catch (error) {
      setSnackbar({
        open: true,
        severity: "error",
        message: `Erreur lors de l'ajout de l'appareil.${error}`,
      });
    }
  };

  const handleUpdateAppareil = async (e) => {
    e.preventDefault();
    try {
      await updateAppareil(editAppareil.id, editAppareil);
      setSnackbar({
        open: true,
        severity: "success",
        message: "Appareil mis à jour avec succès!",
      });

      setAppareils((prev) =>
        prev.map((app) => (app.id === editAppareil.id ? editAppareil : app))
      );

      setOpenEditModal(false);
      setRefresh((prev) => !prev);
    } catch (error) {
      setSnackbar({
        open: true,
        severity: "error",
        message: `Échec de la mise à jour de l'appareil.${error}`,
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewAppareil((prev) => ({ ...prev, [name]: value }));
  };

  const handleInputModifyChange = (e) => {
    const { name, value } = e.target;
    setEditAppareil((prev) => ({ ...prev, [name]: value }));
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      const updatedAppareil = await toggleAppareilStatus(id, currentStatus);
      setSnackbar({
        open: true,
        severity: "success",
        message: "Statut de l'appareil mis à jour avec succès!",
      });
      setAppareils((prev) =>
        prev.map((app) => (app.id === id ? { ...app, status: updatedAppareil.status } : app))
      );
    } catch (error) {
      setSnackbar({
        open: true,
        severity: "error",
        message: "Erreur lors de la mise à jour du statut de l'appareil.",
      });
    }
  };

  const columns = [
    { field: "id", headerName: "ID", flex: 0.5, minWidth: 50 },
    { field: "nom", headerName: "Nom", flex: 1, minWidth: 150 },
    { field: "ip", headerName: "Adresse IP", flex: 1, minWidth: 150 },
    { field: "port", headerName: "Port", flex: 0.7, minWidth: 100 },
    { field: "status", headerName: "Statut", flex: 1, minWidth: 150 },
    { field: "created_at", headerName: "Créé le", flex: 1.2, minWidth: 150 },
    {
      field: "actions",
      headerName: "Actions",
      flex: 0.6,
      minWidth: 50, // Ensure the Actions column is always fully visible
      renderCell: (params) => (
        <div style={{ display: "flex" }}>
          <IconButton onClick={() => handleEdit(params.row)}>
            <EditIcon />
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
          <PhonelinkSetupIcon />
          <Typography variant="h6" fontWeight="bold">
            Appareils
          </Typography>
        </Box>
                <Box sx={{display:"flex",flexDirection:"row",alignItems:"center",gap:"10px"}}>
        
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
          Ajouter Appareil
        </Button>
        <ThemeToggle/>
        </Box>
      </Box>

      {/* Add Modal */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box className={classes.modalStyle}>
        <Box sx={{display:"flex",justifyContent:"space-between"}}>

<Typography variant="h5" fontWeight="bold"sx={{mb:3}} gutterBottom>
  Ajouter Appareil
</Typography>
<CloseIcon onClick={()=> setOpen(false)} />
</Box>
          <Box className={classes.contentContainer}>
            
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  id="outlined-search"
                  label="Nom"
                  type="search"
                  variant="outlined"
                  name="nom"
                  value={newAppareil.nom}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  id="outlined-search"
                  label="Adresse IP"
                  type="search"
                  variant="outlined"
                  name="ip"
                  value={newAppareil.ip}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  id="outlined-search"
                  label="Port"
                  type="search"
                  variant="outlined"
                  name="port"
                  value={newAppareil.port}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Statut</InputLabel>
                  <Select
                    label="Statut"
                    name="status"
                    value={newAppareil.status}
                    onChange={handleChange}
                  >
                    <MenuItem value="Connecte">Connecté</MenuItem>
                    <MenuItem value="Non Connecte">Non Connecté</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>
          <Box mt={3} display="flex" justifyContent="space-between">
            <Button
              variant="outlined"
              onClick={() => setNewAppareil(new Appareil("", "", "", ""))}
            >
              Réinitialiser
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddAppareil}
            >
              Enregistrer
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Edit Modal */}
      <Modal open={openEditModal} onClose={() => setOpenEditModal(false)}>
        <Box className={classes.modalStyle}>
        <Box sx={{display:"flex",justifyContent:"space-between"}}>

<Typography variant="h5" fontWeight="bold"sx={{mb:3}} gutterBottom>
  Ajouter Appareil
</Typography>
<CloseIcon onClick={()=> setOpenEditModal(false)} />
</Box>
          
          <Box className={classes.contentContainer}>
          <Divider sx={{ mb: 2 }} />

            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  id="outlined-search"
                  label="Nom"
                  type="search"
                  variant="outlined"
                  name="nom"
                  value={editAppareil.nom}
                  onChange={handleInputModifyChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  id="outlined-search"
                  label="Adresse IP"
                  type="search"
                  variant="outlined"
                  name="ip"
                  value={editAppareil.ip}
                  onChange={handleInputModifyChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  id="outlined-search"
                  label="Port"
                  type="search"
                  variant="outlined"
                  name="port"
                  value={editAppareil.port}
                  onChange={handleInputModifyChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Statut</InputLabel>
                  <Select
                    label="Statut"
                    name="status"
                    value={editAppareil.status}
                    onChange={handleInputModifyChange}
                  >
                    <MenuItem value="Connecte">Connecté</MenuItem>
                    <MenuItem value="Non Connecte">Non Connecté</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>
          <Box mt={3} display="flex" justifyContent="space-between">
            <Button
              variant="outlined"
              onClick={() => setEditAppareil(new Appareil("", "", "", ""))}
            >
              Réinitialiser
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleUpdateAppareil}
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
            Êtes-vous sûr de vouloir supprimer cet appareil ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)} color="primary">
            Annuler
          </Button>
          <Button
            onClick={() => handleDelete(appareilToDelete)}
            color="primary"
            autoFocus
          >
            Oui
          </Button>
        </DialogActions>
      </Dialog>

      <DataGrid
        apiRef={apiRef}
        rows={appareils}
        columns={columns}
        pageSize={5}
        hideScrollbar={true}
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

<Dialog
  open={openDeleteDialog}
  onClose={() => setOpenDeleteDialog(false)}
>
  <DialogTitle>Confirmer la suppression</DialogTitle>
  <DialogContent>
    <DialogContentText>
      Êtes-vous sûr de vouloir supprimer cet appareil ?
    </DialogContentText>
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setOpenDeleteDialog(false)} color="primary">
      Annuler
    </Button>
    <Button onClick={confirmDeleteAppareil} color="primary" autoFocus>
      Oui
    </Button>
  </DialogActions>
</Dialog>
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