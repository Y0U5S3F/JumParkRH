import { Scheduler } from "@y0u5s3f/custom-react-scheduler";
import "@y0u5s3f/custom-react-scheduler/dist/style.css";
import dayjs from "dayjs";
import { useState, useEffect } from "react";
import {
  Container,
  Button,
  Box,
  Modal,
  Typography,
  Divider,
  Snackbar,
  Select, MenuItem, FormControl, InputLabel,
  Grid,
  TextField,
  Autocomplete,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import utc from "dayjs-plugin-utc";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker"; // Import DateTimePicker
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";

import { fetchMinimalEmployes } from "../service/EmployeService";
import { addLabel } from "../service/LabelDataService"; // Import the addLabel service
import LabelData from "../models/labelData"; // Import the LabelData model

dayjs.extend(utc);

const useStyles = makeStyles((theme) => ({
  container: { padding: "20px", display: "flex", flexDirection: "column" },
  topBar: {
    display: "flex",
    justifyContent: "flex-end",
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

export default function Planning() {
  const [schedulerData, setSchedulerData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const classes = useStyles();
  const [selectedTile, setSelectedTile] = useState(null);
  const [open, setOpen] = useState(false);
  const [openPresenceModal, setOpenPresenceModal] = useState(false); // State for presence modal
  const [employees, setEmployees] = useState([]);
  const [newPresence, setNewPresence] = useState(
    new LabelData("", "", "", "", "", "", "")
  ); // State for new presence
  const [searchTerm, setSearchTerm] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: "",
    message: "",
  });
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const fetchLabels = async () => {
      try {
        const response = await fetch(
          "http://127.0.0.1:8000/api/label/labels/?stream=true"
        );
        const reader = response.body.getReader();
        const decoder = new TextDecoder("utf-8");
        let done = false;
        let buffer = "";

        while (!done) {
          const { value, done: doneReading } = await reader.read();
          done = doneReading;
          if (value) {
            buffer += decoder.decode(value, { stream: !done });
            let lines = buffer.split("\n");
            buffer = lines.pop();
            lines.forEach((line) => {
              if (line.trim()) {
                const item = JSON.parse(line);
                const transformedEvents = item.data.map((event) => {
                  const formatDate = (dateString) => {
                    if (!dateString) return null;
                    return dayjs(dateString)
                      .utc()
                      .add(1, "hour") // Convert to UTC+1 (Tunisia time)
                      .format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");
                  };

                  return {
                    ...event,
                    startDate: formatDate(event.startDate),
                    endDate: formatDate(event.endDate),
                    startPause: formatDate(event.startPause),
                    endPause: formatDate(event.endPause),
                    occupancy: 0, // Default value
                    title: dayjs(event.startDate).format("HH:mm"), // Start time as title
                    subtitle: dayjs(event.endDate).format("HH:mm"), // End time as subtitle
                    description:
                      event.startPause && event.endPause
                        ? `${dayjs(event.startPause).format("HH:mm")} - ${dayjs(event.endPause).format("HH:mm")}`
                        : "No Pause Recorded",
                    bg_color:
                      {
                        1: "#4CAF50", // Present (Green)
                        2: "#FFC107", // En pause (Amber)
                        3: "#2196F3", // En congé (Blue)
                        4: "#F44336", // Absent (Red)
                        5: "#9C27B0", // Fin de service (Purple)
                        6: "#FF5722", // Anomalie (Deep Orange)
                        7: "#607D8B", // Jour férié (Blue Grey),
                      }[event.status] || "#4CAF50", // Default color if status not found
                  };
                });

                const transformedItem = {
                  id: item.id,
                  label: {
                    title: item.title,
                    subtitle: item.subtitle,
                  },
                  data: transformedEvents,
                };
                setSchedulerData((prev) => {
                  if (
                    prev.find((existing) => existing.id === transformedItem.id)
                  ) {
                    return prev;
                  }
                  return [...prev, transformedItem];
                });
              }
            });
          }
        }
        if (buffer.trim()) {
          const item = JSON.parse(buffer);
          const transformedEvents = item.data.map((event) => {
            const formatDate = (dateString) => {
              if (!dateString) return null;
              return dayjs(dateString)
                .utc()
                .add(1, "hour") // Convert to UTC+1 (Tunisia time)
                .format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");
            };

            return {
              ...event,
              startDate: formatDate(event.startDate),
              endDate: formatDate(event.endDate),
              startPause: formatDate(event.startPause),
              endPause: formatDate(event.endPause),
              occupancy: 0, // Default value
              title: dayjs(event.startDate).format("HH:mm"), // Start time as title
              subtitle: dayjs(event.endDate).format("HH:mm"), // End time as subtitle
              description:
                event.startPause && event.endPause
                  ? `${dayjs(event.startPause).format("HH:mm")} - ${dayjs(event.endPause).format("HH:mm")}`
                  : "No Pause Recorded",
              bg_color:
                {
                  1: "#4CAF50", // Present (Green)
                  2: "#FFC107", // En pause (Amber)
                  3: "#2196F3", // En congé (Blue)
                  4: "#F44336", // Absent (Red)
                  5: "#9C27B0", // Fin de service (Purple)
                  6: "#FF5722", // Anomalie (Deep Orange)
                  7: "#607D8B", // Jour férié (Blue Grey),
                }[event.status] || "#4CAF50", // Default color if status not found
            };
          });
          const transformedItem = {
            id: item.id,
            label: {
              title: item.title,
              subtitle: item.subtitle,
            },
            data: transformedEvents,
          };
          setSchedulerData((prev) => {
            if (prev.find((existing) => existing.id === transformedItem.id)) {
              return prev;
            }
            return [...prev, transformedItem];
          });
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data", error);
        setIsLoading(false);
      }
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

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Container className={classes.container}>
        <Box className={classes.topBar}>
          <Button
            variant="contained"
            onClick={() => setOpenPresenceModal(true)}
          >
            Ajouter Presence
          </Button>
        </Box>
        <Box className={classes.calendar}>
          <Scheduler
            isLoading={isLoading}
            data={schedulerData}
            onItemClick={(clickedItem) =>
              console.log("clickedItem", clickedItem)
            }
            onTileClick={(clickedTile) => {
              console.log("clickedTile", clickedTile);
              setSelectedTile(clickedTile);
              setOpen(true);
            }}
            config={{
              zoom: 1,
              maxRecordsPerPage: 14,
              maxRecordsPerTile: 3,
              filterButtonState: false,
              defaultTheme: "dark",
              initialDate: new Date(2025, 1, 19),
            }}
          />

          {/* Update Presence Modal */}
          <Modal open={open} onClose={() => setOpen(false)}>
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
                    <DateTimePicker
                      label="Start Date"
                      sx={{ width: "100%" }}
                      ampm={false}
                      value={
                        selectedTile?.startDate
                          ? dayjs(selectedTile.startDate).subtract(1, "hour") // Adjust for time zone
                          : null
                      }
                      onChange={(newValue) =>{
                        setSelectedTile((prev) => ({
                          ...prev,
                          startDate: newValue,
                        }));
                        console.log(selectedTile);
                      }}
                      renderInput={(params) => (
                        <TextField {...params} fullWidth />
                      )}
                    />
                  </Grid>

                  <Grid item xs={4}>
                    <DateTimePicker
                      label="End Date"
                      sx={{ width: "100%" }}
                      ampm={false}
                      value={
                        selectedTile?.endDate
                          ? dayjs(selectedTile.endDate).subtract(1, "hour") // Adjust for time zone
                          : null
                      }
                      onChange={(newValue) =>{
                        setSelectedTile((prev) => ({
                          ...prev,
                          endDate: newValue,
                        }));
                        console.log(selectedTile);

                      }}
                      renderInput={(params) => (
                        <TextField {...params} fullWidth />
                      )}
                    />
                  </Grid>

                  {/* Example for pause start and end */}
                  <Grid item xs={4}>
                    <DateTimePicker
                      label="Start Pause"
                      sx={{ width: "100%" }}
                      ampm={false}
                      value={
                        selectedTile?.startPause
                          ? dayjs(selectedTile.startPause).subtract(1, "hour")
                          : null
                      }
                      onChange={(newValue) =>{
                        setSelectedTile((prev) => ({
                          ...prev,
                          startPause: newValue,
                        }));
                        console.log(selectedTile);

                      }}
                      renderInput={(params) => (
                        <TextField {...params} fullWidth />
                      )}
                    />
                  </Grid>

                  <Grid item xs={4}>
                    <DateTimePicker
                      label="End Pause"
                      sx={{ width: "100%" }}
                      ampm={false}
                      value={
                        selectedTile?.endPause
                          ? dayjs(selectedTile.endPause).subtract(1, "hour")
                          : null
                      }
                      onChange={(newValue) =>{
                        setSelectedTile((prev) => ({
                          ...prev,
                          endPause: newValue,
                        }));
                        console.log(selectedTile);

                      }}
                      renderInput={(params) => (
                        <TextField {...params} fullWidth />
                      )}
                    />
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
                        "Présent",
                        "En pause",
                        "En congé",
                        "Absent",
                        "Autre",
                      ]}
                      renderInput={(params) => (
                        <TextField {...params} label="Status" />
                      )}
                    />
                  </Grid>
                </Grid>
              </Box>
              <Box className={classes.topBar}>
                <Button variant="contained" onClick={handleAddPresence}>
                  Enregistrer
                </Button>
              </Box>
            </Box>
          </Modal>

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
                        <TextField
                          {...params}
                          label="Employé"
                          variant="outlined"
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <DateTimePicker
                      label="Start Date"
                      value={dayjs.utc(newPresence.startDate)}
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
                  </Grid>

                  <Grid item xs={4}>
                    <DateTimePicker
                      label="End Date"
                      value={dayjs.utc(newPresence.endDate)}
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
                  </Grid>

                  <Grid item xs={4}>
                    <DateTimePicker
                      label="Start Pause"
                      value={dayjs.utc(newPresence.startPause)}
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
                  </Grid>

                  <Grid item xs={4}>
                    <DateTimePicker
                      label="End Pause"
                      ampm={false}
                      value={dayjs.utc(newPresence.endPause)}
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
        </Box>
      </Container>
    </LocalizationProvider>
  );
}
