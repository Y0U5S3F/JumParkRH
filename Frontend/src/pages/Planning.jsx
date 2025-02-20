import { Scheduler } from "@bitnoi.se/react-scheduler";
import "@bitnoi.se/react-scheduler/dist/style.css";
import dayjs from "dayjs";
import { useState, useEffect, useCallback } from "react";
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
      paddingRight: "10px", // Prevents content from touching the scrollbar
      scrollbarWidth: "none", // Hides scrollbar in Firefox
      "&::-webkit-scrollbar": {
        display: "none", // Hides scrollbar in Chrome/Safari
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
    }
  }));

  const mockedSchedulerData = [
    {
      id: "070ac5b5-8369-4cd2-8ba2-0a209130cc60",
      label: {
        icon: "https://picsum.photos/24",
        title: "Joe Doe",
        subtitle: "Frontend Developer"
      },
      data: [
        {
          id: "8b71a8a5-33dd-4fc8-9caa-b4a584ba3762",
          startDate: new Date("2025-02-19T08:31:24.272Z"),
          endDate: new Date("2025-02-20T16:31:24.272Z"),
          occupancy: 3600,
          title: "Project A",
          subtitle: "Subtitle A",
          description: "array indexing Salad West Account",
          bgColor: "rgb(254,165,177)"
        }]
    }
  ];
  


export default function Planning() {
    const [open, setOpen] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const classes = useStyles();
  return (
       <div 
       style={{
        position: 'relative',
        height: '100vh',
        width: '100%',
        overflow: 'hidden',
        margin: 0,
        padding: 0,
      }}> 
        <h1>
          <Scheduler 
          isLoading={true}
          data={mockedSchedulerData} 
          onItemClick={(clickedItem) => console.log("clickedItem")}
          onTileClick={(clickedTile) => console.log("clickedTile")}
          config={
            { zoom: 1,
              maxRecordsPerPage: 4,
              filterButtonState: false,
              defaultTheme: "dark", 
            } 
          }
          />
        </h1>
      </div>
    
  );
}