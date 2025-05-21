import React, { useState, useEffect } from "react";
import { Scheduler } from "react-employe-attendance-scheduler";
import "react-employe-attendance-scheduler/dist/style.css";
import dayjs from "dayjs";
import ThemeToggle from "../components/ThemeToggle";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { makeStyles } from "@mui/styles";
import CircularProgress from "@mui/material/CircularProgress";
import CloseIcon from "@mui/icons-material/Close";
import { History } from "@mui/icons-material";
import { useThemeToggle } from "../App"; 
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import {
  Container,
  Button,
  Box,
  Modal,
  Typography,
  Divider,
  Snackbar,
  Select,
  Alert,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  TextField,
  Autocomplete,
} from "@mui/material";
import { fetchMinimalEmployes } from "../service/EmployeService";
import {
  addLabel,
  updateLabel,
  deleteLabel,
  importPresence,
  downloadHistory,
} from "../service/LabelDataService"; 
import LabelData from "../models/labelData"; 
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker"; 
import AddIcon from "@mui/icons-material/Add";
import { ACCESS_TOKEN } from "../constants";
import { CloudDownloadRounded, Event } from "@mui/icons-material";

const useStyles = makeStyles((theme) => ({
  container: {
    padding: "20px",
    display: "flex",
    flexDirection: "column",
  },
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
    width: "70%", 
    height: "auto", 
    maxHeight: "70%",
    backgroundColor: `${theme.palette.background.default}`,
    boxShadow: 24,
    border: `1px solid ${theme.palette.primary.main}`,
    padding: "20px",
    borderRadius: "8px",
    display: "flex",
    flexDirection: "column",
    margin: "0 auto",
  },
  loading: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },
  calendar: {
    position: "relative",
    width: "100%",
    height: "85vh",
    overflow: "hidden",
    border: `1px solid ${theme.palette.secondary.main}`,
    borderRadius: "12px",
    margin: "0 auto",
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
  titleContainer: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    fontWeight: "bold",
  },
  formContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    marginTop: "10px",
  },
}));

export default function SimpleCalendar() {
  const [schedulerData, setSchedulerData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTile, setSelectedTile] = useState(null);
  const [openPresenceModal, setOpenPresenceModal] = useState(false); 
  const [openViewModal, setOpenViewModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null); 
  const classes = useStyles();

  const [newPresence, setNewPresence] = useState(
    new LabelData(null, null, null, null, null, null, null)
  ); 
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [isDownloadingHistory, setIsDownloadingHistory] = useState(false);
  const [openHistoryModal, setOpenHistoryModal] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: "",
    message: "",
  });
  const [schedulerKey, setSchedulerKey] = useState(0); 
  const [selectedDate, setSelectedDate] = useState(dayjs()); 
  const [isImportingPresence, setIsImportingPresence] = useState(false);
  const [pageTitle, setPageTitle] = useState("Planning");
  const { isDarkMode } = useThemeToggle(); 

  useEffect(() => {
    document.title = pageTitle; 
  }, [pageTitle]);
  useEffect(() => {
    setSchedulerKey((prevKey) => prevKey + 1);
  }, [isDarkMode]);

  useEffect(() => {
    const fetchLabels = async () => {
      try {
        
        const token =
          localStorage.getItem(ACCESS_TOKEN) ||
          sessionStorage.getItem(ACCESS_TOKEN);
        const response = await fetch(
          "http://127.0.0.1:8000/api/label/labels/?stream=true",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`, 
            },
          }
        );

      
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        const statusColorMapping = {
          Present: "rgba(144, 238, 191, 0.8)", 
          "En Pause": "rgba(169, 223, 216, 0.8)", 
          "En Conge": "rgba(40, 174, 243, 0.8)", 
          Absent: "rgba(242, 109, 91, 0.8)", 
          "Fin de Service": "rgba(199, 162, 255, 0.8)", 
          Anomalie: "rgba(252, 184, 89, 0.8)", 
          "Jour Ferie": "rgba(242, 200, 237, 0.8)", 
        };

        const transformItem = (item) => {
          const transformEvent = (event) => {
            const formatDate = (dateString) =>
              dateString
                ? dayjs(dateString).format("YYYY-MM-DDTHH:mm:ss")
                : null;
            const formatTime = (timeString) =>
              timeString ? dayjs(timeString).format("HH:mm") : null;
            return {
              ...event,
              startDate: formatDate(event.startDate),
              endDate: formatDate(event.endDate),
              title: dayjs(event.startDate).format("HH:mm"),
              subtitle: `${dayjs(event.endDate).format("HH:mm")} - ${event.status}`,
              description:
                event.startPause || event.endPause
                  ? `${event.startPause ? formatTime(event.startPause) : ""}${
                      event.startPause && event.endPause ? " - " : ""
                    }${event.endPause ? formatTime(event.endPause) : ""}`
                  : "pas de pause",
              bgColor: statusColorMapping[event.status] || "#FFFFFF",
            };
          };

          return {
            id: item.id,
            label: { title: item.title, subtitle: item.subtitle },
            data: item.data.map(transformEvent),
          };
        };

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop(); 
          for (const line of lines) {
            if (line.trim()) {
              try {
                const item = JSON.parse(line);
                const transformedItem = transformItem(item);
                setSchedulerData((prevData) => {
                  const existingItem = prevData.find(
                    (data) => data.id === transformedItem.id
                  );
                  if (!existingItem) {
                    return [...prevData, transformedItem];
                  }
                  return prevData;
                });
              } catch (e) {
              }
            }
          }
        }

        if (buffer.trim()) {
          try {
            const item = JSON.parse(buffer);
            const transformedItem = transformItem(item);
            setSchedulerData((prevData) => {
              const existingItem = prevData.find(
                (data) => data.id === transformedItem.id
              );
              if (!existingItem) {
                return [...prevData, transformedItem];
              }
              return prevData;
            });
          } catch (e) {
          }
        }
      } catch (error) {
      }
      setIsLoading(false);
    };

    fetchLabels();
  }, [refresh]);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const employeesData = await fetchMinimalEmployes();
        setEmployees(employeesData);
      } catch (error) {
      }
    };

    fetchEmployees();
  }, []);

  const handleItemClick = (item) => {
    
  };

  const handlePresenceChange = (e) => {
    const { name, value } = e.target;
    setNewPresence((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddPresence = async () => {
    const requiredFieldsMap = {
      présent: ["startDate"],
      "en pause": ["startDate", "startPause"],
      "fin de service": ["startDate", "endDate"],
    };

    const alwaysRequiredFields = ["status", "matricule"];

    const missingFields = [
      ...alwaysRequiredFields,
      ...(requiredFieldsMap[newPresence.status] || []),
    ].filter((field) => !newPresence[field]);

    if (missingFields.length > 0) {
      const fieldNames = {
        status: "Statut",
        matricule: "Employé",
        startDate: "Date de début",
        startPause: "Début de pause",
        endDate: "Date de fin",
      };

      const missingFieldNames = missingFields
        .map((field) => fieldNames[field])
        .join(", ");
      setSnackbar({
        open: true,
        severity: "error",
        message: `Veuillez remplir les champs obligatoires: ${missingFieldNames}.`,
      });
      return;
    }
    try {
      const presenceToSend = {
        startDate: newPresence.startDate,
        endDate: newPresence.endDate,
        startPause: newPresence.startPause,
        endPause: newPresence.endPause,
        status: newPresence.status,
        label: newPresence.label,
      };
      const response = await addLabel(newPresence.matricule, presenceToSend);
      setSnackbar({
        open: true,
        severity: "success",
        message: "Présence ajoutée avec succès!",
      });
      setOpenPresenceModal(false);
      setRefresh((prev) => prev + 1); 
    } catch (error) {
      setSnackbar({
        open: true,
        severity: "error",
        message: `Erreur lors de l'ajout de la présence.${error}`,
      });
    }
  };

  const handleUpdatePresence = async () => {
    try {
      const presenceToUpdate = {
        startDate: selectedTile.startDate,
        endDate: selectedTile.endDate,
        startPause: selectedTile.startPause,
        endPause: selectedTile.endPause,
        status: selectedTile.status.toLowerCase(),
      };
      const response = await updateLabel(selectedTile.id, presenceToUpdate);
      setSnackbar({
        open: true,
        severity: "success",
        message: "Présence mise à jour avec succès!",
      });
      setOpenViewModal(false);
      setRefresh((prev) => prev + 1); 
    } catch (error) {
      setSnackbar({
        open: true,
        severity: "error",
        message: `Erreur lors de la mise à jour de la présence.${error}`,
      });
    }
  };

  const handleDeletePresence = async () => {
    try {
      const response = await deleteLabel(selectedTile.id);
      setSnackbar({
        open: true,
        severity: "success",
        message: "Présence supprimée avec succès!",
      });
      setOpenViewModal(false);
      setRefresh((prev) => prev + 1); 
    } catch (error) {
      setSnackbar({
        open: true,
        severity: "error",
        message: `Erreur lors de la suppression de la présence.${error}`,
      });
    }
  };

  const handleImportPresence = async () => {
    setIsImportingPresence(true); 
    try {
      await importPresence();
      setSnackbar({
        open: true,
        severity: "success",
        message: "Présence importée avec succès!",
      });
      setRefresh((prev) => !prev); 
    } catch (error) {
      setSnackbar({
        open: true,
        severity: "error",
        message: `Erreur lors de l'importation de la présence: ${error.message}`,
      });
    } finally {
      window.location.reload(); 
      setIsImportingPresence(false); 
    }
  };

  const handleDownloadHistory = async () => {
    setIsDownloadingHistory(true); 
    try {
      
      const formattedDate = selectedDate.format("DD/MM/YYYY");
      setOpenHistoryModal(false);
      await downloadHistory(formattedDate);
      setSnackbar({
        open: true,
        severity: "success",
        message: "CSV Téléchargé avec succès!",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        severity: "error",
        message: `Erreur lors du téléchargement: ${error.message}`,
      });
    } finally {
      setIsDownloadingHistory(false); 
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Container className={classes.container} maxWidth={false}>
      {isImportingPresence && (
        <Box className={classes.loading}>
          <CircularProgress color="primary" />
        </Box>
      )}
      {isDownloadingHistory && (
        <Box className={classes.loading}>
          <CircularProgress color="primary" />
        </Box>
      )}
      <Box className={classes.topBar}>
        <Box className={classes.titleContainer}>
          <Event />
          <Typography variant="h6" fontWeight="bold">
            Planning
          </Typography>
        </Box>
        <Box display="flex" gap={2}>
          <Button
            size="medium"
            variant="outlined"
            startIcon={<History />}
            sx={{
              "&:hover": {
                backgroundColor: (theme) => theme.palette.primary.main,
                color: "white",
                borderColor: (theme) => theme.palette.primary.main,
              },
            }}
            onClick={setOpenHistoryModal}
          >
            Télécharger Original
          </Button>
          <Button
            size="medium"
            variant="outlined"
            startIcon={<CloudDownloadRounded />}
            sx={{
              "&:hover": {
                backgroundColor: (theme) => theme.palette.primary.main,
                color: "white",
                borderColor: (theme) => theme.palette.primary.main,
              },
            }}
            onClick={handleImportPresence}
          >
            Importer présence
          </Button>
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
            onClick={() => setOpenPresenceModal(true)}
          >
            Ajouter une Présence
          </Button>
          <ThemeToggle></ThemeToggle>
        </Box>
      </Box>
      <Box className={classes.calendar}>
        {/* <StyledSchedulerFrame> */}
        <Scheduler
          key={schedulerKey} 
          isLoading={isLoading}
          data={schedulerData}
          onTileClick={(clickedTile) => {
            setSelectedTile(clickedTile);
            setOpenViewModal(true);
          }}
          config={{
            zoom: 1,
            maxRecordsPerPage: 100,
            maxRecordsPerTile: 3,
            filterButtonState: false,
            defaultTheme: isDarkMode ? "dark" : "light", 
          }}
        />
        
      </Box>
      {/* Add Presence Modal */}
      <Modal
        open={openPresenceModal}
        onClose={() => setOpenPresenceModal(false)}
      >
        <Box className={classes.modalStyle}>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography
              variant="h5"
              fontWeight="bold"
              sx={{ mb: 3 }}
              gutterBottom
            >
              Ajouter présence
            </Typography>
            <CloseIcon onClick={() => setOpenPresenceModal(false)} />
          </Box>
          <Box className={classes.contentContainer}>
            <Divider sx={{ mb: 2 }} />

            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth required variant="outlined">
                  <InputLabel>Statut</InputLabel>
                  <Select
                    label="Statut"
                    value={newPresence.status}
                    onChange={(e) =>
                      handlePresenceChange({
                        target: { name: "status", value: e.target.value },
                      })
                    }
                    name="status"
                  >
                    <MenuItem value="present">Présent</MenuItem>
                    <MenuItem value="en pause">En pause</MenuItem>
                    <MenuItem value="fin de service">Fin de service</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <Autocomplete
                  required
                  options={employees}
                  getOptionLabel={(option) =>
                    `${option.nom} ${option.prenom} (${option.matricule})`
                  }
                  onInputChange={(event, value) => setSearchTerm(value)}
                  onChange={(event, newValue) => {
                    handlePresenceChange({
                      target: {
                        name: "matricule",
                        value: newValue?.matricule || "",
                      },
                    });
                  }}
                  renderInput={(params) => (
                    <TextField
                      required
                      {...params}
                      label="Employé"
                      variant="outlined"
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateTimePicker
                    label="Date de début"
                    value={dayjs(newPresence.startDate)}
                    sx={{ width: "100%" }}
                    ampm={false}
                    onChange={(newValue) => {
                      const formattedDate = newValue.format(
                        "YYYY-MM-DDTHH:mm:ss"
                      );
                      handlePresenceChange({
                        target: { name: "startDate", value: formattedDate },
                      });
                    }}
                    slotProps={{
                      textField: {
                        error: false, 
                        helperText: "", 
                      },
                    }}
                  />
                </LocalizationProvider>
              </Grid>

              <Grid item xs={12} md={6}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateTimePicker
                    label="Date de fin"
                    value={dayjs(newPresence.endDate)}
                    sx={{ width: "100%" }}
                    ampm={false}
                    onChange={(newValue) => {
                      const formattedDate = newValue.format(
                        "YYYY-MM-DDTHH:mm:ss"
                      );
                      handlePresenceChange({
                        target: { name: "endDate", value: formattedDate },
                      });
                    }}
                    slotProps={{
                      textField: {
                        error: false, 
                        helperText: "", 
                      },
                    }}
                  />
                </LocalizationProvider>
              </Grid>

              <Grid item xs={12} md={6}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateTimePicker
                    label="Début de pause"
                    value={dayjs(newPresence.startPause)}
                    ampm={false}
                    sx={{ width: "100%" }}
                    onChange={(newValue) => {
                      const formattedDate = newValue.format(
                        "YYYY-MM-DDTHH:mm:ss"
                      );
                      handlePresenceChange({
                        target: { name: "startPause", value: formattedDate },
                      });
                    }}
                    slotProps={{
                      textField: {
                        error: false, 
                        helperText: "", 
                      },
                    }}
                  />
                </LocalizationProvider>
              </Grid>

              <Grid item xs={12} md={6}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateTimePicker
                    label="Fin de pause"
                    ampm={false}
                    value={dayjs(newPresence.endPause)}
                    sx={{ width: "100%" }}
                    onChange={(newValue) => {
                      const formattedDate = newValue.format(
                        "YYYY-MM-DDTHH:mm:ss"
                      );
                      handlePresenceChange({
                        target: { name: "endPause", value: formattedDate },
                      });
                    }}
                    slotProps={{
                      textField: {
                        error: false, 
                        helperText: "", 
                      },
                    }}
                  />
                </LocalizationProvider>
              </Grid>
            </Grid>
          </Box>
          <Box mt={3} display="flex" justifyContent="space-between">
          <Button
  variant="outlined"
  onClick={() =>
    setNewPresence(new LabelData(null, null, null, null, null, "", ""))
  }
>
  Réinitialiser
</Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddPresence}
            >
              Enregistrer
            </Button>
          </Box>
        </Box>
      </Modal>
      {/* Modal for Month and Year Selection */}
      <Modal open={openHistoryModal} onClose={() => setOpenHisotyModal(false)}>
        <Box className={classes.modalStyle}>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography
              variant="h6"
              fontWeight="bold"
              sx={{ mb: 3 }}
              gutterBottom
            >
              Sélectionner le Jour, le Mois et l'Année
            </Typography>
            <CloseIcon onClick={() => setOpenHistoryModal(false)} />
          </Box>
          <Divider sx={{ mb: 2 }} />

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              views={["year", "month", "day"]} 
              label="Date complète"
              value={selectedDate}
              onChange={(newValue) => setSelectedDate(newValue)}
              sx={{ width: "100%" }}
              format="DD/MM/YYYY"
            />
          </LocalizationProvider>
          <Box display="flex" justifyContent="space-between" mt={2}>
            <Button variant="outlined" onClick={() => setSelectedDate(null)}>
              Réinitialiser
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleDownloadHistory}
            >
              Télécharger
            </Button>
          </Box>
        </Box>
      </Modal>
      {/* Update Presence Modal */}
      <Modal open={openViewModal} onClose={() => setOpenViewModal(false)}>
        <Box className={classes.modalStyle}>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography
              variant="h5"
              fontWeight="bold"
              sx={{ mb: 3 }}
              gutterBottom
            >
              Modifier présence
            </Typography>
            <CloseIcon
              onClick={() => setOpenViewModal(false)}
              
            />
          </Box>
          <Box className={classes.contentContainer}>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateTimePicker
                    label="Date de début"
                    sx={{ width: "100%" }}
                    ampm={false}
                    value={
                      selectedTile?.startDate
                        ? dayjs(selectedTile.startDate) 
                        : null
                    }
                    onChange={(newValue) => {
                      const formattedDate = newValue.format(
                        "YYYY-MM-DDTHH:mm:ss"
                      );
                      setSelectedTile((prev) => ({
                        ...prev,
                        startDate: formattedDate,
                      }));
                    }}
                    renderInput={(params) => (
                      <TextField {...params} fullWidth />
                    )}
                  />
                </LocalizationProvider>
              </Grid>

              <Grid item xs={12} md={6}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateTimePicker
                    label="Date de fin"
                    sx={{ width: "100%" }}
                    ampm={false}
                    value={
                      selectedTile?.endDate
                        ? dayjs(selectedTile.endDate) 
                        : null
                    }
                    onChange={(newValue) => {
                      const formattedDate = newValue.format(
                        "YYYY-MM-DDTHH:mm:ss"
                      );
                      setSelectedTile((prev) => ({
                        ...prev,
                        endDate: formattedDate,
                      }));
                    }}
                    renderInput={(params) => (
                      <TextField {...params} fullWidth />
                    )}
                  />
                </LocalizationProvider>
              </Grid>

              <Grid item xs={12} md={6}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateTimePicker
                    label="Début de pause"
                    sx={{ width: "100%" }}
                    ampm={false}
                    value={
                      selectedTile?.startPause
                        ? dayjs(selectedTile.startPause)
                        : null
                    }
                    onChange={(newValue) => {
                      const formattedDate = newValue.format(
                        "YYYY-MM-DDTHH:mm:ss"
                      );
                      setSelectedTile((prev) => ({
                        ...prev,
                        startPause: formattedDate,
                      }));
                    }}
                    renderInput={(params) => (
                      <TextField {...params} fullWidth />
                    )}
                  />
                </LocalizationProvider>
              </Grid>

              <Grid item xs={12} md={6}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateTimePicker
                    label="Fin de pause"
                    sx={{ width: "100%" }}
                    ampm={false}
                    value={
                      selectedTile?.endPause
                        ? dayjs(selectedTile.endPause)
                        : null
                    }
                    onChange={(newValue) => {
                      const formattedDate = newValue.format(
                        "YYYY-MM-DDTHH:mm:ss"
                      );
                      setSelectedTile((prev) => ({
                        ...prev,
                        endPause: formattedDate,
                      }));
                    }}
                    renderInput={(params) => (
                      <TextField {...params} fullWidth />
                    )}
                  />
                </LocalizationProvider>
              </Grid>

              {/* Status and Label */}
              <Grid item xs={12} md={6}>
                <Autocomplete
                  value={selectedTile?.status || ""}
                  onChange={(event, newValue) =>
                    setSelectedTile((prev) => ({
                      ...prev,
                      status: newValue,
                    }))
                  }
                  options={[
                    "Present",
                    "En pause",
                    "En conge",
                    "Absent",
                    "Fin de service",
                    "Jour ferie",
                    "Anomalie",
                  ]}
                  renderInput={(params) => (
                    <TextField {...params} label="Status" />
                  )}
                />
              </Grid>
            </Grid>
          </Box>
          <Box mt={3} display="flex" justifyContent="space-between">
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleDeletePresence}
              sx={{
                "&:hover": {
                  color: (theme) => theme.palette.primary.main,
                  borderColor: (theme) => theme.palette.primary.main,
                },
              }}
            >
              Supprimer
            </Button>
            <Button variant="contained" onClick={handleUpdatePresence}>
              Enregistrer
            </Button>
          </Box>
        </Box>
      </Modal>
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