import React, { useEffect, useState } from "react";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import {
  Container,
  Button,
  Box,
  IconButton
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
  }
}));

export default function Department() {
  const [departements, setDepartements] = useState([]);
  const [open, setOpen] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [newDepartment, setNewDepartment] = useState(new Departement("", ""));
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

  const handleView = (id) => {
    // Logic for viewing the department
    console.log("View department with id:", id);
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
          Ajouter Departement
        </Button>
      </Box>

      <DataGrid
        rows={departements}
        columns={columns}
        pageSize={5}
        disableSelectionOnClick
        checkboxSelection={false}
      />
    </Container>
  );
}