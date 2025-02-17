import React, { useEffect, useState } from "react";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import { Container, Button, Box, IconButton } from "@mui/material";
import { makeStyles } from "@mui/styles";
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
}));

export default function Service() {
  const [departements, setDepartements] = useState([]);
  const [services, setServices] = useState([]);
  const [open, setOpen] = useState(false);
  const [newDepartment, setNewDepartment] = useState(new Departement("", ""));
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
  
  const handleView = (id) => {
    console.log("View service with id:", id);
  };

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
          <IconButton onClick={() => handleView(params.row.id)}>
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
