import React, { useEffect, useState } from "react";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import { Container, TextField, Button, Box, Modal, Typography, MenuItem, Divider, Grid2, Select, FormControl,InputLabel } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';


const useStyles = makeStyles(() => ({
  container: { padding: "20px", display: 'flex', flexDirection: 'column' },
  topBar: { display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: '10px' },
  modalStyle: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 1000,
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
        console.log("Employees fetched:", formattedEmployees);
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
          <Typography variant="body1" color="white" gutterBottom>Personal Information:</Typography>
          <Divider sx={{ mb: 2 }} />
          <Grid2 container spacing={2}>
            <Grid2 size={4} >
              <TextField
              id="outlined-search"
              label="Matricule"
              type="search"
              variant="outlined"
              fullWidth
              />            
            </Grid2>
            <Grid2 size={4} >
              <TextField
              id="outlined-search"
              label="Nom"
              type="search"
              variant="outlined"
              expanded
              fullWidth
              />
            </Grid2>
            <Grid2 size={4} >
              <TextField
              id="outlined-search"
              label="Prenom"
              type="search"
              variant="outlined"
              expanded
              fullWidth
              />
            </Grid2><Grid2 size={4} >
              <TextField
              id="outlined-search"
              label="Email"
              type="search"
              variant="outlined"
              expanded
              fullWidth
              
              />
      
            </Grid2>
            <Grid2 size={4} >
            <FormControl fullWidth variant="outlined">
          <InputLabel>Role</InputLabel>
          <Select
            label="Role"
            defaultValue=""
            name="role"
          >
            <MenuItem value="Admin">Admin</MenuItem>
            <MenuItem value="Manager">Manager</MenuItem>
            <MenuItem value="Employee">Employee</MenuItem>
          </Select>
        </FormControl>
            </Grid2>
            <Grid2 size={4} >
            <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DatePicker', 'DatePicker']}>
        <DatePicker label="Uncontrolled picker" defaultValue={dayjs('2022-04-17')} />
      </DemoContainer>
    </LocalizationProvider>
          </Grid2>
          </Grid2>
          
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