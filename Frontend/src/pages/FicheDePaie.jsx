import { useState, useEffect } from "react";
import {
  DataGrid,
  useGridApiRef,
  DEFAULT_GRID_AUTOSIZE_OPTIONS,
} from "@mui/x-data-grid";
import DescriptionIcon from "@mui/icons-material/Description";
import CloseIcon from '@mui/icons-material/Close';
import dayjs from "dayjs";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";
import AddIcon from "@mui/icons-material/Add";

import {
  Container,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogActions,
  DialogTitle,
  TextField,
  Button,
  Box,
  FormControl,
  Autocomplete,
  IconButton,
  Modal,
  Divider,
  InputLabel,
  MenuItem,
  Snackbar,
  Alert,
  Select,
  Typography,
  Paper,
  Grid,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import { fetchMinimalEmployes } from "../service/EmployeService";
import { fetchEmployeeSalaryInfo } from "../service/FicheDePaieService";
import {
  addSalaire,
  fetchSalaires,
  downloadSalaire,
  deleteSalaire,
} from "../service/SalaireService"; // Import addSalaire function
import FicheDePaie from "../models/ficheDePaie";
import { makeStyles } from "@mui/styles";

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
    width: 1000,
    height: 450,
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
    paddingRight: "10px", 
    scrollbarWidth: "none", 
    "&::-webkit-scrollbar": {
      display: "none", 
    },
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

  boxRight: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px",
  },
  titleContainer: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    fontWeight: "bold",
  },
}));

export default function FicheDePaiePage() {
  const [open, setOpen] = useState(false); // State to manage modal open/close

  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [ficheDePaieData, setFicheDePaieData] = useState(new FicheDePaie());
  const classes = useStyles();
  const apiRef = useGridApiRef();
  const [loading, setLoading] = useState(true);
  const [salaires, setSalaires] = useState([]);

  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: "",
    message: "",
  });

  const [pageTitle, setPageTitle] = useState("Fiche de paie");

  useEffect(() => {
    document.title = pageTitle; // Update the document title
  }, [pageTitle]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [employeesData, salairesData] = await Promise.all([
          fetchMinimalEmployes(),
          fetchSalaires(),
        ]);
        setEmployees(employeesData);
        console.log("Fetched salaires:", salairesData);
        setSalaires(salairesData);
      } catch (error) {
        console.error("Erreur lors du chargement des employés:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const columns = [
    { field: "id", headerName: "id", flex: 0.5 },
    { field: "employe", headerName: "Matricule", flex: 1 },
    { field: "salaire_net", headerName: "Salaire Net", flex: 1 },
    { field: "mode_paiement", headerName: "Mode de Paiement", flex: 1 },
    {
      field: "created_at",
      headerName: "Date (Mois:Année)",
      flex: 1,
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 0.6,
      renderCell: (params) => (
        <div style={{ display: "flex" }}>
          <IconButton onClick={() => console.log("edit", params.row.id)}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleDelete(params.row.id)}>
            <DeleteIcon />
          </IconButton>
          <IconButton onClick={() => handleDownload(params.row.id)}>
            <DownloadIcon />
          </IconButton>
        </div>
      ),
    },
  ];

  const handleEmployeeChange = async (event, newValue) => {
    setSelectedEmployee(newValue);
    if (newValue) {
      try {
        const salaryInfo = await fetchEmployeeSalaryInfo(newValue.matricule);
        const updatedData = new FicheDePaie(
          newValue,
          salaryInfo.salaire_base,
          salaryInfo.jour_heure_travaille,
          salaryInfo.salaire,
          salaryInfo.taux_heure_sup,
          salaryInfo.heures_sup,
          salaryInfo.prix_tot_sup,
          salaryInfo.prime_transport,
          salaryInfo.prime_presence,
          salaryInfo.acompte,
          salaryInfo.impots,
          salaryInfo.apoint,
          salaryInfo.css,
          salaryInfo.cnss,
          salaryInfo.jour_ferie,
          salaryInfo.prix_jour_ferie,
          salaryInfo.prix_tot_ferie,
          salaryInfo.conge_paye,
          salaryInfo.jour_abcense,
          salaryInfo.prix_conge_paye,
          salaryInfo.prix_tot_conge,
          salaryInfo.salaire_brut,
          salaryInfo.salaire_imposable,
          salaryInfo.salaire_net,
          salaryInfo.mode_paiement
        );
        setFicheDePaieData(calculateSalary(updatedData));
        console.log(
          "Informations de salaire chargées avec succès:",
          salaryInfo
        );
      } catch (error) {
        console.error(
          "Erreur lors du chargement des informations de salaire:",
          error
        );
      }
    }
  };

  const calculateSalary = (data) => {
    const salaire_base = parseFloat(data.salaire_base);
    const jour_heure_travaille = parseFloat(data.jour_heure_travaille);
    const taux_heure_sup = parseFloat(data.taux_heure_sup);
    const prix_jour_ferie = parseFloat(data.prix_jour_ferie);
    const prix_conge_paye = parseFloat(data.prix_conge_paye);
    const acompte = parseFloat(data.acompte);
    const impots = parseFloat(data.impots);
    const apoint = parseFloat(data.apoint);

    const taux_heure_base = salaire_base / 208;
    const jour_travaille = Math.floor(jour_heure_travaille / 8);

    if (jour_heure_travaille < 208) {
      const heures_manquantes = 208 - jour_heure_travaille;
      data.salaire = salaire_base - heures_manquantes * taux_heure_base;
    } else if (jour_heure_travaille > 208) {
      const heures_sup = jour_heure_travaille - 208;
      data.heures_sup = heures_sup;
      data.prix_tot_sup = heures_sup * taux_heure_sup;
      data.salaire = salaire_base + data.prix_tot_sup;
    } else {
      data.salaire = salaire_base;
    }

    data.prime_presence = jour_travaille * (13.339 / jour_travaille) || 0;
    data.prime_transport = jour_travaille * (71.253 / jour_travaille) || 0;
    data.prix_tot_ferie = data.jour_ferie * prix_jour_ferie;
    data.prix_tot_conge = data.conge_paye * prix_conge_paye;
    data.salaire_brut =
      data.salaire +
      data.prime_presence +
      data.prime_transport +
      data.prix_tot_ferie +
      data.prix_tot_conge;
    data.cnss = data.salaire_brut * 0.0968;
    data.salaire_imposable = data.salaire_brut - data.cnss;
    data.css = data.salaire_imposable * 0.005;
    data.salaire_net =
      data.salaire_imposable - (acompte + impots + apoint + data.css);

    return data;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFicheDePaieData((prevData) => {
      const updatedData = { ...prevData, [name]: value };
      return calculateSalary(updatedData);
    });
  };

  const handleDownloadClick = async () => {
    const salaireData = {
      employe: ficheDePaieData.employe.matricule,
      salaire_base: parseFloat(ficheDePaieData.salaire_base).toFixed(2),
      jour_heure_travaille: parseFloat(
        ficheDePaieData.jour_heure_travaille
      ).toFixed(2),
      salaire: parseFloat(ficheDePaieData.salaire).toFixed(2),
      taux_heure_sup: parseFloat(ficheDePaieData.taux_heure_sup).toFixed(2),
      heures_sup: parseFloat(ficheDePaieData.heures_sup).toFixed(2),
      prix_tot_sup: parseFloat(ficheDePaieData.prix_tot_sup).toFixed(2),
      prime_transport: parseFloat(ficheDePaieData.prime_transport).toFixed(2),
      prime_presence: parseFloat(ficheDePaieData.prime_presence).toFixed(2),
      acompte: parseFloat(ficheDePaieData.acompte).toFixed(2),
      impots: parseFloat(ficheDePaieData.impots).toFixed(2),
      apoint: parseFloat(ficheDePaieData.apoint).toFixed(2),
      css: parseFloat(ficheDePaieData.css).toFixed(2),
      cnss: parseFloat(ficheDePaieData.cnss).toFixed(2),
      jour_ferie: ficheDePaieData.jour_ferie,
      prix_jour_ferie: parseFloat(ficheDePaieData.prix_jour_ferie).toFixed(2),
      prix_tot_ferie: parseFloat(ficheDePaieData.prix_tot_ferie).toFixed(2),
      conge_paye: ficheDePaieData.conge_paye,
      jour_abcense: ficheDePaieData.jour_abcense,
      prix_conge_paye: parseFloat(ficheDePaieData.prix_conge_paye).toFixed(2),
      prix_tot_conge: parseFloat(ficheDePaieData.prix_tot_conge).toFixed(2),
      salaire_brut: parseFloat(ficheDePaieData.salaire_brut).toFixed(2),
      salaire_imposable: parseFloat(ficheDePaieData.salaire_imposable).toFixed(
        2
      ),
      salaire_net: parseFloat(ficheDePaieData.salaire_net).toFixed(2),
      mode_paiement: ficheDePaieData.mode_paiement,
    };
    console.log("Données de salaire à ajouter:", salaireData);
    try {
      await addSalaire(salaireData);
      console.log("Salaire ajouté avec succès");
    } catch (error) {
      console.error("Erreur lors de l'ajout du salaire:", error);
    }
  };

  const handleDownload = async (salaireId) => {
    try {
      await downloadSalaire(salaireId);
    } catch (error) {
      console.error("Error downloading salaire:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteSalaire(id); 
      setSnackbar({
        open: true,
        severity: "success",
        message: "Salaire supprimé avec succès!",
      });
      setSalaires((prev) => prev.filter((salaire) => salaire.id !== id)); 
    } catch (error) {
      console.error("Error deleting salaire:", error);
      setSnackbar({
        open: true,
        severity: "error",
        message: "Erreur lors de la suppression du salaire.",
      });
    }
  };

  return (
    <Container className={classes.container}>
      <Box className={classes.topBar}>
        <Box className={classes.titleContainer}>
          <DescriptionIcon />
          <Typography variant="h6" fontWeight="bold">
            Fiche de Paie
          </Typography>
        </Box>
        <Button
          size="medium"
          variant="outlined"
          startIcon={<AddIcon />}
          sx={{
            "&:hover": {
              backgroundColor: (theme) => theme.palette.primary.main,
              color: "white",
              borderColor: (theme) => theme.palette.primary.main,
            },
          }}
          onClick={() => setOpen(true)}
        >
          Ajouter Fiche de Paie
        </Button>
      </Box>

      <Modal open={open} onClose={() => setOpen(false)}>
        <Box className={classes.modalStyle}>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography
              variant="h5"
              fontWeight="bold"
              sx={{ mb: 3 }}
              gutterBottom
            >
              Ajouter fiche de paie
            </Typography>
            <CloseIcon
              onClick={() => setOpen(false)}
              sx={{
                "&:hover": {
                  backgroundColor: "rgba(0, 0, 0, 0.9)", // Transparent background
                  borderRadius: "50%", // Circular shape
                },
              }}
            />
          </Box>
          <Box className={classes.contentContainer}>
          <Divider sx={{ mb: 2 }} />

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
                  onChange={handleEmployeeChange}
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
                  name="salaire_base"
                  value={parseFloat(ficheDePaieData.salaire_base).toFixed(2)}
                  onChange={handleInputChange}
                  disabled
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  size="small"
                  label="Jour/Heure travaillée"
                  fullWidth
                  variant="outlined"
                  name="jour_heure_travaille"
                  value={parseFloat(
                    ficheDePaieData.jour_heure_travaille
                  ).toFixed(2)}
                  onChange={handleInputChange}
                  disabled
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  size="small"
                  label="Salaire"
                  fullWidth
                  variant="outlined"
                  name="salaire"
                  value={parseFloat(ficheDePaieData.salaire).toFixed(2)}
                  onChange={handleInputChange}
                  disabled
                />
              </Grid>

              {/* Heures Supplémentaires */}
              <Grid item xs={4}>
                <TextField
                  size="small"
                  label="Prix Heure Supplémentaire"
                  fullWidth
                  variant="outlined"
                  name="taux_heure_sup"
                  value={parseFloat(ficheDePaieData.taux_heure_sup).toFixed(2)}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  size="small"
                  label="Nombre d'heures supp."
                  fullWidth
                  variant="outlined"
                  name="heures_sup"
                  value={parseFloat(ficheDePaieData.heures_sup).toFixed(2)}
                  onChange={handleInputChange}
                  disabled
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  size="small"
                  label="Prix Total Supplémentaires"
                  fullWidth
                  variant="outlined"
                  name="prix_tot_sup"
                  value={parseFloat(ficheDePaieData.prix_tot_sup).toFixed(2)}
                  onChange={handleInputChange}
                  disabled
                />
              </Grid>

              {/* Primes et Deductions */}
              <Grid item xs={4}>
                <TextField
                  size="small"
                  label="Prime de présence"
                  fullWidth
                  variant="outlined"
                  name="prime_presence"
                  value={parseFloat(ficheDePaieData.prime_presence).toFixed(2)}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  size="small"
                  label="Prime de transport"
                  fullWidth
                  variant="outlined"
                  name="prime_transport"
                  value={parseFloat(ficheDePaieData.prime_transport).toFixed(2)}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  size="small"
                  label="Acompte"
                  fullWidth
                  variant="outlined"
                  name="acompte"
                  value={parseFloat(ficheDePaieData.acompte).toFixed(2)}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  size="small"
                  label="Impôts"
                  fullWidth
                  variant="outlined"
                  name="impots"
                  value={parseFloat(ficheDePaieData.impots).toFixed(2)}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  size="small"
                  label="Apoint"
                  fullWidth
                  variant="outlined"
                  name="apoint"
                  value={parseFloat(ficheDePaieData.apoint).toFixed(2)}
                  onChange={handleInputChange}
                />
              </Grid>
              {/* Mode de paiement */}
              <Grid item xs={4}>
                <FormControl size="small" fullWidth>
                  <InputLabel>Mode de paiement</InputLabel>
                  <Select
                    label="Mode de paiement"
                    name="mode_paiement"
                    value={ficheDePaieData.mode_paiement}
                    onChange={handleInputChange}
                  >
                    <MenuItem value="virement bancaire">
                      Virement Bancaire
                    </MenuItem>
                    <MenuItem value="cheque">Chèque</MenuItem>
                    <MenuItem value="espece">Espèces</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* CNSS & CSS */}
              <Grid item xs={6}>
                <Typography variant="body1">
                  CNSS: {parseFloat(ficheDePaieData.cnss).toFixed(2)}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body1">
                  CSS: {parseFloat(ficheDePaieData.css).toFixed(2)}
                </Typography>
              </Grid>

              {/* Congés et Jours Fériés */}
              <Grid item xs={4}>
                <TextField
                  size="small"
                  label="Jours fériés"
                  fullWidth
                  variant="outlined"
                  name="jour_ferie"
                  value={parseFloat(ficheDePaieData.jour_ferie).toFixed(2)}
                  onChange={handleInputChange}
                  disabled
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  size="small"
                  label="Prix jours fériés"
                  fullWidth
                  variant="outlined"
                  name="prix_jour_ferie"
                  value={parseFloat(ficheDePaieData.prix_jour_ferie).toFixed(2)}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  size="small"
                  label="Total jours fériés"
                  fullWidth
                  variant="outlined"
                  name="prix_tot_ferie"
                  value={parseFloat(ficheDePaieData.prix_tot_ferie).toFixed(2)}
                  onChange={handleInputChange}
                  disabled
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  size="small"
                  label="Congés payés"
                  fullWidth
                  variant="outlined"
                  name="conge_paye"
                  value={parseFloat(ficheDePaieData.conge_paye).toFixed(2)}
                  onChange={handleInputChange}
                  disabled
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  size="small"
                  label="Prix congés payés"
                  fullWidth
                  variant="outlined"
                  name="prix_conge_paye"
                  value={parseFloat(ficheDePaieData.prix_conge_paye).toFixed(2)}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  size="small"
                  label="Total congés payés"
                  fullWidth
                  variant="outlined"
                  name="prix_tot_conge"
                  value={parseFloat(ficheDePaieData.prix_tot_conge).toFixed(2)}
                  onChange={handleInputChange}
                  disabled
                />
              </Grid>

              {/* Absences */}
              <Grid item xs={4}>
                <Typography variant="body1">
                  Jours absence:{" "}
                  {parseFloat(ficheDePaieData.jour_abcense).toFixed(2)}
                </Typography>
              </Grid>
            </Grid>
          </Box>
          {/* Bouton Télécharger */}
          <Box className={classes.actionContainer}>
            {/* Total Salary */}
            <Box className={classes.boxLeft}>
              Total: {parseFloat(ficheDePaieData.salaire_net).toFixed(2)}€
            </Box>

            {/* Buttons */}
            <Box className={classes.boxRight}>
              <Button variant="outlined" color="secondary">
                Réinitialiser
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleDownloadClick}
              >
                Télécharger
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>

      <DataGrid
        apiRef={apiRef}
        rows={salaires}
        columns={columns}
        pageSize={5}
        disableRowSelectionOnClick
        disableMultipleRowSelection
        loading={loading}
        pagination
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
