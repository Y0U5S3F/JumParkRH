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
  Grid,
  TextField,
  Autocomplete,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker"; // Import DateTimePicker
import { DemoContainer } from "@mui/x-date-pickers/internals/demo"; // Import DemoContainer

import { fetchMinimalEmployes } from "../service/EmployeService";
import { addLabel } from "../service/LabelDataService"; // Import the addLabel service
import LabelData from "../models/labelData"; // Import the LabelData model

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
  const [newPresence, setNewPresence] = useState(new LabelData("", "", "", "", "", "", "")); // State for new presence
  const [searchTerm, setSearchTerm] = useState("");

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
                  const startValue = event.start_date || event.startDate;
                  const endValue = event.end_date || event.endDate;
                  const startPauseValue = event.startPause;
                  const endPauseValue = event.endPause;

                  return {
                    ...event,
                    start: dayjs(startValue).toDate(),
                    end: dayjs(endValue).toDate(),

                    // Auto-generate title: "HH:mm - HH:mm"
                    title: `${dayjs(startValue).format("HH:mm")} - ${dayjs(endValue).format("HH:mm")}`,

                    // Auto-generate description: "HH:mm - HH:mm" or "No Pause Recorded"
                    description:
                      startPauseValue && endPauseValue
                        ? `${dayjs(startPauseValue).format("HH:mm")} - ${dayjs(endPauseValue).format("HH:mm")}`
                        : "No Pause Recorded",
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
            const startValue = event.startDate || event.startDate;
            const endValue = event.endDate || event.endDate;
            return {
              ...event,
              start: dayjs(startValue).toDate(),
              end: dayjs(endValue).toDate(),
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
      const response = await addLabel(newPresence.label, presenceToSend);
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
          <Button variant="contained" onClick={() => setOpenPresenceModal(true)}>
            Ajouter Presence
          </Button>
        </Box>
        <Box className={classes.calendar}>
          <Scheduler
            isLoading={isLoading}
            data={schedulerData}
            onItemClick={(clickedItem) => console.log("clickedItem", clickedItem)}
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
          <Modal
            open={open}
            onClose={() => setOpen(false)}
            aria-labelledby="tile-details-modal"
            aria-describedby="tile-details-description"
          >
            <Box className={classes.modalStyle}>
              <Typography variant="body2">
                <strong>Start Date:</strong>{" "}
                {dayjs(selectedTile?.startDate).format("HH:mm")}
              </Typography>
              <Typography variant="body2">
                <strong>End Date:</strong>{" "}
                {dayjs(selectedTile?.endDate).format("HH:mm")}
              </Typography>
              <Divider />
              <Typography variant="body2">
                <strong>Start Pause:</strong>{" "}
                {selectedTile?.startPause
                  ? dayjs(selectedTile.startPause).format("HH:mm")
                  : "N/A"}
              </Typography>
              <Typography variant="body2">
                <strong>End Pause:</strong>{" "}
                {selectedTile?.endPause
                  ? dayjs(selectedTile.endPause).format("HH:mm")
                  : "N/A"}
              </Typography>
              <Button
                onClick={() => setOpen(false)}
                variant="contained"
                color="primary"
              >
                Close
              </Button>
            </Box>
          </Modal>

          {/* Add Presence Modal */}
          <Modal open={openPresenceModal} onClose={() => setOpenPresenceModal(false)}>
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
                    <Autocomplete
                      options={employees}
                      getOptionLabel={(option) => `${option.nom} ${option.prenom} (${option.matricule})`}
                      onInputChange={(event, value) => setSearchTerm(value)}
                      onChange={(event, newValue) => {
                        handlePresenceChange({
                          target: {
                            name: "label",
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
                    <DemoContainer components={['DateTimePicker']}>
                      <DateTimePicker
                        label="Start Date"
                        value={dayjs(newPresence.startDate)}
                        onChange={(newValue) => handlePresenceChange({ target: { name: "startDate", value: newValue.toISOString() } })}
                        renderInput={(params) => <TextField {...params} required={false} />}
                      />
                    </DemoContainer>
                  </Grid>
                  <Grid item xs={4}>
                    <DemoContainer components={['DateTimePicker']}>
                      <DateTimePicker
                        label="End Date"
                        value={dayjs(newPresence.endDate)}
                        onChange={(newValue) => handlePresenceChange({ target: { name: "endDate", value: newValue.toISOString() } })}
                        renderInput={(params) => <TextField {...params} required={false} />}
                      />
                    </DemoContainer>
                  </Grid>
                  <Grid item xs={4}>
                    <DemoContainer components={['DateTimePicker']}>
                      <DateTimePicker
                        label="Start Pause"
                        value={dayjs(newPresence.startPause)}
                        onChange={(newValue) => handlePresenceChange({ target: { name: "startPause", value: newValue.toISOString() } })}
                        renderInput={(params) => <TextField {...params} required={false} />}
                      />
                    </DemoContainer>
                  </Grid>
                  <Grid item xs={4}>
                    <DemoContainer components={['DateTimePicker']}>
                      <DateTimePicker
                        label="End Pause"
                        value={dayjs(newPresence.endPause)}
                        onChange={(newValue) => handlePresenceChange({ target: { name: "endPause", value: newValue.toISOString() } })}
                        renderInput={(params) => <TextField {...params} required={false} />}
                      />
                    </DemoContainer>
                  </Grid>
                </Grid>
              </Box>
              <Box mt={3} display="flex" justifyContent="space-between">
                <Button
                  variant="outlined"
                  onClick={() => setNewPresence(new LabelData("", "", "", "", "", "", ""))}
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