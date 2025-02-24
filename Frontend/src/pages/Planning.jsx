import { Scheduler } from "@y0u5s3f/custom-react-scheduler";
import "@y0u5s3f/custom-react-scheduler/dist/style.css";
import dayjs from "dayjs";
import { useState, useEffect } from "react";
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
  const classes = useStyles();

  useEffect(() => {
    const fetchLabels = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/label/labels/?stream=true");
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
                const transformedEvents = item.data.map(event => {
                  const startValue = event.start_date || event.startDate;
                  const endValue = event.end_date || event.endDate;
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
                setSchedulerData(prev => {
                  if (prev.find(existing => existing.id === transformedItem.id)) {
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
          const transformedEvents = item.data.map(event => {
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
          setSchedulerData(prev => {
            if (prev.find(existing => existing.id === transformedItem.id)) {
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
            maxRecordsPerPage: 14,
            maxRecordsPerTile: 3,
            filterButtonState: false,
            defaultTheme: "dark",
            initialDate: new Date(2025, 1, 19)
          }}
        />
      </h1>
    </div>
  );
}
