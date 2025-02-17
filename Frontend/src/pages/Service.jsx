import React, { useEffect, useState } from "react";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import {Container,Button,Box,IconButton,Modal,Typography,Divider,Grid} from "@mui/material";import { makeStyles } from "@mui/styles";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
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

export default function Service() {
  const [departements, setDepartements] = useState([]);
  const [services, setServices] = useState([]);
  const [open, setOpen] = useState(false);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [newDepartment, setNewDepartment] = useState(new Departement("", ""));
  const [selectedService, setSelectedService] = useState(null);
  const classes = useStyles();
  
  useEffect(() => {
  
    const fetchDepartements = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/departement/departements/");
        const formattedDepartements = response.data.map((dept) => ({
          id: dept.id,
          nom: dept.nom,
        }));
        setDepartements(formattedDepartements);
        console.log("Departements fetched:", formattedDepartements);
      } catch (error) {
        console.error("Error fetching departements:", error);
      }
    };
    
    const fetchServices = async () => {
      try {
        const deptResponse = await axios.get("http://127.0.0.1:8000/api/departement/departements/");
        const departements = deptResponse.data.map((dept) => ({
          id: dept.id,
          nom: dept.nom,
        }));
    
        const response = await axios.get("http://127.0.0.1:8000/api/service/services/");
        console.log("API response for services:", response.data);
        const formattedServices = response.data.map((service) => {
          const matchingDept = departements.find((dept) => dept.id === service.departement);
          return {
            id: service.id,
            ...service,
            departement: matchingDept ? matchingDept.nom : "N/A",
          };
        });
        setServices(formattedServices);
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };
     
  
    fetchDepartements();
    fetchServices();
  }, []);
  
  const handleView = (service) => {
    setSelectedService(service);
    setOpenViewModal(true);  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/service/services/${id}/`);
      console.log("Deleted service with id:", id);
      setServices((prev) => prev.filter((service) => service.id !== id));
    } catch (error) {
      console.error("Error deleting service:", error);
    }
  };

  const columns = [
    { field: "id", headerName: "id", width: 100 },
    { field: "nom", headerName: "Nom", width: 350 },
    { field: "departement", headerName: "Departement", width: 350 },
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
          Ajouter Service
        </Button>
      </Box>

      <Modal open={openViewModal} onClose={() => setOpenViewModal(false)}>
        <Box className={classes.modalStyle}>
          <Typography variant="h6" gutterBottom>
            Détails du Service
          </Typography>
          <Divider sx={{ mb: 2 }} />
          {selectedService && (
            <Box className={classes.contentContainer}>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <Typography variant="subtitle1">
                    <strong>ID:</strong> {selectedService.id}
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="subtitle1">
                    <strong>Nom:</strong> {selectedService.nom}
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="subtitle1">
                    <strong>Département:</strong> {selectedService.departement}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          )}
        </Box>
      </Modal>

      <DataGrid
        rows={services}
        columns={columns}
        pageSize={5}
        disableSelectionOnClick
        checkboxSelection={false}
      />
    </Container>
  );
}
