import React, { useEffect, useState } from "react";
import axios from "axios";
import EditIcon from "@mui/icons-material/Edit";
import {
  DataGrid,
  useGridApiRef,
  DEFAULT_GRID_AUTOSIZE_OPTIONS,
} from "@mui/x-data-grid";
import { updateTypeConge, fetchTypeConges, addTypeConge, deleteTypeConge } from "../service/TypeCongeService";
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
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import DeleteIcon from "@mui/icons-material/Delete";
import TypeConge from "../models/typeConge";

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
    height: 300,
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
}));

export default function TypeCongePage() {
  const [typeConges, setTypeConges] = useState([]);
  const [editTypeConge, setEditTypeConge] = useState(new TypeConge("", ""));
  const [open, setOpen] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [loading, setLoading] = useState(true);
  const [expand, setExpand] = useState(DEFAULT_GRID_AUTOSIZE_OPTIONS.expand);
  const apiRef = useGridApiRef();
  const [newTypeConge, setNewTypeConge] = useState(new TypeConge("", ""));
  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: "",
    message: "",
  });
  const classes = useStyles();

  useEffect(() => {
    // Fetch types of leave data
    const fetchTypeCongesData = async () => {
      setLoading(true);
      try {
        const response = await fetchTypeConges();
        const formattedTypeConges = response.map(
          (typeConge) => new TypeConge(typeConge.id, typeConge.nom)
        );
        setTypeConges(formattedTypeConges);
      } catch (error) {
        console.error("Error fetching types of leave:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTypeCongesData();
  }, [refresh]);

  const handleEdit = (typeConge) => {
    setEditTypeConge(typeConge);
    setOpenEditModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTypeConge((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateTypeConge = async (e) => {
    e.preventDefault();
    try {
      await updateTypeConge(editTypeConge.id, editTypeConge);
      setSnackbar({
        open: true,
        severity: "success",
        message: "Type de congé mis à jour avec succès!",
      });

      setTypeConges((prev) =>
        prev.map((typeConge) => (typeConge.id === editTypeConge.id ? editTypeConge : typeConge))
      );

      setOpenEditModal(false);
      setRefresh((prev) => !prev);
    } catch (error) {
      setSnackbar({
        open: true,
        severity: "error",
        message: "Échec de la mise à jour du type de congé.",
      });
    }
  };

  const handleAddTypeConge = async () => {
    try {
      if (!newTypeConge.nom.trim()) {
        setSnackbar({
          open: true,
          severity: "error",
          message: "Le nom du type de congé est requis.",
        });
        return;
      }

      // Create type of leave object
      const typeCongeToSend = new TypeConge("", newTypeConge.nom);

      // Send POST request
      const response = await addTypeConge(typeCongeToSend);

      if (response.status === 201) {
        setSnackbar({
          open: true,
          severity: "success",
          message: "Type de congé ajouté avec succès !",
        });
        setOpen(false); // Close modal
        setNewTypeConge(new TypeConge("", "")); // Reset form
        setRefresh((prev) => !prev); // Refresh type of leave list
      } else {
        setSnackbar({
          open: true,
          severity: "error",
          message: "Échec de l'ajout du type de congé.",
        });
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout du type de congé:", error);
      setSnackbar({
        open: true,
        severity: "error",
        message: "Erreur serveur. Veuillez réessayer.",
      });
    }
  };

  const handleInputModifyChange = (e) => {
    const { name, value } = e.target;
    setEditTypeConge((prev) => ({ ...prev, [name]: value }));
  };

  const handleDelete = async (id) => {
    try {
      await deleteTypeConge(id);
      console.log("Deleted type of leave with id:", id);
      setRefresh((prev) => !prev); // Toggle refresh state to trigger useEffect
    } catch (error) {
      console.error("Error deleting type of leave:", error);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const columns = [
    { field: "id", headerName: "id", width: 100 },
    { field: "nom", headerName: "Nom", width: 950 },
    {
      field: "actions",
      headerName: "Actions",
      width: 100,
      renderCell: (params) => (
        <>
          <IconButton onClick={() => handleDelete(params.row.id)}>
            <DeleteIcon />
          </IconButton>
          <IconButton onClick={() => handleEdit(params.row)}>
            <EditIcon /> {/* Add Edit icon */}
          </IconButton>
        </>
      ),
    },
  ];

  return (
    <Container className={classes.container}>
      <Box className={classes.topBar}>
        <Button variant="contained" onClick={() => setOpen(true)}>
          Ajouter Type de Congé
        </Button>
      </Box>

      {/* Add Modal */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box className={classes.modalStyle}>
          <Typography variant="h6" gutterBottom>
            Veuillez saisir les coordonnées du type de congé
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Box className={classes.contentContainer}>
            <Typography variant="body1" gutterBottom>
              Informations du type de congé
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  id="outlined-search"
                  label="Nom"
                  type="search"
                  variant="outlined"
                  name="nom"
                  value={newTypeConge.nom}
                  onChange={handleInputChange}
                  fullWidth
                />
              </Grid>
            </Grid>
          </Box>
          <Box mt={3} display="flex" justifyContent="space-between">
            <Button
              variant="outlined"
              onClick={() => setNewTypeConge(new TypeConge("", ""))}
            >
              Réinitialiser
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddTypeConge}
            >
              Enregistrer
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Update Modal */}
      <Modal open={openEditModal} onClose={() => setOpenEditModal(false)}>
        <Box className={classes.modalStyle}>
          <Typography variant="h6" gutterBottom>
            Veuillez modifier les coordonnées du type de congé
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Box className={classes.contentContainer}>
            <Typography variant="body1" gutterBottom>
              Informations du type de congé
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  id="outlined-search"
                  label="Nom"
                  type="search"
                  variant="outlined"
                  name="nom"
                  value={editTypeConge.nom}
                  onChange={handleInputModifyChange}
                  fullWidth
                />
              </Grid>
            </Grid>
          </Box>
          <Box mt={3} display="flex" justifyContent="space-between">
            <Button
              variant="outlined"
              onClick={() => setEditTypeConge(new TypeConge("", ""))}
            >
              Réinitialiser
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleUpdateTypeConge}
            >
              Enregistrer
            </Button>
          </Box>
        </Box>
      </Modal>

      <DataGrid
        apiRef={apiRef}
        rows={typeConges}
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