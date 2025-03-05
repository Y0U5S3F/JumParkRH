import React, { useState, useEffect } from "react";
import { Scheduler } from "@y0u5s3f/custom-react-scheduler";
import "@y0u5s3f/custom-react-scheduler/dist/style.css";
import dayjs from "dayjs";
import styled from "styled-components";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { makeStyles } from "@mui/styles";
import {
  Container,
  Button,
  Box,
  Modal,
  Typography,
  Divider,
  Snackbar,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  TextField,
  Autocomplete,
} from "@mui/material";
import { fetchMinimalEmployes } from "../service/EmployeService";
import { addLabel, updateLabel, deleteLabel } from "../service/LabelDataService"; // Import the addLabel service
import LabelData from "../models/labelData"; // Import the LabelData model
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker"; // Import DateTimePicker

// Create a styled container for the Scheduler
const StyledSchedulerFrame = styled.div`
  height: 100vh;
  width: 100%;
  overflow: auto;
  position: relative;
  font-weight: bold;
`;

const useStyles = makeStyles((theme) => ({
  container: { padding: "20px", display: "flex", flexDirection: "column" },
  topBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "10px",
  },
  calendar: {
    position: "relative",
    height: "100vh",
    width: "100%",
    overflow: "hidden",
    border: `2px solid rgb(61, 61, 61)`, // You can replace this with any color you want
    borderRadius: "12px", // Adjust the border-radius as needed
  },
  modalStyle: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 1000,
    height: 350,
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
  schedulerDayCell: {
    width: "150px !important",
  },
}));

export default function SimpleCalendar() {
  const [schedulerData, setSchedulerData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTile, setSelectedTile] = useState(null);
  const [openPresenceModal, setOpenPresenceModal] = useState(false); // State for presence modal
  const [openViewModal, setOpenViewModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null); // State for selected item
  const classes = useStyles();
  const [newPresence, setNewPresence] = useState(
    new LabelData(null, null, null, null, null, null, null)
  ); // State for new presence
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: "",
    message: "",
  });

  useEffect(() => {
    const fetchLabels = async () => {
      try {
        const response = await fetch(
          "http://127.0.0.1:8000/api/label/labels/?stream=true"
        );
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        const statusColorMapping = {
          Present: "#2A9D8F", // Teal green
          "En Pause": "#F4A261", // Warm orange
          "En Conge": "#9B5DE5", // Soft purple
          Absent: "#E63946", // Warm red
          "Fin de Service": "#457B9D", // Muted blue
          Anomalie: "#6D6875", // Warm gray
          "Jour Ferie": "#B0A8B9", // Soft neutral gray
        };

        // Helper function to transform each streamed item
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
                  ? `${event.startPause ? formatTime(event.startPause) : ""}${event.startPause && event.endPause ? " - " : ""}${event.endPause ? formatTime(event.endPause) : ""}`
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
          buffer = lines.pop(); // Save last incomplete line
          for (const line of lines) {
            if (line.trim()) {
              try {
                const item = JSON.parse(line);
                const transformedItem = transformItem(item);
                // Append the new item to schedulerData if it doesn't already exist
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
                console.error("Error parsing JSON:", e);
              }
            }
          }
        }
        // Handle any remaining buffered content.
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
            console.error("Error parsing final JSON:", e);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
      setIsLoading(false);
    };

    fetchLabels();
  }, []);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const employeesData = await fetchMinimalEmployes();
        setEmployees(employeesData);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };

    fetchEmployees();
  }, []);

  const handleItemClick = (item) => {
    setSelectedItem(item);
    setOpenViewModal(true);
  };

  const handlePresenceChange = (e) => {
    const { name, value } = e.target;
    setNewPresence((prev) => ({ ...prev, [name]: value }));
    console.log(newPresence);
  };

  const handleAddPresence = async () => {
    try {
      const presenceToSend = {
        startDate: newPresence.startDate,
        endDate: newPresence.endDate,
        startPause: newPresence.startPause,
        endPause: newPresence.endPause,
        status: newPresence.status,
        label: newPresence.label,
      };
      console.log("Sending data:", presenceToSend);
      const response = await addLabel(newPresence.matricule, presenceToSend);
      console.log("Response:", response);
      setSnackbar({
        open: true,
        severity: "success",
        message: "Présence ajoutée avec succès!",
      });
      setOpenPresenceModal(false);
      setRefresh((prev) => prev + 1); // Trigger re-fetch
    } catch (error) {
      setSnackbar({
        open: true,
        severity: "error",
        message: `Erreur lors de l'ajout de la présence.${error}`,
      });
      console.error("Error adding presence:", error);
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
      console.log("Updating data:", presenceToUpdate);
      const response = await updateLabel(selectedTile.id, presenceToUpdate);
      console.log("Response:", response);
      setSnackbar({
        open: true,
        severity: "success",
        message: "Présence mise à jour avec succès!",
      });
      setOpenViewModal(false);
      setRefresh((prev) => prev + 1); // Trigger re-fetch
    } catch (error) {
      setSnackbar({
        open: true,
        severity: "error",
        message: `Erreur lors de la mise à jour de la présence.${error}`,
      });
      console.error("Error updating presence:", error);
    }
  };

  const handleDeletePresence = async () => {
    try {
      const response = await deleteLabel(selectedTile.id);
      console.log("Response:", response);
      setSnackbar({
        open: true,
        severity: "success",
        message: "Présence supprimée avec succès!",
      });
      setOpenViewModal(false);
      setRefresh((prev) => prev + 1); // Trigger re-fetch
    } catch (error) {
      setSnackbar({
        open: true,
        severity: "error",
        message: `Erreur lors de la suppression de la présence.${error}`,
      });
      console.error("Error deleting presence:", error);
    }
  };

  return (
    <Container className={classes.container}>
      <Box className={classes.topBar}>
        <Typography variant="h5">Calendar</Typography>
        <Button variant="contained" onClick={() => setOpenPresenceModal(true)}>
          Ajouter Jour Férié
        </Button>
      </Box>
      <Box sx={{ border: "1px solid black", borderRadius: "20px" }}>
        <StyledSchedulerFrame>
          <Scheduler
            isLoading={isLoading}
            data={schedulerData}
            onItemClick={handleItemClick}
            onTileClick={(clickedTile) => {
              console.log("clickedTile", clickedTile);
              setSelectedTile(clickedTile);
              setOpenViewModal(true);
            }}
            config={{
              zoom: 1,
              maxRecordsPerPage: 100,
              maxRecordsPerTile: 3,
              filterButtonState: false,
              defaultTheme: "dark",
            }}
          />
        </StyledSchedulerFrame>
      </Box>
      {/* Add Presence Modal */}
      <Modal
        open={openPresenceModal}
        onClose={() => setOpenPresenceModal(false)}
      >
        <Box className={classes.modalStyle}>
          <Typography variant="h6" gutterBottom>
            Veuillez saisir les coordonnées de la présence
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Box className={classes.contentContainer}>
            <Typography variant="body1" gutterBottom>
              Informations de la présence
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <FormControl fullWidth variant="outlined">
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
              <Grid item xs={4}>
                <Autocomplete
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
                    <TextField {...params} label="Employé" variant="outlined" />
                  )}
                />
              </Grid>
              <Grid item xs={4}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateTimePicker
                    label="Start Date"
                    value={dayjs(newPresence.startDate)}
                    sx={{ width: "100%" }}
                    ampm={false}
                    onChange={(newValue) => {
                      // Format the start date before sending it to the backend
                      const formattedDate = newValue.format(
                        "YYYY-MM-DDTHH:mm:ss"
                      );
                      handlePresenceChange({
                        target: { name: "startDate", value: formattedDate },
                      });
                    }}
                    slotProps={{
                      textField: {
                        error: false, // Disable automatic error validation
                        helperText: "", // No error message
                      },
                    }}
                  />
                </LocalizationProvider>
              </Grid>

              <Grid item xs={4}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateTimePicker
                    label="End Date"
                    value={dayjs(newPresence.endDate)}
                    sx={{ width: "100%" }}
                    ampm={false}
                    onChange={(newValue) => {
                      // Format the end date before sending it to the backend
                      const formattedDate = newValue.format(
                        "YYYY-MM-DDTHH:mm:ss"
                      );
                      handlePresenceChange({
                        target: { name: "endDate", value: formattedDate },
                      });
                    }}
                    slotProps={{
                      textField: {
                        error: false, // Disable automatic error validation
                        helperText: "", // No error message
                      },
                    }}
                  />
                </LocalizationProvider>
              </Grid>

              <Grid item xs={4}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateTimePicker
                    label="Start Pause"
                    value={dayjs(newPresence.startPause)}
                    ampm={false}
                    sx={{ width: "100%" }}
                    onChange={(newValue) => {
                      // Format the start pause date before sending it to the backend
                      const formattedDate = newValue.format(
                        "YYYY-MM-DDTHH:mm:ss"
                      );
                      handlePresenceChange({
                        target: { name: "startPause", value: formattedDate },
                      });
                    }}
                    slotProps={{
                      textField: {
                        error: false, // Disable automatic error validation
                        helperText: "", // No error message
                      },
                    }}
                  />
                </LocalizationProvider>
              </Grid>

              <Grid item xs={4}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateTimePicker
                    label="End Pause"
                    ampm={false}
                    value={dayjs(newPresence.endPause)}
                    sx={{ width: "100%" }}
                    onChange={(newValue) => {
                      // Format the end pause date before sending it to the backend
                      const formattedDate = newValue.format(
                        "YYYY-MM-DDTHH:mm:ss"
                      );
                      handlePresenceChange({
                        target: { name: "endPause", value: formattedDate },
                      });
                    }}
                    slotProps={{
                      textField: {
                        error: false, // Disable automatic error validation
                        helperText: "", // No error message
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
              onClick={() => setNewPresence(new LabelData())}
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
      {/* Update Presence Modal */}
      <Modal open={openViewModal} onClose={() => setOpenViewModal(false)}>
        <Box className={classes.modalStyle}>
          {/* Form Inputs for the selected tile */}
          <Typography variant="h6" gutterBottom>
            Veuillez modifier les coordonnées de la présence
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Box className={classes.contentContainer}>
            <Typography variant="body1" gutterBottom>
              Informations de la présence
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              {/* Example for start and end date inputs */}
              <Grid item xs={4}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateTimePicker
                    label="Start Date"
                    sx={{ width: "100%" }}
                    ampm={false}
                    value={
                      selectedTile?.startDate
                        ? dayjs(selectedTile.startDate) // Adjust for time zone
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
                      console.log(selectedTile);
                    }}
                    renderInput={(params) => (
                      <TextField {...params} fullWidth />
                    )}
                  />
                </LocalizationProvider>
              </Grid>

              <Grid item xs={4}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateTimePicker
                    label="End Date"
                    sx={{ width: "100%" }}
                    ampm={false}
                    value={
                      selectedTile?.endDate
                        ? dayjs(selectedTile.endDate) // Adjust for time zone
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
                      console.log(selectedTile);
                    }}
                    renderInput={(params) => (
                      <TextField {...params} fullWidth />
                    )}
                  />
                </LocalizationProvider>
              </Grid>

              {/* Example for pause start and end */}
              <Grid item xs={4}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateTimePicker
                    label="Start Pause"
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
                      console.log(selectedTile);
                    }}
                    renderInput={(params) => (
                      <TextField {...params} fullWidth />
                    )}
                  />
                </LocalizationProvider>
              </Grid>

              <Grid item xs={4}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateTimePicker
                    label="End Pause"
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
                      console.log(selectedTile);
                    }}
                    renderInput={(params) => (
                      <TextField {...params} fullWidth />
                    )}
                  />
                </LocalizationProvider>
              </Grid>

              {/* Status and Label */}
              <Grid item xs={4}>
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
          <Box className={classes.topBar}>
          <Button variant="outlined" color="secondary" onClick={handleDeletePresence}>
    Supprimer
  </Button>
            <Button variant="contained" onClick={handleUpdatePresence}>
              Enregistrer
            </Button>
            
          </Box>
        </Box>
      </Modal>
    </Container>
  );
}
