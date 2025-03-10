import { useState, useEffect } from "react";
import {
  Container,
  TextField,
  Button,
  Box,
  FormControl,
  Autocomplete,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  Paper,
  Grid,
} from "@mui/material";
import { fetchMinimalEmployes } from "../service/EmployeService";

import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
  container: { padding: "20px", display: "flex", flexDirection: "column" },
  topBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "10px",
  },
  formContainer: {
    padding: "20px",
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary,
  },
  actionContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "16px",
  },
  boxLeft: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    fontWeight: "bold",
    fontSize: "16px",
  },
  boxRight: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px",
  },
}));

export default function FicheDePaie() {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [salaireBase, setSalaireBase] = useState("");
  const [nbJours, setNbJours] = useState("");
  const [nbHeures, setNbHeures] = useState("");
  const [salaireFinal, setSalaireFinal] = useState("");
  const [jourHeureTravail, setJourHeureTravail] = useState("");
  const [salaire, setSalaire] = useState("");
  const [prixHeureSupp, setPrixHeureSupp] = useState("");
  const [nbHeuresSupp, setNbHeuresSupp] = useState("");
  const [prixTotalSupp, setPrixTotalSupp] = useState("");
  const [primePresence, setPrimePresence] = useState("");
  const [primeTransport, setPrimeTransport] = useState("");
  const [acompte, setAcompte] = useState("");
  const [impots, setImpots] = useState("");
  const [apoint, setApoint] = useState("");
  const [methodePaiement, setMethodePaiement] = useState("");
  const [joursFeries, setJoursFeries] = useState("");
  const [prixJoursFeries, setPrixJoursFeries] = useState("");
  const [congesPayes, setCongesPayes] = useState("");
  const [prixCongesPayes, setPrixCongesPayes] = useState("");
  const classes = useStyles();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const employeesData = await fetchMinimalEmployes();
        setEmployees(employeesData);
      } catch (error) {
        console.error("Erreur lors du chargement des employés:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <Container className={classes.container}>
      <Box className={classes.topBar}>
        <Typography variant="h5" gutterBottom>
          Fiche de Paie
        </Typography>
      </Box>
      <Paper elevation={3} className={classes.formContainer}>
        <Grid container spacing={2}>
          {/* Employé */}
          <Grid item xs={12}>
            <Autocomplete
              size="small"
              options={employees}
              getOptionLabel={(option) =>
                `${option.nom} ${option.prenom} (${option.matricule})`
              }
              onInputChange={(event, value) => setSearchTerm(value)}
              onChange={(event, newValue) => setSelectedEmployee(newValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Employé"
                  variant="outlined"
                  fullWidth
                />
              )}
            />
          </Grid>

          {/* Salaire Base & Temps */}
          <Grid item xs={4}>
            <TextField
              size="small"
              label="Salaire de base"
              fullWidth
              variant="outlined"
              value={salaireBase}
              onChange={(e) => setSalaireBase(e.target.value)}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              size="small"
              label="Jour/Heure travaillée"
              fullWidth
              variant="outlined"
              value={jourHeureTravail}
              onChange={(e) => setJourHeureTravail(e.target.value)}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              size="small"
              label="Salaire"
              fullWidth
              variant="outlined"
              value={salaire}
              onChange={(e) => setSalaire(e.target.value)}
            />
          </Grid>

          {/* Heures Supplémentaires */}
          <Grid item xs={4}>
            <TextField
              size="small"
              label="Prix Heure Supplémentaire"
              fullWidth
              variant="outlined"
              value={prixHeureSupp}
              onChange={(e) => setPrixHeureSupp(e.target.value)}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              size="small"
              label="Nombre d'heures supp."
              fullWidth
              variant="outlined"
              value={nbHeuresSupp}
              onChange={(e) => setNbHeuresSupp(e.target.value)}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              size="small"
              label="Prix Total Supplémentaires"
              fullWidth
              variant="outlined"
              value={prixTotalSupp}
              onChange={(e) => setPrixTotalSupp(e.target.value)}
            />
          </Grid>

          {/* Primes et Deductions */}
          <Grid item xs={4}>
            <TextField
              size="small"
              label="Prime de présence"
              fullWidth
              variant="outlined"
              value={primePresence}
              onChange={(e) => setPrimePresence(e.target.value)}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              size="small"
              label="Prime de transport"
              fullWidth
              variant="outlined"
              value={primeTransport}
              onChange={(e) => setPrimeTransport(e.target.value)}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              size="small"
              label="Acompte"
              fullWidth
              variant="outlined"
              value={acompte}
              onChange={(e) => setAcompte(e.target.value)}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              size="small"
              label="Impôts"
              fullWidth
              variant="outlined"
              value={impots}
              onChange={(e) => setImpots(e.target.value)}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              size="small"
              label="Apoint"
              fullWidth
              variant="outlined"
              value={apoint}
              onChange={(e) => setApoint(e.target.value)}
            />
          </Grid>

          {/* CNSS & CSS */}
          <Grid item xs={6}>
            <Typography variant="body1">CNSS: Automatique</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body1">CSS: Automatique</Typography>
          </Grid>

          {/* Congés et Jours Fériés */}
          <Grid item xs={3}>
            <TextField
              size="small"
              label="Jours fériés"
              fullWidth
              variant="outlined"
              value={joursFeries}
              onChange={(e) => setJoursFeries(e.target.value)}
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              size="small"
              label="Prix jours fériés"
              fullWidth
              variant="outlined"
              value={prixJoursFeries}
              onChange={(e) => setPrixJoursFeries(e.target.value)}
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              size="small"
              label="Congés payés"
              fullWidth
              variant="outlined"
              value={congesPayes}
              onChange={(e) => setCongesPayes(e.target.value)}
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              size="small"
              label="Prix congés payés"
              fullWidth
              variant="outlined"
              value={prixCongesPayes}
              onChange={(e) => setPrixCongesPayes(e.target.value)}
            />
          </Grid>

          {/* Mode de paiement */}
          <Grid item xs={12}>
            <FormControl size="small" fullWidth>
              <InputLabel>Mode de paiement</InputLabel>
              <Select
                label="Mode de paiement"
                value={methodePaiement}
                onChange={(e) => setMethodePaiement(e.target.value)}
              >
                <MenuItem value="virement">Virement Bancaire</MenuItem>
                <MenuItem value="cheque">Chèque</MenuItem>
                <MenuItem value="espece">Espèces</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        {/* Bouton Télécharger */}
        <Box className={classes.actionContainer}>
          {/* Total Salary */}
          <Box className={classes.boxLeft}>Total: 3000€</Box>

          {/* Buttons */}
          <Box className={classes.boxRight}>
            <Button variant="outlined" color="secondary">
              Réinitialiser
            </Button>
            <Button variant="contained" color="primary">
              Télécharger
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}
