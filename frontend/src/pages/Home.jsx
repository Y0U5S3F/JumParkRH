import React, { useEffect, useState } from "react";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import { Container, TextField, Button, Box, Modal, Typography, MenuItem, Divider, Grid } from "@mui/material";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles(() => ({
  container: { padding: "20px", display: 'flex', flexDirection: 'column' },
  topBar: { display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: '10px' },
  modalStyle: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 700,
    backgroundColor: 'black',
    boxShadow: 24,
    p: 4,
    padding: '20px',
  },
  formContainer: { display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '10px' },
}));

export default function Home() {
  const [employees, setEmployees] = useState([]);
  const [open, setOpen] = useState(false);
  const [newEmployee, setNewEmployee] = useState({});
  const classes = useStyles();

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/employe/employes/");
        const formattedEmployees = response.data.map(emp => ({
          id: emp.matricule,
          ...emp,
          departement: emp.departement ? emp.departement.nom : "N/A",
          service: emp.service ? emp.service.nom : "N/A"
        }));
        setEmployees(formattedEmployees);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };
    fetchEmployees();
  }, []);

  const handleInputChange = (e) => {
    setNewEmployee({ ...newEmployee, [e.target.name]: e.target.value });
  };

  const handleAddEmployee = async () => {
    try {
      await axios.post("http://127.0.0.1:8000/api/employe/create/", newEmployee);
      setOpen(false);
      setNewEmployee({});
    } catch (error) {
      console.error("Error adding employee:", error);
    }
  };

  const columns = [
    { field: "matricule", headerName: "Matricule", width: 150 },
    { field: "nom", headerName: "Nom", width: 150 },
    { field: "prenom", headerName: "Prénom", width: 150 },
    { field: "email", headerName: "Email", width: 180 },
    { field: "role", headerName: "Role", width: 150 },
    { field: "departement", headerName: "Département", width: 150 },
    { field: "service", headerName: "Service", width: 150 },
  ];

  return (
    <Container className={classes.container}>
      <Box className={classes.topBar}>
        <Button variant='contained' onClick={() => setOpen(true)}>Ajouter Employé</Button>
      </Box>
      
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box className={classes.modalStyle}>
          <Typography variant="h6" gutterBottom>Veuillez saisir les coordonnées de vos personnels</Typography>
          <Divider sx={{ mb: 2 }} />
          
          <Grid container spacing={2}>
            <Grid item xs={6}><TextField label="Nom" name="nom" fullWidth onChange={handleInputChange} /></Grid>
            <Grid item xs={6}><TextField label="Prénom" name="prenom" fullWidth onChange={handleInputChange} /></Grid>
            <Grid item xs={6}><TextField label="Email" name="email" fullWidth onChange={handleInputChange} /></Grid>
            <Grid item xs={6}><TextField label="Matricule" name="matricule" fullWidth onChange={handleInputChange} /></Grid>
            <Grid item xs={6}><TextField label="Rôle" name="role" select fullWidth onChange={handleInputChange}>
              <MenuItem value="Admin">Admin</MenuItem>
              <MenuItem value="Manager">Manager</MenuItem>
              <MenuItem value="Employé">Employé</MenuItem>
            </TextField></Grid>
          </Grid>
          
          <Box mt={3} display="flex" justifyContent="space-between">
            <Button variant="outlined" onClick={() => setNewEmployee({})}>Réinitialiser</Button>
            <Button variant="contained" color="primary" onClick={handleAddEmployee}>Enregistrer</Button>
          </Box>
        </Box>
      </Modal>
      
      <DataGrid rows={employees} columns={columns} pageSize={5} checkboxSelection />
    </Container>
  );
}