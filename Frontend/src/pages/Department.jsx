import React, { useEffect, useState } from "react";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import {
  Container,
  Button,
  Box,
  IconButton,
  Modal,
  Typography,
  Divider,
  Grid
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import Departement from "../models/departement";

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
    height: 150,
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
  }
}));

export default function Department() {
  const [departements, setDepartements] = useState([]);
  const [open, setOpen] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [newDepartment, setNewDepartment] = useState(new Departement("", ""));
  const [openViewModal, setOpenViewModal] = useState(false);
  const [selectedDepartement, setSelectedDepartement] = useState(null);
  const classes = useStyles();

  useEffect(() => {
    // Fetch departments data
    const fetchDepartements = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/departement/departements/"
        );
        const formattedDepartments = response.data.map((dept) => new Departement(dept.id, dept.nom));
        setDepartements(formattedDepartments);
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    };

    fetchDepartements();
  }, [refresh]);

  const handleView = (departement) => {
    setSelectedDepartement(departement);
    setOpenViewModal(true);
  };
  
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/departement/departements/${id}/`);
      console.log("Deleted department with id:", id);
      setRefresh(prev => !prev); // Toggle refresh state to trigger useEffect
    } catch (error) {
      console.error("Error deleting department:", error);
    }
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
          <IconButton onClick={() => handleView(params.row)}>
            <VisibilityIcon />
          </IconButton>
          <IconButton onClick={() => handleDelete(params.row.id)}>
            <DeleteIcon />
          </IconButton>
        </>
      ),
    },
  ];

  return (
    <Container className={classes.container}>
      <Box className={classes.topBar}>
        <Button variant="contained" onClick={() => setOpen(true)}>
          Ajouter Departement
        </Button>
      </Box>

      <Modal open={openViewModal} onClose={() => setOpenViewModal(false)}>
        <Box className={classes.modalStyle}>
          <Typography variant="h6" gutterBottom>
            Détails du Departement
          </Typography>
          <Divider sx={{ mb: 2 }} />
          {selectedDepartement && (
            <Box className={classes.contentContainer}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="subtitle1">
                    <strong>ID:</strong> {selectedDepartement.id}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle1">
                    <strong>Nom:</strong> {selectedDepartement.nom}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          )}
        </Box>
      </Modal>

      <DataGrid
        rows={departements}
        columns={columns}
        pageSize={5}
        disableSelectionOnClick
        checkboxSelection={false}
        getRowId={(row) => row.id}
      />
    </Container>
  );
}