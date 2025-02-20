import { Scheduler } from "@bitnoi.se/react-scheduler";
import "@bitnoi.se/react-scheduler/dist/style.css";
import dayjs from "dayjs";
<<<<<<< HEAD
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
    
=======
import { useState, useCallback } from "react";

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
        startDate: new Date("2023-04-13T15:31:24.272Z"),
        endDate: new Date("2023-08-28T10:28:22.649Z"),
        occupancy: 3600,
        title: "Project A",
        subtitle: "Subtitle A",
        description: "array indexing Salad West Account",
        bgColor: "rgb(254,165,177)"
      },
      {
        id: "22fbe237-6344-4c8e-affb-64a1750f33bd",
        startDate: new Date("2023-10-07T08:16:31.123Z"),
        endDate: new Date("2023-11-15T21:55:23.582Z"),
        occupancy: 2852,
        title: "Project B",
        subtitle: "Subtitle B",
        description: "Tuna Home pascal IP drive",
        bgColor: "rgb(254,165,177)"
      },
      {
        id: "3601c1cd-f4b5-46bc-8564-8c983919e3f5",
        startDate: new Date("2023-03-30T22:25:14.377Z"),
        endDate: new Date("2023-09-01T07:20:50.526Z"),
        occupancy: 1800,
        title: "Project C",
        subtitle: "Subtitle C",
        bgColor: "rgb(254,165,177)"
      },
      {
        id: "b088e4ac-9911-426f-aef3-843d75e714c2",
        startDate: new Date("2023-10-28T10:08:22.986Z"),
        endDate: new Date("2023-10-30T12:30:30.150Z"),
        occupancy: 11111,
        title: "Project D",
        subtitle: "Subtitle D",
        description: "Garden heavy an software Metal",
        bgColor: "rgb(254,165,177)"
      }
    ]
  },
  {
    id: "1a2b3c4d-5678-90ab-cdef-1234567890ab",
    label: {
      icon: "https://picsum.photos/24",
      title: "Alice Smith",
      subtitle: "Backend Developer"
    },
    data: [
      {
        id: "2b3c4d5e-6789-0abc-def1-234567890abc",
        startDate: new Date("2023-05-01T10:00:00.000Z"),
        endDate: new Date("2023-07-15T15:00:00.000Z"),
        occupancy: 4200,
        title: "Project X",
        subtitle: "Subtitle X",
        description: "Database optimization and API integration",
        bgColor: "rgb(180,200,255)"
      },
      {
        id: "3c4d5e6f-7890-1bcd-ef12-34567890abcd",
        startDate: new Date("2023-09-10T12:00:00.000Z"),
        endDate: new Date("2023-10-05T18:00:00.000Z"),
        occupancy: 3000,
        title: "Project Y",
        subtitle: "Subtitle Y",
        description: "Backend refactoring for scalability",
        bgColor: "rgb(180,200,255)"
      }
    ]
  },
  {
    id: "4d5e6f7a-8901-2cde-f123-4567890abcde",
    label: {
      icon: "https://picsum.photos/24",
      title: "Bob Johnson",
      subtitle: "Fullstack Developer"
    },
    data: [
      {
        id: "5e6f7a8b-9012-3def-1234-567890abcdef",
        startDate: new Date("2023-06-15T09:30:00.000Z"),
        endDate: new Date("2023-09-30T17:30:00.000Z"),
        occupancy: 5000,
        title: "Project Z",
        subtitle: "Subtitle Z",
        description: "Full-stack development of new features",
        bgColor: "rgb(200,150,255)"
      },
      {
        id: "6f7a8b9c-0123-4efa-2345-67890abcdef1",
        startDate: new Date("2023-11-01T08:00:00.000Z"),
        endDate: new Date("2023-11-20T20:00:00.000Z"),
        occupancy: 2600,
        title: "Project W",
        subtitle: "Subtitle W",
        description: "Implementing responsive design and performance improvements",
        bgColor: "rgb(200,150,255)"
      }
    ]
  },
  {
    id: "7a8b9c0d-1234-5ef0-3456-7890abcdef12",
    label: {
      icon: "https://picsum.photos/24",
      title: "Carol White",
      subtitle: "UI/UX Designer"
    },
    data: [
      {
        id: "8b9c0d1e-2345-6f01-4567-890abcdef123",
        startDate: new Date("2023-07-20T11:00:00.000Z"),
        endDate: new Date("2023-08-25T16:00:00.000Z"),
        occupancy: 3200,
        title: "Project Design",
        subtitle: "Subtitle Design",
        description: "Creating intuitive designs and user flows",
        bgColor: "rgb(255,200,150)"
      },
      {
        id: "9c0d1e2f-3456-7f12-5678-90abcdef1234",
        startDate: new Date("2023-12-05T09:00:00.000Z"),
        endDate: new Date("2023-12-25T17:00:00.000Z"),
        occupancy: 2800,
        title: "Project Redesign",
        subtitle: "Subtitle Redesign",
        description: "Revamping existing UI for better user experience",
        bgColor: "rgb(255,200,150)"
      }
    ]
  }
];


export default function Planning() {
  return (
    <div>
      <h1>
        <Scheduler 
        isLoading={true}
        data={mockedSchedulerData} 
        onItemClick={(clickedItem) => console.log("clickedItem")}
        onTileClick={(clickedTile) => console.log("clickedTile")}
        config={
          {zoom: 1, maxRecordsPerPage: 4 , filterButtonState: false}
        }
        />
      </h1>
    </div>
>>>>>>> c921bad02067034bd4c55a4a47fcf5a0f91428a2
  );
}