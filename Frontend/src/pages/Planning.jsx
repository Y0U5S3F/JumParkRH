import { Scheduler } from "@bitnoi.se/react-scheduler";
import "@bitnoi.se/react-scheduler/dist/style.css";
import dayjs from "dayjs";
import { useState, useEffect } from "react";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import {
  Container,
  Button,
  Box,
  IconButton,
  Modal,
  Typography,
  Divider,
  Grid
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import VisibilityIcon from '@mui/icons-material/Visibility';
import Emploi from "../models/emploi";

const useStyles = makeStyles((theme) => ({
  container: { padding: "20px", display: "flex", flexDirection: "column" },
  topBar: {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: "10px",
  },
  modalStyle: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 1000,
    height: 150,
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
  const [open, setOpen] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const classes = useStyles();

  useEffect(() => {
    const fetchLabels = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/label/labels/");
        const data = response.data;
        
        // Transform the data into the format expected by the Scheduler
        const transformedData = data.map((item) => ({
          id: item.id,
          label: {
            title: item.title,
            subtitle: item.subtitle,
          },
          data: item.data, // Use the full data array from the API
        }));
  
        setSchedulerData(transformedData);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data", error);
        setIsLoading(false);
      }
    };
  
    fetchLabels();
  }, []); // Runs only once when the component mounts

  return (
    <div 
      style={{
        position: 'relative',
        height: '100vh',
        width: '100%',
        overflow: 'hidden',
        margin: 0,
        padding: 0,
      }}
    > 
      <h1>
        <Scheduler 
          isLoading={isLoading}
          data={schedulerData} 
          onItemClick={(clickedItem) => console.log("clickedItem", clickedItem)}
          onTileClick={(clickedTile) => console.log("clickedTile", clickedTile)}
          config={{
            zoom: 1,
            maxRecordsPerPage: 13,
            maxRecordsPerTile: 3,
            filterButtonState: false,
            defaultTheme: "dark", 
          }}
        />
      </h1>
    </div>
  );
}
